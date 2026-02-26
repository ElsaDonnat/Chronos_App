# Changelog

All notable changes to Chronos are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

Use the latest version entry for Play Store "What's New" text.

## [1.1.0] - 2026-02-26

### Added
- Era matching question type in Lesson 0 — match 5 era names to their date ranges with color-coded pairing UI
- Plausible fake date ranges for era quiz questions — wrong answers are now made-up but believable, preventing process of elimination
- Yellow (close) scoring tier for matching questions (1 swap = yellow)
- Feedback form button in Settings (links to Google Form)
- "Buy Me a Coffee" donation button in Settings
- Description MCQ question type for regular lessons

### Changed
- Modern era end date changed from 2100 to "Present" internally
- Hourglass logo: removed falling sand line, more arched sand pile, darker/more visible sand fill
- App icon: full-bleed background with thick sand-colored border to eliminate Android adaptive icon margin gaps
- Mobile tab bar: fixed positioning at bottom with explicit padding for Android compatibility
- Mobile tab bar height increased with extra top padding for better touch area
- Regenerated all Android icon and splash screen PNGs

### Fixed
- Bottom tab bar not respecting safe area on Android (env(safe-area-inset-bottom) returns 0)
- Content being cut off behind fixed mobile tab bar — added 80px bottom padding
- Era date accuracy rewrite for historically correct date ranges and descriptions

---

## [1.0.0] - 2026-02-26

First Play Store release.

### Features
- 21 structured lessons covering 5 eras of human history (Prehistory through Modern)
- Lesson 0: interactive era overview with timeline quiz
- 8-phase lesson flow: study cards, learn quizzes, recap, and final review
- 60 historical events with dates, locations, descriptions, and categories
- Adaptive practice mode targeting weakest areas
- Smart Review, starred events, by-lesson, and full collection modes
- 4 question types: location, date, description, and "what happened"
- Date scoring with era-aware tolerances (prehistoric ±500K yrs vs modern ±10 yrs)
- 4-dimension mastery tracking per event (location, date, what, description)
- XP system with difficulty multipliers
- Daily streak tracking
- Event starring/favorites
- Collection/triage view tiering cards into Struggling, Learning, and Mastered
- Skip, back, and exit confirmation during quiz sessions
- Clickable result dots in summary screens with question detail modals
- Axolotl mascot with 5 contextual moods
- Settings panel with stats overview and progress reset

### Design
- Warm parchment aesthetic with burgundy accents
- Responsive layout: mobile-first with desktop sidebar navigation
- Self-hosted fonts (DM Sans, Libre Baskerville) for offline reliability
- Keyboard accessibility with focus-visible indicators
- 44px minimum touch targets
- Reduced motion support
- Standardized modal backdrops and transition timing

### Platform
- Android app via Capacitor
- Safe area support for notched devices
- Custom splash screen and adaptive app icon
- CSS `dvh` with `vh` fallback for older Android WebView
- Offline-capable — all content, fonts, and assets bundled
- Automated version sync between package.json and Android build.gradle
