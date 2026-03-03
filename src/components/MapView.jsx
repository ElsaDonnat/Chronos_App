import { useState, useMemo, useRef, useCallback } from 'react';
import { CATEGORY_CONFIG, isDiHEvent } from '../data/events';
import { MAP_REGIONS, REGION_CENTERS, projectToSVG, normalizeRegion } from '../data/mapPaths';
import { Card, CategoryTag, MasteryDots, ExpandableText } from './shared';

const REGION_NAMES = ['Europe', 'Middle East', 'Americas', 'Africa', 'Asia'];
const CLUSTER_GRID = 25; // SVG units per grid cell

// Map-specific color tokens (light / dark via CSS vars with fallbacks)
const MAP_COLORS = {
    ocean: 'var(--color-map-ocean, #D6CFC4)',
    land: 'var(--color-map-land, #E8E0D2)',
    landActive: 'var(--color-map-land-active, #DDD0BB)',
    border: 'var(--color-map-border, #C9B896)',
    borderActive: 'var(--color-map-border-active, #8B4157)',
    graticule: 'var(--color-map-graticule, rgba(0,0,0,0.04))',
    pinStroke: 'var(--color-map-pin-stroke, #FFFDF9)',
    pinMuted: 'var(--color-map-pin-muted, #C9B896)',
    label: 'var(--color-map-label, #A8A29E)',
    labelActive: 'var(--color-map-label-active, #8B4157)',
};

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
        const cx = group.reduce((s, p) => s + p.x, 0) / group.length;
        const cy = group.reduce((s, p) => s + p.y, 0) / group.length;
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

// Graticule lines for the equirectangular projection (every 30 degrees)
function Graticule() {
    const lines = [];
    // Longitude lines
    for (let lng = -150; lng <= 180; lng += 30) {
        const x = ((lng + 180) / 360) * 800;
        lines.push(<line key={`lng${lng}`} x1={x} y1={0} x2={x} y2={450} />);
    }
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
        const y = ((90 - lat) / 180) * 450;
        lines.push(<line key={`lat${lat}`} x1={0} y1={y} x2={800} y2={y} />);
    }
    return (
        <g stroke={MAP_COLORS.graticule} strokeWidth="0.5" fill="none" style={{ pointerEvents: 'none' }}>
            {lines}
        </g>
    );
}

