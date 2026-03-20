import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { CATEGORY_CONFIG as DEFAULT_CATEGORY_CONFIG, EVENT_CONNECTIONS as DEFAULT_EVENT_CONNECTIONS } from '../data/events';
import { MAP_REGIONS, REGION_CENTERS, projectToSVG, normalizeRegion, EVENT_COUNTRY_MAP, COUNTRY_TO_SUBREGION, REGION_COLORS } from '../data/mapPaths';
import { Card, CategoryTag, ImportanceTag, MasteryDots, ExpandableText } from './shared';
import { SLIDER_MAX, ERA_SLIDER_SEGMENTS, sliderToYear, yearToSlider, getTimeWindow, formatSliderYear, getEventTimeOpacity, getActiveEraId, getEraForYear, ERA_BUTTON_COLORS } from '../utils/timeSlider';
import * as feedback from '../services/feedback';
const CLUSTER_GRID = 25; // SVG units per grid cell

// ─── Era coloring ───
const ERA_COLORS = {
    prehistory:  { color: '#8B6F47', label: 'Prehistory' },
    ancient:     { color: '#C49A3C', label: 'Ancient' },
    medieval:    { color: '#2E5A88', label: 'Medieval' },
    earlymodern: { color: '#1A7A6D', label: 'E. Modern' },
    modern:      { color: '#8B3A3A', label: 'Modern' },
};

// ─── Connection arc helper ───
function arcControlPoint(x1, y1, x2, y2) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const offset = Math.min(dist * 0.3, 40);
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.max(dist, 0.01);
    return { x: mx + (dy / len) * offset, y: my - (dx / len) * offset };
}

// Map-specific color tokens (light / dark via CSS vars with fallbacks)
const MAP_COLORS = {
    ocean: 'var(--color-map-ocean, #D6CFC4)',
    land: 'var(--color-map-land, #E8E0D2)',
    border: 'var(--color-map-border, #A89878)',
    coastline: 'var(--color-map-coastline, #8B7D65)',
    graticule: 'var(--color-map-graticule, rgba(0,0,0,0.04))',
    pinStroke: 'var(--color-map-pin-stroke, #FFFDF9)',
    pinMuted: 'var(--color-map-pin-muted, #C9B896)',
    label: 'var(--color-map-label, #A8A29E)',
    labelActive: 'var(--color-map-label-active, #8B4157)',
};

