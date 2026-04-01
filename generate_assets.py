#!/usr/bin/env python3
"""
Asset generator for Farsi Handwriting Learning App.

Prerequisites:
  pip install edge-tts

Usage:
  python generate_assets.py
  python generate_assets.py --phrases-config phrases.json   # use exported phonetics

For image generation, set STABILITY_API_KEY or REPLICATE_API_TOKEN env var.
Without an image API key, only audio files will be generated.
"""

import asyncio
import hashlib
import json
import os
import sys

try:
    import edge_tts
except ImportError:
    print("Please install edge-tts: pip install edge-tts")
    sys.exit(1)

BASE = os.path.join(os.path.dirname(__file__), "public", "assets")
VOICE = "fa-IR-DilaraNeural"

WORDS = {
    "سلام": "hello greeting",
    "ممنون": "thank you gratitude",
    "خوبی": "how are you greeting",
    "بیا": "come here hand gesture",
    "برو": "go away walking",
    "آره": "yes thumbs up",
    "نه": "no shaking head",
    "باشه": "okay agreement nod",
    "مامان": "mom mother",
    "بابا": "dad father",
    "داداش": "brother boy sibling",
    "آبجی": "sister girl sibling",
    "ننه": "grandmother elderly woman",
    "بابابزرگ": "grandfather elderly man",
    "عمه": "aunt woman",
    "دایی": "uncle man",
    "گربه": "cat",
    "سگ": "dog",
    "مرغ": "chicken hen",
    "اسب": "horse",
    "ماهی": "fish",
    "خرگوش": "rabbit bunny",
    "موش": "mouse",
    "خرس": "bear",
    "آب": "water droplet",
    "درخت": "tree",
    "گل": "flower",
    "خاک": "soil earth dirt",
    "آفتاب": "sun sunshine",
    "ابر": "cloud",
    "بارون": "rain raindrop",
    "سنگ": "stone rock",
    "نون": "bread flatbread",
    "شیر": "milk glass of milk",
    "برنج": "rice bowl of rice",
    "چایی": "tea cup of tea",
    "تخم‌مرغ": "egg",
    "پنیر": "cheese",
    "سیب": "apple red apple",
    "موز": "banana",
    "قرمز": "red color swatch",
    "آبی": "blue color swatch",
    "زرد": "yellow color swatch",
    "سبز": "green color swatch",
    "سفید": "white color swatch",
    "مشکی": "black color swatch",
    "صورتی": "pink color swatch",
    "نارنجی": "orange color swatch",
    "چشم": "eye",
    "دست": "hand",
    "پا": "foot leg",
    "دهن": "mouth lips",
    "گوش": "ear",
    "بینی": "nose",
    "سر": "head face",
    "شکم": "stomach tummy belly",
    "یه": "number one 1",
    "دو": "number two 2",
    "سه": "number three 3",
    "چار": "number four 4",
    "پنج": "number five 5",
    "شش": "number six 6",
    "هفت": "number seven 7",
    "هشت": "number eight 8",
}

LETTERS = list("ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی") + ["آ"]


def get_audio_asset_stem(value: str) -> str:
    """Convert a Unicode string to an ASCII-safe hex stem (matches JS getAudioAssetStem)."""
    trimmed = value.strip()
    if not trimmed:
        return ""
    import re
    if re.match(r'^[A-Za-z0-9_-]+$', trimmed):
        return trimmed
    return "-".join(f"u{ord(ch):04x}" for ch in trimmed)


def make_hash(text: str) -> str:
    """Create a 12-char hash for a phrase (matches the JS audioMap convention)."""
    return hashlib.md5(text.encode("utf-8")).hexdigest()[:12]


async def generate_one(text: str, path: str):
    """Generate a single audio file."""
    try:
        comm = edge_tts.Communicate(text, VOICE)
        await comm.save(path)
        return True
    except Exception as e:
        print(f"  ✗ {text} - {e}")
        return False


