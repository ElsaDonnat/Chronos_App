# Chronos — History Learning App

A beautiful, interactive web app for learning the major events of human history. Think Duolingo meets Anki, with museum-grade aesthetics.

## Features

### Learning
- **53 Lessons** across two progression levels: 21 core lessons (Level 1) covering 60 events from prehistory to the modern era, plus 8 thematic Level 2 chapters (32 lessons) with 47 additional events
- **137 Historical Events** across 5 categories (Politics, Science, Culture, War, Revolution) and 5 eras (Prehistory, Ancient, Medieval, Early Modern, Modern)
- **8-Phase Lesson Flow**: Intro → Period Intro → (Learn Card → Learn Quiz) × 3 → Recap Transition → Recap → Final Review → Summary
- **6 Question Types**: Where?, When?, What happened?, Description MCQ (with 3 difficulty tiers), Era Matching, and Date free-input
- **Context-Aware Difficulty**: description questions scale from easy (lesson learn phase) to very subtle (high-mastery practice) with hand-crafted distractors for 126+ events

### Practice & Challenge
- **Spaced Repetition Practice**: SM-2 variant algorithm with 4 modes — Smart Review, Starred Events, By-Lesson, and Full Collection
- **Challenge Mode**: 35-question gauntlet across 6 progressive tiers (Beginner → God Mode) with 6 creative question types (Category Sort, Era Detective, True/False, Hard MCQ, Which Came First, Odd One Out). Solo and multiplayer support
- **Daily Quick Quiz**: "This Day in History" — 3 real events per day, learn-then-test flow, double XP, cycling through 10 days of content (30 exclusive events)
- **Quick 5 Dates**: rapid 6-question date practice mode

### Progression
- **4-Dimension Mastery System**: each event scored on Location, Date, What, and Description (0–12 points total) — influences practice difficulty
- **20+ Achievements** across 7 categories (Learning, Streaks, XP, Discovery, Collection, Mastery, Daily, Challenge) plus hidden bonus achievements
- **Streak System**: daily streak with animated flame icon (active/at-risk/inactive states) and celebration overlay on first activity each day
- **XP System**: earned from lessons, practice, daily quiz, and challenge mode

### Exploration
- **Interactive World Map**: custom inline SVG with Natural Earth I projection, event pins with grid-based clustering, pinch-to-zoom (up to 4×), sub-region filtering (11 regions), fullscreen mode, and category legend
- **Timeline Explorer**: chronological view with era bands, mastery indicators, connected events (100+ causal links), and filtering by era/category/region
- **Event Cards**: expandable descriptions, controversy notes, importance tags, star/favorite toggle

### Audio & Haptics
- **Sound Effects**: Duolingo-style micro-interaction sounds (taps, selections, reveals, toggles) + quiz feedback (correct/wrong/complete chimes). Web Audio API with layered sine tones through lowpass filters — no audio files
- **Ambient Music**: relaxing antiquity soundscape with independent volume control, auto-pause on app background
- **Haptic Feedback**: Capacitor Haptics integration with toggle in Settings

### UX & Polish
- **Cute Axolotl Mascot**: 5 contextual moods throughout the experience
- **Dark Mode**: full theme support via CSS custom properties
- **Smart Modals**: rating prompt, music intro, "Keep Going" encouragement (every 3rd activity), "Welcome Back" greeting (after 2+ days away) — intelligently stacked to avoid overlap
- **Onboarding & Placement Quizzes**: guided tutorial with optional era-based tests to skip known content
- **Week Tracker**: day-by-day activity breakdown with session/question/study time stats and share button
- **Study Timer**: automatic session timing with cumulative stats in Settings

### Android & Platform
- **Home Screen Widgets**: Streak widget (flame + count, color changes by status) and Quick Practice widget (one-tap to Practice tab)
- **Push Notifications**: daily reminders and streak alerts via local notifications with configurable time
- **Sharing**: share results from lessons, practice, daily quiz, and weekly stats via Web Share API / clipboard
- **Export/Import**: full progress backup and restore as JSON
- **Offline**: all content bundled, works completely offline after install — no backend, no analytics

## Tech Stack

- **React 19** with Vite 7, pure JavaScript (no TypeScript)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Capacitor** for Android native builds (widgets, haptics, notifications, splash screen)
- **Google Fonts**: Libre Baskerville (serif) + DM Sans (sans-serif)
- **No backend** — all data hardcoded, progress stored in localStorage

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (web)
npm run build

