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

**Current state (as of v1.9.12):** Natural Earth I projection (50m resolution), 800×500 SVG viewBox, per-country SVG paths (234 countries grouped by continent) with country highlighting on event selection, 14 sub-regions (incl. Southeast Asia, Central Asia, Oceania), pastel-colored watercolor atlas with tap-to-select, grid-based pin clustering, CSS pinch-zoom + desktop wheel zoom, fullscreen mode with region auto-scroll, animated pin entrance, semantic zoom, connection arcs, era coloring, map search. See CLAUDE.md "Map System" section for full architecture docs.

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

### ~~Feature — Concurrent Events view (new Timeline tab)~~ ✅ Done (2026-03-10)

"Sync" tab on Timeline page with regional swim lanes grouped by continent, piecewise-linear time slider with era quick-jumps (showing event counts), smart default position, opacity fade for temporal proximity, tappable expandable event cards, and guided empty state with jump-to-era buttons. Component: `src/components/ConcurrentView.jsx`.

---

### ~~Feature — Time slider on map~~ ✅ Done (2026-03-10)

Piecewise-linear slider with era-aware time windows. Clock toggle button on inline + fullscreen modes. Era quick-jump buttons snap to median learned event year. Pin fade transitions (0.3s CSS opacity). Range event support (yearEnd). Formatted year display. Styled range input with era boundary tick marks.

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

### ~~UX — Semantic zoom (zoom-adaptive rendering)~~ ✅ Done (2026-03-10)

Scale-compensated rendering: all SVG attributes (pin radii, stroke widths, hit areas, text sizes) inversely scale with zoom so elements stay constant screen-size. Pin title labels with parchment-stroke halo appear at 2×+ zoom for learned non-cluster pins. Continent labels fade out at 2×+ zoom. Graticule, coastlines, and country borders all maintain consistent visual weight. Dynamic cluster recalculation (grid scales with zoom) was already in place.

**Remaining for future**: Full SVG viewBox manipulation (replacing CSS `transform: scale()`) for pixel-perfect rendering at all zoom levels. Higher resolution map data (50m/10m) for zoomed-in coastlines.

---

### Visual — Map aesthetics

- ~~**Event connection arcs**~~ ✅ Done (2026-03-10) — faint curved bezier arcs between related events when a connected pin is selected. Category-colored, solid for learned, dashed for unlearned.
- ~~**Animated pin entrance**~~ ✅ Done (2026-03-09)
- ~~**Era coloring mode**~~ ✅ Done (2026-03-10) — Topic/Era toggle in Legend dropdown. Era mode colors pins by historical period (5 eras). Persists to localStorage.
- ~~**Region labels fade near pins**~~ ✅ Done (2026-03-10) — continent labels fade out between 1\u2013 2× zoom (part of semantic zoom). Pin-proximity fading not needed since labels disappear before pin labels appear.
- ~~**Higher resolution map data**~~ ✅ Done (2026-03-10) — upgraded from 110m to 50m with path simplification (1-decimal precision, dedup + collinear removal). Bundle size +37% raw (~144KB vs ~105KB). Also fixed missing countries (Australia, NZ, Singapore, 60+ territories).

---

### ~~Visual — Search on map~~ ✅ Done (2026-03-10)

Search bar overlay on the map for finding learned events by title, location, or year. Auto-focus input, live results dropdown (max 6 matches), category color dots. `MapSearch` component in `MapView.jsx`.

---

### ~~Architecture — Clean component interfaces for future extraction~~ ✅ Done (2026-03-10)

Shared time slider utilities extracted to `src/utils/timeSlider.js`. MapView and ConcurrentView accept optional `categoryConfig` and `eventConnections` props (defaulting to Chronos data). All sub-components (EventPopup, ClusterPopup, Legend, ConnectionArcs, MapSVG, RegionEventList, MapSearch) receive config via props. `mapPaths.js` already standalone (no Chronos imports). Projection math (`projectToSVG`, region system) remains in `mapPaths.js` — already a clean utility module.

---

### ~~Polish — Fullscreen experience~~ ✅ Done (2026-03-10)

All sub-items completed:

- ~~**Mini-map**~~ ✅ Done (2026-03-10) — small overview rectangle in bottom-left corner of fullscreen mode. Viewport indicator updates on scroll/zoom. Click to navigate. Accounts for CSS transform zoom.
- ~~**Orientation lock hint**~~ ✅ Done (2026-03-10) — portrait mode hint included in first-time gesture tutorial overlay.
- ~~**Gesture tutorial**~~ ✅ Done (2026-03-10) — first-time fullscreen overlay with scroll and pinch-to-zoom hints. Auto-dismisses after 4s or on tap. Stored in localStorage.

---

### Implementation order (suggested)

