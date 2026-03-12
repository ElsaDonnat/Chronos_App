# CLAUDE.md — AI Safety Learning App

> This file is the single source of truth for Claude Code agents working on this project.
> Read it fully before making any changes.

## What This Project Is

This is an **AI Safety learning app** — a mobile-first SPA that teaches users about AI safety, alignment, governance, and AI progress through interactive lessons, spaced repetition practice, and challenge quizzes.

**Current state:** The codebase is a **copy of the Chronos history-learning app**. Your job is to transform it into the AI Safety app by keeping all the reusable infrastructure and replacing history-specific content/features with AI safety equivalents.

---

## Build & Dev Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build (GitHub Pages, base=/AI-Safety-/)
npm run lint      # ESLint (flat config, JS/JSX only)
npm run preview   # Preview production build
```

No test framework is configured.

### Dual Build Targets

Vite uses different `base` paths depending on the target:
- **GitHub Pages:** `base: '/AI-Safety-/'` — default `npm run build`
- **Android/Capacitor:** `base: './'` — requires `CAPACITOR_BUILD=true npm run build`

> [!CAUTION]
> If you run `npm run build` without `CAPACITOR_BUILD=true` and then `npx cap sync`, the Android app will get wrong asset paths and **fail to load**.

---

## Tech Stack

- **React 19** with Vite 7, pure JavaScript (no TypeScript)
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin
- **ESLint 9** flat config — unused vars matching `^[A-Z_]` are ignored
- ES modules throughout (`"type": "module"`)
- No router library — navigation is state-driven
- **Capacitor 8** for Android (added later)

---

## App Architecture

### Tabs (4 main views)

| Tab | Purpose | Equivalent in Chronos |
|-----|---------|----------------------|
| **Learn** | Structured lessons organized by topic | Learn tab |
| **Library** | Browsable reference of all learned cards | Replaces Timeline — **NEW, must be created** |
| **Practice** | Spaced repetition review sessions | Practice tab |
| **Challenge** | Tiered quiz game (solo + multiplayer) | Challenge tab |

### Content Structure: Topics → Cards

Instead of historical eras and events, this app uses **Topics** and **Cards**:

#### Topics (replace "eras" / "levels")
Topics are the top-level organizational unit. Examples:
- Interpretability
- AI Agents
- Automation
- Regulation
- Cybersecurity
- Value Alignment
- etc.

Each **topic** has:
- A **foundational card** — a special overview card that introduces the topic (equivalent of Chronos's "era card" / Lesson 0)
- Multiple **sub-topic cards** — the actual learning content taught in lessons

#### Cards (replace "events")
Each card teaches one concept. Data shape:

```js
{
  id: 'c1',                    // 'c' prefix
  title: 'Value Alignment',
  summary: 'A brief one-line summary shown on card previews',
  description: 'Detailed explanation shown on learn cards...',
  quizDescription: 'Alternative description used in quiz questions...',
  topic: 'alignment',          // primary topic
  secondaryTopic: null,        // optional second topic (or null)
  category: 'technical',       // for visual styling (see categories)
  difficulty: 1,               // 1-3
  tags: ['alignment-problem', 'agi'],  // free-form tags for filtering & linking
  linkedCards: ['c5', 'c12'],  // explicit links to related cards
  importance: 1,               // display ordering weight
  isFoundational: false,       // true for topic overview cards
}
```

> **No year, yearEnd, location, lat, lng fields.** Those are history-specific and must be removed.

#### Categories (for visual styling — replace history categories)

| Category | What it covers | Suggested color |
|----------|---------------|-----------------|
| `technical` | ML concepts, architectures, capabilities | Teal |
| `alignment` | Alignment techniques, interpretability, RLHF | Purple |
| `policy` | Regulation, governance, international coordination | Blue |
| `ethics` | Bias, fairness, rights, societal impact | Green |
| `risks` | Existential risk, misuse, dual-use, catastrophic scenarios | Red/Orange |

#### Tags
Tags are free-form strings attached to cards. Uses:
- Cross-topic linking (e.g., tag `regulation` on a card in the "Cybersecurity" topic)
- Filtering in the Library view
- Location tagging (e.g., `EU`, `USA`, `China`) for cards about regional policy
- Concept grouping (e.g., `fast-takeoff`, `slow-takeoff`, `mesa-optimization`)

### Mastery System

Each card is scored on **3 dimensions** (reduced from Chronos's 4):

| Dimension | What it tests | Quiz format |
|-----------|--------------|-------------|
| `what` | Core definition — "What is X?" | MCQ with definition options |
| `why` | Significance — "Why does X matter for AI safety?" | MCQ with reasoning options |
| `how` | Mechanics — "How does X work / how to address it?" | MCQ with description options |

Each dimension: `'green'` (3pts) | `'yellow'` (1pt) | `'red'` (0pts) | `null`
**Overall mastery: 0–9** (3 dimensions × 3 points each)

> Chronos used 4 dimensions (location, date, what, description) with mastery 0–12.
> Update ALL references to 4 dimensions → 3, and 0–12 → 0–9.

### Lesson Flow

Keep the 8-phase flow from Chronos, adapted:

```
INTRO → TOPIC_INTRO → (LEARN_CARD → LEARN_QUIZ) × N cards → RECAP_TRANSITION → RECAP → FINAL_REVIEW → SUMMARY
```

- `PERIOD_INTRO` → renamed `TOPIC_INTRO` (introduces the topic, not a historical period)
- Each lesson teaches cards from one topic
- Foundational cards (topic overviews) are taught in a special first lesson per topic
- `N` = configurable cards per lesson (1, 2, or 3) — keep the `cardsPerLesson` setting from Chronos

### Lessons Structure

```js
// Topics (top-level)
export const TOPICS = [
  { id: 'interpretability', title: 'Interpretability', description: '...', icon: '...', color: '...' },
  { id: 'agents', title: 'AI Agents', description: '...', icon: '...', color: '...' },
  // ...
];