# Build for Android
CAPACITOR_BUILD=true npm run build && npx cap sync
```

## Versioning

The app version is managed in `package.json` (`"version": "X.Y.Z"`). The Android `versionCode` is **automatically derived** from it in `android/app/build.gradle` using: `major × 10000 + minor × 100 + patch`.

> Google Play will reject uploads if the versionCode hasn't increased. Always bump `package.json` version before building a new release.

## Publishing

- **Web (GitHub Pages)**: Deploys automatically on every push to `main` via GitHub Actions
- **Android (Play Store)**: The AAB is built via Gradle (`gradlew bundleRelease`) and uploaded to the Play Store from **Android Studio** — not from the command line
- **GitHub Releases**: Created via git tags (`git tag vX.Y.Z && git push origin vX.Y.Z`) + GitHub web UI. The `gh` CLI is not installed.

## Working with Multiple Claude Code Agents

You can run multiple Claude Code agents in parallel using **git worktrees**. Each agent gets its own isolated copy of the repo on a separate branch, so they won't interfere with each other.

### Quick start

1. **Main agent** — works on `main` as usual
2. **Second agent** — tell it "start a worktree" and describe the task. It gets its own branch automatically.
3. **When the second agent is done** — go back to the main agent and say "merge branch `<branch-name>`"

### Example

```
You (to Agent A): "Add sound effects to the quiz"        → works on main
You (to Agent B): "Start a worktree. Redesign the map"   → works on feature branch
```

When Agent B finishes, tell Agent A:
```
"Agent B finished on branch <name>. Merge it in, then build and push."
```

### Tips

- Assign agents to **different files/features** to avoid merge conflicts
- Only the **main agent** should bump versions, update CHANGELOG, and push to GitHub
- If both agents edited the same file, you may get a merge conflict — the agent can help you resolve it
- Run `git worktree list` to see all active worktrees

## Design Philosophy

Warm antiquity palette — aged parchment, terracotta, bronze. Clean museum-exhibit aesthetic with serif typography for headings. Mobile-first (440px max-width), centered on desktop.

## Project Structure

```
src/
├── data/
│   ├── events.js              # 126 historical events with full metadata
│   ├── lessons.js             # 53 lesson definitions (Level 1 + Level 2)
│   ├── quiz.js                # Scoring logic and MCQ generation
│   ├── dailyQuiz.js           # 10 days of "This Day in History" content
│   ├── challengeQuiz.js       # Challenge mode question generation
│   ├── descriptionDistractors.js # Hand-crafted distractors (3 difficulty tiers)
│   ├── achievements.js        # 20+ achievements + checker hook
│   ├── placementQuiz.js       # Era-based placement quiz questions
│   └── spacedRepetition.js    # SM-2 variant scheduling algorithm
├── context/
│   └── AppContext.jsx         # Global state (useReducer + localStorage)
├── components/
│   ├── TopBar.jsx             # Header with streak, XP, trophy button
│   ├── Settings.jsx           # Stats, study time, export/import, feedback
│   ├── Mascot.jsx             # Axolotl SVG with 5 moods
│   ├── StreakFlame.jsx        # Animated streak flame icon (3 states)
│   ├── StreakCelebration.jsx  # Daily streak earned overlay animation
│   ├── WelcomeBackModal.jsx   # Returning user greeting
│   ├── MapView.jsx            # Interactive world map (inline SVG)
│   ├── WeekTracker.jsx        # Weekly activity breakdown
│   ├── shared.jsx             # Card, Button, MasteryDots, etc.
│   └── learn/
│       ├── LessonFlow.jsx     # Full lesson session orchestrator
│       ├── Lesson0Flow.jsx    # Intro lesson (era overview)
│       └── PlacementQuizFlow.jsx # Era placement tests
├── services/
│   ├── feedback.js            # Sound effects + haptics (Web Audio API)
│   ├── ambientMusic.js        # Background music player
│   ├── notifications.js       # Local push notifications
│   ├── widgetBridge.js        # Android widget data sync
│   └── share.js               # Share text builders + Web Share API
├── pages/
│   ├── LearnPage.jsx          # Lesson list + daily quiz card
│   ├── TimelinePage.jsx       # Timeline + map explorer
│   ├── PracticePage.jsx       # Spaced repetition practice hub
│   └── ChallengePage.jsx      # Challenge mode (solo + multiplayer)
├── App.jsx
├── main.jsx
└── index.css                  # Tailwind + custom theme + animations
```

## Copyright

© 2026 Elsa Donnat. All rights reserved.
