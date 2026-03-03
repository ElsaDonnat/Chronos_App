/**
 * Challenge mode question generation — 6 creative question types.
 * All questions are binary (correct/incorrect), no yellow scoring.
 */

import { ALL_EVENTS, CATEGORY_CONFIG, ERA_RANGES, getEraForYear } from './events';
import { shuffle, generateDateMCQOptions, generateLocationOptions } from './quiz';

// ─── Tier system ─────────────────────────────────────────────

export const CHALLENGE_TIERS = [
    { id: 'beginner',  label: 'Beginner',  icon: '\uD83C\uDF31', color: '#059669', questions: 5, flavor: 'Let\u2019s see what you know\u2026' },
    { id: 'amateur',   label: 'Amateur',   icon: '\uD83D\uDCD6', color: '#2563EB', questions: 5, flavor: 'Getting warmer\u2026' },
    { id: 'advanced',  label: 'Advanced',  icon: '\uD83C\uDF93', color: '#7C3AED', questions: 5, flavor: 'The real test begins.' },
    { id: 'historian', label: 'Historian', icon: '\uD83C\uDFDB\uFE0F', color: '#B45309', questions: 5, flavor: 'Only scholars make it this far.' },
    { id: 'god',       label: 'God',       icon: '\u26A1',       color: '#DC2626', questions: 1, flavor: 'The ultimate challenge.' },
];

export const TOTAL_CHALLENGE_QUESTIONS = CHALLENGE_TIERS.reduce((s, t) => s + t.questions, 0); // 21

export function getTierForQuestion(questionIndex) {
    let cumulative = 0;
    for (const tier of CHALLENGE_TIERS) {
        cumulative += tier.questions;
        if (questionIndex < cumulative) return tier;
    }
    return CHALLENGE_TIERS[CHALLENGE_TIERS.length - 1];
}

export function getTierProgress(questionIndex) {
    let cumulative = 0;
    for (const tier of CHALLENGE_TIERS) {
        if (questionIndex < cumulative + tier.questions) {
            return { tier, indexInTier: questionIndex - cumulative, tierStart: cumulative };
        }
        cumulative += tier.questions;
    }
    const last = CHALLENGE_TIERS[CHALLENGE_TIERS.length - 1];
    return { tier: last, indexInTier: last.questions - 1, tierStart: TOTAL_CHALLENGE_QUESTIONS - last.questions };
}

// ─── Tier-specific type pools ────────────────────────────────

const TIER_TYPES = {
    beginner:  ['categorySort', 'eraDetective'],
    amateur:   ['hardMCQ', 'trueOrFalse', 'eraDetective', 'categorySort'],
    advanced:  ['hardMCQ', 'whichCameFirst', 'oddOneOut', 'trueOrFalse'],
    historian: ['whichCameFirst', 'oddOneOut', 'hardMCQ', 'trueOrFalse'],
};

function pickTypeForTier(tierId) {
    const types = TIER_TYPES[tierId] || EASY_TYPES;
    return types[Math.floor(Math.random() * types.length)];
}

function filterPoolForTier(pool, tierId) {
    switch (tierId) {
        case 'beginner': {
            const easy = pool.filter(e => (e.difficulty || 1) === 1);
            return easy.length >= 8 ? easy : pool;
        }
        case 'amateur': {
            const mid = pool.filter(e => (e.difficulty || 1) <= 2);
            return mid.length >= 8 ? mid : pool;
        }
        case 'advanced':
        case 'historian': {
            const hard = pool.filter(e => (e.difficulty || 1) >= 2);
            return hard.length >= 8 ? hard : pool;
        }
        default: return pool;
    }
}

// ─── Event selection ─────────────────────────────────────────

/** Build a pool of events for the challenge, prioritizing unseen. */
export function buildChallengePool(seenEventIds = []) {
    const seenSet = new Set(seenEventIds);
    const unseen = ALL_EVENTS.filter(e => !seenSet.has(e.id));
    const seen = ALL_EVENTS.filter(e => seenSet.has(e.id));

    // 70% unseen, 30% seen (if available)
    const unseenCount = Math.min(unseen.length, Math.max(20, Math.round(ALL_EVENTS.length * 0.7)));
    const seenCount = Math.min(seen.length, ALL_EVENTS.length - unseenCount);

    return shuffle([...shuffle(unseen).slice(0, unseenCount), ...shuffle(seen).slice(0, seenCount)]);
}

// ─── Question type weights by difficulty ramp ────────────────

const EASY_TYPES = ['categorySort', 'eraDetective', 'hardMCQ'];
const HARD_TYPES = ['whichCameFirst', 'oddOneOut', 'trueOrFalse'];

