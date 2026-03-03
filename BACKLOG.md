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

First batch of map improvements shipped (v1.5.1): pinch-to-zoom, larger pins, selected-pin pulse, ocean color, graticule, dark mode, legend, event descriptions. Remaining items:

### Usability
- **Cluster UX is shallow** — tapping a cluster shows a flat list; there's no way to "zoom into" the cluster area to see individual pins spread out. Consider a spider/spiderfy expansion or auto-zoom on cluster tap.
- **Region labels overlap pins** — the static region name labels sit at fixed positions and can overlap event pins. Consider hiding them when zoomed in or making them semi-transparent when pins are nearby.

### Features
- **No connections on map** — events have cause-and-effect connections (EVENT_CONNECTIONS) but the map doesn't visualize them. Drawing faint arcs or lines between connected events would be a powerful visualization.
- **No era coloring** — pins only show category color. An option to color by era instead would give a temporal view of geographic spread.
- **No animation/timeline scrubber** — a slider that lets you "scrub through time" and see pins appear/disappear chronologically would be the killer feature for a history map.
- **No search** — can't search for a specific event on the map. A search bar that highlights/centers the matching pin would be useful.
- **Missing South America/Oceania detail** — the Americas path is one giant blob. Events in South America or Australia would benefit from more granular continent outlines.

### Technical
- **Projection accuracy** — equirectangular projection distorts high latitudes significantly. For a learning app this is fine, but Mercator or Natural Earth projection would look more familiar.
- **Cluster grid size is fixed** — `CLUSTER_GRID = 25` works for the full map but if zoom is added, clusters should re-compute at different zoom levels.

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
