import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_EVENTS, CORE_EVENT_COUNT, CATEGORY_CONFIG, IMPORTANCE_CONFIG, IMPORTANCE_ORDER, ERA_RANGES, ERA_BOUNDARY_EVENTS, getEraForYear, getEventById, isDiHEvent } from '../data/events';
import { Card, CategoryTag, ImportanceTag, DiHBadge, MasteryDots, Divider, ExpandableText, EventConnections, TabSelector } from '../components/shared';
import MapView from '../components/MapView';
import ConcurrentView from '../components/ConcurrentView';
import { SUB_REGIONS } from '../data/mapPaths';
import Mascot from '../components/Mascot';

// SVG era icons — replace emoji to avoid rendering issues on Android
const EraIcon = ({ type, size = 24 }) => {
    const colors = { prehistory: '#9E4A4A', ancient: '#7A6B50', medieval: '#B06A30', earlymodern: '#9A8528', modern: '#B09035' };
    const c = colors[type] || '#666';
    const s = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: c, strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' };
    const icons = {
        prehistory: <svg {...s}><path d="M5 10c0-1.5 1-2.5 2-3 .5-1.5-.5-3-2-3.5S2 4 2.5 5.5c-1 .5-1.5 2-.5 3s2.5 1 3 1.5z" fill={c} opacity="0.15" /><path d="M19 14c0 1.5-1 2.5-2 3-.5 1.5.5 3 2 3.5s3-.5 2.5-2c1-.5 1.5-2 .5-3s-2.5-1-3-1.5z" fill={c} opacity="0.15" /><line x1="7" y1="9" x2="17" y2="15" /></svg>,
        ancient: <svg {...s}><path d="M3 21h18M5 21V7l7-4 7 4v14" fill={c} opacity="0.1" /><line x1="9" y1="21" x2="9" y2="10" /><line x1="15" y1="21" x2="15" y2="10" /><path d="M5 7l7-4 7 4" /><line x1="3" y1="21" x2="21" y2="21" /></svg>,
        medieval: <svg {...s}><path d="M5 3l14 14M9.5 7.5L5 3M19 3L5 17" /><path d="M14.5 7.5L19 3" /><path d="M5 17l2 2 2-2" /><path d="M19 17l-2 2-2-2" /></svg>,
        earlymodern: <svg {...s}><circle cx="12" cy="12" r="9" fill={c} opacity="0.08" /><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill={c} opacity="0.2" stroke={c} /><line x1="12" y1="3" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="21" /><line x1="3" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="21" y2="12" /></svg>,
        modern: <svg {...s}><circle cx="12" cy="12" r="9" fill={c} opacity="0.08" /><ellipse cx="12" cy="12" rx="4" ry="9" /><line x1="3" y1="12" x2="21" y2="12" /><path d="M4.5 7.5h15M4.5 16.5h15" /></svg>,
    };
    return icons[type] || null;
};