/** Pick a question type weighted by how far into the game we are. */
function pickQuestionType(questionIndex) {
    // Early game: 70% easy, 30% hard. Late game: 30% easy, 70% hard
    const hardWeight = Math.min(0.7, 0.3 + questionIndex * 0.04);
    const pool = Math.random() < hardWeight ? HARD_TYPES : EASY_TYPES;
    return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Master question generator ───────────────────────────────

/**
 * Generate a single challenge question from the pool.
 * Returns null if the pool is exhausted (should not normally happen).
 */
export function generateChallengeQuestion(pool, questionIndex, usedEventIds = new Set()) {
    const type = pickQuestionType(questionIndex);
    // Attempt the chosen type, fall back to others if it fails
    const types = [type, ...shuffle([...EASY_TYPES, ...HARD_TYPES].filter(t => t !== type))];

    for (const t of types) {
        const q = generateByType(t, pool, usedEventIds);
        if (q) return q;
    }

    // Ultimate fallback: simple hard MCQ on any event
    const event = pool.find(e => !usedEventIds.has(e.id)) || pool[0];
    return generateHardMCQ(event);
}

function generateByType(type, pool, usedEventIds) {
    switch (type) {
        case 'hardMCQ': {
            const event = pickUnused(pool, usedEventIds);
            if (!event) return null;
            return generateHardMCQ(event);
        }
        case 'whichCameFirst': return generateWhichCameFirst(pool, usedEventIds);
        case 'oddOneOut': return generateOddOneOut(pool, usedEventIds);
        case 'trueOrFalse': {
            const event = pickUnused(pool, usedEventIds);
            if (!event) return null;
            return generateTrueOrFalse(event);
        }
        case 'eraDetective': {
            const event = pickUnused(pool, usedEventIds);
            if (!event) return null;
            return generateEraDetective(event);
        }
        case 'categorySort': {
            const event = pickUnused(pool, usedEventIds);
            if (!event) return null;
            return generateCategorySort(event);
        }
        default: return null;
    }
}

function pickUnused(pool, usedIds) {
    return pool.find(e => !usedIds.has(e.id)) || pool[Math.floor(Math.random() * pool.length)];
}

// ─── Question generators ─────────────────────────────────────

/** Hard MCQ — distractors from same era + category for maximum plausibility. */
function generateHardMCQ(event) {
    const era = getEraForYear(event.year);
    const subTypes = shuffle(['location', 'date', 'what', 'description']);
    const subType = subTypes[0];

    let options, correctIndex;

    if (subType === 'location') {
        // Filter to same-era events for harder distractors
        const sameEra = ALL_EVENTS.filter(e => {
            const eEra = getEraForYear(e.year);
            return eEra.id === era.id && e.id !== event.id;
        });
        const pool = sameEra.length >= 3 ? sameEra : ALL_EVENTS.filter(e => e.id !== event.id);
        const opts = generateLocationOptions(event, [event, ...pool]);
        options = opts.map(place => ({ label: place, isCorrect: place === event.location.place }));
        correctIndex = options.findIndex(o => o.isCorrect);
    } else if (subType === 'date') {
        const opts = generateDateMCQOptions(event);
        options = opts.map(o => ({ label: o.label, isCorrect: o.isCorrect }));
        correctIndex = options.findIndex(o => o.isCorrect);
    } else if (subType === 'what') {
        // Show event description, pick the right title
        const sameEra = ALL_EVENTS.filter(e => getEraForYear(e.year).id === era.id && e.id !== event.id);
        const pool = sameEra.length >= 3 ? shuffle(sameEra).slice(0, 3) : shuffle(ALL_EVENTS.filter(e => e.id !== event.id)).slice(0, 3);
        options = shuffle([
            { label: event.title, isCorrect: true },
            ...pool.map(e => ({ label: e.title, isCorrect: false }))
        ]);
        correctIndex = options.findIndex(o => o.isCorrect);
    } else {
        // description: show title, pick the right description
        const sameEra = ALL_EVENTS.filter(e => getEraForYear(e.year).id === era.id && e.id !== event.id);
        const pool = sameEra.length >= 3 ? shuffle(sameEra).slice(0, 3) : shuffle(ALL_EVENTS.filter(e => e.id !== event.id)).slice(0, 3);
        options = shuffle([
            { label: event.quizDescription || event.description, isCorrect: true },
            ...pool.map(e => ({ label: e.quizDescription || e.description, isCorrect: false }))
        ]);
        correctIndex = options.findIndex(o => o.isCorrect);
    }

    const prompts = {
        location: `Where did "${event.title}" happen?`,
        date: `When did "${event.title}" happen?`,
        what: `Which event does this describe?`,
        description: `Which description fits "${event.title}"?`,
    };

    return {
        type: 'hardMCQ',
        subType,
        event,
        prompt: prompts[subType],
        context: subType === 'what' ? (event.quizDescription || event.description) : null,
        options,
        correctIndex,
        masteryDimension: subType,
        xpValue: 10 * (event.difficulty || 1),
    };
}

/** Which Came First — two events, pick the earlier one. */
function generateWhichCameFirst(pool, usedEventIds) {
    // Pick two events, preferring same-era pairs for harder questions
    const available = pool.filter(e => !usedEventIds.has(e.id));
    if (available.length < 2) return null;

    const shuffled = shuffle(available);
    let eventA = shuffled[0];
    let eventB = null;

    // Try to find one from the same era
    const eraA = getEraForYear(eventA.year);
    const sameEra = shuffled.slice(1).filter(e => getEraForYear(e.year).id === eraA.id);
    if (sameEra.length > 0) {
        eventB = sameEra[0];
    } else {
        eventB = shuffled[1];
    }

    // Ensure they have different years
    if (eventA.year === eventB.year) {
        const alt = shuffled.find(e => e.id !== eventA.id && e.year !== eventA.year);
        if (alt) eventB = alt;
        else return null;
    }

    const earlierEvent = eventA.year < eventB.year ? eventA : eventB;

    return {
        type: 'whichCameFirst',
        event: earlierEvent,
        eventA,
        eventB,
        correctId: earlierEvent.id,
        prompt: 'Which came first?',
        masteryDimension: 'date',
        xpValue: 15,
    };
}

/** Odd One Out — 4 events, 3 share a trait, find the outlier. */
function generateOddOneOut(pool, usedEventIds) {
    const available = pool.filter(e => !usedEventIds.has(e.id));

    // Try grouping by category first
    const traits = [
        { key: 'category', getVal: e => e.category, getLabel: v => `All ${CATEGORY_CONFIG[v]?.label || v}` },
        { key: 'era', getVal: e => getEraForYear(e.year).id, getLabel: v => `All from the ${ERA_RANGES.find(r => r.id === v)?.label || v} era` },
        { key: 'region', getVal: e => e.location.region, getLabel: v => `All from ${v}` },
    ];

    for (const trait of shuffle(traits)) {
        // Group events by this trait
        const groups = {};
        for (const e of available) {
            const val = trait.getVal(e);
            if (!groups[val]) groups[val] = [];
            groups[val].push(e);
        }

        // Need a group of 3+ and an outlier from a different group
        for (const [val, members] of Object.entries(groups)) {
            if (members.length < 3) continue;
            const outlierPool = available.filter(e => trait.getVal(e) !== val);
            if (outlierPool.length === 0) continue;

            const three = shuffle(members).slice(0, 3);
            const outlier = shuffle(outlierPool)[0];
            const events = shuffle([...three, outlier]);

            return {
                type: 'oddOneOut',
                event: outlier,
                events,
                outlierEventId: outlier.id,
                sharedTrait: trait.getLabel(val),
                prompt: 'One of these doesn\'t belong. Find the odd one out!',
                masteryDimension: 'what',
                xpValue: 15,
            };
        }
    }

    return null;
}

/** True or False — statement with one detail swapped. */
function generateTrueOrFalse(event) {
    const swapTypes = shuffle(['location', 'date', 'category']);
    let statement, isTrue, swappedDetail, correctDetail;

    // 40% chance it's actually true
    if (Math.random() < 0.4) {
        isTrue = true;
        statement = buildTrueStatement(event);
        swappedDetail = null;
        correctDetail = null;
    } else {
        isTrue = false;
        const swapType = swapTypes[0];

        if (swapType === 'location') {
            const otherEvent = shuffle(ALL_EVENTS.filter(e => e.id !== event.id && e.location.place !== event.location.place))[0];
            if (!otherEvent) return null;
            statement = `"${event.title}" took place in ${otherEvent.location.place}.`;
            swappedDetail = 'location';
            correctDetail = event.location.place;
        } else if (swapType === 'date') {
            const otherEvent = shuffle(ALL_EVENTS.filter(e => e.id !== event.id && e.date !== event.date))[0];
            if (!otherEvent) return null;
            statement = `"${event.title}" happened ${otherEvent.date}.`;
            swappedDetail = 'date';
            correctDetail = event.date;
        } else {
            const wrongCat = shuffle(Object.keys(CATEGORY_CONFIG).filter(c => c !== event.category))[0];
            statement = `"${event.title}" is categorized as ${CATEGORY_CONFIG[wrongCat].label}.`;
            swappedDetail = 'category';
            correctDetail = CATEGORY_CONFIG[event.category].label;
        }
    }

    return {
        type: 'trueOrFalse',
        event,
        statement,
        isTrue,
        swappedDetail,
        correctDetail,
        prompt: 'True or false?',
        masteryDimension: swappedDetail || 'what',
        xpValue: 10,
    };
}

function buildTrueStatement(event) {
    const statements = [
        `"${event.title}" took place in ${event.location.place}.`,
        `"${event.title}" happened ${event.date}.`,
        `"${event.title}" is categorized as ${CATEGORY_CONFIG[event.category].label}.`,
    ];
    return shuffle(statements)[0];
}

/** Era Detective — given description, guess the era. */
function generateEraDetective(event) {
    const correctEra = getEraForYear(event.year);
    // Strip obvious year references from description for harder challenge
    const desc = (event.quizDescription || event.description)
        .replace(/\d{3,}/g, '???')
        .replace(/\b(BCE|CE|AD|BC)\b/g, '');

    const options = ERA_RANGES.map(era => ({
        label: era.label,
        isCorrect: era.id === correctEra.id,
    }));

    return {
        type: 'eraDetective',
        event,
        description: desc,
        prompt: `Which era does this event belong to?`,
        context: `"${event.title}"`,
        options,
        correctIndex: options.findIndex(o => o.isCorrect),
        masteryDimension: 'date',
        xpValue: 10,
    };
}

/** Category Sort — given event title + snippet, guess the category. */
function generateCategorySort(event) {
    const options = Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => ({
        label: cfg.label,
        color: cfg.color,
        bg: cfg.bg,
        isCorrect: key === event.category,
    }));

    return {
        type: 'categorySort',
        event,
        prompt: `What category does this event belong to?`,
        context: event.title,
        description: event.quizDescription || event.description,
        options,
        correctIndex: options.findIndex(o => o.isCorrect),
        masteryDimension: 'what',
        xpValue: 10,
    };
}

