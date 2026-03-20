/**
 * Challenge mode question generation — creative question types.
 * All questions are binary (correct/incorrect), no yellow scoring.
 *
 * 35 questions across 6 tiers. From question 3 onward, roughly 1-in-3
 * questions draw from Level 2 events. Never more than 3 in a row from
 * the same level.
 *
 * categorySort is REMOVED — categories are editorial decisions, not
 * historical facts. Replaced with whichCameFirst and curated T/F.
 *
 * Dynamic T/F no longer swaps database fields (location/date/category).
 * Instead it uses conceptual misconception statements only.
 */

import { ALL_EVENTS, CATEGORY_CONFIG, ERA_RANGES, getEraForYear, isLevel2Event, EVENT_CONNECTIONS } from './events';
import { shuffle, generateDateMCQOptions, generateLocationOptions } from './quiz';

// ─── Curated question pools for Beginner & Amateur ──────────

/**
 * Each spec: { type, eventId, ...typeSpecificFields }
 * Built into full question objects by buildCuratedQuestion().
 */
const BEGINNER_QUESTIONS = [
    // whichCameFirst — intuitive, tests real knowledge (replaces categorySort)
    { type: 'whichCameFirst', eventIdA: 'f6', eventIdB: 'f7' },   // Neolithic Revolution vs Founding of Sumerian City-States
    { type: 'whichCameFirst', eventIdA: 'f8', eventIdB: 'f12' },  // Unification of Egypt vs First Olympics
    { type: 'whichCameFirst', eventIdA: 'f34', eventIdB: 'f46' }, // Renaissance vs Industrial Revolution
    { type: 'whichCameFirst', eventIdA: 'f33', eventIdB: 'f43' }, // Columbus vs French Revolution
    { type: 'whichCameFirst', eventIdA: 'f30', eventIdB: 'f32' }, // Black Death vs Gutenberg Press

    // eraDetective — curated: era genuinely ambiguous from title
    { type: 'eraDetective', eventId: 'f11' },  // Bronze Age Collapse → Ancient (sounds like it could be Prehistory)
    { type: 'eraDetective', eventId: 'f27' },  // Reign of Charlemagne → Medieval (many think Early Modern)
    { type: 'eraDetective', eventId: 'f32' },  // Gutenberg Printing Press → Medieval (most think Early Modern)
    { type: 'eraDetective', eventId: 'f24' },  // Founding of Islam → Medieval (many think Ancient)
    { type: 'eraDetective', eventId: 'f23' },  // Rise of the Maya Classical Period → Ancient (sounds Greco-Roman)
    { type: 'eraDetective', eventId: 'f28' },  // The Viking Age → Medieval (many think much older era)

    // trueOrFalse — conceptual misconceptions, not database drills
    { type: 'trueOrFalse', eventId: 'f15',
        statement: 'Alexander the Great was tutored by Aristotle as a young prince',
        isTrue: true },
    { type: 'trueOrFalse', eventId: 'f5',
        statement: 'Early humans left Africa by crossing the Bering Land Bridge',
        isTrue: false, correction: 'They migrated via the Arabian Peninsula. The Bering Land Bridge was used later to reach the Americas.' },
    { type: 'trueOrFalse', eventId: 'f34',
        statement: 'The Renaissance began in France before spreading across Europe',
        isTrue: false, correction: 'It began in Italy, particularly in Florence.' },
    { type: 'trueOrFalse', eventId: 'f9',
        statement: 'The earliest known writing system was Egyptian hieroglyphics',
        isTrue: false, correction: 'It was Sumerian cuneiform, developed in Mesopotamia.' },
    { type: 'trueOrFalse', eventId: 'f7',
        statement: 'The first cities in history were built along the Nile in Egypt',
        isTrue: false, correction: 'They emerged in Mesopotamia (modern Iraq).' },
    { type: 'trueOrFalse', eventId: 'f46',
        statement: 'The Industrial Revolution began in France',
        isTrue: false, correction: 'It began in Britain.' },
    { type: 'trueOrFalse', eventId: 'f31',
        statement: 'Constantinople was conquered by the Arabs during the Islamic expansion',
        isTrue: false, correction: 'It was conquered by the Ottoman Turks in 1453.' },
    { type: 'trueOrFalse', eventId: 'f17',
        statement: 'Julius Caesar was the first Emperor of Rome',
        isTrue: false, correction: 'Caesar was declared Dictator, not Emperor. His adopted heir Augustus (Octavian) became the first Emperor.' },
    { type: 'trueOrFalse', eventId: 'f53',
        statement: 'World War II ended when Germany surrendered; Japan had already surrendered earlier',
        isTrue: false, correction: 'Germany surrendered in May 1945 (V-E Day). Japan surrendered later, in August 1945 (V-J Day), after the atomic bombings.' },
    { type: 'trueOrFalse', eventId: 'f13',
        statement: 'The Roman Republic was founded after overthrowing a monarchy',
        isTrue: true },

    // ── whichCameFirst — accessible pairs with non-obvious order ──────
    { type: 'whichCameFirst', eventIdA: 'f15', eventIdB: 'f16' },  // Conquests of Alexander (-334) vs Qin Unification (-221) — Alexander first; many assume China predates Greece
    { type: 'whichCameFirst', eventIdA: 'f18', eventIdB: 'f19' },  // Augustus/Pax Romana (-27) vs Life of Jesus (-4) — Augustus first by 23 yrs; Jesus was born into an already-established Empire
    { type: 'whichCameFirst', eventIdA: 'f26', eventIdB: 'f29' },  // Islamic Golden Age (750) vs Mongol Empire (1206) — Golden Age first; both major medieval milestones

    // ── eraDetective — eras that surprise beginners ───────────────────
    { type: 'eraDetective', eventId: 'f41' },  // Watt Steam Engine (1776) → Early Modern; most beginners say "Modern"
    { type: 'eraDetective', eventId: 'f20' },  // Edict of Milan / Constantine (313 CE) → Ancient; most beginners say "Medieval"

    // ── trueOrFalse — common misconceptions ───────────────────────────
    { type: 'trueOrFalse', eventId: 'f12',
        statement: 'Women were allowed to compete in the Ancient Olympic Games',
        isTrue: false, correction: 'Women were forbidden from both competing and watching. A separate festival, the Heraea, allowed unmarried women to run at Olympia.' },
    { type: 'trueOrFalse', eventId: 'f35',
        statement: 'Ferdinand Magellan became the first person to circumnavigate the globe',
        isTrue: false, correction: 'Magellan was killed in the Philippines in 1521. His navigator Juan Sebasti\u00e1n Elcano commanded the remaining crew to complete the voyage.' },
    { type: 'trueOrFalse', eventId: 'f29',
        statement: 'Genghis Khan was born into a powerful noble Mongol family and inherited his leadership',
        isTrue: false, correction: 'He came from a minor tribal family. His father was poisoned when he was young, and he was briefly enslaved before rising to power through his own military genius.' },
    { type: 'trueOrFalse', eventId: 'f16',
        statement: 'China\u2019s Great Wall was built to keep out the Mongols',
        isTrue: false, correction: 'The Great Wall predates the Mongols by over 1,400 years. The Qin Dynasty (221 BCE) connected earlier walls to defend against various northern nomads. The iconic version most people picture was built mainly during the Ming Dynasty (1368\u20131644).' },
    { type: 'trueOrFalse', eventId: 'f50',
        statement: 'Vladimir Lenin personally led the revolution that overthrew the Russian Tsar in 1917',
        isTrue: false, correction: 'Lenin was in exile in Switzerland when the February Revolution spontaneously overthrew the Tsar. He returned to Russia later that year to lead the Bolshevik October Revolution, which overthrew the Provisional Government \u2014 not the Tsar.' },
];

