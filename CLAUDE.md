# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build (GitHub Pages, base=/Chronos_App/)
npm run lint      # ESLint (flat config, JS/JSX only)
npm run preview   # Preview production build
```

No test framework is configured.

## Dual Build Targets (IMPORTANT)

Vite uses different `base` paths depending on the target:
- **GitHub Pages:** `base: '/Chronos_App/'` — default `npm run build`
- **Android/Capacitor:** `base: './'` — requires `CAPACITOR_BUILD=true npm run build`

> [!CAUTION]
> If you run `npm run build` without `CAPACITOR_BUILD=true` and then `npx cap sync`, the Android app will get assets with `/Chronos_App/` paths and **fail to load**. Always use the correct build for each target.

### When the user says "build" (during development)

Build for Android so changes are visible in Android Studio:
```bash
CAPACITOR_BUILD=true npm run build && npx cap sync
```
No need to build for GitHub Pages during development — that happens automatically on push.

## Android Build

Before any Gradle commands, always run this first:

```bash
export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"
```

## Tech Stack

- **React 19** with Vite 7, pure JavaScript (no TypeScript)
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin
- **ESLint 9** flat config — unused vars matching `^[A-Z_]` are ignored
- ES modules throughout (`"type": "module"`)
- No router library — navigation is state-driven

## Architecture

**Chronos** is a history-learning SPA with lessons, a timeline, and adaptive practice quizzes. All state lives in the browser (localStorage, key `"chronos-state-v1"`).

### State Management

Single React Context + `useReducer` in `src/context/AppContext.jsx`. The `useApp()` hook provides `{ state, dispatch }`.

Key state shape: `completedLessons` (lesson completion counts), `eventMastery` (per-event scores across 4 dimensions: location/date/what/description), `seenEvents`, `starredEvents`, `totalXP`, `currentStreak`, `dailyQuiz` (last completed date/XP/count), `achievements` (unlocked timestamps), `newAchievements` (pending toasts), `totalStudyTime` (cumulative seconds), `studySessions` (last 50 sessions).

Key actions: `COMPLETE_LESSON`, `UPDATE_EVENT_MASTERY`, `ADD_XP`, `MARK_EVENTS_SEEN`, `TOGGLE_STAR`, `UPDATE_STREAK`, `RESET_PROGRESS`, `COMPLETE_DAILY_QUIZ`, `UNLOCK_ACHIEVEMENT`, `DISMISS_ACHIEVEMENT_TOAST`, `RECORD_STUDY_SESSION`, `TOGGLE_SOUND`, `TOGGLE_HAPTICS`.

### Routing

No router — `App.jsx` uses `activeTab` state (`'learn'` | `'timeline'` | `'practice'`) to switch pages. Pages manage their own internal view states (e.g., PracticePage has hub/collection/session/results views).

### Data Layer (`src/data/`)

- **`events.js`** — `ALL_EVENTS`: 137 core events (60 Level 1 + 77 Level 2) + 30 daily quiz events, each with `id`, `title`, `year`, `yearEnd` (for ranges), `location`, `category`, `difficulty` (1-3)
- **`lessons.js`** — `LESSONS`: 21 Level 1 lessons (0-20). Lesson 0 is special (era overview, no events). Lessons 1-20 each have exactly 3 `eventIds`. `LEVEL2_CHAPTERS`: 8 thematic chapters (32 lessons) with independent progression
- **`quiz.js`** — Quiz generation and scoring. Date scoring uses magnitude-based tolerances: prehistoric scales by order of magnitude (millions ±1M, 100Ks ±100K, etc.), medieval ±50, early modern exact+±5, modern exact+±3. Range events get 25% span bonus. XP calculated from difficulty × score
- **`dailyQuiz.js`** — 10 days of daily quiz content (30 real historical events). Cycling: `dayIndex = daysSinceEpoch % 10`. Each day has 3 events with learn-then-quiz flow
- **`achievements.js`** — 15 achievements across 7 categories + `useAchievementChecker()` hook that runs on state changes

### Map System

**Data pipeline** (`scripts/write-map-data.mjs`):
- Reads `world-atlas/countries-110m.json` (TopoJSON, Natural Earth 110m resolution)
- Uses `d3-geo`'s Natural Earth I projection to convert GeoJSON country polygons → SVG path strings
- Groups countries **by continent** (Europe, Middle East, Africa, Asia, Americas) with individual per-country SVG paths preserved (ISO code + name + path string per country)
- Outputs `src/data/mapPaths.js` (~91KB) containing `MAP_REGIONS`, `SUB_REGIONS`, `REGION_CENTERS`, and `projectToSVG()`
- Regenerate with: `node scripts/write-map-data.mjs`

**Rendering** (`src/components/MapView.jsx`):
- Pure inline SVG, 800×500 viewBox, zero external map libraries
- Per-country `<path>` elements grouped by continent, graticule grid as `<polyline>`
- Event pins placed via `projectToSVG(lat, lng)` — same Natural Earth I polynomial at runtime as at build time
- Grid-based clustering: 25 SVG-unit cells group nearby pins; cluster pins show count badge
- Pinch-zoom via CSS `transform: scale()` + custom touch pan handler (max 4×); desktop wheel zoom via `onWheel`
- Fullscreen mode: 280% width SVG inside a scrollable container, centered on Europe/Middle East; auto-scrolls to selected region
- Animated pin entrance: staggered scale+fade pop-in (30ms per pin) via CSS `mapPinEntrance` keyframes

**Region system**: 11 sub-regions (Europe, Middle East, N/W/E/S Africa, S/E Asia, N/C/S America) → 5 continent SVG groups. `COUNTRY_TO_SUBREGION` maps ~170 ISO country codes to sub-regions. `REGION_COLORS` defines pastel (unselected) and vibrant (selected) color pairs for each sub-region via CSS custom properties (22 light + 22 dark mode variables in `index.css`).

**Sub-region interaction**: Tapping any country selects its sub-region — the region transitions from pastel to vibrant color, other regions dim to 0.4 opacity, and a `RegionEventList` component shows learned events for that region below the map. `feedback.tap()` plays on selection. Tapping the same region again deselects it. All learned events always appear on the map regardless of region filter. `getCountryFill()` helper in MapView determines fill color based on country code and selected region.

**Pin interaction**: single pin → event popup card; cluster pin → expandable event list. All learned events (in `seenEvents`) appear on the map. Selecting an event highlights its country (gold fill) using `EVENT_COUNTRY_MAP` (event ID → ISO country code, generated by the data pipeline).

**Strengths**: zero runtime map deps, offline-capable, deterministic projection, fast render, clean regeneration pipeline.

**Known limitations for future expansion**:
- 110m resolution — coastlines look chunky when zoomed; would need 50m or 10m for detail
- Clustering doesn't adapt to zoom level — fixed grid regardless of scale
- CSS-only zoom — just scales the SVG, no re-render at higher detail (no semantic zoom)
- No hover states on map features

### Lesson Flow (`src/components/learn/LessonFlow.jsx`)

8-phase flow: INTRO → PERIOD_INTRO → (LEARN_CARD → LEARN_QUIZ) × 3 events → RECAP_TRANSITION → RECAP (6 questions) → FINAL_REVIEW → SUMMARY. Each lesson produces 12 total questions. All flows (lessons, practice, daily quiz) auto-track duration via `useRef` timer and dispatch `RECORD_STUDY_SESSION` on completion.

### Mastery System

Each event is scored on 4 dimensions (location, date, what, description), each `'green'` (3pts) | `'yellow'` (1pt) | `'red'` (0pts) | `null`. Overall mastery is 0-12. Mastery is updated by lessons (learn + recap phases), practice sessions, and daily quiz ("what" dimension only). Displayed via `MasteryDots` component across Timeline, Map, Practice, and Settings.

### Description Question Difficulty Tiers

Description questions use hand-crafted distractors from `src/data/descriptionDistractors.js` (137+ events covered). Each event has distractors across 3 difficulty tiers:

- **d:1** — clearly wrong but topically adjacent
- **d:2** — plausible but with wrong details
- **d:3** — very subtle, nearly correct but one key detail is off. Also switches the correct answer to `hardCorrect` (a non-obvious true statement)

`generateDescriptionOptions(event, allEvents, difficulty)` in `quiz.js` selects distractors preferring the requested tier. **Difficulty is context-dependent:**

| Context | Difficulty | Rationale |
|---------|-----------|-----------|
| Lesson learn phase | 1 | Reinforcement — just read the card |
| Lesson recap phase | 2 | Retention test — plausible distractors |
| Practice (mastery 0-6) | 2 | Still building knowledge |
| Practice (mastery 7-12) | 3 | Challenge — hardCorrect + subtle distractors |
| Placement quiz | 2 | Fair knowledge test |
| Daily quiz | N/A | Only asks "what happened?" (title MCQ) |

When modifying quiz difficulty logic, update this table and the changelog.

### Fun Facts (`src/data/funFacts.js` + `src/components/FunFactsFlow.jsx`)

Casual endless MCQ quiz in the Challenge hub. 20 curated trivia questions tied to specific event cards. Each fun fact has a question, 4 options (1 correct + 3 wrong), and a "Did you know?" explanation. Facts cover surprising details NOT found in card descriptions.

**Key behavior:** All facts are available from the start (not gated by learned events). Unseen facts are shown first; once all discovered, cycles randomly. State tracked via `seenFunFacts` array in AppContext. The hub card shows "X/Y discovered" progress.

**Adding a new fun fact:** Add to `FUN_FACTS` array in `src/data/funFacts.js` with id format `'ffXX'`, must include `eventId` referencing an existing event. Ensure the fact content doesn't duplicate the event's `description` or `quizDescription`.

### Challenge Mode (`src/data/challengeQuiz.js` + `src/pages/ChallengePage.jsx`)

Two modes: **Solo Challenge** (tiered progression, 35 questions) and **Multiplayer** (pass-the-phone, 1-5 players).

**Question types** (no `categorySort` — removed because categories are editorial, not historical facts):

| Type | Description | Tests |
|------|-------------|-------|
| whichCameFirst | Two events, pick the earlier one. Prefers same-era pairs. | date |
| eraDetective | Given event title, guess which of 5 eras. Description stripped of years/era keywords. | date |
| trueOrFalse | Conceptual misconceptions only (NOT database field swaps). Shows correction text for false. Uses `CURATED_TF_POOL` (20 questions). | what |
| hardMCQ | 4 subtypes: location (same-region distractors), date (tight era-adjacent), what (same-category+era titles), description (same-category+era). | varies |
| oddOneOut | 4 events, 3 share a trait (category/era/region), find the outlier. | what |
| causeAndEffect | "What was a direct consequence of X?" using `EVENT_CONNECTIONS`. Fallback when T/F pool exhausted. | what |
| chronologicalOrder | (God tier only) Arrange 5 events earliest to latest. Prefers same-era events. | date |

**Solo tiers** (types available per tier):

| Tier | Questions | Types |
|------|-----------|-------|
| Beginner | 5 | whichCameFirst, eraDetective, trueOrFalse |
| Amateur | 7 | eraDetective, whichCameFirst, trueOrFalse, hardMCQ |
| Advanced | 8 | hardMCQ, trueOrFalse, whichCameFirst, oddOneOut |
| Historian | 8 | whichCameFirst, oddOneOut, hardMCQ, trueOrFalse |
| Expert | 5 | whichCameFirst, oddOneOut, hardMCQ |
| God | 2 | chronologicalOrder |

**Curated vs dynamic:** Beginner & Amateur use hand-picked question pools (`BEGINNER_QUESTIONS`, `AMATEUR_QUESTIONS`) with specific events and carefully crafted distractors. Advanced+ use dynamic generation with `filterPoolForTier()` to select difficulty-appropriate events.

**Pool building:** `buildChallengePool(seenEventIds)` creates 70/30 unseen/seen split, sorted by difficulty. Pools split into `level1` (core events) and `level2` (chapter events f61+). From question 3, ~1-in-3 questions draw from Level 2; never 3+ consecutive from the same level.

**Hearts:** Start with 3, bonus heart at tier transitions entering Advanced+ (max 5). Game over at 0 hearts.

**Near-miss feedback:** Date MCQ wrong answers within ~15% of correct year (or ≤50 years) show "Close!" badge + `feedback.close()` sound.

**Multiplayer:** Difficulty ramps from 70/30 easy/hard to 30/70 as game progresses. 60% of T/F pulls from `CURATED_TF_POOL`. Type repetition prevention (no 3+ in a row). XP only counts the "me" player's score.

**Design principles for new questions:**
- T/F: conceptual misconceptions only, false statements must sound plausible, always include `correction` text
- hardMCQ/location: same-region/country distractors (not just same continent)
- hardMCQ/date: tight distractors in same era (eliminate pure guessing)
- whichCameFirst: pair events where order is genuinely surprising
- No event should repeat between tiers (usedEventIds prevents this)

### Design System

Defined in `src/index.css` via `@theme` block. Key colors: parchment (#FAF6F0), burgundy (#8B4157), ink (#1C1917). Fonts: "Libre Baskerville" (serif/display), "DM Sans" (body). Mobile-first layout capped at 440px width, 850px height with phone-like frame on desktop.

Reusable UI primitives (Button, Card, MasteryDots, CategoryTag, ProgressRing) are in `src/components/shared.jsx`.

### Key Patterns

- Lessons unlock sequentially (must complete previous lesson)
- Event categories: `'science'` | `'war'` | `'politics'` | `'culture'` | `'revolution'`
- Eras: Prehistory (<-3200), Ancient (-3200–500), Medieval (500–1500), Early Modern (1500–1800), Modern (1800+)
- CSS animations defined in `index.css` (fadeInUp, slideInRight/Left, mascotFloat, etc.)
- Streaks reset if gap > 1 day

### Adding Content

**New event:** Add to `ALL_EVENTS` in `src/data/events.js` with id format `'fXX'`, must include year, location, category, difficulty.

**New lesson:** Add to `LESSONS` in `src/data/lessons.js` with exactly 3 eventIds for regular lessons.

### Streak & Flame Icon (`src/components/StreakFlame.jsx`)

**Streak status** is computed from `lastActiveDate` + `currentStreak` via `getStreakStatus()` (defined locally in `TopBar.jsx`, `WeekTracker.jsx`, and `widgetBridge.js`):
- **`active`** — studied today. Orange/yellow flame + dark-green checkmark (brown outline) in upper-right.
- **`at-risk`** — last active yesterday, hasn't studied today. Red flame + small clock badge in upper-right.
- **`inactive`** — streak is 0 or gap > 1 day. Grey translucent flame, no badge.

The `StreakFlame` component is a pure inline SVG (viewBox `-2 -2 28 28`) with three visual layers: campfire logs, flame shape (color varies by status), and an optional badge overlay. Used in TopBar (18px), WeekTracker (32px), Settings (22px), and LessonFlow summary (28px). CSS animations (`streak-flame--active`, `streak-flame--at-risk`) are in `index.css`.

`FLAME_COUNT_COLORS` export provides matching text colors for the streak count number beside the flame.

### Streak Celebration (`src/components/StreakCelebration.jsx`)

Brief overlay shown when the user earns their streak for the day (first lesson/practice/daily quiz/challenge completion). Shows the flame crossfading from its previous state (grey or red) to active orange, a green checkmark badge popping in, the streak count, and "Streak started!"/"Streak extended!" text. Auto-dismisses after ~3s or on tap.

Integrated in: `LessonFlow.jsx`, `Lesson0Flow.jsx`, `PracticePage.jsx`, `DailyQuizFlow.jsx`, `ChallengePage.jsx`. Each detects whether `lastActiveDate !== today` before dispatching `ADD_XP`, captures the previous streak status, and shows the celebration via `setTimeout` after 600ms.

### Feedback Service (`src/services/feedback.js`)

Module-level sound + haptics service. `configure({ soundVolume, hapticsEnabled })` is called from AppContext on every state persist. All sounds use Web Audio API (sine oscillators with lowpass filtering, no audio files). Haptics use `@capacitor/haptics` (graceful no-op on web).

**Quiz feedback sounds:** `correct()`, `wrong()`, `close()`, `complete()`, `achievement()`, `heartLost()`, `gameOver()`, `forScore(score)`. Layered sine tones through lowpass filter for warm marimba-like timbre.

**UI micro-interaction sounds:** `tap()` (Button clicks), `select()` (quiz option pick), `tabSwitch()` (tab navigation), `cardReveal()` (learn card appears), `modalOpen()` (settings/confirm modals), `toggleClick()` (switch toggles), `starPing()` (star/unstar). These use a lightweight `playTick` primitive (single filtered sine, 35–120ms). `tap()` is wired into the shared `Button` component; `starPing()` into `StarButton`; others are called at specific integration points.

### Android Widgets

Two home screen widgets (Streak + Quick Practice) use the `capacitor-widget-bridge` plugin (v8.0.0) to bridge data from the web layer to native Android `SharedPreferences`.

**Data flow:** React state change → `syncWidgetData()` in `src/services/widgetBridge.js` writes `currentStreak` and `totalXP` to SharedPreferences (group `"group.com.elsadonnat.chronos.widgets"`) → calls `reloadAllTimelines()` → native `AppWidgetProvider.onUpdate()` reads SharedPreferences and updates the widget UI via `RemoteViews`.

**Key files:**
- `src/services/widgetBridge.js` — JS bridge (`initWidgets()`, `syncWidgetData()`)
- `android/.../com/elsadonnat/chronos/StreakWidget.java` — Streak widget provider
- `android/.../com/elsadonnat/chronos/QuickPracticeWidget.java` — Quick Practice widget provider
- `android/.../res/layout/widget_streak.xml`, `widget_quick_practice.xml` — Widget layouts
- `android/.../res/xml/streak_widget_info.xml`, `quick_practice_widget_info.xml` — Widget metadata
- `android/.../res/drawable/widget_background.xml` — Shared rounded parchment background
- `MainActivity.java` — Handles `openTab` intent extra for Quick Practice deep-link

**Adding a new data field to widgets:**
1. Add `WidgetBridgePlugin.setItem()` call in `syncWidgetData()` (`src/services/widgetBridge.js`)
2. Read from `SharedPreferences` in the Java widget provider's `updateWidget()` method
3. Add a `TextView` (or similar) in the widget layout XML and set it via `RemoteViews.setTextViewText()`

**SharedPreferences group name:** `"group.com.elsadonnat.chronos.widgets"` — must match exactly between JS and Java.

**Widget UI limitations:** Widgets use `RemoteViews`, which supports only a limited set of views (`LinearLayout`, `TextView`, `ImageView`, etc.). No custom fonts, no complex animations, no WebView.

## Housekeeping (IMPORTANT — do this after every substantial change)

After each substantial change to features, UX/UI, or mechanics:

1. **Check if `CLAUDE.md` needs updating** — keep architecture docs, tables, and patterns current
2. **Check if `README.md` needs updating** — if it describes features that changed
3. **Add the change to `CHANGELOG.md`** under the current version
4. **Bump the version** in `package.json` by `+0.0.1` (patch) for most changes. Use `+0.1.0` (minor) for new features or significant redesigns. Use your judgement — the goal is that these files stay up to date at all times, but are not cluttered with trivial details or tiny fixes.

> Do NOT skip this. These docs are the source of truth for new agents picking up the codebase. Stale docs cause wasted time and wrong assumptions.

## Versioning

The **single source of truth** for the app version is `"version"` in `package.json`. The Android `versionCode` is **automatically derived** from it in `android/app/build.gradle` using the formula: `major × 10000 + minor × 100 + patch`.

| package.json version | Android versionCode |
|----------------------|---------------------|
| `"1.0.0"`            | 10000               |
| `"1.5.2"`            | 10502               |
| `"2.1.0"`            | 20100               |

> [!CAUTION]
> If you forget to bump the version, the Google Play Store will reject the AAB upload because the versionCode must be strictly higher than any previously uploaded version. Never hardcode versionCode in `build.gradle`.

## Commit & Push Workflow (IMPORTANT)

**Do NOT commit immediately after making changes.** The user will review first. Only commit when the user explicitly says to commit/push.

### When the user says "commit" or "push":

1. **Build for Android (Capacitor) first:**
   ```bash
   CAPACITOR_BUILD=true npm run build
   npx cap sync
   ```
2. **Build Android AAB:**
   ```bash
   export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"
   cd android && ./gradlew.bat bundleRelease
   ```
3. **Rebuild for GitHub Pages** (so the committed `dist/` or deploy workflow uses the right base path):
   ```bash
   npm run build
   ```
4. **If all builds succeed**, commit and push:
   ```bash
   git add <relevant files>
   git commit -m "<version> — <summary>"
   git push origin main
   ```

> The push triggers the GitHub Pages deploy workflow which rebuilds from source, so step 3 is mainly a sanity check. The critical thing is that `npx cap sync` in step 1 uses the Capacitor build.

### Commit message format

The commit message must include:
- **The current version number** (e.g., `v1.6.8`)
- **A summary of ALL changelog entries since the last pushed commit** — not just the latest version. If multiple versions were worked on locally before pushing (e.g., v1.6.8 and v1.6.9), the commit message should summarize changes from both.

Check `git log` to find the last pushed version, then gather all changelog entries after it.

Example: if v1.6.7 was the last push and you're now at v1.6.9:
```
v1.6.9 — Context-aware description difficulty, daily quiz mastery tracking, welcome-back modal

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### What the push triggers