// ─── Tiered question generator (solo mode) ───────────────────

/**
 * Generate a challenge question using the tier system.
 * Beginner → easy types + easy events, God → chronological ordering.
 */
export function generateTieredChallengeQuestion(pool, questionIndex, usedEventIds = new Set()) {
    const { tier } = getTierProgress(questionIndex);

    // God tier: chronological ordering
    if (tier.id === 'god') {
        const q = generateChronologicalOrder(pool, usedEventIds);
        if (q) { q.tier = tier; return q; }
        // Fallback to hardest MCQ
        const event = pickUnused(pool, usedEventIds) || pool[0];
        const fallback = generateHardMCQ(event);
        fallback.tier = tier;
        return fallback;
    }

    const type = pickTypeForTier(tier.id);
    const allTypes = TIER_TYPES[tier.id] || EASY_TYPES;
    const types = [type, ...shuffle(allTypes.filter(t => t !== type))];
    const tierPool = filterPoolForTier(pool, tier.id);
    const effectivePool = tierPool.length >= 8 ? tierPool : pool;

    for (const t of types) {
        const q = generateByType(t, effectivePool, usedEventIds);
        if (q) { q.tier = tier; return q; }
    }

    const event = pickUnused(pool, usedEventIds) || pool[0];
    const q = generateHardMCQ(event);
    q.tier = tier;
    return q;
}

