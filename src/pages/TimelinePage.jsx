import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_EVENTS, CATEGORY_CONFIG, ERA_RANGES, ERA_BOUNDARY_EVENTS, getEraForYear, getEventById } from '../data/events';
import { Card, CategoryTag, MasteryDots, Divider, ExpandableText } from '../components/shared';
import Mascot from '../components/Mascot';

export default function TimelinePage() {
    const { state } = useApp();
    const [selectedEra, setSelectedEra] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [expandedEraId, setExpandedEraId] = useState(null);

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
    const lesson0Complete = !!state.completedLessons['lesson-0'];

    const eraDetails = {
        prehistory: { icon: '🦴', title: 'Prehistory', subtitle: 'c. 7 million years ago – c. 3200 BCE', description: 'The longest chapter in human history — from the first split with our ape ancestors through mastering fire, developing language, migrating across the globe, and eventually settling into farming communities.', color: '#0D9488' },
        ancient: { icon: '🏛️', title: 'The Ancient World', subtitle: 'c. 3200 BCE – 500 CE', description: 'Writing is invented, cities rise, empires clash. From Sumer to Rome, humanity builds the foundations of law, philosophy, religion, and governance.', color: '#6B5B73' },
        medieval: { icon: '⚔️', title: 'The Medieval World', subtitle: '500 – 1500 CE', description: 'Empires fragment and reform. Faiths spread across continents, scholars preserve and advance knowledge, and horseback conquerors redraw the map of Eurasia.', color: '#A0522D' },
        earlymodern: { icon: '🧭', title: 'The Early Modern Period', subtitle: '1500 – 1800 CE', description: 'Print breaks the monopoly on knowledge, ships connect every continent, and thinkers challenge the divine right of kings.', color: '#65774A' },
        modern: { icon: '🌍', title: 'The Modern World', subtitle: '1800 – Present', description: 'Industry, ideology, and information transform human life at accelerating speed. Two world wars reshape the global order, and digital networks connect billions.', color: '#8B4157' },
    };

    const getEraColor = (eraId) => {
        const colors = {
            prehistory: 'rgba(13, 148, 136, 0.06)',
            ancient: 'rgba(107, 91, 115, 0.06)',
            medieval: 'rgba(160, 82, 45, 0.06)',
            earlymodern: 'rgba(101, 119, 74, 0.06)',
            modern: 'rgba(139, 65, 87, 0.06)',
        };
        return colors[eraId] || 'transparent';
    };

    return (
        <div className="py-6">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                    Timeline
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--color-ink-muted)' }}>
                    {learnedIds.size} of {ALL_EVENTS.length} events discovered
                </p>
            </div>

            {/* Filter section — horizontal bar */}
            <div className="mb-6 space-y-2">
                <div className="flex gap-2 flex-wrap">
                    <FilterChip label="All Eras" active={selectedEra === 'all'} onClick={() => setSelectedEra('all')} />
                    {ERA_RANGES.map(era => (
                        <FilterChip key={era.id} label={era.label} active={selectedEra === era.id}
                            onClick={() => setSelectedEra(era.id)} />
                    ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                    <FilterChip label="All Categories" active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')} />
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                        <FilterChip key={key} label={config.label} active={selectedCategory === key}
                            onClick={() => setSelectedCategory(key)}
                            dotColor={config.color} />
                    ))}
                </div>
            </div>

            {filteredEvents.length === 0 ? (
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
                                                        <span className="text-base">{detail?.icon || ''}</span>
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
                                                                <div className="text-center mb-3">
                                                                    <span className="text-4xl">{detail.icon}</span>
                                                                </div>
                                                                <h3 className="text-lg font-bold text-center mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                                                                    {detail.title}
                                                                </h3>
                                                                <p className="text-xs font-semibold text-center mb-3" style={{ color: detail.color }}>
                                                                    {detail.subtitle}
                                                                </p>
                                                                <Divider />
                                                                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--color-ink-secondary)' }}>
                                                                    {detail.description}
                                                                </p>
                                                                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(28, 25, 23, 0.06)' }}>
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

                                <div
                                    className="timeline-event-card relative pl-16 py-3 animate-fade-in cursor-pointer rounded-lg transition-all duration-200"
                                    style={{ animationDelay: `${Math.min(index * 30, 500)}ms`, animationFillMode: 'backwards' }}
                                    onClick={() => isLearned && setExpandedId(isExpanded ? null : event.id)}
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-[20px] top-5 z-10">
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
                                                <div className="mt-4 animate-fade-in">
                                                    <Card style={{ borderLeft: `3px solid ${catConfig?.color || '#999'}` }}>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <CategoryTag category={event.category} />
                                                            <span className="text-sm font-semibold" style={{ color: 'var(--color-burgundy)' }}>
                                                                {event.date}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                                                            {event.title}
                                                        </h3>
                                                        <ExpandableText lines={3} className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-ink-secondary)' }}>
                                                            {event.description}
                                                        </ExpandableText>
                                                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        </div>
    );
}

function FilterChip({ label, active, onClick, dotColor }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer"
            style={{
                backgroundColor: active ? 'var(--color-burgundy)' : 'rgba(28, 25, 23, 0.04)',
                color: active ? 'white' : 'var(--color-ink-muted)',
                border: active ? 'none' : '1px solid rgba(28, 25, 23, 0.08)',
            }}
        >
            {dotColor && !active && (
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
            )}
            {label}
        </button>
    );
}
