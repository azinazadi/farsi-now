# بنویس بازی کن! — Farsi Handwriting Learning App

A gamified Farsi handwriting learning app for children (ages 6–12), built with a Candy Crush-style progression system.

## Features

- **8 themed levels** with 64 colloquial Farsi words
- **Canvas-based tracing** with ghost text overlay and pixel-overlap scoring
- **Letter breakdown** showing contextual glyph forms (initial, medial, final, isolated)
- **Gamification**: stars (0–3 per word), XP bar, streak counter, animated mascot
- **Audio**: native Farsi TTS pronunciation for all words and letters
- **Fully RTL** with responsive design (tablet-first)

## Prerequisites

- Node.js 18+
- Python 3.8+ (for asset regeneration only)

## Quick Start

```bash
npm install
npm run dev
```

## Regenerate Assets

```bash
pip install edge-tts
python generate_assets.py
```

For image generation, set `STABILITY_API_KEY` or `REPLICATE_API_TOKEN` env var.

## Architecture

```
src/
├── components/
│   ├── Canvas/           ← drawing + scoring logic
│   ├── WordCard/         ← word display, image, audio, mascot
│   ├── LetterBreakdown/  ← letter tiles, connectors, colors
│   ├── LevelMap/         ← world map UI with lock/unlock
│   ├── Mascot/           ← animated character (emoji-based)
│   └── UI/               ← stars, XP bar, confetti, buttons
├── data/
│   └── levels.ts         ← all word/level data (API-ready)
├── store/
│   └── gameStore.ts      ← zustand store for all game state
├── hooks/
│   ├── useAudio.ts       ← audio playback abstraction
│   ├── useDrawing.ts     ← canvas touch/mouse drawing
│   └── useScoring.ts     ← pixel overlap scoring
├── services/
│   └── progress.ts       ← save/load (localStorage now, API later)
├── utils/
│   ├── contextualForms.ts  ← Unicode Arabic Presentation Forms
│   └── transliteration.ts  ← letter → Latin name mapping
└── types/
    └── index.ts
```

## Adding New Levels/Words

1. Add entries to `src/data/levels.ts`
2. Generate audio: `python generate_assets.py`
3. Add kawaii illustration to `public/assets/images/{word}.png`
4. Tests will catch missing assets automatically

## Backend Integration Points

The app is designed for easy backend migration:

- **`src/services/progress.ts`**: Replace `localStorage` calls with API requests
- **`src/data/levels.ts`**: Replace static data with `fetch()` from API
- **`src/store/gameStore.ts`**: Zustand store can sync with server state
- **All level/word data** is in a separate data layer, ready for API fetching

Planned backend features: user accounts, pro levels, subscriptions, cloud sync.

## Tests

```bash
npm test
```

Covers: contextual forms, transliteration, game store logic, scoring, progress persistence, asset integrity (58 tests).

## Tech Stack

- React 18 + TypeScript 5
- Vite 5
- Tailwind CSS 3
- Framer Motion
- Zustand (state management)
- Vitest + React Testing Library
