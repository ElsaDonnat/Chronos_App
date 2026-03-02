import { DAILY_QUIZ_EVENTS } from './dailyQuiz';

const CORE_EVENTS = [
    {
        id: "f1",
        title: "The Great Ancestral Split",
        date: "c. 7–6 million years ago",
        year: -7000000,
        yearEnd: -6000000,
        keywords: "Bipedalism · Primates · Divergence",
        description: "The foundational moment when the human lineage branched away from the common ancestor we shared with chimpanzees. This began a millions-year journey of early ancestors slowly developing upright walking and smaller canine teeth.",
        quizDescription: "Humans diverged from our shared ancestor with chimpanzees.",
        location: { lat: 1.5, lng: 36.8, region: "Africa", place: "Rift Valley, Africa" },
        category: "science",
        difficulty: 1,
        controversyNotes: {
            date: "The human\–chimpanzee split is estimated at 4\–13 million years ago depending on the method. Molecular clocks, fossil evidence, and genetic analyses give different results, and the divergence was likely gradual rather than a single event.",
        }
    },
    {
        id: "f2",
        title: "The Cooking Revolution",
        date: "c. 1 million – 400,000 years ago",
        year: -1000000,
        yearEnd: -400000,
        keywords: "Fire control · Brain growth · Nutrition",
        description: "Early humans stopped running from fire and started preserving it from natural strikes like lightning. Cooking acted as a 'pre-digestion' step, making it easier to absorb calories — allowing brains to grow and guts to shrink.",
        quizDescription: "Controlled fire and cooking let brains grow and guts shrink.",
        location: { lat: 0, lng: 25, region: "Africa", place: "Africa and Eurasia" },
        category: "science",
        difficulty: 1,
        controversyNotes: {
            date: "When humans first controlled fire is hotly debated. Claims range from 1.5 million years ago (Wonderwerk Cave, South Africa) to 400,000 years ago. Distinguishing deliberate fire use from natural fires in the archaeological record remains extremely difficult.",
        }
    },
    {
        id: "f3",
        title: "Emergence of Homo Sapiens",
        date: "c. 300,000 years ago",
        year: -300000,
        keywords: "Flint tools · Fire-making · Adaptation",
        description: "The biological birth of our species and the technological leap from keeping fire to making it at will using tools like flint. This 'portable technology' allowed survival in any climate.",
        quizDescription: "Homo sapiens emerged in Africa, mastering fire creation.",
        location: { lat: 5, lng: 30, region: "Africa", place: "Africa" },
        category: "science",
        difficulty: 1,
        controversyNotes: {
            date: "The oldest known Homo sapiens fossils (Jebel Irhoud, Morocco) date to ~300,000 years ago, but the transition from archaic humans was gradual. Some scholars argue anatomically modern features appeared over tens of thousands of years rather than at a single point.",
        }
    },
    {
        id: "f4",
        title: "Behavioral Modernity",
        date: "c. 70,000–50,000 years ago",
        year: -70000,
        yearEnd: -50000,
        keywords: "Language · Abstract thought · Symbolic culture",
        description: "The 'Software Update' for humanity. Complex language and abstract thought allowed cooperation in much larger groups than any other species, enabling art, music, and symbolic culture.",
        quizDescription: "Complex language enabled large-scale cooperation and art.",
        location: { lat: 9.6, lng: 40.5, region: "Africa", place: "Herto, Ethiopia" },
        category: "culture",
        difficulty: 2,
        controversyNotes: {
            date: "Some scholars argue for a sudden 'Great Leap Forward' around 50,000 BCE, while others point to gradual accumulation of modern behaviors starting as early as 100,000 BCE in Africa. The debate centers on whether a genetic mutation or cultural evolution drove the change.",
        }
    },
    {
        id: "f5",
        title: "Migration Out of Africa",
        date: "c. 70,000–15,000 years ago",
        year: -70000,
        yearEnd: -15000,
        keywords: "Bering Land Bridge · Hominid extinction · Global dispersal",
        description: "Small groups left Africa via the Arabian Peninsula, eventually crossing the Bering Land Bridge into the Americas. This led to the extinction of other hominid species and development of distinct cultures worldwide.",
        quizDescription: "Humans left Africa and spread across every continent.",
        location: { lat: 15, lng: 45, region: "Middle East", place: "Global (from East Africa)" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f6",
        title: "The Neolithic Revolution",
        date: "c. 10,000 BCE",
        year: -10000,
        keywords: "Agriculture · Surplus · Social classes",
        description: "The transition from nomadic foraging to settled farming. Food surpluses allowed population growth and the emergence of specialized classes like priests, soldiers, and rulers.",
        quizDescription: "Nomadic foraging gave way to settled farming.",
        location: { lat: 33, lng: 44, region: "Middle East", place: "Fertile Crescent" },
        category: "culture",
        difficulty: 1,
        controversyNotes: {
            date: "The transition to farming happened independently in at least 7 regions over thousands of years. 'c. 10,000 BCE' represents the earliest known sites in the Fertile Crescent, but China, Mesoamerica, Papua New Guinea, and others followed their own timelines.",
            location: "While the Fertile Crescent is the earliest known center, independent agricultural revolutions occurred in China (rice, c. 8,000 BCE), Mesoamerica (maize, c. 7,000 BCE), and several other regions.",
        }
    },
    {
        id: "f7",
        title: "Founding of Sumerian City-States",
        date: "c. 4000–3100 BCE",
        year: -4000,
        yearEnd: -3100,
        keywords: "Irrigation · Bureaucracy · Urbanization",
        description: "The world's first urban centers with complex social stratification. The need to manage large-scale irrigation created the first bureaucracies to track grain and labor.",
        quizDescription: "The world's first cities and bureaucracies arose.",
        location: { lat: 31.3, lng: 45.6, region: "Middle East", place: "Mesopotamia (Modern Iraq)" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f8",
        title: "Unification of Egypt",
        date: "c. 3100 BCE",
        year: -3100,
        keywords: "Pharaoh · Pyramids · Centralized state",
        description: "Upper and Lower Egypt merged under a single divine 'God-King' ruler and centralized bureaucracy capable of massive projects like the Pyramids, creating a state stable for nearly 3,000 years.",
        quizDescription: "Upper and Lower Egypt merged under a divine ruler.",
        location: { lat: 26, lng: 31.5, region: "Africa", place: "Nile River Valley, Egypt" },
        category: "politics",
        difficulty: 1
    },
    {
        id: "f9",
        title: "Invention of Writing (Cuneiform)",
        date: "c. 3200 BCE",
        year: -3200,
        keywords: "Bookkeeping · Record-keeping · Knowledge transfer",
        description: "The world's earliest writing system, developed by Sumerians. Originally a bookkeeping tool to track debts and taxes, it ended the era of pre-history by allowing precise information transmission across generations.",
        quizDescription: "Sumerians created the first writing as a bookkeeping tool.",
        location: { lat: 31.3, lng: 45.6, region: "Middle East", place: "Mesopotamia (Sumer)" },
        category: "culture",
        difficulty: 1,
        controversyNotes: {
            date: "Whether Sumerian cuneiform or Egyptian hieroglyphs came first is debated. Proto-writing systems like Vinča symbols may predate both. The boundary between 'record-keeping tokens' and 'true writing' is also disputed among scholars.",
        }
    },
    {
        id: "f10",
        title: "The Code of Hammurabi",
        date: "c. 1750 BCE",
        year: -1750,
        keywords: "Written law · Social contract · Standardized justice",
        description: "282 laws inscribed on stone that established standardized justice. It shifted power from the 'whim of the king' to a written social contract covering family, property, and criminal offenses.",
        quizDescription: "282 laws on stone created the first written legal code.",
        location: { lat: 32.5, lng: 44.4, region: "Middle East", place: "Babylon, Mesopotamia" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f11",
        title: "The Bronze Age Collapse",
        date: "c. 1200 BCE",
        year: -1200,
        keywords: "Sea Peoples · Systemic failure · Lost literacy",
        description: "A rapid systemic failure caused by migrations, droughts, and revolts that ended massive palace-economies. The Hittites and Mycenaeans disintegrated, leading to a 'Greek Dark Age' and loss of literacy for centuries.",
        quizDescription: "Palace-economies collapsed, causing a centuries-long Dark Age.",
        location: { lat: 35, lng: 33, region: "Middle East", place: "Eastern Mediterranean" },
        category: "war",
        difficulty: 2,
        controversyNotes: {
            what: "The causes of the Bronze Age Collapse remain one of archaeology's greatest mysteries. Theories include invasion by the 'Sea Peoples,' prolonged drought, earthquakes, trade disruption, or cascading systems failure. Most historians now favor a combination of factors.",
        }
    },
    {
        id: "f12",
        title: "First Ancient Olympic Games",
        date: "776 BCE",
        year: -776,
        keywords: "Sacred truce · Pan-Hellenic identity · Athletic competition",
        description: "A festival establishing a 'sacred truce' among warring Greek city-states. It solidified a shared Greek identity and the concept of noble competition. Suppressed in 393 CE, revived in Athens in 1896.",
        quizDescription: "A sacred festival uniting warring Greek city-states.",
        location: { lat: 37.6, lng: 21.6, region: "Europe", place: "Olympia, Greece" },
        category: "culture",
        difficulty: 1,
        controversyNotes: {
            date: "776 BCE is the traditional date based on ancient Greek records, but archaeological evidence suggests athletic competitions at Olympia may have begun earlier. The date marks the first recorded victor, not necessarily the first games.",
        }
    },
    {
        id: "f13",
        title: "Founding of the Roman Republic",
        date: "509 BCE",
        year: -509,
        keywords: "Senate · Consuls · Anti-tyranny",
        description: "The expulsion of kings and establishment of a 'mixed constitution' with elected consuls and a Senate, aimed to prevent tyranny through shared power.",
        quizDescription: "Romans expelled their king and created a republic.",
        location: { lat: 41.9, lng: 12.5, region: "Europe", place: "Rome, Italy" },
        category: "politics",
        difficulty: 1
    },
    {
        id: "f14",
        title: "The Axial Age",
        date: "c. 500 BCE",
        year: -500,
        keywords: "Universal ethics · Philosophy · Parallel emergence",
        description: "A global intellectual shift toward universal ethical systems and logic. It simultaneously produced the foundations of Greek rationalism, Buddhism, and Confucianism across different civilizations.",
        quizDescription: "Greek rationalism, Buddhism, and Confucianism emerged.",
        location: { lat: 30, lng: 60, region: "Asia", place: "India, China, and Greece" },
        category: "culture",
        difficulty: 2,
        controversyNotes: {
            what: "Karl Jaspers coined the term 'Axial Age' in 1949, but some scholars question whether these philosophical developments were truly simultaneous or whether the concept imposes a false pattern on independent traditions separated by thousands of miles.",
        }
    },
    {
        id: "f15",
        title: "Conquests of Alexander the Great",
        date: "334–323 BCE",
        year: -334,
        yearEnd: -323,
        keywords: "Hellenism · Persian Empire · Cultural fusion",
        description: "Alexander of Macedonia toppled the Persian Empire and spread Greek culture (Hellenism) as far as India. His death led to a 'globalized' trade zone lasting centuries. Aristotle was his teacher.",
        quizDescription: "Alexander toppled Persia and spread Greek culture to India.",
        location: { lat: 37, lng: 35, region: "Middle East", place: "Macedonia to India" },
        category: "war",
        difficulty: 1
    },
    {
        id: "f16",
        title: "Unification of China (Qin Dynasty)",
        date: "221 BCE",
        year: -221,
        keywords: "Warring States · Standardization · National identity",
        description: "The end of the 'Warring States' period through brutal military expansion. By standardizing script and currency, the Qin created a cohesive 'Chinese' identity.",
        quizDescription: "Brutal conquest unified China under one script and currency.",
        location: { lat: 34.3, lng: 108.9, region: "Asia", place: "China" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f17",
        title: "Assassination of Julius Caesar",
        date: "44 BCE",
        year: -44,
        keywords: "Dictatorship · Civil war · Republic to Empire",
        description: "A brilliant general who became 'Dictator for Life.' His assassination by senators who feared his power triggered the final civil wars transforming Rome from a Republic into an Empire.",
        quizDescription: "Caesar's assassination triggered Rome's shift to Empire.",
        location: { lat: 41.9, lng: 12.5, region: "Europe", place: "Rome, Italy" },
        category: "politics",
        difficulty: 1
    },
    {
        id: "f18",
        title: "Reign of Augustus & Pax Romana",
        date: "27 BCE – 180 CE",
        year: -27,
        yearEnd: 180,
        keywords: "First Emperor · Stability · Mediterranean trade",
        description: "Octavian (Augustus) became the first Roman Emperor, ending a century of civil war. His rule initiated the Pax Romana — 200 years of stability and economic growth across the Mediterranean.",
        quizDescription: "Augustus became Rome's first Emperor, ending civil war.",
        location: { lat: 41.9, lng: 12.5, region: "Europe", place: "Roman Empire" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f19",
        title: "Life & Crucifixion of Jesus",
        date: "c. 4 BCE – 30 CE",
        year: -4,
        yearEnd: 33,
        keywords: "Salvation · Resurrection · Birth of Christianity",
        description: "A Jewish teacher whose message of spiritual salvation challenged religious authorities and Roman stability. His followers claimed he rose from the dead, leading to the birth of Christianity.",
        quizDescription: "A Jewish teacher whose followers founded Christianity.",
        location: { lat: 31.7, lng: 35.2, region: "Middle East", place: "Judea (Modern Israel/Palestine)" },
        category: "culture",
        difficulty: 1,
        controversyNotes: {
            date: "Jesus's birth year is debated: Matthew places it before Herod's death (4 BCE), while Luke's census reference suggests 6 CE. The crucifixion date ranges from 30 to 36 CE. The traditional 'AD 1' calculation by Dionysius Exiguus is now known to be off by several years.",
        }
    },
    {
        id: "f20",
        title: "Edict of Milan (Constantine)",
        date: "313 CE",
        year: 313,
        keywords: "Legalization · Constantinople · East-West split",
        description: "Emperor Constantine granted legal status to Christianity and moved the capital to Constantinople, ensuring the survival of Roman law and Christian faith in the East for another millennium.",
        quizDescription: "Constantine legalized Christianity and moved the capital east.",
        location: { lat: 41, lng: 29, region: "Europe", place: "Roman Empire (Milan/Constantinople)" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f21",
        title: "Fall of the Western Roman Empire",
        date: "476 CE",
        year: 476,
        keywords: "Germanic tribes · Economic decay · Byzantine survival",
        description: "The final collapse of central Roman authority in the West due to economic decay, political instability, and Germanic invasions. The Eastern Empire (Byzantine) survived another 1,000 years.",
        quizDescription: "Central Roman authority collapsed from decay and invasions.",
        location: { lat: 41.9, lng: 12.5, region: "Europe", place: "Western Europe / Rome" },
        category: "war",
        difficulty: 1,
        controversyNotes: {
            date: "476 CE (deposition of Romulus Augustulus) is the traditional date, but the 'fall' was a gradual process. Some historians prefer 410 (Visigoth sack of Rome), 455 (Vandal sack), or argue there was no single fall \— Roman institutions simply dissolved over generations.",
        }
    },
    {
        id: "f22",
        title: "The Plague of Justinian",
        date: "541–549 CE",
        year: 541,
        yearEnd: 549,
        keywords: "Bubonic plague · Byzantine military · Islamic expansion",
        description: "The first major bubonic plague outbreak, killing 15–100 million people. It crippled the Byzantine military during their attempted reconquest of the West, contributing to the later success of Islamic conquests.",
        quizDescription: "The first bubonic plague killed up to 100 million people.",
        location: { lat: 41, lng: 29, region: "Europe", place: "Mediterranean World" },
        category: "science",
        difficulty: 3
    },
    {
        id: "f23",
        title: "Rise of the Maya Classical Period",
        date: "c. 250–900 CE",
        year: 250,
        yearEnd: 900,
        keywords: "Hieroglyphs · Zero · Astronomical calendars",
        description: "While Europe entered the Middle Ages, the Maya reached their intellectual peak — developing hieroglyphic writing, the concept of zero, and incredibly accurate astronomical calendars.",
        quizDescription: "The Maya developed writing, zero, and precise calendars.",
        location: { lat: 17, lng: -90, region: "Americas", place: "Mesoamerica (Mexico, Guatemala, Belize)" },
        category: "culture",
        difficulty: 2
    },
    {
        id: "f24",
        title: "The Founding of Islam",
        date: "610–632 CE",
        year: 610,
        yearEnd: 632,
        keywords: "Monotheism · Caliphate · Arabian unification",
        description: "Prophet Muhammad began preaching a new monotheistic faith in Mecca, leading to the rapid unification of the Arabian Peninsula and a Caliphate stretching from Spain to India.",
        quizDescription: "Muhammad preached a new faith that unified Arabia.",
        location: { lat: 21.4, lng: 39.8, region: "Middle East", place: "Arabian Peninsula (Mecca)" },
        category: "culture",
        difficulty: 1
    },
    {
        id: "f25",
        title: "The Tang Dynasty & Silk Road",
        date: "618–907 CE",
        year: 618,
        yearEnd: 907,
        keywords: "Trade routes · Buddhism · Cross-cultural exchange",
        description: "China's 'Golden Age' revitalized the Silk Road — not just for goods but as a 'highway of ideas' spreading Buddhism eastward and Middle Eastern inventions across Asia.",
        quizDescription: "China's Golden Age revitalized the Silk Road trade.",
        location: { lat: 34.3, lng: 108.9, region: "Asia", place: "China and Central Asia" },
        category: "culture",
        difficulty: 2
    },
    {
        id: "f26",
        title: "The Islamic Golden Age",
        date: "c. 750–1258 CE",
        year: 750,
        yearEnd: 1258,
        keywords: "Algebra · House of Wisdom · Intellectual bridge",
        description: "Under the Abbasid Caliphate, scholars in Baghdad's 'House of Wisdom' invented Algebra, advanced optics, and created early hospitals — the intellectual bridge between the ancient world and the European Renaissance.",
        quizDescription: "Baghdad's scholars invented algebra and advanced optics.",
        location: { lat: 33.3, lng: 44.4, region: "Middle East", place: "Baghdad and beyond" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f27",
        title: "Reign of Charlemagne",
        date: "768–814 CE",
        year: 768,
        yearEnd: 814,
        keywords: "Holy Roman Emperor · Frankish unity · Christian-Germanic fusion",
        description: "The King of the Franks united much of Western Europe for the first time since Rome. Crowned 'Emperor of the Romans' by the Pope on Christmas Day 800 CE, blending Germanic, Roman, and Christian traditions.",
        quizDescription: "Charlemagne united Western Europe and was crowned Emperor.",
        location: { lat: 50.8, lng: 6.1, region: "Europe", place: "Western & Central Europe" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f28",
        title: "The Viking Age",
        date: "793–1066 CE",
        year: 793,
        yearEnd: 1066,
        keywords: "Longships · Vinland · Trade through Russia",
        description: "Norse explorers used superior ships to raid and settle across Europe and reach North America (Vinland). They opened trade routes through Russia to Byzantium and shaped modern England, France, and Russia.",
        quizDescription: "Norse seafarers raided, settled, and reached North America.",
        location: { lat: 60, lng: 10, region: "Europe", place: "Scandinavia to North Atlantic" },
        category: "war",
        difficulty: 2
    },
    {
        id: "f29",
        title: "The Mongol Empire & Pax Mongolica",
        date: "1206–1368 CE",
        year: 1206,
        yearEnd: 1368,
        keywords: "Silk Road superhighway · Gunpowder transfer · Plague vectors",
        description: "Genghis Khan created the largest contiguous land empire. The Pax Mongolica turned the Silk Road into a 'superhighway' for trade, moving gunpowder and paper from China westward — but also plague-carrying rodents.",
        quizDescription: "Genghis Khan built the largest contiguous land empire.",
        location: { lat: 47.9, lng: 106.9, region: "Asia", place: "Eurasia (China to Eastern Europe)" },
        category: "war",
        difficulty: 1
    },
    {
        id: "f30",
        title: "The Black Death",
        date: "1347–1351 CE",
        year: 1347,
        yearEnd: 1351,
        keywords: "Labor scarcity · End of feudalism · Social upheaval",
        description: "History's deadliest epidemic killed 75–200 million people (30–60% of Europe). The massive labor scarcity collapsed feudalism and empowered survivors, setting the stage for the Renaissance.",
        quizDescription: "History's deadliest epidemic killed up to 60% of Europe.",
        location: { lat: 45, lng: 15, region: "Europe", place: "Eurasia and North Africa" },
        category: "science",
        difficulty: 1
    },
    {
        id: "f31",
        title: "Fall of Constantinople",
        date: "1453 CE",
        year: 1453,
        keywords: "Ottoman siege · Greek scholars flee · Renaissance catalyst",
        description: "The Ottoman Turks captured the Byzantine capital, ending the Roman political lineage. Greek scholars fled to Italy bringing ancient texts that fueled the Renaissance.",
        quizDescription: "Ottoman Turks captured Constantinople, ending Byzantium.",
        location: { lat: 41, lng: 29, region: "Europe", place: "Constantinople (Istanbul)" },
        category: "war",
        difficulty: 1,
        controversyNotes: {
            date: "Some historians mark 1453 as the end of the Middle Ages, while others prefer 1492 (Columbus reaches the Americas) or 1517 (the Reformation). The medieval\–modern transition was too gradual for a single date, so this remains a matter of scholarly convention.",
        }
    },
    {
        id: "f32",
        title: "Gutenberg Printing Press",
        date: "c. 1440 CE",
        year: 1440,
        keywords: "Movable type · Mass literacy · Knowledge democratization",
        description: "Movable type printing caused an information explosion, making books affordable and increasing literacy. It permanently broke the monopoly on knowledge held by the elite and clergy.",
        quizDescription: "Movable type made books affordable and broke knowledge monopolies.",
        location: { lat: 50, lng: 8.3, region: "Europe", place: "Mainz, Germany" },
        category: "science",
        difficulty: 1
    },
    {
        id: "f33",
        title: "Columbus Reaches the Americas",
        date: "1492 CE",
        year: 1492,
        keywords: "Columbian Exchange · Indigenous devastation · Transatlantic contact",
        description: "Columbus landed in the Caribbean while searching for Asia, beginning the Columbian Exchange — a massive transfer of plants, animals, and diseases that devastated Indigenous populations.",
        quizDescription: "Columbus landed in the Caribbean while seeking Asia.",
        location: { lat: 24, lng: -75, region: "Americas", place: "The Caribbean" },
        category: "war",
        difficulty: 1,
        controversyNotes: {
            location: "Columbus never reached the mainland Americas in 1492. He landed on an island in the Bahamas \— probably San Salvador or Samana Cay (scholars disagree). He believed he had reached Asia until his death in 1506.",
        }
    },
    {
        id: "f34",
        title: "The Renaissance",
        date: "c. 1350–1600 CE",
        year: 1350,
        yearEnd: 1600,
        keywords: "Humanism · da Vinci · Individualism",
        description: "A period of cultural, artistic, and scientific 'rebirth' emphasizing Humanism. It produced Leonardo da Vinci and Michelangelo, fostering inquiry and individualism that challenged Church authority.",
        quizDescription: "A cultural rebirth emphasizing humanism and individual inquiry.",
        location: { lat: 43.8, lng: 11.3, region: "Europe", place: "Italy, then Europe" },
        category: "culture",
        difficulty: 1,
        controversyNotes: {
            date: "Scholars debate whether the Renaissance began in the 1300s with Petrarch and Giotto, or the early 1400s with the Medici. Some historians question the concept entirely, arguing the 'medieval' period was not as culturally stagnant as the Renaissance narrative implies.",
        }
    },
    {
        id: "f35",
        title: "Magellan-Elcano Circumnavigation",
        date: "1519–1522 CE",
        year: 1519,
        yearEnd: 1522,
        keywords: "Round-the-world · Spherical Earth · Global trade network",
        description: "The first expedition to sail around the entire globe, proving the Earth was a sphere and connecting the Americas to Asia in the first truly global trade network.",
        quizDescription: "The first expedition to sail around the entire globe.",
        location: { lat: 0, lng: 0, region: "Europe", place: "Global (Atlantic, Pacific, Indian Oceans)" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f36",
        title: "The Protestant Reformation",
        date: "1517 CE",
        year: 1517,
        keywords: "95 Theses · Church corruption · Mass literacy",
        description: "Martin Luther's 95 Theses challenged Catholic Church corruption, shattering Western Europe's religious unity. It sparked major conflicts but accelerated mass literacy through individual Bible reading.",
        quizDescription: "Luther's 95 Theses shattered Western religious unity.",
        location: { lat: 51.9, lng: 12.7, region: "Europe", place: "Wittenberg, Germany" },
        category: "culture",
        difficulty: 1
    },
    {
        id: "f37",
        title: "Thirty Years' War & Peace of Westphalia",
        date: "1618–1648 CE",
        year: 1618,
        yearEnd: 1648,
        keywords: "Sovereignty · Nation-states · Religious conflict",
        description: "Devastating Central European conflicts evolved from religious wars to power struggles. The Peace of Westphalia established 'Westphalian Sovereignty' — creating the modern system of nation-states.",
        quizDescription: "Religious wars ended with the modern nation-state system.",
        location: { lat: 52, lng: 10, region: "Europe", place: "Holy Roman Empire (Germany)" },
        category: "war",
        difficulty: 2
    },
    {
        id: "f38",
        title: "The Scientific Revolution",
        date: "1543–1687 CE",
        year: 1543,
        yearEnd: 1687,
        keywords: "Copernicus · Newton · Empirical method",
        description: "From Copernicus proposing heliocentrism to Newton's Principia Mathematica. Observation and experimentation replaced divine explanation, providing tools for modern medicine and industry.",
        quizDescription: "Observation and experiment replaced divine explanation.",
        location: { lat: 51, lng: 0, region: "Europe", place: "Europe" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            date: "Some historians question whether a distinct 'Scientific Revolution' occurred, arguing scientific development was more continuous. Others debate the start date: Copernicus (1543), Bacon (1620), or Galileo's telescope observations (1610).",
        }
    },
    {
        id: "f39",
        title: "Peak of the Atlantic Slave Trade",
        date: "16th–19th Century",
        year: 1500,
        yearEnd: 1850,
        keywords: "Forced migration · Plantation economy · Racial hierarchy",
        description: "The forced migration of millions of Africans to work on American plantations became the backbone of a new global economy, generating enormous wealth for European empires and creating deep racial hierarchies.",
        quizDescription: "Millions of Africans were forcibly transported to the Americas.",
        location: { lat: 10, lng: -30, region: "Africa", place: "Atlantic, Africa, Americas" },
        category: "politics",
        difficulty: 2,
        controversyNotes: {
            date: "The Atlantic slave trade began well before the 16th century, and Arab slave trading of Africans dates to at least the 7th century. The dates here focus on the Atlantic system, which peaked in the 18th century. Brazil was the last major nation to abolish slavery in 1888.",
        }
    },
    {
        id: "f40",
        title: "The Enlightenment",
        date: "c. 1685–1815 CE",
        year: 1685,
        yearEnd: 1815,
        keywords: "Individual rights · Separation of powers · Reason over tradition",
        description: "The logic of the Scientific Revolution applied to human society, government, and ethics. It produced the foundational concepts of individual rights, democracy, and the separation of powers.",
        quizDescription: "Reason applied to society, producing ideas of rights and democracy.",
        location: { lat: 48.9, lng: 2.3, region: "Europe", place: "France and Great Britain" },
        category: "culture",
        difficulty: 1
    },
    {
        id: "f41",
        title: "Watt Steam Engine",
        date: "1776 CE",
        year: 1776,
        keywords: "Rotary motion · Muscle power replaced · Trains and steamships",
        description: "James Watt's engine efficiently turned heat into rotary motion, removing the limit of 'muscle power.' It powered trains and steamships, triggering the massive shift from agricultural to industrial societies.",
        quizDescription: "Watt's engine turned heat into rotary motion for industry.",
        location: { lat: 55.9, lng: -4.3, region: "Europe", place: "Great Britain" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f42",
        title: "The American Revolution",
        date: "1775–1783 CE",
        year: 1775,
        yearEnd: 1783,
        keywords: "Declaration of Independence · Enlightenment in practice · Written constitution",
        description: "13 British colonies won independence, forming the United States. The Declaration of Independence (July 4, 1776) was the first large-scale implementation of Enlightenment ideals into a written constitution.",
        quizDescription: "Thirteen colonies won independence from Britain.",
        location: { lat: 39, lng: -77, region: "Americas", place: "North America" },
        category: "revolution",
        difficulty: 1
    },
    {
        id: "f43",
        title: "The French Revolution",
        date: "1789–1799 CE",
        year: 1789,
        yearEnd: 1799,
        keywords: "Bastille · Rights of Man · End of feudalism",
        description: "Triggered by financial crisis and Enlightenment ideals. The Storming of the Bastille, execution of Louis XVI, and the Reign of Terror led to the Declaration of the Rights of Man and the permanent end of feudalism.",
        quizDescription: "Revolution toppled the French monarchy and ended feudalism.",
        location: { lat: 48.9, lng: 2.3, region: "Europe", place: "France" },
        category: "revolution",
        difficulty: 1,
        controversyNotes: {
            date: "The start date is usually given as July 14, 1789 (Storming of the Bastille), but causes had been building for decades. The end date is equally debated: 1799 (Napoleon's coup), 1804 (Empire declared), or even 1815 (final defeat of Napoleon).",
        }
    },
    {
        id: "f44",
        title: "Napoleon & the Napoleonic Code",
        date: "1799–1815 CE",
        year: 1799,
        yearEnd: 1815,
        keywords: "Civil law · Abolition of feudal privilege · Continental conquest",
        description: "Napoleon seized power after revolutionary chaos, conquering much of Europe. His lasting legacy: a unified legal code abolishing feudal privileges, becoming the foundation of civil law systems worldwide.",
        quizDescription: "Napoleon conquered Europe and created a lasting legal code.",
        location: { lat: 48.9, lng: 2.3, region: "Europe", place: "Europe" },
        category: "politics",
        difficulty: 1
    },
    {
        id: "f45",
        title: "The Congress of Vienna",
        date: "1814–1815 CE",
        year: 1814,
        yearEnd: 1815,
        keywords: "Balance of power · Restored monarchies · Century of peace",
        description: "European powers reorganized the continent after Napoleon, restoring monarchies and redrawing borders. It established a balance of power that prevented general European war for nearly a century.",
        quizDescription: "European powers redrew borders to balance power after Napoleon.",
        location: { lat: 48.2, lng: 16.4, region: "Europe", place: "Vienna, Austria" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f46",
        title: "The Industrial Revolution (Peak)",
        date: "c. 1760–1840 CE",
        year: 1760,
        yearEnd: 1840,
        keywords: "Coal and iron · Urban middle class · Labor laws",
        description: "The rapid transition from hand-production to machine manufacturing driven by coal and iron. It created the urban middle class, massive city growth, and eventually forced the creation of modern labor laws.",
        quizDescription: "Coal-powered machines replaced hand production in factories.",
        location: { lat: 53.5, lng: -2.2, region: "Europe", place: "Britain, then Europe and US" },
        category: "science",
        difficulty: 1,
        controversyNotes: {
            date: "Historians debate when the Industrial Revolution 'began.' Some argue for the 1760s (Spinning Jenny), others the 1780s (Watt's engine commercialized). A growing school of thought sees it as a gradual acceleration from the 1600s rather than a distinct revolution.",
        }
    },
    {
        id: "f47",
        title: "The Revolutions of 1848",
        date: "1848 CE",
        year: 1848,
        keywords: "Pro-democracy · Simultaneous uprisings · Weakened monarchies",
        description: "A massive wave of simultaneous pro-democracy revolts swept across more than 50 European countries. Though many were suppressed short-term, they permanently weakened absolute monarchies.",
        quizDescription: "Pro-democracy revolts swept over 50 countries at once.",
        location: { lat: 48.2, lng: 16.4, region: "Europe", place: "Throughout Europe" },
        category: "revolution",
        difficulty: 2
    },
    {
        id: "f48",
        title: "Global Abolition of Slavery",
        date: "1807–1888 CE",
        year: 1807,
        yearEnd: 1888,
        keywords: "Emancipation · British trade ban · Brazil last to abolish",
        description: "A century-long movement saw major powers ban the slave trade and then slavery itself. British trade ban 1807, Abolition Act 1833, US Emancipation 1865, Brazil last in 1888.",
        quizDescription: "A century-long movement ended slavery across the Atlantic.",
        location: { lat: 20, lng: -30, region: "Americas", place: "Atlantic World" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f49",
        title: "The Berlin Conference (Scramble for Africa)",
        date: "1884–1885 CE",
        year: 1884,
        yearEnd: 1885,
        keywords: "Paper Partition · Arbitrary borders · Colonial exploitation",
        description: "14 European powers divided Africa with no African representatives. The arbitrary 'Paper Partition' ignored ethnic and cultural boundaries, creating geopolitical challenges that persist today.",
        quizDescription: "European powers divided Africa with no African input.",
        location: { lat: 52.5, lng: 13.4, region: "Europe", place: "Berlin, Germany" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f50",
        title: "The Russian Revolution",
        date: "1917 CE",
        year: 1917,
        keywords: "Bolsheviks · Communism · Ideological rival to the West",
        description: "Twin revolutions dismantled the Tsarist autocracy and created the Soviet Union under the Bolsheviks — the world's first major communist state and future ideological rival to Western democracies.",
        quizDescription: "Twin revolutions toppled the Tsar and created the USSR.",
        location: { lat: 59.9, lng: 30.3, region: "Europe", place: "Russia (St. Petersburg)" },
        category: "revolution",
        difficulty: 1
    },
    {
        id: "f51",
        title: "The Treaty of Versailles",
        date: "June 28, 1919",
        year: 1919,
        keywords: "War guilt · Reparations · Seeds of WWII",
        description: "The peace treaty ending WWI forced Germany to accept 'war guilt' and massive reparations. This created the economic resentment and instability that fueled the rise of totalitarianism and WWII.",
        quizDescription: "The WWI peace treaty forced war guilt and reparations on Germany.",
        location: { lat: 48.8, lng: 2.1, region: "Europe", place: "Versailles, France" },
        category: "politics",
        difficulty: 1
    },
    {
        id: "f52",
        title: "The Great Depression",
        date: "1929–1939 CE",
        year: 1929,
        yearEnd: 1939,
        keywords: "Stock market crash · Safety nets · Rise of totalitarianism",
        description: "The most severe economic downturn in modern history, triggered by the US Stock Market Crash. It forced nations to adopt social safety nets and fueled the rise of totalitarian regimes.",
        quizDescription: "The worst modern economic crisis fueled totalitarian regimes.",
        location: { lat: 40.7, lng: -74, region: "Americas", place: "Global (started in US)" },
        category: "politics",
        difficulty: 1
    },
    {
        id: "f53",
        title: "End of World War II",
        date: "1945 CE",
        year: 1945,
        keywords: "Atomic bombs · Superpower shift · European decline",
        description: "The deadliest conflict in history ended with Germany's surrender (May 8) and Japan's after atomic bombs (Sept 2). Power shifted from European empires to two new superpowers.",
        quizDescription: "History's deadliest conflict ended with atomic bombs on Japan.",
        location: { lat: 48.2, lng: 11.8, region: "Europe", place: "Global" },
        category: "war",
        difficulty: 1
    },
    {
        id: "f54",
        title: "Founding of the United Nations",
        date: "October 24, 1945",
        year: 1945,
        keywords: "Human rights · Collective security · Replacing the League",
        description: "Established after WWII to replace the failed League of Nations, with a stronger mandate for international peace. It created the framework for modern International Human Rights Law.",
        quizDescription: "Created after WWII to maintain international peace.",
        location: { lat: 37.8, lng: -122.4, region: "Americas", place: "San Francisco / New York" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f55",
        title: "The Cold War & Nuclear Age",
        date: "1947–1991 CE",
        year: 1947,
        yearEnd: 1991,
        keywords: "MAD doctrine · Proxy wars · Space and computing leaps",
        description: "Intense geopolitical tension between the US and USSR. 'Mutually Assured Destruction' prevented direct war but drove proxy wars and massive technological leaps in aerospace and computing.",
        quizDescription: "US-Soviet rivalry drove proxy wars and a nuclear arms race.",
        location: { lat: 50, lng: 10, region: "Europe", place: "Global" },
        category: "war",
        difficulty: 1
    },
    {
        id: "f56",
        title: "The Decolonization Movement",
        date: "1945–1975 CE",
        year: 1945,
        yearEnd: 1975,
        keywords: "Self-determination · Global South · Sovereign states tripled",
        description: "Dozens of nations in Africa, Asia, and the Middle East gained independence from European rule, increasing sovereign states from ~50 to nearly 200 and shifting global politics toward the 'Global South.'",
        quizDescription: "Dozens of nations gained independence from European empires.",
        location: { lat: 0, lng: 20, region: "Africa", place: "Africa, Asia, Oceania" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f57",
        title: "The Space Race",
        date: "1957–1969 CE",
        year: 1957,
        yearEnd: 1969,
        keywords: "Sputnik · Apollo 11 · Overview Effect",
        description: "From Sputnik (1957) to Apollo 11's Moon landing (July 20, 1969). The competition proved humanity could achieve extraterrestrial travel and fostered the 'Overview Effect.'",
        quizDescription: "Cold War competition drove humanity from Sputnik to the Moon.",
        location: { lat: 28.6, lng: -80.6, region: "Americas", place: "US and USSR" },
        category: "science",
        difficulty: 1
    },
    {
        id: "f58",
        title: "The Digital Revolution & Internet",
        date: "c. 1960s–1990s",
        year: 1960,
        yearEnd: 1995,
        keywords: "ARPANET · Decentralized knowledge · Data-driven world",
        description: "From ARPANET to the public World Wide Web. The most significant communication shift since the printing press — decentralizing knowledge and creating the data-driven world.",
        quizDescription: "From ARPANET to the World Wide Web, connecting billions.",
        location: { lat: 37.4, lng: -122.2, region: "Americas", place: "Global (started in US)" },
        category: "science",
        difficulty: 1
    },
    {
        id: "f59",
        title: "Fall of the Berlin Wall & End of Cold War",
        date: "November 9, 1989 – 1991",
        year: 1989,
        yearEnd: 1991,
        keywords: "Pro-democracy protests · Soviet dissolution · End of ideology war",
        description: "Mass pro-democracy protests destroyed the barrier dividing Berlin, symbolizing the Eastern Bloc's collapse. The Soviet Union formally dissolved in 1991, ending the century's great ideological struggle.",
        quizDescription: "Pro-democracy protests tore down the Berlin Wall.",
        location: { lat: 52.5, lng: 13.4, region: "Europe", place: "Berlin / Europe" },
        category: "politics",
        difficulty: 1
    },
    {
        id: "f60",
        title: "The Maastricht Treaty (EU Founded)",
        date: "February 7, 1992",
        year: 1992,
        keywords: "Euro · EU citizenship · Three-pillar structure",
        description: "Transformed the European Economic Community into the European Union, establishing the Euro, EU citizenship, and three pillars: economic community, foreign policy, and justice cooperation.",
        quizDescription: "Transformed a trade bloc into the EU with the Euro.",
        location: { lat: 50.8, lng: 5.7, region: "Europe", place: "Maastricht, Netherlands" },
        category: "politics",
        difficulty: 2
    }
];

export const ALL_EVENTS = [...CORE_EVENTS, ...DAILY_QUIZ_EVENTS];

export const CORE_EVENT_COUNT = CORE_EVENTS.length; // 60 — for display purposes

export function isDiHEvent(event) {
    return event?.source === 'daily';
}

export function getEventById(id) {
    return ALL_EVENTS.find(e => e.id === id);
}

export function getEventsByIds(ids) {
    return ids.map(id => ALL_EVENTS.find(e => e.id === id)).filter(Boolean);
}

export function formatYear(year, yearEnd) {
    const fmt = (y) => {
        if (y <= -1000000) return `${Math.abs(y / 1000000)}M years ago`;
        if (y <= -100000) return `${Math.abs(y / 1000).toLocaleString()}K years ago`;
        if (y < 0) return `${Math.abs(y)} BCE`;
        return `${y} CE`;
    };
    if (yearEnd != null) {
        return `${fmt(year)} – ${fmt(yearEnd)}`;
    }
    return fmt(year);
}

export const CATEGORY_CONFIG = {
    science: { label: "Science", color: "#0D9488", bg: "#F0FDFA" },
    war: { label: "War", color: "#A0522D", bg: "#FDF2F0" },
    politics: { label: "Politics", color: "#6B5B73", bg: "#F5F3F7" },
    culture: { label: "Culture", color: "#65774A", bg: "#F4F7F0" },
    revolution: { label: "Revolution", color: "#B45309", bg: "#FFF8F0" }
};

export const ERA_RANGES = [
    { id: "prehistory", label: "Prehistory", start: -7000000, end: -3200 },
    { id: "ancient", label: "Ancient", start: -3200, end: 476 },
    { id: "medieval", label: "Medieval", start: 476, end: 1500 },
    { id: "earlymodern", label: "Early Modern", start: 1500, end: 1789 },
    { id: "modern", label: "Modern", start: 1789, end: 9999 }
];

export const ERA_BOUNDARY_EVENTS = {
    prehistory: { startEventId: 'f1', endEventId: 'f9' },
    ancient: { startEventId: 'f9', endEventId: 'f21' },
    medieval: { startEventId: 'f21', endEventId: 'f33' },
    earlymodern: { startEventId: 'f33', endEventId: 'f43' },
    modern: { startEventId: 'f43', endEventId: null },
};

export function getEraBoundaryInfo(eventId) {
    const results = [];
    for (const [eraId, { startEventId, endEventId }] of Object.entries(ERA_BOUNDARY_EVENTS)) {
        const era = ERA_RANGES.find(e => e.id === eraId);
        if (startEventId === eventId) {
            results.push({ type: 'start', eraId, eraLabel: era.label });
        }
        if (endEventId === eventId) {
            results.push({ type: 'end', eraId, eraLabel: era.label });
        }
    }
    return results.length > 0 ? results : null;
}

export function getEraForYear(year) {
    for (const era of ERA_RANGES) {
        if (year >= era.start && year < era.end) return era;
    }
    return ERA_RANGES[ERA_RANGES.length - 1];
}
