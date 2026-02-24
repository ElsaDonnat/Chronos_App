import { ALL_EVENTS } from './events';

// Score a date answer — single number input
// For range events: green if within range, otherwise score by distance to nearest edge
export function scoreDateAnswer(userYear, userEra, event) {
    const userSigned = userEra === "BCE" ? -Math.abs(userYear) : Math.abs(userYear);
    const start = event.year;
    const end = event.yearEnd; // may be null/undefined for single-date events

    // For range events, check if within range first
    if (end != null) {
        const lo = Math.min(start, end);
        const hi = Math.max(start, end);
        if (userSigned >= lo && userSigned <= hi) return "green";

        // Distance to nearest edge of range
        const diff = Math.min(Math.abs(userSigned - lo), Math.abs(userSigned - hi));
        return scoreByDiff(diff, lo);
    }

    // Single-date event — score by distance
    const diff = Math.abs(userSigned - start);
    return scoreByDiff(diff, start);
}

// Shared scoring thresholds by era
function scoreByDiff(diff, referenceYear) {
    if (referenceYear < -100000) {
        if (diff <= 500000) return "green";
        if (diff <= 2000000) return "yellow";
        return "red";
    }
    if (referenceYear < 0) {
        if (diff <= 200) return "green";
        if (diff <= 500) return "yellow";
        return "red";
    }
    if (referenceYear <= 1500) {
        if (diff <= 50) return "green";
        if (diff <= 150) return "yellow";
        return "red";
    }
    if (diff <= 10) return "green";
    if (diff <= 30) return "yellow";
    return "red";
}

// Format a year for display in MCQ options
function formatYearForMCQ(year) {
    if (year <= -1000000) {
        const mya = Math.round(Math.abs(year) / 100000) / 10;
        return `c. ${mya} million years ago`;
    }
    if (year <= -10000) {
        const kya = Math.round(Math.abs(year) / 1000);
        return `c. ${kya.toLocaleString()},000 years ago`;
    }
    if (year < 0) {
        return `${Math.abs(year)} BCE`;
    }
    return `${year} CE`;
}

// Generate plausible wrong years near a reference year
function generatePlausibleYear(correctYear) {
    const absYear = Math.abs(correctYear);

    // Choose offset based on era
    let offset;
    if (absYear > 1000000) {
        // Prehistoric — offset by millions
        const offsets = [500000, 1000000, 1500000, 2000000, 3000000];
        offset = offsets[Math.floor(Math.random() * offsets.length)];
    } else if (absYear > 10000) {
        // Deep prehistoric — offset by thousands
        const offsets = [5000, 10000, 20000, 50000];
        offset = offsets[Math.floor(Math.random() * offsets.length)];
    } else if (correctYear < 0) {
        // Ancient BCE — offset by 100-600
        offset = 100 + Math.floor(Math.random() * 500);
    } else if (correctYear < 1500) {
        // Medieval — offset by 50-300
        offset = 50 + Math.floor(Math.random() * 250);
    } else {
        // Modern — offset by 10-60
        offset = 10 + Math.floor(Math.random() * 50);
    }

    // Randomly add or subtract
    const sign = Math.random() < 0.5 ? 1 : -1;
    return correctYear + sign * offset;
}

