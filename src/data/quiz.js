import { ALL_EVENTS } from './events';

// Score a date answer
export function scoreDateAnswer(userYear, userEra, event) {
    const userSigned = userEra === "BCE" ? -Math.abs(userYear) : Math.abs(userYear);
    const correctYear = event.year;
    const diff = Math.abs(userSigned - correctYear);

    if (correctYear < -100000) {
        if (diff <= 500000) return "green";
        if (diff <= 2000000) return "yellow";
        return "red";
    }
    if (correctYear < 0) {
        if (diff <= 200) return "green";
        if (diff <= 500) return "yellow";
        return "red";
    }
    if (correctYear <= 1500) {
        if (diff <= 50) return "green";
        if (diff <= 150) return "yellow";
        return "red";
    }
    if (diff <= 10) return "green";
    if (diff <= 30) return "yellow";
    return "red";
}

// Score a date range answer
export function scoreDateRangeAnswer(userStart, userStartEra, userEnd, userEndEra, event) {
    const startScore = scoreDateAnswer(userStart, userStartEra, { ...event, year: event.year });
    const endScore = scoreDateAnswer(userEnd, userEndEra, { ...event, year: event.yearEnd });

    // Overall is the worse of the two
    const order = { green: 0, yellow: 1, red: 2 };
    return order[startScore] >= order[endScore] ? startScore : endScore;
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
