# بنویس بازی کن! — Farsi Handwriting Learning App

A fun, Candy Crush-style Farsi handwriting learning app for children ages 6–12.

## Quick Start

```bash
npm install
npm run dev
```

## Regenerate Assets

```bash
pip install gtts
python generate_assets.py
```

## Architecture

- `src/data/levels.ts` — All level/word data (swap to API later)
- `src/store/gameStore.ts` — Zustand state (server-sync ready)
- `src/services/progress.ts` — Save/load abstraction
- `src/utils/` — Contextual forms, transliteration utilities