- **GitHub Pages** — the deploy workflow (`.github/workflows/deploy.yml`) automatically builds and deploys the web app on every push to `main`
- **Android (phone)** — `npx cap sync` copies the web build into the Android project; the AAB from `gradlew bundleRelease` is at `android/app/build/outputs/bundle/release/` ready for Play Store upload

### Publishing releases

- **GitHub releases**: `gh` CLI is **not installed**. To create a release, push a git tag (`git tag vX.Y.Z && git push origin vX.Y.Z`) and the user will create the release from GitHub's web UI or from Android Studio.
- **Play Store**: The user uploads the AAB from Android Studio — not from the command line. Do NOT attempt to use `gh` or any CLI tool for releases.

## Multi-Agent Workflow (Worktrees)

The user often runs multiple Claude Code agents in parallel. To avoid conflicts, each agent works in its own **git worktree** on a separate branch.

### If you are a secondary agent (not on `main`):

1. **You are already in a worktree** — check with `git branch` to confirm
2. **Work normally** — make changes, but do NOT commit to `main` or push
3. **Commit to your feature branch** when done (the user or the main agent will merge later)
4. **Do NOT run the full build & push workflow** — that's only for the main agent on `main`
5. **Do NOT bump the version or update CHANGELOG** — the main agent handles housekeeping after merge

