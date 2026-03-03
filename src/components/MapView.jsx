import { useState, useMemo } from 'react';
import { CATEGORY_CONFIG, isDiHEvent } from '../data/events';
import { MAP_REGIONS, REGION_CENTERS, projectToSVG, normalizeRegion } from '../data/mapPaths';
import { Card, CategoryTag, MasteryDots } from './shared';

const REGION_NAMES = ['Europe', 'Middle East', 'Americas', 'Africa', 'Asia'];
const CLUSTER_GRID = 25; // SVG units per grid cell

function clusterPins(events, learnedIds) {
    const projected = events.map(e => {
        const pos = projectToSVG(e.location.lat, e.location.lng, normalizeRegion(e.location.region));
        return { event: e, x: pos.x, y: pos.y, learned: learnedIds.has(e.id) };
    });

    const grid = {};
    for (const pin of projected) {
        const key = `${Math.floor(pin.x / CLUSTER_GRID)},${Math.floor(pin.y / CLUSTER_GRID)}`;
        if (!grid[key]) grid[key] = [];
        grid[key].push(pin);
    }

    return Object.values(grid).map(group => {
        if (group.length === 1) {
            return { ...group[0], cluster: false, count: 1 };
        }
        // Centroid position
        const cx = group.reduce((s, p) => s + p.x, 0) / group.length;
        const cy = group.reduce((s, p) => s + p.y, 0) / group.length;
        // Most common category for color
        const cats = {};
        for (const p of group) {
            cats[p.event.category] = (cats[p.event.category] || 0) + 1;
        }
        const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0][0];
        return {
            x: cx, y: cy, cluster: true, count: group.length,
            events: group.map(p => p.event),
            learned: group.some(p => p.learned),
            category: topCat,
        };
    });
}