~~1. **Per-country SVG paths** ✅~~
~~2. **Country highlighting on event selection** ✅~~
~~3. **UX: wheel zoom, region auto-scroll, pin animations** ✅~~
~~4. **Sub-region map interaction** ✅~~
~~5. **Region audit** ✅~~
~~6. **UX interaction improvements** ✅~~ — double-tap zoom, swipe-down fullscreen dismiss, hover states, cluster drill-down
~~7. **Time slider on map** ✅~~
~~8. **Concurrent events view** ✅~~
~~9. **Semantic zoom** ✅~~ — scale-compensated rendering, pin labels at zoom, continent label fading
~~10. **Visual polish** ✅~~ — connection arcs, era coloring (region label fading + higher resolution still TODO)
~~11. **Search on map** ✅~~ — search bar overlay with live results
~~12. **Component extraction prep** ✅~~ — shared time slider module, prop-based config for MapView/ConcurrentView
~~13. **Fullscreen polish** ✅~~ — mini-map, gesture tutorial, orientation hint

## P5 — Themed collections (remaining)

Cross-cutting study paths like "Women in History", "Scientific Breakthroughs". Groups existing events by theme rather than chronology. Accessible from the Practice page hub as additional collection tiles. Lower priority now that Level 2 thematic chapters exist.


## P5 — Content expansion (more events & lessons)

Add more events per era, deeper non-Western history coverage, and new lessons beyond the current 21. Plan for thematic content packs or era-specific expansions. Priority: regions currently underrepresented (Asia, Africa, Americas pre-colonization). This is a long-term effort — the app framework supports it, but content creation takes time.

**Completed themes:** Revolutions, AI, Freedom, Empires, Plagues, Africa, Art, Science, Exploration, Money & Trade, Philosophy & Ideas, Women Who Changed History, Food & Agriculture, Law & Justice, Great Inventions, Medicine & Public Health (16 chapters, 216 core events).
**Possible future themes:** Music That Changed the World, Migrations & Diasporas, Architecture & Engineering.

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
- **Feature — Time slider on map** (2026-03-10): Piecewise-linear slider (each era gets equal space) with clock toggle button on inline + fullscreen modes. Era-aware time windows (25% for Prehistory, 12–15% for others). Smart era quick-jump buttons snap to median learned event year. Pin opacity transitions (0.3s). Range event support for yearEnd spans. Styled range input with era boundary tick marks and backdrop blur panel.
- **Feature — Concurrent Events view** (2026-03-10): "Sync" tab on Timeline page with regional swim lanes (4 continent groups, 14 sub-regions), piecewise-linear time slider with era quick-jump buttons showing event counts, smart default position (auto-starts at densest era), opacity-based temporal proximity fade, expandable event cards with category colors/mastery dots, and guided empty state with jump-to-era buttons.
- **UX — Semantic zoom** (2026-03-10): Scale-compensated rendering — all SVG attributes (pin radii, stroke widths, hit areas, text sizes, graticule, coastlines, borders) inversely scale with zoom for constant screen-size elements. Pin title labels with parchment-stroke halo appear at 2×+ zoom. Continent labels fade out at 2×+. Dynamic cluster recalculation (grid scales with zoom) already in place from earlier work.
- **Visual — Event connection arcs** (2026-03-10): `ConnectionArcs` component draws quadratic bezier SVG arcs from a selected pin to its EVENT_CONNECTIONS targets. Category-colored, solid for learned events, dashed for unlearned. Rendered between country layer and pin layer. Uses `arcControlPoint()` helper for perpendicular curve offset (30% of distance, capped at 40 SVG units).
- **Visual — Era coloring mode** (2026-03-10): Topic/Era segmented toggle in Legend dropdown. `ERA_COLORS` constant with 5 period-specific colors. `getEraForYear()` helper maps year to era key. `colorMode` state persisted to localStorage (`chronos-map-color-mode`). Cluster pins use majority era of contained events.
- **Visual — Map search** (2026-03-10): `MapSearch` component overlaid on map with auto-focus input, live filtered results (title, location, year, max 6), category color dots, and click-to-select event highlighting.
- **Visual — Higher resolution map data** (2026-03-10): Upgraded from Natural Earth 110m to 50m resolution. Path simplification (1-decimal precision, dedup + collinear removal) keeps bundle size manageable (+37%). Fixed missing countries (Australia, NZ, Singapore, 60+ territories). Updated manual event-country overrides for 50m coastlines.
- **Architecture — Component extraction prep** (2026-03-10): Extracted shared time slider utilities to `src/utils/timeSlider.js` (era segments, slider-to-year mapping, time windows, opacity). MapView and ConcurrentView accept optional `categoryConfig`/`eventConnections` props for clean decoupling. All sub-components receive config via props.
- **Polish — Fullscreen experience** (2026-03-10): Mini-map overview in bottom-left corner with click-to-navigate and zoom-aware viewport tracking. First-time gesture tutorial overlay (scroll + pinch hints, auto-dismiss 4s). Orientation hint for portrait mode (rotate for wider view). All stored in localStorage.
