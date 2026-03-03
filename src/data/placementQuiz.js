import { shuffle } from './quiz';
import { getEventsByIds } from './events';
import { ERA_QUIZ_GROUPS } from './lessons';

// ─── Placement Quiz — pure functions ─────────────────

const QUESTION_TYPES = ['date', 'location', 'what', 'description'];

/**
 * Generate questions for a placement quiz.
 * Returns one question per event, random question type.
 */
export function generatePlacementQuestions(eraId) {
    const group = ERA_QUIZ_GROUPS.find(g => g.id === eraId);
    if (!group) return [];

    const allEventIds = group.eventIds;
    const events = getEventsByIds(allEventIds);

    // Pick questionCount random events (or all if fewer)
    const selected = shuffle([...events]).slice(0, group.questionCount);

    return selected.map(event => ({
        event,
        type: QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)],
        key: `placement-${event.id}-${Date.now()}-${Math.random()}`,
    }));
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
