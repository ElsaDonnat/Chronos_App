# Changelog

All notable changes to Chronos are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

Use the version entries from the last playstore push to the most recent version for Play Store "What's New" text.

## [1.7.9] - 2026-03-09

### Changed
- **Challenge quiz: killed categorySort** — removed entirely because categories are editorial decisions, not historical facts. Replaced all categorySort slots with whichCameFirst (tests real chronological knowledge)
- **Challenge quiz: curated T/F pool** — dynamic T/F no longer swaps database fields (location/date/category). Now uses `CURATED_TF_POOL` of 20 conceptual misconception questions (e.g., "The earliest writing was hieroglyphics" — false, it was cuneiform). Falls back to cause-and-effect questions using `EVENT_CONNECTIONS`
- **Challenge quiz: fixed eraDetective** — removed obvious picks (Neolithic Revolution, Unification of Egypt, Jesus). Added genuinely ambiguous events (Bronze Age Collapse, Charlemagne, Gutenberg). Era-revealing keywords stripped from descriptions
- **Challenge quiz: fixed hardMCQ distractors** — date distractors now use tight same-era spacing (e.g., Haitian Revolution: 1776/1789/1791/1804 instead of 1650/1791/1860/1920). Location distractors use same-region cities (Russian Revolution: St. Petersburg/Moscow/Vladivostok/Kiev instead of Warsaw/Berlin)
- **Challenge quiz: multiplayer improvements** — multiplayer now uses curated T/F content, type repetition prevention (no 3+ in a row), and same-category/same-era distractor logic
- **Challenge quiz: bonus hearts** — awards +1 heart at tier transitions entering Advanced+ (max 5), addressing 91% accuracy requirement being too harsh for harder tiers

### Added
- **Near-miss feedback for date questions** — wrong date MCQ answers within ~15% of correct year (or ≤50 years) show "Close! You were in the right ballpark" badge and play `close()` sound instead of `wrong()`
- **Cause-and-effect questions** — new question type using `EVENT_CONNECTIONS`: "What was a direct consequence of X?" Used as fallback when curated T/F pool is exhausted

### Fixed
- **Multiplayer XP bug** — was summing ALL players' correct answers and awarding XP to logged-in user. Now only counts the "me" player's score
- **Beginner T/F too easy** — replaced "Alexander conquered from Greece to India" (universally known) with "Alexander was tutored by Aristotle" (creates genuine doubt). Moved "Mongol Empire largest contiguous" to Amateur

## [1.7.8] - 2026-03-06

### Fixed
- **Lesson summary overlap** — increased top padding so the summary card no longer overlaps with the mascot/logo

### Changed
- **Challenger Mode stats background** — stats card backgrounds now share the same tint as the header gradient's lightest color via a shared `CHALLENGE_TINT` constant
- **Challenger Mode tier ladder** — dotted line is now beige, dots are white (unreached), line spans exactly from first to last dot, tier abbreviations use the same dark brown as the subtitle

## [1.7.7] - 2026-03-06

### Fixed
- **Welcome Back modal** — changed title to "Welcome!" and default message to avoid repetition
- **Web vertical spacing** — reduced padding in lesson/quiz flows so content fits without scrolling on web

## [1.7.6] - 2026-03-06

### Changed
- **Unified era colors** — Prologue era cards, lesson flow, placement quiz, and timeline now all use the same warm-hue palette as the Learn page chapters
- **Challenger Mode background** — doubled the tint opacity for a more visible burgundy hue
- **Challenger Mode tier emojis** — removed parchment backdrop so emoji colors stay vibrant
- **Challenge quiz: curated Beginner & Amateur pools** — Beginner (17 questions) and Amateur (21 questions) now draw from hand-picked pools instead of random events; category-sort uses ambiguous titles, true/false tests actual content with plausible false statements and correction text, date MCQ distractors spread by tier
- **Challenge quiz: category-sort** — only shows event title, no description
- **Challenge quiz: T/F correction text** — false statements now show an explanation when answered

## [1.7.5] - 2026-03-05

### Fixed
- **Date scoring tolerances** — rewrote `scoreByDiff()` with magnitude-based thresholds: prehistoric dates scale by order of magnitude (millions ±1M, 100Ks ±100K, 10Ks ±10K), ancient BCE ±200/±500, classical ±100/±300, medieval ±50/±150 (unchanged). Modern (post-1800) and early modern (1501–1800) now require **exact year** for green, with yellow only ±3 or ±5 years respectively. Previously, entering "3" for a 300,000-year-old event scored as correct
- **Range event tolerance** — answers outside a date range now get a 25% span bonus before scoring, so wider ranges (e.g., 1M-year spans) are more forgiving for near-misses
- **Lesson summary overlap** — increased top padding so the summary card no longer overlaps with the mascot/logo

