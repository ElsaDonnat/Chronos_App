/**
 * Generates src/data/mapPaths.js using Natural Earth I projection.
 *
 * Usage: node scripts/write-map-data.mjs
 *
 * Runs generate-map-paths.mjs logic internally, then writes the complete
 * mapPaths.js file including SUB_REGIONS, REGION_CENTERS, projectToSVG, etc.
 */

import { readFileSync, writeFileSync } from 'fs';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath, geoContains } from 'd3-geo';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Load world TopoJSON ───
const worldTopo = JSON.parse(
    readFileSync(join(__dirname, '../node_modules/world-atlas/countries-110m.json'), 'utf-8')
);
const countries = feature(worldTopo, worldTopo.objects.countries);

// ─── Country → continent mapping (ISO 3166-1 numeric codes) ───
const CONTINENT_MAP = {
    Europe: new Set([
        '008','020','040','051','056','070','100','112','191','196','203','208',
        '233','234','246','250','276','292','300','348','352','372','380','428',
        '438','440','442','470','492','498','499','528','578','616','620','642',
        '643','674','688','703','705','724','752','756','804','807','826','831',
        '832','833','680','010',
    ]),
    'Middle East': new Set([
        '031','048','051','196','268','275','364','368','376','400','414',
        '422','512','634','682','760','792','784','887','524',
    ]),
    Africa: new Set([
        '012','024','072','084','108','120','132','140','148','174','178',
        '180','204','226','231','232','262','266','270','288','324','384',
        '404','426','430','434','450','454','466','478','480','504','508',
        '516','562','566','624','638','646','678','686','694','706','710',
        '716','728','729','732','748','768','788','800','834','854','894',
        '818','736',
    ]),
    Asia: new Set([
        '004','050','064','096','104','116','144','156','158','166','170',
        '242','258','296','356','360','392','398','408','410','417','418',
        '446','458','462','496','524','540','548','586','598','608','626',
        '643','702','704','760','762','764','795','798','860',
    ]),
    Americas: new Set([
        '028','032','044','052','060','068','074','076','084','124','136',
        '152','170','188','192','212','214','218','222','238','254','304',
        '308','312','316','320','328','332','340','388','474','484','500',
        '531','533','534','535','558','591','600','604','630','652','659',
        '660','662','663','666','670','740','780','796','840','850','858',
        '862',
    ]),
};

const CODE_OVERRIDE = {
    '051': 'Europe',
    '196': 'Europe',
    '643': 'Europe',
    '760': 'Middle East',
    '792': 'Middle East',
    '524': 'Asia',
    '084': 'Americas',
    '170': 'Americas',
};

function getContinent(code) {
    if (CODE_OVERRIDE[code]) return CODE_OVERRIDE[code];
    for (const [continent, codes] of Object.entries(CONTINENT_MAP)) {
        if (codes.has(code)) return continent;
    }
    return null;
}

// ─── Projection setup ───
const WIDTH = 800;
const HEIGHT = 500;

const projection = geoNaturalEarth1()
    .translate([WIDTH / 2, HEIGHT / 2])
    .scale(1);

const pathGen = geoPath(projection);
const testFeature = { type: 'Sphere' };
const [[x0, y0], [x1, y1]] = pathGen.bounds(testFeature);
const testWidth = x1 - x0;
const testHeight = y1 - y0;
const scale = Math.min(WIDTH / testWidth, HEIGHT / testHeight) * 0.98;

projection.scale(scale);

const pathGen2 = geoPath(projection);
const [[bx0, by0], [bx1, by1]] = pathGen2.bounds(testFeature);
const cx = (bx0 + bx1) / 2;
const cy = (by0 + by1) / 2;
projection.translate([WIDTH / 2 - cx + WIDTH / 2, HEIGHT / 2 - cy + HEIGHT / 2]);

const finalPath = geoPath(projection);

// ─── Group countries by continent and generate paths ───
const continentCountries = {};
for (const [continent] of Object.entries(CONTINENT_MAP)) {
    continentCountries[continent] = [];
}

for (const country of countries.features) {
    const code = country.id || country.properties?.iso_n3;
    const continent = getContinent(code);
    if (!continent) continue;
    const d = finalPath(country);
    if (d) {
        continentCountries[continent].push({
            code: String(code),
            name: country.properties?.name || '',
            d: roundPath(d),
        });
    }
}