// Category legend
function Legend({ visible, onToggle }) {
    const cats = Object.entries(CATEGORY_CONFIG);
    return (
        <div className="absolute top-2 right-2 z-10">
            <button
                onClick={onToggle}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                    backgroundColor: visible ? 'var(--color-burgundy)' : 'rgba(var(--color-ink-rgb), 0.06)',
                    color: visible ? 'white' : 'var(--color-ink-muted)',
                }}
                title="Legend"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                </svg>
            </button>
            {visible && (
                <div
                    className="absolute top-8 right-0 rounded-lg py-1.5 px-2 animate-fade-in"
                    style={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid rgba(var(--color-ink-rgb), 0.1)',
                        boxShadow: 'var(--shadow-card)',
                        minWidth: 110,
                    }}
                >
                    {cats.map(([key, cfg]) => (
                        <div key={key} className="flex items-center gap-1.5 py-0.5">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                            <span className="text-[10px] font-medium" style={{ color: 'var(--color-ink-secondary)' }}>
                                {cfg.label}
                            </span>
                        </div>
                    ))}
                    <div className="flex items-center gap-1.5 py-0.5 mt-0.5" style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}>
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: MAP_COLORS.pinMuted, opacity: 0.5 }} />
                        <span className="text-[10px] font-medium italic" style={{ color: 'var(--color-ink-faint)' }}>
                            Undiscovered
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Touch/mouse pan-zoom handler
function usePanZoom() {
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const gestureRef = useRef(null);
    const containerRef = useRef(null);

    const clampTransform = useCallback((x, y, scale) => {
        const s = Math.min(Math.max(scale, 1), 4);
        if (s === 1) return { x: 0, y: 0, scale: 1 };
        // Clamp pan so map edges stay within the container
        const maxX = ((s - 1) / 2) * 100; // percentage-based
        const maxY = ((s - 1) / 2) * 100;
        return {
            x: Math.min(Math.max(x, -maxX), maxX),
            y: Math.min(Math.max(y, -maxY), maxY),
            scale: s,
        };
    }, []);

    const onTouchStart = useCallback((e) => {
        if (e.touches.length === 2) {
            const t = e.touches;
            const dist = Math.hypot(t[1].clientX - t[0].clientX, t[1].clientY - t[0].clientY);
            const midX = (t[0].clientX + t[1].clientX) / 2;
            const midY = (t[0].clientY + t[1].clientY) / 2;
            gestureRef.current = { type: 'pinch', startDist: dist, startScale: transform.scale, startX: transform.x, startY: transform.y, midX, midY };
        } else if (e.touches.length === 1 && transform.scale > 1) {
            gestureRef.current = { type: 'pan', startTouchX: e.touches[0].clientX, startTouchY: e.touches[0].clientY, startX: transform.x, startY: transform.y };
        }
    }, [transform]);

    const onTouchMove = useCallback((e) => {
        if (!gestureRef.current) return;
        const g = gestureRef.current;

        if (g.type === 'pinch' && e.touches.length === 2) {
            e.preventDefault();
            const t = e.touches;
            const dist = Math.hypot(t[1].clientX - t[0].clientX, t[1].clientY - t[0].clientY);
            const newScale = g.startScale * (dist / g.startDist);
            setTransform(clampTransform(g.startX, g.startY, newScale));
        } else if (g.type === 'pan' && e.touches.length === 1) {
            e.preventDefault();
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const dx = ((e.touches[0].clientX - g.startTouchX) / rect.width) * 100;
            const dy = ((e.touches[0].clientY - g.startTouchY) / rect.height) * 100;
            setTransform(clampTransform(g.startX + dx, g.startY + dy, transform.scale));
        }
    }, [transform.scale, clampTransform]);

    const onTouchEnd = useCallback(() => {
        gestureRef.current = null;
    }, []);

    const resetZoom = useCallback(() => {
        setTransform({ x: 0, y: 0, scale: 1 });
    }, []);

    const cssTransform = `translate(${transform.x}%, ${transform.y}%) scale(${transform.scale})`;
    const isZoomed = transform.scale > 1;

    return { containerRef, cssTransform, isZoomed, onTouchStart, onTouchMove, onTouchEnd, resetZoom };
}


