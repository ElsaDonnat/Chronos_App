# Chronos — History Learning App

A beautiful, interactive web app for learning the major events of human history. Think Duolingo meets Anki, with museum-grade aesthetics.

## Features

- **21 Progressive Lessons** covering over 60 historical events from prehistory to the modern era
- **5 Question Types**: Where?, When?, What happened?, Description MCQ, and Era Matching
- **Smart Color-Coded Scoring**: Green (exact), Yellow (close), Red (missed) with adaptive thresholds
- **Plausible Fake Date Ranges**: Era quiz wrong answers are made-up but believable, preventing process of elimination
- **Spaced Practice Mode**: Multi-mode practice supporting Smart Review, Favorites, Custom Lesson combinations, and Card Triage views
- **Interactive Timeline**: Chronological explorer with era bands and mastery indicators
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

## Design Philosophy

Warm antiquity palette — aged parchment, terracotta, bronze. Clean museum-exhibit aesthetic with serif typography for headings. Mobile-first (440px max-width), centered on desktop.

## Project Structure

```
src/
├── data/
│   ├── events.js       # 60 historical events with full metadata
│   ├── lessons.js      # 21 lesson definitions
│   └── quiz.js         # Scoring logic and MCQ generation
├── context/
│   └── AppContext.jsx   # Global state (useReducer + localStorage)
├── components/
│   ├── TopBar.jsx       # Header with streak + XP
│   ├── BottomNav.jsx    # Tab navigation
│   ├── Mascot.jsx       # Axolotl SVG with 5 moods
│   ├── Settings.jsx     # Stats, export/import, feedback, privacy
│   ├── shared.jsx       # Card, Button, MasteryDots, etc.
│   └── learn/
│       ├── LessonFlow.jsx  # Full lesson session orchestrator
│       └── Lesson0Flow.jsx # Intro lesson logic
├── pages/
│   ├── LearnPage.jsx    # Lesson list with progress
│   ├── TimelinePage.jsx # Chronological timeline explorer
│   └── PracticePage.jsx # Weakness-prioritized practice hub and triage
├── App.jsx
├── main.jsx
└── index.css            # Tailwind + custom theme + animations
```

## Copyright

© 2026 Elsa Donnat. All rights reserved.