### Changed
- **Challenger Mode stats background** — stats card backgrounds now use the same tint as the header gradient's lightest color, linked via a shared `CHALLENGE_TINT` constant so changing one updates both

## [1.7.4] - 2026-03-05

### Fixed
- **Hourglass shake animation** — replaced CSS animation with SVG-native `<animateTransform additive="sum">` so the hourglass shakes in the mascot's hand instead of jumping to its face; interval capped at 7–10s

### Changed
- **Challenge hub header gradient** — darker header gradient, dark brown subtitle, brown text shadow on title, opaque parchment emoji backdrops, bigger circles, slightly smaller emoji text

## [1.7.3] - 2026-03-05

### Changed
- **Streak flame clock badge** — added parchment fill background, white drop shadow, and scaled up 40% so the brown clock reads clearly against the red flame
- **Challenge hub tier ladder** — circles now have solid parchment fill (dots no longer bleed through), dotted line is more visible, tier labels/icons are bolder, gradient header is stronger, and top gap reduced
- **Challenge hub tier emojis** — tier icons are 50% larger and vibrant when reached (greyed out when not); progress line narrowed ~15% for a tighter layout

## [1.7.2] - 2026-03-05

### Changed
- **Challenger Mode hub redesign** — the Challenge tab now features a dark warm gradient header (dusty rose/mauve tones) with cream text, giving it a distinct arena feel while staying within the app's design language
- **Tier progression ladder** — horizontal visual showing all 6 tiers (Beginner → God) with colored dots, connector line, tier emojis, and labels. Dots fill based on the player's best solo score; current best tier gets a glow effect
- **Renamed "Challenge Mode" to "Challenger Mode"**
- **Study time split** — Settings now shows Today vs Total study time side by side
- **Hourglass logo tweak** — slightly bigger and repositioned in top bar
- **Multiplayer victories counter** — Challenge hub shows total multiplayer wins
- **Lighter slider tracks** — volume slider track lines are now a softer burgundy
- **Timeline empty state moved to top** — "Your timeline begins with your first lesson" now appears at the top of the tab instead of the bottom
- **Desktop topbar centering fix** — section name offset adjusted for better centering

## [1.7.1] - 2026-03-05

### Added
- **Per-lesson icons for Level 2 chapters** — each lesson in Level 2 now displays its own unique icon on the Learn page

### Fixed
- **Topbar section name centering on desktop** — section name no longer shifts off-center on wider screens

