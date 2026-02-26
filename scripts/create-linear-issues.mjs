import { readFileSync } from 'fs';

const envFile = readFileSync('/workspaces/meeting-bingo/.env', 'utf8');
const API_KEY = envFile.match(/LINEAR_API_KEY\s*=\s*(.+)/)[1].trim();
const TEAM_ID = '72d2a9cc-bf56-46ed-9120-cb4e8e537b5b';
const PROJECT_ID = 'd3c6ef0b-cd5f-4dbf-b9a4-9985a70c3b01';
const STATE_ID = '4a79b722-f466-4732-9e88-7e5302494354'; // Todo

async function createIssue(title, description, priority = 3) {
  const res = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      Authorization: API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation CreateIssue($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            success
            issue { id identifier title url }
          }
        }
      `,
      variables: {
        input: { title, description, teamId: TEAM_ID, projectId: PROJECT_ID, stateId: STATE_ID, priority },
      },
    }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  const issue = json.data.issueCreate.issue;
  console.log(`  ${issue.identifier}  ${issue.title}`);
  return issue;
}

const issues = [
  // ─── Phase 1 ──────────────────────────────────────────────────────────────
  {
    title: 'Phase 1: Project scaffolding',
    description: `Set up the full project foundation — build tooling, config files, and entry points — so the dev server runs before any application code is written.

