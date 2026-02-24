import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_EVENTS, CATEGORY_CONFIG, ERA_RANGES, getEraForYear, formatYear } from '../data/events';
import { Card, CategoryTag, MasteryDots } from '../components/shared';
import Mascot from '../components/Mascot';

export default function TimelinePage() {
    const { state } = useApp();
    const [selectedEra, setSelectedEra] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedId, setExpandedId] = useState(null);

    const sortedEvents = useMemo(() => {
        return [...ALL_EVENTS].sort((a, b) => a.year - b.year);
    }, []);

    const filteredEvents = useMemo(() => {
        return sortedEvents.filter(event => {
            if (selectedEra !== 'all') {
                const era = ERA_RANGES.find(e => e.id === selectedEra);
                if (era && (event.year < era.start || event.year >= era.end)) return false;
            }
            if (selectedCategory !== 'all' && event.category !== selectedCategory) return false;
            return true;
        });
    }, [sortedEvents, selectedEra, selectedCategory]);

    const learnedIds = new Set(state.seenEvents);

    // Get era color
    const getEraColor = (eraId) => {
        const colors = {
            prehistory: 'rgba(13, 148, 136, 0.06)',
            ancient: 'rgba(107, 91, 115, 0.06)',
            medieval: 'rgba(160, 82, 45, 0.06)',
            earlymodern: 'rgba(101, 119, 74, 0.06)',
            modern: 'rgba(180, 83, 9, 0.06)',
        };
        return colors[eraId] || 'transparent';
    };

    return (
        <div className="py-4">
            <div className="text-center mb-4">
                <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                    Timeline
                </h1>
                <p className="text-xs mt-1" style={{ color: 'var(--color-ink-muted)' }}>
                    {learnedIds.size} of {ALL_EVENTS.length} events discovered
                </p>
            </div>

            {/* Era filters */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 -mx-1 px-1 scrollbar-hide">
                <FilterChip label="All" active={selectedEra === 'all'} onClick={() => setSelectedEra('all')} />
                {ERA_RANGES.map(era => (
                    <FilterChip key={era.id} label={era.label} active={selectedEra === era.id}
                        onClick={() => setSelectedEra(era.id)} />
                ))}
            </div>

            {/* Category filters */}
            <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 -mx-1 px-1 scrollbar-hide">
                <FilterChip label="All" active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')} />
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <FilterChip key={key} label={config.label} active={selectedCategory === key}
                        onClick={() => setSelectedCategory(key)}
                        dotColor={config.color} />
                ))}
            </div>

            {filteredEvents.length === 0 ? (
                <div className="text-center py-12 animate-fade-in">
                    <Mascot mood="thinking" size={60} />
                    <p className="text-sm mt-3" style={{ color: 'var(--color-ink-muted)', fontFamily: 'var(--font-serif)' }}>
                        No events match your filters
                    </p>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 rounded-full" style={{ backgroundColor: 'var(--color-bronze-light)', opacity: 0.4 }} />

                    {filteredEvents.map((event, index) => {
                        const isLearned = learnedIds.has(event.id);
                        const mastery = state.eventMastery[event.id];
                        const isExpanded = expandedId === event.id;
                        const era = getEraForYear(event.year);
                        const prevEvent = filteredEvents[index - 1];
                        const showEraLabel = !prevEvent || getEraForYear(prevEvent.year).id !== era?.id;
                        const catConfig = CATEGORY_CONFIG[event.category];

                        return (
                            <div key={event.id}>
                                {/* Era separator */}
                                {showEraLabel && era && (
                                    <div className="relative pl-14 py-2 mb-2 mt-2" style={{ backgroundColor: getEraColor(era.id) }}>
                                        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-ink-faint)' }}>
                                            {era.label}
                                        </span>
                                    </div>
                                )}

                                <div
                                    className={`relative pl-14 py-2 animate-fade-in cursor-pointer transition-all duration-200`}
                                    style={{ animationDelay: `${Math.min(index * 30, 500)}ms`, animationFillMode: 'backwards' }}
                                    onClick={() => isLearned && setExpandedId(isExpanded ? null : event.id)}
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-[17px] top-4 z-10">
                                        {isLearned ? (
                                            <div className="w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center"
                                                style={{
                                                    borderColor: catConfig?.color || '#999',
                                                    backgroundColor: 'var(--color-card)',
                                                }}>
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: catConfig?.color || '#999' }} />
                                            </div>
                                        ) : (
                                            <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: 'rgba(28, 25, 23, 0.08)' }}>
                                                <span className="text-[8px] font-bold" style={{ color: 'var(--color-ink-faint)' }}>?</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Duration bar for range events */}
                                    {isLearned && event.yearEnd && (
                                        <div className="absolute left-[25px] top-[22px] w-[2px] rounded-full"
                                            style={{
                                                backgroundColor: catConfig?.color || '#999',
                                                opacity: 0.3,
                                                height: '20px'
                                            }} />
                                    )}

                                    {isLearned ? (
                                        <div>
                                            <p className="text-[11px] font-medium" style={{ color: 'var(--color-ink-faint)' }}>
                                                {event.date}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold leading-tight" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                                    {event.title}
                                                </h3>
                                                {mastery && <MasteryDots mastery={mastery} />}
                                            </div>

                                            {/* Expanded view */}
                                            {isExpanded && (
                                                <div className="mt-3 animate-fade-in">
                                                    <Card style={{ borderLeft: `3px solid ${catConfig?.color || '#999'}` }}>
                                                        <CategoryTag category={event.category} />
                                                        <h3 className="text-base font-bold mt-2 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                                                            {event.title}
                                                        </h3>
                                                        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-terracotta)' }}>
                                                            {event.date}
                                                        </p>
                                                        <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--color-ink-secondary)' }}>
                                                            {event.description}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                                            </svg>
                                                            {event.location.place}
                                                        </div>
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
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {learnedIds.size === 0 && (
                <div className="text-center py-8 animate-fade-in">
                    <Mascot mood="happy" size={64} />
                    <p className="text-base font-semibold mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-secondary)' }}>
                        Your timeline begins with your first lesson
                    </p>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-ink-muted)' }}>
                        Complete lessons to discover events and fill your timeline
                    </p>
                </div>
            )}
        </div>
    );
}

function FilterChip({ label, active, onClick, dotColor }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200"
            style={{
                backgroundColor: active ? 'var(--color-terracotta)' : 'rgba(28, 25, 23, 0.04)',
                color: active ? 'white' : 'var(--color-ink-muted)',
            }}
        >
            {dotColor && !active && (
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
            )}
            {label}
        </button>
    );
}
