# Changelog

All notable changes to Chronos are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

Use the latest version entry for Play Store "What's New" text.

## [1.2.0] - 2026-02-27

### Added
- Streak visual indicator — TopBar flame icon now glows/pulses based on streak status (active, at-risk, inactive) with dynamic colors and animations
- Streak detail modal — tap the flame to see contextual streak message with motivational copy based on streak length and status
- Pinned action buttons — Continue, Back, Skip, and other command buttons now stick to the bottom of the viewport across all lesson flow phases, practice sessions, and quiz views so they're always reachable without scrolling
- ExpandableText ("Read more") for long event descriptions in Timeline and Practice Collection views

### Fixed
- Action buttons unreachable on small screens — buttons in INTRO, RECAP_TRANSITION, SUMMARY, quiz questions, practice questions, results, and lesson picker views no longer scroll off-screen
- CSS animation `forwards` fill-mode breaking `position: sticky` — changed to `backwards` so persistent transforms don't create containing blocks
- Recap transition event tags overflowing horizontally (added flex-wrap)
- Excess bottom padding when mobile tab bar is hidden during lesson/practice sessions

---

## [1.1.1] - 2026-02-26

### Fixed
- Splash screen white border/gap — replaced bitmap drawable with solid parchment color background, Capacitor plugin now handles image display with CENTER_CROP scaling
- Fake date ranges in Lesson 0 era quiz — removed defensible alternative dates (1453, 1492, 1648, 1776, 1815, 1848, 1914, etc.) that historians actually use as period boundaries; replaced with non-standard dates so wrong answers are clearly wrong
- Horizontal scrollbar flash when swiping between eras in Lesson 0

### Changed
- Splash screen logo scaled up 10%, tagline removed for cleaner appearance
- Splash icon repositioned slightly above center for better visual balance
- Android system bars (status bar, navigation bar) now match parchment color during splash

### Added
- Feature backlog file (BACKLOG.md) with prioritized roadmap
- Android build instructions and gotchas section in CLAUDE.md

---

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
