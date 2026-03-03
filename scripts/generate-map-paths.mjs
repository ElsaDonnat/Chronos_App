/**
 * Generate SVG world map paths using Natural Earth projection.
 *
 * Usage: node scripts/generate-map-paths.mjs
 *
 * Reads Natural Earth 110m country boundaries from world-atlas,
 * groups them by continent, and outputs SVG path data using
 * d3-geo's Natural Earth I projection into an 800×500 viewBox.
 *
 * Also outputs the projectToSVG function parameters so pins
 * land correctly on the new projection.
 */

import { readFileSync } from 'fs';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath } from 'd3-geo';

// ─── Load world TopoJSON ───
const worldTopo = JSON.parse(
    readFileSync(new URL('../node_modules/world-atlas/countries-110m.json', import.meta.url), 'utf-8')
);
const countries = feature(worldTopo, worldTopo.objects.countries);

// ─── Country → continent mapping (ISO 3166-1 numeric codes) ───
// Grouped into the 5 SVG continent groups used by MapView
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

// Some codes appear in multiple groups (e.g. 051 Armenia, 196 Cyprus, 643 Russia, 760 Syria)
// Prefer the group where they're most commonly placed on world maps:
const CODE_OVERRIDE = {
    '051': 'Europe',    // Armenia → Europe (cultural)
    '196': 'Europe',    // Cyprus → Europe
    '643': 'Europe',    // Russia → Europe (primary landmass rendered there)
    '760': 'Middle East', // Syria → Middle East
    '792': 'Middle East', // Turkey → Middle East
    '524': 'Asia',      // Nepal → Asia
    '084': 'Americas',  // Belize → Americas (not Africa)
    '170': 'Americas',  // Colombia → Americas (not Asia)
};

function getContinent(code) {
    if (CODE_OVERRIDE[code]) return CODE_OVERRIDE[code];
    for (const [continent, codes] of Object.entries(CONTINENT_MAP)) {
        if (codes.has(code)) return continent;
    }
    return null; // skip unknown
}

// ─── Projection setup ───
// Natural Earth I projection, centered at 0°, scaled to fit 800×500
const WIDTH = 800;
const HEIGHT = 500;

const projection = geoNaturalEarth1()
    .translate([WIDTH / 2, HEIGHT / 2])
    .scale(1);

// Calculate scale to fit the world
const pathGen = geoPath(projection);
const testFeature = { type: 'Sphere' };
const [[x0, y0], [x1, y1]] = pathGen.bounds(testFeature);
const testWidth = x1 - x0;
const testHeight = y1 - y0;
const scale = Math.min(WIDTH / testWidth, HEIGHT / testHeight) * 0.98; // 2% margin

projection.scale(scale);

// Recenter after scaling
const pathGen2 = geoPath(projection);
const [[bx0, by0], [bx1, by1]] = pathGen2.bounds(testFeature);
const cx = (bx0 + bx1) / 2;
const cy = (by0 + by1) / 2;
projection.translate([WIDTH / 2 - cx + WIDTH / 2, HEIGHT / 2 - cy + HEIGHT / 2]);

const finalPath = geoPath(projection);

// ─── Group countries by continent and generate paths ───
const continentPaths = {};
for (const [continent] of Object.entries(CONTINENT_MAP)) {
    continentPaths[continent] = [];
}

for (const country of countries.features) {
    const code = country.id || country.properties?.iso_n3;
    const continent = getContinent(code);
    if (!continent) continue;

    const d = finalPath(country);
    if (d) {
        continentPaths[continent].push(d);
    }
}

// ─── Merge paths per continent (combine all country paths into one big path string) ───
const merged = {};
for (const [continent, paths] of Object.entries(continentPaths)) {
    if (paths.length > 0) {
        merged[continent] = paths.join('');
    }
}

// ─── Calculate label positions (centroid of each continent's combined geometry) ───
const labelPositions = {};
for (const [continent, paths] of Object.entries(continentPaths)) {
    if (paths.length === 0) continue;
    // Use bounding box center of all paths combined
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

// Manual label position adjustments for readability
labelPositions['Europe'] = { x: labelPositions['Europe'].x - 10, y: labelPositions['Europe'].y + 15 };
labelPositions['Americas'] = { x: Math.round(labelPositions['Americas'].x * 0.85), y: labelPositions['Americas'].y };
if (labelPositions['Middle East']) {
    labelPositions['Middle East'] = { x: labelPositions['Middle East'].x + 20, y: labelPositions['Middle East'].y };
}

// ─── Round path coordinates to integers to reduce file size ───
function roundPath(d) {
    return d.replace(/(\d+\.\d+)/g, (match) => Math.round(parseFloat(match)).toString());
}

// ─── Output ───
console.log('// ─── SVG WORLD MAP DATA (Natural Earth 110m) ──────────────────────');
console.log(`// Generated by: node scripts/generate-map-paths.mjs`);
console.log(`// Projection: Natural Earth I. ViewBox: 0 0 ${WIDTH} ${HEIGHT}.`);
console.log('');
console.log('export const MAP_REGIONS = {');

for (const [continent, path] of Object.entries(merged)) {
    const label = labelPositions[continent];
    const rounded = roundPath(path);
    console.log(`    ${JSON.stringify(continent)}: {`);
    console.log(`        paths: [`);
    console.log(`            ${JSON.stringify(rounded)},`);
    console.log(`        ],`);
    console.log(`        labelPos: { x: ${label.x}, y: ${label.y} },`);
    console.log(`    },`);
}

console.log('};');
console.log('');

// ─── Output projection parameters for projectToSVG ───
// Test a few known points to verify
const testPoints = [
    { name: 'London', lat: 51.5, lng: -0.1 },
    { name: 'Cairo', lat: 30.0, lng: 31.2 },
    { name: 'New York', lat: 40.7, lng: -74.0 },
    { name: 'Tokyo', lat: 35.7, lng: 139.7 },
    { name: 'Cape Town', lat: -33.9, lng: 18.4 },
    { name: 'Sydney', lat: -33.9, lng: 151.2 },
    { name: 'Mexico City', lat: 19.4, lng: -99.1 },
];

console.log('// ─── Projection test points ───');
for (const pt of testPoints) {
    const [px, py] = projection([pt.lng, pt.lat]);
    console.log(`// ${pt.name}: (${pt.lat}, ${pt.lng}) → (${Math.round(px)}, ${Math.round(py)})`);
}

// Output projection config
const [originX, originY] = projection([0, 0]);
console.log('');
console.log(`// Projection origin (0°, 0°): (${Math.round(originX)}, ${Math.round(originY)})`);
console.log(`// ViewBox: 0 0 ${WIDTH} ${HEIGHT}`);
console.log(`// Scale: ${scale.toFixed(4)}`);
console.log(`// Translate: [${projection.translate().map(v => Math.round(v)).join(', ')}]`);
