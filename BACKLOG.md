# Chronos — Feature Backlog

> **Instructions for AI agents:** When asked to "run some improvements" or "pick the next thing to do",
> choose the highest-priority unfinished item from this list and implement it fully.
> After completing an item, update this file:
> 1. Move the completed item to a "## Completed" section at the bottom with the date
> 2. If the implementation revealed new sub-tasks or follow-ups, add them in the right priority position
> 3. If an existing item is now partially done, update its description to reflect remaining work
> 4. Run `npm run build && npx cap sync` after any changes

---

## P2 — Push notifications for streak reminders and daily learning

Add push notification support using @capacitor/push-notifications or @capacitor/local-notifications. Two notification types: (1) Streak reminder — if the user hasn't completed a lesson today and it's getting late (e.g., 8pm), send a "Don't lose your X-day streak!" notification. (2) Daily learning reminder — the user sets a preferred learning time, and the app sends a gentle reminder at that time each day. On first app launch (or after an update that adds this feature), show a tasteful onboarding modal in the app's visual style (parchment background, serif headings, burgundy accents) that asks: "Would you like daily reminders to learn?" with a time picker and an opt-out option. Store the preference in localStorage. The notification text should be warm and encouraging, not pushy.

## P2 — Controversy/ambiguity info button on quiz answers

On any quiz question where the answer could be debated (especially era date questions, but also event dates where historians disagree), add a small "?" info button visible after the user answers (whether correct or wrong). Tapping it opens a brief, scholarly explanation of why the date might be controversial. For example: on the Medieval period end date, the info might say "Historians disagree on when the Middle Ages ended. Common alternatives include 1453 (Fall of Constantinople), 1492 (Columbus reaches the Americas), and 1517 (the Reformation). This app uses c. 1500 as a compromise." This turns moments of confusion into learning opportunities. The info text should be written in the app's tone — scholarly but accessible, never condescending. Store the controversy notes in the data layer (events.js or a new file) so they're easy to edit. Not every question needs one — only add them where genuine ambiguity exists.

## P3 — Onboarding flow for new users

First-time users currently land on the Learn page with no context. Add a brief onboarding sequence (3-4 screens) that explains what Chronos is, how lessons work, and what streaks/XP mean. Should feel like flipping through a beautifully designed booklet. Skip button always available. Store a hasSeenOnboarding flag in localStorage.

## P3 — Sound effects and haptic feedback

Add subtle audio feedback for correct/wrong answers and haptic vibration using @capacitor/haptics. Correct answer: brief positive chime + light haptic. Wrong answer: softer negative tone + different haptic pattern. Lesson complete: celebratory sound. Include a toggle in Settings to disable sounds and haptics independently. Keep sounds minimal and classy — not gamey.

## P3 — Spaced repetition for practice mode

The practice mode currently picks events randomly or by lesson. Implement a basic spaced repetition algorithm: events the user gets wrong should appear more frequently, events consistently answered correctly should appear less often. Track last-reviewed date and difficulty rating per event in localStorage. This is the single biggest improvement for actual learning outcomes.

---

## Completed

- **P1 — Streak visual indicator** (2026-02-27): Enhanced TopBar flame icon with 3 animated states (active/at-risk/inactive), dynamic colors, and a tap-to-open streak detail modal with contextual motivational messages.
- **P1 — Correct answer celebration card** (2026-02-27): 1.5s auto-dismiss (or tap) interstitial after correct answers showing celebrating mascot, event card with green styling, running score counter. Works in both learn quiz and recap phases.
- **P1 — Lesson intro event preview** (2026-02-27): Lesson intro screen now shows a visual preview of upcoming content — 5 era icons with titles for Lesson 0, and event cards with category colors/dates for regular lessons. Staggered fade-in animation.
- **P2 — Push notifications for streak reminders and daily learning** (2026-02-27): Local notifications via @capacitor/local-notifications with onboarding modal after first lesson, daily reminder time picker, streak alerts at 8pm, Settings controls, and full web-safe fallbacks.
- **Content — Shorter quiz descriptions** (2026-02-27): Added `quizDescription` field to all 60 events — one-sentence summaries used as MCQ options in description quiz questions. Full descriptions preserved for learn cards.