// Lessons within topics
export const LESSONS = [
  {
    id: 0,
    topic: 'interpretability',
    title: 'What is Interpretability?',
    isFoundational: true,    // topic overview lesson
    cardIds: ['c1'],         // foundational card
  },
  {
    id: 1,
    topic: 'interpretability',
    title: 'Mechanistic Interpretability',
    cardIds: ['c2', 'c3', 'c4'],  // 3 cards per lesson
  },
  // ...
];
```

### Onboarding

Simplified from Chronos (no placement quiz):
1. **Welcome screen** — app name, brief tagline, mascot
2. **Topic overview** — brief intro to what you'll learn
3. **Start first lesson** — jump straight into the first foundational lesson

Remove: `PlacementQuizFlow.jsx`, `placementQuiz.js`, all placement-related state (`placementQuizzes`, `skippedEvents`, `onboardingStep` values related to placement).

### Quiz Types

#### KEEP (adapt for AI safety concepts):
- **MCQ** — what/why/how dimensions, 4 options
- **True/False** — conceptual misconceptions about AI safety, with correction text
- **Odd One Out** — 4 cards, 3 share a trait (category/topic/tag), find the outlier
- **Concept Relationships** — "Which concept is most related to X?" (replaces causeAndEffect, uses `linkedCards`)
- **Hard MCQ** — same 4 subtypes but: what (same-category titles), how (same-category descriptions), why (plausible reasoning distractors). **No location or date subtypes.**

#### REMOVE (history-specific):
- `whichCameFirst` — time-based comparison
- `eraDetective` — era guessing
- `chronologicalOrder` — time ordering
- All date scoring logic (magnitude-based tolerances, year ranges, etc.)
- All location scoring logic
- `hardMCQ/location` subtype
- `hardMCQ/date` subtype

#### ADD (new for AI safety):
- **Tag Match** — "Which tag/concept is most associated with X?" (uses `tags` field)
- Consider later: scenario-based questions, risk assessment questions

### Challenge Mode Tiers

Adapt tiers but keep the hearts system, progression, multiplayer:

| Tier | Questions | Types |
|------|-----------|-------|
| Beginner | 5 | MCQ (what), trueOrFalse |
| Amateur | 7 | MCQ (what/why), trueOrFalse, conceptRelationship |
| Advanced | 8 | hardMCQ, trueOrFalse, oddOneOut |
| Expert | 8 | hardMCQ, oddOneOut, conceptRelationship |
| Master | 5 | hardMCQ, oddOneOut |
| Visionary | 2 | Special (TBD — could be multi-step reasoning) |

---

## Files: What to DELETE, KEEP, and ADAPT

### DELETE these files (history-specific, not needed):

```
src/components/MapView.jsx           — Map view (history maps)
src/components/ConcurrentView.jsx    — "What happened at the same time" view
src/components/LessonIcon.jsx        — History-era SVG icons
src/components/learn/PlacementQuizFlow.jsx — Era placement quiz
src/components/learn/Lesson0Flow.jsx — Era overview lesson (replace with topic intro)
src/pages/TimelinePage.jsx           — Timeline view
src/data/mapPaths.js                 — SVG map path data (~144KB)
src/data/placementQuiz.js            — Placement quiz config
src/utils/timeSlider.js              — Time slider utilities
scripts/write-map-data.mjs           — Map data generation script
```

### KEEP these files AS-IS (fully reusable, zero changes needed):

```
src/data/spacedRepetition.js         — SM-2 spaced repetition algorithm
src/services/feedback.js             — Sound engine (Web Audio API)
src/services/ambientMusic.js         — Background music
src/services/notifications.js        — Push notification service
src/services/share.js                — Social sharing
src/services/widgetBridge.js         — Android widget bridge
src/components/StreakFlame.jsx        — Streak flame SVG icon
src/components/StreakCelebration.jsx  — Streak celebration overlay
src/components/WeekTracker.jsx       — Weekly activity tracker
src/components/NotificationOnboarding.jsx — Notification permission flow
src/components/WelcomeBackModal.jsx   — Welcome-back modal
eslint.config.js                      — ESLint configuration
```

### ADAPT these files (keep structure, change content):

#### Config files:
- `package.json` — Rename to `ai-safety`, version `0.1.0`, remove `d3-geo`, `topojson-client`, `world-atlas` from devDependencies. Keep all other deps.
- `vite.config.js` — Change `base` from `/Chronos_App/` to `/AI-Safety-/`
- `capacitor.config.ts` — Change `appId` to `com.elsadonnat.aisafety`, `appName` to `AI Safety`, update colors
- `index.html` — Update title, meta description, favicon reference

#### Data files:
- `src/data/events.js` → **rename to** `src/data/concepts.js` — New data shape (see "Cards" above). Start with **empty arrays** + helper functions (`ALL_CONCEPTS = []`, `getConceptById()`, `getConceptsByTopic()`, `getConceptsByTag()`). Add 3-5 placeholder concepts so the app renders.
- `src/data/lessons.js` — New structure with TOPICS array + LESSONS array. 2-3 placeholder lessons.
- `src/data/quiz.js` — Remove date/location scoring. Remove era-based tolerances. Keep MCQ generation, adapt for 3 mastery dimensions (what/why/how). Remove `generateDateOptions`, `scoreDateAnswer`, `generateLocationOptions`.
- `src/data/achievements.js` — Rename achievements (e.g., "First Discovery" instead of "First Event"). Keep the hook pattern.
- `src/data/dailyQuiz.js` — Empty scaffold, same structure.
- `src/data/challengeQuiz.js` — Remove `whichCameFirst`, `eraDetective`, `chronologicalOrder`. Add `conceptRelationship`. Keep hearts, tiers, multiplayer.
- `src/data/descriptionDistractors.js` — Empty scaffold.
- `src/data/funFacts.js` — Empty scaffold.

#### Context:
- `src/context/AppContext.jsx` — Change storage key to `aisafety-state-v1`. Update `eventMastery` → `cardMastery` with 3 dimensions (what/why/how). Remove `placementQuizzes`, `skippedEvents`. Simplify `onboardingStep` (remove placement states). Update all action names (`MARK_EVENTS_SEEN` → `MARK_CARDS_SEEN`, etc.). Keep streak, XP, achievements, daily quiz, challenge, study time, sound/haptics state.

#### Components:
- `src/App.jsx` — 4 tabs: learn/library/practice/challenge. Remove timeline imports. Add Library tab routing.
- `src/pages/LearnPage.jsx` — Show topics instead of era-based lessons. Each topic expandable with its lessons. No placement quiz.
- `src/pages/PracticePage.jsx` — Adapt for 3 mastery dimensions. Reference `cardMastery` instead of `eventMastery`. Remove location/date practice modes.
- `src/pages/ChallengePage.jsx` — Remove time-based question types from tier configs.
- **NEW: `src/pages/LibraryPage.jsx`** — Filterable grid/list of all learned cards. Filter by topic, category, tags. Search by title. Show mastery dots. Tap to expand card details + linked cards.
- `src/components/learn/LessonFlow.jsx` — Rename `PERIOD_INTRO` → `TOPIC_INTRO`. Remove date/location quiz phases. Keep 3-card learn→quiz flow. Remove all era/date references.
- `src/components/shared.jsx` — Update `CategoryTag` colors for new categories (technical/alignment/policy/ethics/risks). Update `MasteryDots` for 3 dimensions instead of 4.
- `src/components/TopBar.jsx` — Change app name display.
- `src/components/BottomNav.jsx` — Update tab labels and icons (Learn, Library, Practice, Challenge).
- `src/components/layout/Sidebar.jsx` — Update tab labels.
- `src/components/Mascot.jsx` — Keep component, note that art will be swapped later.
- `src/components/Settings.jsx` — Keep as-is mostly. Remove any history-specific settings.
- `src/components/AchievementsModal.jsx` — Keep, works with renamed achievements.
- `src/components/OnboardingOverlay.jsx` — Simplify: welcome → topic overview → first lesson. Remove placement flow.
- `src/components/DailyQuizFlow.jsx` — Keep structure, adapt content references.
- `src/components/FunFactsFlow.jsx` — Keep structure, empty content.

#### Styles:
- `src/index.css` — New color palette (see Design System below). Remove all map-related CSS variables (region colors, `.time-slider-input`, map animations). Keep all quiz, lesson, streak, achievement, button, card animations.

---

## Design System

### Colors (replace Chronos parchment/burgundy theme)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#F0F4F8` | Page background (light steel blue) |
| `--color-surface` | `#FFFFFF` | Card surfaces |
| `--color-primary` | `#1E3A5F` | Primary actions, headers (deep navy) |
| `--color-accent` | `#00BFA5` | Highlights, progress, success (teal) |
| `--color-ink` | `#1C1917` | Body text |
| `--color-muted` | `#64748B` | Secondary text |
| `--color-danger` | `#DC2626` | Errors, wrong answers |
| `--color-warning` | `#F59E0B` | Streak at-risk, caution |