function clusterPins(events, learnedIds, zoom = 1) {
    const gridSize = CLUSTER_GRID / Math.max(zoom, 1);
    const projected = events.map(e => {
        const pos = projectToSVG(e.location.lat, e.location.lng, normalizeRegion(e.location.region));
        return { event: e, x: pos.x, y: pos.y, learned: learnedIds.has(e.id) };
    });

    const grid = {};
    for (const pin of projected) {
        const key = `${Math.floor(pin.x / gridSize)},${Math.floor(pin.y / gridSize)}`;
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
function Graticule({ scale = 1 }) {
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
        <g stroke={MAP_COLORS.graticule} strokeWidth={0.5 / scale} fill="none" style={{ pointerEvents: 'none' }}>
            {lines}
        </g>
    );
}

// Connection arcs between related events
function ConnectionArcs({ selectedEventId, pins, learnedIds, scale, timeOpacities, eventConnections, categoryConfig }) {
    if (!selectedEventId) return null;
    const connections = eventConnections[selectedEventId];
    if (!connections || connections.length === 0) return null;

    // Find the selected pin's position
    const srcPin = pins.find(p => !p.cluster && p.event?.id === selectedEventId);
    if (!srcPin) return null;

    const arcs = [];
    for (const conn of connections) {
        const tgtPin = pins.find(p => !p.cluster && p.event?.id === conn.id);
        if (!tgtPin) continue;
        // Skip if target is invisible due to time filter
        if (timeOpacities && (timeOpacities.get(conn.id) ?? 1) <= 0) continue;

        const cp = arcControlPoint(srcPin.x, srcPin.y, tgtPin.x, tgtPin.y);
        const isLearned = learnedIds.has(conn.id);
        const catColor = categoryConfig[srcPin.event?.category]?.color || '#8B4157';

        arcs.push(
            <path
                key={conn.id}
                d={`M ${srcPin.x},${srcPin.y} Q ${cp.x},${cp.y} ${tgtPin.x},${tgtPin.y}`}
                fill="none"
                stroke={catColor}
                strokeWidth={1.5 / scale}
                opacity={isLearned ? 0.45 : 0.2}
                strokeDasharray={isLearned ? 'none' : `${4 / scale} ${3 / scale}`}
                strokeLinecap="round"
                style={{ pointerEvents: 'none', transition: 'opacity 0.3s' }}
            />
        );
    }

    if (arcs.length === 0) return null;
    return <g className="connection-arcs">{arcs}</g>;
}

// Map legend with category/era color mode toggle
function Legend({ visible, onToggle, className, colorMode, onColorModeChange, categoryConfig }) {
    const cats = Object.entries(categoryConfig);
    const eras = Object.entries(ERA_COLORS);
    const isEra = colorMode === 'era';
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
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid rgba(var(--color-ink-rgb), 0.1)',
                        boxShadow: 'var(--shadow-card)',
                        minWidth: 120,
                    }}
                >
                    {/* Color mode toggle */}
                    <div className="flex rounded-md overflow-hidden mb-1.5"
                        style={{ border: '1px solid rgba(var(--color-ink-rgb), 0.1)' }}>
                        {['category', 'era'].map(mode => (
                            <button key={mode}
                                onClick={(e) => { e.stopPropagation(); onColorModeChange(mode); }}
                                className="flex-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider transition-colors duration-150"
                                style={{
                                    backgroundColor: colorMode === mode ? 'var(--color-burgundy)' : 'transparent',
                                    color: colorMode === mode ? 'white' : 'var(--color-ink-muted)',
                                }}
                            >
                                {mode === 'category' ? 'Topic' : 'Era'}
                            </button>
                        ))}
                    </div>
                    {/* Legend entries */}
                    {isEra ? eras.map(([key, cfg]) => (
                        <div key={key} className="flex items-center gap-1.5 py-0.5">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                            <span className="text-[10px] font-medium" style={{ color: 'var(--color-ink-secondary)' }}>
                                {cfg.label}
                            </span>
                        </div>
                    )) : cats.map(([key, cfg]) => (
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

// Touch/mouse pinch-zoom handler with double-tap zoom
function usePanZoom() {
    const [scale, setScale] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const gestureRef = useRef(null);
    const mapContainerRef = useRef(null);
    const lastTapRef = useRef({ time: 0, x: 0, y: 0 });

    const zoomToPoint = useCallback((clientX, clientY, targetScale) => {
        const el = mapContainerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const xFrac = (clientX - rect.left) / rect.width;
        const yFrac = (clientY - rect.top) / rect.height;
        const maxPan = ((targetScale - 1) / 2) * 100;
        setScale(targetScale);
        setPanOffset({
            x: Math.min(Math.max((0.5 - xFrac) * 100 * (targetScale - 1), -maxPan), maxPan),
            y: Math.min(Math.max((0.5 - yFrac) * 100 * (targetScale - 1), -maxPan), maxPan),
        });
    }, []);

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

    return { mapContainerRef, cssTransform, isZoomed, scale, panOffset, onTouchStart, onTouchMove, onTouchEnd, onWheel, resetZoom, zoomToPoint, lastTapRef };
}

// Countries whose SVG paths cross the International Date Line — their fill spans the whole map
const DATELINE_COUNTRIES = new Set(['296', '242']); // Kiribati, Fiji

// Get fill color for a country based on its sub-region and selection state
function getCountryFill(countryCode, selectedRegion) {
    if (DATELINE_COUNTRIES.has(countryCode)) return 'none';
    const subRegion = COUNTRY_TO_SUBREGION[countryCode];
    if (!subRegion) return MAP_COLORS.land; // Antarctica or unmapped
    const colors = REGION_COLORS[subRegion];
    if (!colors) return MAP_COLORS.land;
    if (selectedRegion === subRegion) return colors.vibrant;
    return colors.pastel;
}

// The SVG map content — shared between normal and fullscreen modes
function MapSVG({ pins, learnedIds, selectedRegion, selectedPin, selectedEventId, selectedClusterXY, handlePinClick, handleMapBgClick, handleCountryClick, svgStyle, svgClassName, viewBox, timeOpacities, scale = 1, colorMode = 'category', categoryConfig = DEFAULT_CATEGORY_CONFIG, eventConnections = DEFAULT_EVENT_CONNECTIONS }) {
    const highlightedCountryCode = selectedEventId ? EVENT_COUNTRY_MAP[selectedEventId] : null;

    return (
        <svg viewBox={viewBox || "0 0 800 500"} className={svgClassName} style={svgStyle}
             onClick={handleMapBgClick}>
            {/* Ocean background */}
            <rect width="800" height="500" fill={MAP_COLORS.ocean} />

            {/* Graticule grid */}
            <Graticule scale={scale} />

            {/* Continent coastline outlines — drawn behind country borders for land/water contrast */}
            {Object.entries(MAP_REGIONS).map(([continentName, data]) => (
                <g key={`coast-${continentName}`} style={{ pointerEvents: 'none' }}>
                    {data.countries.map((country) => (
                        <path key={country.code} d={country.d}
                            fill="none"
                            stroke={MAP_COLORS.coastline}
                            strokeWidth={1.2 / scale}
                            strokeLinejoin="round"
                            opacity={selectedRegion ? 0.3 : 0.7}
                            style={{ transition: 'opacity 0.3s' }}
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
                                strokeWidth={(isCountryHighlighted ? 1.5 : 0.5) / scale}
                                opacity={isDimmed ? 0.4 : 1}
                                data-country={country.code}
                                className={subRegion ? 'map-country-hover' : undefined}
                                style={{
                                    cursor: subRegion ? 'pointer' : 'default',
                                    transition: 'fill 0.3s, stroke 0.3s, opacity 0.3s, filter 0.15s',
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
                        fontSize={11 / scale} fontWeight="600"
                        opacity={(selectedRegion ? 0.3 : 0.6) * Math.max(0, 1 - (scale - 1))}
                        style={{ pointerEvents: 'none', transition: 'opacity 0.3s' }}>
                        {continentName}
                    </text>
                </g>
            ))}

            {/* Connection arcs between related events */}
            <ConnectionArcs selectedEventId={selectedEventId} pins={pins}
                learnedIds={learnedIds} scale={scale} timeOpacities={timeOpacities}
                eventConnections={eventConnections} categoryConfig={categoryConfig} />

            {/* Selected pin highlight ring */}
            {selectedPin && (
                <g style={{ pointerEvents: 'none' }}>
                    {selectedEventId && (() => {
                        const pin = pins.find(p => !p.cluster && p.event?.id === selectedEventId);
                        if (!pin) return null;
                        return <circle cx={pin.x} cy={pin.y} r={12 / scale} fill="none" stroke={categoryConfig[pin.event.category]?.color || '#8B4157'} strokeWidth={2 / scale} opacity="0.4" className="map-pin-pulse" />;
                    })()}
                    {selectedClusterXY && (() => {
                        const pin = pins.find(p => p.cluster && `${p.x},${p.y}` === selectedClusterXY);
                        if (!pin) return null;
                        return <circle cx={pin.x} cy={pin.y} r={16 / scale} fill="none" stroke={categoryConfig[pin.category]?.color || '#8B4157'} strokeWidth={2 / scale} opacity="0.4" className="map-pin-pulse" />;
                    })()}
                </g>
            )}

            {/* Event pins */}
            {pins.map((pin, i) => {
                const isLearned = pin.cluster ? pin.learned : learnedIds.has(pin.event?.id);
                let catColor;
                if (colorMode === 'era') {
                    if (pin.cluster) {
                        // Use the most common era among cluster events
                        const eraCounts = {};
                        pin.events.forEach(e => { const era = getEraForYear(e.year); eraCounts[era] = (eraCounts[era] || 0) + 1; });
                        const topEra = Object.entries(eraCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'modern';
                        catColor = ERA_COLORS[topEra]?.color || '#8B4157';
                    } else {
                        catColor = ERA_COLORS[getEraForYear(pin.event?.year)]?.color || '#999';
                    }
                } else {
                    catColor = pin.cluster
                        ? (categoryConfig[pin.category]?.color || '#8B4157')
                        : (categoryConfig[pin.event?.category]?.color || '#999');
                }
                const pinColor = isLearned ? catColor : MAP_COLORS.pinMuted;
                const r = (pin.cluster ? 10 : 6) / scale;

                // Time filter opacity
                let tOp = 1;
                if (timeOpacities) {
                    if (pin.cluster) {
                        tOp = Math.max(0, ...pin.events.map(e => timeOpacities.get(e.id) ?? 0));
                    } else {
                        tOp = timeOpacities.get(pin.event?.id) ?? 1;
                    }
                }
                if (tOp <= 0) return null;

                return (
                    <g key={i} opacity={tOp < 1 ? tOp : undefined}
                       style={{ transition: timeOpacities ? 'opacity 0.3s' : undefined }}>
                        <g onClick={(e) => handlePinClick(pin, e)}
                           className="map-pin-hover"
                           style={{ cursor: 'pointer', animation: `mapPinEntrance 0.4s ease-out ${i * 30}ms both`, transition: 'filter 0.15s' }}>
                            <circle cx={pin.x} cy={pin.y} r={18 / scale} fill="transparent" />
                            <circle cx={pin.x} cy={pin.y + 1 / scale} r={r} fill="rgba(0,0,0,0.12)" />
                            <circle cx={pin.x} cy={pin.y} r={r}
                                fill={pinColor}
                                stroke={MAP_COLORS.pinStroke} strokeWidth={1.5 / scale}
                                opacity={isLearned ? 1 : 0.45}
                            />
                            {pin.cluster && (
                                <text x={pin.x} y={pin.y + 1 / scale} textAnchor="middle" dominantBaseline="middle"
                                    fill="white" fontSize={9 / scale} fontWeight="bold"
                                    style={{ pointerEvents: 'none' }}>
                                    {pin.count}
                                </text>
                            )}
                        </g>
                        {/* Pin label at zoom >= 2 (non-cluster, learned only) */}
                        {!pin.cluster && scale >= 2 && isLearned && (
                            <text
                                x={pin.x + r + 3 / scale}
                                y={pin.y + 0.5 / scale}
                                fontSize={8 / scale}
                                fontWeight="600"
                                fill="var(--color-ink)"
                                stroke="var(--color-parchment)"
                                strokeWidth={2.5 / scale}
                                paintOrder="stroke"
                                dominantBaseline="middle"
                                style={{ pointerEvents: 'none', fontFamily: 'var(--font-sans, DM Sans, sans-serif)' }}
                            >
                                {pin.event.title.length > 24 ? pin.event.title.slice(0, 21) + '\u2026' : pin.event.title}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

// Event detail popup card
function EventPopup({ event, learnedIds, eventMastery, onClose, categoryConfig }) {
    if (!event) return null;
    return (
        <div className="mt-3 animate-fade-in">
            <Card style={{ borderLeft: `3px solid ${event?.source === 'daily' ? '#E6A817' : (categoryConfig[event.category]?.color || '#999')}` }}>
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
function ClusterPopup({ events, learnedIds, onSelectEvent, onClose, categoryConfig }) {
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
                                style={{ backgroundColor: isLearned ? (categoryConfig[evt.category]?.color || '#999') : MAP_COLORS.pinMuted }} />
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
function RegionEventList({ events, learnedIds, eventMastery, selectedRegion, onSelectEvent, onClose, categoryConfig }) {
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
                            {selectedRegion} {'\u00B7'} {regionEvents.length} event{regionEvents.length !== 1 ? 's' : ''}
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
                                    style={{ backgroundColor: categoryConfig[evt.category]?.color || '#999' }} />
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


// Map search overlay
function MapSearch({ events, learnedIds, onSelectEvent, onClose, categoryConfig }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        // Auto-focus the input when search opens
        const timer = setTimeout(() => inputRef.current?.focus(), 50);
        return () => clearTimeout(timer);
    }, []);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (q.length < 2) return [];
        return events
            .filter(e => {
                if (!learnedIds.has(e.id)) return false;
                const yearStr = String(Math.abs(e.year));
                const title = e.title.toLowerCase();
                const region = (e.location?.region || '').toLowerCase();
                const place = (e.location?.place || '').toLowerCase();
                return title.includes(q) || region.includes(q) || place.includes(q) || yearStr.includes(q);
            })
            .slice(0, 6);
    }, [query, events, learnedIds]);

    return (
        <div className="animate-fade-in" style={{ pointerEvents: 'auto' }}>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                style={{
                    backgroundColor: 'rgba(var(--color-parchment-rgb, 250, 246, 240), 0.92)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(var(--color-ink-rgb), 0.1)',
                    boxShadow: 'var(--shadow-card)',
                }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="var(--color-ink-muted)" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search events\u2026"
                    className="flex-1 bg-transparent text-xs outline-none min-w-0"
                    style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-sans)' }}
                />
                <button onClick={onClose}
                    className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ color: 'var(--color-ink-muted)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
            {results.length > 0 && (
                <div className="mt-1 rounded-lg overflow-hidden"
                    style={{
                        backgroundColor: 'rgba(var(--color-parchment-rgb, 250, 246, 240), 0.95)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(var(--color-ink-rgb), 0.08)',
                        boxShadow: 'var(--shadow-card)',
                        maxHeight: '200px',
                        overflowY: 'auto',
                    }}>
                    {results.map(evt => (
                        <div key={evt.id}
                            className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer active:opacity-70"
                            style={{ borderBottom: '1px solid rgba(var(--color-ink-rgb), 0.04)' }}
                            onClick={() => { onSelectEvent(evt); onClose(); }}>
                            <div className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: categoryConfig[evt.category]?.color || '#999' }} />
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium truncate" style={{ color: 'var(--color-ink)' }}>
                                    {evt.title}
                                </p>
                                <p className="text-[9px]" style={{ color: 'var(--color-ink-muted)' }}>
                                    {evt.date} {'\u00B7'} {evt.location?.region}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {query.length >= 2 && results.length === 0 && (
                <div className="mt-1 px-2.5 py-2 rounded-lg text-[10px]"
                    style={{
                        backgroundColor: 'rgba(var(--color-parchment-rgb, 250, 246, 240), 0.95)',
                        color: 'var(--color-ink-muted)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(var(--color-ink-rgb), 0.08)',
                    }}>
                    No matching events found
                </div>
            )}
        </div>
    );
}

// Time slider component with animated playback
const PLAYBACK_DURATION_MS = 30000; // 30 seconds for full sweep

function TimeSlider({ value, onChange, onClose, learnedEventYears }) {
    const activeEra = getActiveEraId(value);
    const year = sliderToYear(value);
    const [isPlaying, setIsPlaying] = useState(false);
    const playStartRef = useRef(null); // { time, startValue }

    // Animated playback via requestAnimationFrame
    useEffect(() => {
        if (!isPlaying) { playStartRef.current = null; return; }
        let raf;
        const startValue = value;
        const remaining = SLIDER_MAX - startValue;
        if (remaining <= 0) { setIsPlaying(false); return; }
        const duration = (remaining / SLIDER_MAX) * PLAYBACK_DURATION_MS;
        const startTime = performance.now();
        playStartRef.current = { time: startTime, startValue };

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const newValue = Math.round(startValue + progress * remaining);
            onChange(newValue);
            if (progress >= 1) {
                setIsPlaying(false);
            } else {
                raf = requestAnimationFrame(tick);
            }
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePlayPause = () => {
        if (isPlaying) {
            setIsPlaying(false);
        } else {
            // If at the end, restart from beginning
            if (value >= SLIDER_MAX - 5) onChange(0);
            setIsPlaying(true);
        }
        feedback.tap();
    };

    const handleManualChange = (newValue) => {
        if (isPlaying) setIsPlaying(false);
        onChange(newValue);
    };

    const handleEraJump = (segId) => {
        if (isPlaying) setIsPlaying(false);
        const seg = ERA_SLIDER_SEGMENTS.find(s => s.id === segId);
        if (!seg) return;
        // Jump to median learned event year in this era (or midpoint if none)
        const eraYears = (learnedEventYears || [])
            .filter(y => y >= seg.start && y < seg.end)
            .sort((a, b) => a - b);
        if (eraYears.length > 0) {
            onChange(yearToSlider(eraYears[Math.floor(eraYears.length / 2)]));
        } else {
            onChange(Math.round((seg.sliderStart + seg.sliderEnd) / 2));
        }
        feedback.tap();
    };

    const handleClose = () => {
        if (isPlaying) setIsPlaying(false);
        onClose();
    };

    return (
        <div className="px-3 py-2" style={{ backgroundColor: 'rgba(var(--color-parchment-rgb, 250, 246, 240), 0.92)', backdropFilter: 'blur(4px)' }}>
            {/* Year display + play/pause + close */}
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={handlePlayPause}
                        className="w-5 h-5 flex items-center justify-center rounded-full transition-colors duration-150"
                        style={{
                            backgroundColor: isPlaying ? 'var(--color-burgundy)' : 'rgba(var(--color-ink-rgb), 0.08)',
                            color: isPlaying ? 'white' : 'var(--color-burgundy)',
                        }}
                        title={isPlaying ? 'Pause' : 'Play timeline'}
                    >
                        {isPlaying ? (
                            <svg width="8" height="8" viewBox="0 0 10 10">
                                <rect x="1" y="1" width="3" height="8" rx="0.5" fill="currentColor" />
                                <rect x="6" y="1" width="3" height="8" rx="0.5" fill="currentColor" />
                            </svg>
                        ) : (
                            <svg width="8" height="8" viewBox="0 0 10 10">
                                <path d="M2 1l7 4-7 4z" fill="currentColor" />
                            </svg>
                        )}
                    </button>
                    <p className="text-xs font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-burgundy)' }}>
                        {formatSliderYear(year)}
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className="w-5 h-5 flex items-center justify-center rounded-full"
                    style={{ color: 'var(--color-ink-muted)', backgroundColor: 'rgba(var(--color-ink-rgb), 0.06)' }}
                >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Slider track with era tick marks */}
            <div className="relative mb-1">
                <input
                    type="range"
                    min="0"
                    max={SLIDER_MAX}
                    value={value}
                    onChange={(e) => handleManualChange(Number(e.target.value))}
                    className="time-slider-input w-full"
                />
                {/* Era boundary tick marks */}
                {ERA_SLIDER_SEGMENTS.slice(1).map(seg => (
                    <div key={seg.id}
                        className="absolute top-1/2 -translate-y-1/2 w-px h-3"
                        style={{
                            left: `${(seg.sliderStart / SLIDER_MAX) * 100}%`,
                            backgroundColor: 'rgba(var(--color-ink-rgb), 0.15)',
                            pointerEvents: 'none',
                        }}
                    />
                ))}
            </div>

            {/* Era quick-jump buttons */}
            <div className="flex gap-0.5">
                {ERA_SLIDER_SEGMENTS.map(seg => (
                    <button key={seg.id}
                        onClick={() => handleEraJump(seg.id)}
                        className="flex-1 text-center py-0.5 rounded text-[9px] font-semibold transition-all duration-200 whitespace-nowrap"
                        style={{
                            backgroundColor: activeEra === seg.id ? ERA_BUTTON_COLORS[seg.id] : 'transparent',
                            color: activeEra === seg.id ? 'white' : 'var(--color-ink-faint)',
                        }}
                    >
                        {seg.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Mini-map (fullscreen overview) ───
function MiniMap({ scrollRef, scale, panOffset }) {
    const [viewport, setViewport] = useState(null);

    const countryPaths = useMemo(() =>
        Object.entries(MAP_REGIONS).flatMap(([, data]) =>
            data.countries.map(c => <path key={c.code} d={c.d} />)
        ), []);

    const updateViewport = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = el;
        if (!scrollWidth || !scrollHeight) return;

        const cx = scrollWidth / 2;
        const cy = scrollHeight / 2;
        const tx = (panOffset.x / 100) * scrollWidth;
        const ty = (panOffset.y / 100) * scrollHeight;

        // Inverse CSS transform: visible screen edges → element coords
        const eL = (scrollLeft - cx - tx) / scale + cx;
        const eR = (scrollLeft + clientWidth - cx - tx) / scale + cx;
        const eT = (scrollTop - cy - ty) / scale + cy;
        const eB = (scrollTop + clientHeight - cy - ty) / scale + cy;

        // Element coords → SVG viewBox coords
        const x = Math.max(0, (eL / scrollWidth) * 800);
        const y = Math.max(0, (eT / scrollHeight) * 500);
        const w = Math.max(8, Math.min(800, (eR / scrollWidth) * 800) - x);
        const h = Math.max(5, Math.min(500, (eB / scrollHeight) * 500) - y);

        setViewport({ x, y, w, h });
    }, [scrollRef, scale, panOffset]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        let raf;
        const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(updateViewport); };
        el.addEventListener('scroll', onScroll, { passive: true });
        const t = setTimeout(updateViewport, 80);
        return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); clearTimeout(t); };
    }, [scrollRef, updateViewport]);

    // Update on zoom/pan changes
    useEffect(updateViewport, [updateViewport]);

    const handleClick = useCallback((e) => {
        const el = scrollRef.current;
        if (!el) return;
        const r = e.currentTarget.getBoundingClientRect();
        const fx = (e.clientX - r.left) / r.width;
        const fy = (e.clientY - r.top) / r.height;
        el.scrollTo({
            left: fx * el.scrollWidth - el.clientWidth / 2,
            top: fy * el.scrollHeight - el.clientHeight / 2,
            behavior: 'smooth',
        });
        feedback.tap();
    }, [scrollRef]);

    if (!viewport) return null;

    return (
        <div onClick={handleClick}
            style={{
                width: 90, height: 56,
                borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
                backgroundColor: 'rgba(var(--color-parchment-rgb, 250, 246, 240), 0.92)',
                border: '1px solid rgba(var(--color-ink-rgb), 0.1)',
                boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
            }}>
            <svg viewBox="0 0 800 500" width="90" height="56" style={{ display: 'block' }}>
                <rect width="800" height="500" fill={MAP_COLORS.ocean} />
                <g fill={MAP_COLORS.land} stroke={MAP_COLORS.border} strokeWidth="2">
                    {countryPaths}
                </g>
                <rect x={viewport.x} y={viewport.y} width={viewport.w} height={viewport.h}
                    fill="rgba(139, 65, 87, 0.15)"
                    stroke="var(--color-burgundy)" strokeWidth="4" rx="3" />
            </svg>
        </div>
    );
}

// First-time fullscreen hints (gesture tutorial + orientation)
function FullscreenHints({ onDismiss }) {
    const [visible, setVisible] = useState(true);
    const dismiss = useCallback(() => { setVisible(false); onDismiss(); }, [onDismiss]);
    useEffect(() => {
        const t = setTimeout(dismiss, 4000);
        return () => clearTimeout(t);
    }, [dismiss]);
    if (!visible) return null;
    const isPortrait = typeof window !== 'undefined' && window.innerHeight > window.innerWidth;
    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center animate-fade-in"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            onClick={dismiss}>
            <div className="flex flex-col items-center gap-3 px-5 py-4 rounded-2xl"
                style={{
                    backgroundColor: 'rgba(var(--color-parchment-rgb, 250, 246, 240), 0.95)',
                    backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}>
                <div className="flex items-center gap-5">
                    <div className="flex flex-col items-center gap-1">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                            stroke="var(--color-ink-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="3" x2="12" y2="21" /><line x1="3" y1="12" x2="21" y2="12" />
                            <polyline points="8,7 12,3 16,7" /><polyline points="8,17 12,21 16,17" />
                            <polyline points="7,8 3,12 7,16" /><polyline points="17,8 21,12 17,16" />
                        </svg>
                        <span className="text-[10px] font-semibold" style={{ color: 'var(--color-ink-secondary)' }}>Scroll</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                            stroke="var(--color-ink-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="20" x2="10" y2="14" /><polyline points="4,15 4,20 9,20" />
                            <line x1="20" y1="4" x2="14" y2="10" /><polyline points="20,9 20,4 15,4" />
                        </svg>
                        <span className="text-[10px] font-semibold" style={{ color: 'var(--color-ink-secondary)' }}>Pinch to zoom</span>
                    </div>
                </div>
                {isPortrait && (
                    <div className="flex items-center gap-2 pt-2 w-full justify-center" style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.08)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="var(--color-ink-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                        </svg>
                        <span className="text-[10px]" style={{ color: 'var(--color-ink-muted)' }}>Rotate for wider view</span>
                    </div>
                )}
                <p className="text-[8px] mt-0.5" style={{ color: 'var(--color-ink-faint)' }}>Tap to dismiss</p>
            </div>
        </div>
    );
}

export default function MapView({
    events, learnedIds, eventMastery, selectedRegion, onRegionSelect,
    categoryConfig = DEFAULT_CATEGORY_CONFIG,
    eventConnections = DEFAULT_EVENT_CONNECTIONS,
}) {
    const [selectedPin, setSelectedPin] = useState(null);
    const [clusterExpanded, setClusterExpanded] = useState(false);
    const [legendVisible, setLegendVisible] = useState(false);
    const [colorMode, setColorMode] = useState(() => localStorage.getItem('chronos-map-color-mode') || 'category');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [pullDown, setPullDown] = useState(0);
    const [timeActive, setTimeActive] = useState(false);
    const [timeValue, setTimeValue] = useState(500); // Start at medieval midpoint
    const [searchActive, setSearchActive] = useState(false);
    const [hintsDismissed, setHintsDismissed] = useState(() => localStorage.getItem('chronos-map-fs-tutorial') === '1');
    const fullscreenScrollRef = useRef(null);
    const hasScrolledRef = useRef(false);
    const pullStartRef = useRef(null);
    const { mapContainerRef, cssTransform, isZoomed, scale, panOffset, onTouchStart, onTouchMove, onTouchEnd, onWheel, resetZoom, zoomToPoint, lastTapRef } = usePanZoom();

    // Debounced scale for zoom-aware clustering (avoids recalc during pinch gesture)
    const [clusterScale, setClusterScale] = useState(1);
    useEffect(() => {
        const timer = setTimeout(() => setClusterScale(scale), 150);
        return () => clearTimeout(timer);
    }, [scale]);

    const handleColorModeChange = useCallback((mode) => {
        setColorMode(mode);
        localStorage.setItem('chronos-map-color-mode', mode);
    }, []);

    const handleSearchSelect = useCallback((evt) => {
        setSelectedPin({ event: evt });
        setClusterExpanded(false);
        setSearchActive(false);
        // In fullscreen: auto-scroll to the pin's projected position
        if (isFullscreen && fullscreenScrollRef.current) {
            const pos = projectToSVG(evt.location.lat, evt.location.lng, normalizeRegion(evt.location.region));
            const container = fullscreenScrollRef.current;
            const mapWidth = container.scrollWidth;
            const mapHeight = container.scrollHeight;
            const fracX = pos.x / 800;
            const fracY = pos.y / 500;
            const targetLeft = Math.max(0, mapWidth * fracX - container.clientWidth / 2);
            const targetTop = Math.max(0, mapHeight * fracY - container.clientHeight / 2);
            container.scrollTo({ left: targetLeft, top: targetTop, behavior: 'smooth' });
        }
    }, [isFullscreen]);

    // Show all learned events on the map (pins), but filter by region only for the event list
    const allLearnedEvents = useMemo(() =>
        events.filter(e => learnedIds.has(e.id)),
    [events, learnedIds]);

    // Time slider: compute per-event opacity when active
    const timeOpacities = useMemo(() => {
        if (!timeActive) return null;
        const year = sliderToYear(timeValue);
        const halfWindow = getTimeWindow(year);
        const map = new Map();
        for (const e of allLearnedEvents) {
            map.set(e.id, getEventTimeOpacity(e, year, halfWindow));
        }
        return map;
    }, [timeActive, timeValue, allLearnedEvents]);

    const pins = useMemo(() => clusterPins(allLearnedEvents, learnedIds, clusterScale), [allLearnedEvents, learnedIds, clusterScale]);

    const selectedEventId = selectedPin?.event?.id;
    const selectedClusterXY = selectedPin?.events ? `${selectedPin.x},${selectedPin.y}` : null;

    const handlePinClick = (pin, e) => {
        e.stopPropagation();
        if (pin.cluster) {
            // Cluster drill-down: zoom in to separate pins, or show list at max zoom
            if (scale < 3) {
                const el = mapContainerRef.current;
                if (el) {
                    const rect = el.getBoundingClientRect();
                    // Convert SVG coords to client coords
                    const svgWidth = 800, svgHeight = 500;
                    const clientX = rect.left + (pin.x / svgWidth) * rect.width;
                    const clientY = rect.top + (pin.y / svgHeight) * rect.height;
                    zoomToPoint(clientX, clientY, Math.min(scale < 1.5 ? 2 : scale + 1.5, 4));
                }
                setSelectedPin(null);
                setClusterExpanded(false);
            } else {
                // At high zoom, show flat list as fallback
                setSelectedPin({ events: pin.events, x: pin.x, y: pin.y });
                setClusterExpanded(true);
            }
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

    // Double-tap detection on map background
    const handleMapBgClick = useCallback((e) => {
        const now = Date.now();
        const last = lastTapRef.current;
        const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);

        if (now - last.time < 350 && dist < 30) {
            // Double-tap: zoom to 2× or reset
            lastTapRef.current = { time: 0, x: 0, y: 0 };
            if (scale > 1) {
                resetZoom();
            } else {
                zoomToPoint(e.clientX, e.clientY, 2);
            }
            return;
        }
        lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };

        // Normal single-click: deselect
        setSelectedPin(null);
        setClusterExpanded(false);
        setLegendVisible(false);
        if (selectedRegion) {
            onRegionSelect('all');
        }
    }, [scale, resetZoom, zoomToPoint, lastTapRef, selectedRegion, onRegionSelect]);

    // Swipe-down to dismiss fullscreen
    const onFullscreenTouchStart = useCallback((e) => {
        if (e.touches.length === 1) {
            pullStartRef.current = {
                y: e.touches[0].clientY,
                scrollTop: fullscreenScrollRef.current?.scrollTop || 0,
            };
        }
    }, []);

    const onFullscreenTouchMove = useCallback((e) => {
        if (!pullStartRef.current || e.touches.length !== 1) return;
        const dy = e.touches[0].clientY - pullStartRef.current.y;
        if (pullStartRef.current.scrollTop <= 0 && dy > 0) {
            setPullDown(Math.min(dy * 0.5, 150));
        }
    }, []);

    const onFullscreenTouchEnd = useCallback(() => {
        if (pullDown > 80) {
            setIsFullscreen(false);
        }
        setPullDown(0);
        pullStartRef.current = null;
    }, [pullDown]);

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

    // First-time fullscreen hints (derived from isFullscreen + dismissal state)
    const showHints = isFullscreen && !hintsDismissed;
    const dismissHints = useCallback(() => {
        setHintsDismissed(true);
        localStorage.setItem('chronos-map-fs-tutorial', '1');
    }, []);

    const selectedEvent = selectedPin?.event;
    const clusterEvents = selectedPin?.events;

    const sharedSvgProps = {
        pins, learnedIds, selectedRegion,
        selectedPin, selectedEventId, selectedClusterXY,
        handlePinClick, handleMapBgClick, handleCountryClick,
        timeOpacities, scale, colorMode,
        categoryConfig, eventConnections,
    };

    const learnedEventYears = useMemo(() =>
        allLearnedEvents.map(e => e.year),
    [allLearnedEvents]);

    const timeSliderUI = timeActive && (
        <TimeSlider
            value={timeValue}
            onChange={setTimeValue}
            onClose={() => setTimeActive(false)}
            learnedEventYears={learnedEventYears}
        />
    );

    // Popup content shared between inline and fullscreen
    const popupContent = (
        <>
            {selectedEvent && (
                <EventPopup event={selectedEvent} learnedIds={learnedIds} eventMastery={eventMastery}
                    onClose={() => setSelectedPin(null)} categoryConfig={categoryConfig} />
            )}
            {clusterEvents && clusterExpanded && (
                <ClusterPopup events={clusterEvents} learnedIds={learnedIds}
                    onSelectEvent={(evt) => { setSelectedPin({ event: evt }); setClusterExpanded(false); }}
                    onClose={() => { setSelectedPin(null); setClusterExpanded(false); }}
                    categoryConfig={categoryConfig} />
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
                    categoryConfig={categoryConfig}
                />
            )}
        </>
    );

    // ─── Fullscreen overlay ───
    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-[999] flex flex-col animate-fade-in map-fullscreen-pull"
                 style={{
                     backgroundColor: 'var(--color-parchment)',
                     transform: pullDown > 0 ? `translateY(${pullDown}px)` : 'none',
                     opacity: pullDown > 0 ? Math.max(0.4, 1 - pullDown / 200) : 1,
                 }}>
                {/* Pull-down hint */}
                {pullDown > 10 && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                         style={{
                             backgroundColor: pullDown > 80 ? 'var(--color-burgundy)' : 'rgba(var(--color-ink-rgb), 0.08)',
                             color: pullDown > 80 ? 'white' : 'var(--color-ink-muted)',
                             transition: 'background-color 0.15s, color 0.15s',
                         }}>
                        {pullDown > 80 ? 'Release to close' : 'Pull down to close'}
                    </div>
                )}
                <div
                    ref={fullscreenScrollRef}
                    className="flex-1 overflow-auto relative"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                    onTouchStart={onFullscreenTouchStart}
                    onTouchMove={onFullscreenTouchMove}
                    onTouchEnd={onFullscreenTouchEnd}
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
                            <button
                                onClick={() => { setSearchActive(v => !v); feedback.tap(); }}
                                className="w-7 h-7 rounded-full flex items-center justify-center"
                                style={{
                                    backgroundColor: searchActive
                                        ? 'var(--color-burgundy)'
                                        : 'rgba(var(--color-parchment-rgb, 250, 246, 240), 0.85)',
                                    color: searchActive ? 'white' : 'var(--color-ink-muted)',
                                    backdropFilter: 'blur(4px)',
                                }}
                                title="Search events"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                </svg>
                            </button>
                            <button
                                onClick={() => { setTimeActive(v => !v); feedback.tap(); }}
                                className="w-7 h-7 rounded-full flex items-center justify-center"
                                style={{
                                    backgroundColor: timeActive
                                        ? 'var(--color-burgundy)'
                                        : 'rgba(var(--color-parchment-rgb, 250, 246, 240), 0.85)',
                                    color: timeActive ? 'white' : 'var(--color-ink-muted)',
                                    backdropFilter: 'blur(4px)',
                                }}
                                title="Time slider"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                </svg>
                            </button>
                            <Legend visible={legendVisible} onToggle={() => setLegendVisible(v => !v)} className="relative z-10"
                                colorMode={colorMode} onColorModeChange={handleColorModeChange} categoryConfig={categoryConfig} />
                        </div>
                    </div>

                    {/* Search bar (fullscreen) */}
                    {searchActive && (
                        <div className="sticky top-12 left-0 right-0 z-20 px-3"
                            style={{ pointerEvents: 'none' }}>
                            <div style={{ maxWidth: '280px' }}>
                                <MapSearch events={events} learnedIds={learnedIds}
                                    onSelectEvent={handleSearchSelect}
                                    onClose={() => setSearchActive(false)}
                                    categoryConfig={categoryConfig} />
                            </div>
                        </div>
                    )}

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

                {/* Mini-map overview */}
                {!selectedPin && (
                    <div className="absolute z-20 animate-fade-in"
                         style={{ bottom: timeActive ? 108 : 16, left: 12 }}>
                        <MiniMap scrollRef={fullscreenScrollRef} scale={scale} panOffset={panOffset} />
                    </div>
                )}

                {/* First-time fullscreen hints */}
                {showHints && <FullscreenHints onDismiss={dismissHints} />}

                {/* Time slider (fullscreen mode) */}
                {timeSliderUI && (
                    <div className="flex-shrink-0" style={{ borderTop: '1px solid rgba(var(--color-ink-rgb), 0.06)' }}>
                        {timeSliderUI}
                    </div>
                )}

                <div className="flex-shrink-0 px-3 pb-3" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                    {popupContent}
                </div>
            </div>
        );
    }

    // ─── Normal (inline) mode ───
    return (
        <div className="relative">
            <Legend visible={legendVisible} onToggle={() => setLegendVisible(v => !v)}
                colorMode={colorMode} onColorModeChange={handleColorModeChange} categoryConfig={categoryConfig} />
            <div className="relative rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)', backgroundColor: 'var(--color-map-ocean, #D6CFC4)' }}>

                {/* Top-left controls: zoom reset + search */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                    {isZoomed && (
                        <button
                            onClick={resetZoom}
                            className="w-6 h-6 rounded-full flex items-center justify-center animate-fade-in"
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
                        onClick={() => { setSearchActive(v => !v); feedback.tap(); }}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                            backgroundColor: searchActive ? 'var(--color-burgundy)' : 'rgba(var(--color-ink-rgb), 0.06)',
                            color: searchActive ? 'white' : 'var(--color-ink-muted)',
                        }}
                        title="Search events"
                    >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                </div>

                {/* Search bar (inline mode) */}
                {searchActive && (
                    <div className="absolute top-10 left-2 z-10" style={{ maxWidth: '220px' }}>
                        <MapSearch events={events} learnedIds={learnedIds}
                            onSelectEvent={handleSearchSelect}
                            onClose={() => setSearchActive(false)}
                            categoryConfig={categoryConfig} />
                    </div>
                )}

                {/* Time slider toggle */}
                <button
                    onClick={() => { setTimeActive(v => !v); feedback.tap(); }}
                    className="absolute bottom-2 left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                        backgroundColor: timeActive ? 'var(--color-burgundy)' : 'rgba(var(--color-ink-rgb), 0.06)',
                        color: timeActive ? 'white' : 'var(--color-ink-muted)',
                    }}
                    title="Time slider"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                </button>

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

                {/* Time slider panel (inline mode) */}
                {timeSliderUI}
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
