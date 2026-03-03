// ─── SVG WORLD MAP DATA ──────────────────────────────────────────────
// Simplified continent outlines for the Timeline map view.
// ViewBox: 0 0 800 450. Equirectangular projection.

// Simplified continent path data (pre-projected into 800x450 viewBox)
export const MAP_REGIONS = {
    Europe: {
        paths: [
            // Mainland Europe + British Isles
            "M355 75 L360 80 370 78 385 82 400 80 420 85 430 88 440 95 445 105 450 115 448 125 440 130 435 138 440 145 445 150 450 155 445 160 435 158 425 155 415 158 405 160 395 155 385 152 375 150 365 148 355 145 350 140 345 135 340 130 335 128 330 132 325 140 320 145 318 140 320 135 325 128 330 120 335 115 340 108 345 100 348 92 352 85 Z",
            // Scandinavia
            "M370 55 L375 50 380 48 385 52 390 58 395 55 400 50 405 48 408 55 405 62 400 68 395 72 388 75 380 72 375 68 370 62 Z",
            // Iceland
            "M310 48 L318 45 325 48 322 52 315 52 Z",
        ],
        labelPos: { x: 390, y: 120 },
    },
    "Middle East": {
        paths: [
            // Arabian Peninsula + Levant + Mesopotamia
            "M450 155 L458 148 468 145 478 148 488 155 498 160 505 168 510 178 508 188 502 198 495 205 488 210 478 215 468 218 458 215 450 210 445 205 448 198 452 190 455 180 458 170 455 162 Z",
        ],
        labelPos: { x: 478, y: 185 },
    },
    Africa: {
        paths: [
            // Africa continent
            "M345 195 L350 188 358 182 368 178 378 180 388 182 398 185 408 188 418 192 428 198 435 205 440 215 445 225 448 238 445 252 440 265 435 278 428 290 418 300 408 308 398 315 388 318 378 320 368 318 358 312 350 305 345 295 342 285 340 272 338 260 340 248 342 235 342 222 343 210 Z",
        ],
        labelPos: { x: 388, y: 260 },
    },
    Asia: {
        paths: [
            // East/South/Southeast Asia + Russia (east of Urals)
            "M455 60 L470 55 488 52 508 50 528 48 548 50 568 55 588 52 608 50 628 55 648 58 665 62 678 68 688 78 695 88 698 98 695 108 688 115 678 118 668 115 658 118 648 125 638 130 628 128 618 132 608 138 600 145 592 150 585 158 578 165 572 170 568 178 572 185 578 190 582 198 578 205 572 210 565 208 558 202 552 198 548 205 542 210 535 208 528 202 520 198 512 195 505 190 498 185 505 178 510 168 505 160 498 155 488 150 478 148 468 145 458 148 450 155 448 148 450 138 455 130 462 122 468 118 475 115 480 108 478 100 472 92 468 85 462 78 458 70 Z",
            // India subcontinent
            "M535 165 L540 170 548 175 552 182 548 192 542 200 535 208 528 202 522 195 518 188 520 180 525 172 530 168 Z",
            // Japan/Korea
            "M680 88 L685 82 690 85 688 92 684 96 680 92 Z",
        ],
        labelPos: { x: 590, y: 110 },
    },
    Americas: {
        paths: [
            // North America
            "M60 45 L75 42 95 40 115 42 135 45 155 50 170 55 185 60 198 68 208 78 215 88 220 98 222 108 218 118 212 125 205 132 198 140 192 148 188 155 192 162 198 170 202 178 198 185 192 188 185 185 178 180 170 178 165 182 158 188 152 192 148 195 L142 192 135 188 128 185 120 180 112 178 105 182 98 188",
            // Central America bridge + South America
            "M98 188 L102 195 108 200 115 205 118 212 115 220 112 228 115 235 120 242 128 248 135 255 140 265 142 278 140 292 135 305 128 318 120 328 112 335 105 342 98 348 92 352 88 358 85 365 88 372 92 378 95 385 92 390 85 392 78 388 72 382 68 375 65 365 62 355 60 342 58 328 55 315 55 302 58 290 62 278 68 268 75 258 82 248 88 240 92 232 95 225 98 218 100 210 100 200 Z",
            // Greenland
            "M225 22 L240 18 255 20 265 25 268 32 262 38 252 42 242 40 232 35 228 28 Z",
        ],
        labelPos: { x: 140, y: 145 },
    },
};

// Region centers for fallback positioning (SVG coords)
export const REGION_CENTERS = {
    Europe: { x: 390, y: 110 },
    "Middle East": { x: 478, y: 175 },
    Africa: { x: 385, y: 260 },
    Asia: { x: 590, y: 100 },
    Americas: { x: 140, y: 140 },
};

// Normalize daily quiz regions to match core event regions
export function normalizeRegion(region) {
    if (region === 'North America') return 'Americas';
    return region;
}

// Equirectangular projection: lat/lng → SVG coordinates (800x450 viewBox)
export function projectToSVG(lat, lng, region) {
    // Handle the lat:0 lng:0 edge case (f35 Circumnavigation, tagged "Europe")
    if (lat === 0 && lng === 0 && region) {
        const norm = normalizeRegion(region);
        const center = REGION_CENTERS[norm];
        if (center) return center;
    }
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 450;
    return { x, y };
}