Dark mode equivalents:
| Token | Value |
|-------|-------|
| `--color-bg` | `#0F172A` |
| `--color-surface` | `#1E293B` |
| `--color-primary` | `#60A5FA` |
| `--color-accent` | `#2DD4BF` |
| `--color-ink` | `#F1F5F9` |
| `--color-muted` | `#94A3B8` |

### Fonts
- **Display/headings:** "Space Grotesk" (modern, techy feel — replaces Libre Baskerville)
- **Body:** "DM Sans" (keep from Chronos — clean, readable)
- Install: `npm install @fontsource/space-grotesk` (DM Sans is already installed)

### App Identity
- **App name:** AI Safety
- **localStorage key:** `aisafety-state-v1`
- **Capacitor appId:** `com.elsadonnat.aisafety`
- **GitHub Pages base:** `/AI-Safety-/`

---

## State Management

Single React Context + `useReducer` in `src/context/AppContext.jsx`. The `useApp()` hook provides `{ state, dispatch }`.

### Key State Shape (adapted from Chronos):

```js
const defaultState = {
  // Card completion: { [lessonId]: number }
  completedLessons: {},
  // Card mastery: { [cardId]: { whatScore, whyScore, howScore, timesReviewed, lastSeen, overallMastery } }
  cardMastery: {},            // was: eventMastery (4 dims → 3 dims)
  // Cards the user has seen the learn card for
  seenCards: [],               // was: seenEvents
  // Starred/favorited card IDs
  starredCards: [],            // was: starredEvents
  // XP
  totalXP: 0,
  // Streak
  currentStreak: 0,
  lastActiveDate: null,
  // Settings
  settingsOpen: false,
  themeMode: 'light',
  soundVolume: 1,
  hapticsEnabled: true,
  musicVolume: 1,
  musicPromptDismissed: false,
  // Notifications
  notificationsEnabled: false,
  dailyReminderTime: '09:00',
  streakRemindersEnabled: true,
  // Onboarding: 'welcome' | 'topic_overview' | 'complete' | null
  onboardingStep: 'welcome',   // simplified from Chronos
  // Spaced Repetition
  srSchedule: {},
  // Study Timer
  totalStudyTime: 0,
  studySessions: [],
  // Daily Quiz
  dailyQuiz: { lastCompletedDate: null, lastAttemptedDate: null, lastXPEarned: 0, totalCompleted: 0, acquiredCardIds: [] },
  // Achievements
  achievements: {},
  newAchievements: [],
  // Fun Facts
  seenFunFacts: [],
  // Challenge
  challenge: { soloHighScore: 0, soloGamesPlayed: 0, soloBestStreak: 0, totalChallengeCorrect: 0, multiplayerGamesPlayed: 0, multiplayerVictories: 0, lastPlayedDate: null },
  // Rating/tips
  ratingPromptDismissed: false,
  hasSeenFavoriteTip: false,
  cardsPerLesson: undefined,
};
```

