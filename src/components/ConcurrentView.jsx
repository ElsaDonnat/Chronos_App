import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { CATEGORY_CONFIG as DEFAULT_CATEGORY_CONFIG } from '../data/events';
import { MasteryDots } from './shared';
import { SLIDER_MAX, ERA_SLIDER_SEGMENTS, sliderToYear, yearToSlider, getTimeWindow, formatSliderYear } from '../utils/timeSlider';
import * as feedback from '../services/feedback';

// ConcurrentView-specific opacity: events in the fade zone dim to 0.4–0.7 instead of fully disappearing,
// since card visibility in swim lanes benefits from softer transitions than map pins.
function getEventOpacity(event, sliderYear, halfWindow) {
    const eventStart = event.year;
    const eventEnd = event.yearEnd || event.year;
    if (sliderYear >= eventStart && sliderYear <= eventEnd) return 1;
    const dist = sliderYear < eventStart
        ? eventStart - sliderYear
        : sliderYear - eventEnd;
    if (dist <= halfWindow) return 1;
    if (dist <= halfWindow * 2) return 0.7 - 0.3 * ((dist - halfWindow) / halfWindow);
    return 0;
}

// Continent grouping for display
const CONTINENT_GROUPS = [
    { id: 'europe', label: 'Europe', regions: ['Europe'] },
    { id: 'mideast-africa', label: 'Middle East & Africa', regions: ['Middle East', 'North Africa', 'West Africa', 'East Africa', 'Southern Africa'] },
    { id: 'asia', label: 'Asia & Oceania', regions: ['South Asia', 'East Asia', 'Southeast Asia', 'Central Asia', 'Oceania'] },
    { id: 'americas', label: 'Americas', regions: ['North America', 'Central America', 'South America'] },
];

const CONTINENT_COLORS = {
    'europe': 'var(--color-region-europe-vibrant, #5B7BA5)',
    'mideast-africa': 'var(--color-region-middle-east-vibrant, #C17D4A)',
    'asia': 'var(--color-region-east-asia-vibrant, #A85B7B)',
    'americas': 'var(--color-region-north-america-vibrant, #7BA55B)',
};

