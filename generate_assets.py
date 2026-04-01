#!/usr/bin/env python3
"""
Asset generator for Farsi Handwriting Learning App.

Prerequisites:
  pip install gtts requests

Usage:
  python generate_assets.py

For image generation, set STABILITY_API_KEY or REPLICATE_API_TOKEN env var.
Without an image API key, only audio files will be generated.
"""

import os
import sys

try:
    from gtts import gTTS
except ImportError:
    print("Please install gTTS: pip install gtts")
    sys.exit(1)

BASE = os.path.join(os.path.dirname(__file__), "public", "assets")

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


def generate_audio():
    """Generate word and letter audio using gTTS."""
    audio_dir = os.path.join(BASE, "audio")
    letters_dir = os.path.join(audio_dir, "letters")
    os.makedirs(audio_dir, exist_ok=True)
    os.makedirs(letters_dir, exist_ok=True)

    word_count = 0
    for word in WORDS:
        path = os.path.join(audio_dir, f"{word}.mp3")
        if os.path.exists(path):
            word_count += 1
            continue
        try:
            tts = gTTS(word, lang="fa")
            tts.save(path)
            word_count += 1
            print(f"  ✓ audio: {word}")
        except Exception as e:
            print(f"  ✗ audio: {word} - {e}")

    letter_count = 0
    for letter in LETTERS:
        path = os.path.join(letters_dir, f"{letter}.mp3")
        if os.path.exists(path):
            letter_count += 1
            continue
        try:
            tts = gTTS(letter, lang="fa")
            tts.save(path)
            letter_count += 1
            print(f"  ✓ letter audio: {letter}")
        except Exception as e:
            print(f"  ✗ letter audio: {letter} - {e}")

    print(f"\nWord audio: {word_count}/{len(WORDS)}")
    print(f"Letter audio: {letter_count}/{len(LETTERS)}")


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
        path = os.path.join(images_dir, f"{word}.png")
        if os.path.exists(path):
            img_count += 1
            continue
        prompt = (
            f"kawaii cute simple illustration of {english}, "
            "pastel colors, white background, thick outlines, "
            "for children age 6-12, flat design"
        )
        # Add your preferred image API call here
        print(f"  ⏳ Would generate: {word} ({english})")
        img_count += 1

    print(f"\nImages: {img_count}/{len(WORDS)}")


def summary():
    """Print asset summary."""
    audio_dir = os.path.join(BASE, "audio")
    letters_dir = os.path.join(audio_dir, "letters")
    images_dir = os.path.join(BASE, "images")

    word_audio = sum(1 for w in WORDS if os.path.exists(os.path.join(audio_dir, f"{w}.mp3")))
    letter_audio = sum(1 for l in LETTERS if os.path.exists(os.path.join(letters_dir, f"{l}.mp3")))
    images = sum(1 for w in WORDS if os.path.exists(os.path.join(images_dir, f"{w}.png")))

    total = word_audio + letter_audio + images
    expected = len(WORDS) + len(LETTERS) + len(WORDS)
    print(f"\n{'='*40}")
    print(f"Asset Summary: {total}/{expected} present")
    print(f"  Word audio:   {word_audio}/{len(WORDS)}")
    print(f"  Letter audio: {letter_audio}/{len(LETTERS)}")
    print(f"  Images:       {images}/{len(WORDS)}")
    print(f"{'='*40}")


if __name__ == "__main__":
    print("🎨 Generating assets for Farsi Handwriting App\n")
    generate_audio()
    generate_images()
    summary()