### Key Actions (renamed from Chronos):

| Chronos Action | New Action | Change |
|---------------|------------|--------|
| `COMPLETE_LESSON` | `COMPLETE_LESSON` | Same |
| `UPDATE_EVENT_MASTERY` | `UPDATE_CARD_MASTERY` | 3 dimensions instead of 4 |
| `ADD_XP` | `ADD_XP` | Same |
| `MARK_EVENTS_SEEN` | `MARK_CARDS_SEEN` | Renamed |
| `TOGGLE_STAR` | `TOGGLE_STAR` | Same (uses cardId) |
| `UPDATE_STREAK` | `UPDATE_STREAK` | Same |
| `RESET_PROGRESS` | `RESET_PROGRESS` | Same |
| `COMPLETE_DAILY_QUIZ` | `COMPLETE_DAILY_QUIZ` | Same |
| `UNLOCK_ACHIEVEMENT` | `UNLOCK_ACHIEVEMENT` | Same |
| `RECORD_STUDY_SESSION` | `RECORD_STUDY_SESSION` | Same |

---

## Housekeeping (IMPORTANT — do this after every substantial change)

After each substantial change to features, UX/UI, or mechanics:

1. **Check if `CLAUDE.md` needs updating** — keep architecture docs, tables, and patterns current
2. **Add the change to `CHANGELOG.md`** under the current version
3. **Bump the version** in `package.json` by `+0.0.1` (patch) for most changes. Use `+0.1.0` (minor) for new features.

---

## Versioning

The single source of truth for the app version is `"version"` in `package.json`.
Start at `0.1.0`.

---

## Commit & Push Workflow

**Do NOT commit immediately after making changes.** The user will review first. Only commit when the user explicitly says to commit/push.

### When the user says "commit" or "push":

1. `npm run lint` — fix any lint errors
2. `npm run build` — verify production build works
3. `git add <relevant files>`
4. `git commit -m "<version> — <summary>"`
5. `git push origin main`

---

## Gotchas

- **Chronos references:** Search for "chronos", "Chronos", "history", "event" (as domain term), "era", "period" throughout the codebase and replace with AI Safety equivalents. Be thorough — stale references will confuse users.
- **CRLF line endings:** This may be a Windows project. Git may warn about LF→CRLF — ignore.
- **MasteryDots:** Update from 4 dots to 3 dots everywhere (shared.jsx, all consumers).
- **Quiz scoring:** Mastery is now 0–9, not 0–12. Update all thresholds, XP calculations, and progress percentages.