export default function ConcurrentView({ events, learnedIds, eventMastery, categoryConfig = DEFAULT_CATEGORY_CONFIG }) {
    // Only show learned events
    const learnedEvents = useMemo(() =>
        events.filter(e => learnedIds.has(e.id)),
        [events, learnedIds]
    );

    // Count learned events per era (for indicators + smart default)
    const eraEventCounts = useMemo(() => {
        const counts = {};
        for (const seg of ERA_SLIDER_SEGMENTS) counts[seg.id] = 0;
        for (const e of learnedEvents) {
            for (const seg of ERA_SLIDER_SEGMENTS) {
                if (e.year >= seg.start && e.year < seg.end) { counts[seg.id]++; break; }
            }
        }
        return counts;
    }, [learnedEvents]);

    // Smart default: start at the era with the most learned events
    const smartDefault = useMemo(() => {
        if (learnedEvents.length === 0) return 500; // fallback to medieval
        let bestSeg = ERA_SLIDER_SEGMENTS[2]; // medieval fallback
        let bestCount = 0;
        for (const seg of ERA_SLIDER_SEGMENTS) {
            if (eraEventCounts[seg.id] > bestCount) {
                bestCount = eraEventCounts[seg.id];
                bestSeg = seg;
            }
        }
        // Snap to median learned event in that era
        const eraEvents = learnedEvents
            .filter(e => e.year >= bestSeg.start && e.year < bestSeg.end)
            .sort((a, b) => a.year - b.year);
        if (eraEvents.length > 0) {
            return yearToSlider(eraEvents[Math.floor(eraEvents.length / 2)].year);
        }
        return Math.round((bestSeg.sliderStart + bestSeg.sliderEnd) / 2);
    }, [learnedEvents, eraEventCounts]);

    const [sliderValue, setSliderValue] = useState(smartDefault);
    const sliderYear = useMemo(() => sliderToYear(sliderValue), [sliderValue]);
    const halfWindow = useMemo(() => getTimeWindow(sliderYear), [sliderYear]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const containerRef = useRef(null);

    // Group events by continent/region and compute opacity
    const groupedData = useMemo(() => {
        const result = [];

        for (const group of CONTINENT_GROUPS) {
            const regionBuckets = [];

            for (const regionName of group.regions) {
                const regionEvents = learnedEvents
                    .filter(e => e.location.region === regionName)
                    .map(e => ({
                        event: e,
                        opacity: getEventOpacity(e, sliderYear, halfWindow),
                    }))
                    .filter(e => e.opacity > 0)
                    .sort((a, b) => {
                        // Sort by proximity to slider year
                        const distA = Math.abs(a.event.year - sliderYear);
                        const distB = Math.abs(b.event.year - sliderYear);
                        return distA - distB;
                    });

                if (regionEvents.length > 0) {
                    regionBuckets.push({ region: regionName, events: regionEvents });
                }
            }

            if (regionBuckets.length > 0) {
                result.push({ ...group, buckets: regionBuckets, totalEvents: regionBuckets.reduce((s, b) => s + b.events.length, 0) });
            }
        }

        return result;
    }, [learnedEvents, sliderYear, halfWindow]);

    // Count total visible events
    const totalVisible = groupedData.reduce((s, g) => s + g.totalEvents, 0);

    // Era quick-jump: snap to median learned event in each era
    const handleEraJump = useCallback((segId) => {
        const seg = ERA_SLIDER_SEGMENTS.find(s => s.id === segId);
        if (!seg) return;
        const eraEvents = learnedEvents.filter(e => e.year >= seg.start && e.year < seg.end);
        if (eraEvents.length > 0) {
            eraEvents.sort((a, b) => a.year - b.year);
            const medianYear = eraEvents[Math.floor(eraEvents.length / 2)].year;
            setSliderValue(yearToSlider(medianYear));
        } else {
            setSliderValue(Math.round((seg.sliderStart + seg.sliderEnd) / 2));
        }
        feedback.tap();
    }, [learnedEvents]);

    // Close popup on outside tap
    useEffect(() => {
        if (!selectedEvent) return;
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.querySelector(`[data-sync-event="${selectedEvent}"]`)?.contains(e.target)) {
                setSelectedEvent(null);
            }
        };
        document.addEventListener('pointerdown', handler);
        return () => document.removeEventListener('pointerdown', handler);
    }, [selectedEvent]);

    return (
        <div ref={containerRef}>
            {/* Time Controls */}
            <div className="rounded-2xl p-3 mb-4" style={{
                backgroundColor: 'rgba(var(--color-ink-rgb), 0.03)',
                border: '1px solid rgba(var(--color-ink-rgb), 0.06)',
            }}>
                {/* Era quick-jump buttons */}
                <div className="flex gap-1.5 mb-3">
                    {ERA_SLIDER_SEGMENTS.map(seg => {
                        const isActive = sliderValue >= seg.sliderStart && sliderValue < seg.sliderEnd;
                        const count = eraEventCounts[seg.id] || 0;
                        return (
                            <button
                                key={seg.id}
                                onClick={() => handleEraJump(seg.id)}
                                className="flex-1 px-0.5 py-1.5 rounded-lg text-[8px] font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap leading-none"
                                style={{
                                    backgroundColor: isActive ? 'var(--color-burgundy)' : 'rgba(var(--color-ink-rgb), 0.05)',
                                    color: isActive ? 'white' : 'var(--color-ink-muted)',
                                }}
                            >
                                <span>{seg.label}</span>
                                {count > 0 && (
                                    <span className="text-[8px] font-bold" style={{
                                        opacity: isActive ? 0.85 : 0.5,
                                    }}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Slider */}
                <input
                    type="range"
                    min={0}
                    max={SLIDER_MAX}
                    value={sliderValue}
                    onChange={e => setSliderValue(Number(e.target.value))}
                    className="time-slider-input w-full"
                />

                {/* Year display + event count */}
                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                        {formatSliderYear(sliderYear)}
                    </span>
                    <span className="text-[11px] font-medium" style={{ color: 'var(--color-ink-muted)' }}>
                        {totalVisible} event{totalVisible !== 1 ? 's' : ''} nearby
                    </span>
                </div>
            </div>

            {/* Empty state — only show when user has some learned events but none near current time.
               When learnedEvents is empty, TimelinePage shows its own mascot empty state above. */}
            {totalVisible === 0 && learnedEvents.length > 0 && (
                <div className="text-center py-10 animate-fade-in">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="1.5" className="mx-auto mb-3">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="6" x2="12" y2="12" />
                        <line x1="12" y1="12" x2="16" y2="14" />
                    </svg>
                    <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-muted)' }}>
                        No events discovered near this time
                    </p>
                    {/* Quick-jump to eras that have events */}
                    <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                        {ERA_SLIDER_SEGMENTS.filter(seg => eraEventCounts[seg.id] > 0).map(seg => (
                            <button
                                key={seg.id}
                                onClick={() => { handleEraJump(seg.id); feedback.tap(); }}
                                className="px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer transition-colors duration-200"
                                style={{
                                    backgroundColor: 'rgba(var(--color-ink-rgb), 0.06)',
                                    color: 'var(--color-burgundy)',
                                }}
                            >
                                Jump to {seg.label} ({eraEventCounts[seg.id]})
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Swim Lanes */}
            <div className="space-y-3">
                {groupedData.map(group => (
                    <div key={group.id} className="animate-fade-in">
                        {/* Continent header */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: CONTINENT_COLORS[group.id] }} />
                            <span className="text-[11px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-ink-muted)' }}>
                                {group.label}
                            </span>
                            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(var(--color-ink-rgb), 0.06)' }} />
                            <span className="text-[10px] font-medium" style={{ color: 'var(--color-ink-faint)' }}>
                                {group.totalEvents}
                            </span>
                        </div>

                        {/* Region buckets */}
                        <div className="space-y-1.5 pl-3">
                            {group.buckets.map(bucket => (
                                <div key={bucket.region}>
                                    {/* Show sub-region label if continent has multiple active regions */}
                                    {group.buckets.length > 1 && (
                                        <span className="text-[10px] font-semibold block mb-1" style={{ color: 'var(--color-ink-faint)' }}>
                                            {bucket.region}
                                        </span>
                                    )}
                                    <div className="flex flex-wrap gap-1.5">
                                        {bucket.events.map(({ event, opacity }) => {
                                            const catConfig = categoryConfig[event.category];
                                            const mastery = eventMastery[event.id];
                                            const isSelected = selectedEvent === event.id;

                                            return (
                                                <div
                                                    key={event.id}
                                                    data-sync-event={event.id}
                                                    onClick={() => {
                                                        setSelectedEvent(isSelected ? null : event.id);
                                                        feedback.tap();
                                                    }}
                                                    className="relative rounded-xl px-2.5 py-2 cursor-pointer transition-all duration-300"
                                                    style={{
                                                        opacity,
                                                        backgroundColor: isSelected
                                                            ? `${catConfig?.color}18`
                                                            : 'var(--color-card)',
                                                        border: isSelected
                                                            ? `1.5px solid ${catConfig?.color || 'var(--color-ink-faint)'}`
                                                            : '1px solid rgba(var(--color-ink-rgb), 0.07)',
                                                        boxShadow: isSelected
                                                            ? `0 2px 8px ${catConfig?.color}20`
                                                            : 'var(--shadow-card)',
                                                        maxWidth: '100%',
                                                    }}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: catConfig?.color || '#999' }} />
                                                        <span className="text-xs font-semibold truncate" style={{ color: 'var(--color-ink)', maxWidth: '200px' }}>
                                                            {event.title}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5 pl-3.5">
                                                        <span className="text-[10px] font-medium" style={{ color: 'var(--color-ink-faint)' }}>
                                                            {event.date}
                                                        </span>
                                                        {mastery && <MasteryDots mastery={mastery} size="xs" />}
                                                    </div>

                                                    {/* Expanded detail */}
                                                    {isSelected && (
                                                        <div className="mt-2 pt-2 animate-fade-in" style={{ borderTop: `1px solid rgba(var(--color-ink-rgb), 0.06)` }}>
                                                            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}>
                                                                {event.quizDescription || event.description}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2">
                                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                                                </svg>
                                                                <span className="text-[10px]" style={{ color: 'var(--color-ink-faint)' }}>
                                                                    {event.location.place}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
