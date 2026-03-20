# Changelog

All notable changes to Chronos are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

Use the version entries from the last playstore push to the most recent version for Play Store "What's New" text.

## [1.9.25] - 2026-03-20

### Added
- **Level 2 Chapter: Medicine & Public Health** \u2014 4-lesson chapter with 10 new events (f207\u2013f216) tracing the history of healing from ancient civilizations to global health institutions. Imhotep & Egyptian medicine, Sushruta & Indian surgery, the Huangdi Neijing & Chinese medicine, Avicenna\u2019s Canon, the first quarantine in Ragusa, Vesalius & modern anatomy, Semmelweis & handwashing, Florence Nightingale & nursing, Pasteur & germ theory, the WHO & global health. Reuses f38 (Scientific Revolution) and f54 (United Nations). Teal theme (#0D9488), medicine icon (index 48). Hand-crafted description distractors and controversy notes for all events. Strong non-Western coverage (Egypt, India, China, Persia, Ottoman Empire).

## [1.9.24] - 2026-03-20

### Added
- **Challenge Quiz — Beginner pool expansion**: Added 10 new curated questions to Beginner tier (3 whichCameFirst, 2 eraDetective, 5 trueOrFalse). New pairs: Alexander vs Qin, Augustus vs Jesus, Islamic Golden Age vs Mongol Empire. Era traps: Steam Engine (Early Modern, not Modern), Edict of Milan (Ancient, not Medieval). Common misconceptions: women in Ancient Olympics, Magellan's circumnavigation, Genghis Khan's origins, Great Wall vs Mongols, Lenin and the Tsar. New pool size: 31 questions.

## [1.9.23] - 2026-03-18

### Changed
- **Card content review (Law & Justice)** — reviewed 10 cards (f187–f196); 0 edits needed. All dates, locations, descriptions, controversy notes, distractors (all 3 tiers), and hardCorrect statements confirmed accurate. Chapter structure has a strong narrative arc (Writing the Rules → God, King & the People → Rights of the Individual → Justice for All). Event connections well-chosen with proper thematic progression from ancient codification to modern international law.
- Cards f187, f188, f189, f190, f191, f192, f193, f194, f195, f196 reviewed and confirmed accurate — no changes needed.
- **Card content review (Great Inventions)** — reviewed 10 cards (f197–f206); 1 edit made:
  - **f204 (Wright Brothers):** Fixed controversy notes — claimed "no independent witnesses beyond their own crew," but five members of the Kill Devil Hills Lifesaving Station (independent government employees) witnessed the flights and John T. Daniels took the famous photograph. Replaced with accurate note about witness presence but lack of press coverage.
- Cards f197, f198, f199, f200, f201, f202, f203, f205, f206 reviewed and confirmed accurate — no changes needed.
- **QA check (2026-03-20)**: lint (173 problems, all pre-existing `no-useless-escape` + unused directives), both builds pass (Capacitor + GitHub Pages), no merge artifacts. Data integrity: 273 challengeQuiz refs valid, 206 events, no duplicate IDs, no orphan connections. Pre-existing issue `rev-4` (2 eventIds) unchanged — see ERROR_LOG.md. No new issues since v1.9.23.

## [1.9.22] - 2026-03-18

### Added
- **Level 2 Chapter: Great Inventions** \u2014 4-lesson chapter with 10 new events (f197\u2013f206) tracing the inventions that rewired civilization. The Wheel, Chinese Papermaking, Gunpowder, the Magnetic Compass, the Telescope, the Electric Telegraph, the Light Bulb & Electrification, the Wright Brothers & Powered Flight, Penicillin & Antibiotics, and the Transistor. Reuses f36 (Gutenberg Printing Press) and f46 (Industrial Revolution). Sky-blue theme (#0369A1), gear icon (index 47). Hand-crafted description distractors, controversy notes, and event connections for all events. Strong non-Western coverage (China: paper, gunpowder, compass).

## [1.9.21] - 2026-03-17

### Added
- **Level 2 Chapter: Law & Justice** \u2014 4-lesson chapter with 10 new events (f187\u2013f196) tracing how humanity learned to govern itself through written rules and universal rights. Roman Law & the Twelve Tables, Legalism & the Unification of China, Magna Carta, Islamic Jurisprudence & the Four Schools, the Haudenosaunee Great Law of Peace, the Habeas Corpus Act, the Napoleonic Code, the Nuremberg Trials, the Universal Declaration of Human Rights, and the International Criminal Court. Reuses f10 (Code of Hammurabi) and f40 (The Enlightenment). Copper-brown theme (#92400E), new icon (index 46). Hand-crafted description distractors, controversy notes, and event connections for all events. Strong non-Western coverage (China, Islamic world, Haudenosaunee).
- **QA check (2026-03-17)**: lint (173 problems, all pre-existing `no-useless-escape` + unused directives), both builds pass (Capacitor + GitHub Pages), no merge artifacts. Data integrity: 273 challengeQuiz refs valid, 196 core events + 30 daily quiz events, no duplicate IDs, no missing lesson event refs. Pre-existing issue `rev-4` (2 eventIds) unchanged \u2014 see ERROR_LOG.md. v1.9.21 changes (Law & Justice chapter) verified clean.

## [1.9.20] - 2026-03-14

### Added
- **Challenge Quiz — Historian pool expansion**: Added 10 new curated questions to Historian tier (2 whichCameFirst, 3 trueOrFalse, 1 hardMCQ/date, 2 hardMCQ/location, 2 oddOneOut). Non-Western focus: Confucius, Ibn Battuta, Ibn Khaldun, Iranian Revolution, Song Dynasty paper money, Indian Ocean trade, and Murasaki Shikibu. New pool size: 35 questions.

### Fixed
- **Ambient music 404 on Capacitor** \u2014 mp3 URL was hardcoded as `/bensound-silentwaves.mp3` (absolute path), which fails on Android where `base` is `./`. Now uses `import.meta.env.BASE_URL` so the path resolves correctly on both GitHub Pages and Capacitor builds.

### Changed
- **Card content review (Daily Quiz events)** \u2014 reviewed all 30 daily quiz events (dih-0\u2013dih-29) and their description distractors; 0 edits needed. All dates, locations, descriptions, wrongTitles, and distractor tiers confirmed accurate. Minor structural note: daily events use broad continent regions ("Africa", "Asia") instead of the 14 sub-regions used by core events \u2014 not a factual error but a consistency gap for future cleanup.
- **Card content review (Food & Agriculture)** \u2014 reviewed 10 cards (f177\u2013f186); 0 edits needed. All dates, locations, descriptions, controversy notes, distractors (all 3 tiers), and hardCorrect statements confirmed accurate. Lesson structure has a strong narrative arc (Seeds of Civilization \u2192 Spice Trade & Columbian Exchange \u2192 Sugar/Famine/Fertilizer \u2192 Dust Bowl/Green Revolution/GMOs). Event connections well-chosen with proper reciprocals.
- Cards f177, f178, f179, f180, f181, f182, f183, f184, f185, f186 reviewed and confirmed accurate \u2014 no changes needed.
- **QA check (2026-03-16)**: lint (173 problems, all pre-existing `no-useless-escape` + unused directives), both builds pass (Capacitor + GitHub Pages), no merge artifacts. Data integrity: 273 challengeQuiz refs valid (up from 253 \u2014 Historian pool expansion), 186 events, no duplicate IDs, no orphan connections. Pre-existing issue `rev-4` (2 eventIds) unchanged \u2014 see ERROR_LOG.md. v1.9.20 changes (Historian pool, ambient music fix, daily quiz review, Food & Agriculture review) verified clean.

## [1.9.19] - 2026-03-14

### Added
- **Level 2 Chapter: Food & Agriculture** \u2014 4-lesson chapter with 10 new events (f177\u2013f186) tracing how food shaped civilization from the Neolithic to GMOs. Rice cultivation in China, maize domestication in Mesoamerica, the ancient spice trade, the Columbian Exchange, sugar & the plantation economy, the Irish Potato Famine, Fritz Haber & synthetic fertilizer, the Dust Bowl, the Green Revolution, and the GMO debate. Reuses f6 (Neolithic Revolution) and f33 (Columbus). Lime-green theme (#65A30D), seedling icon (new icon index 45). Hand-crafted description distractors and controversy notes for all events. Rich event connections linking to existing Exploration, Plagues, and Slave Trade events.
- **QA check (2026-03-14)**: lint (173 problems, all pre-existing `no-useless-escape` + unused directives), both builds pass (Capacitor + GitHub Pages), no merge artifacts. Data integrity: 253 challengeQuiz refs valid, no duplicate IDs, no orphan connections. Pre-existing issue `rev-4` (2 eventIds) unchanged — see ERROR_LOG.md. New content from v1.9.18 (Advanced pool expansion) and v1.9.19 (Food & Agriculture chapter) verified clean.

## [1.9.18] - 2026-03-14

### Added
- **Challenge Quiz — Advanced pool expansion**: Added 10 new curated questions to Advanced tier (3 whichCameFirst, 3 trueOrFalse, 2 hardMCQ, 2 oddOneOut). Draws from under-represented chapters: Exploration & Discovery, Money & Trade, Philosophy & Ideas, Women Who Changed History. New pool size: 34 questions.

### Changed
- **Card content review (Philosophy & Ideas)** \u2014 reviewed 10 cards (f157\u2013f166); 1 edit made:
  - **f165 (Karl Marx):** Replaced d:2 distractor "Marx predicted that communist revolutions would happen first in advanced industrial nations" \u2014 this was historically TRUE (Marx did predict this, per his own controversy notes), so a knowledgeable student would be unfairly penalized. Replaced with a genuinely false d:2 about parliamentary reform.
- Cards f157, f158, f159, f160, f161, f162, f163, f164, f166 reviewed and confirmed accurate \u2014 no changes needed.

## [1.9.17] - 2026-03-13

### Changed
- **Card content review (Women Who Changed History)** \u2014 reviewed 10 cards (f167\u2013f176); 2 edits made:
  - **f172 (Queen Nzinga):** Fixed region from "West Africa" to "Southern Africa" \u2014 Angola is classified as Southern Africa in the map system, and "West Africa" caused incorrect map placement.
  - **f174 (Lakshmibai):** Changed "infant son" to "young son" \u2014 Damodar Rao was approximately 5\u20137 years old during the 1857 Rebellion, not an infant.
- Cards f167, f168, f169, f170, f171, f173, f175, f176 reviewed and confirmed accurate \u2014 no changes needed.
- **QA check (2026-03-13)**: lint (173 problems, all pre-existing `no-useless-escape`), both builds pass, no merge artifacts. Data integrity: 176 event IDs valid, 232 challengeQuiz refs valid, no duplicate IDs, no orphan connections. Pre-existing issue `rev-4` (2 eventIds) unchanged \u2014 see ERROR_LOG.md.

## [1.9.16] - 2026-03-13

### Added
- **Level 2 Chapter: Women Who Changed History** \u2014 4-lesson chapter with 10 new events (f167\u2013f176) tracing women who broke barriers across civilizations. Hatshepsut (Egypt\u2019s female pharaoh), Hypatia of Alexandria, Wu Zetian (China\u2019s only empress), Murasaki Shikibu (world\u2019s first novel), Joan of Arc, Queen Nzinga (anti-colonial resistance), Sor Juana In\u00e9s de la Cruz, Lakshmibai (Rani of Jhansi), Sojourner Truth, Wangari Maathai (Green Belt Movement). Reuses f8 (Unification of Egypt) and f39 (Atlantic Slave Trade). Deep rose theme (#BE185D), crown icon. Hand-crafted description distractors, controversy notes, and event connections for all events. Strong non-Western coverage (Egypt, China, Japan, Angola, Mexico, India, Kenya).

## [1.9.15] - 2026-03-11

### Added
- **Level 2 Chapter: Philosophy & Ideas** \u2014 4-lesson chapter with 10 new events (f157\u2013f166) tracing the history of ideas from Confucius to postcolonial thought. Confucius & the Analects, Trial of Socrates, Nalanda University, Ibn Khaldun\u2019s Muqaddimah, the Printing Press & Reformation, Descartes, the Encyclop\u00e9die, Wollstonecraft\u2019s Vindication, Marx & the Communist Manifesto, Fanon & decolonial thought. Reuses f14 (The Axial Age) and f40 (The Enlightenment). Slate theme, iconIndex 17. Hand-crafted description distractors, controversy notes, and event connections for all events. Strong non-Western coverage (China, India, North Africa).
- **QA check**: lint, both builds (Capacitor + GitHub Pages), and data integrity checks all passed. No new issues from v1.9.15. 168 pre-existing lint errors (mostly `no-useless-escape` in Unicode data files) — none in the modified files.
- **QA check (2026-03-13)**: lint (173 problems, all pre-existing `no-useless-escape`), both builds pass. Data integrity found 1 pre-existing issue: L2 lesson `rev-4` has 2 eventIds instead of 3 — see ERROR_LOG.md. All event references, connections, distractors, and challenge quiz refs are valid. 196 total events, 21 L1 lessons, 11 L2 chapters.

## [1.9.14] - 2026-03-10

### Fixed
- **Fullscreen hints lint fix** — replaced `useEffect` + `setState` pattern for first-time hints with derived state (`hintsDismissed` + computed `showHints`) to fix `react-hooks/set-state-in-effect` lint error. Backlog updated to mark fullscreen polish (mini-map, gesture tutorial, orientation hint) as complete.

## [1.9.13] - 2026-03-10

### Changed
- **Component extraction prep** — extracted shared time slider utilities (era segments, slider-to-year mapping, time windows, opacity calculations) from MapView and ConcurrentView into `src/utils/timeSlider.js`, eliminating ~70 lines of duplicated code. MapView and ConcurrentView now accept optional `categoryConfig` and `eventConnections` props (defaulting to Chronos data), making them reusable without tight coupling to Chronos-specific data modules. Sub-components (EventPopup, ClusterPopup, RegionEventList, MapSearch, Legend, ConnectionArcs, MapSVG) all receive config via props instead of importing directly.

## [1.9.12] - 2026-03-10

### Changed
- **Higher resolution map data** — upgraded from Natural Earth 110m to 50m resolution for significantly smoother coastlines, especially visible when zoomed. Uses 1-decimal coordinate precision (10x finer grid) and SVG path simplification (dedup + collinear point removal) to keep bundle size reasonable (~144KB vs ~105KB, +37% raw / ~8KB gzipped).

### Fixed
- **Missing countries on map** — Australia, New Zealand, Solomon Islands, Singapore, and ~60 other small territories/islands were missing from the rendered map due to absent continent mappings. All 234 countries from the 50m dataset now render correctly.
- **COUNTRY_TO_SUBREGION gaps** — added ~65 new country-to-subregion mappings for territories introduced by 50m data (Caribbean islands, Pacific islands, European micro-states, etc.).
- **EVENT_COUNTRY_MAP accuracy** — 8 additional coastal events now correctly map to their countries (San Francisco, Cape Town, Copenhagen, etc.) with updated manual overrides for the 50m coastline data.

## [1.9.11] - 2026-03-10

### Fixed
- **Fun facts shuffle** — fun facts now use a deterministic shuffle so unseen facts appear in a varied order instead of always cycling through the same sequence.

## [1.9.10] - 2026-03-10

### Added
- **Event connection arcs** — when selecting a pin that has related events (via `EVENT_CONNECTIONS`), faint curved SVG bezier arcs are drawn between the selected pin and its connections. Category-colored, with solid lines for learned events and dashed lines for unlearned. Auto-shown on pin selection, no toggle needed.
- **Era coloring mode** — new Topic/Era toggle in the map Legend dropdown. "Era" mode colors all pins by historical period (Prehistory, Ancient, Medieval, Early Modern, Modern) instead of category, giving a temporal-geographic perspective. Mode persists to localStorage.
- **Map search** — search bar overlay on the map for finding learned events by title, location, or year. Auto-focus, live results dropdown (max 6), category color dots.

### Fixed
- **Unicode middle dot bug** — region event list header showed literal `\u00B7` text instead of the `·` character.

## [1.9.9] - 2026-03-10

### Added
- **Semantic zoom on map** — zoom-adaptive rendering so pins, borders, and labels stay constant screen-size at any zoom level instead of getting magnified. Features:
  - **Scale-compensated rendering** — all SVG attributes (pin radii, hit areas, stroke widths, text sizes) are divided by the current zoom level, so elements maintain consistent visual weight from 1× to 4× zoom
  - **Pin title labels at 2×+ zoom** — learned event titles appear next to pins when zoomed in, with a parchment-colored stroke halo (`paintOrder: stroke`) for readability on any map background
  - **Continent label fade** — static continent name labels smoothly fade out between 1×–2× zoom to avoid overlapping with the more useful pin labels
  - **Consistent map chrome** — graticule lines, coastline outlines, and country borders all maintain their visual weight at all zoom levels

## [1.9.8] - 2026-03-10

### Added
- **Concurrent Events view ("Sync" tab)** — new third tab on the Timeline page showing what was happening simultaneously across different regions of the world. Features:
  - **Regional swim lanes** — events grouped by continent (Europe, Middle East & Africa, Asia & Oceania, Americas) with sub-region labels when multiple regions are active
  - **Time slider with era quick-jumps** — same piecewise-linear slider as the map, with era buttons showing learned event counts per era
  - **Smart default position** — slider auto-starts at the era with the most learned events (not hardcoded medieval)
  - **Opacity fade** — events further from the selected year fade out proportionally to the era's time window
  - **Tappable event cards** — tap to expand and see description, location, and mastery dots. Category-colored borders on selection.
  - **Guided empty state** — when no events are near the current time, shows "Jump to [era]" buttons with event counts

### Changed
- **Map visual polish** — stronger country borders (0.3→0.5 stroke width), added coastline outlines behind country fills for better land/water contrast. New `--color-map-coastline` CSS variable for light + dark mode.

## [1.9.7] - 2026-03-10

### Changed
- **Merged all branches into main** — consolidated `claude/map-ux-improvements` (Map UX, Money & Trade, Challenge pools, Time slider) and `claude/stoic-mirzakhani` (Exploration & Discovery chapter) into one unified version. Cleaned up 10 stale branches and 5 worktrees.
- **Card content review (Exploration & Discovery)** — reviewed 9 cards (f138–f146); 3 edits made:
  - **f138 (Polynesian Voyaging):** "Hawai'i by 400 CE" → "by around 1000 CE" — revised high-precision radiocarbon dating (2010+) places Hawaiian settlement at 1000–1200 CE, making the old "long chronology" date of 400 CE outdated. Also updated NZ date from "~1200 CE" to "~1250 CE".
  - **f140 (Ibn Battuta):** "three times Marco Polo's distance" → "five times" — Ibn Battuta covered ~120,000 km vs. Marco Polo's ~24,000 km, which is approximately 5×, not 3×.
  - **f142 (Vasco da Gama):** "half his crew died of scurvy" → "two-thirds" — of ~170 original crew, only 54 survived the round trip (~68% mortality).
- Cards f139, f141, f143, f144, f145, f146 reviewed and confirmed accurate — no changes needed.
- Updated CLAUDE.md event count to 156 (60 L1 + 96 L2) and chapter count to 10 (40 lessons).
- **QA check**: both builds (Capacitor + GitHub Pages) pass, cap sync OK, no merge conflict markers. Lint has 173 pre-existing issues (mostly `no-useless-escape` for Unicode chars in data files) + 1 new low-severity unused import (`getEraForYear`) in untracked WIP file `ConcurrentView.jsx`. 3 uncommitted modified files (MapView.jsx, index.css, TimelinePage.jsx) — likely in-progress work. No issues found.

## [1.9.6] - 2026-03-10

### Added
- **Time slider on map** — scrub through history and watch pins appear/disappear chronologically. Clock toggle button on both inline and fullscreen map modes. Features:
  - **Piecewise-linear slider** — each era (Prehistory, Ancient, Medieval, Early Modern, Modern) gets equal slider space for usable scrubbing at every scale
  - **Era-aware time windows** — pins visible within a proportional window of the current era's span (25% for sparse Prehistory, 12–15% for denser eras). Pins within the window show at full opacity; those in the fade zone (2× window) gradually fade out
  - **Era quick-jump buttons** — tap an era label to snap to the median learned event year in that era (not the midpoint), so you always land near actual events
  - **Pin fade transitions** — 0.3s CSS opacity transitions on pin groups for smooth visual filtering as the slider moves
  - **Range event support** — events with yearEnd (e.g., "7–6 million years ago") stay visible when the slider is anywhere within their date range
  - **Year display** — formatted year label (e.g., "3.5M BCE", "300K BCE", "988 CE") updates in real-time as slider moves
  - CSS-styled range input with burgundy thumb, era boundary tick marks, and backdrop blur panel

## [1.9.5] - 2026-03-10

### Changed
- **Card content review (Money & Trade)** — reviewed 10 cards (f147–f156); 2 edits made:
  - **f150 (Paper Money in China):** fixed "copper coins were too heavy" → Sichuan specifically used iron coins (the government restricted copper there), and iron coins were far heavier per unit of value. This is the actual reason paper money was invented in Sichuan. Updated hardCorrect in descriptionDistractors to match.
  - **f156 (Rise of Globalization):** "Global trade tripled in a decade" → "more than doubled" — world merchandise exports roughly doubled (not tripled) from 1995 to 2005 in nominal terms. WTO data shows ~5.5% annual volume growth over that decade, equaling ~70% real growth.
- Cards f147, f148, f149, f151, f152, f153, f154, f155 reviewed and confirmed accurate — no changes needed.
- **QA check**: both builds (Capacitor + GitHub Pages) pass, cap sync OK, data integrity checks all pass (147 core + 30 daily events, no duplicate IDs, no orphan refs in lessons/challengeQuiz/distractors), no merge conflict markers. Lint has 172 pre-existing issues (mostly `no-useless-escape` for Unicode chars in data files) — no new errors from recent changes.

## [1.9.4] - 2026-03-10

### Changed
- **Challenge Quiz — Amateur pool expansion**: Added 10 new curated questions to the Amateur tier (2 whichCameFirst, 2 eraDetective, 3 trueOrFalse, 2 hardMCQ/location, 1 hardMCQ/date). New pool size: 28 questions. Highlights: Founding of Islam vs Tang Dynasty (8-year gap), Gutenberg Press vs Fall of Constantinople (13-year gap); eraDetective for The Enlightenment (Early Modern, not Modern) and Islamic Golden Age (Medieval, not Ancient); T/F misconceptions about Columbus never reaching North America, Galileo under house arrest (not imprisoned for life), Napoleon's Corsican/Italian mother tongue; location MCQs for Islamic Golden Age (Baghdad, not Cairo/Damascus/Cordoba) and Napoleon's birthplace (Corsica, not Normandy/Brittany/Savoy); date MCQ for Mongol Empire founding (1206, with Genghis Khan's birth year 1162 as a trap distractor).

## [1.9.3] - 2026-03-10

### Added
- **Challenge Quiz \u2014 Expert pool expansion**: Added 10 new curated questions to the Expert tier (3 whichCameFirst, 2 oddOneOut, 3 hardMCQ/location, 2 hardMCQ/date). New pool size: 27 questions. Highlights: Marie Curie vs Einstein (7-year gap), Picasso\u2019s Cubism vs Ottoman Fall (1-year gap), WHO Smallpox campaign vs Stonewall (2-year gap); oddOneOut traps using the Rwanda Genocide alongside liberation movements and Lavoisier\u2019s \u201CChemical Revolution\u201D alongside political revolutions; Expert location MCQs for Deep Learning (Toronto), Euclid (Alexandria), Newton (Cambridge); tight date MCQs for Galileo\u2019s telescope (1604\u20131623 window) and Watson & Crick\u2019s DNA (1944\u20131966 window).

## [1.9.2] - 2026-03-10

### Added
- **Level 2 Chapter: Exploration & Discovery** \u2014 4-lesson chapter with 9 new events (f138\u2013f146) tracing humanity\u2019s journeys from Polynesian star navigation to the Space Race. Polynesian Voyaging, Silk Road Opens, Ibn Battuta\u2019s Odyssey, Zheng He\u2019s Treasure Fleets, Vasco da Gama Reaches India, The Conquistadors, Captain Cook\u2019s Pacific Voyages, Humboldt\u2019s Scientific Expedition, Darwin\u2019s Voyage on the Beagle. Reuses f33 (Columbus), f35 (Magellan), f57 (Space Race). Indigo theme, compass icon. Hand-crafted description distractors, controversy notes, and event connections for all events.
- **Double-tap to zoom** — double-tapping the map background zooms to 2\u00d7 centered on the tap point; double-tapping again resets to 1\u00d7. Works on both mobile (touch) and desktop (click). Coexists with single-tap pin/region selection.
- **Swipe-down to dismiss fullscreen** — pulling down on the fullscreen map overlay dismisses it. Visual feedback shows a "Pull down to close" / "Release to close" hint pill with rubber-band physics. More discoverable than the small Close button.
- **Hover states (desktop)** — on pointer-capable devices, country paths subtly brighten on hover (`brightness(1.08)`) and event pins get a soft glow (`drop-shadow`). Both use `@media (hover: hover)` to avoid sticky hover on touch devices.
- **Cluster drill-down** — tapping a cluster pin now auto-zooms into the cluster area instead of showing a flat list. Clustering is zoom-aware: grid cell size scales inversely with zoom level (`CLUSTER_GRID / zoom`), so pins naturally separate as you zoom in. At 3\u00d7+ zoom, if a cluster persists, the flat list popup is shown as fallback. Uses debounced scale (150ms) to avoid expensive recalculation during pinch gestures.

### Changed
- `usePanZoom` hook now exposes `scale`, `zoomToPoint(clientX, clientY, targetScale)`, and `lastTapRef` for double-tap detection
- `clusterPins()` accepts an optional `zoom` parameter for zoom-adaptive grid sizing

## [1.9.1] - 2026-03-10

### Changed
- **Region system audit: 11 → 14 sub-regions** — expanded from 11 to 14 sub-regions by splitting the oversized "East Asia" into three distinct regions:
  - **Southeast Asia** — Philippines, Malaysia, Brunei, Cambodia, Thailand, Laos, Myanmar, Vietnam, Indonesia, Timor-Leste
  - **Central Asia** — Mongolia, Kazakhstan, Uzbekistan, Tajikistan, Kyrgyzstan, Turkmenistan
  - **Oceania** — Papua New Guinea, Fiji, Vanuatu, New Caledonia
- **East Asia center shifted** — now centered on China/Japan/Korea rather than the old broader grouping
- **Mongol Empire re-tagged** — f29 moved from "East Asia" to "Central Asia" to reflect geographic origin
- **6 new CSS custom properties** — pastel/vibrant color pairs for each new region (light + dark mode = 12 new variables total)
- **`REGION_CENTERS` updated** — accurate SVG centers for all 14 sub-regions
- **Generation script updated** — `write-map-data.mjs` reflects the 14-region system for future regeneration

## [1.9.0] - 2026-03-10

### Added
- **Sub-region map interaction** — the map is now a colorful watercolor atlas with 11 distinct pastel-colored sub-regions. Tapping any country selects its sub-region, transitioning to a vibrant saturated color while other regions dim. Tapping again deselects. Sound feedback on selection via `feedback.tap()`.
- **Region event list** — selecting a sub-region shows a scrollable card list of all learned events in that region below the map, with category dots, mastery indicators, and year. Replaces the old continent-level highlighting system.
- **`COUNTRY_TO_SUBREGION` mapping** — ~170 ISO country codes mapped to 11 sub-regions in `mapPaths.js`.
- **`REGION_COLORS` constant** — pastel/vibrant color pairs for all 11 sub-regions, using CSS custom properties with light and dark mode variants (44 new CSS variables total).
- **30 new fun facts** — expanded from 20 to 50 curated trivia questions. New facts span ancient through modern history.
- **Challenge hub redesign** — "Choose your game mode" heading, emoji icons on stats, current tier label 10% larger.

### Changed
- **All learned events always visible on map** — previously the map filtered pins by selected region; now all learned events show regardless of region filter, making the map always feel populated.
- **Country borders refined** — stroke width reduced from 0.5 to 0.3 for subtler intra-region borders.

## [1.8.3] - 2026-03-10

### Added
- **10 new fun facts** — expanded from 10 to 20 curated trivia questions. New facts cover: Homo Sapiens coexisting species, Neolithic health decline, first Sumerian writing, Caesar's assassination details, Mongol postal system, Black Death remedies, Leonardo's mirror writing, American Revolution support split, duct tape's WWII origins, and the Berlin Wall's accidental opening.

### Changed
- **Fun Facts no longer gated by learned events** — all 20 fun facts are available from the start without needing to learn the associated event cards first.

## [1.8.2] - 2026-03-10

### Changed
- **Fun Facts moved to Challenge tab** — Fun Facts quiz mode relocated from Practice hub to Challenge hub, where it fits better thematically alongside Solo Challenge and Multiplayer.
- **Per-country map paths** — map now renders 177 individual country paths (with ISO codes) instead of 5 merged continent blobs. Foundation for country-level interactions.
- **Country highlighting on event selection** — selecting an event on the map now highlights its country with a gold color, making geographic context clearer.
- **Updated app icon and splash screen assets**

## [1.8.1] - 2026-03-09

### Added
- **Desktop wheel zoom on map** — mouse wheel scrolling now zooms the map in/out (±0.15 per scroll step, 1–4× range). Works in both inline and fullscreen modes. Previously only touch pinch-zoom was supported.
- **Region auto-scroll in fullscreen map** — selecting a region chip while in fullscreen mode smoothly scrolls the viewport to center on that region, using pre-calculated region center coordinates.
- **Animated pin entrance** — map pins now pop in with a staggered scale+fade animation (30ms delay between each pin) when the map loads or filters change.

## [1.8.0] - 2026-03-09

### Added
- **Fun Facts quiz mode** — new endless casual quiz in the Practice hub. 10 hand-crafted trivia MCQs tied to iconic event cards (f1, f2, f8, f12, f15, f32, f33, f43, f46, f57). Each question shows which card it relates to, reveals a “Did you know?” explanation after answering, and tracks discovery progress (X/Y discovered). Facts cover surprising details NOT found in the card descriptions. Unlocked per-event as the user learns them.

### Files added
- `src/data/funFacts.js` — fun fact data + helpers (`getFunFactsForSeenEvents`, `getNextFunFact`)
- `src/components/FunFactsFlow.jsx` — self-contained quiz UI component

## [1.7.21] - 2026-03-09

### Changed
- **Star events from daily quiz results** — added StarButton to each event card in the DailyQuizFlow results screen, so users can bookmark interesting daily quiz events without navigating to the Timeline. Consistent with existing StarButton in lesson summary result cards and practice results.

## [1.7.20] - 2026-03-09

### Changed
- **Card content review (Level 1 core events, batch 6)** — reviewed 10 cards (f51–f60); 0 edits made. All cards confirmed accurate — no changes needed.
- **Card content review (Level 1 core events, batch 5)** — reviewed 10 cards (f41–f50); 2 edits made:
  - **f42 (The American Revolution):** fixed conflation of the Declaration of Independence with the US Constitution — "the first large-scale implementation of Enlightenment ideals into a written constitution" reads as if the Declaration IS the Constitution. These are distinct documents (1776 and 1787–88). Changed to "the first large-scale implementation of Enlightenment ideals, later formalized in the US Constitution" (matching the card's own hardCorrect).
  - **f43 (The French Revolution):** fixed chronological ordering — the description implied the execution of Louis XVI (1793) and Reign of Terror (1793–94) "led to" the Declaration of the Rights of Man, but the Declaration was adopted in August 1789, years before those events. Reordered so the Bastille leads to the Declaration, execution, and Terror in correct sequence.
- Cards f41, f44, f45, f46, f47, f48, f49, f50 reviewed and confirmed accurate — no changes needed.

## [1.7.19] - 2026-03-09

### Changed
- **Card content review (Level 1 core events, batch 4)** — reviewed 10 cards (f31–f40); 1 edit made:
  - **f35 (Magellan-Elcano Circumnavigation):** removed "providing the first proof by circumnavigation that the Earth was round" — educated Europeans already knew the Earth was spherical (Eratosthenes calculated its circumference c. 240 BCE; Columbus's voyage was premised on it). The card's own d:3 distractor correctly identifies "disproving the flat Earth theory" as false, yet the main description implied the same thing. Replaced with the voyage's actual revelation: the Pacific Ocean was far vaster than anyone imagined. Also updated quizDescription to match.
- Cards f31, f32, f33, f34, f36, f37, f38, f39, f40 reviewed and confirmed accurate — no changes needed.

## [1.7.18] - 2026-03-09

### Changed
- **Card content review (Level 1 core events, batch 3)** — reviewed 10 cards (f21–f30); 1 edit made:
  - **f26 (The Islamic Golden Age):** "invented Algebra" → "pioneered algebra" — Al-Khwarizmi systematized algebra into a distinct discipline, but earlier algebraic work existed (Diophantus, Brahmagupta). This is the same correction already applied to f118 (Level 2 card) in v1.7.12; f26 (Level 1 card) was missed. Also updated quizDescription to match.
- Cards f21, f22, f23, f24, f25, f27, f28, f29, f30 reviewed and confirmed accurate — no changes needed.

## [1.7.17] - 2026-03-09

### Changed
- **Card content review (Level 1 core events, batch 2)** — reviewed 10 cards (f11–f20); 2 edits made:
  - **f14 (Axial Age):** added the Hebrew prophetic tradition to the description — Jaspers' original Axial Age concept lists four centers (Greece, India, China, Israel/Judea), but the card only mentioned three. Also changed "global" → "cross-civilizational" (more precise — the concept doesn't cover Africa, the Americas, or Southeast Asia) and "simultaneously" → "independently" (the key insight is independent emergence, not just timing). Updated hardCorrect in descriptionDistractors to match.
  - **f20 (Edict of Milan):** fixed conflation of two events 17 years apart — the card was dated 313 CE but described both the Edict of Milan (313) and the founding of Constantinople (330) without any temporal distinction. A user would incorrectly infer both happened in 313. Added "later" and "(330 CE)" to separate the events. Changed "moved the capital" → "founded Constantinople as a new eastern capital" (more precise — Constantinople was a new foundation on the site of Byzantium, not a simple relocation).
- Cards f11, f12, f13, f15, f16, f17, f18, f19 reviewed and confirmed accurate — no changes needed.

## [1.7.16] - 2026-03-09

### Changed
- **Challenge quiz: killed categorySort** — removed entirely because categories are editorial decisions, not historical facts. Replaced all categorySort slots with whichCameFirst (tests real chronological knowledge)
- **Challenge quiz: curated T/F pool** — dynamic T/F no longer swaps database fields (location/date/category). Now uses `CURATED_TF_POOL` of 20 conceptual misconception questions. Falls back to cause-and-effect questions using `EVENT_CONNECTIONS`
- **Challenge quiz: fixed eraDetective** — removed obvious picks, added genuinely ambiguous events. Era-revealing keywords stripped from descriptions
- **Challenge quiz: fixed hardMCQ distractors** — date distractors now use tight same-era spacing. Location distractors use same-region cities
- **Challenge quiz: multiplayer improvements** — curated T/F content, type repetition prevention, same-category/same-era distractor logic
- **Challenge quiz: bonus hearts** — awards +1 heart at tier transitions entering Advanced+ (max 5)

### Added
- **Curated question pools for all tiers** — Beginner (21 specs), Amateur (18), Advanced (24), Historian (25), Expert (17). Unified `CURATED_POOLS` wiring in `generateTieredChallengeQuestion`. Only God tier remains dynamic
- **Near-miss feedback for date questions** — wrong answers within ~15% of correct year show "Close!" badge and play `close()` sound
- **Cause-and-effect questions** — new question type using `EVENT_CONNECTIONS` as T/F fallback
- **oddOneOut question handler** in `buildCuratedQuestion` for curated pools

### Fixed
- **Multiplayer XP bug** — was summing ALL players' scores; now only counts "me" player
- **Cross-tier duplicate whichCameFirst pairs** — Expert tier no longer reuses pairs from Advanced

## [1.7.15] - 2026-03-09

### Changed
- **Card content review (Level 1 core events, batch 1)** — reviewed 10 cards (f1–f10); 4 edits made:
  - **f4 (Behavioral Modernity):** location "Herto, Ethiopia" → "Africa" — Herto's famous fossils (~160 Kya, *Homo sapiens idaltu*) are associated with *anatomical* modernity, not behavioral modernity at 70–50 Kya. Key behavioral modernity evidence comes from Blombos Cave (South Africa) and various East African sites.
  - **f5 (Migration Out of Africa):** "led to the extinction of other hominid species" → added Neanderthal/Denisovan interbreeding (1–4% Neanderthal DNA in non-Africans; Pääbo's 2022 Nobel Prize). Too significant and well-established to omit from this card. Softened extinction framing.
  - **f8 (Unification of Egypt):** "creating a state stable for nearly 3,000 years" → "creating a civilization that endured for nearly 3,000 years" — Egypt suffered multiple periods of fragmentation (First, Second, and Third Intermediate Periods) so "stable" overstates continuity.
  - **f10 (Code of Hammurabi):** "written social contract" → "written legal code" — "social contract" is an anachronistic Enlightenment concept (Hobbes/Locke/Rousseau); Hammurabi's code was a royal decree. Also fixed quizDescription: "the first written legal code" → "the ancient world's most complete legal code" — the Code of Ur-Nammu (~2100 BCE) predates Hammurabi by ~300 years. Updated matching hardCorrect in descriptionDistractors.
- Cards f1, f2, f3, f6, f7, f9 reviewed and confirmed accurate — no changes needed.

## [1.7.14] - 2026-03-09

### Changed
- **Card content review (Science That Changed Everything)** — reviewed 11 cards (f127–f137); 2 edits made:
  - **f132 (Lavoisier):** "transformed alchemy into a science" → "transformed chemistry into a modern, quantitative science" — by the 1770s, chemistry was already a distinct discipline from alchemy (Boyle's *The Sceptical Chymist* was published in 1661). Lavoisier's revolution was within chemistry, not from alchemy.
  - **f133 (Darwin):** "developed the idea 20 years earlier during his voyage on HMS Beagle" → "begun developing the idea two decades earlier, inspired by observations from his voyage" — Darwin collected observations on the Beagle (1831–1836), but his natural selection insight came in 1838 after reading Malthus, back in England.
- Cards f127, f128, f129, f130, f131, f134, f135, f136, f137 reviewed and confirmed accurate — no changes needed.

## [1.7.13] - 2026-03-09

### Added
- **Level 2 Chapter: Science That Changed Everything** — 4-lesson chapter with 11 new events (f127\u2013f137) tracing scientific breakthroughs from ancient Greece to the Higgs boson. Hippocrates & rational medicine, Euclid's Elements, Archimedes, Galileo & the telescope, Newton's Principia, Lavoisier & modern chemistry, Darwin & natural selection, Marie Curie & radioactivity, Einstein & relativity, DNA double helix, and the Higgs boson at CERN. Reuses f38 (Scientific Revolution). Teal theme (#0891B2), telescope icon. New atom icon (index 44) for the final lesson. Hand-crafted description distractors (3 tiers) and controversy notes for all 11 events. Rich event connections linking to existing events (Islamic Golden Age, French Revolution, WWII). Strong coverage of scientific ethics controversies (Franklin/DNA, Curie/sexism, Newton/Leibniz, Wallace/Darwin).

## [1.7.12] - 2026-03-09

### Changed
- **Card content review (Art That Changed the World)** — reviewed 9 cards (f118–f126); 4 edits made:
  - **f118 (Islamic Golden Age):** "invented algebra" → "pioneered algebra" — Al-Khwarizmi systematized algebra into a distinct discipline, but earlier algebraic work existed (Diophantus, Brahmagupta). Consistent with the f91 correction pattern.
  - **f119 (Renaissance Masters):** "pioneered anatomy, perspective" → "mastered anatomy and perspective" — perspective was pioneered by Brunelleschi (~1413) and codified by Alberti (1435), decades before Leonardo and Michelangelo.
  - **f120 (Shakespeare):** "invented over 1,700 English words" → "coined or popularized" — modern scholarship shows many words attributed to Shakespeare were already in spoken use; he was the first to record them in surviving texts. Updated description, quizDescription, and hardCorrect.
  - **f124 (Cinema's Golden Age):** removed "from a novelty" (silent cinema was already a major art form by 1927); changed "every human being on the planet simultaneously" → "audiences across the entire planet" (films were distributed over weeks/months, not simultaneously). Updated description and hardCorrect.
- Cards f121, f122, f123, f125, f126 reviewed and confirmed accurate — no changes needed.

## [1.7.11] - 2026-03-09

### Changed
- **Card content review (Kingdoms of Africa + Homer)** — reviewed 10 cards (f108–f117); 7 edits made:
  - **f108 (Aksumite Empire):** "before Rome made it official" → "before Rome made it the state religion" — the Edict of Milan (313 CE) legalized Christianity before Ezana's conversion (~330 CE), but Rome's state religion declaration (380 CE) came after. The original was ambiguous.
  - **f109 (Ghana Empire):** "Ghana's capital at Koumbi Saleh" → "Its probable capital at Koumbi Saleh" — recent scholarship increasingly questions the identification of Koumbi Saleh ruins as Ghana's capital.
  - **f110 (Mali Empire):** yearEnd 1400 → 1600, date "c. 1235–1400 CE" → "c. 1235–1600 CE" — the Mali Empire survived in diminished form until c. 1600, not 1400.
  - **f112 (Songhai Empire):** "largest empire in African history" → "largest empire in West African history" — North African empires (Umayyad, Fatimid territories) were larger.
  - **f113 (Kingdom of Benin):** added "Founded centuries earlier, the Kingdom of Benin reached its peak under Oba Ewuare the Great" — the kingdom existed from c. 1100–1200, but the card's 1440 date marks the imperial era.
  - **f114 (Zulu Kingdom):** softened Mfecane attribution — replaced "displacing millions and creating new kingdoms" with note that historians debate Shaka's role vs. broader pressures (drought, trade disruption). The Cobbing Controversy (1988+) challenged the Zulu-centric explanation.
  - **f117 (Homer):** "invented the idea of the journey as a metaphor for life" → "crystallized" — the Epic of Gilgamesh (c. 2100 BCE) used the journey-quest metaphor over a millennium earlier.
- Cards f111, f115, f116 reviewed and confirmed accurate — no changes needed.

## [1.7.10] - 2026-03-09

### Changed
- **Card content review (Plagues & Pandemics + f107)** — reviewed 10 cards (f98–f107); 4 edits made:
  - **f98 (Smallpox & the Aztecs):** keyword "Biological warfare" → "Columbian Exchange" — the 1520 epidemic was unintentional disease transmission, not deliberate biological warfare.
  - **f100 (Edward Jenner):** "launched the science of immunology" → "launched the science of vaccination" — immunology as a discipline came decades later with Pasteur, Metchnikoff, and Ehrlich. Jenner had no concept of the immune system.
  - **f101 (Cholera & Epidemiology):** quizDescription "invented epidemiology" → "pioneered modern epidemiology" — earlier epidemiological work by Hippocrates, William Farr, and others.
  - **f106 (COVID-19):** added controversy note about death toll discrepancy — confirmed WHO count (7M) vs. excess mortality estimates (15–25M).
- Cards f99, f102, f103, f104, f105, f107 reviewed and confirmed accurate — no changes needed.

## [1.7.9] - 2026-03-09

### Changed
- **Card content review (Empires Rise & Fall + f97)** — reviewed 10 cards (f88–f97); 3 edits made:
  - **f91 (Gupta Golden Age):** "invented the concept of zero" → "developed zero as a true number" — Babylonians had zero as a placeholder; India's contribution was treating it as a number with arithmetic operations. Added controversy note. Updated `hardCorrect` in descriptionDistractors.
  - **f93 (Ming Dynasty):** "world's most advanced civilization" → "one of the world's most advanced civilizations". Added controversy note about the "turn inward" narrative (some historians argue it was a rational fiscal decision, not a missed opportunity).
  - **f94 (British Empire):** "the first truly global empire" → "the largest empire in history" — the Spanish Empire preceded it as a global empire.
- Cards f88, f89, f90, f92, f95, f96, f97 reviewed and confirmed accurate — no changes needed.

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
