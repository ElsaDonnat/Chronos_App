# Chronos — Feature Backlog

> **Instructions for AI agents:** When asked to "run some improvements" or "pick the next thing to do",
> choose the highest-priority unfinished item from this list and implement it fully.
> After completing an item, update this file:
> 1. Move the completed item to a "## Completed" section at the bottom with the date
> 2. If the implementation revealed new sub-tasks or follow-ups, add them in the right priority position
> 3. If an existing item is now partially done, update its description to reflect remaining work
> 4. Run `npm run build && npx cap sync` after any changes

---

## P3 — Sound effects and haptic feedback

Add subtle audio feedback for correct/wrong answers and haptic vibration using @capacitor/haptics. Correct answer: brief positive chime + light haptic. Wrong answer: softer negative tone + different haptic pattern. Lesson complete: celebratory sound. Include a toggle in Settings to disable sounds and haptics independently. Keep sounds minimal and classy — not gamey.

## P3 — Event connections & cause-and-effect

Add a `relatedEvents` field to events in events.js, linking them with brief causal descriptions (e.g., French Revolution → "Led to the Napoleonic Wars"). Show connections on event cards in the timeline and on learn cards as a small "Connected events" section. Helps users understand history as a narrative rather than isolated facts. Start with the most obvious connections among existing events.

## P3 — Weekly learning insights

A recap card shown on the Learn page at the start of each week: events learned that week, strongest/weakest era, mastery improvement trend, total study time. Calculated entirely from existing state data (completedLessons, eventMastery, seenEvents). Dismissible with a close button. Reinforces progress and gives users direction on what to focus on next.

## P3 — Map view for events

A visual map showing where events happened. Could be a simple SVG world map with region highlights, accessible as a toggle/tab on the Timeline page. Even a basic region-highlighted map per era would significantly aid spatial memory and make location quiz questions more intuitive. Tap a region to see events from that area.

## P3 — Themed collections

Cross-cutting study paths like "Women in History", "Scientific Breakthroughs", "Revolutions That Changed the World". Groups existing events by theme rather than chronology. Accessible from the Practice page hub as additional collection tiles. Adds replay value and a fresh perspective without needing new content.

## P3 — Share a challenge

Let users generate a shareable quiz challenge ("Can you beat my score on Ancient History?"). Uses the Web Share API already integrated for progress export. Generate a simple image or text summary with score and challenge link. Simple viral growth mechanism that also makes learning social.

## P4 — Dark mode

Full dark theme using CSS custom properties alongside the existing @theme block. Toggle in Settings. Optionally respects system color-scheme preference. Swap parchment/ink colors while keeping category and mastery colors legible. Expected by many users, especially for evening study sessions.

## P4 — Content expansion (more events & lessons)

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
