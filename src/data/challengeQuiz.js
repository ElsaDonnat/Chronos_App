/**
 * Challenge mode question generation — 6 creative question types.
 * All questions are binary (correct/incorrect), no yellow scoring.
 *
 * 35 questions across 6 tiers. From question 3 onward, roughly 1-in-3
 * questions draw from Level 2 events. Never more than 3 in a row from
 * the same level.
 */

import { ALL_EVENTS, CATEGORY_CONFIG, ERA_RANGES, getEraForYear, isLevel2Event } from './events';
import { shuffle, generateDateMCQOptions, generateLocationOptions } from './quiz';

// ─── Curated question pools for Beginner & Amateur ──────────

/**
 * Each spec: { type, eventId, ...typeSpecificFields }
 * Built into full question objects by buildCuratedQuestion().
 */
const BEGINNER_QUESTIONS = [
    // categorySort — title is ambiguous about category
    { type: 'categorySort', eventId: 'f2' },   // Cooking Revolution → Science
    { type: 'categorySort', eventId: 'f30' },  // Black Death → Science
    { type: 'categorySort', eventId: 'f40' },  // Enlightenment → Culture
    { type: 'categorySort', eventId: 'f20' },  // Edict of Milan → Politics
    { type: 'categorySort', eventId: 'f31' },  // Fall of Constantinople → War

    // eraDetective — era not obvious from title
    { type: 'eraDetective', eventId: 'f24' },  // Founding of Islam → Medieval
    { type: 'eraDetective', eventId: 'f6' },   // Neolithic Revolution → Prehistory
    { type: 'eraDetective', eventId: 'f32' },  // Gutenberg Printing Press → Medieval
    { type: 'eraDetective', eventId: 'f19' },  // Life & Crucifixion of Jesus → Ancient
    { type: 'eraDetective', eventId: 'f8' },   // Unification of Egypt → Ancient

    // trueOrFalse — content-based, not category-based
    { type: 'trueOrFalse', eventId: 'f29',
        statement: 'The Mongol Empire was the largest contiguous land empire in history',
        isTrue: true },
    { type: 'trueOrFalse', eventId: 'f15',
        statement: 'Alexander the Great conquered territories stretching from Greece to India',
        isTrue: true },
    { type: 'trueOrFalse', eventId: 'f5',
        statement: 'Early humans left Africa by crossing the Bering Land Bridge',
        isTrue: false, correction: 'They migrated via the Arabian Peninsula. The Bering Land Bridge was used later to reach the Americas.' },
    { type: 'trueOrFalse', eventId: 'f34',
        statement: 'The Renaissance began in France before spreading across Europe',
        isTrue: false, correction: 'It began in Italy, particularly in Florence.' },
    { type: 'trueOrFalse', eventId: 'f46',
        statement: 'The Industrial Revolution began in France',
        isTrue: false, correction: 'It began in Britain.' },
    { type: 'trueOrFalse', eventId: 'f9',
        statement: 'The earliest known writing system was Egyptian hieroglyphics',
        isTrue: false, correction: 'It was Sumerian cuneiform, developed in Mesopotamia.' },
    { type: 'trueOrFalse', eventId: 'f7',
        statement: 'The first cities in history were built along the Nile in Egypt',
        isTrue: false, correction: 'They emerged in Mesopotamia (modern Iraq).' },
];

