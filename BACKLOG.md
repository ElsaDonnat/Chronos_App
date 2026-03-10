# Chronos — Feature Backlog

> **Instructions for AI agents:** When asked to "run some improvements" or "pick the next thing to do",
> choose the highest-priority unfinished item from this list and implement it fully.
> After completing an item, update this file:
> 1. Move the completed item to a "## Completed" section at the bottom with the date
> 2. If the implementation revealed new sub-tasks or follow-ups, add them in the right priority position
> 3. If an existing item is now partially done, update its description to reflect remaining work
> 4. Run `npm run build && npx cap sync` after any changes

---

## Map & Timeline — Full Roadmap

The map is intended to become a flagship feature of Chronos — visually rich, scalable to hundreds of events, and eventually extractable as a standalone component. This roadmap covers everything from foundational architectural changes to polish. Items are ordered by dependency (foundations first, features second, polish last).

**Current state (as of v1.9.1):** Natural Earth I projection, 800×500 SVG viewBox, per-country SVG paths (177 countries grouped by continent) with country highlighting on event selection, 14 sub-regions (incl. Southeast Asia, Central Asia, Oceania), pastel-colored watercolor atlas with tap-to-select, grid-based pin clustering, CSS pinch-zoom + desktop wheel zoom, fullscreen mode with region auto-scroll, animated pin entrance. See CLAUDE.md "Map System" section for full architecture docs.

---

### ~~Foundation — Per-country SVG paths~~ ✅ Done (2026-03-09)

Per-country SVG paths now stored individually with ISO code + name, grouped by continent. MapView renders ~177 `<path>` elements instead of 5 blobs. Bundle size impact: +2KB gzipped.

### ~~Feature — Country highlighting on event selection~~ ✅ Done (2026-03-09)

Selecting an event pin highlights the country where it happened with a distinct fill + gold stroke. Uses coordinate-based point-in-polygon matching at runtime (no `countryCode` field needed on events). Smooth CSS transitions on highlight/unhighlight.

---

### ~~Feature — Sub-region map interaction~~ ✅ Done (2026-03-10)

Each sub-region filled with a distinct pastel color (watercolor atlas look). Tapping a country selects its sub-region (vibrant color), other regions dim. `COUNTRY_TO_SUBREGION` mapping (~170 ISO codes → 11 sub-regions) and `REGION_COLORS` (pastel/vibrant pairs via CSS custom properties) added to `mapPaths.js`. 22 CSS variables for light + dark mode. `RegionEventList` component shows learned events for the selected region. Sound feedback via `feedback.tap()`.

---

### ~~Foundation — Region system audit~~ ✅ Done (2026-03-10)

Expanded from 11 to 14 sub-regions by splitting "East Asia" into East Asia (China/Japan/Korea), Southeast Asia (10 countries), Central Asia (6 countries), and Oceania (4 countries). Updated `COUNTRY_TO_SUBREGION`, `REGION_COLORS` (6 new CSS vars × light/dark), `REGION_CENTERS`, `normalizeRegion()`, and the generation script. Re-tagged f29 (Mongol Empire) to "Central Asia". Note: two-tier continent/region filter toggle deferred — the existing region dropdown handles 14 options well.

---

### Feature — Concurrent Events view (new Timeline tab)

**Why:** A core educational insight in world history is understanding what was happening simultaneously in different places. The user saw an attempt at this (screenshot showed a grid of events by category × time) but it was cluttered and organized by event type. The right axis is **region**, not category — "While Rome was falling, what was happening in China?"

**What to do:**
- Add a third tab to the Timeline page: `Timeline | Map | Sync` (or "Concurrent" / "World View" — name TBD)
- Layout: vertical axis = regions (grouped by continent), horizontal axis = time. Each row shows events for that region, positioned by year
- Time navigation: **era buttons** for quick jumps (Ancient, Medieval, etc.) + a **draggable time slider** within each era for fine-grained scrubbing. The slider defines a time window (e.g., ±50 years around the cursor) and shows events within that window
- Visual: clean horizontal swim lanes per region. Events appear as small titled cards or dots. Vertical "now" line shows the selected year. Fade events outside the time window
- Only show learned events (consistent with map behavior)
- Consider linking to map: tapping an event in the concurrent view could highlight it on the map, and vice versa

