import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { CATEGORY_CONFIG, isDiHEvent } from '../data/events';
import { MAP_REGIONS, REGION_CENTERS, projectToSVG, normalizeRegion, EVENT_COUNTRY_MAP, COUNTRY_TO_SUBREGION, REGION_COLORS } from '../data/mapPaths';
import { Card, CategoryTag, ImportanceTag, MasteryDots, ExpandableText } from './shared';
import * as feedback from '../services/feedback';
const CLUSTER_GRID = 25; // SVG units per grid cell

// Map-specific color tokens (light / dark via CSS vars with fallbacks)
const MAP_COLORS = {
    ocean: 'var(--color-map-ocean, #D6CFC4)',
    land: 'var(--color-map-land, #E8E0D2)',
    border: 'var(--color-map-border, #C9B896)',
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

// Graticule lines for Natural Earth I projection (approximated as projected polylines)
function Graticule() {
    const lines = [];
    const DEG2RAD = Math.PI / 180;
    const S = 143.3071, TX = 400, TY = 250;
    const proj = (lat, lng) => {
        const lam = lng * DEG2RAD, phi = lat * DEG2RAD;
        const p2 = phi * phi, p4 = p2 * p2;
        return {
            x: S * lam * (0.8707 + p2 * (-0.131979 + p2 * (-0.013791 + p4 * (0.003971 + p2 * -0.001529)))) + TX,
            y: -S * phi * (1.007226 + p2 * (0.015085 + p2 * (-0.044475 + p4 * (0.028874 + p2 * -0.005916)))) + TY,
        };
    };
    for (let lng = -150; lng <= 180; lng += 30) {
        const pts = [];
        for (let lat = -80; lat <= 84; lat += 4) {
            const p = proj(lat, lng);
            pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
        }
        lines.push(<polyline key={`lng${lng}`} points={pts.join(' ')} />);
    }
    for (let lat = -60; lat <= 80; lat += 30) {
        const pts = [];
        for (let lng2 = -180; lng2 <= 180; lng2 += 4) {
            const p = proj(lat, lng2);
            pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
        }
        lines.push(<polyline key={`lat${lat}`} points={pts.join(' ')} />);
    }
    return (
        <g stroke={MAP_COLORS.graticule} strokeWidth="0.5" fill="none" style={{ pointerEvents: 'none' }}>
            {lines}
        </g>
    );
}

// Category legend
function Legend({ visible, onToggle, className }) {
    const cats = Object.entries(CATEGORY_CONFIG);
    return (
        <div className={className || "absolute top-2 right-2 z-10"}>
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

// Touch/mouse pinch-zoom handler
function usePanZoom() {
    const [scale, setScale] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const gestureRef = useRef(null);
    const mapContainerRef = useRef(null);

    const onTouchStart = useCallback((e) => {
        if (e.touches.length === 2) {
            const t = e.touches;
            const dist = Math.hypot(t[1].clientX - t[0].clientX, t[1].clientY - t[0].clientY);
            gestureRef.current = { type: 'pinch', startDist: dist, startScale: scale, startPan: { ...panOffset } };
        } else if (e.touches.length === 1 && scale > 1) {
            gestureRef.current = { type: 'pan', startTouchX: e.touches[0].clientX, startTouchY: e.touches[0].clientY, startPan: { ...panOffset } };
        }
    }, [scale, panOffset]);

    const onTouchMove = useCallback((e) => {
        if (!gestureRef.current) return;
        const g = gestureRef.current;

        if (g.type === 'pinch' && e.touches.length === 2) {
            e.preventDefault();
            const t = e.touches;
            const dist = Math.hypot(t[1].clientX - t[0].clientX, t[1].clientY - t[0].clientY);
            const newScale = Math.min(Math.max(g.startScale * (dist / g.startDist), 1), 4);
            setScale(newScale);
            if (newScale === 1) setPanOffset({ x: 0, y: 0 });
        } else if (g.type === 'pan' && e.touches.length === 1) {
            e.preventDefault();
            const el = mapContainerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const dx = ((e.touches[0].clientX - g.startTouchX) / rect.width) * 100;
            const dy = ((e.touches[0].clientY - g.startTouchY) / rect.height) * 100;
            const maxPan = ((scale - 1) / 2) * 100;
            setPanOffset({
                x: Math.min(Math.max(g.startPan.x + dx, -maxPan), maxPan),
                y: Math.min(Math.max(g.startPan.y + dy, -maxPan), maxPan),
            });
        }
    }, [scale]);

    const onTouchEnd = useCallback(() => {
        gestureRef.current = null;
    }, []);

    const onWheel = useCallback((e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        setScale(prev => {
            const next = Math.min(Math.max(prev + delta, 1), 4);
            if (next === 1) setPanOffset({ x: 0, y: 0 });
            return next;
        });
    }, []);

    const resetZoom = useCallback(() => {
        setScale(1);
        setPanOffset({ x: 0, y: 0 });
    }, []);

    const isZoomed = scale > 1;
    const cssTransform = isZoomed
        ? `translate(${panOffset.x}%, ${panOffset.y}%) scale(${scale})`
        : 'none';

    return { mapContainerRef, cssTransform, isZoomed, onTouchStart, onTouchMove, onTouchEnd, onWheel, resetZoom };
}

// Get fill color for a country based on its sub-region and selection state
function getCountryFill(countryCode, selectedRegion) {
    const subRegion = COUNTRY_TO_SUBREGION[countryCode];
    if (!subRegion) return MAP_COLORS.land; // Antarctica or unmapped
    const colors = REGION_COLORS[subRegion];
    if (!colors) return MAP_COLORS.land;
    if (selectedRegion === subRegion) return colors.vibrant;
    return colors.pastel;
}

// The SVG map content — shared between normal and fullscreen modes
function MapSVG({ pins, learnedIds, selectedRegion, selectedPin, selectedEventId, selectedClusterXY, handlePinClick, handleMapBgClick, handleCountryClick, svgStyle, svgClassName, viewBox }) {
    const highlightedCountryCode = selectedEventId ? EVENT_COUNTRY_MAP[selectedEventId] : null;

    return (
        <svg viewBox={viewBox || "0 0 800 500"} className={svgClassName} style={svgStyle}
             onClick={handleMapBgClick}>
            {/* Ocean background */}
            <rect width="800" height="500" fill={MAP_COLORS.ocean} />

            {/* Graticule grid */}
            <Graticule />

            {/* Continent outlines — black strokes drawn behind fills for visible coastlines */}
            {Object.entries(MAP_REGIONS).map(([continentName, data]) => (
                <g key={`outline-${continentName}`} style={{ pointerEvents: 'none' }}>
                    {data.countries.map((country) => (
                        <path key={country.code} d={country.d}
                            fill="none"
                            stroke="rgba(0,0,0,0.45)"
                            strokeWidth="1"
                            strokeLinejoin="round"
                        />
                    ))}
                </g>
            ))}

            {/* Country paths (grouped by continent) — colored by sub-region */}
            {Object.entries(MAP_REGIONS).map(([continentName, data]) => (
                <g key={continentName}>
                    {data.countries.map((country) => {
                        const subRegion = COUNTRY_TO_SUBREGION[country.code];
                        const isSelected = selectedRegion && selectedRegion === subRegion;
                        const isCountryHighlighted = highlightedCountryCode === country.code;
                        const isDimmed = selectedRegion && !isSelected;
                        const fill = isCountryHighlighted
                            ? 'var(--color-map-country-highlight, #C9A96E)'
                            : getCountryFill(country.code, selectedRegion);

                        return (
                            <path key={country.code} d={country.d}
                                fill={fill}
                                stroke={isCountryHighlighted ? MAP_COLORS.labelActive : MAP_COLORS.border}
                                strokeWidth={isCountryHighlighted ? 1.5 : 0.3}
                                opacity={isDimmed ? 0.4 : 1}
                                data-country={country.code}
                                style={{
                                    cursor: subRegion ? 'pointer' : 'default',
                                    transition: 'fill 0.3s, stroke 0.3s, opacity 0.3s',
                                }}
                                onClick={(e) => {
                                    if (subRegion) {
                                        e.stopPropagation();
                                        handleCountryClick(subRegion);
                                    }
                                }}
                            />
                        );
                    })}
                    <text x={data.labelPos.x} y={data.labelPos.y}
                        textAnchor="middle" fill={MAP_COLORS.label}
                        fontSize="11" fontWeight="600" opacity={selectedRegion ? 0.3 : 0.6}
                        style={{ pointerEvents: 'none', transition: 'opacity 0.3s' }}>
                        {continentName}
                    </text>
                </g>
            ))}

            {/* Selected pin highlight ring */}
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
                    <g key={i} onClick={(e) => handlePinClick(pin, e)}
                       style={{ cursor: 'pointer', animation: `mapPinEntrance 0.4s ease-out ${i * 30}ms both` }}>
                        <circle cx={pin.x} cy={pin.y} r={18} fill="transparent" />
                        <circle cx={pin.x} cy={pin.y + 1} r={r} fill="rgba(0,0,0,0.12)" />
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
    );
}

// Event detail popup card
function EventPopup({ event, learnedIds, eventMastery, onClose }) {
    if (!event) return null;
    return (
        <div className="mt-3 animate-fade-in">
            <Card style={{ borderLeft: `3px solid ${isDiHEvent(event) ? '#E6A817' : (CATEGORY_CONFIG[event.category]?.color || '#999')}` }}>
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <CategoryTag category={event.category} />
                        <ImportanceTag importance={event.importance} />
                    </div>
                    <button onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-xs"
                        style={{ color: 'var(--color-ink-muted)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <h4 className="text-base font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                    {event.title}
                </h4>
                <p className="text-xs mb-1" style={{ color: 'var(--color-burgundy)' }}>
                    {event.date}
                </p>
                {learnedIds.has(event.id) && event.description && (
                    <ExpandableText lines={2} className="text-xs leading-relaxed mb-2" style={{ color: 'var(--color-ink-secondary)' }}>
                        {event.description}
                    </ExpandableText>
                )}
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-ink-muted)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {event.location.place}
                </div>
                {eventMastery[event.id] && (
                    <div className="mt-2">
                        <MasteryDots mastery={eventMastery[event.id]} />
                    </div>
                )}
            </Card>
        </div>
    );
}

// Cluster list popup
function ClusterPopup({ events, learnedIds, onSelectEvent, onClose }) {
    if (!events) return null;
    return (
        <div className="mt-3 animate-fade-in">
            <Card>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-ink-faint)' }}>
                        {events.length} events at this location
                    </p>
                    <button onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-xs"
                        style={{ color: 'var(--color-ink-muted)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                {events.map(evt => {
                    const isLearned = learnedIds.has(evt.id);
                    return (
                        <div key={evt.id}
                            className="flex items-center gap-2 py-2 cursor-pointer active:opacity-70"
                            style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}
                            onClick={() => onSelectEvent(evt)}>
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
    );
}

// Region event card list — shows learned events in the selected sub-region
function RegionEventList({ events, learnedIds, eventMastery, selectedRegion, onSelectEvent, onClose }) {
    if (!selectedRegion) return null;
    const regionEvents = events
        .filter(e => learnedIds.has(e.id) && e.location.region === selectedRegion)
        .sort((a, b) => a.year - b.year);
    const colors = REGION_COLORS[selectedRegion];

    return (
        <div className="mt-3 animate-fade-in">
            <Card>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors?.vibrant }} />
                        <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--color-ink-faint)' }}>
                            {selectedRegion} \u00B7 {regionEvents.length} event{regionEvents.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-xs"
                        style={{ color: 'var(--color-ink-muted)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                {regionEvents.length === 0 ? (
                    <p className="text-xs py-2" style={{ color: 'var(--color-ink-muted)' }}>
                        No events learned in this region yet.
                    </p>
                ) : (
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {regionEvents.map(evt => (
                            <div key={evt.id}
                                className="flex items-center gap-2 py-2 cursor-pointer active:opacity-70"
                                style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}
                                onClick={() => onSelectEvent(evt)}>
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: CATEGORY_CONFIG[evt.category]?.color || '#999' }} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-ink)' }}>
                                        {evt.title}
                                    </p>
                                    <p className="text-[11px]" style={{ color: 'var(--color-ink-muted)' }}>{evt.date}</p>
                                </div>
                                {eventMastery[evt.id] && (
                                    <MasteryDots mastery={eventMastery[evt.id]} size="sm" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}


export default function MapView({ events, learnedIds, eventMastery, selectedRegion, onRegionSelect }) {
    const [selectedPin, setSelectedPin] = useState(null);
    const [clusterExpanded, setClusterExpanded] = useState(false);
    const [legendVisible, setLegendVisible] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const fullscreenScrollRef = useRef(null);
    const hasScrolledRef = useRef(false);
    const { mapContainerRef, cssTransform, isZoomed, onTouchStart, onTouchMove, onTouchEnd, onWheel, resetZoom } = usePanZoom();

    // Show all learned events on the map (pins), but filter by region only for the event list
    const allLearnedEvents = useMemo(() =>
        events.filter(e => learnedIds.has(e.id)),
    [events, learnedIds]);

    const pins = useMemo(() => clusterPins(allLearnedEvents, learnedIds), [allLearnedEvents, learnedIds]);

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

    const handleCountryClick = useCallback((subRegion) => {
        // Tapping the already-selected region deselects it
        const newRegion = selectedRegion === subRegion ? null : subRegion;
        onRegionSelect(newRegion || 'all');
        setSelectedPin(null);
        setClusterExpanded(false);
        feedback.tap();
    }, [selectedRegion, onRegionSelect]);

    const handleMapBgClick = () => {
        setSelectedPin(null);
        setClusterExpanded(false);
        setLegendVisible(false);
        // Clicking empty space deselects region
        if (selectedRegion) {
            onRegionSelect('all');
        }
    };

    // Center fullscreen scroll on Europe/Middle East on first open
    useEffect(() => {
        if (isFullscreen) {
            hasScrolledRef.current = false;
        }
    }, [isFullscreen]);

    useEffect(() => {
        if (isFullscreen && fullscreenScrollRef.current && !hasScrolledRef.current) {
            requestAnimationFrame(() => {
                const container = fullscreenScrollRef.current;
                if (!container) return;
                const mapWidth = container.scrollWidth;
                const mapHeight = container.scrollHeight;
                container.scrollLeft = Math.max(0, mapWidth * 0.42 - container.clientWidth / 2);
                container.scrollTop = Math.max(0, mapHeight * 0.22 - container.clientHeight / 2);
                hasScrolledRef.current = true;
            });
        }
    }, [isFullscreen]);

    // Auto-scroll fullscreen map to selected region
    useEffect(() => {
        if (!isFullscreen || !selectedRegion || !fullscreenScrollRef.current) return;
        const center = REGION_CENTERS[selectedRegion];
        if (!center) return;
        const container = fullscreenScrollRef.current;
        const mapWidth = container.scrollWidth;
        const mapHeight = container.scrollHeight;
        const fracX = center.x / 800;
        const fracY = center.y / 500;
        const targetLeft = Math.max(0, mapWidth * fracX - container.clientWidth / 2);
        const targetTop = Math.max(0, mapHeight * fracY - container.clientHeight / 2);
        container.scrollTo({ left: targetLeft, top: targetTop, behavior: 'smooth' });
    }, [isFullscreen, selectedRegion]);

    const selectedEvent = selectedPin?.event;
    const clusterEvents = selectedPin?.events;

    const sharedSvgProps = {
        pins, learnedIds, selectedRegion,
        selectedPin, selectedEventId, selectedClusterXY,
        handlePinClick, handleMapBgClick, handleCountryClick,
    };

    // Popup content shared between inline and fullscreen
    const popupContent = (
        <>
            {selectedEvent && (
                <EventPopup event={selectedEvent} learnedIds={learnedIds} eventMastery={eventMastery}
                    onClose={() => setSelectedPin(null)} />
            )}
            {clusterEvents && clusterExpanded && (
                <ClusterPopup events={clusterEvents} learnedIds={learnedIds}
                    onSelectEvent={(evt) => { setSelectedPin({ event: evt }); setClusterExpanded(false); }}
                    onClose={() => { setSelectedPin(null); setClusterExpanded(false); }} />
            )}
            {/* Region event list — shown when a sub-region is selected and no pin/cluster is open */}
            {!selectedEvent && !clusterExpanded && selectedRegion && (
                <RegionEventList
                    events={events}
                    learnedIds={learnedIds}
                    eventMastery={eventMastery}
                    selectedRegion={selectedRegion}
                    onSelectEvent={(evt) => { setSelectedPin({ event: evt }); }}
                    onClose={() => onRegionSelect('all')}
                />
            )}
        </>
    );

    // ─── Fullscreen overlay ───
    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-[999] flex flex-col animate-fade-in"
                 style={{ backgroundColor: 'var(--color-parchment)' }}>
                <div
                    ref={fullscreenScrollRef}
                    className="flex-1 overflow-auto relative"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    <div className="sticky top-0 left-0 right-0 z-20 flex items-center justify-between px-3 pt-3 pb-1"
                         style={{ pointerEvents: 'none' }}>
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold"
                            style={{
                                pointerEvents: 'auto',
                                backgroundColor: 'rgba(var(--color-parchment-rgb, 250, 246, 240), 0.85)',
                                color: 'var(--color-ink-muted)',
                                backdropFilter: 'blur(4px)',
                            }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M4 14h6v6" /><path d="M20 10h-6V4" /><path d="M14 10l7-7" /><path d="M3 21l7-7" />
                            </svg>
                            Close
                        </button>
                        <div className="flex items-center gap-2" style={{ pointerEvents: 'auto' }}>
                            {isZoomed && (
                                <button
                                    onClick={resetZoom}
                                    className="px-2.5 py-1.5 rounded-full text-[11px] font-semibold"
                                    style={{
                                        backgroundColor: 'rgba(var(--color-parchment-rgb, 250, 246, 240), 0.85)',
                                        color: 'var(--color-ink-muted)',
                                        backdropFilter: 'blur(4px)',
                                    }}>
                                    Reset zoom
                                </button>
                            )}
                            <Legend visible={legendVisible} onToggle={() => setLegendVisible(v => !v)} className="relative z-10" />
                        </div>
                    </div>

                    <div
                        ref={mapContainerRef}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        onWheel={onWheel}
                        style={{
                            width: '280%',
                            marginTop: '-44px',
                            transform: cssTransform,
                            transformOrigin: 'center center',
                            transition: isZoomed ? 'none' : 'transform 0.3s ease-out',
                            touchAction: isZoomed ? 'none' : 'pan-x pan-y',
                        }}
                    >
                        <MapSVG {...sharedSvgProps}
                            viewBox="0 0 800 500"
                            svgClassName="w-full"
                            svgStyle={{ display: 'block' }} />
                    </div>
                </div>

                <div className="flex-shrink-0 px-3 pb-3" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                    {popupContent}
                </div>
            </div>
        );
    }

    // ─── Normal (inline) mode ───
    return (
        <div className="relative">
            <div className="relative rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)', backgroundColor: 'var(--color-map-ocean, #D6CFC4)' }}>
                <Legend visible={legendVisible} onToggle={() => setLegendVisible(v => !v)} />

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

                <button
                    onClick={() => { setIsFullscreen(true); resetZoom(); }}
                    className="absolute bottom-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                        backgroundColor: 'rgba(var(--color-ink-rgb), 0.06)',
                        color: 'var(--color-ink-muted)',
                    }}
                    title="Full screen"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" />
                    </svg>
                </button>

                <div style={{ overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' }}>
                    <div
                        ref={mapContainerRef}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        onWheel={onWheel}
                        style={{
                            width: '200%',
                            overflow: 'hidden',
                            transform: cssTransform,
                            transformOrigin: 'center center',
                            transition: isZoomed ? 'none' : 'transform 0.3s ease-out',
                            touchAction: isZoomed ? 'none' : 'pan-x pan-y',
                        }}
                    >
                        <MapSVG {...sharedSvgProps}
                            viewBox="0 0 800 500"
                            svgClassName="w-full"
                            svgStyle={{ display: 'block' }} />
                    </div>
                </div>
            </div>

            {popupContent}

            {allLearnedEvents.length === 0 && !selectedRegion && (
                <div className="text-center py-8">
                    <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                        No events match the current filters.
                    </p>
                </div>
            )}
        </div>
    );
}
