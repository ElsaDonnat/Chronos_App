/**
 * Shared time slider utilities for piecewise-linear era mapping.
 * Used by MapView and ConcurrentView — no Chronos-specific imports.
 */

export const SLIDER_MAX = 1000;

export const ERA_SLIDER_SEGMENTS = [
    { id: 'prehistory', label: 'Prehistory', start: -7000000, end: -3200, sliderStart: 0, sliderEnd: 200 },
    { id: 'ancient', label: 'Ancient', start: -3200, end: 476, sliderStart: 200, sliderEnd: 400 },
    { id: 'medieval', label: 'Medieval', start: 476, end: 1500, sliderStart: 400, sliderEnd: 600 },
    { id: 'earlymodern', label: 'E. Modern', start: 1500, end: 1789, sliderStart: 600, sliderEnd: 800 },
    { id: 'modern', label: 'Modern', start: 1789, end: 2030, sliderStart: 800, sliderEnd: 1000 },
];

/** Convert a slider value (0–1000) to a calendar year via piecewise-linear mapping. */
export function sliderToYear(value) {
    for (const seg of ERA_SLIDER_SEGMENTS) {
        if (value >= seg.sliderStart && value <= seg.sliderEnd) {
            const frac = (value - seg.sliderStart) / (seg.sliderEnd - seg.sliderStart);
            return seg.start + frac * (seg.end - seg.start);
        }
    }
    return ERA_SLIDER_SEGMENTS[ERA_SLIDER_SEGMENTS.length - 1].end;
}

/** Convert a calendar year to a slider value (0–1000). */
export function yearToSlider(year) {
    for (const seg of ERA_SLIDER_SEGMENTS) {
        if (year >= seg.start && year <= seg.end) {
            const frac = (year - seg.start) / (seg.end - seg.start);
            return Math.round(seg.sliderStart + frac * (seg.sliderEnd - seg.sliderStart));
        }
    }
    return year < ERA_SLIDER_SEGMENTS[0].start ? 0 : SLIDER_MAX;
}

/** Era-aware half-window size for time-based opacity calculations. */
export function getTimeWindow(year) {
    for (const seg of ERA_SLIDER_SEGMENTS) {
        if (year >= seg.start && year <= seg.end) {
            const span = seg.end - seg.start;
            if (seg.id === 'prehistory') return span * 0.25;
            if (seg.id === 'ancient') return span * 0.12;
            return span * 0.15;
        }
    }
    return 100;
}

/** Format a year for slider display (e.g. "3.5M BCE", "12K BCE", "1,776 CE"). */
export function formatSliderYear(year) {
    const abs = Math.abs(year);
    const suffix = year < 0 ? 'BCE' : 'CE';
    if (abs >= 1000000) {
        const m = abs / 1000000;
        return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M ${suffix}`;
    }
    if (abs >= 10000) return `${Math.round(abs / 1000)}K ${suffix}`;
    return `${Math.round(abs).toLocaleString()} ${suffix}`;
}

/**
 * Compute opacity for an event based on temporal proximity to the slider year.
 * Events within halfWindow are fully visible; events in the fade zone (1–2× halfWindow)
 * transition from full to zero. Supports range events via yearEnd.
 */
export function getEventTimeOpacity(event, sliderYear, halfWindow) {
    const eventStart = event.year;
    const eventEnd = event.yearEnd || event.year;
    if (sliderYear >= eventStart && sliderYear <= eventEnd) return 1;
    const dist = sliderYear < eventStart
        ? eventStart - sliderYear
        : sliderYear - eventEnd;
    if (dist <= halfWindow) return 1;
    if (dist <= halfWindow * 2) return 1 - (dist - halfWindow) / halfWindow;
    return 0;
}

/** Return the era segment id for a given slider value. */
export function getActiveEraId(sliderValue) {
    for (const seg of ERA_SLIDER_SEGMENTS) {
        if (sliderValue >= seg.sliderStart && sliderValue < seg.sliderEnd) return seg.id;
    }
    return 'modern';
}

/** Return the era key for a given calendar year. */
export function getEraForYear(year) {
    if (year == null) return 'modern';
    for (const seg of ERA_SLIDER_SEGMENTS) {
        if (year >= seg.start && year <= seg.end) return seg.id;
    }
    return year < ERA_SLIDER_SEGMENTS[0].start ? 'prehistory' : 'modern';
}