### If you are the main agent (on `main`) and need to merge a worktree branch:

```bash
git merge <branch-name>        # merge the feature branch
git branch -d <branch-name>    # clean up the branch
git worktree remove <path>     # clean up the worktree folder
```

### Handling merge conflicts (IMPORTANT)

> [!CAUTION]
> **NEVER silently resolve merge conflicts.** Another agent made those changes for a reason you don't know about.

When you encounter a merge conflict:

1. **Stop.** Do not auto-resolve or pick a side.
2. **Explain the conflict to the user** — show which files conflict, what your version says vs. what the other branch says, and what the difference means.
3. **Ask the user what to do.** The other agent's changes may be intentional, may depend on other changes you haven't seen, or may represent a design decision the user made. You don't have full context — the user does.
4. **Assume the other changes have a reason.** Even if they look wrong or redundant to you, another agent may have been following different instructions. Never delete or overwrite another agent's work without explicit user approval.

This also applies to **unexpected code you didn't write** — if you see unfamiliar changes in files you're working on (e.g., from a recently merged branch), do NOT revert or "clean up" those changes. Ask the user first.

> [!CAUTION]
> **NEVER discard, revert, or `git checkout --` any changed file without asking the user first.** This includes uncommitted changes, stash pops, and diffs that look "stale" or redundant after a merge. You cannot know whether those changes are intentional. Even if a diff looks like it reverts something already committed, the user may have made that change on purpose. **Always ask before running `git checkout --`, `git restore`, or discarding any diff.**

### Rules to minimize conflicts:

- Each agent should work on **different files/features** when possible
- Avoid both agents editing `index.css`, `AppContext.jsx`, or `shared.jsx` simultaneously — these are high-traffic files
- The main agent on `main` owns housekeeping (CHANGELOG, version bump, CLAUDE.md updates)

## Gotchas

- **Unicode en-dashes in source files:** Many strings in this codebase use `\u2013` (en-dash `–`), not a regular hyphen-minus (`-`). When editing these strings with the Edit tool, you must use the exact `\u2013` character or the match will fail. If an edit fails on a string containing dashes, check the encoding with `node -e` first.
- **Capacitor asset generation:** The command is `npx @capacitor/assets generate` with no flags. There is no `--splash`, `--splashOnly`, or `--iconOnly` option — it always regenerates everything (icons + splash).
- **CRLF line endings:** This is a Windows project. Git may warn about LF→CRLF conversion — these warnings are harmless and can be ignored.
- **After any visual/asset changes:** Always run `npm run build && npx cap sync` to propagate web build into the Android project.