// Round path coordinates to integers
function roundPath(d) {
    return d.replace(/(\d+\.\d+)/g, (match) => Math.round(parseFloat(match)).toString());
}

// ─── Calculate label positions ───
const labelPositions = {};
for (const [continent, ctries] of Object.entries(continentCountries)) {
    if (ctries.length === 0) continue;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const country of countries.features) {
        const code = country.id || country.properties?.iso_n3;
        if (getContinent(code) !== continent) continue;
        const bounds = finalPath.bounds(country);
        if (bounds) {
            minX = Math.min(minX, bounds[0][0]);
            minY = Math.min(minY, bounds[0][1]);
            maxX = Math.max(maxX, bounds[1][0]);
            maxY = Math.max(maxY, bounds[1][1]);
        }
    }
    labelPositions[continent] = {
        x: Math.round((minX + maxX) / 2),
        y: Math.round((minY + maxY) / 2),
    };
}

// Adjustments
labelPositions['Europe'] = { x: labelPositions['Europe'].x - 10, y: labelPositions['Europe'].y + 15 };
labelPositions['Americas'] = { x: Math.round(labelPositions['Americas'].x * 0.85), y: labelPositions['Americas'].y };
if (labelPositions['Middle East']) {
    labelPositions['Middle East'] = { x: labelPositions['Middle East'].x + 20, y: labelPositions['Middle East'].y };
}

// ─── Get projection parameters for projectToSVG ───
const [originX, originY] = projection([0, 0]);
const projTranslate = projection.translate();

console.log(`Projection scale: ${scale.toFixed(4)}`);
console.log(`Projection translate: [${projTranslate.map(v => Math.round(v)).join(', ')}]`);
console.log(`Origin (0,0): (${Math.round(originX)}, ${Math.round(originY)})`);

// Test points to verify
const testPoints = [
    { name: 'London', lat: 51.5, lng: -0.1 },
    { name: 'Cairo', lat: 30.0, lng: 31.2 },
    { name: 'New York', lat: 40.7, lng: -74.0 },
    { name: 'Tokyo', lat: 35.7, lng: 139.7 },
    { name: 'Cape Town', lat: -33.9, lng: 18.4 },
    { name: 'Sydney', lat: -33.9, lng: 151.2 },
    { name: 'Mexico City', lat: 19.4, lng: -99.1 },
];

for (const pt of testPoints) {
    const [px, py] = projection([pt.lng, pt.lat]);
    console.log(`${pt.name}: (${pt.lat}, ${pt.lng}) -> (${Math.round(px)}, ${Math.round(py)})`);
}

// ─── Calculate REGION_CENTERS for sub-regions ───
// Use projection to place sub-region centers
const subRegionCoords = {
    'Europe':          { lat: 50, lng: 15 },
    'Middle East':     { lat: 30, lng: 45 },
    'North Africa':    { lat: 28, lng: 10 },
    'West Africa':     { lat: 8, lng: -2 },
    'East Africa':     { lat: -2, lng: 35 },
    'Southern Africa': { lat: -25, lng: 25 },
    'South Asia':      { lat: 22, lng: 78 },
    'East Asia':       { lat: 35, lng: 110 },
    'North America':   { lat: 45, lng: -100 },
    'Central America': { lat: 15, lng: -88 },
    'South America':   { lat: -15, lng: -58 },
};

const regionCenters = {};
for (const [region, coords] of Object.entries(subRegionCoords)) {
    const [px, py] = projection([coords.lng, coords.lat]);
    regionCenters[region] = { x: Math.round(px), y: Math.round(py) };
    console.log(`Region ${region}: (${Math.round(px)}, ${Math.round(py)})`);
}

// ─── Build EVENT_COUNTRY_MAP: event ID → country ISO code ───
// Parse event locations from source files and use geoContains for point-in-polygon
const eventsSource = readFileSync(join(__dirname, '../src/data/events.js'), 'utf-8')
    + '\n' + readFileSync(join(__dirname, '../src/data/dailyQuiz.js'), 'utf-8');

