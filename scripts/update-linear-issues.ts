import { LinearClient } from "@linear/sdk";

const client = new LinearClient({ apiKey: process.env.LINEAR_API_KEY });

const updates: { id: string; identifier: string; description: string }[] = [
  {
    id: "9c43caf2-bf7c-48f6-a7e0-2fd308462414",
    identifier: "RIP-5",
    description: `## Phase 1 — Project Scaffolding

**Files to create/configure:**

1. \`package.json\` — dependencies as specified in architecture doc
2. \`vite.config.ts\` — React plugin, port 3000
3. \`tsconfig.json\` — strict mode, path aliases
4. \`tailwind.config.js\` — content paths + custom animations (bounceIn, pulse-fast)
5. \`postcss.config.js\` — tailwind + autoprefixer
6. \`index.html\` — root HTML with \`<div id="root">\`
7. \`src/index.css\` — Tailwind directives (\`@tailwind base/components/utilities\`)
8. \`src/main.tsx\` — React DOM render entry
9. \`public/favicon.svg\` — simple bingo card icon

**Commands:**
\`\`\`bash
npm install
npm install canvas-confetti
npm install -D tailwindcss postcss autoprefixer @types/canvas-confetti
npx tailwindcss init -p
\`\`\``,
  },
  {
    id: "c3b17ce0-f636-4a97-b7b9-acbd4a4b376c",
    identifier: "RIP-6",
    description: `## Phase 2 — Types & Data

**File:** \`src/types/index.ts\`

Define all TypeScript interfaces per \`docs/research/meeting-bingo-architecture.md\`:

- \`CategoryId\` — union type for category identifiers
- \`Category\` — category metadata (id, name, description, words)
- \`BingoSquare\` — single square state (word, filled, isFree, isWinning)
- \`BingoCard\` — 5×5 grid of BingoSquare
- \`GameStatus\` — \`'idle' | 'playing' | 'won'\`
- \`WinningLine\` — type + indices of winning squares
- \`GameState\` — full game state (card, status, startTime, etc.)
- \`SpeechRecognitionState\` — isSupported, isListening, transcript, error
- \`Toast\` — id, message, type for notification system`,
  },
  {
    id: "d74083e0-7e3a-402e-825d-d4658b0de720",
    identifier: "RIP-7",
    description: `## Phase 2 — Types & Data

**File:** \`src/data/categories.ts\`

Export \`CATEGORIES\` array with 3 entries:

- \`agile\` — 47 words (e.g. "velocity", "sprint", "retrospective", "scrum", "backlog", ...)
- \`corporate\` — 43 words (e.g. "synergy", "bandwidth", "pivot", "leverage", "circle back", ...)
- \`tech\` — 44 words (e.g. "blockchain", "machine learning", "cloud-native", "microservices", ...)

Words sourced from \`docs/research/meeting-bingo-architecture.md\`.`,
  },
  {
    id: "0607ca29-3b08-4771-8238-1b83fa65f12d",
    identifier: "RIP-8",
    description: `## Phase 3 — Core Logic Library

**File:** \`src/lib/utils.ts\`

- \`cn(...classes)\` — clsx-style class merger (inline implementation, no clsx dependency)

This is a small utility used throughout all UI components for conditional className merging.`,
  },
  {
    id: "343d05fd-a3a5-4812-8a57-222b44efff6e",
    identifier: "RIP-9",
    description: `## Phase 3 — Core Logic Library

**File:** \`src/lib/cardGenerator.ts\`

- \`shuffle<T>(array)\` — Fisher-Yates in-place shuffle
- \`generateCard(categoryId)\` — builds a 5×5 \`BingoCard\` from the chosen category; free space at \`[2][2]\`, pre-filled
- \`getCardWords(card)\` — returns flat list of all words on the card`,
  },
  {
    id: "d2d7d3e8-7284-4e47-9da9-71a6c0c796b0",
    identifier: "RIP-10",
    description: `## Phase 3 — Core Logic Library

**File:** \`src/lib/bingoChecker.ts\`

- \`checkForBingo(card)\` — checks 5 rows + 5 columns + 2 diagonals; returns first \`WinningLine\` or \`null\`
- \`countFilled(card)\` — count of filled squares for progress display
- \`getClosestToWin(card)\` — returns line with most filled squares for "one away" hint UI`,
  },
  {
    id: "1604de49-ba2d-41c0-8290-103c01c3a691",
    identifier: "RIP-11",
    description: `## Phase 3 — Core Logic Library

**File:** \`src/lib/wordDetector.ts\`

- \`normalizeText(text)\` — lowercase, normalize smart quotes/apostrophes
- \`escapeRegex(string)\` — escape special regex characters
- \`detectWords(transcript, cardWords, alreadyFilled)\` — word-boundary regex for single words, substring match for phrases
- \`WORD_ALIASES\` map — handles acronyms: ci/cd, mvp, roi, api, devops
- \`detectWordsWithAliases(...)\` — runs \`detectWords\` then checks alias map for additional matches`,
  },
  {
    id: "1dbf52b5-e88a-44fb-8208-9cbd5494a06f",
    identifier: "RIP-12",
    description: `## Phase 3 — Core Logic Library

**File:** \`src/lib/shareUtils.ts\`

- \`formatShareText(game)\` — builds share string with emoji 5×5 card grid, elapsed time, and winning word
- \`shareResult(game)\` — tries \`navigator.share()\` (mobile); falls back to \`navigator.clipboard.writeText()\``,
  },
  {
    id: "efdcb576-6154-42e3-af52-36c14958b1f1",
    identifier: "RIP-13",
    description: `## Phase 4 — Hooks

**File:** \`src/hooks/useLocalStorage.ts\`

Generic React hook: \`useLocalStorage<T>(key, initialValue)\`

- Reads stored value on mount, handles JSON parse errors gracefully
- Writes to localStorage on state change
- Returns \`[value, setValue]\` tuple like \`useState\``,
  },
  {
    id: "78fb061f-17af-4e75-91de-0a9723c9e9e4",
    identifier: "RIP-14",
    description: `## Phase 4 — Hooks

**File:** \`src/hooks/useSpeechRecognition.ts\`

- Checks \`window.SpeechRecognition || window.webkitSpeechRecognition\` for browser support
- Config: \`continuous: true\`, \`interimResults: true\`, \`lang: 'en-US'\`
- Auto-restarts on \`onend\` event if \`isListening\` is still true
- Returns:
  \`\`\`ts
  {
    isSupported: boolean,
    isListening: boolean,
    transcript: string,
    interimTranscript: string,
    error: string | null,
    startListening: () => void,
    stopListening: () => void,
    resetTranscript: () => void,
  }
  \`\`\``,
  },
  {
    id: "05adf696-25f6-47e1-a445-3e575155e0f3",
    identifier: "RIP-15",
    description: `## Phase 4 — Hooks

**File:** \`src/hooks/useBingoDetection.ts\`

Thin wrapper hook:
- Takes a \`BingoCard\`
- Returns \`WinningLine | null\` by calling \`checkForBingo(card)\`
- Re-runs on card change via \`useMemo\` or \`useEffect\``,
  },
  {
    id: "312ce5c6-90e3-4c14-bf78-a77bfeda61ff",
    identifier: "RIP-16",
    description: `## Phase 4 — Hooks

**File:** \`src/hooks/useGame.ts\`

Main orchestration hook. Wires together:
- \`GameState\` — full game state
- \`useSpeechRecognition\` — real-time transcript
- \`detectWordsWithAliases\` — word matching
- \`checkForBingo\` — win detection

**Behaviour:**
- On new transcript segment: detect words → fill matching squares → check for bingo → trigger win state

**Exposes:**
\`\`\`ts
{
  game: GameState,
  startGame: (categoryId: CategoryId) => void,
  toggleSquare: (row: number, col: number) => void,
  toggleListening: () => void,
  newCard: () => void,
  resetGame: () => void,
}
\`\`\``,
  },
  {
    id: "95731c5f-f5db-4597-8de3-d0645dd8866c",
    identifier: "RIP-17",
    description: `## Phase 5 — UI Components

**Files:**
- \`src/components/ui/Button.tsx\` — variants: \`primary\` / \`secondary\` / \`ghost\`; sizes: \`sm\` / \`md\` / \`lg\`
- \`src/components/ui/Toast.tsx\` — auto-dismiss toast for "Detected: {word}"; stackable with queue
- \`src/components/ui/Card.tsx\` — generic container wrapper with consistent padding/border styling`,
  },
  {
    id: "a569983a-e057-4aa4-a13d-95b80148e093",
    identifier: "RIP-18",
    description: `## Phase 5 — UI Components

**File:** \`src/components/LandingPage.tsx\`

Sections:
1. Hero — app name + tagline
2. "New Game" CTA button → navigates to category select
3. How-it-works — 3-step explainer
4. Privacy note — "All processing is local; no audio leaves your device"`,
  },
  {
    id: "7d157c39-0ad0-47b9-966c-c9ca74556ed0",
    identifier: "RIP-19",
    description: `## Phase 5 — UI Components

**File:** \`src/components/CategorySelect.tsx\`

Displays 3 category cards, each showing:
- Icon / emoji
- Category name
- Short description
- Sample words (3–5 examples)

Clicking a card calls \`startGame(categoryId)\`.`,
  },
  {
    id: "794e1508-4b4b-447a-ad0b-b05a8d7387fe",
    identifier: "RIP-20",
    description: `## Phase 5 — UI Components

**File:** \`src/components/BingoSquare.tsx\`

Visual states:
| State | Style |
|-------|-------|
| \`default\` | White / light gray |
| \`filled\` (manual) | Blue highlight |
| \`auto-filled\` | Blue + pulse animation |
| \`free\` | Amber / gold |
| \`winning\` | Green highlight |

Receives: \`square: BingoSquare\`, \`isWinning: boolean\`, \`onClick\``,
  },
  {
    id: "fbf6c0c8-726b-43c8-bef7-054a9dfa854d",
    identifier: "RIP-21",
    description: `## Phase 5 — UI Components

**File:** \`src/components/BingoCard.tsx\`

- Renders a 5×5 grid of \`BingoSquare\` components
- Passes \`isWinning={true}\` to squares that are part of the current \`winningLine\`
- Receives: \`card: BingoCard\`, \`winningLine: WinningLine | null\`, \`onSquareClick\``,
  },
  {
    id: "e505dcab-1d2f-4e4d-bebb-26bfd3c0c058",
    identifier: "RIP-22",
    description: `## Phase 5 — UI Components

**File:** \`src/components/TranscriptPanel.tsx\`

- Pulsing microphone indicator (animated when listening)
- Scrollable transcript of recognized speech
- Detected word badges — highlights words that matched card squares
- Shows interim (in-progress) transcript in a lighter style`,
  },
  {
    id: "56ca282b-56e1-430f-bcb5-8b2e23652d40",
    identifier: "RIP-23",
    description: `## Phase 5 — UI Components

**File:** \`src/components/GameControls.tsx\`

Controls row beneath the bingo card:
- **"New Card"** button — generates a fresh card for current category
- **Listening toggle** — "Start Listening" / "Stop Listening" with mic icon
- **Manual mode badge** — shown when speech is not supported (browser fallback)`,
  },
  {
    id: "0ea33033-9b2f-46b1-9d2c-017d90239a8b",
    identifier: "RIP-24",
    description: `## Phase 5 — UI Components

**File:** \`src/components/GameBoard.tsx\`

Full game screen layout:
- **Header** — app logo, game status label, filled-square counter
- **BingoCard** — 5×5 grid
- **TranscriptPanel** — speech recognition display
- **GameControls** — action buttons`,
  },
  {
    id: "ba9f421b-16e9-44af-b9b8-2b445386018e",
    identifier: "RIP-25",
    description: `## Phase 5 — UI Components

**File:** \`src/components/WinScreen.tsx\`

Shown when bingo is detected:
- Fires \`canvas-confetti\` on mount
- Large "BINGO!" heading
- Stats: time elapsed, number of squares filled, winning word
- **Share Result** button — calls \`shareResult(game)\`
- **Play Again** button — calls \`resetGame()\``,
  },
  {
    id: "3441b422-3ad7-4cf8-8874-f2fadada10b4",
    identifier: "RIP-26",
    description: `## Phase 5 — UI Components

**File:** \`src/App.tsx\`

Root component — screen state machine:

\`\`\`
'landing' → 'category' → 'game' → 'win'
\`\`\`

- Renders the correct screen based on \`game.status\` and nav state
- Passes \`useGame()\` hook results down to child screens
- Hosts the \`Toast\` notification layer`,
  },
  {
    id: "94f6155b-6bf8-4b06-8cc6-0df46ec0c2c3",
    identifier: "RIP-27",
    description: `## Phase 6 — Deploy

**Command:**
\`\`\`bash
vercel --prod
\`\`\`

**Notes:**
- No environment variables required — app is fully client-side
- Vercel auto-detects Vite; output directory is \`dist\`
- Verify live URL is accessible from mobile Chrome

**Pre-deploy checklist:**
- [ ] \`npm run build\` passes with no errors
- [ ] \`npm run preview\` — production build works locally
- [ ] \`vercel --prod\` — live URL accessible from mobile Chrome`,
  },
];

async function main() {
  console.log(`Updating ${updates.length} issues...`);
  for (const issue of updates) {
    process.stdout.write(`  ${issue.identifier}... `);
    await client.updateIssue(issue.id, { description: issue.description });
    console.log("done");
  }
  console.log("\nAll issues updated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
