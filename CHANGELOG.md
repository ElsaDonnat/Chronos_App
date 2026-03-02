# Changelog

All notable changes to Chronos are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

Use the latest version entry for Play Store "What's New" text.

## [1.5.0] - 2026-03-02

### Added
- Week Tracker modal — full-screen view with day-by-day activity row (Mon–Sun), session/question/time stats, streak display, and share button. Opens from TopBar streak or XP tap, and from the "This Week" teaser card on Learn page
- "NEW" badge on lesson cards — unlocked-but-not-completed lessons show the lesson emoji in a burgundy-outlined circle with a small "New" pill at bottom-right
- Green checkmark badge on completed lesson cards — small success-colored circle overlaid at bottom-right of the emoji icon
- Mastery dots on lesson cards — colored dots next to the lesson number showing per-event mastery (green/yellow/red)
- Weekly insights teaser card on Learn page — compact "This Week" card showing session count, questions, and study time. Appears every 3 days (dismissible with 3-day cooldown). Clicking opens Week Tracker
- Collapsible daily quiz completed card — completed daily quiz now shows as a compact banner that expands to show the 3 events learned, each clickable to jump to Timeline
- Collapsible timeline filters — filters collapse into a single "Filter" button by default, expand on click; all choices (era, category, hideUnknown) persist in localStorage
- "Hide Unknown" filter in Timeline — warm beige toggle chip hides undiscovered event cards while preserving era section headers
- Quick 5 Dates practice mode — 6 date MCQ questions targeting weakest-scoring events, accessible from Practice hub

### Changed
- Hourglass logo redesigned across TopBar, Mascot, and Android widget drawable — solid filled rect frame caps, tighter glass curves (strokeWidth 1.6), beige sand color (#C8A882), sand line in top half, no falling sand stream
- TopBar simplified — removed inline StreakModal, streak and XP areas now open the shared Week Tracker modal
- Lesson cards no longer show "3/3" seen-event progress circles; replaced with emoji + badge approach

### Fixed
- Literal backslash characters (`\`) appearing before Unicode arrows (→, ←), em-dashes (—), and middle dots (·) in button text across PracticePage, LessonFlow, PlacementQuizFlow, DailyQuizFlow, and LearnPage
- Corrupted emoji characters (??) in Practice page tier section headers — removed broken Unicode replacement bytes
- Lesson progress showing "3/3" for unplayed lessons due to seenEvents being populated from daily quiz and practice sources

---

## [1.4.0] - 2026-03-02

### Changed
- Daily Quiz redesigned as year-guessing format — shows 3 years, asks "What happened in [year]?" with 3 options (1 correct + 2 plausible wrong answers). Answering reveals a mini event card with title, description, and location as the learning moment
- Daily Quiz events are now full-schema events integrated into ALL_EVENTS with `source: 'daily'` field, enabling them to work across Timeline, Practice, and collection systems
- Daily Quiz card on Learn page now shows years instead of event titles in the preview

### Added
- Bonus DiH (Day in History) cards — completing the daily quiz adds 3 "Bonus DiH" cards to your collection with a gold badge
- DiHBadge component — gold calendar badge displayed on all DiH event cards across Timeline, Practice collection, and quiz results
- "Day in History" filter chip in Timeline — gold-colored filter to show only acquired DiH cards (appears after first quiz completion)
- DiH cards in Practice — acquired bonus cards appear in My Cards collection with DiHBadge, fully practicable with spaced repetition
- Timeline header now shows core events and bonus cards separately ("X of 60 events · Y bonus")
- CSS styles for year display (.daily-quiz-year), year card (.daily-quiz-year-card), and card reveal animation (.daily-quiz-card-reveal)
- Share results & streak — "Share Result" button on lesson summary, practice results, and daily quiz results; "Share Streak" button in streak modal. Uses Web Share API on Android, clipboard copy fallback on desktop. Messages include score, XP, streak, and Play Store link
- Weekly learning insights — "This Week" card on the Learn page showing sessions completed, questions answered, study time, strongest era, and weakest era to focus on. Dismissible per week, resets each Monday
- Matching questions in practice — event-to-date matching now appears in practice sessions (1 per session, counts as 2 questions). Picks 4 events across different eras, prioritizing weak date scores
- Streak Widget flame now changes color based on streak status: orange/yellow when active, red when at risk of breaking, blue when lost. Flame subtly flickers via ViewFlipper animation (2 frames). Red flame is visually larger to convey urgency
- Quick Practice Widget redesigned with prominent "Chronos" logo, burgundy play button, and stats row
- Both widgets now have an elegant burgundy (#8B4157) border instead of the previous light gray
- Both widgets are resizable from 1×1 up to 4×4 home screen cells (previously fixed at 2×2 / 3×2)
- Widget bridge now syncs `streakStatus` (active/at-risk/inactive) alongside existing streak count and XP

---

## [1.3.0] - 2026-03-02

### Added
- Daily Quick Quiz ("This Day in History") — a daily 3-event quiz with learn-then-test flow, cycling through 10 days of real historical content (30 events total). Gold/amber card on Learn page with 2x XP badge, turns green when completed. Max 60 XP/day
- Achievements & Badges — 15 achievements across 7 categories (Learning, Streaks, XP, Discovery, Collection, Mastery, Daily) with trophy button in TopBar, toast notifications on unlock, and progress bars on locked achievements
- Study timer & session stats — automatic timing for lessons, practice sessions, and daily quizzes. Duration shown on summary/results screens. Total study time and session count displayed in Settings
- Home screen widgets — two Android widgets users can add to their home screen:
  - **Streak Widget** (2x2): shows flame icon and current streak count
  - **Quick Practice Widget** (3x2): shows "Quick Practice" button with streak/XP stats, tapping opens directly to Practice tab
- Widget data bridge via `capacitor-widget-bridge` plugin — syncs `currentStreak` and `totalXP` from app state to native Android SharedPreferences on every state change
- Deep-link handling from Quick Practice widget — tapping opens the app directly to the Practice tab via intent extras
- Sound effects & haptic feedback — musical tones via Web Audio API (ascending chime for correct, descending tone for wrong, arpeggio for completion, sparkle for achievements) with native haptics via @capacitor/haptics. Independent toggles for sound and haptics in Settings

---

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
