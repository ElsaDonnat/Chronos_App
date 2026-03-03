# Chronos — Feature Backlog

> **Instructions for AI agents:** When asked to "run some improvements" or "pick the next thing to do",
> choose the highest-priority unfinished item from this list and implement it fully.
> After completing an item, update this file:
> 1. Move the completed item to a "## Completed" section at the bottom with the date
> 2. If the implementation revealed new sub-tasks or follow-ups, add them in the right priority position
> 3. If an existing item is now partially done, update its description to reflect remaining work
> 4. Run `npm run build && npx cap sync` after any changes

---

## P3 — Map view improvements (remaining)

Four batches of map improvements shipped. Map now uses **Natural Earth I projection** (800×500 viewBox) with properly-shaped continents. Fullscreen uses 280% oversized scrollable container with auto-centering, sticky close button overlay. Inline uses 200% width with 2:1 aspect ratio. Pinch-to-zoom, category legend, dark mode, graticule all done. Remaining items in priority order:

### P2 — High impact UX
- **Region auto-scroll in fullscreen** — tapping a region chip/dropdown should scroll the fullscreen map to center on that region. Currently chips filter pins but don't navigate the viewport.
- **Double-tap to zoom** — standard mobile gesture. Double-tap should zoom to 2× centered on the tap point; double-tap again to reset.
- **Swipe-down to dismiss fullscreen** — more discoverable than the small Close button. Pull down gesture closes the fullscreen overlay.

### P3 — Meaningful features
- **Event connection arcs** — draw faint curved lines between related events on the map. Data already exists in `EVENT_CONNECTIONS`. Togglable via a button or auto-shown when a connected pin is selected.
- **Pin labels on zoom** — when zoomed >2×, show event title text next to pins for identification without tapping.
- **Animated pin entrance** — pins pop in with staggered animation when the map loads or filters change. Makes the map feel alive.
- **Cluster drill-down** — tapping a cluster auto-zooms to that area so individual pins spread out, instead of the current flat list popup.

### P4 — Ambitious features
- **Timeline scrubber** — a slider along the bottom that scrubs through time; pins appear/disappear chronologically. The killer feature for a history map.
- **Era coloring mode** — toggle to color pins by era (Prehistory/Ancient/Medieval/Early Modern/Modern) instead of category. Gives a temporal view of geographic spread.
- **Search on map** — search bar that filters, highlights, and auto-scrolls to the matching pin.

### P5 — Polish
- **Region labels fade near pins** — the static continent name labels can overlap event pins. Fade them when pins are nearby or when zoomed in.
- **Dynamic cluster recalculation** — `CLUSTER_GRID = 25` is fixed. Clusters should re-compute at different zoom levels so pins spread as you zoom in.
- **Mini-map in fullscreen** — small overview rectangle showing which portion of the world map is currently in the viewport.

## P2 — Star events from lesson summary result cards

After completing a lesson, the summary screen lets users tap each result dot to view the event card (correct/incorrect). Currently there is no way to star (favourite) an event from this view. Add a star/bookmark button to the event detail card shown in this post-lesson result modal, so users can immediately save events they found interesting or want to revisit — without having to navigate to the Timeline.

## P5 — Themed collections (remaining)

Cross-cutting study paths like "Women in History", "Scientific Breakthroughs". Groups existing events by theme rather than chronology. Accessible from the Practice page hub as additional collection tiles. Lower priority now that Level 2 thematic chapters exist.


## P5 — Content expansion (more events & lessons)

Add more events per era, deeper non-Western history coverage, and new lessons beyond the current 21. Plan for thematic content packs or era-specific expansions. Priority: regions currently underrepresented (Asia, Africa, Americas pre-colonization). This is a long-term effort — the app framework supports it, but content creation takes time.

---

## Completed