// Generate date MCQ options: 4 options including correct answer
export function generateDateMCQOptions(correctEvent) {
    const correctYear = correctEvent.yearEnd
        ? Math.round((correctEvent.year + correctEvent.yearEnd) / 2) // midpoint for ranges
        : correctEvent.year;

    const usedYears = new Set([correctYear]);
    const options = [{ year: correctYear, label: correctEvent.date, isCorrect: true }];

    // Try to get 1-2 options from other events that are chronologically close
    const nearby = ALL_EVENTS
        .filter(e => e.id !== correctEvent.id)
        .map(e => ({ ...e, dist: Math.abs((e.yearEnd ? (e.year + e.yearEnd) / 2 : e.year) - correctYear) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 8); // pool of 8 nearby

    const shuffledNearby = nearby.sort(() => Math.random() - 0.5);
    let nearbyAdded = 0;
    for (const ne of shuffledNearby) {
        if (nearbyAdded >= 2 || options.length >= 4) break;
        const neYear = ne.yearEnd ? Math.round((ne.year + ne.yearEnd) / 2) : ne.year;
        if (usedYears.has(neYear)) continue;
        // Make sure they look different when formatted
        const neLabel = formatYearForMCQ(neYear);
        const correctLabel = formatYearForMCQ(correctYear);
        if (neLabel === correctLabel) continue;

        usedYears.add(neYear);
        options.push({ year: neYear, label: ne.date, isCorrect: false });
        nearbyAdded++;
    }

    // Fill remaining with plausible invented dates
    let attempts = 0;
    while (options.length < 4 && attempts < 20) {
        attempts++;
        const fakeYear = generatePlausibleYear(correctYear);
        if (usedYears.has(fakeYear)) continue;
        const fakeLabel = formatYearForMCQ(fakeYear);
        // Ensure unique label
        if (options.some(o => o.label === fakeLabel)) continue;
        usedYears.add(fakeYear);
        options.push({ year: fakeYear, label: fakeLabel, isCorrect: false });
    }

    // Shuffle
    return options.sort(() => Math.random() - 0.5);
}

// Generate location MCQ options
export function generateLocationOptions(correctEvent, allEvents = ALL_EVENTS) {
    const correctPlace = correctEvent.location.place;
    const options = [correctPlace];

    // Get plausible alternatives from the same region first, then others
    const sameRegion = allEvents
        .filter(e => e.id !== correctEvent.id && e.location.region === correctEvent.location.region && e.location.place !== correctPlace)
        .map(e => e.location.place);

    const otherRegion = allEvents
        .filter(e => e.id !== correctEvent.id && e.location.region !== correctEvent.location.region && e.location.place !== correctPlace)
        .map(e => e.location.place);

    // Unique places
    const uniqueSame = [...new Set(sameRegion)];
    const uniqueOther = [...new Set(otherRegion)];

    // Add 1-2 from same region, rest from other regions
    const shuffledSame = uniqueSame.sort(() => Math.random() - 0.5);
    const shuffledOther = uniqueOther.sort(() => Math.random() - 0.5);

    for (const place of shuffledSame.slice(0, 2)) {
        if (options.length < 4) options.push(place);
    }
    for (const place of shuffledOther) {
        if (options.length < 4) options.push(place);
    }

    return options.sort(() => Math.random() - 0.5);
}

// Generate "what happened" MCQ options
export function generateWhatOptions(correctEvent, lessonEventIds, allEvents = ALL_EVENTS) {
    const options = [{ id: correctEvent.id, title: correctEvent.title, description: correctEvent.description }];

    // Get distractors from nearby lessons first
    const lessonEvents = allEvents.filter(e => lessonEventIds.includes(e.id) && e.id !== correctEvent.id);
    const otherEvents = allEvents.filter(e => !lessonEventIds.includes(e.id) && e.id !== correctEvent.id);

    const shuffledLesson = lessonEvents.sort(() => Math.random() - 0.5);
    const shuffledOther = otherEvents.sort(() => Math.random() - 0.5);

    for (const e of shuffledLesson) {
        if (options.length < 4) options.push({ id: e.id, title: e.title, description: e.description });
    }
    for (const e of shuffledOther) {
        if (options.length < 4) options.push({ id: e.id, title: e.title, description: e.description });
    }

    return options.sort(() => Math.random() - 0.5);
}

// Calculate XP for a session
export function calculateXP(results) {
    let xp = 0;
    for (const r of results) {
        if (r.firstScore === "green") xp += 10;
        else if (r.firstScore === "yellow") xp += 5;
        else if (r.firstScore === "red" && r.retryScore && r.retryScore !== "red") xp += 5;
    }
    return xp;
}