### Changed
- **Streak flame at-risk clock** — clock badge changed from white to dark brown (#5D4037) and made 15% larger for better visibility
- **Settings label clarity** — "Recap Intensity" renamed to "Recap intensity (lessons)" to clarify scope

## [1.7.0] - 2026-03-05

### Added
- **Streak celebration overlay** — when the user completes their first lesson, practice, daily quiz, or challenge of the day, a brief animated overlay shows the flame transitioning from grey/red to active orange with a green checkmark badge popping in, the streak count, and "Streak started!" or "Streak extended!" text. Auto-dismisses after ~3s or on tap
- **UI micro-interaction sounds** — subtle Duolingo-style sound effects on button taps, quiz option selection, tab switches, learn card reveals, modal opens, toggle switches, and star toggling
- **Overhauled sound engine** — replaced raw triangle-wave oscillators with layered sine tones through lowpass filters for a warm, polished marimba-like sound (no more retro game feel)

### Fixed
- **Ambient music looping** — music was not looping because the `ended` handler checked a non-existent config property; now correctly checks `musicVolume > 0`

### Changed
- **Reduced default volume** — ambient music gain ceiling lowered from 0.0325 to 0.02; all sound effect gains halved for a softer default experience
- **Era-specific accent colors** — each era chapter on the Learn page now has a distinct color that evolves through time: earthy brown (Prehistory) → brown-orange (Ancient) → amber-orange (Medieval) → golden amber (Early Modern) → muted warm red (Modern). Colors are more differentiated from Level 2 chapter colors
- **Era icons for chapter headers** — chapter headers now show the era's thematic icon (bone, temple, swords, compass, globe) matching the Lesson 0 prologue cards, instead of reusing the first lesson's icon
- **Lesson icon styling** — lesson icons now use a consistent burgundy outline with beige/parchment fill, distinct from the era accent color which is used for card borders, badges, and decorative elements

## [1.6.9] - 2026-03-05

### Changed
- **Recap transition cards restyled** — the "Time to Recap" screen now shows events vertically with full titles, dates, and category colors (matching the lesson intro style) instead of truncated burgundy pills
- **Removed horizontal scrollbar during lessons** — eliminated the stray horizontal scrollbar/loading bar that appeared at the bottom of lesson screens

## [1.6.8] - 2026-03-05

### Added
- **Context-aware description difficulty** — description quiz questions now use different difficulty tiers depending on where they appear:
  - **Lesson learn phase (d:1):** easy distractors — obviously wrong, reinforces what was just read on the card
  - **Lesson recap phase (d:2):** medium distractors — plausible-sounding but wrong, tests retention
  - **Practice mode (d:2→3):** scales with mastery — low mastery (0-6) gets medium distractors, high mastery (7+) gets very subtle distractors plus `hardCorrect` as the correct answer
  - **Placement quiz (d:2):** medium distractors — fair test of existing knowledge
- **Daily quiz mastery tracking** — daily quiz now updates the "what" mastery dimension when answering, consistent with lesson behavior
- **Hide skip quiz for completed eras** — the "Skip [Era]" placement quiz button no longer appears on the learn page once all lessons in that era are completed (still accessible from Settings)

### Fixed
- **Map shows only completed events** — events now only appear on the map after completing their lesson (previously all events were visible regardless of lesson progress). `MARK_EVENTS_SEEN` moved from lesson start to lesson completion in `LessonFlow.jsx`. MapView always filters by `learnedIds`.

### Documentation
- **Map system architecture in CLAUDE.md** — new "Map System" section documenting the full data pipeline (TopoJSON → SVG generation), rendering approach (inline SVG, Natural Earth I projection), region system, pin clustering, interaction model, and known scalability limitations
- **Map & Timeline roadmap in BACKLOG.md** — comprehensive 10-workstream roadmap covering: per-country SVG paths, region audit, concurrent events view, time slider, country highlighting, interaction improvements, semantic zoom, visual polish, search, and component extraction prep

### How the difficulty system works

Each event in `descriptionDistractors.js` has hand-crafted distractors across 3 tiers:
- **d:1** — clearly wrong but topically adjacent (e.g., "A sudden mutation gave primates the ability to walk upright")
- **d:2** — plausible but with wrong details (e.g., "Brain size doubled immediately after separating from great apes")
- **d:3** — very subtle, nearly correct but one key detail is off (e.g., "The divergence was rapid and produced the first stone tool users")

At d:3, the correct answer also switches from the regular `description` to `hardCorrect` — a non-obvious true statement that's harder to identify.

The `generateDescriptionOptions(event, allEvents, difficulty)` function in `quiz.js` picks 3 distractors preferring the requested tier, falling back to other tiers if needed. When `difficulty` is null (legacy), all tiers are mixed randomly.

**Files:** `src/data/quiz.js` (generation), `src/data/descriptionDistractors.js` (content, 126+ events covered), `LessonFlow.jsx` / `PracticePage.jsx` / `PlacementQuizFlow.jsx` (consumers).

### Docs
- **CLAUDE.md** — added housekeeping rules (keep docs/changelog/version up to date after every substantial change), commit & push workflow (build web + Android first, commit message includes version + full changelog since last push, push triggers GitHub Pages deploy), and description difficulty tier documentation

---

## [1.6.7] - 2026-03-05

### Added
- **"Welcome Back" modal** — when the user returns after 2+ days of inactivity, a cute axolotl modal greets them with a message that varies by how long they were away
- **Daily quiz description distractors** — added hand-crafted distractors for all 30 daily events so description questions in practice mode use plausible, thematically relevant wrong answers instead of random nearby events

---

## [1.6.6] - 2026-03-04

### Changed
- **Learn page — collapsible era sections** — lessons are now grouped under expandable era headers showing completion progress; the user's current era auto-expands on load
- **Lesson intro redesigned** — large faint watermark icon behind content, tighter vertical spacing, removed mascot from intro screen
- **Daily Quiz intro** — added back button, vertically centered layout
- **Streak flame (inactive)** — flame is now grey instead of blue, full-size (matching active flame), and static (no animation) when streak is not ongoing
- **"Your Journey" modal** — title is now centered with improved spacing
- **TopBar hourglass enlarged** — icon bumped from 20px to 26px with tighter logo gap

### Fixed
- **Vite base path** — Capacitor builds now use relative `./` base path instead of `/Chronos_App/`, fixing asset loading on Android
- **Quiz distractors** — replaced 10 description distractors that were ambiguous or debatable with clearer, more distinct wrong answers

---

## [1.6.0] - 2026-03-03

### Changed
- **Hourglass logo refreshed** — interior glass lines now join cleanly at the waist (no visible gap or play-button artifact), and the play triangle overlay is removed from TopBar, splash screens, and all icon assets
- **App icon updated** — full-bleed 512×512 Play Store icon with larger hourglass (10% bigger), proper full-bleed square format so Play Store applies its own rounded mask cleanly
- **Ambient music volume halved** — background music plays at 50% of previous volume for a more subtle, unobtrusive listening experience

---

## [1.5.2] - 2026-03-03

### Added
- **Placement Quizzes in Settings** — new "Placement Quizzes" card in Settings with a "Take Quiz" button; shows how many eras have been skipped when at least one has been passed
- **Prologue summary: Level overview** — Lesson 0 completion screen now shows a "What's next" card listing Level 1 (20 lessons, 60 events) and Level 2 (7 thematic chapters) so new users know what to expect
- **Prologue summary: support row** — Buy Me a Coffee and Rate the App buttons appear at the bottom of the Lesson 0 summary screen

### Changed
- Placement quiz eras are now **all available at once** — no sequential unlocking required; users can pick any era they want to test
- Onboarding flow simplified — removed the full-screen `placement_offer` and `post_lesson0` overlay screens; the Prologue summary now carries a brief note ("Already know some history? Placement quizzes are available in Settings — though we encourage completing each lesson first")
- Added migration for users who had `post_lesson0` or `placement_offer` stored as their onboarding step (redirected to `complete`)

---

## [1.5.1] - 2026-03-03

### Improved
- Map: **Natural Earth I projection** replacing equirectangular — continents now have familiar, properly-shaped proportions (Greenland no longer squished, Europe/Scandinavia look correct). SVG paths regenerated from world-atlas 110m data via d3-geo
- Map: fullscreen layout fixed — was appearing as a tiny horizontal strip on portrait phones. Now uses 280% oversized scrollable container filling ~84% of screen height, auto-centers on Europe/Middle East on open
- Map: close button moved from lost-above-the-map position to a sticky translucent overlay floating on top of the map, always visible and accessible
- Map: pinch-to-zoom and drag-to-pan — two-finger pinch zooms in up to 4x, one-finger drag pans when zoomed, reset button appears at top-left to snap back
- Map: larger pins (6px single, 10px cluster) with 18px invisible hit area and subtle drop shadow for better mobile tap accuracy
- Map: selected-pin highlight — tapped pin/cluster now shows a pulsing ring animation in the category color
- Map: distinct ocean color (#D6CFC4) separates water from the parchment land masses
- Map: faint graticule grid lines (every 30° lat/lng) as projected polylines matching Natural Earth I curvature
- Map: collapsible category legend (info button, top-right) showing all 5 category colors plus "Undiscovered" muted pin
- Map: event popup now shows a truncated description (expandable "Read more") for learned events
- Map: full dark mode support — all map colors (ocean, land, borders, pins, labels, graticule) defined as CSS custom properties with dark-mode overrides
- Timeline: "Loca" region filter dropdown in the filter bar — filter events by sub-region in both list and map views, persisted to localStorage, syncs with map region chips

### Changed
- Regions: expanded from 5 broad regions (Africa, Asia, Americas, Europe, Middle East) to 11 historically meaningful sub-regions: Europe, Middle East, North Africa, West Africa, East Africa, Southern Africa, South Asia, East Asia, North America, Central America, South America
- All 126 events reclassified with accurate sub-regions (e.g., "Africa" split into North/West/East/Southern Africa; "Asia" into South/East Asia; "Americas" into North/Central/South America)
- Map region filter chips now show sub-regions instead of continents; selecting a sub-region highlights its parent continent on the SVG map
- Location quiz questions now generate smarter distractors using the more granular sub-regions (same-sub-region options are harder, cross-region options are easier)
- Region labels in lesson cards, practice results, and quiz feedback now display the specific sub-region (e.g., "East Africa" instead of "Africa")

---

## [1.5.0] - 2026-03-02

### Added
- Map view for events — toggle between Timeline list and Map views via TabSelector on the Timeline page. Custom inline SVG world map with simplified continent outlines in parchment style. Category-colored pins with grid-based clustering for overlapping locations (e.g., Rome, Paris). Tappable regions and region filter chips. Bottom popup card showing event details with mastery dots. Respects all existing filters
- Event connections & cause-and-effect — "Connected Events" section on Timeline expanded cards and lesson learn cards showing directional causal links between historical events (e.g., French Revolution → "Revolutionary chaos led to Napoleon's rise"). ~100 connections across 54 events. Clickable in Timeline to navigate to the connected event
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
