// ─── SM-2 Variant Spaced Repetition for Chronos ─────
// Pure functions — no React dependencies.
//
// green  → correct, grow interval
// yellow → partially correct, hold interval
// red    → incorrect, reset interval

const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;
const MAX_EASE = 3.5;

function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Calculate the next review schedule after answering a question.
 * @param {{ interval: number, ease: number, reviewCount: number }} currentSchedule
 * @param {'green'|'yellow'|'red'} score
 * @returns {{ interval, ease, nextReview, reviewCount, lastReviewScore }}
 */
export function calculateNextReview(currentSchedule, score) {
    let { interval, ease, reviewCount } = currentSchedule || {};
    ease = ease || DEFAULT_EASE;
    interval = interval || 0;
    reviewCount = reviewCount || 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (score === 'green') {
        if (interval === 0) interval = 1;
        else if (interval === 1) interval = 3;
        else interval = Math.round(interval * ease);
        ease = Math.min(MAX_EASE, ease + 0.1);
    } else if (score === 'yellow') {
        if (interval === 0) interval = 1;
        // Otherwise hold interval — review again in same timeframe
    } else {
        // Red: reset
        interval = 0;
        ease = Math.max(MIN_EASE, ease - 0.2);
    }

    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + interval);
    const nextReview = nextDate.toISOString().split('T')[0];

    return {
        interval,
        ease,
        nextReview,
        reviewCount: reviewCount + 1,
        lastReviewScore: score,
    };
}

/**
 * Get events due for review, sorted by priority (most overdue first).
 * @param {Object} srSchedule - { [eventId]: { nextReview, ease, ... } }
 * @param {string[]} seenEvents - Array of event IDs
 * @returns {{ eventId: string, overdue: number }[]}
 */
export function getDueEvents(srSchedule, seenEvents) {
    const today = getTodayStr();
    const due = [];

    for (const eventId of seenEvents) {
        const schedule = srSchedule[eventId];
        if (!schedule) {
            // Never scheduled — due immediately
            due.push({ eventId, overdue: 999 });
            continue;
        }
        if (schedule.nextReview <= today) {
            const dueDate = new Date(schedule.nextReview);
            const now = new Date(today);
            const overdueDays = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
            due.push({ eventId, overdue: overdueDays });
        }
    }

    // Sort: most overdue first, then by lowest ease (hardest cards)
    due.sort((a, b) => {
        if (b.overdue !== a.overdue) return b.overdue - a.overdue;
        const easeA = srSchedule[a.eventId]?.ease ?? DEFAULT_EASE;
        const easeB = srSchedule[b.eventId]?.ease ?? DEFAULT_EASE;
        return easeA - easeB;
    });

    return due;
}

/**
 * Compute card status from mastery, SR schedule, and skipped flags.
 * Statuses: 'new' | 'learning' | 'known' | 'fully_assimilated'
 */
export function getCardStatus(eventId, eventMastery, srSchedule, skippedEvents) {
    const mastery = eventMastery[eventId];
    const sr = srSchedule[eventId];
    const isSkipped = (skippedEvents || []).includes(eventId);

    if (!mastery && !sr) return 'new';

    const overallMastery = mastery?.overallMastery ?? 0;
    const reviewCount = sr?.reviewCount ?? 0;
    const interval = sr?.interval ?? 0;

    // Fully Assimilated: high mastery + long intervals + several reviews
    if (overallMastery >= 10 && interval >= 14 && reviewCount >= 3) {
        return 'fully_assimilated';
    }

    // Skipped fast-track: placed via quiz, verified well in practice
    if (isSkipped && overallMastery >= 7 && reviewCount >= 2) {
        return 'fully_assimilated';
    }

    // Known: good mastery
    if (overallMastery >= 7) {
        return 'known';
    }

    // Learning: has been reviewed or has some mastery
    if (reviewCount > 0 || overallMastery > 0) {
        return 'learning';
    }

    return 'new';
}

/**
 * Get counts for each status category.
 */
export function getStatusCounts(seenEvents, eventMastery, srSchedule, skippedEvents) {
    const counts = { new: 0, learning: 0, known: 0, fully_assimilated: 0 };
    for (const eventId of seenEvents) {
        const status = getCardStatus(eventId, eventMastery, srSchedule, skippedEvents);
        counts[status]++;
    }
    return counts;
}

/**
 * Estimate an initial SR interval from existing mastery data (for migration).
 */
export function calculateInitialInterval(mastery) {
    const om = mastery?.overallMastery ?? 0;
    if (om >= 10) return 7;
    if (om >= 7) return 3;
    if (om >= 4) return 1;
    return 0;
}