export default function MapView({ events, learnedIds, hideUnknown, eventMastery, selectedRegion, onRegionSelect }) {
    const [selectedPin, setSelectedPin] = useState(null); // { event } or { events: [...] }
    const [clusterExpanded, setClusterExpanded] = useState(false);

    const visibleEvents = useMemo(() => {
        let evts = events;
        if (selectedRegion) {
            evts = evts.filter(e => normalizeRegion(e.location.region) === selectedRegion);
        }
        if (hideUnknown) {
            evts = evts.filter(e => learnedIds.has(e.id));
        }
        return evts;
    }, [events, selectedRegion, hideUnknown, learnedIds]);

    const pins = useMemo(() => clusterPins(visibleEvents, learnedIds), [visibleEvents, learnedIds]);

    const regionCounts = useMemo(() => {
        const counts = {};
        for (const r of REGION_NAMES) counts[r] = 0;
        for (const e of events) {
            const norm = normalizeRegion(e.location.region);
            if (counts[norm] !== undefined) counts[norm]++;
        }
        return counts;
    }, [events]);

    const handlePinClick = (pin, e) => {
        e.stopPropagation();
        if (pin.cluster) {
            setSelectedPin({ events: pin.events, x: pin.x, y: pin.y });
            setClusterExpanded(true);
        } else {
            setSelectedPin({ event: pin.event });
            setClusterExpanded(false);
        }
    };

    const handleMapBgClick = () => {
        setSelectedPin(null);
        setClusterExpanded(false);
    };

    const selectedEvent = selectedPin?.event;
    const clusterEvents = selectedPin?.events;

    return (
        <div className="relative">
            {/* Region chips */}
            <div className="flex gap-1.5 flex-wrap mb-3">
                {REGION_NAMES.map(region => {
                    const isActive = selectedRegion === region;
                    return (
                        <button key={region}
                            onClick={() => { onRegionSelect(isActive ? null : region); setSelectedPin(null); }}
                            className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200"
                            style={{
                                backgroundColor: isActive ? 'var(--color-burgundy)' : 'rgba(28, 25, 23, 0.04)',
                                color: isActive ? 'white' : 'var(--color-ink-muted)',
                            }}>
                            {region} ({regionCounts[region]})
                        </button>
                    );
                })}
            </div>

            {/* SVG Map */}
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#EDE6DA', boxShadow: 'var(--shadow-card)' }}>
                <svg viewBox="0 0 800 450" className="w-full" style={{ display: 'block' }}
                     onClick={handleMapBgClick}>
                    {/* Ocean background */}
                    <rect width="800" height="450" fill="#EDE6DA" />

                    {/* Continent paths */}
                    {Object.entries(MAP_REGIONS).map(([regionName, data]) => {
                        const isActive = selectedRegion === regionName;
                        const hasEvents = visibleEvents.some(e => normalizeRegion(e.location.region) === regionName);
                        return (
                            <g key={regionName}
                               onClick={(e) => { e.stopPropagation(); onRegionSelect(isActive ? null : regionName); setSelectedPin(null); }}
                               style={{ cursor: 'pointer' }}>
                                {data.paths.map((d, i) => (
                                    <path key={i} d={d}
                                        fill={isActive ? '#DDD0BB' : '#E2D9CA'}
                                        stroke={isActive ? '#8B4157' : '#C9B896'}
                                        strokeWidth={isActive ? 1.5 : 0.5}
                                        opacity={hasEvents || !selectedRegion ? 1 : 0.35}
                                        style={{ transition: 'fill 0.2s, stroke 0.2s, opacity 0.2s' }}
                                    />
                                ))}
                                <text x={data.labelPos.x} y={data.labelPos.y}
                                    textAnchor="middle" fill={isActive ? '#8B4157' : '#A8A29E'}
                                    fontSize="11" fontWeight="600"
                                    style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}>
                                    {regionName}
                                </text>
                            </g>
                        );
                    })}

                    {/* Event pins */}
                    {pins.map((pin, i) => {
                        const isLearned = pin.cluster ? pin.learned : learnedIds.has(pin.event?.id);
                        const catColor = pin.cluster
                            ? (CATEGORY_CONFIG[pin.category]?.color || '#8B4157')
                            : (CATEGORY_CONFIG[pin.event?.category]?.color || '#999');
                        const pinColor = isLearned ? catColor : '#C9B896';
                        const r = pin.cluster ? 9 : 5;

                        return (
                            <g key={i} onClick={(e) => handlePinClick(pin, e)} style={{ cursor: 'pointer' }}>
                                {/* Invisible larger hit area */}
                                <circle cx={pin.x} cy={pin.y} r={14} fill="transparent" />
                                {/* Visible pin */}
                                <circle cx={pin.x} cy={pin.y} r={r}
                                    fill={pinColor}
                                    stroke="#FFFDF9" strokeWidth={1.5}
                                    opacity={isLearned ? 1 : 0.4}
                                />
                                {pin.cluster && (
                                    <text x={pin.x} y={pin.y + 1} textAnchor="middle" dominantBaseline="middle"
                                        fill="white" fontSize="8" fontWeight="bold"
                                        style={{ pointerEvents: 'none' }}>
                                        {pin.count}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Bottom popup: single event */}
            {selectedEvent && (
                <div className="mt-3 animate-fade-in">
                    <Card style={{ borderLeft: `3px solid ${isDiHEvent(selectedEvent) ? '#E6A817' : (CATEGORY_CONFIG[selectedEvent.category]?.color || '#999')}` }}>
                        <div className="flex items-center justify-between mb-1">
                            <CategoryTag category={selectedEvent.category} />
                            <button onClick={() => setSelectedPin(null)}
                                className="w-6 h-6 flex items-center justify-center rounded-full text-xs"
                                style={{ color: 'var(--color-ink-muted)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <h4 className="text-base font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                            {selectedEvent.title}
                        </h4>
                        <p className="text-xs mb-1" style={{ color: 'var(--color-burgundy)' }}>
                            {selectedEvent.date}
                        </p>
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            {selectedEvent.location.place}
                        </div>
                        {eventMastery[selectedEvent.id] && (
                            <div className="mt-2">
                                <MasteryDots mastery={eventMastery[selectedEvent.id]} />
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* Bottom popup: cluster list */}
            {clusterEvents && clusterExpanded && (
                <div className="mt-3 animate-fade-in">
                    <Card>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-ink-faint)' }}>
                                {clusterEvents.length} events at this location
                            </p>
                            <button onClick={() => { setSelectedPin(null); setClusterExpanded(false); }}
                                className="w-6 h-6 flex items-center justify-center rounded-full text-xs"
                                style={{ color: 'var(--color-ink-muted)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        {clusterEvents.map(evt => {
                            const isLearned = learnedIds.has(evt.id);
                            return (
                                <div key={evt.id}
                                    className="flex items-center gap-2 py-2 cursor-pointer active:opacity-70"
                                    style={{ borderTop: '1px solid rgba(28, 25, 23, 0.06)' }}
                                    onClick={() => { setSelectedPin({ event: evt }); setClusterExpanded(false); }}>
                                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: isLearned ? (CATEGORY_CONFIG[evt.category]?.color || '#999') : '#C9B896' }} />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: isLearned ? 'var(--color-ink)' : 'var(--color-ink-faint)' }}>
                                            {isLearned ? evt.title : 'Undiscovered event'}
                                        </p>
                                        {isLearned && (
                                            <p className="text-[11px]" style={{ color: 'var(--color-ink-muted)' }}>{evt.date}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </Card>
                </div>
            )}

            {/* Empty state */}
            {visibleEvents.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                        No events match the current filters.
                    </p>
                </div>
            )}
        </div>
    );
}