const AMATEUR_QUESTIONS = [
    // whichCameFirst — harder pairs, same-era (replaces categorySort)
    { type: 'whichCameFirst', eventIdA: 'f20', eventIdB: 'f21' },  // Edict of Milan vs Fall of Western Rome
    { type: 'whichCameFirst', eventIdA: 'f36', eventIdB: 'f37' },  // Protestant Reformation vs Thirty Years' War
    { type: 'whichCameFirst', eventIdA: 'f42', eventIdB: 'f43' },  // American Revolution vs French Revolution

    // eraDetective — trickier era placement
    { type: 'eraDetective', eventId: 'f14' },  // Axial Age → Ancient (sounds abstract/modern)
    { type: 'eraDetective', eventId: 'f22' },  // Plague of Justinian → Medieval (many think Ancient)
    { type: 'eraDetective', eventId: 'f37' },  // Thirty Years' War → Early Modern (many think Medieval)
    { type: 'eraDetective', eventId: 'f38' },  // Scientific Revolution → Early Modern (many think Modern)

    // trueOrFalse — harder conceptual questions
    { type: 'trueOrFalse', eventId: 'f29',
        statement: 'The Mongol Empire was the largest contiguous land empire in history',
        isTrue: true },
    { type: 'trueOrFalse', eventId: 'f110',
        statement: "Mansa Musa\u2019s pilgrimage to Mecca was so lavish it crashed Egypt\u2019s gold economy",
        isTrue: true },
    { type: 'trueOrFalse', eventId: 'f45',
        statement: 'The Congress of Vienna was held to reshape Europe after World War I',
        isTrue: false, correction: 'It was held after Napoleon\u2019s defeat. The WWI peace conference was the Treaty of Versailles.' },
    { type: 'trueOrFalse', eventId: 'f36',
        statement: 'The Protestant Reformation was started by French theologian John Calvin',
        isTrue: false, correction: 'It was started by German monk Martin Luther in Wittenberg.' },

    // hardMCQ/location — same-region distractors for genuine difficulty
    { type: 'hardMCQ', subType: 'location', eventId: 'f12',
        options: [
            { label: 'Olympia, Greece', isCorrect: true },
            { label: 'Athens, Greece', isCorrect: false },
            { label: 'Delphi, Greece', isCorrect: false },
            { label: 'Sparta, Greece', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'location', eventId: 'f50',
        options: [
            { label: 'St. Petersburg, Russia', isCorrect: true },
            { label: 'Moscow, Russia', isCorrect: false },
            { label: 'Vladivostok, Russia', isCorrect: false },
            { label: 'Kiev, Ukraine', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'location', eventId: 'f33',
        options: [
            { label: 'The Caribbean', isCorrect: true },
            { label: 'Brazil', isCorrect: false },
            { label: 'Central America', isCorrect: false },
            { label: 'Florida', isCorrect: false },
        ] },

    // hardMCQ/date — tighter distractors that actually test knowledge
    { type: 'hardMCQ', subType: 'date', eventId: 'f35',
        prompt: 'When did the Magellan-Elcano circumnavigation set sail?',
        options: [
            { label: '1492', isCorrect: false },
            { label: '1507', isCorrect: false },
            { label: '1519', isCorrect: true },
            { label: '1534', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f62',
        prompt: 'When did the Haitian Revolution begin?',
        options: [
            { label: '1776', isCorrect: false },
            { label: '1789', isCorrect: false },
            { label: '1791', isCorrect: true },
            { label: '1804', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f25',
        prompt: 'When did the Tang Dynasty begin?',
        options: [
            { label: '476 CE', isCorrect: false },
            { label: '581 CE', isCorrect: false },
            { label: '618 CE', isCorrect: true },
            { label: '668 CE', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f22',
        prompt: 'When did the Plague of Justinian strike?',
        options: [
            { label: '410 CE', isCorrect: false },
            { label: '476 CE', isCorrect: false },
            { label: '541 CE', isCorrect: true },
            { label: '632 CE', isCorrect: false },
        ] },

    // ── whichCameFirst — surprisingly close pairs ────────────────
    { type: 'whichCameFirst', eventIdA: 'f24', eventIdB: 'f25' },  // Founding of Islam (610) vs Tang Dynasty (618) — only 8 yrs apart; Islam first
    { type: 'whichCameFirst', eventIdA: 'f32', eventIdB: 'f31' },  // Gutenberg Press (1440) vs Fall of Constantinople (1453) — 13 yrs; Gutenberg first

    // ── eraDetective — genuinely ambiguous from title ────────────
    { type: 'eraDetective', eventId: 'f40' },  // The Enlightenment → Early Modern (1685\u20131815; many assume it\u2019s Modern)
    { type: 'eraDetective', eventId: 'f26' },  // Islamic Golden Age → Medieval (750\u20131258 CE; sounds like Ancient or Early Modern)

    // ── trueOrFalse — conceptual misconceptions ──────────────────
    { type: 'trueOrFalse', eventId: 'f33',
        statement: 'Christopher Columbus died without ever setting foot in North America \u2014 all his landings were in the Caribbean, Central America, and South America',
        isTrue: true },
    { type: 'trueOrFalse', eventId: 'f38',
        statement: 'Galileo Galilei was imprisoned for life by the Catholic Church for supporting heliocentrism',
        isTrue: false, correction: 'Galileo was placed under house arrest at his villa in Arcetri, not imprisoned for life. He continued writing and died at home in 1642.' },
    { type: 'trueOrFalse', eventId: 'f44',
        statement: "Napoleon\u2019s first language was not French \u2014 he grew up speaking Corsican and Italian, and spoke French with an accent his whole life",
        isTrue: true },

    // ── hardMCQ/location — same-region distractors ──────────────
    { type: 'hardMCQ', subType: 'location', eventId: 'f26',
        options: [
            { label: 'Baghdad, Iraq', isCorrect: true },
            { label: 'Cairo, Egypt', isCorrect: false },
            { label: 'Damascus, Syria', isCorrect: false },
            { label: 'Cordoba, Spain', isCorrect: false },
        ] },  // Islamic Golden Age\u2019s House of Wisdom \u2014 all major Islamic centers in the same broad region
    { type: 'hardMCQ', subType: 'location', eventId: 'f44',
        options: [
            { label: 'Corsica, France', isCorrect: true },
            { label: 'Normandy, France', isCorrect: false },
            { label: 'Brittany, France', isCorrect: false },
            { label: 'Savoy, France', isCorrect: false },
        ] },  // Napoleon\u2019s birthplace \u2014 all French regions; Corsica was acquired from Genoa just a year before his birth

    // ── hardMCQ/date ─────────────────────────────────────────────
    { type: 'hardMCQ', subType: 'date', eventId: 'f29',
        prompt: 'When did Genghis Khan found the Mongol Empire?',
        options: [
            { label: '1162', isCorrect: false },  // Genghis Khan\u2019s birth year
            { label: '1206', isCorrect: true },
            { label: '1241', isCorrect: false },  // Mongol invasion of Europe (Battle of Legnica)
            { label: '1279', isCorrect: false },  // Kublai Khan completes conquest of China
        ] },  // Mongol Empire founded at the Kurultai \u2014 all key dates from Mongol history
];

// ─── Curated conceptual T/F pool (used by dynamic generator as fallback) ─

const CURATED_TF_POOL = [
    // Beginner-level misconceptions
    { eventId: 'f17', statement: 'Julius Caesar was killed by a single assassin acting alone', isTrue: false, correction: 'He was killed by a group of conspirators including Brutus and Cassius.' },
    { eventId: 'f18', statement: 'Augustus was the biological son of Julius Caesar', isTrue: false, correction: 'He was Caesar\u2019s adopted great-nephew, not his biological son.' },
    { eventId: 'f13', statement: 'The Roman Republic was founded after overthrowing a monarchy', isTrue: true },
    { eventId: 'f43', statement: 'The French Revolution happened before the American Revolution', isTrue: false, correction: 'The American Revolution (1776) came first. The French Revolution began in 1789.' },
    { eventId: 'f30', statement: 'The Black Death was caused by a virus similar to influenza', isTrue: false, correction: 'It was caused by the bacterium Yersinia pestis, carried by fleas on rats.' },
    { eventId: 'f21', statement: 'Rome fell to a single dramatic invasion', isTrue: false, correction: 'The decline took centuries. The traditional fall date of 476 CE was just the last Western emperor\u2019s deposition.' },
    { eventId: 'f44', statement: 'Napoleon crowned himself Emperor rather than letting the Pope do it', isTrue: true },
    { eventId: 'f40', statement: 'The Enlightenment rejected all religious belief entirely', isTrue: false, correction: 'Many Enlightenment thinkers were deists who believed in God but rejected organized religion\u2019s authority.' },
    { eventId: 'f42', statement: 'France was the first foreign nation to ally with the American Revolution', isTrue: true },

    // Harder misconceptions (Amateur+)
    { eventId: 'f10', statement: 'The Code of Hammurabi was the earliest known legal code', isTrue: false, correction: 'The Code of Ur-Nammu predates it by about three centuries.' },
    { eventId: 'f26', statement: 'During the Islamic Golden Age, Arabic scholars invented the concept of zero', isTrue: false, correction: 'Zero was invented in India. Arab scholars adopted and transmitted it to Europe.' },
    { eventId: 'f39', statement: 'The Atlantic Slave Trade primarily sent enslaved people to North America', isTrue: false, correction: 'The vast majority went to the Caribbean and Brazil. Only about 4% went to North America.' },
    { eventId: 'f48', statement: 'Britain was the first major power to abolish the slave trade', isTrue: true },
    { eventId: 'f32', statement: 'Gutenberg invented the concept of movable type printing', isTrue: false, correction: 'Movable type was invented centuries earlier in China and Korea. Gutenberg adapted it for European alphabets.' },
    { eventId: 'f88', statement: 'The Achaemenid Persian Empire allowed conquered peoples to keep their customs and religions', isTrue: true },
    { eventId: 'f47', statement: 'The 1848 revolutions succeeded in creating lasting democracies across Europe', isTrue: false, correction: 'Nearly all were suppressed or reversed within a year or two.' },
    { eventId: 'f55', statement: 'The Space Race began when the Soviet Union launched Sputnik', isTrue: true },
    { eventId: 'f62', statement: 'The Haitian Revolution was the only successful large-scale slave revolt in history', isTrue: true },
    { eventId: 'f65', statement: 'The Chinese Communist Revolution ended with Mao\u2019s forces defeating the Japanese', isTrue: false, correction: 'Mao defeated the Chinese Nationalists (Kuomintang) under Chiang Kai-shek. Japan had already surrendered in WWII.' },
];

// ─── Curated pools for Advanced & Historian ──────────────────

const ADVANCED_QUESTIONS = [
    // ── whichCameFirst — same-era, close dates ──────────────────────
    { type: 'whichCameFirst', eventIdA: 'f88', eventIdB: 'f13' },  // Achaemenid Persia (-550) vs Roman Republic (-509) — both ancient, ~40 yrs
    { type: 'whichCameFirst', eventIdA: 'f16', eventIdB: 'f89' },  // Qin unification (-221) vs Maurya Empire (-322) — both Asian empires, ~100 yrs
    { type: 'whichCameFirst', eventIdA: 'f92', eventIdB: 'f30' },  // Ottoman rise (1299) vs Black Death (1347) — both medieval, ~50 yrs
    { type: 'whichCameFirst', eventIdA: 'f61', eventIdB: 'f37' },  // English Civil War (1642) vs Thirty Years' War (1618) — both 17th-c. European conflicts
    { type: 'whichCameFirst', eventIdA: 'f102', eventIdB: 'f51' },  // Spanish Flu (1918) vs Treaty of Versailles (1919) — same era, 1 yr apart
    { type: 'whichCameFirst', eventIdA: 'f63', eventIdB: 'f48' },  // Latin American independence (1808) vs Global Abolition (1807) — 1 yr apart

    // ── trueOrFalse — subtle misconceptions ─────────────────────────
    { type: 'trueOrFalse', eventId: 'f93',
        statement: 'China\u2019s Ming Dynasty sent treasure fleets that reached the coast of East Africa',
        isTrue: true },  // Zheng He's fleets really did reach Africa
    { type: 'trueOrFalse', eventId: 'f96',
        statement: 'The Mughal Empire was founded by a descendant of Genghis Khan',
        isTrue: true },  // Babur descended from both Genghis Khan and Timur
    { type: 'trueOrFalse', eventId: 'f89',
        statement: 'Emperor Ashoka converted to Buddhism after witnessing the devastation of his own conquest',
        isTrue: true },  // Ashoka converted after the Kalinga war
    { type: 'trueOrFalse', eventId: 'f97',
        statement: 'The Antonine Plague was caused by the bubonic plague bacterium',
        isTrue: false, correction: 'It was most likely smallpox or measles, not bubonic plague. The bubonic plague (Yersinia pestis) caused the later Plague of Justinian and Black Death.' },
    { type: 'trueOrFalse', eventId: 'f102',
        statement: 'The Spanish Flu originated in Spain, which is how it got its name',
        isTrue: false, correction: 'It likely originated in the United States or France. Spain reported it openly because it was neutral in WWI and had no wartime censorship.' },
    { type: 'trueOrFalse', eventId: 'f70',
        statement: 'Alan Turing\u2019s theoretical work came after the invention of the first electronic computer',
        isTrue: false, correction: 'Turing\u2019s 1936 paper on the Universal Machine preceded ENIAC (1945) by nearly a decade.' },
    { type: 'trueOrFalse', eventId: 'f94',
        statement: 'At its peak, the British Empire controlled roughly a quarter of the world\u2019s land surface',
        isTrue: true },  // Genuinely surprising scope

    // ── hardMCQ/date — tight distractors within 30-50 years ─────────
    { type: 'hardMCQ', subType: 'date', eventId: 'f92',
        prompt: 'When did the Ottoman Empire begin its rise?',
        options: [
            { label: '1206', isCorrect: false },    // Mongol Empire
            { label: '1299', isCorrect: true },
            { label: '1347', isCorrect: false },    // Black Death
            { label: '1368', isCorrect: false },     // Ming Dynasty
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f61',
        prompt: 'When did the English Civil War begin?',
        options: [
            { label: '1618', isCorrect: false },    // Thirty Years' War
            { label: '1642', isCorrect: true },
            { label: '1665', isCorrect: false },    // Great Plague of London
            { label: '1685', isCorrect: false },     // Enlightenment
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f103',
        prompt: 'When did Alexander Fleming discover penicillin?',
        options: [
            { label: '1918', isCorrect: false },    // Spanish Flu
            { label: '1928', isCorrect: true },
            { label: '1936', isCorrect: false },    // Turing's paper
            { label: '1945', isCorrect: false },     // ENIAC
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f49',
        prompt: 'When was the Berlin Conference (Scramble for Africa)?',
        options: [
            { label: '1848', isCorrect: false },    // Revolutions of 1848
            { label: '1871', isCorrect: false },    // German unification
            { label: '1884', isCorrect: true },
            { label: '1914', isCorrect: false },     // WWI
        ] },

    // ── hardMCQ/location — same-country/region distractors ──────────
    { type: 'hardMCQ', subType: 'location', eventId: 'f99',
        options: [
            { label: 'London, England', isCorrect: true },
            { label: 'Bristol, England', isCorrect: false },
            { label: 'Edinburgh, Scotland', isCorrect: false },
            { label: 'Oxford, England', isCorrect: false },
        ] },  // Great Plague of London — all British cities
    { type: 'hardMCQ', subType: 'location', eventId: 'f73',
        options: [
            { label: 'Hanover, New Hampshire', isCorrect: true },
            { label: 'Cambridge, Massachusetts', isCorrect: false },
            { label: 'Princeton, New Jersey', isCorrect: false },
            { label: 'Palo Alto, California', isCorrect: false },
        ] },  // Dartmouth Conference — all US university towns
    { type: 'hardMCQ', subType: 'location', eventId: 'f85',
        options: [
            { label: 'Beijing, China', isCorrect: true },
            { label: 'Shanghai, China', isCorrect: false },
            { label: 'Nanjing, China', isCorrect: false },
            { label: 'Hong Kong, China', isCorrect: false },
        ] },  // Tiananmen Square — all Chinese cities

    // ── oddOneOut — 3 share a trait, 1 is the outlier ───────────────
    { type: 'oddOneOut', events: ['f97', 'f22', 'f30', 'f49'],
        outlierEventId: 'f49', sharedTrait: 'All major plagues/pandemics' },  // Berlin Conference is the outlier among plagues
    { type: 'oddOneOut', events: ['f88', 'f90', 'f93', 'f34'],
        outlierEventId: 'f34', sharedTrait: 'All Asian empires/dynasties' },  // Renaissance is the outlier among Asian empires
    { type: 'oddOneOut', events: ['f68', 'f70', 'f71', 'f101'],
        outlierEventId: 'f101', sharedTrait: 'All computing pioneers/milestones' },  // Cholera/epidemiology is the outlier among computing
    { type: 'oddOneOut', events: ['f81', 'f82', 'f83', 'f52'],
        outlierEventId: 'f52', sharedTrait: 'All civil rights/freedom movements' },  // Great Depression is the outlier among rights movements

    // ── whichCameFirst — close dates, different regions (Exploration/Trade/Women/Philosophy) ──
    { type: 'whichCameFirst', eventIdA: 'f141', eventIdB: 'f171' },  // Zheng He (1405) vs Joan of Arc (1429) — 24 yrs; Chinese treasure fleets sailed before Joan fought
    { type: 'whichCameFirst', eventIdA: 'f147', eventIdB: 'f157' },  // Invention of Coinage (-600) vs Confucius (-551) — 49 yrs; coins predate Confucius
    { type: 'whichCameFirst', eventIdA: 'f153', eventIdB: 'f172' },  // Dutch East India Co (1602) vs Queen Nzinga (1624) — 22 yrs; VOC formed before Nzinga\u2019s resistance began

    // ── trueOrFalse — conceptual misconceptions about under-represented chapters ──
    { type: 'trueOrFalse', eventId: 'f138',
        statement: 'Polynesian navigators used simple instruments like early compasses and astrolabes to navigate the Pacific',
        isTrue: false, correction: 'They used no instruments at all. They navigated by reading stars, ocean swells, bird flight patterns, and cloud formations \u2014 entirely through observation and memorized knowledge passed down orally.' },
    { type: 'trueOrFalse', eventId: 'f152',
        statement: 'The Medici family ruled Florence as hereditary nobility before establishing their famous banking empire',
        isTrue: false, correction: 'The Medicis were commoners who built their fortune through banking, then used that wealth to gain political influence and eventually become de facto rulers of Florence.' },
    { type: 'trueOrFalse', eventId: 'f170',
        statement: 'The Tale of Genji, written by a Japanese court lady around 1010 CE, is widely considered the world\u2019s first novel',
        isTrue: true },  // Murasaki Shikibu wrote it in Japanese rather than Chinese, making it a pioneering work of prose fiction

    // ── hardMCQ/location — same-country distractors ──
    { type: 'hardMCQ', subType: 'location', eventId: 'f141',
        options: [
            { label: 'Nanjing, China', isCorrect: true },
            { label: 'Beijing, China', isCorrect: false },      // Ming capital after 1421
            { label: 'Guangzhou, China', isCorrect: false },     // Major southern port city
            { label: 'Hangzhou, China', isCorrect: false },      // Former Song dynasty capital
        ] },  // Zheng He\u2019s fleets launched from Nanjing \u2014 all major Chinese cities

    // ── hardMCQ/date — tight distractors within 10-20 years ──
    { type: 'hardMCQ', subType: 'date', eventId: 'f155',
        prompt: 'When was the Bretton Woods Conference held?',
        options: [
            { label: '1936', isCorrect: false },     // Keynes publishes General Theory
            { label: '1944', isCorrect: true },
            { label: '1947', isCorrect: false },     // Marshall Plan announced
            { label: '1952', isCorrect: false },     // European Coal and Steel Community
        ] },  // All dates tied to post-Depression/WWII financial restructuring

    // ── oddOneOut — under-represented chapters ──
    { type: 'oddOneOut', events: ['f138', 'f140', 'f144', 'f150'],
        outlierEventId: 'f150', sharedTrait: 'All great voyages of exploration' },  // Paper Money in China is a financial innovation, not an exploration
    { type: 'oddOneOut', events: ['f167', 'f169', 'f172', 'f171'],
        outlierEventId: 'f171', sharedTrait: 'All women who held sovereign political power' },  // Joan of Arc was a military commander but never a ruler; the others were pharaoh, empress, and queen
];

const HISTORIAN_QUESTIONS = [
    // ── whichCameFirst — same-era, very close dates (<50 yrs) ───────
    { type: 'whichCameFirst', eventIdA: 'f107', eventIdB: 'f117' },  // Kingdom of Kush (-1070) vs Homer (-750) — both ancient, ~320 yrs but non-obvious order
    { type: 'whichCameFirst', eventIdA: 'f91', eventIdB: 'f108' },  // Gupta Golden Age (320) vs Aksumite Empire (100) — both ancient, Aksum earlier
    { type: 'whichCameFirst', eventIdA: 'f110', eventIdB: 'f92' },  // Mali Empire (1235) vs Ottoman rise (1299) — both medieval, ~64 yrs
    { type: 'whichCameFirst', eventIdA: 'f119', eventIdB: 'f113' },  // Renaissance Masters (1480) vs Kingdom of Benin (1440) — both medieval, ~40 yrs
    { type: 'whichCameFirst', eventIdA: 'f120', eventIdB: 'f98' },  // Shakespeare (1590) vs Smallpox/Aztec (1519) — both early modern, ~70 yrs
    { type: 'whichCameFirst', eventIdA: 'f121', eventIdB: 'f63' },  // Beethoven (1800) vs Latin Am. independence (1808) — modern, 8 yrs apart
    { type: 'whichCameFirst', eventIdA: 'f122', eventIdB: 'f115' },  // Impressionism (1874) vs Battle of Adwa (1896) — both late 19th c., ~22 yrs

    // ── trueOrFalse — expert-level misconceptions ───────────────────
    { type: 'trueOrFalse', eventId: 'f109',
        statement: 'The Ghana Empire was located in modern-day Ghana',
        isTrue: false, correction: 'The Ghana Empire was centered in modern Mauritania and Mali, far north of present-day Ghana. Modern Ghana took the name as a tribute when it gained independence in 1957.' },
    { type: 'trueOrFalse', eventId: 'f112',
        statement: 'Timbuktu was primarily a military fortress in the Songhai Empire',
        isTrue: false, correction: 'Timbuktu was a renowned center of learning and trade, home to Sankore University and thousands of manuscripts, not a military outpost.' },
    { type: 'trueOrFalse', eventId: 'f100',
        statement: 'Edward Jenner\u2019s smallpox vaccine used a weakened form of the smallpox virus itself',
        isTrue: false, correction: 'Jenner used cowpox, a related but less dangerous virus that provided cross-immunity to smallpox. Using weakened smallpox (variolation) was the older, riskier practice.' },
    { type: 'trueOrFalse', eventId: 'f90',
        statement: 'The Han Dynasty invented paper and opened the Silk Road',
        isTrue: true },  // Both are accurate Han achievements
    { type: 'trueOrFalse', eventId: 'f111',
        statement: 'Great Zimbabwe was built by foreign traders, not local African peoples',
        isTrue: false, correction: 'Great Zimbabwe was built by the ancestors of the Shona people. Colonial-era claims of foreign builders were racist myths designed to deny African architectural achievement.' },
    { type: 'trueOrFalse', eventId: 'f95',
        statement: 'The Ottoman Empire fell primarily because of internal revolution, not World War I',
        isTrue: false, correction: 'While internal tensions (Young Turks movement) played a role, entering WWI on the losing side was the decisive blow that led to the empire\u2019s dissolution.' },
    { type: 'trueOrFalse', eventId: 'f114',
        statement: 'Shaka Zulu\u2019s military innovations included the short stabbing spear and the \u201Cbull horn\u201D formation',
        isTrue: true },  // These are well-documented Zulu military innovations

    // ── hardMCQ/date — very tight distractors within 30-50 years ────
    { type: 'hardMCQ', subType: 'date', eventId: 'f107',
        prompt: 'When did the Kingdom of Kush emerge?',
        options: [
            { label: '1200 BCE', isCorrect: false },   // Bronze Age Collapse
            { label: '1070 BCE', isCorrect: true },
            { label: '776 BCE', isCorrect: false },     // Olympics
            { label: '550 BCE', isCorrect: false },      // Achaemenid Persia
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f115',
        prompt: 'When was the Battle of Adwa?',
        options: [
            { label: '1884', isCorrect: false },    // Berlin Conference
            { label: '1896', isCorrect: true },
            { label: '1908', isCorrect: false },    // Ottoman fall begins
            { label: '1914', isCorrect: false },     // WWI
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f116',
        prompt: 'When did the African Independence Wave begin?',
        options: [
            { label: '1945', isCorrect: false },    // End of WWII
            { label: '1948', isCorrect: false },    // Apartheid begins
            { label: '1957', isCorrect: true },
            { label: '1969', isCorrect: false },     // Stonewall
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f119',
        prompt: 'When were Renaissance Masters Leonardo & Michelangelo at their peak?',
        options: [
            { label: '1440', isCorrect: false },    // Gutenberg
            { label: '1453', isCorrect: false },    // Fall of Constantinople
            { label: '1480', isCorrect: true },
            { label: '1517', isCorrect: false },     // Protestant Reformation
        ] },

    // ── hardMCQ/location — same-region distractors ──────────────────
    { type: 'hardMCQ', subType: 'location', eventId: 'f96',
        options: [
            { label: 'Agra, India', isCorrect: true },
            { label: 'Pataliputra, India', isCorrect: false },
            { label: 'Calcutta, India', isCorrect: false },
            { label: 'Varanasi, India', isCorrect: false },
        ] },  // Mughal Empire — all Indian cities
    { type: 'hardMCQ', subType: 'location', eventId: 'f88',
        options: [
            { label: 'Persepolis, Persia', isCorrect: true },
            { label: 'Babylon, Mesopotamia', isCorrect: false },
            { label: 'Susa, Persia', isCorrect: false },
            { label: 'Damascus, Syria', isCorrect: false },
        ] },  // Achaemenid Persia — all Middle Eastern cities
    { type: 'hardMCQ', subType: 'location', eventId: 'f75',
        options: [
            { label: 'New York City, USA', isCorrect: true },
            { label: 'San Jose, California', isCorrect: false },
            { label: 'Boston, Massachusetts', isCorrect: false },
            { label: 'Philadelphia, Pennsylvania', isCorrect: false },
        ] },  // Deep Blue vs Kasparov — all US cities

    // ── oddOneOut — trickier groupings ──────────────────────────────
    { type: 'oddOneOut', events: ['f109', 'f110', 'f112', 'f92'],
        outlierEventId: 'f92', sharedTrait: 'All West African empires' },  // Ottoman Empire is the outlier among African empires
    { type: 'oddOneOut', events: ['f107', 'f108', 'f114', 'f96'],
        outlierEventId: 'f96', sharedTrait: 'All East/Southern African kingdoms' },  // Mughal Empire is the outlier among African kingdoms
    { type: 'oddOneOut', events: ['f119', 'f121', 'f122', 'f116'],
        outlierEventId: 'f116', sharedTrait: 'All art & culture movements' },  // African Independence is the outlier among art movements
    { type: 'oddOneOut', events: ['f100', 'f103', 'f101', 'f84'],
        outlierEventId: 'f84', sharedTrait: 'All medical breakthroughs' },  // Stonewall is the outlier among medical discoveries

    // ── whichCameFirst — non-Western focus, surprising order ──────────
    { type: 'whichCameFirst', eventIdA: 'f157', eventIdB: 'f127' },  // Confucius (-551) vs Hippocrates (-460) — 91 yrs; both Axial Age but Confucius came first, surprising to Western audiences
    { type: 'whichCameFirst', eventIdA: 'f170', eventIdB: 'f150' },  // Murasaki Shikibu (1010) vs Paper Money in China (1024) — only 14 yrs apart; Tale of Genji predates government paper currency

    // ── trueOrFalse — expert misconceptions about non-Western history ──
    { type: 'trueOrFalse', eventId: 'f66',
        statement: 'The 1979 Iranian Revolution was backed by a broad coalition \u2014 including liberals, Marxists, and nationalists \u2014 before Ayatollah Khomeini consolidated an Islamic theocracy',
        isTrue: true },  // The Shah\u2019s overthrow united many factions; Khomeini only marginalized them afterward
    { type: 'trueOrFalse', eventId: 'f150',
        statement: 'The Song Dynasty invented paper money in 1024 CE by government decree to replace the cumbersome iron coins merchants struggled with in Sichuan',
        isTrue: false, correction: 'Paper money was not invented by the government. Private Sichuan merchants created jiaozi promissory notes around 997 CE. The Song government nationalized and monopolized the system in 1024 \u2014 it did not invent it.' },
    { type: 'trueOrFalse', eventId: 'f160',
        statement: 'Ibn Khaldun\u2019s Muqaddimah, widely studied as a standalone work of philosophy, was actually written as the introduction to a much larger history of the world called the Kitab al-Ibar',
        isTrue: true },  // \u201CMuqaddimah\u201D literally means \u201CIntroduction\u201D \u2014 it was the prolegomena to his Kitab al-Ibar (Book of Lessons)

    // ── hardMCQ/date — tight distractors tied to medieval travelers ────
    { type: 'hardMCQ', subType: 'date', eventId: 'f140',
        prompt: 'When did Ibn Battuta begin his famous 29-year journey?',
        options: [
            { label: '1271 CE', isCorrect: false },   // Marco Polo left Venice
            { label: '1325 CE', isCorrect: true },
            { label: '1368 CE', isCorrect: false },   // Ming Dynasty founded
            { label: '1405 CE', isCorrect: false },   // Zheng He\u2019s first treasure fleet
        ] },  // All significant medieval travel/exploration dates

    // ── hardMCQ/location — same-region distractors ────────────────────
    { type: 'hardMCQ', subType: 'location', eventId: 'f149',
        options: [
            { label: 'Kilwa, Tanzania', isCorrect: true },
            { label: 'Mombasa, Kenya', isCorrect: false },       // Major Swahili port city
            { label: 'Zanzibar, Tanzania', isCorrect: false },   // Famous trading island
            { label: 'Sofala, Mozambique', isCorrect: false },   // Southernmost Swahili trading post
        ] },  // Indian Ocean Trade Network \u2014 all major Swahili coast cities
    { type: 'hardMCQ', subType: 'location', eventId: 'f157',
        options: [
            { label: 'Qufu, China', isCorrect: true },
            { label: 'Luoyang, China', isCorrect: false },    // Zhou capital; where Confucius reportedly met Laozi
            { label: 'Linzi, China', isCorrect: false },      // Capital of rival state Qi in same province
            { label: 'Handan, China', isCorrect: false },     // Capital of Zhao state
        ] },  // Confucius \u2014 all Warring States-era cities; Qufu was his birthplace in the state of Lu

    // ── oddOneOut — tricky groupings from trade and philosophy chapters ──
    { type: 'oddOneOut', events: ['f149', 'f151', 'f153', 'f154'],
        outlierEventId: 'f154', sharedTrait: 'All powerful trading networks or commercial organizations' },  // South Sea Bubble was a speculative crash, not a trading network
    { type: 'oddOneOut', events: ['f157', 'f158', 'f128', 'f160'],
        outlierEventId: 'f160', sharedTrait: 'All foundational thinkers of the ancient classical world' },  // Ibn Khaldun (14th century) is the outlier among pre-200 BCE scholars
];

// ─── Curated pool for Expert ─────────────────────────────────
// NO eraDetective — too easy at this level.
// Focuses on L2 events, extremely tight distractors, close-date pairs.

const EXPERT_QUESTIONS = [
    // whichCameFirst — pairs with dates <20 years apart
    { type: 'whichCameFirst', eventIdA: 'f64', eventIdB: 'f50' },   // WWI (1914) vs Russian Revolution (1917) — 3 years apart
    { type: 'whichCameFirst', eventIdA: 'f59', eventIdB: 'f57' },   // Fall of Berlin Wall (1989) vs Fall of Soviet Union (1991) — 2 years, constantly confused
    { type: 'whichCameFirst', eventIdA: 'f44', eventIdB: 'f45' },   // Napoleon (1799) vs Congress of Vienna (1815) — 16 years, causally linked
    { type: 'whichCameFirst', eventIdA: 'f72', eventIdB: 'f83' },   // Transistor (1947) vs Apartheid (1948) — 1 year apart
    { type: 'whichCameFirst', eventIdA: 'f113', eventIdB: 'f31' },  // Kingdom of Benin (1440) vs Fall of Constantinople (1453) — 13 years
    { type: 'whichCameFirst', eventIdA: 'f51', eventIdB: 'f81' },   // Treaty of Versailles (1919) vs Indian Independence & Gandhi (1920) — 1 year

    // oddOneOut — subtle shared traits
    { type: 'oddOneOut',
        events: ['f88', 'f92', 'f96', 'f109'],
        outlierEventId: 'f109', sharedTrait: 'All Asian empires' },
    { type: 'oddOneOut',
        events: ['f97', 'f99', 'f101', 'f70'],
        outlierEventId: 'f70', sharedTrait: 'All epidemics or plagues' },
    { type: 'oddOneOut',
        events: ['f119', 'f120', 'f121', 'f103'],
        outlierEventId: 'f103', sharedTrait: 'All arts & culture milestones' },
    { type: 'oddOneOut',
        events: ['f107', 'f108', 'f115', 'f98'],
        outlierEventId: 'f98', sharedTrait: 'All East African events' },

    // hardMCQ/location — same-country/same-region distractors
    { type: 'hardMCQ', subType: 'location', eventId: 'f93',
        options: [
            { label: 'Beijing, China', isCorrect: true },
            { label: 'Nanjing, China', isCorrect: false },
            { label: 'Hangzhou, China', isCorrect: false },
            { label: 'Xi\u2019an, China', isCorrect: false },
        ] },  // Ming Dynasty
    { type: 'hardMCQ', subType: 'location', eventId: 'f88',
        options: [
            { label: 'Persepolis, Persia', isCorrect: true },
            { label: 'Babylon, Mesopotamia', isCorrect: false },
            { label: 'Susa, Persia', isCorrect: false },
            { label: 'Ecbatana, Persia', isCorrect: false },
        ] },  // Achaemenid Empire
    { type: 'hardMCQ', subType: 'location', eventId: 'f112',
        options: [
            { label: 'Gao / Timbuktu, Mali', isCorrect: true },
            { label: 'Koumbi Saleh, Mauritania', isCorrect: false },
            { label: 'Niani, Mali', isCorrect: false },
            { label: 'Benin City, Nigeria', isCorrect: false },
        ] },  // Songhai Empire

    // hardMCQ/date — extremely tight distractors (within 10-30 years)
    { type: 'hardMCQ', subType: 'date', eventId: 'f102',
        prompt: 'When did the Spanish Flu pandemic begin?',
        options: [
            { label: '1914', isCorrect: false },
            { label: '1918', isCorrect: true },
            { label: '1929', isCorrect: false },
            { label: '1936', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f111',
        prompt: 'When did Great Zimbabwe reach its peak?',
        options: [
            { label: '800 CE', isCorrect: false },
            { label: '1100 CE', isCorrect: true },
            { label: '1235 CE', isCorrect: false },
            { label: '1350 CE', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f91',
        prompt: 'When did the Gupta Golden Age begin?',
        options: [
            { label: '250 CE', isCorrect: false },
            { label: '320 CE', isCorrect: true },
            { label: '476 CE', isCorrect: false },
            { label: '541 CE', isCorrect: false },
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f116',
        prompt: 'When did Ghana become the first sub-Saharan African country to gain independence?',
        options: [
            { label: '1945', isCorrect: false },
            { label: '1951', isCorrect: false },
            { label: '1957', isCorrect: true },
            { label: '1963', isCorrect: false },
        ] },

    // ── whichCameFirst — dates <20 years apart, non-obvious order ────
    { type: 'whichCameFirst', eventIdA: 'f134', eventIdB: 'f135' },  // Marie Curie (1898) vs Einstein (1905) — 7 yrs; many assume they were exact contemporaries, not that Curie came first
    { type: 'whichCameFirst', eventIdA: 'f125', eventIdB: 'f95' },   // Picasso's Cubism (1907) vs Fall of Ottoman Empire (1908) — 1 yr; revolutionary art began just before the empire crumbled
    { type: 'whichCameFirst', eventIdA: 'f104', eventIdB: 'f84' },   // WHO Smallpox campaign (1967) vs Stonewall uprising (1969) — 2 yrs; disease eradication and gay liberation were simultaneous

    // ── oddOneOut — subtle shared traits ─────────────────────────────
    { type: 'oddOneOut', events: ['f78', 'f80', 'f82', 'f86'],
        outlierEventId: 'f86', sharedTrait: 'All successful civil rights and liberation movements' },  // Rwanda Genocide is an atrocity against an oppressed group, not a liberation movement
    { type: 'oddOneOut', events: ['f62', 'f65', 'f66', 'f132'],
        outlierEventId: 'f132', sharedTrait: 'All political revolutions that established new governments' },  // Lavoisier\u2019s \u201CChemical Revolution\u201D overthrew a scientific theory, not a government

    // ── hardMCQ/location — same-country/city distractors ─────────────
    { type: 'hardMCQ', subType: 'location', eventId: 'f76',
        options: [
            { label: 'Toronto, Canada', isCorrect: true },
            { label: 'Montreal, Canada', isCorrect: false },
            { label: 'Vancouver, Canada', isCorrect: false },
            { label: 'Waterloo, Canada', isCorrect: false },
        ] },  // Deep Learning breakthrough (AlexNet) \u2014 all major Canadian university cities
    { type: 'hardMCQ', subType: 'location', eventId: 'f128',
        options: [
            { label: 'Alexandria, Egypt', isCorrect: true },
            { label: 'Athens, Greece', isCorrect: false },   // Euclid was Greek, so Athens is plausible misdirection
            { label: 'Syracuse, Sicily', isCorrect: false },  // Where Archimedes worked \u2014 same era, same culture
            { label: 'Carthage, North Africa', isCorrect: false },  // North African city like Alexandria
        ] },  // Euclid\u2019s Elements \u2014 all ancient Mediterranean intellectual centers
    { type: 'hardMCQ', subType: 'location', eventId: 'f131',
        options: [
            { label: 'Cambridge, England', isCorrect: true },
            { label: 'Oxford, England', isCorrect: false },
            { label: 'London, England', isCorrect: false },
            { label: 'Edinburgh, Scotland', isCorrect: false },
        ] },  // Newton\u2019s Principia \u2014 all major British academic and intellectual cities

    // ── hardMCQ/date — extremely tight distractors ────────────────────
    { type: 'hardMCQ', subType: 'date', eventId: 'f130',
        prompt: 'When did Galileo first turn his telescope to the sky?',
        options: [
            { label: '1604', isCorrect: false },   // Kepler\u2019s supernova \u2014 Galileo also observed it
            { label: '1609', isCorrect: true },
            { label: '1616', isCorrect: false },   // Year the Church officially condemned the Copernican model
            { label: '1623', isCorrect: false },   // Galileo publishes \u201CThe Assayer\u201D
        ] },
    { type: 'hardMCQ', subType: 'date', eventId: 'f136',
        prompt: 'When did Watson & Crick announce the structure of DNA?',
        options: [
            { label: '1944', isCorrect: false },   // Avery proves DNA carries genetic information
            { label: '1953', isCorrect: true },
            { label: '1962', isCorrect: false },   // Nobel Prize awarded to Watson, Crick & Wilkins
            { label: '1966', isCorrect: false },   // Genetic code fully cracked by Nirenberg & Khorana
        ] },
];

/** Build a full question object from a curated spec. */
function buildCuratedQuestion(spec) {
    if (spec.type === 'whichCameFirst') {
        const eventA = ALL_EVENTS.find(e => e.id === spec.eventIdA);
        const eventB = ALL_EVENTS.find(e => e.id === spec.eventIdB);
        if (!eventA || !eventB) return null;
        const earlierEvent = eventA.year < eventB.year ? eventA : eventB;
        return {
            type: 'whichCameFirst', event: earlierEvent,
            eventA, eventB, correctId: earlierEvent.id,
            prompt: 'Which came first?',
            masteryDimension: 'date', xpValue: 10,
        };
    }

    const event = ALL_EVENTS.find(e => e.id === spec.eventId);
    if (!event) return null;

    switch (spec.type) {
        case 'eraDetective': {
            const correctEra = getEraForYear(event.year);
            const desc = (event.quizDescription || event.description)
                .replace(/\d{3,}/g, '???').replace(/\b(BCE|CE|AD|BC)\b/g, '');
            const options = ERA_RANGES.map(era => ({
                label: era.label, isCorrect: era.id === correctEra.id,
            }));
            return {
                type: 'eraDetective', event, description: desc,
                prompt: 'Which era does this event belong to?',
                context: `"${event.title}"`,
                options, correctIndex: options.findIndex(o => o.isCorrect),
                masteryDimension: 'date', xpValue: 10,
            };
        }
        case 'trueOrFalse': {
            return {
                type: 'trueOrFalse', event,
                statement: spec.statement, isTrue: spec.isTrue,
                correction: spec.correction || null,
                prompt: 'True or false?',
                masteryDimension: 'what', xpValue: 10,
            };
        }
        case 'hardMCQ': {
            const options = shuffle([...spec.options]);
            const prompts = {
                location: `Where did "${event.title}" happen?`,
                date: spec.prompt || `When did "${event.title}" happen?`,
            };
            return {
                type: 'hardMCQ', subType: spec.subType, event,
                prompt: prompts[spec.subType] || spec.prompt,
                options, correctIndex: options.findIndex(o => o.isCorrect),
                masteryDimension: spec.subType, xpValue: 10 * (event.difficulty || 1),
            };
        }
        case 'oddOneOut': {
            const events = spec.events.map(id => ALL_EVENTS.find(e => e.id === id)).filter(Boolean);
            if (events.length !== 4) return null;
            const outlier = events.find(e => e.id === spec.outlierEventId);
            if (!outlier) return null;
            return {
                type: 'oddOneOut', event: outlier,
                events: shuffle([...events]),
                outlierEventId: outlier.id,
                sharedTrait: spec.sharedTrait,
                prompt: 'One of these doesn\'t belong. Find the odd one out!',
                masteryDimension: 'what', xpValue: 15,
            };
        }
        default: return null;
    }
}

// ─── Tier system ─────────────────────────────────────────────

export const CHALLENGE_TIERS = [
    { id: 'beginner',  label: 'Beginner',  icon: '\uD83C\uDF31', color: '#059669', questions: 5, flavor: 'Let\u2019s see what you know\u2026' },
    { id: 'amateur',   label: 'Amateur',   icon: '\uD83D\uDCD6', color: '#2563EB', questions: 7, flavor: 'Getting warmer\u2026' },
    { id: 'advanced',  label: 'Advanced',  icon: '\uD83C\uDF93', color: '#7C3AED', questions: 8, flavor: 'The real test begins.' },
    { id: 'historian', label: 'Historian', icon: '\uD83C\uDFDB\uFE0F', color: '#B45309', questions: 8, flavor: 'Only scholars make it this far.' },
    { id: 'expert',    label: 'Expert',    icon: '\uD83D\uDD2E', color: '#9333EA', questions: 5, flavor: 'Beyond the textbooks.' },
    { id: 'god',       label: 'God',       icon: '\u26A1',       color: '#DC2626', questions: 2, flavor: 'The ultimate challenge.' },
];

export const TOTAL_CHALLENGE_QUESTIONS = CHALLENGE_TIERS.reduce((s, t) => s + t.questions, 0); // 35

export function getTierForQuestion(questionIndex) {
    let cumulative = 0;
    for (const tier of CHALLENGE_TIERS) {
        cumulative += tier.questions;
        if (questionIndex < cumulative) return tier;
    }
    return CHALLENGE_TIERS[CHALLENGE_TIERS.length - 1];
}

export function getTierProgress(questionIndex) {
    let cumulative = 0;
    for (const tier of CHALLENGE_TIERS) {
        if (questionIndex < cumulative + tier.questions) {
            return { tier, indexInTier: questionIndex - cumulative, tierStart: cumulative };
        }
        cumulative += tier.questions;
    }
    const last = CHALLENGE_TIERS[CHALLENGE_TIERS.length - 1];
    return { tier: last, indexInTier: last.questions - 1, tierStart: TOTAL_CHALLENGE_QUESTIONS - last.questions };
}

// ─── Tier-specific type pools (no categorySort) ──────────────

const TIER_TYPES = {
    beginner:  ['whichCameFirst', 'eraDetective', 'trueOrFalse'],
    amateur:   ['eraDetective', 'whichCameFirst', 'trueOrFalse', 'hardMCQ'],
    advanced:  ['hardMCQ', 'trueOrFalse', 'whichCameFirst', 'oddOneOut'],
    historian: ['whichCameFirst', 'oddOneOut', 'hardMCQ', 'trueOrFalse'],
    expert:    ['whichCameFirst', 'oddOneOut', 'hardMCQ'],
};

function pickTypeForTier(tierId, recentTypes = []) {
    let types = TIER_TYPES[tierId] || FALLBACK_TYPES;
    // Prevent 3+ of the same type in a row
    const last2 = recentTypes.slice(-2);
    if (last2.length === 2 && last2[0] === last2[1]) {
        const blocked = last2[0];
        const filtered = types.filter(t => t !== blocked);
        if (filtered.length > 0) types = filtered;
    }
    return types[Math.floor(Math.random() * types.length)];
}

function filterPoolForTier(pool, tierId) {
    switch (tierId) {
        case 'beginner': {
            const easy = pool.filter(e => (e.difficulty || 1) === 1);
            return easy.length >= 8 ? easy : pool;
        }
        case 'amateur': {
            const mid = pool.filter(e => (e.difficulty || 1) <= 2);
            return mid.length >= 8 ? mid : pool;
        }
        case 'advanced':
        case 'historian':
        case 'expert': {
            const hard = pool.filter(e => (e.difficulty || 1) >= 2);
            return hard.length >= 8 ? hard : pool;
        }
        default: return pool;
    }
}

// ─── Level mixing: decide whether a question should use Level 2 ─

/**
 * From question 3 onward, ~1 in 3 questions should come from Level 2.
 * Never allow more than 3 consecutive questions from the same level.
 * `recentLevels` is an array of the last few question levels (1 or 2).
 */
function shouldUseLevel2(questionIndex, recentLevels) {
    // First 2 questions are always Level 1
    if (questionIndex < 2) return false;

    // Enforce the "never 3 in a row" rule
    const last3 = recentLevels.slice(-3);
    if (last3.length >= 3 && last3.every(l => l === 1)) return true;   // force L2
    if (last3.length >= 3 && last3.every(l => l === 2)) return false;  // force L1

    // ~33% chance of Level 2
    return Math.random() < 0.33;
}

// ─── Event selection ─────────────────────────────────────────

/** Build a pool of events for the challenge, prioritizing unseen. */
export function buildChallengePool(seenEventIds = []) {
    const seenSet = new Set(seenEventIds);
    const coreEvents = ALL_EVENTS.filter(e => !e.source); // exclude daily quiz events
    const unseen = coreEvents.filter(e => !seenSet.has(e.id));
    const seen = coreEvents.filter(e => seenSet.has(e.id));

    // 70% unseen, 30% seen (if available)
    const unseenCount = Math.min(unseen.length, Math.max(30, Math.round(coreEvents.length * 0.7)));
    const seenCount = Math.min(seen.length, coreEvents.length - unseenCount);

    // Sort by difficulty so filterPoolForTier always finds enough appropriate events
    const sortByDifficulty = (a, b) => (a.difficulty || 1) - (b.difficulty || 1);
    const pool = shuffle([
        ...shuffle(unseen).slice(0, unseenCount),
        ...shuffle(seen).slice(0, seenCount),
    ]);

    return {
        level1: pool.filter(e => !isLevel2Event(e)).sort(sortByDifficulty),
        level2: pool.filter(e => isLevel2Event(e)).sort(sortByDifficulty),
        all: pool.sort(sortByDifficulty),
    };
}

// ─── Question type weights by difficulty ramp (multiplayer) ──

const FALLBACK_TYPES = ['hardMCQ', 'whichCameFirst', 'trueOrFalse'];

/** Pick a question type weighted by how far into the game we are. */
function pickQuestionType(questionIndex) {
    const EASY_TYPES = ['eraDetective', 'whichCameFirst', 'hardMCQ'];
    const HARD_TYPES = ['whichCameFirst', 'oddOneOut', 'trueOrFalse', 'hardMCQ'];
    // Early game: 70% easy, 30% hard. Late game: 30% easy, 70% hard
    const hardWeight = Math.min(0.7, 0.3 + questionIndex * 0.02);
    const pool = Math.random() < hardWeight ? HARD_TYPES : EASY_TYPES;
    return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Master question generator (multiplayer uses tiered now) ─

/**
 * Generate a challenge question for multiplayer.
 * Pins to Amateur/Advanced difficulty rather than using the old legacy
 * generator, so multiplayer gets access to curated questions and
 * proper type variety.
 */
export function generateChallengeQuestion(pool, questionIndex, usedEventIds = new Set(), recentTypes = []) {
    // Pick from multiplayer-appropriate types (no tier progression)
    let type = pickQuestionType(questionIndex);
    // Prevent 3+ of the same type in a row
    const last2 = recentTypes.slice(-2);
    if (last2.length === 2 && last2[0] === last2[1] && last2[0] === type) {
        const ALT = ['hardMCQ', 'whichCameFirst', 'trueOrFalse', 'oddOneOut', 'eraDetective'];
        type = ALT.find(t => t !== type) || type;
    }
    const flatPool = Array.isArray(pool) ? pool : pool.all;

    // Try curated T/F first for some questions (mix in quality curated content)
    if (type === 'trueOrFalse' && Math.random() < 0.6) {
        const available = CURATED_TF_POOL.filter(spec => !usedEventIds.has(spec.eventId));
        if (available.length > 0) {
            const spec = shuffle(available)[0];
            const q = buildCuratedQuestion({ type: 'trueOrFalse', ...spec });
            if (q) return q;
        }
    }

    // Attempt the chosen type, fall back to others
    const ALL_TYPES = ['hardMCQ', 'whichCameFirst', 'trueOrFalse', 'oddOneOut', 'eraDetective'];
    const types = [type, ...shuffle(ALL_TYPES.filter(t => t !== type))];

    for (const t of types) {
        const q = generateByType(t, flatPool, usedEventIds, { tierId: 'amateur' });
        if (q) return q;
    }

    // Ultimate fallback: simple hard MCQ on any event
    const event = flatPool.find(e => !usedEventIds.has(e.id)) || flatPool[0];
    return generateHardMCQ(event);
}

function generateByType(type, pool, usedEventIds, { tierId } = {}) {
    switch (type) {
        case 'hardMCQ': {
            const event = pickUnused(pool, usedEventIds);
            if (!event) return null;
            // No exact-date questions in beginner/amateur — too hard
            const excludeSubTypes = (tierId === 'beginner' || tierId === 'amateur') ? ['date'] : [];
            return generateHardMCQ(event, { excludeSubTypes });
        }
        case 'whichCameFirst': return generateWhichCameFirst(pool, usedEventIds);
        case 'oddOneOut': return generateOddOneOut(pool, usedEventIds);
        case 'trueOrFalse': {
            // Use curated conceptual T/F, not dynamic swapped-detail
            const available = CURATED_TF_POOL.filter(spec => !usedEventIds.has(spec.eventId));
            if (available.length > 0) {
                const spec = shuffle(available)[0];
                const q = buildCuratedQuestion({ type: 'trueOrFalse', ...spec });
                if (q) return q;
            }
            // Fallback: generate a cause-and-effect question instead
            return generateCauseEffect(pool, usedEventIds);
        }
        case 'eraDetective': {
            const event = pickUnused(pool, usedEventIds);
            if (!event) return null;
            return generateEraDetective(event);
        }
        default: return null;
    }
}

function pickUnused(pool, usedIds) {
    return pool.find(e => !usedIds.has(e.id)) || pool[Math.floor(Math.random() * pool.length)];
}

// ─── Question generators ─────────────────────────────────────

/** Hard MCQ — distractors from same era + category for maximum plausibility. */
function generateHardMCQ(event, { excludeSubTypes = [] } = {}) {
    const era = getEraForYear(event.year);
    const allSubTypes = ['location', 'date', 'what', 'description'].filter(t => !excludeSubTypes.includes(t));
    const subTypes = shuffle(allSubTypes.length > 0 ? allSubTypes : ['location', 'what', 'description']);
    const subType = subTypes[0];

    let options, correctIndex;

    if (subType === 'location') {
        // Use same-region events for harder distractors
        const sameRegion = ALL_EVENTS.filter(e =>
            e.id !== event.id && e.location.region === event.location.region
        );
        const sameEra = ALL_EVENTS.filter(e => {
            const eEra = getEraForYear(e.year);
            return eEra.id === era.id && e.id !== event.id;
        });
        // Prefer same-region, fall back to same-era, then all
        const pool = sameRegion.length >= 3 ? sameRegion : sameEra.length >= 3 ? sameEra : ALL_EVENTS.filter(e => e.id !== event.id);
        const opts = generateLocationOptions(event, [event, ...pool]);
        options = opts.map(place => ({ label: place, isCorrect: place === event.location.place }));
        correctIndex = options.findIndex(o => o.isCorrect);
    } else if (subType === 'date') {
        const opts = generateDateMCQOptions(event);
        options = opts.map(o => ({ label: o.label, isCorrect: o.isCorrect }));
        correctIndex = options.findIndex(o => o.isCorrect);
    } else if (subType === 'what') {
        // Show event description, pick the right title — use same-topic cluster
        const sameEra = ALL_EVENTS.filter(e => getEraForYear(e.year).id === era.id && e.id !== event.id);
        // Prefer same-category + same-era for maximum difficulty
        const sameCatEra = sameEra.filter(e => e.category === event.category);
        const distPool = sameCatEra.length >= 3 ? sameCatEra : sameEra.length >= 3 ? sameEra : ALL_EVENTS.filter(e => e.id !== event.id);
        const distractors = shuffle(distPool).slice(0, 3);
        options = shuffle([
            { label: event.title, isCorrect: true },
            ...distractors.map(e => ({ label: e.title, isCorrect: false }))
        ]);
        correctIndex = options.findIndex(o => o.isCorrect);
    } else {
        // description: show title, pick the right description — use quizDescription
        const sameEra = ALL_EVENTS.filter(e => getEraForYear(e.year).id === era.id && e.id !== event.id);
        const sameCatEra = sameEra.filter(e => e.category === event.category);
        const distPool = sameCatEra.length >= 3 ? sameCatEra : sameEra.length >= 3 ? sameEra : ALL_EVENTS.filter(e => e.id !== event.id);
        const distractors = shuffle(distPool).slice(0, 3);
        options = shuffle([
            { label: event.quizDescription || event.description, isCorrect: true },
            ...distractors.map(e => ({ label: e.quizDescription || e.description, isCorrect: false }))
        ]);
        correctIndex = options.findIndex(o => o.isCorrect);
    }

    const prompts = {
        location: `Where did "${event.title}" happen?`,
        date: `When did "${event.title}" happen?`,
        what: `Which event does this describe?`,
        description: `Which description fits "${event.title}"?`,
    };

    return {
        type: 'hardMCQ',
        subType,
        event,
        prompt: prompts[subType],
        context: subType === 'what' ? (event.quizDescription || event.description) : null,
        options,
        correctIndex,
        masteryDimension: subType,
        xpValue: 10 * (event.difficulty || 1),
    };
}

/** Which Came First — two events, pick the earlier one. */
function generateWhichCameFirst(pool, usedEventIds) {
    // Pick two events, preferring same-era pairs for harder questions
    const available = pool.filter(e => !usedEventIds.has(e.id));
    if (available.length < 2) return null;

    const shuffled = shuffle(available);
    let eventA = shuffled[0];
    let eventB = null;

    // Try to find one from the same era
    const eraA = getEraForYear(eventA.year);
    const sameEra = shuffled.slice(1).filter(e => getEraForYear(e.year).id === eraA.id);
    if (sameEra.length > 0) {
        eventB = sameEra[0];
    } else {
        eventB = shuffled[1];
    }

    // Ensure they have different years
    if (eventA.year === eventB.year) {
        const alt = shuffled.find(e => e.id !== eventA.id && e.year !== eventA.year);
        if (alt) eventB = alt;
        else return null;
    }

    const earlierEvent = eventA.year < eventB.year ? eventA : eventB;

    return {
        type: 'whichCameFirst',
        event: earlierEvent,
        eventA,
        eventB,
        correctId: earlierEvent.id,
        prompt: 'Which came first?',
        masteryDimension: 'date',
        xpValue: 15,
    };
}

/** Odd One Out — 4 events, 3 share a trait, find the outlier. */
function generateOddOneOut(pool, usedEventIds) {
    const available = pool.filter(e => !usedEventIds.has(e.id));

    const traits = [
        { key: 'category', getVal: e => e.category, getLabel: v => `All ${CATEGORY_CONFIG[v]?.label || v}` },
        { key: 'era', getVal: e => getEraForYear(e.year).id, getLabel: v => `All from the ${ERA_RANGES.find(r => r.id === v)?.label || v} era` },
        { key: 'region', getVal: e => e.location.region, getLabel: v => `All from ${v}` },
    ];

    for (const trait of shuffle(traits)) {
        // Group events by this trait
        const groups = {};
        for (const e of available) {
            const val = trait.getVal(e);
            if (!groups[val]) groups[val] = [];
            groups[val].push(e);
        }

        // Need a group of 3+ and an outlier from a different group
        for (const [val, members] of Object.entries(groups)) {
            if (members.length < 3) continue;
            const outlierPool = available.filter(e => trait.getVal(e) !== val);
            if (outlierPool.length === 0) continue;

            const three = shuffle(members).slice(0, 3);
            const outlier = shuffle(outlierPool)[0];
            const events = shuffle([...three, outlier]);

            return {
                type: 'oddOneOut',
                event: outlier,
                events,
                outlierEventId: outlier.id,
                sharedTrait: trait.getLabel(val),
                prompt: 'One of these doesn\'t belong. Find the odd one out!',
                masteryDimension: 'what',
                xpValue: 15,
            };
        }
    }

    return null;
}

/** Cause & Effect — using EVENT_CONNECTIONS data. */
function generateCauseEffect(pool, usedEventIds) {
    const available = pool.filter(e => !usedEventIds.has(e.id));

    // Find events with connections
    for (const event of shuffle(available)) {
        const connections = EVENT_CONNECTIONS[event.id];
        if (!connections || connections.length === 0) continue;

        // Pick a connection
        const conn = shuffle(connections)[0];
        const targetEvent = ALL_EVENTS.find(e => e.id === conn.id);
        if (!targetEvent) continue;

        // Create a "what did X lead to?" question
        const otherEvents = shuffle(
            ALL_EVENTS.filter(e => e.id !== event.id && e.id !== targetEvent.id)
        ).slice(0, 3);

        if (otherEvents.length < 3) continue;

        const options = shuffle([
            { label: targetEvent.title, isCorrect: true },
            ...otherEvents.map(e => ({ label: e.title, isCorrect: false })),
        ]);

        return {
            type: 'hardMCQ',
            subType: 'what',
            event,
            prompt: `What was a direct consequence of "${event.title}"?`,
            context: conn.label,
            options,
            correctIndex: options.findIndex(o => o.isCorrect),
            masteryDimension: 'what',
            xpValue: 15,
        };
    }

    return null;
}

/** Era Detective — given description, guess the era. */
function generateEraDetective(event) {
    const correctEra = getEraForYear(event.year);
    // Strip obvious year references and era-revealing keywords from description
    let desc = (event.quizDescription || event.description)
        .replace(/\d{3,}/g, '???')
        .replace(/\b(BCE|CE|AD|BC)\b/g, '')
        .replace(/\b(medieval|renaissance|modern|ancient|prehistoric)\b/gi, '???');

    const options = ERA_RANGES.map(era => ({
        label: era.label,
        isCorrect: era.id === correctEra.id,
    }));

    return {
        type: 'eraDetective',
        event,
        description: desc,
        prompt: `Which era does this event belong to?`,
        context: `"${event.title}"`,
        options,
        correctIndex: options.findIndex(o => o.isCorrect),
        masteryDimension: 'date',
        xpValue: 10,
    };
}

// ─── Tiered question generator (solo + multiplayer) ──────────

/**
 * Generate a challenge question using the tier system.
 * Beginner → easy types + easy events, God → chronological ordering.
 * From question 3 onward, mixes Level 2 events in (~1/3 ratio).
 * Never more than 3 consecutive questions from the same level.
 */
export function generateTieredChallengeQuestion(pool, questionIndex, usedEventIds = new Set(), recentLevels = [], recentTypes = []) {
    const { tier } = getTierProgress(questionIndex);

    // All curated tiers: Beginner through Expert
    const CURATED_POOLS = {
        beginner: BEGINNER_QUESTIONS,
        amateur: AMATEUR_QUESTIONS,
        advanced: ADVANCED_QUESTIONS,
        historian: HISTORIAN_QUESTIONS,
        expert: EXPERT_QUESTIONS,
    };
    if (CURATED_POOLS[tier.id]) {
        const curatedPool = CURATED_POOLS[tier.id];
        const available = curatedPool.filter(spec => {
            if (spec.eventIdA) return !usedEventIds.has(spec.eventIdA) && !usedEventIds.has(spec.eventIdB);
            if (spec.events) return !spec.events.some(id => usedEventIds.has(id));
            return !usedEventIds.has(spec.eventId);
        });
        if (available.length > 0) {
            const spec = shuffle(available)[0];
            const q = buildCuratedQuestion(spec);
            if (q) {
                q.tier = tier;
                q.level = isLevel2Event(q.event) ? 2 : 1;
                return q;
            }
        }
        // Fallback: if all curated questions exhausted, use dynamic generation below
    }

    // Determine which pool to use based on level mixing
    const poolObj = Array.isArray(pool) ? { level1: pool, level2: [], all: pool } : pool;
    const useL2 = shouldUseLevel2(questionIndex, recentLevels);

    // God tier: chronological ordering (uses full pool)
    if (tier.id === 'god') {
        const q = generateChronologicalOrder(poolObj.all, usedEventIds);
        if (q) { q.tier = tier; q.level = 0; return q; }
        // Fallback to hardest MCQ
        const event = pickUnused(poolObj.all, usedEventIds) || poolObj.all[0];
        const fallback = generateHardMCQ(event);
        fallback.tier = tier;
        fallback.level = isLevel2Event(event) ? 2 : 1;
        return fallback;
    }

    // Pick the level-specific subpool, with fallback
    let levelPool;
    if (useL2 && poolObj.level2.length >= 4) {
        levelPool = poolObj.level2;
    } else {
        levelPool = poolObj.level1.length >= 4 ? poolObj.level1 : poolObj.all;
    }

    const type = pickTypeForTier(tier.id, recentTypes);
    const allTypes = TIER_TYPES[tier.id] || FALLBACK_TYPES;
    const types = [type, ...shuffle(allTypes.filter(t => t !== type))];
    const tierPool = filterPoolForTier(levelPool, tier.id);
    const effectivePool = tierPool.length >= 8 ? tierPool : levelPool.length >= 4 ? levelPool : poolObj.all;

    for (const t of types) {
        const q = generateByType(t, effectivePool, usedEventIds, { tierId: tier.id });
        if (q) {
            q.tier = tier;
            q.level = isLevel2Event(q.event) ? 2 : 1;
            return q;
        }
    }

    // Fallback
    const event = pickUnused(poolObj.all, usedEventIds) || poolObj.all[0];
    const q = generateHardMCQ(event);
    q.tier = tier;
    q.level = isLevel2Event(event) ? 2 : 1;
    return q;
}

// ─── God-tier question: Chronological Order ──────────────────

/** Sort 5 events by year — the ultimate test. */
function generateChronologicalOrder(pool, usedEventIds) {
    const available = pool.filter(e => !usedEventIds.has(e.id));
    if (available.length < 5) return null;

    // Group by era and try to pick from the largest group (same-era = hardest)
    const byEra = {};
    for (const e of available) {
        const era = getEraForYear(e.year).id;
        if (!byEra[era]) byEra[era] = [];
        byEra[era].push(e);
    }

    let picked = [];
    const eras = Object.entries(byEra).sort((a, b) => b[1].length - a[1].length);

    for (const [, events] of eras) {
        if (events.length >= 5) {
            const distinct = [];
            const usedYears = new Set();
            for (const e of shuffle(events)) {
                if (!usedYears.has(e.year)) {
                    distinct.push(e);
                    usedYears.add(e.year);
                }
                if (distinct.length === 5) break;
            }
            if (distinct.length === 5) { picked = distinct; break; }
        }
    }

    // Fallback: pick across eras with distinct years
    if (picked.length < 5) {
        const distinct = [];
        const usedYears = new Set();
        for (const e of shuffle(available)) {
            if (!usedYears.has(e.year)) {
                distinct.push(e);
                usedYears.add(e.year);
            }
            if (distinct.length === 5) break;
        }
        picked = distinct;
    }

    if (picked.length < 5) return null;

    const correctOrder = [...picked].sort((a, b) => a.year - b.year);

    return {
        type: 'chronologicalOrder',
        events: shuffle([...picked]),
        correctOrder: correctOrder.map(e => e.id),
        prompt: 'Arrange these events from earliest to latest.',
        masteryDimension: 'date',
        xpValue: 50,
        event: correctOrder[0],
    };
}