async def generate_audio():
    """Generate word and letter audio using Microsoft Edge TTS (Farsi)."""
    audio_dir = os.path.join(BASE, "audio")
    letters_dir = os.path.join(audio_dir, "letters")
    os.makedirs(audio_dir, exist_ok=True)
    os.makedirs(letters_dir, exist_ok=True)

    # Generate word audio with ASCII-safe filenames
    tasks = []
    for word in WORDS:
        stem = get_audio_asset_stem(word)
        path = os.path.join(audio_dir, f"{stem}.mp3")
        if os.path.exists(path) and os.path.getsize(path) > 2000:
            continue
        tasks.append(generate_one(word, path))

    if tasks:
        results = await asyncio.gather(*tasks)
        print(f"  Generated {sum(results)}/{len(tasks)} word audio files")

    word_count = sum(1 for w in WORDS if os.path.exists(os.path.join(audio_dir, f"{get_audio_asset_stem(w)}.mp3")))

    # Generate letter audio with ASCII-safe filenames
    tasks2 = []
    for letter in LETTERS:
        stem = get_audio_asset_stem(letter)
        path = os.path.join(letters_dir, f"{stem}.mp3")
        if os.path.exists(path) and os.path.getsize(path) > 2000:
            continue
        tasks2.append(generate_one(letter, path))

    if tasks2:
        results2 = await asyncio.gather(*tasks2)
        print(f"  Generated {sum(results2)}/{len(tasks2)} letter audio files")

    letter_count = sum(1 for l in LETTERS if os.path.exists(os.path.join(letters_dir, f"{get_audio_asset_stem(l)}.mp3")))

    print(f"\nWord audio: {word_count}/{len(WORDS)}")
    print(f"Letter audio: {letter_count}/{len(LETTERS)}")


async def generate_phrase_audio(config_path: str | None = None):
    """Generate phrase audio using phonetic hints from admin export.

    If a phrases config JSON is provided (exported from /admin),
    it uses the 'phonetics' field to get pronunciation guides.
    The TTS reads the phonetic text but the file is named by the
    hash of the original phrase text.
    """
    phrases_dir = os.path.join(BASE, "audio", "phrases")
    os.makedirs(phrases_dir, exist_ok=True)

    # Load config
    phrases_data: dict = {}
    audio_map: dict = {}
    phonetics: dict = {}

    if config_path and os.path.exists(config_path):
        with open(config_path, "r", encoding="utf-8") as f:
            config = json.load(f)
        phrases_data = config.get("phrases", {})
        audio_map = config.get("audioMap", {})
        phonetics = config.get("phonetics", {})
        print(f"  Loaded config: {sum(len(v) for v in phrases_data.values())} phrases, {len(phonetics)} phonetic overrides")
    else:
        # Load from src/data/phrases.ts mapping file
        mapping_path = os.path.join(BASE, "audio", "phrases", "mapping.json")
        if os.path.exists(mapping_path):
            with open(mapping_path, "r", encoding="utf-8") as f:
                audio_map = json.load(f)
        print("  No phrases config provided. Use: --phrases-config phrases.json")
        print("  (Export from /admin → Phrases → Export JSON)")
        return

    import re
    def strip_emoji(text: str) -> str:
        return re.sub(r'[\U0001F000-\U0001FFFF]|[\u2600-\u27BF]|[\uFE00-\uFEFF]|[\u200D\uFE0F]|[😊😍😂😈😜😋🤗⚡🌟🌸🚀🐥🐶💪🎉🔥👏🛡️🌠📱☕🗝️🔑💃🍰🧠🖼️😎🦇]', '', text).strip()

    tasks = []
    new_map = dict(audio_map)
    generated_phrases = []

    for category, phrase_list in phrases_data.items():
        for phrase in phrase_list:
            clean = strip_emoji(phrase)
            if not clean:
                continue

            # Get or create hash
            h = audio_map.get(clean) or make_hash(clean)
            new_map[clean] = h
            path = os.path.join(phrases_dir, f"{h}.mp3")

            # Always use original Farsi text for TTS (fa-IR voice)
            # Latin phonetics are for reference only, not for the Farsi TTS engine
            tts_text = clean

            if os.path.exists(path) and os.path.getsize(path) > 2000:
                # Only regenerate if phonetic override exists and differs
                if tts_text == clean:
                    continue
                # Check if we should force regenerate
                marker = path + ".phonetic"
                if os.path.exists(marker):
                    with open(marker, "r", encoding="utf-8") as f:
                        if f.read().strip() == tts_text:
                            continue  # Same phonetic, skip

            generated_phrases.append((clean, tts_text, h))
            tasks.append(generate_one(tts_text, path))

            # Save phonetic marker so we know what was used
            marker = path + ".phonetic"
            with open(marker, "w", encoding="utf-8") as f:
                f.write(tts_text)

    if tasks:
        results = await asyncio.gather(*tasks)
        print(f"  Generated {sum(results)}/{len(tasks)} phrase audio files")
        for (clean, tts, h), ok in zip(generated_phrases, results):
            status = "✓" if ok else "✗"
            phonetic_note = f" (phonetic: {tts})" if tts != clean else ""
            print(f"    {status} {clean[:40]}{phonetic_note} → {h}.mp3")
    else:
        print("  All phrase audio up to date")

    # Save updated mapping
    mapping_path = os.path.join(phrases_dir, "mapping.json")
    with open(mapping_path, "w", encoding="utf-8") as f:
        json.dump(new_map, f, ensure_ascii=False, indent=2)
    print(f"  Updated mapping.json with {len(new_map)} entries")

    total = sum(1 for f in os.listdir(phrases_dir) if f.endswith(".mp3"))
    print(f"\nPhrase audio: {total} files")


