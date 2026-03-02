# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build
npm run lint      # ESLint (flat config, JS/JSX only)
npm run preview   # Preview production build
```

No test framework is configured.

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

Key actions: `COMPLETE_LESSON`, `UPDATE_EVENT_MASTERY`, `ADD_XP`, `MARK_EVENTS_SEEN`, `TOGGLE_STAR`, `UPDATE_STREAK`, `RESET_PROGRESS`, `COMPLETE_DAILY_QUIZ`, `UNLOCK_ACHIEVEMENT`, `DISMISS_ACHIEVEMENT_TOAST`, `RECORD_STUDY_SESSION`.

### Routing

No router — `App.jsx` uses `activeTab` state (`'learn'` | `'timeline'` | `'practice'`) to switch pages. Pages manage their own internal view states (e.g., PracticePage has hub/collection/session/results views).

### Data Layer (`src/data/`)

- **`events.js`** — `ALL_EVENTS`: 60 historical events, each with `id`, `title`, `year`, `yearEnd` (for ranges), `location`, `category`, `difficulty` (1-3)
- **`lessons.js`** — `LESSONS`: 21 lessons (0-20). Lesson 0 is special (era overview, no events). Lessons 1-20 each have exactly 3 `eventIds`
- **`quiz.js`** — Quiz generation and scoring. Date scoring uses era-aware tolerances (prehistoric ±500K years vs modern ±10 years). XP calculated from difficulty × score
- **`dailyQuiz.js`** — 10 days of daily quiz content (30 real historical events). Cycling: `dayIndex = daysSinceEpoch % 10`. Each day has 3 events with learn-then-quiz flow
- **`achievements.js`** — 15 achievements across 7 categories + `useAchievementChecker()` hook that runs on state changes

### Lesson Flow (`src/components/learn/LessonFlow.jsx`)

8-phase flow: INTRO → PERIOD_INTRO → (LEARN_CARD → LEARN_QUIZ) × 3 events → RECAP_TRANSITION → RECAP (6 questions) → FINAL_REVIEW → SUMMARY. Each lesson produces 12 total questions. All flows (lessons, practice, daily quiz) auto-track duration via `useRef` timer and dispatch `RECORD_STUDY_SESSION` on completion.

### Mastery System

Each event is scored on 4 dimensions (location, date, what, description), each `'green'` (3pts) | `'yellow'` (1pt) | `'red'` (0pts) | `null`. Overall mastery is 0-12.

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

### Android Widgets

Two home screen widgets (Streak + Quick Practice) use the `capacitor-widget-bridge` plugin (v8.0.0) to bridge data from the web layer to native Android `SharedPreferences`.

**Data flow:** React state change → `syncWidgetData()` in `src/services/widgetBridge.js` writes `currentStreak` and `totalXP` to SharedPreferences (group `"group.com.chronos.app.widgets"`) → calls `reloadAllTimelines()` → native `AppWidgetProvider.onUpdate()` reads SharedPreferences and updates the widget UI via `RemoteViews`.

**Key files:**
- `src/services/widgetBridge.js` — JS bridge (`initWidgets()`, `syncWidgetData()`)
- `android/.../com/chronos/app/StreakWidget.java` — Streak widget provider
- `android/.../com/chronos/app/QuickPracticeWidget.java` — Quick Practice widget provider
- `android/.../res/layout/widget_streak.xml`, `widget_quick_practice.xml` — Widget layouts
- `android/.../res/xml/streak_widget_info.xml`, `quick_practice_widget_info.xml` — Widget metadata
- `android/.../res/drawable/widget_background.xml` — Shared rounded parchment background
- `MainActivity.java` — Handles `openTab` intent extra for Quick Practice deep-link

**Adding a new data field to widgets:**
1. Add `WidgetBridgePlugin.setItem()` call in `syncWidgetData()` (`src/services/widgetBridge.js`)
2. Read from `SharedPreferences` in the Java widget provider's `updateWidget()` method
3. Add a `TextView` (or similar) in the widget layout XML and set it via `RemoteViews.setTextViewText()`

**SharedPreferences group name:** `"group.com.chronos.app.widgets"` — must match exactly between JS and Java.

**Widget UI limitations:** Widgets use `RemoteViews`, which supports only a limited set of views (`LinearLayout`, `TextView`, `ImageView`, etc.). No custom fonts, no complex animations, no WebView.

## Gotchas

- **Unicode en-dashes in source files:** Many strings in this codebase use `\u2013` (en-dash `–`), not a regular hyphen-minus (`-`). When editing these strings with the Edit tool, you must use the exact `\u2013` character or the match will fail. If an edit fails on a string containing dashes, check the encoding with `node -e` first.
- **Capacitor asset generation:** The command is `npx @capacitor/assets generate` with no flags. There is no `--splash`, `--splashOnly`, or `--iconOnly` option — it always regenerates everything (icons + splash).
- **CRLF line endings:** This is a Windows project. Git may warn about LF→CRLF conversion — these warnings are harmless and can be ignored.
- **After any visual/asset changes:** Always run `npm run build && npx cap sync` to propagate web build into the Android project.