## Files to create
- \`package.json\` — React 18, Vite 5, TypeScript, Tailwind CSS, canvas-confetti
- \`vite.config.ts\` — \`@vitejs/plugin-react\`, port 3000, sourcemaps
- \`tsconfig.json\` — strict mode, \`moduleResolution: bundler\`
- \`tailwind.config.js\` — content paths + custom animations: \`bounceIn\`, \`pulse-fast\`
- \`postcss.config.js\` — tailwind + autoprefixer
- \`index.html\` — \`<div id="root">\`, title "Meeting Bingo"
- \`src/index.css\` — \`@tailwind base/components/utilities\`
- \`src/main.tsx\` — \`ReactDOM.createRoot\` entry
- \`public/favicon.svg\` — simple bingo grid icon

## Install commands
\`\`\`bash
npm install
npm install canvas-confetti
npm install -D tailwindcss postcss autoprefixer @types/canvas-confetti
npx tailwindcss init -p
\`\`\`

## Done when
\`npm run dev\` starts without errors and loads a blank page at localhost:3000.`,
  },

  // ─── Phase 2 ──────────────────────────────────────────────────────────────
  {
    title: 'Phase 2: TypeScript type definitions',
    description: `Create all shared TypeScript interfaces and types in \`src/types/index.ts\`.

## Types to define
- \`CategoryId\` — \`'agile' | 'corporate' | 'tech'\`
- \`Category\` — \`{ id, name, description, icon, words[] }\`
- \`BingoSquare\` — \`{ id, word, isFilled, isAutoFilled, isFreeSpace, filledAt, row, col }\`
- \`BingoCard\` — \`{ squares: BingoSquare[][], words: string[] }\`
- \`GameStatus\` — \`'idle' | 'setup' | 'playing' | 'won'\`
- \`WinningLine\` — \`{ type: 'row'|'column'|'diagonal', index, squares: string[] }\`
- \`GameState\` — full game state shape
- \`SpeechRecognitionState\` — \`{ isSupported, isListening, transcript, interimTranscript, error }\`
- \`Toast\` — \`{ id, message, type, duration? }\`

## Done when
\`tsc --noEmit\` passes with no errors after this file exists.`,
  },
  {
    title: 'Phase 2: Buzzword category data',
    description: `Create \`src/data/categories.ts\` with the \`CATEGORIES\` constant — an array of 3 \`Category\` objects.

## Categories
| ID | Name | Word count |
|----|------|-----------|
| \`agile\` | Agile & Scrum | 47 words |
| \`corporate\` | Corporate Speak | 43 words |
| \`tech\` | Tech & Engineering | 44 words |

Sample words per category are documented in \`docs/research/meeting-bingo-architecture.md\`.

Each category needs \`icon\` (emoji), \`name\`, \`description\`, and \`words[]\` with enough unique words to fill multiple non-repeating 5×5 cards (minimum 25).

## Done when
The array is importable and each category has ≥ 25 words.`,
  },

  // ─── Phase 3 ──────────────────────────────────────────────────────────────
  {
    title: 'Phase 3: Utility helpers (utils.ts)',
    description: `Create \`src/lib/utils.ts\` with small shared helpers.

## Functions
- \`cn(...classes: (string | undefined | false | null)[]): string\` — merges class names, filtering falsy values (inline implementation, no clsx dependency)

## Done when
\`cn('a', false, 'b')\` returns \`'a b'\`.`,
  },
  {
    title: 'Phase 3: Card generator',
    description: `Create \`src/lib/cardGenerator.ts\`.

## Functions
- \`shuffle<T>(array: T[]): T[]\` — Fisher-Yates in-place shuffle (returns new array)
- \`generateCard(categoryId: CategoryId): BingoCard\` — shuffles category words, picks 24, builds 5×5 grid; free space at row 2 col 2 (\`isFilled: true\`, \`isFreeSpace: true\`, word: \`'FREE'\`)
- \`getCardWords(card: BingoCard): string[]\` — returns flat word list (for word detection)

## Done when
\`generateCard('agile')\` returns a \`BingoCard\` with 25 squares, center is FREE, no duplicate words.`,
  },
  {
    title: 'Phase 3: Bingo checker',
    description: `Create \`src/lib/bingoChecker.ts\`.

## Functions
- \`checkForBingo(card: BingoCard): WinningLine | null\` — checks 5 rows, 5 columns, 2 diagonals; returns first winning line found
- \`countFilled(card: BingoCard): number\` — count of filled squares
- \`getClosestToWin(card: BingoCard): { needed: number; line: string } | null\` — returns which line is closest to completion (for UI hints)

## Win conditions
12 total: rows 0–4, columns 0–4, diagonal top-left→bottom-right, diagonal top-right→bottom-left.

## Done when
A card with row 0 fully filled returns \`{ type: 'row', index: 0, squares: ['0-0','0-1','0-2','0-3','0-4'] }\`.`,
  },
  {
    title: 'Phase 3: Word detector',
    description: `Create \`src/lib/wordDetector.ts\`.

## Functions
- \`normalizeText(text: string): string\` — lowercase, normalise smart quotes
- \`escapeRegex(string: string): string\` — escape special regex characters
- \`detectWords(transcript, cardWords, alreadyFilled: Set<string>): string[]\` — word-boundary regex for single words; substring match for multi-word phrases
- \`WORD_ALIASES: Record<string, string[]>\` — maps canonical words to spoken variants (e.g. \`'ci/cd' → ['ci cd', 'cicd', 'continuous integration']\`)
- \`detectWordsWithAliases(...)\` — runs \`detectWords\` then checks aliases map

## Done when
\`detectWords('we should circle back on this', ['circle back'], new Set())\` returns \`['circle back']\`.`,
  },
  {
    title: 'Phase 3: Share utilities',
    description: `Create \`src/lib/shareUtils.ts\`.

## Functions
- \`formatShareText(game: GameState): string\` — builds a shareable text summary:
  - Category name
  - Time elapsed to BINGO (formatted as "X min Y sec")
  - Winning word
  - Squares filled count
  - Link to app (placeholder URL until deployed)
- \`shareResult(game: GameState): Promise<void>\` — tries \`navigator.share()\`; falls back to \`navigator.clipboard.writeText()\`; returns whether clipboard was used

## Done when
\`formatShareText\` returns a non-empty string for a completed game.`,
  },

  // ─── Phase 4 ──────────────────────────────────────────────────────────────
  {
    title: 'Phase 4: useLocalStorage hook',
    description: `Create \`src/hooks/useLocalStorage.ts\`.

## Interface
\`\`\`ts
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
\`\`\`

## Behaviour
- Reads from localStorage on mount (JSON.parse with try/catch fallback to initialValue)
- Writes to localStorage on every state update
- Returns \`[value, setValue]\` like useState

## Done when
A value persists across page refreshes.`,
  },
  {
    title: 'Phase 4: useSpeechRecognition hook',
    description: `Create \`src/hooks/useSpeechRecognition.ts\` — wraps the browser Web Speech API.

## Detection
\`\`\`ts
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
\`\`\`

## Config
\`continuous: true\`, \`interimResults: true\`, \`lang: 'en-US'\`

## Auto-restart
On \`recognition.onend\`, if \`isListening\` is still true, call \`recognition.start()\` again (handles browser auto-stop after silence).

## Return value
\`\`\`ts
{
  isSupported: boolean,
  isListening: boolean,
  transcript: string,        // cumulative final results
  interimTranscript: string, // current partial result
  error: string | null,
  startListening: (onResult?: (t: string) => void) => void,
  stopListening: () => void,
  resetTranscript: () => void,
}
\`\`\`

## Done when
Speech detected in Chrome fills \`transcript\` in real time.`,
  },
  {
    title: 'Phase 4: useBingoDetection hook',
    description: `Create \`src/hooks/useBingoDetection.ts\` — thin reactive wrapper around \`checkForBingo\`.

\`\`\`ts
function useBingoDetection(card: BingoCard | null): WinningLine | null
\`\`\`

Re-runs on every card state change. Returns the winning line or null.

## Done when
Filling the last square in a row causes the hook to return a non-null \`WinningLine\`.`,
  },
  {
    title: 'Phase 4: useGame hook',
    description: `Create \`src/hooks/useGame.ts\` — the central game state orchestrator.

## Responsibilities
- Holds \`GameState\` in React state (+ syncs to localStorage via \`useLocalStorage\`)
- Wraps \`useSpeechRecognition\`; on each new final transcript chunk: calls \`detectWordsWithAliases\` → fills matching squares → calls \`checkForBingo\`
- Exposes:
  - \`game: GameState\`
  - \`speech: SpeechRecognitionState\`
  - \`startGame(categoryId)\` — generates card, sets status to 'playing'
  - \`toggleSquare(row, col)\` — manual fill/unfill
  - \`toggleListening()\` — start/stop speech recognition
  - \`newCard()\` — regenerate card for same category
  - \`resetGame()\` — back to idle

## Done when
Clicking a square updates \`game.card.squares\`; completing a row sets \`game.status\` to \`'won'\`.`,
  },

  // ─── Phase 5 ──────────────────────────────────────────────────────────────
  {
    title: 'Phase 5: UI primitives (Button, Card, Toast)',
    description: `Create shared UI components in \`src/components/ui/\`.

### Button.tsx
- Props: \`variant: 'primary' | 'secondary' | 'ghost'\`, \`size: 'sm' | 'md' | 'lg'\`, all native button props
- Primary: solid blue; Secondary: outlined; Ghost: text only

### Card.tsx
- Simple wrapper: white background, rounded-xl, shadow, padding

### Toast.tsx
- Props: \`toasts: Toast[]\`, \`onDismiss: (id: string) => void\`
- Fixed position (bottom-right), auto-dismiss after \`duration\` ms (default 3000)
- Shows detected buzzword notifications

## Done when
All three components render without TypeScript errors.`,
  },
  {
    title: 'Phase 5: LandingPage component',
    description: `Create \`src/components/LandingPage.tsx\`.

## Layout (per PRD wireframe)
- Hero section: "🎯 Meeting Bingo" heading, tagline "Turn any meeting into a game"
- "New Game" CTA button (primary, large)
- Privacy note: "🔒 Audio processed locally. Never recorded."
- "How It Works" section with 4 numbered steps:
  1. Pick a buzzword category
  2. Enable microphone for auto-detection
  3. Join your meeting and listen
  4. Watch squares fill automatically!

## Props
\`\`\`ts
interface Props { onStart: () => void }
\`\`\`

## Done when
Clicking "New Game" calls \`onStart\`.`,
  },
  {
    title: 'Phase 5: CategorySelect component',
    description: `Create \`src/components/CategorySelect.tsx\`.

## Layout
- "Choose Your Buzzword Pack" heading
- 3 category cards side-by-side (responsive: stack on mobile)
  - Each card: icon (large), name, description, 4 sample words from the word list, "Select" button
- Back button (ghost)

## Props
\`\`\`ts
interface Props {
  onSelect: (categoryId: CategoryId) => void;
  onBack: () => void;
}
\`\`\`

## Done when
Selecting a category calls \`onSelect\` with the correct \`CategoryId\`.`,
  },
  {
    title: 'Phase 5: BingoSquare component',
    description: `Create \`src/components/BingoSquare.tsx\`.

## Visual states
| State | Appearance |
|-------|-----------|
| Default | White bg, gray border, hover scale |
| Filled (manual) | Blue bg, white text, strikethrough |
| Filled (auto) | Blue bg + brief pulse animation |
| Free space | Amber bg, ⭐ FREE text, no click |
| Winning | Green bg + ring highlight |

## Props
\`\`\`ts
interface Props {
  square: BingoSquare;
  isWinningSquare: boolean;
  onClick: () => void;
}
\`\`\`

Free space button is \`disabled\`. Text uses \`break-words\` for long phrases.

## Done when
All 5 visual states render correctly with Tailwind classes.`,
  },
  {
    title: 'Phase 5: BingoCard component',
    description: `Create \`src/components/BingoCard.tsx\`.

## Layout
- 5×5 CSS grid of \`BingoSquare\` components
- Passes \`isWinningSquare={winningSquareIds.has(square.id)}\` to each square

## Props
\`\`\`ts
interface Props {
  card: BingoCard;
  winningLine: WinningLine | null;
  onSquareClick: (row: number, col: number) => void;
}
\`\`\`

Derives \`winningSquareIds: Set<string>\` from \`winningLine.squares\`.

## Done when
Clicking a non-free square calls \`onSquareClick\` with correct row/col.`,
  },
  {
    title: 'Phase 5: TranscriptPanel component',
    description: `Create \`src/components/TranscriptPanel.tsx\`.

## Layout
- Status row: pulsing red dot when listening, mic icon, "Listening..." or "Paused" label
- Transcript area: last 100 chars of final transcript in dark text + italic interim in gray
- Detected words row: badge chips for the last 5 detected words (✨ word)

## Props
\`\`\`ts
interface Props {
  transcript: string;
  interimTranscript: string;
  detectedWords: string[];
  isListening: boolean;
}
\`\`\`

Show "Waiting for speech..." placeholder when transcript is empty.

## Done when
Component renders and updates in real time when \`useSpeechRecognition\` produces output.`,
  },
  {
    title: 'Phase 5: GameControls component',
    description: `Create \`src/components/GameControls.tsx\`.

## Buttons
- **New Card** — regenerates card for same category (secondary button)
- **Start / Stop Listening** — toggles speech recognition (primary when stopped, red when active)
- If \`!isSupported\`: shows a "Manual mode" info badge instead of listening button

## Props
\`\`\`ts
interface Props {
  isListening: boolean;
  isSupported: boolean;
  onNewCard: () => void;
  onToggleListening: () => void;
}
\`\`\`

## Done when
Buttons call their respective callbacks; listening button label changes based on state.`,
  },
  {
    title: 'Phase 5: GameBoard component',
    description: `Create \`src/components/GameBoard.tsx\` — the main game screen.

## Layout
- **Header**: logo text, listening status indicator, "X/24 filled" counter
- **BingoCard** (centre)
- **TranscriptPanel** (below card)
- **GameControls** (below transcript)

## Wiring
- Uses \`useGame\` hook for all state and actions
- Tracks \`detectedWords: string[]\` locally and passes to \`TranscriptPanel\`
- Calls \`onWin(winningLine, winningWord)\` when bingo is detected

## Props
\`\`\`ts
interface Props {
  game: GameState;
  setGame: (g: GameState) => void;
  onWin: (line: WinningLine, word: string) => void;
}
\`\`\`

## Done when
Full game loop works: listen → auto-fill → manual fill → BINGO detected → \`onWin\` fires.`,
  },
  {
    title: 'Phase 5: WinScreen component',
    description: `Create \`src/components/WinScreen.tsx\`.

## On mount
Fire \`canvas-confetti\` with a burst animation (origin centre-top, spread 120°).

## Layout
- "🎉 BINGO! 🎊" heading (large, animated bounce-in)
- Frozen \`BingoCard\` view with winning line highlighted (no click handlers)
- Stats section:
  - ⏱️ Time to BINGO (formatted as "X min Y sec")
  - 🏆 Winning word
  - 📊 Squares filled: X/24
  - Category name
- Two buttons: "📤 Share Result" and "🔄 Play Again"

## Props
\`\`\`ts
interface Props {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}
\`\`\`

## Done when
Confetti fires on mount; share button calls \`shareResult(game)\`.`,
  },
  {
    title: 'Phase 5: App root component',
    description: `Create \`src/App.tsx\` — screen-level state machine.

## Screens
\`'landing' | 'category' | 'game' | 'win'\`

## Flow
\`\`\`
landing → [New Game] → category → [Select] → game → [BINGO] → win
win → [Play Again] → category
win → [Home] → landing
game → [New Card] → game (same category, new card)
\`\`\`

## State
- \`screen\` — current screen
- \`game\` — \`GameState\` (passed down to GameBoard / WinScreen)

## Done when
Full navigation flow works end-to-end without errors.`,
  },

  // ─── Phase 6 ──────────────────────────────────────────────────────────────
  {
    title: 'Phase 6: Production build & Vercel deploy',
    description: `Verify the production build and deploy to Vercel.

## Steps
1. \`npm run build\` — must complete with no TypeScript or build errors
2. \`npm run preview\` — test production build at localhost:4173
3. Run through full game flow in preview (manual fills, speech, bingo, share)
4. \`vercel --prod\` — deploy to Vercel free tier

## Vercel settings
- Framework: Vite (auto-detected)
- Build command: \`npm run build\`
- Output directory: \`dist\`
- No environment variables required (fully client-side)

## Done when
Live Vercel URL loads the app and speech recognition works on mobile Chrome.`,
  },
];

console.log(`Creating ${issues.length} issues in project "Meeting Bingo"...\n`);

for (const issue of issues) {
  await createIssue(issue.title, issue.description, issue.priority ?? 3);
  // small delay to avoid rate limiting
  await new Promise(r => setTimeout(r, 200));
}

console.log('\nDone.');
