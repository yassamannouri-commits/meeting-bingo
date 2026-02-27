# New Categories: Traffic, Kids, Hockey

## Overview

Add three new word-pack categories to Meeting Bingo. The app's architecture is fully data-driven — `CategorySelect` renders from `CATEGORIES.map()` and all game logic is category-agnostic — so the required changes are minimal and isolated to two files.

---

## Files to Change

### 1. `src/types/index.ts`

Extend the `CategoryId` union type:

```ts
// Before
export type CategoryId = 'agile' | 'corporate' | 'tech';

// After
export type CategoryId = 'agile' | 'corporate' | 'tech' | 'traffic' | 'kids' | 'hockey';
```

### 2. `src/data/categories.ts`

Append three new `Category` entries to the `CATEGORIES` array.

---

## Proposed Word Lists

Each list has 45 words — matching the existing packs — giving good card variety across replays (25 drawn per game).

### Traffic `🚗`
**Name:** Traffic & Commute
**Description:** Gridlock, detours, and road rage

```
construction, detour, bottleneck, merge, gridlock, traffic jam, road rage,
rubbernecking, on-ramp, carpool, rideshare, commute, toll, speed trap,
fender bender, right of way, yield, roundabout, HOV lane, tailgating,
pothole, lane change, backup, reroute, accident, GPS, ETA, rush hour,
freeway, exit ramp, overpass, interchange, shoulder, hazard lights,
four-way stop, passing lane, work zone, road closure, signal timing,
pedestrian crossing, crosswalk, left turn, U-turn, parallel park, one-way
```

### Kids `🧒`
**Name:** Parenting & Kids
**Description:** Snack time, tantrums, and school runs

```
snack time, timeout, playdate, tantrum, screen time, homework, bedtime,
nap time, school run, after school, extracurricular, soccer practice,
teacher, report card, permission slip, field trip, birthday party,
sleepover, grounded, allowance, chores, pediatrician, summer camp,
daycare, drop off, pickup, lunchbox, parent-teacher, meltdown, sippy cup,
storytime, bath time, playgroup, babysitter, stroller, car seat,
potty training, show and tell, finger painting, snack bag, juice box,
backpack, spelling test, science fair, book report
```

### Hockey `🏒`
**Name:** Hockey Night
**Description:** Slap shots, power plays, and overtime

```
puck, slap shot, goalie, hat trick, power play, penalty, overtime, icing,
offside, breakaway, checking, crease, face-off, period, penalty box,
blue line, red line, wrist shot, body check, assist, shutout, five-hole,
save, rebound, empty net, delayed penalty, two-man advantage, line change,
forecheck, backcheck, deke, saucer pass, one-timer, wraparound, top shelf,
glove save, pad save, pull the goalie, double minor, fighting major,
high sticking, cross-checking, holding, trip, delay of game
```

---

## No UI Changes Required

`CategorySelect` is fully data-driven (`CATEGORIES.map()`). Adding entries to `CATEGORIES` will automatically render new cards in the selection screen. No component changes needed.

---

## Verification Steps

1. `npm run typecheck` — passes after `CategoryId` is extended
2. `npm run build` — clean build with new word packs included
3. Open category select — three new cards appear below the existing three
4. Play a round with each new category — card generates, speech detection works, win screen fires on bingo
5. Deploy: `vercel --prod --yes`