**Files:** New component `src/components/ConcurrentView.jsx` (or similar), `src/pages/TimelinePage.jsx` (add tab)

---

### Feature — Time slider on map

**Why:** The "killer feature" for a history map. Scrubbing through time and watching pins appear/disappear chronologically makes history tangible. Works both as standalone map feature and as the time control shared with the Concurrent view.

**What to do:**
- Add a slider bar below the map (both inline and fullscreen modes)
- Slider range = min year to max year of all learned events
- As user drags, pins fade in/out based on whether their year falls within a window around the slider position
- Era-aware window size: prehistory shows wider window (±500 years), modern shows tighter (±20 years)
- Era quick-jump buttons above or beside the slider
- Optional: auto-play mode that slowly scrubs through time

**Files:** `src/components/MapView.jsx`, potentially a shared `TimeSlider` component

---

### ~~UX — Interaction improvements~~ ✅ Done (2026-03-10)

All sub-items completed:

- ~~**Region auto-scroll in fullscreen**~~ ✅ Done (2026-03-09)
- ~~**Double-tap to zoom**~~ ✅ Done (2026-03-10)
- ~~**Swipe-down to dismiss fullscreen**~~ ✅ Done (2026-03-10)
- ~~**Desktop wheel zoom**~~ ✅ Done (2026-03-09)
- ~~**Hover states (desktop)**~~ ✅ Done (2026-03-10)
- ~~**Cluster drill-down**~~ ✅ Done (2026-03-10) — zoom-aware clustering with debounced recalculation

---

### UX — Semantic zoom (zoom-adaptive rendering)

**Why:** Current zoom is CSS-only — `transform: scale()` just magnifies the same SVG. At 4× zoom, pins are huge, text is blurry, and clustering doesn't adapt. True semantic zoom re-renders the map at each zoom level.

**What to do:**
- **Dynamic cluster recalculation** — `CLUSTER_GRID = 25` is fixed. Recompute clusters based on current zoom level: at 2×, use grid size 12; at 4×, use grid size 6. Pins should spread out as you zoom in.
- **Pin labels on zoom** — when zoomed >2×, show event title text next to pins for identification without tapping.
- **Level-of-detail rendering** — at base zoom, show simplified continent shapes. At 2×+, show country borders (per-country paths now ready). At 4×+, show region labels and pin titles.
- Replace CSS `transform: scale()` with actual SVG viewBox manipulation for crisper rendering at all zoom levels.

**Files:** `src/components/MapView.jsx`

---

### Visual — Map aesthetics

- **Event connection arcs** — draw faint curved lines between related events on the map. Data already exists in `EVENT_CONNECTIONS`. Togglable via a button or auto-shown when a connected pin is selected.
- ~~**Animated pin entrance**~~ ✅ Done (2026-03-09)
- **Era coloring mode** — toggle to color pins by era (Prehistory/Ancient/Medieval/Early Modern/Modern) instead of category. Gives a temporal view of geographic spread.
- **Region labels fade near pins** — the static continent name labels can overlap event pins. Fade them when pins are nearby or when zoomed in.
- **Higher resolution map data** — switch from 110m to 50m (or 10m for fullscreen) for cleaner coastlines. Test bundle size impact. Could lazy-load the high-res version only for fullscreen.

---

### Visual — Search on map

**Why:** As event count grows (currently 126, targeting 200+), finding a specific event on the map becomes hard.

**What to do:**
- Search bar overlaid on map (fullscreen mode primarily)
- Fuzzy search by event title, date, or location
- Matching pin highlighted + map auto-scrolls/zooms to it
- Search results dropdown for multiple matches