export default function TimelinePage() {
    const { state } = useApp();
    const [selectedImportance, setSelectedImportance] = useState(() => localStorage.getItem('chronos-tl-importance') || 'all');
    const [selectedCategory, setSelectedCategory] = useState(() => localStorage.getItem('chronos-tl-cat') || 'all');
    const [hideUnknown, setHideUnknown] = useState(() => localStorage.getItem('chronos-tl-hide') === 'true');
    const [expandedId, setExpandedId] = useState(null);
    const [expandedEraId, setExpandedEraId] = useState(null);
    const [viewMode, setViewMode] = useState(() => localStorage.getItem('chronos-tl-view') || 'list');
    const [selectedRegion, setSelectedRegion] = useState(() => localStorage.getItem('chronos-tl-region') || null);
    const expandedRef = useCallback(node => {
        if (node) {
            setTimeout(() => node.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
        }
    }, []);

    const acquiredDiHIds = useMemo(() => new Set(state.dailyQuiz?.acquiredEventIds || []), [state.dailyQuiz?.acquiredEventIds]);

    const sortedEvents = useMemo(() => {
        // Filter out DiH events that haven't been acquired yet
        return [...ALL_EVENTS]
            .filter(event => !isDiHEvent(event) || acquiredDiHIds.has(event.id))
            .sort((a, b) => a.year - b.year);
    }, [acquiredDiHIds]);

    const learnedIds = new Set(state.seenEvents);

    const filteredEvents = useMemo(() => {
        return sortedEvents.filter(event => {
            if (selectedCategory === 'daily') return isDiHEvent(event);
            if (selectedImportance !== 'all' && event.importance !== selectedImportance) return false;
            if (selectedCategory !== 'all' && event.category !== selectedCategory) return false;
            return true;
        });
    }, [sortedEvents, selectedImportance, selectedCategory]);

    // Apply region filter for list view (MapView handles its own filtering)
    const listFilteredEvents = useMemo(() => {
        if (!selectedRegion) return filteredEvents;
        return filteredEvents.filter(e => e.location.region === selectedRegion);
    }, [filteredEvents, selectedRegion]);

    // Sub-regions that have events (for dropdown options)
    const regionsWithEvents = useMemo(() => {
        const counts = {};
        for (const e of sortedEvents) {
            const r = e.location.region;
            counts[r] = (counts[r] || 0) + 1;
        }
        return SUB_REGIONS.filter(r => counts[r] > 0);
    }, [sortedEvents]);

    const lesson0Complete = !!state.completedLessons['lesson-0'];

    // Persist filter choices
    const updateImportance = (v) => { setSelectedImportance(v); localStorage.setItem('chronos-tl-importance', v); };
    const updateCategory = (v) => { setSelectedCategory(v); localStorage.setItem('chronos-tl-cat', v); };
    const toggleHideUnknown = () => { setHideUnknown(h => { const next = !h; localStorage.setItem('chronos-tl-hide', String(next)); return next; }); };
    const updateViewMode = (v) => { setViewMode(v); localStorage.setItem('chronos-tl-view', v); };
    const updateRegion = (v) => {
        const val = (!v || v === 'all') ? null : v;
        setSelectedRegion(val);
        if (val) localStorage.setItem('chronos-tl-region', val);
        else localStorage.removeItem('chronos-tl-region');
    };

    const eraDetails = {
        prehistory: { iconType: 'prehistory', title: 'Prehistory', subtitle: 'c. 7 million years ago – c. 3200 BCE', description: 'The longest chapter in human history — from the first split with our ape ancestors through mastering fire, developing language, migrating across the globe, and eventually settling into farming communities.', color: '#9E4A4A' },
        ancient: { iconType: 'ancient', title: 'The Ancient World', subtitle: 'c. 3200 BCE – 500 CE', description: 'Writing is invented, cities rise, empires clash. From Sumer to Rome, humanity builds the foundations of law, philosophy, religion, and governance.', color: '#7A6B50' },
        medieval: { iconType: 'medieval', title: 'The Medieval World', subtitle: '500 – 1500 CE', description: 'Empires fragment and reform. Faiths spread across continents, scholars preserve and advance knowledge, and horseback conquerors redraw the map of Eurasia.', color: '#B06A30' },
        earlymodern: { iconType: 'earlymodern', title: 'The Early Modern Period', subtitle: '1500 – 1800 CE', description: 'Print breaks the monopoly on knowledge, ships connect every continent, and thinkers challenge the divine right of kings.', color: '#9A8528' },
        modern: { iconType: 'modern', title: 'The Modern World', subtitle: '1800 – Present', description: 'Industry, ideology, and information transform human life at accelerating speed. Two world wars reshape the global order, and digital networks connect billions.', color: '#B09035' },
    };

    const getEraColor = (eraId) => {
        const colors = {
            prehistory: 'rgba(158, 74, 74, 0.06)',
            ancient: 'rgba(122, 107, 80, 0.06)',
            medieval: 'rgba(176, 106, 48, 0.06)',
            earlymodern: 'rgba(154, 133, 40, 0.06)',
            modern: 'rgba(176, 144, 53, 0.06)',
        };
        return colors[eraId] || 'transparent';
    };

    const filterBar = (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <FilterDropdown
                value={selectedImportance}
                onChange={updateImportance}
                options={[
                    { value: 'all', label: 'All' },
                    ...IMPORTANCE_ORDER.map(key => ({
                        value: key, label: IMPORTANCE_CONFIG[key].label, dotColor: IMPORTANCE_CONFIG[key].color,
                    })),
                ]}
            />
            <FilterDropdown
                value={selectedCategory}
                onChange={updateCategory}
                options={[
                    { value: 'all', label: 'All Types' },
                    ...Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
                        value: key, label: config.label, dotColor: config.color,
                    })),
                    ...(acquiredDiHIds.size > 0 ? [{ value: 'daily', label: 'Day in History', dotColor: '#E6A817' }] : []),
                ]}
            />
            <FilterDropdown
                value={selectedRegion || 'all'}
                onChange={updateRegion}
                options={[
                    { value: 'all', label: 'Loca' },
                    ...regionsWithEvents.map(r => ({ value: r, label: r })),
                ]}
            />
            <button
                onClick={toggleHideUnknown}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0"
                style={{
                    backgroundColor: hideUnknown ? 'var(--color-burgundy)' : 'rgba(var(--color-ink-rgb), 0.04)',
                    color: hideUnknown ? 'white' : 'var(--color-ink-muted)',
                    border: hideUnknown ? 'none' : '1px solid rgba(var(--color-ink-rgb), 0.08)',
                }}
                title={hideUnknown ? 'Showing only discovered' : 'Show all events'}
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {hideUnknown ? (
                        <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                    ) : (
                        <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </>
                    )}
                </svg>
                <span className="hidden min-[360px]:inline">{hideUnknown ? 'Hidden' : 'All'}</span>
            </button>
        </div>
    );

    // ─── Map view: compact layout, map takes full available height ───
    if (viewMode === 'map') {
        return (
            <div className="py-2 flex flex-col" style={{ minHeight: 'calc(100vh - 120px)' }}>
                {/* Compact tab bar only */}
                <div className="mb-2 flex-shrink-0">
                    <TabSelector
                        tabs={[{ id: 'list', label: 'Timeline' }, { id: 'map', label: 'Map' }, { id: 'sync', label: 'Sync' }]}
                        activeTab={viewMode}
                        onChange={updateViewMode}
                    />
                </div>

                {/* Map fills remaining space */}
                <div className="flex-1 min-h-0">
                    <MapView
                        events={filteredEvents}
                        learnedIds={learnedIds}
                        hideUnknown={hideUnknown}
                        eventMastery={state.eventMastery}
                        selectedRegion={selectedRegion}
                        onRegionSelect={updateRegion}
                        filterBar={filterBar}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                    Timeline
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--color-ink-muted)' }}>
                    Discovered {[...learnedIds].filter(id => !id.startsWith('dih-')).length} out of {CORE_EVENT_COUNT} events{acquiredDiHIds.size > 0 ? ` · ${acquiredDiHIds.size} bonus` : ''}
                </p>
            </div>

            {learnedIds.size === 0 && (
                <div className="text-center py-12 animate-fade-in">
                    <Mascot mood="happy" size={64} />
                    <p className="text-base font-semibold mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-secondary)' }}>
                        Your timeline begins with your first lesson
                    </p>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-ink-muted)' }}>
                        Complete lessons to discover events and fill your timeline
                    </p>
                </div>
            )}

            {/* View toggle */}
            <div className="mb-4">
                <TabSelector
                    tabs={[{ id: 'list', label: 'Timeline' }, { id: 'map', label: 'Map' }, { id: 'sync', label: 'Sync' }]}
                    activeTab={viewMode}
                    onChange={updateViewMode}
                />
            </div>

            {/* Compact filter row — scrollable on narrow screens */}
            <div className="mb-6">
                {filterBar}
            </div>

            {viewMode === 'sync' ? (
                <ConcurrentView
                    events={sortedEvents}
                    learnedIds={learnedIds}
                    eventMastery={state.eventMastery}
                />
            ) : listFilteredEvents.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                    <Mascot mood="thinking" size={60} />
                    <p className="text-sm mt-3" style={{ color: 'var(--color-ink-muted)', fontFamily: 'var(--font-serif)' }}>
                        No events match your filters
                    </p>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-7 top-0 bottom-0 w-0.5 rounded-full" style={{ backgroundColor: 'var(--color-bronze-light)', opacity: 0.4 }} />

                    {listFilteredEvents.map((event, index) => {
                        const isLearned = learnedIds.has(event.id);
                        const mastery = state.eventMastery[event.id];
                        const isExpanded = expandedId === event.id;
                        const era = getEraForYear(event.year);
                        const prevEvent = listFilteredEvents[index - 1];
                        const showEraLabel = !prevEvent || getEraForYear(prevEvent.year).id !== era?.id;
                        const catConfig = CATEGORY_CONFIG[event.category];

                        return (
                            <div key={event.id}>
                                {showEraLabel && era && (() => {
                                    const detail = eraDetails[era.id];
                                    const isEraExpanded = expandedEraId === era.id;
                                    const boundary = ERA_BOUNDARY_EVENTS[era.id];
                                    const startEvent = boundary?.startEventId ? getEventById(boundary.startEventId) : null;
                                    const endEvent = boundary?.endEventId ? getEventById(boundary.endEventId) : null;

                                    return (
                                        <div
                                            className="relative pl-16 py-3 mb-2 mt-3 rounded-lg cursor-pointer transition-all duration-200"
                                            style={{ backgroundColor: getEraColor(era.id) }}
                                            onClick={() => lesson0Complete && setExpandedEraId(isEraExpanded ? null : era.id)}
                                        >
                                            {lesson0Complete ? (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        {detail?.iconType && <EraIcon type={detail.iconType} size={18} />}
                                                        <div className="flex-1">
                                                            <span className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--color-ink-muted)' }}>
                                                                {era.label}
                                                            </span>
                                                            <p className="text-[10px]" style={{ color: 'var(--color-ink-faint)' }}>
                                                                {detail?.subtitle || ''}
                                                            </p>
                                                        </div>
                                                        <svg
                                                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2" strokeLinecap="round"
                                                            className="mr-3 transition-transform duration-200"
                                                            style={{ transform: isEraExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                                        >
                                                            <polyline points="6 9 12 15 18 9" />
                                                        </svg>
                                                    </div>
                                                    {isEraExpanded && detail && (
                                                        <div className="mt-3 animate-fade-in" onClick={e => e.stopPropagation()}>
                                                            <Card style={{ borderLeft: `3px solid ${detail.color}` }}>
                                                                <h3 className="text-base font-bold text-center" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                                                    {detail.title}
                                                                </h3>
                                                                <p className="text-xs font-semibold text-center mb-2" style={{ color: detail.color }}>
                                                                    {detail.subtitle}
                                                                </p>
                                                                <Divider />
                                                                <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--color-ink-secondary)' }}>
                                                                    {detail.description}
                                                                </p>
                                                                <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}>
                                                                    <p className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                                                                        Key Transitions
                                                                    </p>
                                                                    {startEvent && (
                                                                        <div className="flex items-start gap-2 text-xs py-1">
                                                                            <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }}>▶</span>
                                                                            <div>
                                                                                <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>Begins with: </span>
                                                                                <span style={{ color: 'var(--color-ink-secondary)' }}>{startEvent.title}</span>
                                                                                <span className="ml-1 font-medium" style={{ color: 'var(--color-burgundy)' }}>({startEvent.date})</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {endEvent && (
                                                                        <div className="flex items-start gap-2 text-xs py-1">
                                                                            <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-error)' }}>■</span>
                                                                            <div>
                                                                                <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>Ends with: </span>
                                                                                <span style={{ color: 'var(--color-ink-secondary)' }}>{endEvent.title}</span>
                                                                                <span className="ml-1 font-medium" style={{ color: 'var(--color-burgundy)' }}>({endEvent.date})</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {!endEvent && (
                                                                        <div className="flex items-start gap-2 text-xs py-1">
                                                                            <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-ink-faint)' }}>■</span>
                                                                            <span className="italic" style={{ color: 'var(--color-ink-faint)' }}>Ongoing — the era we live in</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Card>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-ink-faint)' }}>
                                                    {era.label}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Hide unknown event cards but keep era headers */}
                                {hideUnknown && !isLearned ? null : <div
                                    data-event-id={event.id}
                                    className="timeline-event-card relative pl-16 py-3 animate-fade-in cursor-pointer rounded-lg transition-all duration-200"
                                    style={{ animationDelay: `${Math.min(index * 30, 500)}ms`, animationFillMode: 'backwards' }}
                                    onClick={() => isLearned && setExpandedId(isExpanded ? null : event.id)}
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-[20px] top-5 z-10">
                                        {isLearned ? (
                                            <div className="w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center"
                                                style={{
                                                    borderColor: isDiHEvent(event) ? '#E6A817' : (catConfig?.color || '#999'),
                                                    backgroundColor: 'var(--color-card)',
                                                }}>
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isDiHEvent(event) ? '#E6A817' : (catConfig?.color || '#999') }} />
                                            </div>
                                        ) : (
                                            <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: 'rgba(var(--color-ink-rgb), 0.08)' }}>
                                                <span className="text-[8px] font-bold" style={{ color: 'var(--color-ink-faint)' }}>?</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Duration bar for range events */}
                                    {isLearned && event.yearEnd && (
                                        <div className="absolute left-[28px] top-[26px] w-[2px] rounded-full"
                                            style={{
                                                backgroundColor: catConfig?.color || '#999',
                                                opacity: 0.3,
                                                height: '20px'
                                            }} />
                                    )}

                                    {isLearned ? (
                                        <div>
                                            <div className="flex items-baseline gap-3 flex-wrap">
                                                <h3 className="text-base font-semibold leading-tight" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                                    {event.title}
                                                </h3>
                                                <p className="text-xs font-medium" style={{ color: 'var(--color-ink-faint)' }}>
                                                    {event.date}
                                                </p>
                                                {mastery && <MasteryDots mastery={mastery} />}
                                            </div>

                                            {isExpanded && (
                                                <div ref={expandedRef} className="mt-4 animate-fade-in -ml-16">
                                                    <Card style={{ borderLeft: `3px solid ${isDiHEvent(event) ? '#E6A817' : (catConfig?.color || '#999')}` }}>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <CategoryTag category={event.category} />
                                                                <ImportanceTag importance={event.importance} />
                                                                {isDiHEvent(event) && <DiHBadge />}
                                                            </div>
                                                            <span className="text-sm font-semibold" style={{ color: 'var(--color-burgundy)' }}>
                                                                {event.date}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                                                            {event.title}
                                                        </h3>
                                                        <ExpandableText lines={3} className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-secondary)' }}
                                                            footerLeft={
                                                                <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                                                    </svg>
                                                                    <span className="truncate">{event.location.place}</span>
                                                                </div>
                                                            }
                                                        >
                                                            {event.keywords && <><strong style={{ color: 'var(--color-ink)' }}>{event.keywords}</strong>{' '}</>}{event.description}
                                                        </ExpandableText>
                                                        <EventConnections
                                                            eventId={event.id}
                                                            seenEventIds={learnedIds}
                                                            onEventClick={(targetId) => {
                                                                setExpandedId(targetId);
                                                                setTimeout(() => {
                                                                    const el = document.querySelector(`[data-event-id="${targetId}"]`);
                                                                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                                }, 100);
                                                            }}
                                                        />
                                                    </Card>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-[11px]" style={{ color: 'var(--color-ink-faint)' }}>
                                                {event.year < -100000 ? 'Prehistoric' : event.year < 0 ? 'Ancient' : event.year < 500 ? 'Classical' : event.year < 1500 ? 'Medieval' : 'Modern'}
                                            </p>
                                            <p className="text-sm italic" style={{ color: 'var(--color-ink-faint)' }}>
                                                Undiscovered event
                                            </p>
                                        </div>
                                    )}
                                </div>}
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}

function FilterDropdown({ value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('pointerdown', handleClickOutside);
        return () => document.removeEventListener('pointerdown', handleClickOutside);
    }, [open]);

    const selected = options.find(o => o.value === value) || options[0];
    const isDefault = value === 'all';

    return (
        <div className="relative flex-shrink-0" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer"
                style={{
                    backgroundColor: isDefault ? 'rgba(var(--color-ink-rgb), 0.04)' : 'var(--color-burgundy)',
                    color: isDefault ? 'var(--color-ink-muted)' : 'white',
                    border: isDefault ? '1px solid rgba(var(--color-ink-rgb), 0.08)' : 'none',
                }}
            >
                {selected.dotColor && isDefault && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selected.dotColor }} />
                )}
                {selected.label}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                    className="transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
            {open && (
                <div
                    className="absolute top-full left-0 mt-1 py-1 rounded-xl shadow-lg z-50 min-w-[140px] animate-fade-in"
                    style={{ backgroundColor: 'var(--color-card)', border: '1px solid rgba(var(--color-ink-rgb), 0.1)' }}
                >
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium cursor-pointer transition-colors duration-100"
                            style={{
                                backgroundColor: opt.value === value ? 'rgba(139, 65, 87, 0.08)' : 'transparent',
                                color: opt.value === value ? 'var(--color-burgundy)' : 'var(--color-ink-secondary)',
                            }}
                        >
                            {opt.dotColor && (
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: opt.dotColor }} />
                            )}
                            {opt.label}
                            {opt.value === value && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="3" className="ml-auto flex-shrink-0">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
