# Initial Prompt for Claude Code — AI Safety Learning App

> Copy everything below this line and paste it as your first message to Claude Code
> in the AI-Safety- project directory.

---

This repo contains a copy of the Chronos history-learning app. Your job is to transform it into an AI Safety learning app. **Read CLAUDE.md first** — it contains the complete architecture guide, file-by-file instructions, and design system.

## Phase 1: Scaffold the AI Safety App

Do these steps in order. After each major step, verify `npm run dev` still works.

### Step 1: Clean up config files
- Rename package.json: name to `"ai-safety"`, version to `"0.1.0"`
- Remove `d3-geo`, `topojson-client`, `world-atlas` from devDependencies
- Remove `@fontsource/libre-baskerville` from dependencies (we'll replace it)
- Install `@fontsource/space-grotesk` (run `npm install @fontsource/space-grotesk`)
- Update `vite.config.js`: change base path from `'/Chronos_App/'` to `'/AI-Safety-/'`
- Update `capacitor.config.ts`: change appId to `'com.elsadonnat.aisafety'`, appName to `'AI Safety'`, update background colors to `'#F0F4F8'`
- Update `index.html`: change title to "AI Safety", update meta description
- Run `npm install` to sync the lock file

### Step 2: Delete history-specific files
Delete ALL of these files (they are map, timeline, and placement-specific):
- `src/components/MapView.jsx`
- `src/components/ConcurrentView.jsx`
- `src/components/LessonIcon.jsx`
- `src/components/learn/PlacementQuizFlow.jsx`
- `src/components/learn/Lesson0Flow.jsx`
- `src/pages/TimelinePage.jsx`
- `src/data/mapPaths.js`
- `src/data/placementQuiz.js`
- `src/utils/timeSlider.js`
- `scripts/write-map-data.mjs`

Do NOT delete anything else.

### Step 3: Update the design system (src/index.css)
- Replace the Chronos color palette with the new one from CLAUDE.md:
  - Background: `#F0F4F8` (light steel blue, replaces parchment `#FAF6F0`)
  - Primary: `#1E3A5F` (deep navy, replaces burgundy `#8B4157`)
  - Accent: `#00BFA5` (teal)
  - Keep ink color `#1C1917`
  - Add dark mode equivalents from CLAUDE.md
- Replace `@fontsource/libre-baskerville` import with `@fontsource/space-grotesk`
- Update font-family declarations: display/headings use "Space Grotesk", body keeps "DM Sans"
- Remove ALL map-related CSS: region color variables, `.time-slider-input` styles, map animations, fullscreen map styles, any CSS mentioning "map", "region", "continent", "graticule"
- Keep ALL other animations: fadeInUp, slideInRight/Left, mascotFloat, quiz animations, streak animations, achievement animations, button/card animations

### Step 4: Create the data layer
- **Rename** `src/data/events.js` → `src/data/concepts.js`. Create it with:
  - The new card data shape from CLAUDE.md (id, title, summary, description, quizDescription, topic, secondaryTopic, category, difficulty, tags, linkedCards, importance, isFoundational)
  - 3–5 placeholder concept objects so the app has something to render
  - Helper functions: `getConceptById(id)`, `getConceptsByTopic(topic)`, `getConceptsByTag(tag)`, `ALL_CONCEPTS` export
- **Update** `src/data/lessons.js`:
  - Add a `TOPICS` array with 2-3 placeholder topics (e.g., interpretability, alignment)
  - Convert LESSONS to the new structure: each lesson has `topic`, `cardIds` (instead of `eventIds`), optional `isFoundational`
  - Add 2-3 placeholder lessons that reference the placeholder concepts
- **Empty out** (keep the export structure, clear the content arrays):
  - `src/data/dailyQuiz.js`
  - `src/data/funFacts.js`
  - `src/data/descriptionDistractors.js`
- **Adapt** `src/data/quiz.js`:
  - Remove all date-scoring logic (magnitude-based tolerances, year ranges, `generateDateOptions`, `scoreDateAnswer`)
  - Remove all location-scoring logic (`generateLocationOptions`)
  - Keep MCQ generation for what/why/how dimensions
  - Update imports: `events.js` → `concepts.js`, `ALL_EVENTS` → `ALL_CONCEPTS`
- **Adapt** `src/data/achievements.js`:
  - Rename achievement titles/descriptions for AI safety context (e.g., "First Discovery" → "First Insight", "History Buff" → "Safety Scholar")
  - Keep the `useAchievementChecker()` hook pattern
- **Adapt** `src/data/challengeQuiz.js`:
  - Remove question types: `whichCameFirst`, `eraDetective`, `chronologicalOrder`
  - Keep: `trueOrFalse`, `hardMCQ`, `oddOneOut`
  - Add placeholder for: `conceptRelationship` (uses `linkedCards`)
  - Update all imports from events → concepts

### Step 5: Adapt the state (src/context/AppContext.jsx)
- Change `STORAGE_KEY` from `'chronos-state-v1'` to `'aisafety-state-v1'`
- Rename state fields:
  - `eventMastery` → `cardMastery` (now has 3 dimensions: `whatScore`, `whyScore`, `howScore` — remove `locationScore`, `dateScore`, `descriptionScore`)
  - `seenEvents` → `seenCards`
  - `starredEvents` → `starredCards`
  - `dailyQuiz.acquiredEventIds` → `dailyQuiz.acquiredCardIds`
- Remove state fields: `placementQuizzes`, `skippedEvents`
- Simplify `onboardingStep`: values are now `'welcome'` | `'topic_overview'` | `'complete'` | `null` (remove `'guide_lesson0'`, `'placement_active'`)
- Update ALL action types:
  - `UPDATE_EVENT_MASTERY` → `UPDATE_CARD_MASTERY`
  - `MARK_EVENTS_SEEN` → `MARK_CARDS_SEEN`
- Update ALL reducer cases to use the new field names
- Update the migration function for new state shape
- Remove imports of deleted files (lessons `getEraQuizGroup`, etc.)

### Step 6: Adapt navigation and pages
- **`src/App.jsx`**: 4 tabs — `'learn'` | `'library'` | `'practice'` | `'challenge'`. Remove all timeline/map imports. Import new `LibraryPage`.
- **`src/components/BottomNav.jsx`**: Update tab labels to Learn, Library, Practice, Challenge. Use appropriate icons (book, grid/bookshelf, target/refresh, trophy).
- **`src/components/layout/Sidebar.jsx`**: Same tab label updates.
- **`src/components/TopBar.jsx`**: Change app name from "Chronos" to "AI Safety".
- **`src/pages/LearnPage.jsx`**: Show topics (from `TOPICS` array) instead of era-based lesson lists. Each topic is expandable and shows its lessons. Remove all placement quiz logic and era quiz groups.
- **NEW: `src/pages/LibraryPage.jsx`**: Create a new page that shows a filterable grid/list of all learned cards. Features:
  - Filter by topic (dropdown or tabs)
  - Filter by category (chip filters)
  - Filter by tag (searchable tag list)
  - Search by title (text input)
  - Each card shows: title, summary, category dot, mastery dots (3), topic badge
  - Tapping a card expands it to show full description + linked cards
  - Empty state: "Complete lessons to discover cards"
- **`src/pages/PracticePage.jsx`**: Change all references from `eventMastery` → `cardMastery`, from 4 mastery dimensions to 3. Update mastery thresholds (0-9 instead of 0-12). Remove location/date practice modes.
- **`src/pages/ChallengePage.jsx`**: Remove time-based question types from tier configurations. Update imports.

### Step 7: Adapt lesson and quiz components
- **`src/components/learn/LessonFlow.jsx`**: Rename phase `PERIOD_INTRO` → `TOPIC_INTRO`. Remove any date-input or location-selection quiz phases. Keep the (LEARN_CARD → LEARN_QUIZ) × N pattern. Update all references from events→cards/concepts.
- **`src/components/shared.jsx`**: Update `MasteryDots` component to show 3 dots instead of 4 (what/why/how). Update `CategoryTag` colors for new categories (technical/alignment/policy/ethics/risks). Update any tooltips or labels.
- **`src/components/OnboardingOverlay.jsx`**: Simplify to: welcome → topic overview → start first lesson. Remove placement quiz flow.
- **`src/components/DailyQuizFlow.jsx`**: Update terminology (events→cards). Keep flow structure.
- **`src/components/FunFactsFlow.jsx`**: Update terminology. Keep flow structure.

### Step 8: Global search and replace
Search the **entire `src/` directory** for these stale references and replace them:
- `"chronos"` → `"aisafety"` (in storage keys, widget group names, CSS class prefixes)
- `"Chronos"` → `"AI Safety"` (in user-facing display text)
- `eventMastery` → `cardMastery` (in all files)
- `seenEvents` → `seenCards` (in all files)
- `starredEvents` → `starredCards` (in all files)
- `MARK_EVENTS_SEEN` → `MARK_CARDS_SEEN` (in all files)
- `UPDATE_EVENT_MASTERY` → `UPDATE_CARD_MASTERY` (in all files)
- `ALL_EVENTS` → `ALL_CONCEPTS` (in all files)
- `eventIds` → `cardIds` (in lesson definitions)
- `"era"` → `"topic"` (where it refers to content grouping, NOT the word "era" in general English)
- References to "4 mastery dimensions" → "3 mastery dimensions"
- References to "mastery 0-12" → "mastery 0-9"
- References to "12 points" → "9 points"
- References to history categories (`'science'`, `'war'`, `'politics'`, `'culture'`, `'revolution'`) → new categories (`'technical'`, `'alignment'`, `'policy'`, `'ethics'`, `'risks'`)

### Step 9: Verify and create project files
- Run `npm run lint` — fix ALL lint errors
- Run `npm run dev` — verify the app loads in the browser with no console errors
- Verify each tab renders (Learn shows topics, Library shows empty/placeholder state, Practice works, Challenge loads)
- Create **`CHANGELOG.md`**:
  ```
  # Changelog

  ## v0.1.0 — Initial Scaffold
  - Forked from Chronos history-learning app
  - Replaced history content structure with AI safety topics → cards model
  - New design system: navy/teal color scheme, Space Grotesk headings
  - 4 tabs: Learn, Library, Practice, Challenge
  - 3 mastery dimensions (what/why/how) replacing 4 (location/date/what/description)
  - Removed map, timeline, placement quiz, date/location quiz types
  - Kept: spaced repetition, streak system, achievements, sounds, settings, challenge mode
  - Placeholder content only — ready for real AI safety content
  ```
- Create **`BACKLOG.md`** with initial items:
  ```
  # AI Safety App — Feature Backlog

  > Pick the highest-priority unfinished item and implement it fully.

  ## High Priority
  - [ ] Add real AI safety content (topics, cards, quiz questions)
  - [ ] Design new mascot (robot/shield character)
  - [ ] Create topic icons for Learn page
  - [ ] Implement tag-based filtering in Library
  - [ ] Add "conceptRelationship" question type to Challenge mode

  ## Medium Priority
  - [ ] Design onboarding flow with AI safety theme
  - [ ] Add scenario-based quiz questions
  - [ ] Create daily quiz content (10 days of AI safety questions)
  - [ ] Add fun facts about AI safety
  - [ ] Set up Capacitor for Android

  ## Low Priority
  - [ ] Card linking visualization in Library
  - [ ] Cross-topic discovery suggestions
  - [ ] Advanced search with tag combinations
  ```
- Update **`CLAUDE.md`** if any architectural decisions changed during implementation

### Step 10: Commit
- `git add` all relevant files (NOT node_modules, NOT dist)
- Commit: `git commit -m "v0.1.0 — Initial scaffold of AI Safety learning app from Chronos"`
- Push: `git push origin main`

---

## Important Notes

- The app should be **fully functional** with placeholder content after Phase 1
- Every tab should render something (even if Library says "No cards discovered yet")
- The Practice tab should work if you complete a placeholder lesson
- Streaks, XP, achievements, sounds, settings should all work
- Do **NOT** set up Capacitor/Android yet — that comes later
- When in doubt, **keep the Chronos implementation pattern** and just swap the domain terms
- If something breaks and you can't figure out why, check if it's a stale reference to events/eras/Chronos