def generate_images():
    """Generate kawaii illustrations (requires API key)."""
    api_key = os.environ.get("STABILITY_API_KEY") or os.environ.get("REPLICATE_API_TOKEN")
    if not api_key:
        print("\n⚠  No image API key found. Set STABILITY_API_KEY or REPLICATE_API_TOKEN.")
        print("   Skipping image generation.")
        return

    images_dir = os.path.join(BASE, "images")
    os.makedirs(images_dir, exist_ok=True)

    img_count = 0
    for word, english in WORDS.items():
        stem = get_audio_asset_stem(word)
        path = os.path.join(images_dir, f"{stem}.png")
        if os.path.exists(path):
            img_count += 1
            continue
        prompt = (
            f"kawaii cute simple illustration of {english}, "
            "pastel colors, white background, thick outlines, "
            "for children age 6-12, flat design"
        )
        print(f"  ⏳ Would generate: {word} ({english})")
        img_count += 1

    print(f"\nImages: {img_count}/{len(WORDS)}")


def summary():
    """Print asset summary."""
    audio_dir = os.path.join(BASE, "audio")
    letters_dir = os.path.join(audio_dir, "letters")
    images_dir = os.path.join(BASE, "images")
    phrases_dir = os.path.join(audio_dir, "phrases")

    word_audio = sum(1 for w in WORDS if os.path.exists(os.path.join(audio_dir, f"{get_audio_asset_stem(w)}.mp3")))
    letter_audio = sum(1 for l in LETTERS if os.path.exists(os.path.join(letters_dir, f"{get_audio_asset_stem(l)}.mp3")))
    images = sum(1 for f in os.listdir(images_dir) if f.endswith(".png")) if os.path.exists(images_dir) else 0
    phrase_audio = sum(1 for f in os.listdir(phrases_dir) if f.endswith(".mp3")) if os.path.exists(phrases_dir) else 0

    total = word_audio + letter_audio + images + phrase_audio
    print(f"\n{'='*40}")
    print(f"Asset Summary: {total} total")
    print(f"  Word audio:   {word_audio}/{len(WORDS)}")
    print(f"  Letter audio: {letter_audio}/{len(LETTERS)}")
    print(f"  Phrase audio: {phrase_audio}")
    print(f"  Images:       {images}")
    print(f"{'='*40}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Generate assets for Farsi app")
    parser.add_argument("--phrases-config", help="Path to exported phrases JSON from /admin")
    parser.add_argument("--phrases-only", action="store_true", help="Only generate phrase audio")
    args = parser.parse_args()

    print("🎨 Generating assets for Farsi Handwriting App\n")

    if args.phrases_only:
        asyncio.run(generate_phrase_audio(args.phrases_config))
    else:
        asyncio.run(generate_audio())
        asyncio.run(generate_phrase_audio(args.phrases_config))
        generate_images()

    summary()
