import { shuffle } from './quiz';
import { ALL_EVENTS, getEventsByIds, getEraForYear } from './events';
import { ERA_QUIZ_GROUPS } from './lessons';

// ─── Placement Quiz — pure functions ─────────────────

// Harder question types mixed in with standard MCQ types
const STANDARD_TYPES = ['date', 'location', 'what', 'description'];
const CHALLENGE_TYPES = ['whichCameFirst', 'eraDetective'];

/**
 * Generate questions for a placement quiz.
 * Mixes standard MCQ (with same-era distractors) and challenge-style types
 * for a difficulty level comparable to Advanced challenge tier.
 */
export function generatePlacementQuestions(eraId) {
    const group = ERA_QUIZ_GROUPS.find(g => g.id === eraId);
    if (!group) return [];

    const allEventIds = group.eventIds;
    const events = getEventsByIds(allEventIds);
    const shuffledEvents = shuffle([...events]);

    // Build a pool of same-era events for harder distractors
    const era = { id: eraId };
    const sameEraEvents = ALL_EVENTS.filter(e => {
        const eventEra = getEraForYear(e.year);
        return eventEra && eventEra.id === eraId;
    });

    const questions = [];
    const usedEventIds = new Set();

    // Reserve ~30% of slots for challenge-style questions (whichCameFirst, eraDetective)
    const totalQuestions = group.questionCount;
    const challengeCount = Math.max(2, Math.floor(totalQuestions * 0.3));
    const standardCount = totalQuestions - challengeCount;

    // Generate standard MCQ questions with same-era distractor pools
    const standardEvents = shuffledEvents.slice(0, standardCount);
    let typeIdx = 0;
    for (const event of standardEvents) {
        usedEventIds.add(event.id);
        // Cycle through standard types to ensure variety
        const type = STANDARD_TYPES[typeIdx % STANDARD_TYPES.length];
        typeIdx++;
        questions.push({
            event,
            type,
            sameEraEvents, // pass same-era pool for harder distractors
            key: `placement-${event.id}-${Date.now()}-${Math.random()}`,
        });
    }

    // Generate challenge-style questions from remaining events
    const remainingEvents = shuffledEvents.filter(e => !usedEventIds.has(e.id));
    let challengeIdx = 0;

    for (let i = 0; i < challengeCount; i++) {
        const challengeType = CHALLENGE_TYPES[challengeIdx % CHALLENGE_TYPES.length];
        challengeIdx++;

        if (challengeType === 'whichCameFirst') {
            // Need 2 events — prefer same-era pairs where order is non-obvious
            const available = [...remainingEvents, ...standardEvents].filter(e => !usedEventIds.has(e.id) || remainingEvents.includes(e));
            const pairPool = sameEraEvents.filter(e => !usedEventIds.has(e.id));
            let eventA, eventB;

            if (pairPool.length >= 2) {
                // Pick two events with years close enough to be ambiguous
                const sorted = shuffle(pairPool);
                eventA = sorted[0];
                eventB = sorted[1];
            } else if (remainingEvents.length >= 2) {
                eventA = remainingEvents[0];
                eventB = remainingEvents[1];
            } else {
                // Fallback: use any two era events
                const fallback = shuffle(events);
                eventA = fallback[0];
                eventB = fallback[1] || fallback[0];
            }

            if (eventA && eventB && eventA.id !== eventB.id) {
                usedEventIds.add(eventA.id);
                usedEventIds.add(eventB.id);
                questions.push({
                    type: 'whichCameFirst',
                    eventA,
                    eventB,
                    key: `placement-wcf-${eventA.id}-${eventB.id}-${Date.now()}`,
                });
            }
        } else if (challengeType === 'eraDetective') {
            // Pick an event and ask which era it belongs to
            const event = remainingEvents.find(e => !usedEventIds.has(e.id))
                || shuffledEvents.find(e => !usedEventIds.has(e.id))
                || shuffledEvents[0];

            if (event) {
                usedEventIds.add(event.id);
                questions.push({
                    type: 'eraDetective',
                    event,
                    key: `placement-era-${event.id}-${Date.now()}`,
                });
            }
        }
    }

    // Ensure we hit the target count (fill with standard if challenge fell short)
    while (questions.length < totalQuestions) {
        const event = shuffledEvents.find(e => !usedEventIds.has(e.id)) || shuffle(events)[0];
        if (event) usedEventIds.add(event.id);
        questions.push({
            event,
            type: STANDARD_TYPES[questions.length % STANDARD_TYPES.length],
            sameEraEvents,
            key: `placement-fill-${event?.id}-${Date.now()}-${Math.random()}`,
        });
    }

    return shuffle(questions);
}

/**
 * Score a completed placement quiz.
 * green = 1pt, yellow = 0.5pt, red = 0pt
 * @param {string} eraId
 * @param {{ score: 'green'|'yellow'|'red' }[]} results
 * @returns {{ passed: boolean, score: number, maxScore: number }}
 */
export function scorePlacementQuiz(eraId, results) {
    const group = ERA_QUIZ_GROUPS.find(g => g.id === eraId);
    if (!group) return { passed: false, score: 0, maxScore: 0 };

    let points = 0;
    for (const r of results) {
        if (r.score === 'green') points += 1;
        else if (r.score === 'yellow') points += 0.5;
    }

    return {
        passed: points >= group.passThreshold,
        score: points,
        maxScore: group.questionCount,
    };
}

/**
 * Get the next available placement quiz era (first unpassed).
 */
export function getNextPlacementEra(placementQuizzes) {
    for (const group of ERA_QUIZ_GROUPS) {
        const result = placementQuizzes[group.id];
        if (!result || !result.passed) return group;
    }
    return null; // all passed
}

/**
 * All eras are always available to take — no sequential locking.
 */
// eslint-disable-next-line no-unused-vars
export function isPlacementQuizUnlocked(_eraId, _placementQuizzes) {
    return true;
}