export default function MapView({ events, learnedIds, hideUnknown, eventMastery, selectedRegion, onRegionSelect }) {
    const [selectedPin, setSelectedPin] = useState(null);
    const [clusterExpanded, setClusterExpanded] = useState(false);
    const [legendVisible, setLegendVisible] = useState(false);
    const { containerRef, cssTransform, isZoomed, onTouchStart, onTouchMove, onTouchEnd, resetZoom } = usePanZoom();

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

    // Track which pin is selected for highlight
    const selectedEventId = selectedPin?.event?.id;
    const selectedClusterXY = selectedPin?.events ? `${selectedPin.x},${selectedPin.y}` : null;

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
        setLegendVisible(false);
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
                                backgroundColor: isActive ? 'var(--color-burgundy)' : 'rgba(var(--color-ink-rgb), 0.04)',
                                color: isActive ? 'white' : 'var(--color-ink-muted)',
                            }}>
                            {region} ({regionCounts[region]})
                        </button>
                    );
                })}
            </div>

            {/* SVG Map with pan/zoom */}
            <div className="relative rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
                {/* Legend toggle */}
                <Legend visible={legendVisible} onToggle={() => setLegendVisible(v => !v)} />

                {/* Zoom reset button */}
                {isZoomed && (
                    <button
                        onClick={resetZoom}
                        className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center animate-fade-in"
                        style={{
                            backgroundColor: 'rgba(var(--color-ink-rgb), 0.06)',
                            color: 'var(--color-ink-muted)',
                        }}
                        title="Reset zoom"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" />
                        </svg>
                    </button>
                )}

                <div
                    ref={containerRef}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    style={{
                        transform: cssTransform,
                        transformOrigin: 'center center',
                        transition: isZoomed ? 'none' : 'transform 0.3s ease-out',
                        touchAction: isZoomed ? 'none' : 'pan-y',
                    }}
                >
                    <svg viewBox="0 0 800 450" className="w-full" style={{ display: 'block' }}
                         onClick={handleMapBgClick}>
                        {/* Ocean background */}
                        <rect width="800" height="450" fill={MAP_COLORS.ocean} />

                        {/* Graticule grid */}
                        <Graticule />

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
                                            fill={isActive ? MAP_COLORS.landActive : MAP_COLORS.land}
                                            stroke={isActive ? MAP_COLORS.borderActive : MAP_COLORS.border}
                                            strokeWidth={isActive ? 1.5 : 0.5}
                                            opacity={hasEvents || !selectedRegion ? 1 : 0.35}
                                            style={{ transition: 'fill 0.2s, stroke 0.2s, opacity 0.2s' }}
                                        />
                                    ))}
                                    <text x={data.labelPos.x} y={data.labelPos.y}
                                        textAnchor="middle" fill={isActive ? MAP_COLORS.labelActive : MAP_COLORS.label}
                                        fontSize="11" fontWeight="600" opacity={0.6}
                                        style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}>
                                        {regionName}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Selected pin highlight ring (rendered behind pins) */}
                        {selectedPin && (
                            <g style={{ pointerEvents: 'none' }}>
                                {selectedEventId && (() => {
                                    const pin = pins.find(p => !p.cluster && p.event?.id === selectedEventId);
                                    if (!pin) return null;
                                    return <circle cx={pin.x} cy={pin.y} r={12} fill="none" stroke={CATEGORY_CONFIG[pin.event.category]?.color || '#8B4157'} strokeWidth="2" opacity="0.4" className="map-pin-pulse" />;
                                })()}
                                {selectedClusterXY && (() => {
                                    const pin = pins.find(p => p.cluster && `${p.x},${p.y}` === selectedClusterXY);
                                    if (!pin) return null;
                                    return <circle cx={pin.x} cy={pin.y} r={16} fill="none" stroke={CATEGORY_CONFIG[pin.category]?.color || '#8B4157'} strokeWidth="2" opacity="0.4" className="map-pin-pulse" />;
                                })()}
                            </g>
                        )}

                        {/* Event pins */}
                        {pins.map((pin, i) => {
                            const isLearned = pin.cluster ? pin.learned : learnedIds.has(pin.event?.id);
                            const catColor = pin.cluster
                                ? (CATEGORY_CONFIG[pin.category]?.color || '#8B4157')
                                : (CATEGORY_CONFIG[pin.event?.category]?.color || '#999');
                            const pinColor = isLearned ? catColor : MAP_COLORS.pinMuted;
                            const r = pin.cluster ? 10 : 6;

                            return (
                                <g key={i} onClick={(e) => handlePinClick(pin, e)} style={{ cursor: 'pointer' }}>
                                    {/* Invisible larger hit area */}
                                    <circle cx={pin.x} cy={pin.y} r={18} fill="transparent" />
                                    {/* Drop shadow */}
                                    <circle cx={pin.x} cy={pin.y + 1} r={r} fill="rgba(0,0,0,0.12)" />
                                    {/* Visible pin */}
                                    <circle cx={pin.x} cy={pin.y} r={r}
                                        fill={pinColor}
                                        stroke={MAP_COLORS.pinStroke} strokeWidth={1.5}
                                        opacity={isLearned ? 1 : 0.45}
                                    />
                                    {pin.cluster && (
                                        <text x={pin.x} y={pin.y + 1} textAnchor="middle" dominantBaseline="middle"
                                            fill="white" fontSize="9" fontWeight="bold"
                                            style={{ pointerEvents: 'none' }}>
                                            {pin.count}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                </div>
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
                        {learnedIds.has(selectedEvent.id) && selectedEvent.description && (
                            <ExpandableText lines={2} className="text-xs leading-relaxed mb-2" style={{ color: 'var(--color-ink-secondary)' }}>
                                {selectedEvent.description}
                            </ExpandableText>
                        )}
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
                                    style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}
                                    onClick={() => { setSelectedPin({ event: evt }); setClusterExpanded(false); }}>
                                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: isLearned ? (CATEGORY_CONFIG[evt.category]?.color || '#999') : MAP_COLORS.pinMuted }} />
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
