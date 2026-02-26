# Meeting Bingo — Product Research

## Problem

Corporate meetings are full of buzzwords. Sitting through phrases like "circle back", "synergy", "move the needle", and "boil the ocean" is mentally taxing. There's no lightweight tool that lets someone passively track buzzword frequency during a live meeting and surface a satisfying moment when a threshold is crossed.

---

## Concept

A **buzzword tracker** that runs in the background during a meeting. The user marks off words as they hear them. When enough buzzwords accumulate, the tool signals "BINGO" — validating the user's pain and providing a moment of dark comedy.

Think: meeting bingo card, but digital, fast, and opinionated.

---

## Core User Story

> As someone stuck in a meeting, I want to tap a buzzword when I hear it so I can track how insufferable this meeting is, and feel vindicated when I hit bingo.

---

## Key Features

### Must Have

| Feature | Description |
|---|---|
| Buzzword grid | A bingo-style card of common corporate buzzwords |
| Tap to mark | One-tap to mark a word as heard |
| Bingo detection | Alerts the user when a row, column, or diagonal is complete |
| Pre-loaded word list | Sensible defaults — no setup required |
| Mobile-friendly | Designed to be used discreetly on a phone under the table |

### Should Have

| Feature | Description |
|---|---|
| Custom word list | User can add/remove words before or during a meeting |
| Session history | View how many times each word was heard |
| Shareable card | Generate a link or image to share the card with a colleague |
| Sound/haptic on bingo | Satisfying (silent) feedback — vibration on mobile |

### Could Have

| Feature | Description |
|---|---|
| Meeting timer | Track how long the meeting has been going |
| Buzzword leaderboard | Most-heard words across all sessions |
| Multiple simultaneous cards | Play with colleagues in the same meeting |
| Dark mode | Discreet low-brightness screen |

---

## Buzzword Starter List

A curated set of common corporate offenders to pre-load:

- Synergy
- Circle back
- Move the needle
- Boil the ocean
- Low-hanging fruit
- Deep dive
- Bandwidth
- Leverage
- Pivot
- Scalable
- Ecosystem
- Deliverable
- Actionable
- Take offline
- Touch base
- Net net
- At the end of the day
- Paradigm shift
- Disruptive
- Value add
- Buy-in
- Alignment
- Ideate
- Learnings
- Drill down
- 30,000-foot view
- Blue-sky thinking
- Drinking the Kool-Aid
- Move fast
- Empower

---

## UX Considerations

- **Discretion is critical.** The interface should look innocuous — no big BINGO text visible to others. Subtle highlighting, dark theme.
- **One-handed use.** Large tap targets. Portrait orientation.
- **Zero friction start.** Open the app, card is ready. No login, no config required to play.
- **Rewarding feedback.** The bingo moment should feel satisfying — animation, haptic, sound (optional).

---

## Technical Approach Options

### Option A — Static Web App (Recommended for v1)

- HTML/CSS/JS or a lightweight framework (e.g. SvelteKit, Vite + React)
- No backend required — all state is local/in-memory
- Deploy to Vercel (already configured in this project)
- Shareable cards via URL hash or `localStorage`

**Pros:** Fast to build, zero infrastructure, works offline
**Cons:** No persistence across devices, limited multi-player

### Option B — Serverless with a Database

- Add a lightweight backend (e.g. Vercel Edge Functions + Upstash/Redis or PlanetScale)
- Enables: session history, shareable rooms, leaderboards

**Pros:** Richer features
**Cons:** More complexity, ongoing cost

### Option C — PWA (Progressive Web App)

- Build Option A as a PWA with offline support and "Add to Home Screen"
- Best of both worlds for mobile experience

**Recommendation:** Start with Option A, design with Option C upgrade path in mind.

---

## Bingo Win Conditions

Standard 5×5 bingo card (25 words, free space in center):

- Any complete row (5 words)
- Any complete column (5 words)
- Either diagonal (5 words)
- **Blackout** — all 25 words (bonus mode)

---

## Open Questions

1. Should the word list be fixed per session or allow mid-meeting edits?
2. Is the 5×5 grid the right size, or would a 4×4 feel less overwhelming on mobile?
3. Multi-player mode — same card or different randomized cards?
4. Should completed words show a count (heard 3×) or just a checkmark?
5. Privacy — should any data ever leave the device in v1?

---

## Success Metrics (informal)

- Someone uses it in an actual meeting and grins
- Bingo is hit at least once per meeting on average
- Zero setup time before a meeting starts

---

## Next Steps

1. Decide on framework (likely SvelteKit or Vite + React given Vercel setup)
2. Design the 5×5 card layout for mobile
3. Implement tap-to-mark and bingo detection logic
4. Ship a v1 with the default word list
5. Gather feedback from real meetings