- **P1 — Streak visual indicator** (2026-02-27): Enhanced TopBar flame icon with 3 animated states (active/at-risk/inactive), dynamic colors, and a tap-to-open streak detail modal with contextual motivational messages.
- **P1 — Correct answer celebration card** (2026-02-27): 1.5s auto-dismiss (or tap) interstitial after correct answers showing celebrating mascot, event card with green styling, running score counter. Works in both learn quiz and recap phases.
- **P1 — Lesson intro event preview** (2026-02-27): Lesson intro screen now shows a visual preview of upcoming content — 5 era icons with titles for Lesson 0, and event cards with category colors/dates for regular lessons. Staggered fade-in animation.
- **P2 — Push notifications for streak reminders and daily learning** (2026-02-27): Local notifications via @capacitor/local-notifications with onboarding modal after first lesson, daily reminder time picker, streak alerts at 8pm, Settings controls, and full web-safe fallbacks.
- **Content — Shorter quiz descriptions** (2026-02-27): Added `quizDescription` field to all 60 events — one-sentence summaries used as MCQ options in description quiz questions. Full descriptions preserved for learn cards.
- **P2 — Controversy/ambiguity info buttons on quiz answers** (2026-03-02): Added `controversyNotes` to 17 events with genuine historical ambiguity (keyed by question type). ControversyNote component shows a "?" button after answering that expands to a scholarly note. Integrated into both LessonFlow and PracticePage quiz rendering.
- **Polish — Fisher-Yates shuffle** (2026-03-02): Replaced all biased `.sort(() => Math.random() - 0.5)` shuffles with proper Fisher-Yates algorithm across quiz.js, LessonFlow, Lesson0Flow, and PracticePage.
- **Polish — Timeline auto-scroll** (2026-03-02): Expanded timeline event cards now auto-scroll into view smoothly.
- **Polish — ConfirmModal accessibility** (2026-03-02): Added `role="dialog"`, `aria-modal`, `aria-labelledby`, and auto-focus on cancel button.
- **P2 — Achievements & badges system** (2026-03-02): 15 achievements across 7 categories (learning, streaks, XP, discovery, collection, mastery, daily quiz). Trophy button in TopBar with notification dot. AchievementsModal with 3-column grid showing unlocked/locked state with progress bars. Achievement toast slides in from top on unlock, auto-dismisses after 3.5s. Checker hook runs on state changes.
- **P2 — Daily quick quiz ("This Day in History")** (2026-03-02): 10 days of "This Day in History" content (3 real historical events per day, cycling from March 2). Gold/amber visual theme distinct from lesson quizzes. 3-phase flow: learn cards → MCQ quiz → results. Double XP (20 per correct answer, max 60). Daily quiz card on Learn page shows completion state. Counts toward streak via ADD_XP.
- **P3 — Onboarding flow for new users** (2026-03-02): Welcome screen → Lesson 0 guide → Post-lesson explanation → Placement quiz offer. 5 era-based placement quizzes (Prehistory, Ancient, Medieval, Early Modern, Modern) with MCQ questions. Passing unlocks all lessons in that era and marks events as seen/skipped. Skip tutorial available at every step.
- **P3 — Spaced repetition for practice mode** (2026-03-02): SM-2 variant algorithm tracking interval, ease, next review date, and review count per event. 4-tier card status system (New → Learning → Known → Fully Assimilated). "Spaced Review" replaces old Smart Review, prioritizing due cards. SR schedule updates after every answer in both lessons and practice.
- **P2 — Study timer & session stats** (2026-03-02): Tracks session duration for lessons, practice, and daily quiz. Shows time on completion screens (e.g., "3m 42s"). Displays cumulative study time and session count in Settings. Stores last 50 sessions. Study time preserved across progress resets.
- **P3 — Sound effects and haptic feedback** (2026-03-02): Web Audio API sine-wave tones (ascending minor third for correct, single warm tone for close, descending minor second for wrong, 3-note arpeggio for completion, 4-note sparkle for achievements) with native haptics via @capacitor/haptics. Module-level feedback service (`src/services/feedback.js`) configured from AppContext. Independent toggles in Settings for sound and haptics.
- **P3 — Share a challenge** (2026-03-02): Text-based sharing via Web Share API (clipboard fallback on desktop). "Share Result" button on lesson summary, practice results, and daily quiz results. "Share Streak" button in streak modal (adaptive color per streak status). Messages include score, XP, streak, and Play Store link. Service in `src/services/share.js`.
- **P3 — Weekly learning insights** (2026-03-02): "This Week" recap card on the Learn page showing sessions, questions answered, study time, strongest era, and weakest era (focus suggestion). Dismissible per week via localStorage. Only appears after 3+ events learned and at least 1 session that week. Calculated from existing state data (studySessions, seenEvents, eventMastery).
- **P3 — Event connections & cause-and-effect** (2026-03-02): Added `relatedEvents` to 54 of 60 events with ~100 directional causal connections. `EVENT_CONNECTIONS` map in events.js with `getRelatedEvents()` helper. Reusable `EventConnections` component in shared.jsx matching "Before & After" visual pattern. Integrated into Timeline expanded cards (clickable, scrolls to target event) and LessonFlow learn cards (read-only context). Category-colored chevron arrows with italic causal labels.
- **P3 — Themed collections: Revolutions That Changed the World** (2026-03-03): Level 2 chapter with 4 lessons and 7 new events (f61–f67) tracing revolutions from the English Civil War through the Arab Spring. Chain-of-causation structure linking each revolution to the next. Reuses 3 existing Level 1 events alongside new content.
- **P3 — Map view for events** (2026-03-02): Custom inline SVG world map on the Timeline page. TabSelector toggle between Timeline (list) and Map views. 5 continent region paths with parchment styling. Category-colored event pins with grid-based clustering for overlapping locations. Region filter chips + tappable continents. Bottom popup Card for event details with CategoryTag/MasteryDots. Respects all existing filters (era, category, hideUnknown). View mode persisted to localStorage.
- **P3 — Level 2 Chapter: The Road to Artificial Intelligence** (2026-03-03): 4-lesson chapter with 10 new events (f68\u2013f77) tracing the path from the Scientific Revolution to ChatGPT. Babbage & Lovelace, Boolean logic, Turing, ENIAC, transistors, Dartmouth Conference, AI Winters, Deep Blue, deep learning, and LLMs. Reuses f38 (Scientific Revolution) and f58 (Digital Revolution). Blue theme, brain icon. Configurable chapter icons via `iconIndex` field.
- **P3 — Level 2 Chapter: The Fight for Freedom** (2026-03-03): 4-lesson chapter with 10 new events (f78–f87) tracing liberation movements from abolition to digital activism. Abolitionist Movement, Underground Railroad, Suffragettes, Gandhi, Civil Rights, Apartheid & Mandela, Stonewall, Tiananmen, Rwandan Genocide, and digital activism. Reuses f39 (Atlantic Slave Trade) and f56 (Decolonization). Emerald green theme, scales icon. Rich cause-and-effect connections to existing events.
- **P4 — Level 2 Chapter: Empires Rise & Fall** (2026-03-03): 4-lesson chapter with 9 new events (f88–f96) tracing empires from Persia to decolonization. Achaemenid Persia, Maurya & Ashoka, Han Dynasty, Gupta Golden Age, Ottoman Empire, Ming Dynasty, Mughal Empire, British Empire, Fall of the Ottomans. Reuses f15 (Alexander), f18 (Pax Romana), f56 (Decolonization). Purple theme, temple columns icon. Strong non-Western coverage.
- **P4 — Level 2 Chapter: Plagues & Pandemics** (2026-03-03): 4-lesson chapter with 10 new events (f97–f106) tracing disease from ancient Rome to COVID-19. Antonine Plague, Smallpox & Aztecs, Great Plague of London, Jenner & vaccination, cholera & epidemiology, Spanish Flu, penicillin, smallpox eradication, HIV/AIDS, COVID-19 & mRNA. Reuses f22 (Plague of Justinian) and f30 (Black Death). Dark crimson theme, skull icon.
- **P4 — Dark mode** (2026-03-03): Full dark theme via `html[data-theme="dark"]` CSS variable overrides. Warm dark palette (parchment #1A1816, card #23201D, ink #E8E4DF). 3-mode toggle in Settings (Light/Dark/Auto) with system `prefers-color-scheme` support. Added `--color-ink-rgb`/`--color-parchment-rgb` variables and replaced ~93 hardcoded rgba values across CSS and 11 JSX files. Meta theme-color updates dynamically.
- **P2 — Map improvements batch 1** (2026-03-03): Pinch-to-zoom (up to 4x) and drag-to-pan, larger pins (6px/10px) with 18px hit areas and drop shadows, selected-pin pulse animation, distinct ocean color, graticule grid lines, collapsible category legend, event description in popup, full dark mode via CSS custom properties.
- **P2 — Sub-region system** (2026-03-03): Expanded from 5 broad regions to 11 sub-regions (Europe, Middle East, North Africa, West Africa, East Africa, Southern Africa, South Asia, East Asia, North America, Central America, South America). All 126 events reclassified. Map chips filter by sub-region with continent SVG highlighting. Quiz distractors use sub-regions for smarter same-region options. Region labels updated across all UI (lesson cards, practice, quiz feedback).
- **P3 — Map improvements batch 2** (2026-03-03): Cropped SVG viewBox from 800×450 to 800×370, removing empty Antarctica/southern ocean so northern hemisphere events fill more of the visible map. Added "Loca" region filter dropdown to Timeline filter bar — works in both list and map views, persisted to localStorage, syncs with map region chips.
- **P3 — Map improvements batch 3** (2026-03-03): Fixed fullscreen map appearing as a tiny horizontal strip. Fullscreen now uses 280% oversized map in a scrollable container with auto-centering on Europe/Middle East. Simplified usePanZoom to use native scroll at base zoom and CSS transforms only when pinch-zoomed. Inline mode uses 200% width with 2:1 aspect ratio container.
- **P2 — Map improvements batch 4: Natural Earth projection** (2026-03-03): Replaced equirectangular projection with Natural Earth I — continents now have familiar, properly-shaped proportions (Greenland, Scandinavia, northern regions no longer squished/distorted). SVG paths regenerated from world-atlas 110m data via d3-geo with `geoNaturalEarth1()`. ViewBox updated to 800×500. `projectToSVG()` reimplemented using Natural Earth I polynomial coefficients (scale 143.3071, translate [400, 250]). Close button moved from lost-above-map to sticky translucent overlay. Graticule lines rendered as projected polylines matching the curved projection. All REGION_CENTERS recalculated for new projection. Generation script at `scripts/generate-map-paths.mjs`.