**Files:** `src/components/MapView.jsx`

---

### Architecture — Clean component interfaces for future extraction

**Why:** The map, concurrent view, and timeline data should eventually be extractable from Chronos as a standalone history visualization tool. Not a rewrite — just clean interfaces now that prevent tight coupling later.

**What to do:**
- `MapView` should accept generic event data via props (it mostly does already — `events`, `learnedIds`, `eventMastery`). Ensure no direct imports of Chronos-specific state inside MapView.
- Extract the projection math (`projectToSVG`, region system) into a standalone utility module with no Chronos imports
- The new `ConcurrentView` should similarly accept events + mastery as props
- The `TimeSlider` component should be reusable across map and concurrent view
- Keep card/popup components (EventPopup, ClusterPopup) accepting event objects — these become the "card dependencies" that travel with the map if extracted
- No need to build a package now — just maintain clean prop boundaries so extraction is a packaging task, not a rewrite

**Files:** `src/components/MapView.jsx`, `src/data/mapPaths.js`, any new components

---

### Polish — Fullscreen experience

- **Mini-map** — small overview rectangle in corner showing which portion of the world map is currently in the viewport.
- **Orientation lock hint** — on mobile, suggest rotating to landscape for better fullscreen map viewing.
- **Gesture tutorial** — first time opening fullscreen, show a brief hint about pinch-to-zoom and scroll.

---

### Implementation order (suggested)

