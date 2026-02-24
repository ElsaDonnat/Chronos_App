# Chronos — History Learning App

A beautiful, interactive web app for learning the major events of human history. Think Duolingo meets Anki, with museum-grade aesthetics.

## Features

- **10 Progressive Lessons** covering 60 historical events from prehistory to the modern era
- **Three Question Types**: Where did it happen?, When did it happen?, What happened?
- **Smart Color-Coded Scoring**: Green (exact), Yellow (close), Red (missed) with adaptive thresholds
- **Spaced Practice Mode**: Weakness-prioritized review sessions
- **Interactive Timeline**: Chronological explorer with era bands and mastery indicators
- **Persistent Progress**: XP, streaks, and mastery saved to localStorage
- **Cute Axolotl Mascot**: Contextual expressions throughout the experience

## Tech Stack

- **React 19** (Vite)
- **Tailwind CSS v4**
- **Google Fonts**: Libre Baskerville (serif) + DM Sans (sans-serif)
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
│   ├── lessons.js      # 10 lesson definitions
│   └── quiz.js         # Scoring logic and MCQ generation
├── context/
│   └── AppContext.jsx   # Global state (useReducer + localStorage)
├── components/
│   ├── TopBar.jsx       # Header with streak + XP
│   ├── BottomNav.jsx    # Tab navigation
│   ├── Mascot.jsx       # Axolotl SVG with 5 moods
│   ├── Settings.jsx     # Stats panel + reset
│   ├── shared.jsx       # Card, Button, MasteryDots, etc.
│   └── learn/
│       └── LessonFlow.jsx  # Full lesson session orchestrator
├── pages/
│   ├── LearnPage.jsx    # Lesson list with progress
│   ├── TimelinePage.jsx # Chronological timeline explorer
│   └── PracticePage.jsx # Weakness-prioritized practice
├── App.jsx
├── main.jsx
└── index.css            # Tailwind + custom theme + animations
```

## Copyright

© 2026 Elsa Donnat. All rights reserved.

