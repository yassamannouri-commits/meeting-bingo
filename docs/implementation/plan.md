# Meeting Bingo — Implementation Plan

## Context

The project has comprehensive planning docs (PRD, UX research, architecture) but zero application code. The goal is to build a browser-based bingo game that auto-detects corporate buzzwords via the Web Speech API during live meetings. All processing is client-side; no backend required. Target: fully functional MVP deployed to Vercel.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Speech | Web Speech API (browser-native) |
| Animation | canvas-confetti |
| Persistence | localStorage |
| Deploy | Vercel |

---

## Phase 1 — Project Scaffolding

**Files to create/configure:**

1. `package.json` — dependencies as specified in architecture doc
2. `vite.config.ts` — React plugin, port 3000
3. `tsconfig.json` — strict mode, path aliases
4. `tailwind.config.js` — content paths + custom animations (bounceIn, pulse-fast)
5. `postcss.config.js` — tailwind + autoprefixer
6. `index.html` — root HTML with `<div id="root">`
7. `src/index.css` — Tailwind directives (`@tailwind base/components/utilities`)
8. `src/main.tsx` — React DOM render entry
9. `public/favicon.svg` — simple bingo card icon

**Commands:**
```bash
npm install
npm install canvas-confetti
npm install -D tailwindcss postcss autoprefixer @types/canvas-confetti
npx tailwindcss init -p
```

---

## Phase 2 — Types & Data

**Files to create:**

10. `src/types/index.ts`
    - `CategoryId`, `Category`, `BingoSquare`, `BingoCard`, `GameStatus`, `WinningLine`, `GameState`, `SpeechRecognitionState`, `Toast`
    - Interfaces per `docs/research/meeting-bingo-architecture.md`

11. `src/data/categories.ts`
    - `CATEGORIES` array with 3 entries: `agile` (47 words), `corporate` (43 words), `tech` (44 words)
    - Words from architecture doc

---

## Phase 3 — Core Logic Library

**Files to create:**

12. `src/lib/cardGenerator.ts`
    - `shuffle<T>()` — Fisher-Yates
    - `generateCard(categoryId)` — builds 5×5 `BingoCard`, free space at `[2][2]`, pre-filled
    - `getCardWords(card)` — returns flat word list

13. `src/lib/bingoChecker.ts`
    - `checkForBingo(card)` — checks 5 rows + 5 columns + 2 diagonals; returns first `WinningLine` or null
    - `countFilled(card)` — count for progress display
    - `getClosestToWin(card)` — hint for "one away" UI

14. `src/lib/wordDetector.ts`
    - `normalizeText(text)` — lowercase, normalize quotes
    - `escapeRegex(string)` — escape special chars
    - `detectWords(transcript, cardWords, alreadyFilled)` — word-boundary regex for singles, substring for phrases
    - `WORD_ALIASES` map — ci/cd, mvp, roi, api, devops
    - `detectWordsWithAliases(...)` — runs detectWords then alias check

15. `src/lib/shareUtils.ts`
    - `formatShareText(game)` — builds share string with emoji card, time, winning word
    - `shareResult(game)` — tries `navigator.share`, falls back to `navigator.clipboard.writeText`

16. `src/lib/utils.ts`
    - `cn(...classes)` — clsx-style class merger (inline implementation, no clsx dep)

---

## Phase 4 — Hooks

**Files to create:**

17. `src/hooks/useSpeechRecognition.ts`
    - Checks `window.SpeechRecognition || window.webkitSpeechRecognition`
    - `continuous: true`, `interimResults: true`, `lang: 'en-US'`
    - Auto-restarts on `onend` if `isListening` is true
    - Returns: `{ isSupported, isListening, transcript, interimTranscript, error, startListening, stopListening, resetTranscript }`

18. `src/hooks/useLocalStorage.ts`
    - Generic `useLocalStorage<T>(key, initialValue)` hook
    - Reads on mount, writes on change, handles parse errors

19. `src/hooks/useGame.ts`
    - Orchestrates: `GameState`, `useSpeechRecognition`, `detectWordsWithAliases`, `checkForBingo`
    - On new transcript: detect words → fill matching squares → check for bingo → trigger win
    - Exposes: `game`, `startGame`, `toggleSquare`, `toggleListening`, `newCard`, `resetGame`

20. `src/hooks/useBingoDetection.ts`
    - Thin wrapper: takes card, returns `winningLine | null` (calls `checkForBingo`)

---

## Phase 5 — UI Components

**Files to create:**

21. `src/components/ui/Button.tsx` — variants: primary / secondary / ghost; sizes: sm / md / lg
22. `src/components/ui/Toast.tsx` — auto-dismiss toast for "Detected: {word}", stackable
23. `src/components/ui/Card.tsx` — generic container wrapper
24. `src/components/LandingPage.tsx` — hero, "New Game" CTA, how-it-works, privacy note
25. `src/components/CategorySelect.tsx` — 3 category cards with icon/name/description/samples
26. `src/components/BingoSquare.tsx` — states: default / filled (blue) / auto-filled (pulse) / free (amber) / winning (green)
27. `src/components/BingoCard.tsx` — 5×5 grid, passes `isWinningSquare` per `winningLine`
28. `src/components/TranscriptPanel.tsx` — pulsing mic indicator, transcript, detected word badges
29. `src/components/GameControls.tsx` — "New Card" + listening toggle + manual mode badge
30. `src/components/GameBoard.tsx` — header (logo, status, counter) + card + transcript + controls
31. `src/components/WinScreen.tsx` — confetti on mount, BINGO heading, stats, share + play again
32. `src/App.tsx` — screen state machine: `'landing' | 'category' | 'game' | 'win'`

---

## Phase 6 — Deploy

```bash
vercel --prod
```

No environment variables required (fully client-side). Vercel auto-detects Vite; output dir is `dist`.

---

## File Creation Order

```
Phase 1: package.json → vite.config.ts → tsconfig.json → tailwind/postcss configs → index.html → src/index.css → src/main.tsx
Phase 2: src/types/index.ts → src/data/categories.ts
Phase 3: src/lib/utils.ts → src/lib/cardGenerator.ts → src/lib/bingoChecker.ts → src/lib/wordDetector.ts → src/lib/shareUtils.ts
Phase 4: src/hooks/useLocalStorage.ts → src/hooks/useSpeechRecognition.ts → src/hooks/useBingoDetection.ts → src/hooks/useGame.ts
Phase 5: ui/* → LandingPage → CategorySelect → BingoSquare → BingoCard → TranscriptPanel → GameControls → GameBoard → WinScreen → App.tsx
Phase 6: deploy
```

---

## Verification Checklist

- [ ] `npm run dev` — app loads at localhost:3000
- [ ] Landing page renders; "New Game" navigates to category select
- [ ] Category selection shows 3 packs; selecting one generates a card
- [ ] 5×5 card renders; center square is "FREE" (pre-filled)
- [ ] Click squares manually — they toggle filled/unfilled
- [ ] Complete a row/column/diagonal — win screen + confetti appears
- [ ] "Start Listening" → grant mic → speak a buzzword → square auto-fills
- [ ] "Share Result" copies text or triggers native share sheet
- [ ] `npm run build && npm run preview` — production build works
- [ ] `vercel --prod` — live URL accessible from mobile Chrome
