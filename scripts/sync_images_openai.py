#!/usr/bin/env python3
"""
Generate missing word images with OpenAI (gpt-image), one-by-one.

Default behavior is cost-safe:
- only missing images are generated
- sequential requests (concurrency = 1)

Usage:
  python3 scripts/sync_images_openai.py --dry-run
  OPENAI_API_KEY=... python3 scripts/sync_images_openai.py
  OPENAI_API_KEY=... python3 scripts/sync_images_openai.py --force
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import List


DEFAULT_LEVELS_FILE = "src/data/levels.ts"
DEFAULT_IMAGES_DIR = "public/assets/images"
DEFAULT_MODEL = "gpt-image-2"
DEFAULT_SIZE = "1024x1024"
DEFAULT_QUALITY = "low"  # keep cost down
DEFAULT_API_BASE = "https://api.openai.com/v1"


@dataclass(frozen=True)
class WordItem:
    word: str
    english: str
    rel_path: str


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


def decode_ts_string(raw: str) -> str:
    return json.loads(f"\"{raw}\"")


def get_audio_asset_stem(value: str) -> str:
    trimmed = value.strip()
    if not trimmed:
        return ""
    if re.match(r"^[A-Za-z0-9_-]+$", trimmed):
        return trimmed
    return "-".join(f"u{ord(ch):04x}" for ch in trimmed)


def extract_word_items(levels_file: Path) -> List[WordItem]:
    text = levels_file.read_text(encoding="utf-8")
    # Capture { word: "...", english: "..." } regardless of transliteration field.
    pairs = re.findall(
        r'word:\s*"((?:\\.|[^"\\])*)"\s*,\s*english:\s*"((?:\\.|[^"\\])*)"',
        text,
    )
    items: List[WordItem] = []
    seen = set()
    for raw_word, raw_english in pairs:
        word = decode_ts_string(raw_word).strip()
        english = decode_ts_string(raw_english).strip()
        if not word:
            continue
        if word in seen:
            continue
        seen.add(word)
        stem = get_audio_asset_stem(word)
        items.append(WordItem(word=word, english=english, rel_path=f"{stem}.png"))
    return items


def make_prompt(english: str) -> str:
    return (
        f"Create a single centered children's flashcard illustration of {english}. "
        "Style: cute, simple, flat 2D, clean thick outlines, bright soft colors, minimal detail. "
        "No text, no letters, no watermark, no border, no background scene. "
        "Only one clear subject, transparent background."
    )


def request_image(
    *,
    api_key: str,
    model: str,
    size: str,
    quality: str,
    prompt: str,
    api_base: str,
) -> bytes:
    url = f"{api_base}/images/generations"
    body = {
        "model": model,
        "prompt": prompt,
        "size": size,
        "quality": quality,
        "output_format": "png",
        "background": "transparent",
    }

    def _post(payload: dict) -> dict:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            method="POST",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
        )
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode("utf-8"))

    try:
        result = _post(body)
    except urllib.error.HTTPError as exc:
        # Fallback for accounts/models that may reject one of these optional fields.
        details = exc.read().decode("utf-8", errors="replace")
        if exc.code == 400:
            fallback = dict(body)
            fallback.pop("background", None)
            fallback.pop("output_format", None)
            result = _post(fallback)
        else:
            raise RuntimeError(f"HTTP {exc.code}: {details[:500]}")

    data = result.get("data") or []
    if not data:
        raise RuntimeError("No image data returned by OpenAI")
    b64 = data[0].get("b64_json")
    if not b64:
        raise RuntimeError("Missing b64_json in OpenAI response")
    return base64.b64decode(b64)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generate missing level images with OpenAI")
    p.add_argument("--levels-file", default=DEFAULT_LEVELS_FILE)
    p.add_argument("--images-dir", default=DEFAULT_IMAGES_DIR)
    p.add_argument("--model", default=DEFAULT_MODEL)
    p.add_argument("--size", default=DEFAULT_SIZE)
    p.add_argument("--quality", default=DEFAULT_QUALITY)
    p.add_argument("--api-base", default=DEFAULT_API_BASE)
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--force", action="store_true", help="Regenerate all images, not only missing")
    return p.parse_args()


def main() -> int:
    load_dotenv_file(Path(".env"))
    args = parse_args()
    levels_file = Path(args.levels_file)
    images_dir = Path(args.images_dir)

    if not levels_file.exists():
        print(f"ERROR: levels file not found: {levels_file}")
        return 1

    items = extract_word_items(levels_file)
    to_generate: List[WordItem] = []
    up_to_date = 0
    for item in items:
        out = images_dir / item.rel_path
        if args.force or not out.exists() or out.stat().st_size < 500:
            to_generate.append(item)
        else:
            up_to_date += 1

    print(f"Model: {args.model}")
    print(f"Words: {len(items)} | Up-to-date images: {up_to_date} | To generate: {len(to_generate)}")
    if to_generate:
        print("\nPlanned generations:")
        for item in to_generate[:30]:
            print(f"  - {item.word} ({item.english}) -> {item.rel_path}")
        if len(to_generate) > 30:
            print(f"  ... and {len(to_generate) - 30} more")

    if args.dry_run or not to_generate:
        return 0

    key = os.getenv("OPENAI_API_KEY", "").strip()
    if not key:
        print("ERROR: OPENAI_API_KEY is required.")
        return 1

    images_dir.mkdir(parents=True, exist_ok=True)
    success = 0
    for i, item in enumerate(to_generate, start=1):
        out = images_dir / item.rel_path
        prompt = make_prompt(item.english)
        try:
            img = request_image(
                api_key=key,
                model=args.model,
                size=args.size,
                quality=args.quality,
                prompt=prompt,
                api_base=args.api_base,
            )
            out.write_bytes(img)
            success += 1
            print(f"[{i}/{len(to_generate)}] OK   {item.rel_path}")
        except Exception as exc:
            print(f"[{i}/{len(to_generate)}] FAIL {item.rel_path}: {exc}")

    print(f"\nDone: {success}/{len(to_generate)} generated")
    return 0 if success == len(to_generate) else 1


if __name__ == "__main__":
    raise SystemExit(main())
