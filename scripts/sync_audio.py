#!/usr/bin/env python3
"""
Incremental audio sync for Farsi Now (ElevenLabs edition).

Generates word and letter audio files from source data, but only when needed:
- file is missing, or
- text changed, or
- ElevenLabs config changed, or
- --force is used.

Data sources (defaults):
- words: src/data/levels.ts
- letters: src/utils/transliteration.ts

Usage examples:
  python3 scripts/sync_audio.py --dry-run
  ELEVENLABS_API_KEY=... python3 scripts/sync_audio.py
  ELEVENLABS_API_KEY=... python3 scripts/sync_audio.py --force
  ELEVENLABS_API_KEY=... python3 scripts/sync_audio.py --clean-stale
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import os
import re
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple


DEFAULT_LEVELS_FILE = "src/data/levels.ts"
DEFAULT_TRANSLIT_FILE = "src/utils/transliteration.ts"
DEFAULT_AUDIO_DIR = "public/assets/audio"
DEFAULT_MANIFEST = ".tts-sync-manifest.json"
DEFAULT_ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1"
# Same default as the old Supabase edge function in this repo.
DEFAULT_ELEVENLABS_VOICE_ID = "cgSgspJ2msm6clMCkdW9"  # Jessica - playful young girl
DEFAULT_ELEVENLABS_MODEL_ID = "eleven_v3"
DEFAULT_ELEVENLABS_OUTPUT_FORMAT = "mp3_44100_128"
DEFAULT_LANGUAGE_CODE = "fa"
DEFAULT_VOICE_SETTINGS = {
    "stability": 0.15,
    "similarity_boost": 0.75,
    "style": 0.95,
    "use_speaker_boost": True,
    "speed": 1.15,
}


@dataclass(frozen=True)
class AudioItem:
    kind: str  # "word" | "letter"
    text: str
    rel_path: str  # relative to audio dir
    hash: str

    @property
    def key(self) -> str:
        return f"{self.kind}::{self.text}"


def load_dotenv_file(dotenv_path: Path) -> None:
    if not dotenv_path.exists():
        return
    for raw_line in dotenv_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[len("export "):].strip()
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not key:
            continue
        if value and ((value[0] == value[-1]) and value[0] in ("'", '"')):
            value = value[1:-1]
        os.environ.setdefault(key, value)


def get_audio_asset_stem(value: str) -> str:
    trimmed = value.strip()
    if not trimmed:
        return ""
    if re.match(r"^[A-Za-z0-9_-]+$", trimmed):
        return trimmed
    return "-".join(f"u{ord(ch):04x}" for ch in trimmed)


def decode_ts_string(raw: str) -> str:
    # raw is the inside of a TS double-quoted string.
    return json.loads(f"\"{raw}\"")


def extract_words_from_levels_ts(path: Path) -> List[str]:
    text = path.read_text(encoding="utf-8")
    matches = re.findall(r'word:\s*"((?:\\.|[^"\\])*)"', text)
    words = [decode_ts_string(m).strip() for m in matches]
    unique: List[str] = []
    seen = set()
    for w in words:
        if w and w not in seen:
            seen.add(w)
            unique.append(w)
    return unique


def extract_letters_from_transliteration_ts(path: Path) -> List[str]:
    text = path.read_text(encoding="utf-8")
    map_match = re.search(
        r"const\s+transliterationMap\s*:\s*Record<[^>]+>\s*=\s*{(?P<body>.*?)};",
        text,
        re.DOTALL,
    )
    if not map_match:
        raise ValueError(f"Could not locate transliterationMap in {path}")
    body = map_match.group("body")
    letters: List[str] = []
    for line in body.splitlines():
        line = line.strip()
        if not line or line.startswith("//"):
            continue
        m = re.match(r'^"((?:\\.|[^"\\])*)"\s*:\s*"', line)
        if m:
            letters.append(decode_ts_string(m.group(1)).strip())
            continue
        m = re.match(r"^([^\s:'\"]+)\s*:\s*\"", line)
        if m:
            letters.append(m.group(1).strip())

    unique: List[str] = []
    seen = set()
    for l in letters:
        if l and l not in seen:
            seen.add(l)
            unique.append(l)
    return unique


def content_hash(engine_sig: str, kind: str, text: str) -> str:
    payload = f"{engine_sig}\n{kind}\n{text}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def build_items(words: List[str], letters: List[str], engine_sig: str) -> List[AudioItem]:
    items: List[AudioItem] = []
    for w in words:
        stem = get_audio_asset_stem(w)
        items.append(
            AudioItem(
                kind="word",
                text=w,
                rel_path=f"{stem}.mp3",
                hash=content_hash(engine_sig, "word", w),
            )
        )
    for l in letters:
        stem = get_audio_asset_stem(l)
        items.append(
            AudioItem(
                kind="letter",
                text=l,
                rel_path=f"letters/{stem}.mp3",
                hash=content_hash(engine_sig, "letter", l),
            )
        )
    return items


def load_manifest(manifest_path: Path) -> Dict:
    if not manifest_path.exists():
        return {"version": 1, "items": {}}
    try:
        return json.loads(manifest_path.read_text(encoding="utf-8"))
    except Exception:
        return {"version": 1, "items": {}}


def needs_generation(
    item: AudioItem,
    previous_items: Dict[str, Dict],
    audio_dir: Path,
    force: bool,
    missing_only: bool,
) -> Tuple[bool, str]:
    output_path = audio_dir / item.rel_path
    if force:
        return True, "force"
    if not output_path.exists() or output_path.stat().st_size < 2000:
        return True, "missing_or_too_small"
    if missing_only:
        return False, "exists_skip_missing_only"
    prev = previous_items.get(item.key)
    if not prev:
        return False, "existing_file_no_manifest"
    if prev.get("hash") != item.hash:
        return True, "content_changed"
    return False, "up_to_date"


def elevenlabs_synthesize(
    *,
    api_key: str,
    base_url: str,
    voice_id: str,
    model_id: str,
    output_format: str,
    language_code: str,
    voice_settings: Dict,
    text: str,
    timeout_seconds: int = 60,
) -> bytes:
    url = f"{base_url}/text-to-speech/{voice_id}?output_format={output_format}"
    payload = {
        "text": text,
        "model_id": model_id,
        "language_code": language_code,
        "voice_settings": voice_settings,
    }
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout_seconds) as resp:
        return resp.read()


async def generate_item(
    item: AudioItem,
    out_path: Path,
    semaphore: asyncio.Semaphore,
    elevenlabs_cfg: Dict,
) -> Tuple[AudioItem, bool, str]:
    async with semaphore:
        try:
            out_path.parent.mkdir(parents=True, exist_ok=True)
            audio_bytes = await asyncio.to_thread(
                elevenlabs_synthesize,
                api_key=elevenlabs_cfg["api_key"],
                base_url=elevenlabs_cfg["base_url"],
                voice_id=elevenlabs_cfg["voice_id"],
                model_id=elevenlabs_cfg["model_id"],
                output_format=elevenlabs_cfg["output_format"],
                language_code=elevenlabs_cfg["language_code"],
                voice_settings=elevenlabs_cfg["voice_settings"],
                text=item.text,
            )
            if len(audio_bytes) == 0:
                return item, False, "generated file is empty"
            out_path.write_bytes(audio_bytes)
            return item, True, ""
        except urllib.error.HTTPError as exc:
            details = ""
            try:
                details = exc.read().decode("utf-8", errors="replace")
            except Exception:
                details = str(exc)
            return item, False, f"HTTP {exc.code}: {details[:500]}"
        except urllib.error.URLError as exc:
            return item, False, f"Network error: {exc}"
        except Exception as exc:  # pragma: no cover
            return item, False, str(exc)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Incremental word/letter audio sync")
    parser.add_argument("--levels-file", default=DEFAULT_LEVELS_FILE, help="Path to levels.ts")
    parser.add_argument("--translit-file", default=DEFAULT_TRANSLIT_FILE, help="Path to transliteration.ts")
    parser.add_argument("--audio-dir", default=DEFAULT_AUDIO_DIR, help="Output audio directory")
    parser.add_argument("--manifest-name", default=DEFAULT_MANIFEST, help="Manifest filename inside audio dir")
    parser.add_argument("--elevenlabs-base-url", default=DEFAULT_ELEVENLABS_BASE_URL, help="ElevenLabs API base URL")
    parser.add_argument("--voice-id", default=DEFAULT_ELEVENLABS_VOICE_ID, help="ElevenLabs voice ID")
    parser.add_argument("--model-id", default=DEFAULT_ELEVENLABS_MODEL_ID, help="ElevenLabs model ID")
    parser.add_argument("--output-format", default=DEFAULT_ELEVENLABS_OUTPUT_FORMAT, help="ElevenLabs output format")
    parser.add_argument("--language-code", default=DEFAULT_LANGUAGE_CODE, help="Language code sent to ElevenLabs")
    parser.add_argument("--dry-run", action="store_true", help="Show planned changes without generating")
    parser.add_argument("--force", action="store_true", help="Regenerate all tracked items")
    parser.add_argument(
        "--missing-only",
        action="store_true",
        help="Only generate missing files; never regenerate existing ones",
    )
    parser.add_argument("--clean-stale", action="store_true", help="Remove stale files previously tracked in manifest")
    parser.add_argument("--concurrency", type=int, default=1, help="Concurrent TTS jobs")
    return parser.parse_args()


async def main() -> int:
    load_dotenv_file(Path(".env"))
    args = parse_args()

    levels_file = Path(args.levels_file)
    translit_file = Path(args.translit_file)
    audio_dir = Path(args.audio_dir)
    manifest_path = audio_dir / args.manifest_name

    if not levels_file.exists():
        print(f"ERROR: levels file not found: {levels_file}")
        return 1
    if not translit_file.exists():
        print(f"ERROR: transliteration file not found: {translit_file}")
        return 1

    engine_sig = json.dumps(
        {
            "provider": "elevenlabs",
            "base_url": args.elevenlabs_base_url,
            "voice_id": args.voice_id,
            "model_id": args.model_id,
            "output_format": args.output_format,
            "language_code": args.language_code,
            "voice_settings": DEFAULT_VOICE_SETTINGS,
        },
        sort_keys=True,
        ensure_ascii=False,
    )

    words = extract_words_from_levels_ts(levels_file)
    letters = extract_letters_from_transliteration_ts(translit_file)
    items = build_items(words, letters, engine_sig)

    manifest = load_manifest(manifest_path)
    previous_items: Dict[str, Dict] = manifest.get("items", {})

    to_generate: List[Tuple[AudioItem, str]] = []
    up_to_date = 0
    for item in items:
        generate, reason = needs_generation(
            item,
            previous_items,
            audio_dir,
            args.force,
            args.missing_only,
        )
        if generate:
            to_generate.append((item, reason))
        else:
            up_to_date += 1

    current_keys = {item.key for item in items}
    stale_keys = [k for k in previous_items.keys() if k not in current_keys]

    print(f"Provider: elevenlabs")
    print(f"Voice ID: {args.voice_id}")
    print(f"Model ID: {args.model_id}")
    print(f"Words: {len(words)} | Letters: {len(letters)} | Total: {len(items)}")
    print(f"Up-to-date: {up_to_date} | To generate: {len(to_generate)} | Stale tracked: {len(stale_keys)}")

    if to_generate:
        print("\nPlanned generations:")
        for item, reason in to_generate[:30]:
            print(f"  - [{item.kind}] {item.text} -> {item.rel_path} ({reason})")
        if len(to_generate) > 30:
            print(f"  ... and {len(to_generate) - 30} more")

    if args.clean_stale and stale_keys:
        print("\nStale tracked files:")
        for key in stale_keys[:30]:
            rel = previous_items.get(key, {}).get("rel_path", "")
            print(f"  - {rel} ({key})")
        if len(stale_keys) > 30:
            print(f"  ... and {len(stale_keys) - 30} more")

    if args.dry_run:
        return 0

    if to_generate:
        api_key = os.getenv("ELEVENLABS_API_KEY", "").strip()
        if not api_key:
            print("ERROR: ELEVENLABS_API_KEY is required for generation.")
            print("Example: ELEVENLABS_API_KEY=... pnpm audio:sync")
            return 1

        sem = asyncio.Semaphore(max(1, args.concurrency))
        cfg = {
            "api_key": api_key,
            "base_url": args.elevenlabs_base_url,
            "voice_id": args.voice_id,
            "model_id": args.model_id,
            "output_format": args.output_format,
            "language_code": args.language_code,
            "voice_settings": DEFAULT_VOICE_SETTINGS,
        }
        tasks = [
            generate_item(item, audio_dir / item.rel_path, sem, cfg)
            for item, _ in to_generate
        ]
        results = await asyncio.gather(*tasks)
        failed = [(item, err) for item, ok, err in results if not ok]
        success_count = len(results) - len(failed)
        print(f"\nGenerated: {success_count}/{len(results)}")
        for item, err in failed[:20]:
            print(f"  FAIL {item.rel_path}: {err}")
        if failed:
            print(f"Generation failed for {len(failed)} items.")
            return 1

    if args.clean_stale and stale_keys:
        removed = 0
        for key in stale_keys:
            rel = previous_items.get(key, {}).get("rel_path")
            if not rel:
                continue
            path = audio_dir / rel
            if path.exists():
                path.unlink()
                removed += 1
        print(f"Removed stale files: {removed}")

    # Write fresh manifest snapshot.
    out_items = {
        item.key: {
            "kind": item.kind,
            "text": item.text,
            "rel_path": item.rel_path,
            "hash": item.hash,
        }
        for item in items
    }
    audio_dir.mkdir(parents=True, exist_ok=True)
    manifest_payload = {
        "version": 1,
        "provider": "elevenlabs",
        "voice_id": args.voice_id,
        "model_id": args.model_id,
        "output_format": args.output_format,
        "language_code": args.language_code,
        "voice_settings": DEFAULT_VOICE_SETTINGS,
        "levels_file": str(levels_file),
        "translit_file": str(translit_file),
        "items": out_items,
    }
    manifest_path.write_text(
        json.dumps(manifest_payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Manifest updated: {manifest_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
