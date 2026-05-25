# AGENTS Guide - farsi-now

This file is for coding agents and maintainers working in this repo.
It documents how the app is structured, what is coupled, and how to make safe changes.

## Project Snapshot

- App type: React + TypeScript handwriting game for Farsi learning.
- Core loop: trace a word on canvas -> score overlap -> award stars/xp -> unlock levels.
- Current content shape: 8 levels x 8 words each (64 words total).
- Persistence: localStorage only (`src/services/progress.ts`).
- Tests: Vitest suite currently passing (67 tests).

## Stack

- React 18, TypeScript, Vite
- Zustand for game state
- Tailwind CSS + shadcn/radix UI primitives
- Framer Motion for animation
- Supabase client/storage for audio upload and URL resolution
- Vitest + Testing Library

## Key Commands

- Install: `pnpm install`
- Dev server: `pnpm dev` (default port 8080)
- Build: `pnpm build`
- Lint: `pnpm lint`
- Tests: `pnpm test`
- Asset generation (audio/images): `python generate_assets.py`
- Incremental audio sync:
  - `pnpm audio:sync:dry` (preview only)
  - `pnpm audio:sync` (generate only missing word+letter audio; never regenerates existing files)
  - `pnpm audio:sync:force` (regenerate all tracked)
  - `pnpm audio:sync:clean` (remove stale tracked files)
  - requires `ELEVENLABS_API_KEY` for non-dry runs
- OpenAI image sync:
  - `pnpm images:sync:dry` (preview missing word images)
  - `pnpm images:sync` (generate missing word images)
  - `pnpm images:sync:force` (regenerate all word images)
  - requires `OPENAI_API_KEY` for non-dry runs
- Both sync scripts auto-load `.env` from repo root if present

## Code Map

- Entry/router: `src/main.tsx`, `src/App.tsx`
- Pages:
  - `src/pages/Index.tsx` -> level map
  - `src/pages/LevelPage.tsx` -> word gameplay
  - `src/pages/AdminPage.tsx` -> content/audio editing UI
- State:
  - `src/store/gameStore.ts` (stars, xp, streak, unlocked levels, mute)
  - `src/services/progress.ts` (localStorage save/load/reset)
- Game data:
  - `src/data/levels.ts` (levels + words)
  - `src/data/phrases.ts` (feedback phrase pools + audio lookup helpers)
  - `src/data/phraseAudioManifest.ts` (stripped phrase text -> numeric audio id)
- Gameplay components:
  - `src/components/WordCard/WordCard.tsx`
  - `src/components/Canvas/TracingCanvas.tsx`
  - `src/hooks/useDrawing.ts`
  - `src/hooks/useScoring.ts`
  - `src/hooks/useAudio.ts`
- Assets:
  - `public/assets/images/*.png`
  - `public/assets/audio/*.mp3`
  - `public/assets/audio/letters/*.mp3`
  - `public/assets/audio/phrases/*.mp3`

## Runtime Flow (critical path)

1. `Index` loads saved progress from localStorage and renders `LevelMap`.
2. Selecting an unlocked level navigates to `/level/:levelId`.
3. `WordCard` loads current word from `levels.ts`, plays word audio, and renders `TracingCanvas`.
4. `TracingCanvas` draws a ghost word and records user strokes.
5. `useScoring` calculates normalized overlap percentage and converts it to stars.
6. `WordCard` updates store via `completeWord` and advances or finishes level.
7. `gameStore` persists updated state with `saveProgress`.

## Hard Invariants

- Word asset filenames must use `getAudioAssetStem` (`src/utils/audioPaths.ts`), not raw unicode words.
- Every word in `levels.ts` must have:
  - audio file in `public/assets/audio/<stem>.mp3`
  - image file in `public/assets/images/<stem>.png`
- Every Farsi letter in transliteration utils must have audio in `public/assets/audio/letters/<stem>.mp3`.
- Phrase text coverage is strict:
  - each phrase should resolve in `phraseAudioManifest.ts`
  - matching `public/assets/audio/phrases/<id>.mp3` must exist
- Unlock logic depends on `STARS_TO_UNLOCK` in `gameStore.ts` (currently 12).

## Important Gotchas

- Debug flag: `src/config/debug.ts` has `UNLOCK_ALL_LEVELS: true` right now.
  - This changes unlock behavior and some tests skip lock assertions when enabled.
- Admin panel data is local-first and mostly not wired back into runtime data files:
  - `/admin` edits are stored in localStorage keys like `admin-levels`, `admin-phrases`, `admin-audio-map`.
  - Gameplay still reads static source data (`src/data/levels.ts`, `src/data/phrases.ts`).
- Phrase runtime playback uses `phraseAudioManifest.ts` ids.
  - If phrases change, manifest + phrase mp3s must be regenerated/synced or tests fail.

## Change Playbooks

### Add or edit words/levels

1. Edit `src/data/levels.ts`.
2. Ensure each changed word has matching image/audio using `getAudioAssetStem` naming.
3. Run `pnpm test` (asset checks and level schema checks should pass).

### Change tracing score behavior

1. Update overlap logic in `src/hooks/useScoring.ts`.
2. Update thresholds in `getStars` if needed.
3. Run scoring tests: `src/hooks/__tests__/useScoring.test.ts` and full `pnpm test`.

### Change progression rules

1. Update store logic in `src/store/gameStore.ts` (xp, streak, unlock, attempts).
2. Update corresponding tests in `src/store/__tests__/gameStore.test.ts`.
3. Run `pnpm test`.

### Update phrase content or phrase audio

1. Edit phrase pools in `src/data/phrases.ts`.
2. Regenerate/sync phrase audio + mapping so every phrase has a manifest id and mp3.
3. Confirm tests in `src/data/__tests__/phrases.test.ts` pass.

### Move from localStorage to backend persistence

1. Replace `src/services/progress.ts` implementation first.
2. Keep `gameStore` action surface stable while swapping internals.
3. Add tests for failure modes (network failure, partial data).

## Testing Expectations Before Merge

- Minimum: `pnpm test`
- Recommended for logic/UI changes: `pnpm lint` + `pnpm test`
- For asset/content changes: ensure asset and phrase coverage tests pass (they are strict)

## Operational Notes

- Audio is static/local from `public/assets/**` by default, with optional browser-local admin overrides (`localStorage["admin-audio-files"]`).
- Vite dev server runs on port `8080` by default.
