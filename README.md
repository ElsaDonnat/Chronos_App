# Chronos — History Learning App

A beautiful, interactive web app for learning the major events of human history. Think Duolingo meets Anki, with museum-grade aesthetics.

## Features

- **21 Progressive Lessons** covering over 60 historical events from prehistory to the modern era
- **5 Question Types**: Where?, When?, What happened?, Description MCQ, and Era Matching
- **Smart Color-Coded Scoring**: Green (exact), Yellow (close), Red (missed) with adaptive thresholds
- **Spaced Repetition Practice**: SM-2 variant algorithm prioritizing due cards across Smart Review, Favorites, and Custom Lesson modes
- **Daily Quick Quiz**: "This Day in History" — 3 real historical events per day with learn-then-test flow, double XP, cycling through 10 days of content
- **15 Achievements & Badges**: Across 7 categories (Learning, Streaks, XP, Discovery, Collection, Mastery, Daily) with trophy modal and toast notifications
- **Study Timer**: Automatic session timing for lessons, practice, and daily quizzes with cumulative stats in Settings
- **Home Screen Widgets**: Android widgets for streak counter and quick practice access
- **Interactive Timeline**: Chronological explorer with era bands and mastery indicators
- **Onboarding & Placement Quizzes**: New user tutorial with optional era-based placement tests to skip known content
- **Push Notifications**: Daily reminders and streak alerts via local notifications
- **Persistent Progress**: XP, streaks, and mastery saved to localStorage
- **Data Management**: Export/import progress backups, in-app feedback form
- **Cute Axolotl Mascot**: Contextual expressions throughout the experience

## Tech Stack

- **React 19** (Vite)
- **Tailwind CSS v4**
- **Google Fonts**: Libre Baskerville (serif) + DM Sans (sans-serif)
- **Capacitor** for Android native builds
- **No backend** — all data hardcoded, progress stored in localStorage

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Versioning

The app version is managed in `package.json` (`"version": "X.Y.Z"`). The Android `versionCode` is **automatically derived** from it in `android/app/build.gradle` using: `major × 10000 + minor × 100 + patch`.

**Before every commit & push to GitHub:**

1. Bump the `"version"` in `package.json` (semver: patch/minor/major)
2. Update `CHANGELOG.md` with the new version
3. Commit and push

To rebuild for Android after a version bump:

```bash
npm run build
npx cap sync
# Generate AAB via Android Studio or CLI
```

> ⚠️ Google Play will reject uploads if the versionCode hasn't increased. Always bump `package.json` version before building a new release.

## Design Philosophy

Warm antiquity palette — aged parchment, terracotta, bronze. Clean museum-exhibit aesthetic with serif typography for headings. Mobile-first (440px max-width), centered on desktop.

## Project Structure

```
src/
├── data/
│   ├── events.js          # 60 historical events with full metadata
│   ├── lessons.js         # 21 lesson definitions
│   ├── quiz.js            # Scoring logic and MCQ generation
│   ├── dailyQuiz.js       # 10 days of "This Day in History" content
│   ├── achievements.js    # 15 achievements + checker hook
│   ├── placementQuiz.js   # Era-based placement quiz questions
│   └── spacedRepetition.js # SM-2 variant scheduling algorithm
├── context/
│   └── AppContext.jsx     # Global state (useReducer + localStorage)
├── components/
│   ├── TopBar.jsx         # Header with streak, XP, trophy button
│   ├── Settings.jsx       # Stats, study time, export/import, feedback
│   ├── Mascot.jsx         # Axolotl SVG with 5 moods
│   ├── shared.jsx         # Card, Button, MasteryDots, etc.
│   └── learn/
│       ├── LessonFlow.jsx    # Full lesson session orchestrator
│       ├── Lesson0Flow.jsx   # Intro lesson logic
│       └── DailyQuizFlow.jsx # Daily quiz session flow
├── services/
│   ├── notifications.js   # Local push notifications
│   └── widgetBridge.js    # Android widget data sync
├── pages/
│   ├── LearnPage.jsx      # Lesson list + daily quiz card
│   ├── TimelinePage.jsx   # Chronological timeline explorer
│   └── PracticePage.jsx   # Spaced repetition practice hub
├── App.jsx
├── main.jsx
└── index.css              # Tailwind + custom theme + animations
```

## Copyright

© 2026 Elsa Donnat. All rights reserved.