~~1. **Per-country SVG paths** ✅~~
~~2. **Country highlighting on event selection** ✅~~
~~3. **UX: wheel zoom, region auto-scroll, pin animations** ✅~~
~~4. **Sub-region map interaction** ✅~~
~~5. **Region audit** ✅~~
~~6. **UX interaction improvements** ✅~~ — double-tap zoom, swipe-down fullscreen dismiss, hover states, cluster drill-down
7. **Time slider on map** — high-impact standalone feature
8. **Concurrent events view** — the biggest new feature, benefits from time slider and region system
9. **Semantic zoom** — zoom-adaptive clustering + viewBox manipulation
10. **Visual polish** — connection arcs, era coloring, region label fading, higher resolution
11. **Search on map** — important as event count grows
12. **Component extraction prep** — ongoing, enforce clean interfaces throughout

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
- **P2 — Star events from result cards** (2026-03-09): StarButton already present in LessonFlow result dot modal and PracticePage results. Added StarButton to DailyQuizFlow result cards for consistency across all quiz result screens.
- **P2 — Map improvements batch 1** (2026-03-03): Pinch-to-zoom (up to 4x) and drag-to-pan, larger pins (6px/10px) with 18px hit areas and drop shadows, selected-pin pulse animation, distinct ocean color, graticule grid lines, collapsible category legend, event description in popup, full dark mode via CSS custom properties.
- **P2 — Sub-region system** (2026-03-03): Expanded from 5 broad regions to 11 sub-regions (Europe, Middle East, North Africa, West Africa, East Africa, Southern Africa, South Asia, East Asia, North America, Central America, South America). All 126 events reclassified. Map chips filter by sub-region with continent SVG highlighting. Quiz distractors use sub-regions for smarter same-region options. Region labels updated across all UI (lesson cards, practice, quiz feedback).
- **P3 — Map improvements batch 2** (2026-03-03): Cropped SVG viewBox from 800×450 to 800×370, removing empty Antarctica/southern ocean so northern hemisphere events fill more of the visible map. Added "Loca" region filter dropdown to Timeline filter bar — works in both list and map views, persisted to localStorage, syncs with map region chips.
- **P3 — Map improvements batch 3** (2026-03-03): Fixed fullscreen map appearing as a tiny horizontal strip. Fullscreen now uses 280% oversized map in a scrollable container with auto-centering on Europe/Middle East. Simplified usePanZoom to use native scroll at base zoom and CSS transforms only when pinch-zoomed. Inline mode uses 200% width with 2:1 aspect ratio container.
- **P2 — Map improvements batch 4: Natural Earth projection** (2026-03-03): Replaced equirectangular projection with Natural Earth I — continents now have familiar, properly-shaped proportions (Greenland, Scandinavia, northern regions no longer squished/distorted). SVG paths regenerated from world-atlas 110m data via d3-geo with `geoNaturalEarth1()`. ViewBox updated to 800×500. `projectToSVG()` reimplemented using Natural Earth I polynomial coefficients (scale 143.3071, translate [400, 250]). Close button moved from lost-above-map to sticky translucent overlay. Graticule lines rendered as projected polylines matching the curved projection. All REGION_CENTERS recalculated for new projection. Generation script at `scripts/generate-map-paths.mjs`.
- **P4 — Level 2 Chapter: Science That Changed Everything** (2026-03-09): 4-lesson chapter with 11 new events (f127–f137) tracing breakthroughs from Hippocrates to the Higgs boson. Reuses f38 (Scientific Revolution). Teal theme, telescope icon, new atom icon (index 44). Hand-crafted distractors and controversy notes for all events.
- **UX — Map improvements batch 5: interaction & animation** (2026-03-09): Desktop wheel zoom (onWheel handler, ±0.15 per scroll step, 1–4× range). Region auto-scroll in fullscreen (selecting a region chip smoothly scrolls the viewport to center on that region via REGION_CENTERS). Animated pin entrance (staggered scale+fade pop-in, 30ms delay per pin).
- **Foundation — Per-country SVG paths** (2026-03-09): Replaced continent-merged path blobs with individual per-country SVG paths (177 countries, each with ISO code + name). Countries grouped by continent for rendering. MapView renders individual `<path>` elements with `data-country` attributes. Bundle size impact: +2KB gzipped (91KB uncompressed vs 81KB). Unblocks country highlighting, hover states, and semantic zoom.
- **Feature — Country highlighting on event selection** (2026-03-09): Selecting an event pin highlights the country where it happened with a distinct fill + gold stroke. Uses coordinate-based point-in-polygon matching at runtime. Smooth CSS transitions on highlight/unhighlight.
- **Feature — Sub-region map interaction** (2026-03-10): Each sub-region filled with distinct pastel color (watercolor atlas look). Tapping a country selects its sub-region (vibrant saturated color), other regions dim to 0.4 opacity. `COUNTRY_TO_SUBREGION` mapping (~170 ISO codes → 11 sub-regions) and `REGION_COLORS` (pastel/vibrant pairs via CSS custom properties) added to `mapPaths.js`. 22 CSS variables for light mode + 22 for dark mode. `RegionEventList` component shows learned events for the selected sub-region below the map. Sound feedback via `feedback.tap()`. All learned events always visible on map regardless of region filter.
- **Foundation — Region system audit** (2026-03-10): Expanded from 11 to 14 sub-regions. Split "East Asia" into East Asia (China, Taiwan, Japan, Korea), Southeast Asia (Philippines, Malaysia, Cambodia, Thailand, etc.), Central Asia (Mongolia, Kazakhstan, etc.), and Oceania (Papua New Guinea, Fiji, etc.). Added 6 new CSS variable pairs (light + dark). Re-tagged Mongol Empire (f29) to Central Asia. Updated generation script for consistency.
- **UX — Interaction improvements** (2026-03-10): Four improvements: (1) Double-tap to zoom — double-tapping background zooms to 2× centered on tap, double-tap again resets. (2) Swipe-down to dismiss fullscreen — pull-down gesture with visual feedback pill and rubber-band physics. (3) Hover states — desktop-only brightness boost on country paths and drop-shadow glow on pins. (4) Cluster drill-down — tapping a cluster auto-zooms to separate pins via zoom-aware clustering (grid size inversely scales with zoom level, debounced at 150ms).