const eventRegex = /id:\s*["']([^"']+)["'][\s\S]*?location:\s*\{[^}]*lat:\s*([-\d.]+)\s*,\s*lng:\s*([-\d.]+)/g;
const eventCountryMap = {};
let evMatch;
let unmappedEvents = [];
while ((evMatch = eventRegex.exec(eventsSource)) !== null) {
    const [, id, latStr, lngStr] = evMatch;
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    // Skip lat:0 lng:0 (abstract locations like "Circumnavigation")
    if (lat === 0 && lng === 0) continue;
    let found = null;
    for (const c of countries.features) {
        if (geoContains(c, [lng, lat])) {
            found = c.id || c.properties?.iso_n3;
            break;
        }
    }
    if (found) {
        eventCountryMap[id] = String(found);
    } else {
        unmappedEvents.push({ id, lat, lng });
    }
}

// Manual overrides for events that fall outside 110m-simplified coastlines
const MANUAL_COUNTRY_OVERRIDES = {
    'f20': '792',   // Constantinople (Istanbul) → Turkey
    'f22': '792',   // Constantinople → Turkey
    'f31': '792',   // Constantinople → Turkey
    'f92': '792',   // Constantinople → Turkey
    'f52': '840',   // New York → USA
    'f57': '840',   // Cape Canaveral → USA
    'f127': '300',  // Halicarnassus → Greece
    'f129': '380',  // Syracuse → Italy
};

const stillUnmapped = [];
for (const ev of unmappedEvents) {
    if (MANUAL_COUNTRY_OVERRIDES[ev.id]) {
        eventCountryMap[ev.id] = MANUAL_COUNTRY_OVERRIDES[ev.id];
    } else {
        stillUnmapped.push(ev);
    }
}

console.log(`\nEVENT_COUNTRY_MAP: ${Object.keys(eventCountryMap).length} events mapped to countries`);
if (stillUnmapped.length > 0) {
    console.log(`Unmapped events (no country match): ${stillUnmapped.map(e => `${e.id}(${e.lat},${e.lng})`).join(', ')}`);
}

// ─── Assemble the output file ───
let output = `// \u2500\u2500\u2500 SVG WORLD MAP DATA (Natural Earth I projection, 110m) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n`;
output += `// Auto-generated by: node scripts/write-map-data.mjs\n`;
output += `// Projection: Natural Earth I. ViewBox: 0 0 ${WIDTH} ${HEIGHT}.\n`;
output += `// Scale: ${scale.toFixed(4)}, Translate: [${projTranslate.map(v => Math.round(v)).join(', ')}]\n`;
output += `\n`;
output += `export const MAP_REGIONS = {\n`;

for (const [continent, ctries] of Object.entries(continentCountries)) {
    if (ctries.length === 0) continue;
    const label = labelPositions[continent];
    output += `    ${JSON.stringify(continent)}: {\n`;
    output += `        countries: [\n`;
    for (const c of ctries) {
        output += `            { code: ${JSON.stringify(c.code)}, name: ${JSON.stringify(c.name)}, d: ${JSON.stringify(c.d)} },\n`;
    }
    output += `        ],\n`;
    output += `        labelPos: { x: ${label.x}, y: ${label.y} },\n`;
    output += `    },\n`;
}

output += `};\n`;
output += `\n`;

// SUB_REGIONS
output += `// \u2500\u2500\u2500 Sub-region system \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n`;
output += `// 11 sub-regions mapped to 5 continent SVG groups.\n`;
output += `// Events use sub-regions; the map highlights the parent continent.\n`;
output += `\n`;
output += `export const SUB_REGIONS = [\n`;
output += `    'Europe', 'Middle East',\n`;
output += `    'North Africa', 'West Africa', 'East Africa', 'Southern Africa',\n`;
output += `    'South Asia', 'East Asia',\n`;
output += `    'North America', 'Central America', 'South America',\n`;
output += `];\n`;
output += `\n`;

// REGION_TO_CONTINENT
output += `// Map sub-region \u2192 continent SVG group name\n`;
output += `export const REGION_TO_CONTINENT = {\n`;
output += `    'Europe': 'Europe',\n`;
output += `    'Middle East': 'Middle East',\n`;
output += `    'North Africa': 'Africa',\n`;
output += `    'West Africa': 'Africa',\n`;
output += `    'East Africa': 'Africa',\n`;
output += `    'Southern Africa': 'Africa',\n`;
output += `    'South Asia': 'Asia',\n`;
output += `    'East Asia': 'Asia',\n`;
output += `    'North America': 'Americas',\n`;
output += `    'Central America': 'Americas',\n`;
output += `    'South America': 'Americas',\n`;
output += `};\n`;
output += `\n`;