// ─── God-tier question: Chronological Order ──────────────────

/** Sort 5 events by year — the ultimate test. */
function generateChronologicalOrder(pool, usedEventIds) {
    const available = pool.filter(e => !usedEventIds.has(e.id));
    if (available.length < 5) return null;

    // Group by era and try to pick from the largest group (same-era = hardest)
    const byEra = {};
    for (const e of available) {
        const era = getEraForYear(e.year).id;
        if (!byEra[era]) byEra[era] = [];
        byEra[era].push(e);
    }

    let picked = [];
    const eras = Object.entries(byEra).sort((a, b) => b[1].length - a[1].length);

    for (const [, events] of eras) {
        if (events.length >= 5) {
            const distinct = [];
            const usedYears = new Set();
            for (const e of shuffle(events)) {
                if (!usedYears.has(e.year)) {
                    distinct.push(e);
                    usedYears.add(e.year);
                }
                if (distinct.length === 5) break;
            }
            if (distinct.length === 5) { picked = distinct; break; }
        }
    }

    // Fallback: pick across eras with distinct years
    if (picked.length < 5) {
        const distinct = [];
        const usedYears = new Set();
        for (const e of shuffle(available)) {
            if (!usedYears.has(e.year)) {
                distinct.push(e);
                usedYears.add(e.year);
            }
            if (distinct.length === 5) break;
        }
        picked = distinct;
    }

    if (picked.length < 5) return null;

    const correctOrder = [...picked].sort((a, b) => a.year - b.year);

    return {
        type: 'chronologicalOrder',
        events: shuffle([...picked]),
        correctOrder: correctOrder.map(e => e.id),
        prompt: 'Arrange these events from earliest to latest.',
        masteryDimension: 'date',
        xpValue: 50,
        event: correctOrder[0],
    };
}