const AMATEUR_QUESTIONS = [
    // categorySort — harder ambiguity
    { type: 'categorySort', eventId: 'f14' },  // Axial Age → Culture
    { type: 'categorySort', eventId: 'f26' },  // Islamic Golden Age → Science
    { type: 'categorySort', eventId: 'f39' },  // Atlantic Slave Trade → Politics

    // eraDetective — trickier era placement
    { type: 'eraDetective', eventId: 'f10' },  // Code of Hammurabi → Ancient
    { type: 'eraDetective', eventId: 'f22' },  // Plague of Justinian → Medieval
    { type: 'eraDetective', eventId: 'f37' },  // Thirty Years' War → Early Modern
    { type: 'eraDetective', eventId: 'f38' },  // Scientific Revolution → Early Modern
    { type: 'eraDetective', eventId: 'f44' },  // Napoleon → Modern

    // trueOrFalse — harder content questions
    { type: 'trueOrFalse', eventId: 'f110',
        statement: "Mansa Musa\u2019s pilgrimage to Mecca was so lavish it crashed Egypt\u2019s gold economy",
        isTrue: true },
    { type: 'trueOrFalse', eventId: 'f62',
        statement: 'The Haitian Revolution was the only successful large-scale slave revolt in history',
        isTrue: true },
    { type: 'trueOrFalse', eventId: 'f45',
        statement: 'The Congress of Vienna was held to reshape Europe after World War I',
        isTrue: false, correction: 'It was held after Napoleon\u2019s defeat. The WWI peace conference was the Treaty of Versailles.' },
    { type: 'trueOrFalse', eventId: 'f36',
        statement: 'The Protestant Reformation was started by French theologian John Calvin',
        isTrue: false, correction: 'It was started by German monk Martin Luther in Wittenberg.' },

    // hardMCQ/location — non-obvious but fair
    { type: 'hardMCQ', subType: 'location', eventId: 'f12',
        options: [
            { label: 'Olympia, Greece', isCorrect: true },
            { label: 'Athens, Greece', isCorrect: false },
            { label: 'Rome, Italy', isCorrect: false },
            { label: 'Sparta, Greece', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'location', eventId: 'f33',
        options: [
            { label: 'The Caribbean', isCorrect: true },
            { label: 'North America', isCorrect: false },
            { label: 'Brazil', isCorrect: false },
            { label: 'Mexico', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'location', eventId: 'f50',
        options: [
            { label: 'St. Petersburg, Russia', isCorrect: true },
            { label: 'Moscow, Russia', isCorrect: false },
            { label: 'Warsaw, Poland', isCorrect: false },
            { label: 'Berlin, Germany', isCorrect: false },
        ] },

    // hardMCQ/date — distractors spread out
    { type: 'hardMCQ', subType: 'date', eventId: 'f35',
        prompt: 'When did the Magellan-Elcano circumnavigation set sail?',
        options: [
            { label: '1453', isCorrect: false },
            { label: '1492', isCorrect: false },
            { label: '1519', isCorrect: true },
            { label: '1588', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f25',
        prompt: 'When did the Tang Dynasty begin?',
        options: [
            { label: '220 CE', isCorrect: false },
            { label: '618 CE', isCorrect: true },
            { label: '1100 CE', isCorrect: false },
            { label: '1500 CE', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f62',
        prompt: 'When did the Haitian Revolution begin?',
        options: [
            { label: '1650', isCorrect: false },
            { label: '1791', isCorrect: true },
            { label: '1860', isCorrect: false },
            { label: '1920', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f22',
        prompt: 'When did the Plague of Justinian strike?',
        options: [
            { label: '100 BCE', isCorrect: false },
            { label: '541 CE', isCorrect: true },
            { label: '1100 CE', isCorrect: false },
            { label: '1347 CE', isCorrect: false },
        ] },
];

/** Build a full question object from a curated spec. */
function buildCuratedQuestion(spec) {
    const event = ALL_EVENTS.find(e => e.id === spec.eventId);
    if (!event) return null;

    switch (spec.type) {
        case 'categorySort': {
            const options = Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => ({
                label: cfg.label, color: cfg.color, bg: cfg.bg,
                isCorrect: key === event.category,
            }));
            return {
                type: 'categorySort', event,
                prompt: 'What category does this event belong to?',
                context: event.title,
                options, correctIndex: options.findIndex(o => o.isCorrect),
                masteryDimension: 'what', xpValue: 10,
            };
        }
        case 'eraDetective': {
            const correctEra = getEraForYear(event.year);
            const desc = (event.quizDescription || event.description)
                .replace(/\d{3,}/g, '???').replace(/\b(BCE|CE|AD|BC)\b/g, '');
            const options = ERA_RANGES.map(era => ({
                label: era.label, isCorrect: era.id === correctEra.id,
            }));
            return {
                type: 'eraDetective', event, description: desc,
                prompt: 'Which era does this event belong to?',
                context: `"${event.title}"`,
                options, correctIndex: options.findIndex(o => o.isCorrect),
                masteryDimension: 'date', xpValue: 10,
            };
        }
        case 'trueOrFalse': {
            return {
                type: 'trueOrFalse', event,
                statement: spec.statement, isTrue: spec.isTrue,
                correction: spec.correction || null,
                prompt: 'True or false?',
                masteryDimension: 'what', xpValue: 10,
            };
        }
        case 'hardMCQ': {
            const options = shuffle([...spec.options]);
            const prompts = {
                location: `Where did "${event.title}" happen?`,
                date: spec.prompt || `When did "${event.title}" happen?`,
            };
            return {
                type: 'hardMCQ', subType: spec.subType, event,
                prompt: prompts[spec.subType] || spec.prompt,
                options, correctIndex: options.findIndex(o => o.isCorrect),
                masteryDimension: spec.subType, xpValue: 10 * (event.difficulty || 1),
            };
        }
        default: return null;
    }
}

// ─── Tier system ─────────────────────────────────────────────

export const CHALLENGE_TIERS = [
    { id: 'beginner',  label: 'Beginner',  icon: '\uD83C\uDF31', color: '#059669', questions: 5, flavor: 'Let\u2019s see what you know\u2026' },
    { id: 'amateur',   label: 'Amateur',   icon: '\uD83D\uDCD6', color: '#2563EB', questions: 7, flavor: 'Getting warmer\u2026' },
    { id: 'advanced',  label: 'Advanced',  icon: '\uD83C\uDF93', color: '#7C3AED', questions: 8, flavor: 'The real test begins.' },
    { id: 'historian', label: 'Historian', icon: '\uD83C\uDFDB\uFE0F', color: '#B45309', questions: 8, flavor: 'Only scholars make it this far.' },
    { id: 'expert',    label: 'Expert',    icon: '\uD83D\uDD2E', color: '#9333EA', questions: 5, flavor: 'Beyond the textbooks.' },
    { id: 'god',       label: 'God',       icon: '\u26A1',       color: '#DC2626', questions: 2, flavor: 'The ultimate challenge.' },
];

export const TOTAL_CHALLENGE_QUESTIONS = CHALLENGE_TIERS.reduce((s, t) => s + t.questions, 0); // 35

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
    beginner:  ['categorySort', 'eraDetective', 'trueOrFalse'],
    amateur:   ['eraDetective', 'categorySort', 'trueOrFalse', 'hardMCQ'],
    advanced:  ['hardMCQ', 'trueOrFalse', 'whichCameFirst', 'oddOneOut'],
    historian: ['whichCameFirst', 'oddOneOut', 'hardMCQ', 'trueOrFalse'],
    expert:    ['whichCameFirst', 'oddOneOut', 'hardMCQ'],
};

function pickTypeForTier(tierId, recentTypes = []) {
    let types = TIER_TYPES[tierId] || EASY_TYPES;
    // Prevent 3+ of the same type in a row
    const last2 = recentTypes.slice(-2);
    if (last2.length === 2 && last2[0] === last2[1]) {
        const blocked = last2[0];
        const filtered = types.filter(t => t !== blocked);
        if (filtered.length > 0) types = filtered;
    }
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
        case 'historian':
        case 'expert': {
            const hard = pool.filter(e => (e.difficulty || 1) >= 2);
            return hard.length >= 8 ? hard : pool;
        }
        default: return pool;
    }
}

// ─── Level mixing: decide whether a question should use Level 2 ─

/**
 * From question 3 onward, ~1 in 3 questions should come from Level 2.
 * Never allow more than 3 consecutive questions from the same level.
 * `recentLevels` is an array of the last few question levels (1 or 2).
 */
function shouldUseLevel2(questionIndex, recentLevels) {
    // First 2 questions are always Level 1
    if (questionIndex < 2) return false;

    // Enforce the "never 3 in a row" rule
    const last3 = recentLevels.slice(-3);
    if (last3.length >= 3 && last3.every(l => l === 1)) return true;   // force L2
    if (last3.length >= 3 && last3.every(l => l === 2)) return false;  // force L1

    // ~33% chance of Level 2
    return Math.random() < 0.33;
}

// ─── Event selection ─────────────────────────────────────────

/** Build a pool of events for the challenge, prioritizing unseen. */
export function buildChallengePool(seenEventIds = []) {
    const seenSet = new Set(seenEventIds);
    const coreEvents = ALL_EVENTS.filter(e => !e.source); // exclude daily quiz events
    const unseen = coreEvents.filter(e => !seenSet.has(e.id));
    const seen = coreEvents.filter(e => seenSet.has(e.id));

    // 70% unseen, 30% seen (if available)
    const unseenCount = Math.min(unseen.length, Math.max(30, Math.round(coreEvents.length * 0.7)));
    const seenCount = Math.min(seen.length, coreEvents.length - unseenCount);

    const pool = shuffle([...shuffle(unseen).slice(0, unseenCount), ...shuffle(seen).slice(0, seenCount)]);

    return {
        level1: pool.filter(e => !isLevel2Event(e)),
        level2: pool.filter(e => isLevel2Event(e)),
        all: pool,
    };
}

// ─── Question type weights by difficulty ramp ────────────────

const EASY_TYPES = ['categorySort', 'eraDetective', 'hardMCQ'];
const HARD_TYPES = ['whichCameFirst', 'oddOneOut', 'trueOrFalse'];

/** Pick a question type weighted by how far into the game we are. */
function pickQuestionType(questionIndex) {
    // Early game: 70% easy, 30% hard. Late game: 30% easy, 70% hard
    const hardWeight = Math.min(0.7, 0.3 + questionIndex * 0.02);
    const pool = Math.random() < hardWeight ? HARD_TYPES : EASY_TYPES;
    return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Master question generator ───────────────────────────────

/**
 * Generate a single challenge question from the pool.
 * Returns null if the pool is exhausted (should not normally happen).
 */
export function generateChallengeQuestion(pool, questionIndex, usedEventIds = new Set()) {
    // Legacy multiplayer path: pool is a flat array
    const flatPool = Array.isArray(pool) ? pool : pool.all;
    const type = pickQuestionType(questionIndex);
    // Attempt the chosen type, fall back to others if it fails
    const types = [type, ...shuffle([...EASY_TYPES, ...HARD_TYPES].filter(t => t !== type))];

    for (const t of types) {
        const q = generateByType(t, flatPool, usedEventIds);
        if (q) return q;
    }

    // Ultimate fallback: simple hard MCQ on any event
    const event = flatPool.find(e => !usedEventIds.has(e.id)) || flatPool[0];
    return generateHardMCQ(event);
}

function generateByType(type, pool, usedEventIds, { tierId } = {}) {
    switch (type) {
        case 'hardMCQ': {
            const event = pickUnused(pool, usedEventIds);
            if (!event) return null;
            // No exact-date questions in beginner/amateur — too hard
            const excludeSubTypes = (tierId === 'beginner' || tierId === 'amateur') ? ['date'] : [];
            return generateHardMCQ(event, { excludeSubTypes });
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
function generateHardMCQ(event, { excludeSubTypes = [] } = {}) {
    const era = getEraForYear(event.year);
    const allSubTypes = ['location', 'date', 'what', 'description'].filter(t => !excludeSubTypes.includes(t));
    const subTypes = shuffle(allSubTypes.length > 0 ? allSubTypes : ['location', 'what', 'description']);
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
 * From question 3 onward, mixes Level 2 events in (~1/3 ratio).
 * Never more than 3 consecutive questions from the same level.
 */
export function generateTieredChallengeQuestion(pool, questionIndex, usedEventIds = new Set(), recentLevels = [], recentTypes = []) {
    const { tier } = getTierProgress(questionIndex);

    // Beginner & Amateur: use curated question pools
    if (tier.id === 'beginner' || tier.id === 'amateur') {
        const curatedPool = tier.id === 'beginner' ? BEGINNER_QUESTIONS : AMATEUR_QUESTIONS;
        // Filter to questions whose event hasn't been used yet
        const available = curatedPool.filter(spec => !usedEventIds.has(spec.eventId));
        if (available.length > 0) {
            const spec = shuffle(available)[0];
            const q = buildCuratedQuestion(spec);
            if (q) {
                q.tier = tier;
                q.level = isLevel2Event(q.event) ? 2 : 1;
                return q;
            }
        }
        // Fallback: if all curated questions exhausted, use dynamic generation below
    }

    // Determine which pool to use based on level mixing
    const poolObj = Array.isArray(pool) ? { level1: pool, level2: [], all: pool } : pool;
    const useL2 = shouldUseLevel2(questionIndex, recentLevels);

    // God tier: chronological ordering (uses full pool)
    if (tier.id === 'god') {
        const q = generateChronologicalOrder(poolObj.all, usedEventIds);
        if (q) { q.tier = tier; q.level = 0; return q; }
        // Fallback to hardest MCQ
        const event = pickUnused(poolObj.all, usedEventIds) || poolObj.all[0];
        const fallback = generateHardMCQ(event);
        fallback.tier = tier;
        fallback.level = isLevel2Event(event) ? 2 : 1;
        return fallback;
    }

    // Pick the level-specific subpool, with fallback
    let levelPool;
    if (useL2 && poolObj.level2.length >= 4) {
        levelPool = poolObj.level2;
    } else {
        levelPool = poolObj.level1.length >= 4 ? poolObj.level1 : poolObj.all;
    }

    const type = pickTypeForTier(tier.id, recentTypes);
    const allTypes = TIER_TYPES[tier.id] || EASY_TYPES;
    const types = [type, ...shuffle(allTypes.filter(t => t !== type))];
    const tierPool = filterPoolForTier(levelPool, tier.id);
    const effectivePool = tierPool.length >= 8 ? tierPool : levelPool.length >= 4 ? levelPool : poolObj.all;

    for (const t of types) {
        const q = generateByType(t, effectivePool, usedEventIds, { tierId: tier.id });
        if (q) {
            q.tier = tier;
            q.level = isLevel2Event(q.event) ? 2 : 1;
            return q;
        }
    }

    // Fallback
    const event = pickUnused(poolObj.all, usedEventIds) || poolObj.all[0];
    const q = generateHardMCQ(event);
    q.tier = tier;
    q.level = isLevel2Event(event) ? 2 : 1;
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