// REGION_CENTERS
output += `// Approximate SVG centers for each sub-region (Natural Earth I projection)\n`;
output += `export const REGION_CENTERS = {\n`;
for (const [region, center] of Object.entries(regionCenters)) {
    output += `    ${JSON.stringify(region)}: { x: ${center.x}, y: ${center.y} },\n`;
}
output += `};\n`;
output += `\n`;

// normalizeRegion
output += `// Normalize any legacy or variant region name \u2192 canonical sub-region\n`;
output += `export function normalizeRegion(region) {\n`;
output += `    if (region === 'Africa') return 'East Africa';       // legacy fallback\n`;
output += `    if (region === 'Asia') return 'East Asia';            // legacy fallback\n`;
output += `    if (region === 'Americas') return 'North America';    // legacy fallback\n`;
output += `    return region;\n`;
output += `}\n`;
output += `\n`;

// regionToContinent
output += `// Sub-region \u2192 continent for map SVG group highlighting\n`;
output += `export function regionToContinent(region) {\n`;
output += `    return REGION_TO_CONTINENT[region] || REGION_TO_CONTINENT[normalizeRegion(region)] || 'Europe';\n`;
output += `}\n`;
output += `\n`;

// projectToSVG using Natural Earth I polynomial coefficients
output += `// Natural Earth I projection: lat/lng \u2192 SVG coordinates (${WIDTH}x${HEIGHT} viewBox)\n`;
output += `// Uses the same polynomial coefficients as d3-geo's geoNaturalEarth1.\n`;
output += `const PROJ_SCALE = ${scale.toFixed(4)};\n`;
output += `const PROJ_TX = ${Math.round(projTranslate[0])};\n`;
output += `const PROJ_TY = ${Math.round(projTranslate[1])};\n`;
output += `const A0 = 0.8707, A1 = -0.131979, A2 = -0.013791, A3 = 0.003971, A4 = -0.001529;\n`;
output += `const B0 = 1.007226, B1 = 0.015085, B2 = -0.044475, B3 = 0.028874, B4 = -0.005916;\n`;
output += `const DEG2RAD = Math.PI / 180;\n`;
output += `\n`;
output += `export function projectToSVG(lat, lng, region) {\n`;
output += `    // Handle the lat:0 lng:0 edge case (f35 Circumnavigation, tagged "Europe")\n`;
output += `    if (lat === 0 && lng === 0 && region) {\n`;
output += `        const center = REGION_CENTERS[region] || REGION_CENTERS[normalizeRegion(region)];\n`;
output += `        if (center) return center;\n`;
output += `    }\n`;
output += `    const lambda = lng * DEG2RAD;\n`;
output += `    const phi = lat * DEG2RAD;\n`;
output += `    const phi2 = phi * phi;\n`;
output += `    const phi4 = phi2 * phi2;\n`;
output += `    const rawX = lambda * (A0 + phi2 * (A1 + phi2 * (A2 + phi4 * (A3 + phi2 * A4))));\n`;
output += `    const rawY = phi * (B0 + phi2 * (B1 + phi2 * (B2 + phi4 * (B3 + phi2 * B4))));\n`;
output += `    return {\n`;
output += `        x: PROJ_SCALE * rawX + PROJ_TX,\n`;
output += `        y: -PROJ_SCALE * rawY + PROJ_TY,\n`;
output += `    };\n`;
output += `}\n`;
output += `\n`;

// EVENT_COUNTRY_MAP
output += `// Event ID → ISO 3166-1 numeric country code (generated via geoContains at build time)\n`;
output += `export const EVENT_COUNTRY_MAP = {\n`;
for (const [id, code] of Object.entries(eventCountryMap)) {
    output += `    ${JSON.stringify(id)}: ${JSON.stringify(code)},\n`;
}
output += `};\n`;

const outPath = join(__dirname, '../src/data/mapPaths.js');
writeFileSync(outPath, output, 'utf-8');
console.log(`\nWrote ${outPath} (${output.length} bytes)`);
