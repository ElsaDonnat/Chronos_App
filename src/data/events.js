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
        location: { lat: 1.5, lng: 36.8, region: "East Africa", place: "Rift Valley, Africa" },
        category: "science",
        difficulty: 1,
        controversyNotes: {
            date: "The human\u2013chimpanzee split is estimated at roughly 5\u201310 million years ago, though methods disagree. Molecular clocks, fossil evidence, and genetic analyses give different results, and the divergence was likely gradual rather than a single event.",
        }
    },
    {
        id: "f2",
        title: "The Cooking Revolution",
        date: "c. 1 million – 400,000 years ago",
        year: -1000000,
        yearEnd: -400000,
        keywords: "Fire control · Brain growth · Nutrition",
        description: "Early humans stopped running from fire and started preserving it from natural strikes like lightning. Cooking acted as a 'pre-digestion' step, making it easier to absorb calories — which, according to a prominent theory, may have enabled brain growth and gut reduction.",
        quizDescription: "Controlled fire and cooking may have enabled brain growth and gut reduction.",
        location: { lat: 0, lng: 25, region: "East Africa", place: "Africa and Eurasia" },
        category: "science",
        difficulty: 1,
        controversyNotes: {
            date: "When humans first controlled fire is hotly debated. The earliest secure evidence comes from Wonderwerk Cave, South Africa, at roughly 1 million years ago, though contested claims from other sites go back further. Distinguishing deliberate fire use from natural fires in the archaeological record remains extremely difficult.",
            what: "The 'cooking hypothesis' was popularized by primatologist Richard Wrangham. While influential, some scientists argue that other factors \u2014 meat-eating, tool use, or social cooperation \u2014 were more important drivers of brain growth. The link between cooking and gut reduction remains debated.",
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
        location: { lat: 5, lng: 30, region: "East Africa", place: "Africa" },
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
        description: "Evidence of modern cognitive behaviors accumulated gradually, with a notable acceleration during this period. Complex language and abstract thought allowed cooperation in much larger groups than any other species, enabling art, music, and symbolic culture.",
        quizDescription: "Complex language enabled large-scale cooperation and symbolic culture.",
        location: { lat: 9.6, lng: 40.5, region: "East Africa", place: "Africa" },
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
        description: "Small groups left Africa via the Arabian Peninsula, eventually reaching the Americas via the Bering Land Bridge and possibly coastal routes. They encountered and interbred with Neanderthals and Denisovans \u2014 whose DNA survives in us today \u2014 though these species eventually disappeared. Distinct cultures developed worldwide.",
        quizDescription: "Humans left Africa and spread across every continent.",
        location: { lat: 15, lng: 45, region: "East Africa", place: "Global (from East Africa)" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "The Bering Land Bridge was long considered the sole route to the Americas, but growing archaeological and genetic evidence now supports coastal migration routes as equally or more plausible. Some pre-Clovis sites suggest humans arrived earlier than a purely Beringia-based timeline allows.",
        }
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
        description: "Upper and Lower Egypt merged under a single divine 'God-King' ruler and centralized bureaucracy capable of massive projects like the Pyramids, creating a civilization that endured for nearly 3,000 years.",
        quizDescription: "Upper and Lower Egypt merged under a divine ruler.",
        location: { lat: 26, lng: 31.5, region: "North Africa", place: "Nile River Valley, Egypt" },
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
            date: "Whether Sumerian cuneiform or Egyptian hieroglyphs came first is debated. Earlier mark systems like Vin\u010Da symbols exist, but most scholars classify them as ownership or ritual marks rather than true writing. The boundary between 'record-keeping tokens' and 'true writing' is itself disputed.",
        }
    },
    {
        id: "f10",
        title: "The Code of Hammurabi",
        date: "c. 1750 BCE",
        year: -1750,
        keywords: "Written law · Social contract · Standardized justice",
        description: "282 laws inscribed on stone that established standardized justice. It shifted power from the 'whim of the king' to a written legal code covering family, property, and criminal offenses. Its most famous principle \u2014 'an eye for an eye' \u2014 was revolutionary: punishment had to be proportional, not arbitrary.",
        quizDescription: "282 laws on stone created the ancient world's most complete legal code.",
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
            date: "776 BCE is the traditional date based on ancient Greek victor lists, but archaeological evidence suggests organized games at Olympia may not have become significant until around 700 BCE. The date marks the first recorded victor (Coroebus of Elis), not a firm archaeological benchmark.",
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
        description: "A cross-civilizational intellectual shift toward universal ethics and logic. It independently produced Greek philosophy, the Hebrew prophetic tradition, Buddhism, and Confucianism across widely separated civilizations.",
        quizDescription: "Greek philosophy, Hebrew prophecy, Buddhism, and Confucianism emerged independently.",
        location: { lat: 30, lng: 60, region: "South Asia", place: "India, China, and Greece" },
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
        location: { lat: 34.3, lng: 108.9, region: "East Asia", place: "China" },
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
            date: "Jesus\u2019s birth year is debated: Matthew places it before Herod\u2019s death (4 BCE), while Luke\u2019s census reference suggests 6 CE. Most scholars date the crucifixion to 30 or 33 CE. The traditional \u2018AD 1\u2019 calculation by Dionysius Exiguus is now known to be off by several years.",
        }
    },
    {
        id: "f20",
        title: "Edict of Milan (Constantine)",
        date: "313 CE",
        year: 313,
        keywords: "Legalization · Constantinople · East-West split",
        description: "Emperor Constantine granted legal status to Christianity. He later founded Constantinople as a new eastern capital (330 CE), ensuring the survival of Roman law and Christian faith in the East for another millennium.",
        quizDescription: "Constantine legalized Christianity and later founded Constantinople as the empire's eastern capital.",
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
            date: "476 CE (deposition of Romulus Augustulus) is the traditional date, but the 'fall' was a gradual process. Some historians prefer 410 (Visigoth sack of Rome), 455 (Vandal sack), or argue there was no single fall \u2014 Roman institutions simply dissolved over generations.",
        }
    },
    {
        id: "f22",
        title: "The Plague of Justinian",
        date: "541–549 CE",
        year: 541,
        yearEnd: 549,
        keywords: "Bubonic plague · Byzantine military · Islamic expansion",
        description: "The first major bubonic plague outbreak, killing millions of people. It crippled the Byzantine military during their attempted reconquest of the West, contributing to the later success of Islamic conquests.",
        quizDescription: "The first bubonic plague killed millions and crippled Byzantine reconquest.",
        location: { lat: 41, lng: 29, region: "Europe", place: "Mediterranean World" },
        category: "science",
        difficulty: 3,
        controversyNotes: {
            what: "Traditional estimates of 15\u2013100 million deaths are now widely questioned. Recent DNA and archaeological studies suggest the plague\u2019s demographic impact, while severe, was significantly less catastrophic than older sources claimed. The wide range itself reflects deep uncertainty in the evidence.",
        }
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
        location: { lat: 17, lng: -90, region: "Central America", place: "Mesoamerica (Mexico, Guatemala, Belize)" },
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
        location: { lat: 34.3, lng: 108.9, region: "East Asia", place: "China and Central Asia" },
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
        description: "Under the Abbasid Caliphate, scholars in Baghdad's 'House of Wisdom' pioneered algebra, advanced optics, and created early hospitals \u2014 the intellectual bridge between the ancient world and the European Renaissance.",
        quizDescription: "Baghdad's scholars pioneered algebra and advanced optics.",
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
        location: { lat: 47.9, lng: 106.9, region: "Central Asia", place: "Eurasia (China to Eastern Europe)" },
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
        description: "The Ottoman Turks captured the Byzantine capital, ending the Roman political lineage. Greek scholars fled to Italy bringing ancient texts that accelerated the already-flourishing Renaissance.",
        quizDescription: "Ottoman Turks captured Constantinople, ending Byzantium.",
        location: { lat: 41, lng: 29, region: "Europe", place: "Constantinople (Istanbul)" },
        category: "war",
        difficulty: 1,
        controversyNotes: {
            date: "When exactly did the Middle Ages end? There is no single answer. 1453 (Fall of Constantinople) is favoured by historians who emphasise the end of the last Roman successor state and the flight of Greek scholars to Italy. 1492 (Columbus) is preferred by those who see European overseas expansion as the decisive break. 1517 (Luther\u2019s 95 Theses) marks the Reformation as the turning point. Some textbooks simply use \u2018c. 1500\u2019 as a convenient round number. Each date highlights a different force \u2014 Ottoman conquest, Atlantic exploration, or religious schism \u2014 and the reality is that these changes overlapped across decades, making any single date a scholarly convention rather than a hard boundary.",
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
        location: { lat: 24, lng: -75, region: "Central America", place: "The Caribbean" },
        category: "war",
        difficulty: 1,
        controversyNotes: {
            date: "1492 is widely used as the start of the Early Modern period, but there is no consensus. Competing dates include 1453 (Fall of Constantinople, ending the last Roman successor state), 1517 (Luther\u2019s Reformation), or simply \u2018c. 1500\u2019 as a round number. Each date reflects a different view of what drove the transition \u2014 Ottoman expansion, religious upheaval, or European overseas contact. The truth is that periodization is a scholarly convenience, not a historical fact.",
            location: "Columbus never reached the mainland Americas in 1492. He landed on an island in the Bahamas \u2014 probably San Salvador or Samana Cay (scholars disagree). He believed he had reached Asia until his death in 1506.",
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
        description: "The first expedition to sail around the entire globe, revealing that the Pacific Ocean was far vaster than anyone imagined. It connected the Americas to Asia, forging the first truly global trade network.",
        quizDescription: "The first voyage around the entire globe revealed the Pacific\u2019s immense scale.",
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
        location: { lat: 10, lng: -30, region: "West Africa", place: "Atlantic, Africa, Americas" },
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
        description: "13 British colonies won independence, forming the United States. The Declaration of Independence (1776) was the first large-scale implementation of Enlightenment ideals, later formalized in the US Constitution.",
        quizDescription: "Thirteen colonies won independence from Britain.",
        location: { lat: 39, lng: -77, region: "North America", place: "North America" },
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
        description: "Triggered by financial crisis and Enlightenment ideals. The Storming of the Bastille led to the Declaration of the Rights of Man, the execution of Louis XVI, and the Reign of Terror \u2014 permanently ending feudalism in France.",
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
        description: "European powers reorganized the continent after Napoleon, restoring monarchies and redrawing borders. It established a balance of power that prevented another general European war for roughly a century, though significant regional wars still occurred.",
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
        description: "A massive wave of simultaneous pro-democracy revolts swept across dozens of European states and territories. Though many were suppressed short-term, they permanently weakened absolute monarchies.",
        quizDescription: "Pro-democracy revolts swept dozens of European states at once.",
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
        location: { lat: 20, lng: -30, region: "North America", place: "Atlantic World" },
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
        description: "14 nations, mostly European, divided Africa with no African representatives. The arbitrary 'Paper Partition' ignored ethnic and cultural boundaries, creating geopolitical challenges that persist today.",
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
        location: { lat: 40.7, lng: -74, region: "North America", place: "Global (started in US)" },
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
        location: { lat: 37.8, lng: -122.4, region: "North America", place: "San Francisco / New York" },
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
        location: { lat: 0, lng: 20, region: "East Africa", place: "Africa, Asia, Oceania" },
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
        description: "From Sputnik (1957) to Apollo 11's Moon landing (July 20, 1969). The competition proved humanity could achieve extraterrestrial travel. Astronauts later described a profound shift in perspective from seeing Earth from space, a phenomenon eventually named the 'Overview Effect.'",
        quizDescription: "Cold War competition drove humanity from Sputnik to the Moon.",
        location: { lat: 28.6, lng: -80.6, region: "North America", place: "US and USSR" },
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
        location: { lat: 37.4, lng: -122.2, region: "North America", place: "Global (started in US)" },
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
    },

    // ─── Level 2: Revolutions Chapter ───────────────────────────────────
    {
        id: "f61",
        title: "The English Civil War",
        date: "1642\u20131651 CE",
        year: 1642,
        yearEnd: 1651,
        keywords: "Parliamentarians \u00B7 Regicide \u00B7 Constitutional monarchy",
        description: "A series of civil wars between Parliamentarians and Royalists over the governance of England. King Charles I was tried and executed in 1649 \u2014 the first time a European monarch was formally killed by his own people, establishing the radical principle that rulers answer to the law, not the other way around.",
        quizDescription: "Parliament fought the king, executing Charles I.",
        location: { lat: 51.5, lng: -0.1, region: "Europe", place: "England" },
        category: "revolution",
        difficulty: 2
    },
    {
        id: "f62",
        title: "The Haitian Revolution",
        date: "1791\u20131804 CE",
        year: 1791,
        yearEnd: 1804,
        keywords: "Slave revolt \u00B7 Toussaint Louverture \u00B7 First Black republic",
        description: "The only successful large-scale slave revolt in history. Enslaved Africans in the French colony of Saint-Domingue overthrew their masters, defeated Napoleon\u2019s expeditionary army, and established Haiti \u2014 the first free Black republic and the second independent nation in the Western Hemisphere after the United States.",
        quizDescription: "Enslaved people overthrew French colonial rule in Haiti.",
        location: { lat: 19.0, lng: -72.0, region: "Central America", place: "Saint-Domingue (Haiti)" },
        category: "revolution",
        difficulty: 2
    },
    {
        id: "f63",
        title: "Latin American Wars of Independence",
        date: "1808\u20131833 CE",
        year: 1808,
        yearEnd: 1833,
        keywords: "Bol\u00EDvar \u00B7 San Mart\u00EDn \u00B7 Colonial liberation",
        description: "Inspired by the American and French Revolutions and triggered by Napoleon\u2019s invasion of Spain, liberation movements led by Sim\u00F3n Bol\u00EDvar, Jos\u00E9 de San Mart\u00EDn, and others freed most of Central and South America from Spanish and Portuguese colonial rule within a single generation.",
        quizDescription: "Bol\u00EDvar and San Mart\u00EDn freed Latin America from colonial rule.",
        location: { lat: -15, lng: -60, region: "South America", place: "South America" },
        category: "revolution",
        difficulty: 2
    },
    {
        id: "f64",
        title: "World War I",
        date: "1914\u20131918 CE",
        year: 1914,
        yearEnd: 1918,
        keywords: "Trenches \u00B7 Total war \u00B7 Collapse of empires",
        description: "The first global industrialized war, triggered by a web of alliances after the assassination of Archduke Franz Ferdinand. It killed over 16 million people, destroyed the Ottoman, Austro-Hungarian, Russian, and German empires, and its harsh aftermath sowed the seeds of an even deadlier second war.",
        quizDescription: "A web of alliances plunged the world into industrial-scale war.",
        location: { lat: 49.5, lng: 2.9, region: "Europe", place: "Europe (Western Front)" },
        category: "war",
        difficulty: 1
    },
    {
        id: "f65",
        title: "The Chinese Communist Revolution",
        date: "1927\u20131949 CE",
        year: 1927,
        yearEnd: 1949,
        keywords: "Mao Zedong \u00B7 Long March \u00B7 People\u2019s Republic",
        description: "A decades-long struggle between Mao Zedong\u2019s Communist Party and Chiang Kai-shek\u2019s Nationalists, interrupted by the Japanese invasion. Mao\u2019s victory in 1949 established the People\u2019s Republic of China, bringing a quarter of humanity under communist rule and reshaping the global balance of power.",
        quizDescription: "Mao\u2019s Communists defeated the Nationalists after decades of civil war.",
        location: { lat: 39.9, lng: 116.4, region: "East Asia", place: "China (Beijing)" },
        category: "revolution",
        difficulty: 2
    },
    {
        id: "f66",
        title: "The Iranian Revolution",
        date: "1978\u20131979 CE",
        year: 1978,
        yearEnd: 1979,
        keywords: "Ayatollah Khomeini \u00B7 Islamic Republic \u00B7 Anti-Western",
        description: "Mass protests toppled the Western-backed Shah and established an Islamic Republic under Ayatollah Khomeini. It was the first modern revolution to install a theocratic government, transforming Iran from a Cold War ally of the West into a center of anti-Western Islamism that reshaped Middle Eastern politics.",
        quizDescription: "Mass protests toppled the Shah and created an Islamic Republic.",
        location: { lat: 35.7, lng: 51.4, region: "Middle East", place: "Tehran, Iran" },
        category: "revolution",
        difficulty: 2
    },
    {
        id: "f67",
        title: "The Arab Spring",
        date: "2010\u20132012 CE",
        year: 2010,
        yearEnd: 2012,
        keywords: "Social media \u00B7 Pro-democracy \u00B7 Regime change",
        description: "A wave of anti-authoritarian protests swept across the Arab world, sparked by a street vendor\u2019s self-immolation in Tunisia. Social media amplified dissent at unprecedented speed. Some regimes fell (Tunisia, Egypt, Libya), while others descended into devastating civil wars (Syria, Yemen), reshaping the region.",
        quizDescription: "Pro-democracy protests swept the Arab world, amplified by social media.",
        location: { lat: 34.0, lng: 9.0, region: "North Africa", place: "Tunisia (spreading region-wide)" },
        category: "revolution",
        difficulty: 2
    },

    // --- Level 2: Road to AI Chapter ---
    {
        id: "f68",
        title: "Babbage & Lovelace\u2019s Analytical Engine",
        date: "1837\u20131843 CE",
        year: 1837,
        yearEnd: 1843,
        keywords: "Mechanical computer \u00B7 First algorithm \u00B7 Programmable machine",
        description: "Charles Babbage designed the Analytical Engine \u2014 the first general-purpose mechanical computer, with memory, a processor, and the ability to be programmed with punched cards. Ada Lovelace wrote what is considered the first computer algorithm in her 1843 notes, and prophetically envisioned that such machines could go beyond pure mathematics.",
        quizDescription: "Babbage designed the first general-purpose computer; Lovelace wrote its first algorithm.",
        location: { lat: 51.5, lng: -0.1, region: "Europe", place: "London, England" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f69",
        title: "Boolean Algebra & Formal Logic",
        date: "1847\u20131854 CE",
        year: 1847,
        yearEnd: 1854,
        keywords: "George Boole \u00B7 Binary logic \u00B7 True/false reasoning",
        description: "George Boole reduced the rules of logical reasoning to a simple algebra of 1s and 0s. His 1854 work \u2018The Laws of Thought\u2019 showed that all of logic could be expressed as mathematical operations \u2014 an insight that would become the foundation of every digital circuit and computer program a century later.",
        quizDescription: "Boole reduced logic to an algebra of 1s and 0s, the basis of digital computing.",
        location: { lat: 51.9, lng: -8.5, region: "Europe", place: "Cork, Ireland" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f70",
        title: "Turing & the Universal Machine",
        date: "1936\u20131950 CE",
        year: 1936,
        yearEnd: 1950,
        keywords: "Computability \u00B7 Turing Test \u00B7 Theoretical computer science",
        description: "Alan Turing\u2019s 1936 paper proved that a single machine could compute anything computable by following simple rules on a strip of tape \u2014 the theoretical blueprint for all modern computers. During WWII he cracked the Enigma code at Bletchley Park. In 1950, he proposed the \u2018Turing Test\u2019 for machine intelligence, asking: if a computer\u2019s responses are indistinguishable from a human\u2019s, can we deny it thinks?",
        quizDescription: "Turing proved a single machine could compute anything computable.",
        location: { lat: 51.75, lng: -1.26, region: "Europe", place: "Cambridge & Manchester, England" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f71",
        title: "ENIAC & the First Electronic Computers",
        date: "1945\u20131946 CE",
        year: 1945,
        yearEnd: 1946,
        keywords: "Vacuum tubes \u00B7 Electronic computation \u00B7 Military origins",
        description: "ENIAC (Electronic Numerical Integrator and Computer), built at the University of Pennsylvania, was the first general-purpose electronic computer. Filling an entire room with 18,000 vacuum tubes, it could perform calculations thousands of times faster than any human \u2014 a military tool that proved electronic computing was possible.",
        quizDescription: "ENIAC proved electronic computing was possible with 18,000 vacuum tubes.",
        location: { lat: 39.95, lng: -75.19, region: "North America", place: "Philadelphia, Pennsylvania" },
        category: "science",
        difficulty: 1,
        controversyNotes: {
            what: "Whether ENIAC was truly the \u2018first\u2019 electronic computer is debated. Britain\u2019s Colossus (1943\u201344) was earlier but special-purpose and classified. The Atanasoff\u2013Berry Computer (1942) performed electronic computation but was not programmable. ENIAC\u2019s claim rests on being the first general-purpose, fully electronic, and programmable machine.",
        }
    },
    {
        id: "f72",
        title: "The Transistor & Integrated Circuit",
        date: "1947\u20131958 CE",
        year: 1947,
        yearEnd: 1958,
        keywords: "Semiconductor \u00B7 Miniaturization \u00B7 Silicon chip",
        description: "Bell Labs invented the transistor in 1947, replacing fragile vacuum tubes with tiny, reliable switches. Jack Kilby and Robert Noyce then independently created the integrated circuit in 1958, cramming multiple transistors onto a single chip. This launched the relentless miniaturization that would make computers millions of times more powerful within decades.",
        quizDescription: "The transistor and integrated circuit launched relentless computing miniaturization.",
        location: { lat: 40.68, lng: -74.4, region: "North America", place: "Murray Hill, New Jersey" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f73",
        title: "The Dartmouth Conference \u2014 AI Is Born",
        date: "1956 CE",
        year: 1956,
        keywords: "John McCarthy \u00B7 Artificial intelligence coined \u00B7 Symbolic reasoning",
        description: "A small summer workshop at Dartmouth College, organized by John McCarthy, Marvin Minsky, and others, coined the term \u2018artificial intelligence\u2019 and set the field\u2019s ambitious agenda: to make machines that could reason, learn, and use language. The optimism was enormous \u2014 researchers predicted human-level AI within a generation.",
        quizDescription: "A 1956 workshop coined \u2018artificial intelligence\u2019 and launched the field.",
        location: { lat: 43.7, lng: -72.29, region: "North America", place: "Hanover, New Hampshire" },
        category: "science",
        difficulty: 1
    },
    {
        id: "f74",
        title: "Expert Systems & the AI Winters",
        date: "1974\u20131993 CE",
        year: 1974,
        yearEnd: 1993,
        keywords: "Lighthill Report \u00B7 Hype cycle \u00B7 Funding collapse",
        description: "After initial hype, AI hit two brutal \u2018winters.\u2019 The first (1974\u20131980) came when early AI failed to handle real-world complexity. A brief revival through rule-based \u2018expert systems\u2019 in the 1980s ended in a second winter (1987\u20131993) when those systems proved brittle and expensive. Each time, funding and confidence collapsed.",
        quizDescription: "Overpromising led to two brutal AI funding collapses.",
        location: { lat: 38.9, lng: -77.04, region: "North America", place: "Global (US, UK, Japan)" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f75",
        title: "Deep Blue Defeats Kasparov",
        date: "1997 CE",
        year: 1997,
        keywords: "IBM \u00B7 Chess \u00B7 Brute-force search",
        description: "IBM\u2019s Deep Blue supercomputer defeated reigning world chess champion Garry Kasparov in a six-game match \u2014 the first time a machine beat a world champion under standard rules. Though it relied on brute-force calculation rather than true \u2018understanding,\u2019 it was a watershed moment that showed machines could outperform humans in complex intellectual tasks.",
        quizDescription: "IBM\u2019s Deep Blue beat the world chess champion.",
        location: { lat: 40.76, lng: -73.97, region: "North America", place: "New York City, USA" },
        category: "science",
        difficulty: 1
    },
    {
        id: "f76",
        title: "The Deep Learning Breakthrough",
        date: "2012 CE",
        year: 2012,
        keywords: "AlexNet \u00B7 Neural networks \u00B7 GPU training",
        description: "A neural network called AlexNet, trained on GPUs, crushed the competition in the ImageNet image recognition challenge, reducing error rates dramatically. This proved that deep neural networks \u2014 loosely inspired by the brain \u2014 could learn patterns from massive data, reigniting AI research and investment after decades of skepticism.",
        quizDescription: "AlexNet proved deep neural networks could learn from massive data.",
        location: { lat: 43.47, lng: -80.52, region: "North America", place: "Toronto, Canada" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f77",
        title: "Large Language Models & the AI Explosion",
        date: "2017\u20132023 CE",
        year: 2017,
        yearEnd: 2023,
        keywords: "Transformer \u00B7 GPT \u00B7 ChatGPT \u00B7 Generative AI",
        description: "Google\u2019s 2017 \u2018Attention Is All You Need\u2019 paper introduced the Transformer architecture, enabling models to process language with unprecedented power. This led to GPT, BERT, and eventually ChatGPT (2022), which stunned the world by holding coherent conversations, writing code, and passing professional exams \u2014 making AI a daily reality for billions.",
        quizDescription: "Transformers and ChatGPT made AI a daily reality for billions.",
        location: { lat: 37.4, lng: -122.1, region: "North America", place: "San Francisco Bay Area, USA" },
        category: "science",
        difficulty: 2
    },

    // --- Level 2: Fight for Freedom Chapter ---
    {
        id: "f78",
        title: "The Abolitionist Movement",
        date: "1787\u20131833 CE",
        year: 1787,
        yearEnd: 1833,
        keywords: "William Wilberforce \u00B7 Moral crusade \u00B7 Parliament",
        description: "A groundswell of moral outrage, led by activists like William Wilberforce and Olaudah Equiano, forced Britain to abolish the slave trade (1807) and then slavery itself (1833). It was the first mass human-rights campaign in history \u2014 ordinary citizens signed petitions, boycotted sugar, and pressured Parliament to end a hugely profitable system.",
        quizDescription: "Britain\u2019s mass moral campaign abolished the slave trade and then slavery.",
        location: { lat: 51.5, lng: -0.1, region: "Europe", place: "London, England" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f79",
        title: "The Underground Railroad & Frederick Douglass",
        date: "1830s\u20131860s CE",
        year: 1830,
        yearEnd: 1865,
        keywords: "Harriet Tubman \u00B7 Escaped slaves \u00B7 Abolition",
        description: "A secret network of safe houses and brave guides helped thousands of enslaved people escape to freedom in the northern US and Canada. Frederick Douglass, who escaped slavery himself, became the movement\u2019s most powerful voice \u2014 his autobiography and speeches shattered white assumptions about Black intellect and made abolition impossible to ignore.",
        quizDescription: "Secret networks and Douglass\u2019s voice helped enslaved people escape and galvanized abolition.",
        location: { lat: 39.3, lng: -76.6, region: "North America", place: "Eastern United States" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f80",
        title: "The Suffragette Movement",
        date: "1848\u20131920 CE",
        year: 1848,
        yearEnd: 1920,
        keywords: "Women\u2019s suffrage \u00B7 Seneca Falls \u00B7 Emmeline Pankhurst",
        description: "The Seneca Falls Convention (1848) launched the organized fight for women\u2019s right to vote. In Britain, the Suffragettes used hunger strikes, protests, and civil disobedience. New Zealand became the first country to grant women\u2019s suffrage in 1893; the US followed in 1920. The movement proved that rights considered \u2018natural\u2019 had to be fought for by those excluded.",
        quizDescription: "Decades of protest won women the right to vote, starting with New Zealand in 1893.",
        location: { lat: 42.9, lng: -76.8, region: "North America", place: "Seneca Falls, New York / London" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f81",
        title: "Indian Independence & Gandhi",
        date: "1920\u20131947 CE",
        year: 1920,
        yearEnd: 1947,
        keywords: "Non-violence \u00B7 Salt March \u00B7 Partition",
        description: "Mahatma Gandhi\u2019s strategy of non-violent resistance \u2014 mass boycotts, civil disobedience, and the iconic Salt March (1930) \u2014 united millions against British colonial rule. India gained independence in 1947, though at the terrible cost of Partition, which split the subcontinent into India and Pakistan and caused over a million deaths.",
        quizDescription: "Gandhi\u2019s non-violent resistance won India\u2019s independence from Britain.",
        location: { lat: 28.6, lng: 77.2, region: "South Asia", place: "India (subcontinent-wide)" },
        category: "politics",
        difficulty: 1
    },
    {
        id: "f82",
        title: "The US Civil Rights Movement",
        date: "1954\u20131968 CE",
        year: 1954,
        yearEnd: 1968,
        keywords: "Martin Luther King Jr. \u00B7 Segregation \u00B7 Nonviolent protest",
        description: "From the Supreme Court\u2019s Brown v. Board ruling (1954) to the Civil Rights Act (1964) and the assassination of Martin Luther King Jr. (1968). Through sit-ins, marches, and Freedom Rides, Black Americans and their allies dismantled legal segregation \u2014 proving that Gandhi\u2019s non-violent methods could transform even the most entrenched racial hierarchy.",
        quizDescription: "Sit-ins, marches, and legislation dismantled legal segregation in America.",
        location: { lat: 33.5, lng: -86.8, region: "North America", place: "Southern United States" },
        category: "politics",
        difficulty: 1
    },
    {
        id: "f83",
        title: "Apartheid & Mandela",
        date: "1948\u20131994 CE",
        year: 1948,
        yearEnd: 1994,
        keywords: "Racial segregation \u00B7 Robben Island \u00B7 Rainbow Nation",
        description: "South Africa\u2019s apartheid system enforced racial segregation with brutal efficiency for nearly five decades. Nelson Mandela spent 27 years in prison \u2014 18 of them on Robben Island \u2014 before his release in 1990. International sanctions, internal resistance, and Mandela\u2019s extraordinary capacity for reconciliation led to the first free elections in 1994 and the birth of the \u2018Rainbow Nation.\u2019",
        quizDescription: "Mandela\u2019s 27-year imprisonment and reconciliation ended apartheid in South Africa.",
        location: { lat: -33.9, lng: 18.4, region: "Southern Africa", place: "South Africa" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f84",
        title: "Stonewall & LGBTQ+ Rights",
        date: "1969 CE",
        year: 1969,
        keywords: "Gay liberation \u00B7 Pride \u00B7 Marsha P. Johnson",
        description: "On June 28, 1969, patrons of the Stonewall Inn in New York City fought back against a police raid, sparking days of protests. The uprising \u2014 with which figures like Marsha P. Johnson and Storm\u00e9 DeLarverie became closely associated, though their precise roles on the first night are debated \u2014 launched the modern LGBTQ+ rights movement. Within a year, the first Pride marches were held. It proved that civil rights logic could expand to include sexual and gender identity.",
        quizDescription: "The Stonewall uprising launched the modern LGBTQ+ rights movement.",
        location: { lat: 40.73, lng: -74.0, region: "North America", place: "New York City, USA" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f85",
        title: "Tiananmen Square Protests",
        date: "1989 CE",
        year: 1989,
        keywords: "Pro-democracy \u00B7 Tank Man \u00B7 Censorship",
        description: "In the spring of 1989, over a million Chinese students and workers occupied Beijing\u2019s Tiananmen Square demanding democratic reforms. On June 4, the government sent in tanks and troops, killing hundreds to thousands. The iconic \u2018Tank Man\u2019 image became a global symbol of individual courage against authoritarian power \u2014 and of the limits of peaceful protest when a state chooses violence.",
        quizDescription: "Pro-democracy protests in Beijing were crushed by the military on June 4, 1989.",
        location: { lat: 39.9, lng: 116.4, region: "East Asia", place: "Beijing, China" },
        category: "politics",
        difficulty: 1
    },
    {
        id: "f86",
        title: "The Rwandan Genocide & \u2018Never Again\u2019",
        date: "1994 CE",
        year: 1994,
        keywords: "Hutu \u00B7 Tutsi \u00B7 International failure",
        description: "In just 100 days, Hutu extremists murdered approximately 800,000 Tutsi and moderate Hutu in Rwanda \u2014 while the world watched and did nothing. Colonial Belgium had deepened ethnic divisions; post-colonial politics weaponized them. The genocide exposed the hollow promise of \u2018Never Again\u2019 and led to the doctrine of \u2018Responsibility to Protect,\u2019 reshaping how the world thinks about intervention.",
        quizDescription: "800,000 were murdered in 100 days while the world failed to intervene.",
        location: { lat: -1.9, lng: 29.9, region: "East Africa", place: "Rwanda" },
        category: "war",
        difficulty: 2
    },
    {
        id: "f87",
        title: "Digital Activism & Global Protests",
        date: "2010s\u20132020s CE",
        year: 2010,
        yearEnd: 2020,
        keywords: "Hashtag movements \u00B7 #MeToo \u00B7 Black Lives Matter",
        description: "Social media transformed protest. The Arab Spring (2011), #MeToo (2017), Black Lives Matter, and climate strikes all used hashtags, livestreams, and viral videos to organize millions across borders in days. Digital tools democratized activism \u2014 anyone with a phone could document injustice and rally support \u2014 but also exposed new vulnerabilities: surveillance, misinformation, and algorithmic suppression.",
        quizDescription: "Social media transformed protest with #MeToo, BLM, and climate strikes.",
        location: { lat: 38.9, lng: -77.0, region: "North America", place: "Global (US-centered online)" },
        category: "politics",
        difficulty: 2
    },

    // --- Level 2: Empires Rise & Fall Chapter ---
    {
        id: "f88",
        title: "The Achaemenid Persian Empire",
        date: "550\u2013330 BCE",
        year: -550,
        yearEnd: -330,
        keywords: "Cyrus the Great \u00B7 Royal Road \u00B7 Tolerance",
        description: "Cyrus the Great conquered Mesopotamia and Central Asia; his son Cambyses II added Egypt, forging the largest empire the world had ever seen. The Persians governed through tolerance \u2014 respecting local customs, religions, and languages. Their Royal Road postal system and standardized coinage created a template for every empire that followed.",
        quizDescription: "Cyrus the Great built what was then the world\u2019s largest empire through conquest and tolerance.",
        location: { lat: 30.0, lng: 52.5, region: "Middle East", place: "Persepolis, Persia (modern Iran)" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f89",
        title: "The Maurya Empire & Ashoka",
        date: "322\u2013185 BCE",
        year: -322,
        yearEnd: -185,
        keywords: "Ashoka \u00B7 Non-violence \u00B7 Indian unification",
        description: "Chandragupta Maurya unified most of the Indian subcontinent for the first time. His grandson Ashoka, horrified by the carnage of his own conquest of Kalinga, renounced violence and embraced Buddhism. He erected stone pillars proclaiming religious tolerance and compassion \u2014 making the Maurya Empire the first state to be governed by an explicit moral philosophy.",
        quizDescription: "Ashoka renounced violence and governed India by Buddhist moral philosophy.",
        location: { lat: 25.6, lng: 85.1, region: "South Asia", place: "Pataliputra, India" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f90",
        title: "The Han Dynasty",
        date: "206 BCE \u2013 220 CE",
        year: -206,
        yearEnd: 220,
        keywords: "Silk Road \u00B7 Civil service \u00B7 Paper invention",
        description: "The Han Dynasty consolidated China\u2019s vast territory, established a Confucian-based civil service, and opened the Silk Road, linking East Asia to Rome for the first time. They invented paper, advanced iron-casting, and created a bureaucratic model so successful that \u2018Han\u2019 remains the ethnic identity of China\u2019s majority population today.",
        quizDescription: "The Han opened the Silk Road and built a civil service model that endures today.",
        location: { lat: 34.3, lng: 108.9, region: "East Asia", place: "Chang\u2019an (Xi\u2019an), China" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f91",
        title: "The Gupta Golden Age",
        date: "320\u2013550 CE",
        year: 320,
        yearEnd: 550,
        keywords: "Zero \u00B7 Sanskrit literature \u00B7 Hindu renaissance",
        description: "Under the Gupta Dynasty, India experienced a flowering of art, science, and philosophy. Mathematicians developed zero as a true number \u2014 not just a placeholder but something you could add, subtract, and calculate with \u2014 along with the decimal system the world uses today. Kalidasa wrote masterpieces of Sanskrit literature, and Hindu temple architecture reached new heights \u2014 making this era India\u2019s classical golden age.",
        quizDescription: "Gupta India developed zero as a true number and experienced a cultural golden age.",
        location: { lat: 25.3, lng: 83.0, region: "South Asia", place: "Northern India" },
        category: "culture",
        difficulty: 2,
        controversyNotes: {
            what: "The Babylonians used a placeholder zero centuries earlier, and Mayan mathematicians independently developed zero around the same period as the Gupta. The Indian contribution was specifically treating zero as a number in its own right \u2014 with defined arithmetic operations \u2014 a conceptual leap that, via Arab mathematicians, gave the world the modern numeral system.",
        }
    },
    {
        id: "f92",
        title: "The Ottoman Empire\u2019s Rise",
        date: "1299\u20131566 CE",
        year: 1299,
        yearEnd: 1566,
        keywords: "Constantinople \u00B7 Suleiman the Magnificent \u00B7 Three continents",
        description: "From a small Anatolian state, the Ottomans conquered Constantinople in 1453, ending the Byzantine Empire. Under Suleiman the Magnificent, the empire spanned three continents, from the Balkans to North Africa to the Arabian Peninsula. Ottoman administration blended Islamic law with pragmatic tolerance of religious minorities \u2014 a multi-ethnic superpower that lasted over 600 years.",
        quizDescription: "The Ottomans conquered Constantinople and built a three-continent superpower.",
        location: { lat: 41.0, lng: 29.0, region: "Middle East", place: "Constantinople (Istanbul)" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f93",
        title: "The Ming Dynasty & the Treasure Fleets",
        date: "1368\u20131644 CE",
        year: 1368,
        yearEnd: 1644,
        keywords: "Zheng He \u00B7 Forbidden City \u00B7 Great Wall rebuilt",
        description: "After driving out the Mongols, the Ming Dynasty rebuilt China into one of the world\u2019s most advanced civilizations. Admiral Zheng He commanded enormous treasure fleets that reached Africa decades before Columbus crossed the Atlantic. But China then turned inward, dismantling its fleet \u2014 one of history\u2019s great \u2018what ifs\u2019 that left the Age of Exploration to Europe.",
        quizDescription: "Ming China sent treasure fleets to Africa, then turned inward \u2014 leaving exploration to Europe.",
        location: { lat: 39.9, lng: 116.4, region: "East Asia", place: "Beijing, China" },
        category: "politics",
        difficulty: 2,
        controversyNotes: {
            what: "The \u2018China turned inward\u2019 narrative is debated. Some historians argue the fleet\u2019s dismantling was a rational fiscal decision \u2014 the treasure voyages were enormously expensive and yielded little trade revenue. Others point to factional politics: Confucian bureaucrats opposed the eunuch-led maritime program. The idea that China \u2018missed\u2019 the Age of Exploration projects European values onto Chinese priorities.",
        }
    },
    {
        id: "f94",
        title: "The British Empire at Its Peak",
        date: "1815\u20131914 CE",
        year: 1815,
        yearEnd: 1914,
        keywords: "Pax Britannica \u00B7 Quarter of the globe \u00B7 Industrial might",
        description: "After Napoleon\u2019s defeat, Britain came to rule a quarter of the world\u2019s land and people \u2014 the largest empire in history. Industrial supremacy, the Royal Navy, and the telegraph held it together. It spread railways, law, and the English language \u2014 but also extraction, famine, and racial hierarchies that scarred colonies for generations.",
        quizDescription: "Britain ruled a quarter of the world, spreading industry and exploitation alike.",
        location: { lat: 51.5, lng: -0.1, region: "Europe", place: "London (global reach)" },
        category: "politics",
        difficulty: 1
    },
    {
        id: "f95",
        title: "The Fall of the Ottoman Empire",
        date: "1908\u20131922 CE",
        year: 1908,
        yearEnd: 1922,
        keywords: "Young Turks \u00B7 WWI defeat \u00B7 Atat\u00FCrk",
        description: "Centuries of slow decline accelerated when the Ottomans entered World War I on the losing side. The empire collapsed into revolution, genocide of Armenians, and foreign occupation. Mustafa Kemal Atat\u00FCrk forged modern Turkey from the wreckage \u2014 but the borders drawn by European powers across the Middle East created conflicts that rage to this day.",
        quizDescription: "WWI destroyed the Ottoman Empire; European-drawn borders reshaped the Middle East.",
        location: { lat: 39.9, lng: 32.9, region: "Middle East", place: "Ankara / Istanbul, Turkey" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f96",
        title: "The Mughal Empire",
        date: "1526\u20131857 CE",
        year: 1526,
        yearEnd: 1857,
        keywords: "Taj Mahal \u00B7 Akbar\u2019s tolerance \u00B7 Hindu-Muslim synthesis",
        description: "Babur, a descendant of both Genghis Khan and Timur, conquered northern India and founded the Mughal Dynasty. Emperor Akbar created a remarkably tolerant multi-religious state. The Mughals built the Taj Mahal and blended Persian, Indian, and Islamic cultures \u2014 but internal decline and British exploitation eventually ended the dynasty during the 1857 revolt.",
        quizDescription: "The Mughals built the Taj Mahal and blended Persian, Indian, and Islamic cultures.",
        location: { lat: 27.2, lng: 78.0, region: "South Asia", place: "Agra / Delhi, India" },
        category: "culture",
        difficulty: 2
    },

    // --- Level 2: Plagues & Pandemics Chapter ---
    {
        id: "f97",
        title: "The Antonine Plague",
        date: "165\u2013180 CE",
        year: 165,
        yearEnd: 180,
        keywords: "Marcus Aurelius \u00B7 Smallpox \u00B7 Roman decline",
        description: "Soldiers returning from Rome\u2019s eastern campaigns brought back a devastating plague \u2014 likely smallpox \u2014 that killed an estimated 5\u201310 million people across the empire. It struck during the reign of the philosopher-emperor Marcus Aurelius, weakened Rome\u2019s military, and is now seen as one of the first dominoes in Rome\u2019s centuries-long decline.",
        quizDescription: "A plague killed 5\u201310 million Romans and began the empire\u2019s long decline.",
        location: { lat: 41.9, lng: 12.5, region: "Europe", place: "Roman Empire (empire-wide)" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "The disease is usually identified as smallpox, but measles has also been proposed. Ancient descriptions are too vague for a definitive diagnosis. Death toll estimates range from 5 to 10 million, but all figures are extrapolations from fragmentary ancient sources.",
        }
    },
    {
        id: "f98",
        title: "Smallpox & the Fall of the Aztec Empire",
        date: "1519\u20131521 CE",
        year: 1519,
        yearEnd: 1521,
        keywords: "Cort\u00E9s \u00B7 Tenochtitl\u00E1n \u00B7 Columbian Exchange",
        description: "When Hern\u00E1n Cort\u00E9s arrived in Mexico with 500 soldiers, smallpox arrived with him. The disease \u2014 to which Indigenous peoples had no immunity \u2014 killed an estimated 5\u20138 million Aztecs, far more than any battle. The great city of Tenochtitl\u00E1n fell not to Spanish swords but to an invisible enemy, setting the pattern for colonial conquest across the Americas.",
        quizDescription: "Smallpox killed millions of Aztecs and destroyed their empire more than Spanish swords.",
        location: { lat: 19.4, lng: -99.1, region: "Central America", place: "Tenochtitl\u00E1n (Mexico City)" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "Death toll estimates vary enormously \u2014 from 5 million to over 20 million across the broader post-contact population collapse. The 5\u20138 million figure here covers the initial 1520 epidemic in Central Mexico. Other diseases (measles, typhus, influenza) also contributed, and scholars debate which was most devastating.",
        }
    },
    {
        id: "f99",
        title: "The Great Plague of London",
        date: "1665\u20131666 CE",
        year: 1665,
        yearEnd: 1666,
        keywords: "Bubonic plague \u00B7 Quarantine \u00B7 Great Fire",
        description: "The last major bubonic plague outbreak in England killed roughly 100,000 Londoners \u2014 a quarter of the city\u2019s population. Bodies piled in mass graves, the rich fled, and crude quarantine measures were enforced with red crosses on doors. The epidemic was already fading when the Great Fire of 1666 struck, though the fire\u2019s destruction of crowded housing may have reduced future outbreaks.",
        quizDescription: "Bubonic plague killed a quarter of London\u2019s population.",
        location: { lat: 51.5, lng: -0.1, region: "Europe", place: "London, England" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f100",
        title: "Edward Jenner & Vaccination",
        date: "1796 CE",
        year: 1796,
        keywords: "Cowpox \u00B7 Smallpox prevention \u00B7 Immunology",
        description: "Country doctor Edward Jenner noticed that milkmaids who caught cowpox never got smallpox. He tested his theory by inoculating a boy with cowpox pus, then exposing him to smallpox \u2014 the boy was immune. This single experiment launched the science of vaccination and would eventually lead to the complete eradication of smallpox, saving more lives than any other medical innovation in history.",
        quizDescription: "Jenner\u2019s cowpox experiment launched vaccination and would eventually eradicate smallpox.",
        location: { lat: 51.7, lng: -2.2, region: "Europe", place: "Berkeley, Gloucestershire, England" },
        category: "science",
        difficulty: 1
    },
    {
        id: "f101",
        title: "Cholera & the Birth of Epidemiology",
        date: "1854 CE",
        year: 1854,
        keywords: "John Snow \u00B7 Broad Street pump \u00B7 Germ theory",
        description: "During a cholera outbreak in London\u2019s Soho, physician John Snow mapped the cases and traced the source to a single contaminated water pump on Broad Street. His detective work \u2014 and the famous removal of the pump handle \u2014 helped end the outbreak and founded the field of epidemiology. His work proved that disease spread through contaminated water, not \u2018bad air,\u2019 revolutionizing public health.",
        quizDescription: "John Snow traced cholera to a water pump and pioneered modern epidemiology.",
        location: { lat: 51.5, lng: -0.14, region: "Europe", place: "Soho, London, England" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f102",
        title: "The Spanish Flu",
        date: "1918\u20131920 CE",
        year: 1918,
        yearEnd: 1920,
        keywords: "H1N1 \u00B7 50 million dead \u00B7 Wartime censorship",
        description: "The deadliest pandemic in modern history infected a third of the world\u2019s population and killed an estimated 50\u2013100 million people \u2014 more than World War I itself. Wartime censorship suppressed news of the virus in combatant nations; neutral Spain reported freely, giving the pandemic its misleading name. It struck the young and healthy hardest, devastating an already war-ravaged generation.",
        quizDescription: "History\u2019s deadliest modern pandemic killed 50\u2013100 million people worldwide.",
        location: { lat: 39.0, lng: -95.0, region: "North America", place: "Global (named after Spain)" },
        category: "science",
        difficulty: 1,
        controversyNotes: {
            location: "Despite its name, the Spanish Flu almost certainly did not originate in Spain. Leading theories place the origin at Camp Funston, Kansas (US), or at military camps in France or Britain. Spain was simply the first country to report it openly because it was neutral in WWI and had no wartime censorship.",
        }
    },
    {
        id: "f103",
        title: "Alexander Fleming & Penicillin",
        date: "1928 CE",
        year: 1928,
        keywords: "Antibiotics \u00B7 Accidental discovery \u00B7 Bacterial infection",
        description: "Alexander Fleming returned from holiday to find mold growing on a bacterial culture \u2014 and the bacteria around the mold had died. This accidental discovery of penicillin launched the age of antibiotics, turning previously fatal infections into minor inconveniences. Mass production during WWII saved millions of soldiers\u2019 lives and transformed medicine forever.",
        quizDescription: "Fleming\u2019s accidental mold discovery launched antibiotics and transformed medicine.",
        location: { lat: 51.5, lng: -0.17, region: "Europe", place: "St Mary\u2019s Hospital, London" },
        category: "science",
        difficulty: 1
    },
    {
        id: "f104",
        title: "The Eradication of Smallpox",
        date: "1967\u20131980 CE",
        year: 1967,
        yearEnd: 1980,
        keywords: "WHO campaign \u00B7 Ring vaccination \u00B7 Disease elimination",
        description: "The World Health Organization launched an intensified campaign to eliminate smallpox \u2014 a disease that had killed hundreds of millions throughout history. Using \u2018ring vaccination\u2019 (targeting contacts of infected people), teams tracked the virus to its last hiding places. In 1980, the WHO declared smallpox officially eradicated \u2014 the first and still only human disease to be completely eliminated.",
        quizDescription: "A WHO campaign made smallpox the first and only human disease ever eradicated.",
        location: { lat: 46.2, lng: 6.1, region: "Europe", place: "Global (WHO, Geneva)" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f105",
        title: "The HIV/AIDS Pandemic",
        date: "1981\u2013present CE",
        year: 1981,
        keywords: "Stigma \u00B7 Antiretroviral therapy \u00B7 40 million dead",
        description: "First identified in 1981, HIV/AIDS became the defining plague of a generation, killing over 40 million people \u2014 disproportionately in sub-Saharan Africa. Early responses were crippled by stigma and political neglect. The development of antiretroviral therapy (1996) turned a death sentence into a manageable condition, but the pandemic exposed how inequality determines who lives and who dies.",
        quizDescription: "HIV/AIDS killed 40 million; stigma delayed the response for years.",
        location: { lat: -1.3, lng: 36.8, region: "East Africa", place: "Global (epicenter: sub-Saharan Africa)" },
        category: "science",
        difficulty: 2
    },
    {
        id: "f106",
        title: "COVID-19 & mRNA Vaccines",
        date: "2019\u20132023 CE",
        year: 2019,
        yearEnd: 2023,
        keywords: "SARS-CoV-2 \u00B7 Lockdowns \u00B7 Vaccine revolution",
        description: "A novel coronavirus emerged in Wuhan, China, and spread worldwide within weeks, killing over 7 million people and locking billions indoors. The crisis also produced a scientific miracle: mRNA vaccines were developed, tested, and deployed in under a year \u2014 a process that normally takes a decade. The pandemic reshaped work, education, and trust in institutions, and proved that ancient plagues still threaten modern civilization.",
        quizDescription: "COVID-19 killed millions; mRNA vaccines were developed in record time.",
        location: { lat: 30.6, lng: 114.3, region: "East Asia", place: "Wuhan, China (spreading globally)" },
        category: "science",
        difficulty: 1,
        controversyNotes: {
            what: "The official WHO confirmed death toll is over 7 million, but excess mortality studies (by WHO, The Economist, and The Lancet) estimate 15\u201325 million actual deaths \u2014 more than double the confirmed count. Many deaths went unrecorded, especially in low-income countries with limited testing.",
        }
    },

    // --- Level 2: Kingdoms of Africa Chapter ---
    {
        id: "f107",
        title: "Kingdom of Kush & Mero\u00EB",
        date: "c. 1070 BCE \u2013 350 CE",
        year: -1070,
        yearEnd: 350,
        keywords: "Nubia \u00B7 Iron smelting \u00B7 Pyramids of Mero\u00EB",
        description: "South of Egypt, the Kingdom of Kush built a civilization that rivaled its northern neighbor. Kush conquered Egypt itself in the 8th century BCE, ruling as the 25th Dynasty. Its later capital at Mero\u00EB became an iron-smelting powerhouse \u2014 one of the earliest in Africa \u2014 and built more pyramids than Egypt ever did. Kush proved that Africa\u2019s story did not begin and end with the pharaohs.",
        quizDescription: "Kush conquered Egypt and built more pyramids than the pharaohs.",
        location: { lat: 16.9, lng: 33.7, region: "East Africa", place: "Mero\u00EB, Sudan" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f108",
        title: "Aksumite Empire & Ethiopian Christianity",
        date: "c. 100\u2013940 CE",
        year: 100,
        yearEnd: 940,
        keywords: "Aksum \u00B7 Obelisks \u00B7 Ezana \u00B7 Ark of the Covenant",
        description: "The Aksumite Empire in modern-day Ethiopia and Eritrea was one of the ancient world\u2019s great trading powers, minting its own coins and trading with Rome, India, and Arabia. In the 4th century, King Ezana converted to Christianity, making Aksum one of the first states to adopt the faith \u2014 decades before Rome made it the state religion. The towering stone obelisks of Aksum still stand as monuments to African engineering.",
        quizDescription: "Aksum adopted Christianity before Rome and traded across three continents.",
        location: { lat: 14.1, lng: 38.7, region: "East Africa", place: "Aksum, Ethiopia" },
        category: "culture",
        difficulty: 2
    },
    {
        id: "f109",
        title: "Ghana Empire & Trans-Saharan Gold Trade",
        date: "c. 300\u20131200 CE",
        year: 300,
        yearEnd: 1200,
        keywords: "Wagadu \u00B7 Gold \u00B7 Salt trade \u00B7 Koumbi Saleh",
        description: "The Ghana Empire (also called Wagadu) controlled the trans-Saharan gold-salt trade, taxing every ounce that crossed its territory. Arab geographers called its ruler \u2018the richest king on the face of the earth.\u2019 Its probable capital at Koumbi Saleh was a cosmopolitan city where Muslim merchants and traditional African rulers coexisted. Its wealth and trade networks laid the foundation for the even greater empires that followed.",
        quizDescription: "Ghana controlled the gold-salt trade and was called the richest kingdom on earth.",
        location: { lat: 15.8, lng: -7.9, region: "West Africa", place: "Koumbi Saleh, Mauritania" },
        category: "politics",
        difficulty: 2
    },
    {
        id: "f110",
        title: "Mali Empire & Mansa Musa",
        date: "c. 1235\u20131600 CE",
        year: 1235,
        yearEnd: 1600,
        keywords: "Mansa Musa \u00B7 Timbuktu \u00B7 Hajj \u00B7 Gold",
        description: "The Mali Empire absorbed Ghana\u2019s territory and became the largest empire in West African history. Its most famous ruler, Mansa Musa, made a pilgrimage to Mecca in 1324, distributing so much gold along the way that he crashed the Egyptian economy for a decade. He built the great mosques of Timbuktu and Djenn\u00E9, turning Mali into a center of Islamic learning. By some measures, Mansa Musa was the richest person who ever lived.",
        quizDescription: "Mansa Musa\u2019s gold crashed Egypt\u2019s economy; he may be history\u2019s richest person.",
        location: { lat: 16.8, lng: -3.0, region: "West Africa", place: "Niani / Timbuktu, Mali" },
        category: "politics",
        difficulty: 2,
        controversyNotes: {
            what: "The claim that Mansa Musa was \u2018the richest person who ever lived\u2019 is popular but impossible to verify \u2014 pre-modern wealth cannot be meaningfully compared across eras and economies. The Egyptian gold-price crash is well attested by Arab chroniclers, but \u2018a decade\u2019 is a rough estimate. His wealth was undeniably extraordinary by any measure.",
        }
    },
    {
        id: "f111",
        title: "Great Zimbabwe",
        date: "c. 1100\u20131450 CE",
        year: 1100,
        yearEnd: 1450,
        keywords: "Stone walls \u00B7 Shona \u00B7 Gold trade \u00B7 Southern Africa",
        description: "In southern Africa, the Shona people built Great Zimbabwe \u2014 a massive stone city whose walls rise 11 meters high, constructed without mortar. At its peak, it housed 18,000 people and controlled the gold trade between the African interior and the Swahili coast. European colonizers refused to believe Africans built it, inventing myths about Phoenician or biblical origins. The ruins stand as proof of indigenous African architectural brilliance.",
        quizDescription: "Great Zimbabwe\u2019s mortar-free stone walls housed 18,000 people and controlled the gold trade.",
        location: { lat: -20.3, lng: 30.9, region: "Southern Africa", place: "Great Zimbabwe, Zimbabwe" },
        category: "culture",
        difficulty: 3
    },
    {
        id: "f112",
        title: "Songhai Empire & Timbuktu\u2019s Golden Age",
        date: "c. 1464\u20131591 CE",
        year: 1464,
        yearEnd: 1591,
        keywords: "Sunni Ali \u00B7 Askia Muhammad \u00B7 University of Sankore",
        description: "The Songhai Empire conquered Mali and became the largest empire in West African history, stretching across modern-day Mali, Niger, Nigeria, and Senegal. Under Askia Muhammad, Timbuktu became one of the world\u2019s great intellectual centers \u2014 the University of Sankore housed 25,000 students and hundreds of thousands of manuscripts. The empire fell in 1591 when Moroccan invaders with gunpowder defeated Songhai\u2019s cavalry.",
        quizDescription: "Songhai made Timbuktu a world-class university city with 25,000 students.",
        location: { lat: 16.8, lng: 0.0, region: "West Africa", place: "Gao / Timbuktu, Mali" },
        category: "culture",
        difficulty: 2,
        controversyNotes: {
            what: "The figure of 25,000 students at Sankore comes from 16th-century accounts and is difficult to verify. Sankore was also not a \u2018university\u2019 in the modern sense \u2014 it was a network of mosque-based schools with independent scholars. That Timbuktu was a major center of Islamic learning, however, is well established.",
        }
    },
    {
        id: "f113",
        title: "Kingdom of Benin & Its Bronzes",
        date: "c. 1440\u20131897 CE",
        year: 1440,
        yearEnd: 1897,
        keywords: "Benin Bronzes \u00B7 Oba \u00B7 Edo people \u00B7 Lost-wax casting",
        description: "Founded centuries earlier, the Kingdom of Benin (in modern Nigeria) reached its peak under Oba Ewuare the Great and produced some of history\u2019s most sophisticated metal art using lost-wax casting techniques that astonished Europeans. The Benin Bronzes \u2014 thousands of plaques, sculptures, and heads \u2014 recorded royal history and ritual life with stunning realism. When the British sacked Benin City in 1897, they looted these treasures, scattering them across Western museums. Today, the Bronzes are at the center of the world\u2019s largest repatriation debate.",
        quizDescription: "Benin\u2019s lost-wax bronzes astonished Europe; their return is now a global debate.",
        location: { lat: 6.3, lng: 5.6, region: "West Africa", place: "Benin City, Nigeria" },
        category: "culture",
        difficulty: 2
    },
    {
        id: "f114",
        title: "Zulu Kingdom & Shaka",
        date: "c. 1816\u20131828 CE",
        year: 1816,
        yearEnd: 1828,
        keywords: "Shaka Zulu \u00B7 Mfecane \u00B7 Military revolution",
        description: "Shaka kaSenzangakhona transformed a small Zulu clan into the most powerful military force in southern Africa. He revolutionized warfare with the short stabbing spear (iklwa), the cowhide shield, and disciplined regiment tactics. The resulting upheaval \u2014 the Mfecane \u2014 reshaped the entire region, though historians debate how much was driven by Zulu expansion versus broader pressures like drought and trade disruption. Shaka\u2019s military innovations made the Zulu a force that would later fight the British Empire to a standstill at Isandlwana.",
        quizDescription: "Shaka\u2019s military revolution made the Zulu the dominant force in southern Africa.",
        location: { lat: -28.5, lng: 31.0, region: "Southern Africa", place: "KwaZulu-Natal, South Africa" },
        category: "war",
        difficulty: 2
    },
    {
        id: "f115",
        title: "Battle of Adwa: Ethiopia Defeats Colonialism",
        date: "1896 CE",
        year: 1896,
        keywords: "Menelik II \u00B7 Italian invasion \u00B7 African sovereignty",
        description: "When Italy tried to colonize Ethiopia, Emperor Menelik II mobilized 100,000 troops and decisively defeated the Italian army at the Battle of Adwa. It was the most significant African victory over a European colonial power and ensured Ethiopia remained the only African nation (besides Liberia) never colonized. Adwa became a symbol of Black resistance worldwide, inspiring pan-African movements and proving that European military superiority was not inevitable.",
        quizDescription: "Ethiopia defeated Italy at Adwa, remaining the only uncolonized African nation.",
        location: { lat: 14.2, lng: 38.9, region: "East Africa", place: "Adwa, Ethiopia" },
        category: "war",
        difficulty: 2,
        controversyNotes: {
            what: "The claim that Ethiopia was \u2018never colonized\u2019 is complicated by Italy\u2019s occupation from 1936 to 1941 under Mussolini. Most scholars distinguish this brief military occupation from formal colonization (Ethiopia retained its institutions and was liberated within five years), but the point is debated.",
        }
    },
    {
        id: "f116",
        title: "African Independence Wave",
        date: "1957\u20131968 CE",
        year: 1957,
        yearEnd: 1968,
        keywords: "Kwame Nkrumah \u00B7 Decolonization \u00B7 Pan-Africanism",
        description: "In 1957, Ghana became the first sub-Saharan African nation to gain independence, led by Kwame Nkrumah. His success triggered a cascade: by 1968, most of Africa was free. The year 1960 alone \u2014 \u2018The Year of Africa\u2019 \u2014 saw 17 nations gain independence. These new nations faced enormous challenges: artificial colonial borders, Cold War interference, and economic exploitation. But the achievement was historic \u2014 an entire continent reclaimed its sovereignty within a single generation.",
        quizDescription: "Ghana\u2019s 1957 independence triggered a wave that freed most of Africa by 1968.",
        location: { lat: 5.6, lng: -0.2, region: "West Africa", place: "Accra, Ghana" },
        category: "politics",
        difficulty: 2
    },

    // --- Level 2: Art That Changed the World Chapter ---
    {
        id: "f117",
        title: "Homer & the Birth of Epic Poetry",
        date: "c. 750 BCE",
        year: -750,
        keywords: "Iliad \u00B7 Odyssey \u00B7 Oral tradition \u00B7 Greek literature",
        description: "A blind poet \u2014 or perhaps a tradition of poets \u2014 composed the Iliad and the Odyssey, the founding works of Western literature. These epics gave the Greeks their shared identity, their moral vocabulary, and their understanding of heroism, fate, and the gods. Every subsequent Western writer, from Virgil to James Joyce, has written in Homer\u2019s shadow. The Odyssey crystallized the idea of the journey as a metaphor for life itself.",
        quizDescription: "Homer\u2019s Iliad and Odyssey became the foundation of Western literature.",
        location: { lat: 38.4, lng: 27.1, region: "Europe", place: "Ionia, Greece" },
        category: "culture",
        difficulty: 2
    },
    {
        id: "f118",
        title: "The Islamic Golden Age of Art & Science",
        date: "c. 786\u20131258 CE",
        year: 786,
        yearEnd: 1258,
        keywords: "House of Wisdom \u00B7 Algebra \u00B7 Arabesque \u00B7 Calligraphy",
        description: "Under the Abbasid caliphs, Baghdad\u2019s House of Wisdom became the intellectual center of the world. Scholars translated Greek, Persian, and Indian texts, preserving knowledge that Europe had lost. Al-Khwarizmi pioneered algebra, Ibn Sina wrote the medical canon used for 600 years, and Islamic artists developed the arabesque \u2014 transforming geometric patterns into a spiritual art form. Without this golden age, the European Renaissance would have had nothing to rediscover.",
        quizDescription: "Baghdad\u2019s scholars preserved ancient knowledge and pioneered algebra.",
        location: { lat: 33.3, lng: 44.4, region: "Middle East", place: "Baghdad, Iraq" },
        category: "culture",
        difficulty: 2
    },
    {
        id: "f119",
        title: "Renaissance Masters: Leonardo & Michelangelo",
        date: "c. 1480\u20131520 CE",
        year: 1480,
        yearEnd: 1520,
        keywords: "Mona Lisa \u00B7 Sistine Chapel \u00B7 Perspective \u00B7 Humanism",
        description: "In Florence and Rome, Leonardo da Vinci and Michelangelo Buonarroti redefined what art could be. Leonardo\u2019s Mona Lisa captured the inner life of a human being for the first time; Michelangelo\u2019s Sistine Chapel ceiling turned a room into a universe. They mastered anatomy and perspective, and the idea that the artist was not a craftsman but a genius. Their rivalry pushed both to heights that still define the word \u2018masterpiece.\u2019",
        quizDescription: "Leonardo and Michelangelo redefined art with the Mona Lisa and the Sistine Chapel.",
        location: { lat: 43.8, lng: 11.3, region: "Europe", place: "Florence & Rome, Italy" },
        category: "culture",
        difficulty: 1
    },
    {
        id: "f120",
        title: "Shakespeare & the Birth of Modern Theater",
        date: "c. 1590\u20131613 CE",
        year: 1590,
        yearEnd: 1613,
        keywords: "Globe Theatre \u00B7 Hamlet \u00B7 Sonnets \u00B7 English language",
        description: "William Shakespeare wrote 37 plays that explored the full range of human experience \u2014 jealousy, ambition, love, madness, and mortality \u2014 with a psychological depth no writer had achieved before. He coined or popularized over 1,700 English words still used today and created characters so vivid they feel like real people four centuries later. The Globe Theatre democratized art: groundlings and lords watched the same plays, side by side.",
        quizDescription: "Shakespeare coined or popularized 1,700 English words and explored the full range of human psychology.",
        location: { lat: 51.5, lng: -0.1, region: "Europe", place: "London, England" },
        category: "culture",
        difficulty: 1
    },
    {
        id: "f121",
        title: "Beethoven & the Romantic Revolution",
        date: "c. 1800\u20131827 CE",
        year: 1800,
        yearEnd: 1827,
        keywords: "Symphony No. 9 \u00B7 Deafness \u00B7 Romanticism \u00B7 Individual expression",
        description: "Ludwig van Beethoven shattered the elegant rules of classical music and replaced them with raw emotional power. His Third Symphony (\u2018Eroica\u2019) was originally dedicated to Napoleon; when Napoleon crowned himself emperor, Beethoven furiously scratched out the dedication. Going progressively deaf, he composed his greatest works \u2014 including the Ninth Symphony\u2019s \u2018Ode to Joy\u2019 \u2014 from memory and inner hearing alone. He proved that art could be an act of personal revolution.",
        quizDescription: "Beethoven composed his greatest symphonies while going deaf.",
        location: { lat: 48.2, lng: 16.4, region: "Europe", place: "Vienna, Austria" },
        category: "culture",
        difficulty: 2
    },
    {
        id: "f122",
        title: "Impressionism & the Modern Eye",
        date: "1874 CE",
        year: 1874,
        keywords: "Monet \u00B7 Light \u00B7 Salon des Refus\u00E9s \u00B7 Plein air",
        description: "In 1874, Claude Monet exhibited \u2018Impression, Sunrise\u2019 \u2014 and critics used the title as an insult. The Impressionists (Monet, Renoir, Degas, Cassatt) abandoned the studio for outdoor painting, capturing how light actually looked rather than how tradition said it should look. They were rejected by the official Salon, so they created their own exhibitions \u2014 inventing the idea of the independent art show. Impressionism taught the world that seeing itself is a creative act.",
        quizDescription: "Monet and the Impressionists painted light as it really looked, not as tradition demanded.",
        location: { lat: 48.9, lng: 2.3, region: "Europe", place: "Paris, France" },
        category: "culture",
        difficulty: 2
    },
    {
        id: "f123",
        title: "Jazz & the Harlem Renaissance",
        date: "c. 1920\u20131935 CE",
        year: 1920,
        yearEnd: 1935,
        keywords: "Louis Armstrong \u00B7 Langston Hughes \u00B7 Duke Ellington \u00B7 Cultural pride",
        description: "In the 1920s, Harlem became the capital of Black American culture. Jazz \u2014 born from blues, spirituals, and ragtime \u2014 became America\u2019s greatest cultural export, with Louis Armstrong and Duke Ellington redefining what music could be. Writers like Langston Hughes and Zora Neale Hurston celebrated Black identity and challenged racism through art. The Harlem Renaissance proved that marginalized communities don\u2019t just survive oppression \u2014 they create civilizations within it.",
        quizDescription: "Jazz and Black literature transformed American culture from Harlem.",
        location: { lat: 40.8, lng: -73.9, region: "North America", place: "New York & New Orleans, USA" },
        category: "culture",
        difficulty: 2
    },
    {
        id: "f124",
        title: "Cinema\u2019s Golden Age",
        date: "c. 1927\u20131960 CE",
        year: 1927,
        yearEnd: 1960,
        keywords: "Talkies \u00B7 Hollywood \u00B7 Chaplin \u00B7 Hitchcock \u00B7 Mass entertainment",
        description: "The arrival of synchronized sound in 1927 (\u2018The Jazz Singer\u2019) transformed cinema into the dominant art form of the 20th century. Hollywood\u2019s studio system produced Chaplin\u2019s social commentary, Disney\u2019s animation, Hitchcock\u2019s suspense, and Casablanca\u2019s romance. Cinema shaped how billions of people understood love, war, heroism, and villainy. For the first time in history, a single story could reach audiences across the entire planet.",
        quizDescription: "Sound films made cinema the 20th century\u2019s dominant art form.",
        location: { lat: 34.1, lng: -118.3, region: "North America", place: "Hollywood, USA" },
        category: "culture",
        difficulty: 2
    },
    {
        id: "f125",
        title: "Picasso & Modern Art",
        date: "c. 1907\u20131937 CE",
        year: 1907,
        yearEnd: 1937,
        keywords: "Cubism \u00B7 Guernica \u00B7 Abstraction \u00B7 African art influence",
        description: "Pablo Picasso\u2019s \u2018Les Demoiselles d\u2019Avignon\u2019 (1907) shattered 500 years of Renaissance perspective, partly inspired by African masks. With Georges Braque, he invented Cubism \u2014 showing multiple viewpoints simultaneously. His masterpiece Guernica (1937) turned the bombing of a Spanish town into the most powerful anti-war painting ever made. Picasso proved that art didn\u2019t need to look like reality to tell the truth about it.",
        quizDescription: "Picasso invented Cubism and painted Guernica, history\u2019s greatest anti-war artwork.",
        location: { lat: 48.9, lng: 2.3, region: "Europe", place: "Paris, France" },
        category: "culture",
        difficulty: 2
    },
    {
        id: "f126",
        title: "The Digital Creative Revolution",
        date: "2005\u2013present",
        year: 2005,
        keywords: "YouTube \u00B7 Smartphones \u00B7 Democratization \u00B7 Streaming",
        description: "The launch of YouTube (2005), the iPhone (2007), and streaming platforms transformed every human being into a potential creator. For the first time in history, you didn\u2019t need a publisher, gallery, studio, or record label to reach millions. TikTok dances, indie games, self-published novels, and bedroom-produced albums proved that creativity no longer requires gatekeepers. The tools of art became as universal as the urge to create.",
        quizDescription: "YouTube, smartphones, and streaming turned everyone into a potential creator.",
        location: { lat: 37.4, lng: -122.1, region: "North America", place: "Global" },
        category: "culture",
        difficulty: 1
    },

    // ─── Level 2: Science That Changed Everything ─────────────────────
    {
        id: "f127",
        title: "Hippocrates & Rational Medicine",
        date: "c. 460\u2013370 BCE",
        year: -460,
        yearEnd: -370,
        keywords: "Natural causes \u00B7 Hippocratic Oath \u00B7 Clinical observation \u00B7 Ethics",
        description: "Hippocrates of Kos is traditionally called the \u2018Father of Medicine\u2019 for insisting that diseases have natural causes, not divine punishments. The Hippocratic school rejected supernatural explanations and instead observed patients, recorded symptoms, and sought patterns. The Hippocratic Oath \u2014 though likely composed by later followers \u2014 established medicine as an ethical profession. By arguing that sickness comes from diet, environment, and lifestyle rather than angry gods, Hippocrates laid the foundation for evidence-based medicine.",
        quizDescription: "Hippocrates argued that diseases have natural causes, not divine origins.",
        location: { lat: 36.9, lng: 27.0, region: "Europe", place: "Kos, Greece" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "Modern historians doubt that any single person wrote the 60+ texts in the \u2018Hippocratic Corpus\u2019 \u2014 they span different writing styles and centuries. The Oath itself may date from the 4th century BCE or later. Hippocrates was likely a real physician, but much of what we attribute to him was the work of an entire school.",
        }
    },
    {
        id: "f128",
        title: "Euclid\u2019s Elements",
        date: "c. 300 BCE",
        year: -300,
        keywords: "Geometry \u00B7 Axioms \u00B7 Proofs \u00B7 Alexandria \u00B7 Mathematical reasoning",
        description: "Around 300 BCE, Euclid compiled and systematized Greek mathematical knowledge into the \u2018Elements\u2019 \u2014 13 books of definitions, postulates, and proofs covering plane geometry, number theory, and solid geometry. It became the second most printed book in history after the Bible, and remained the standard mathematics textbook for over two thousand years. Abraham Lincoln taught himself logic by studying the Elements. Euclid\u2019s method \u2014 start with self-evident axioms, then prove everything step by step \u2014 became the model for all scientific reasoning.",
        quizDescription: "Euclid compiled Greek mathematics into a textbook used for over 2,000 years.",
        location: { lat: 31.2, lng: 29.9, region: "North Africa", place: "Alexandria, Egypt" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "Almost nothing is known about Euclid\u2019s life. Some ancient sources suggest \u2018Euclid\u2019 may have been a team of scholars rather than one person. The Elements compiled and organized earlier Greek mathematicians\u2019 work (Eudoxus, Theaetetus, Pythagoras) rather than originating all the proofs.",
        }
    },
    {
        id: "f129",
        title: "Archimedes & Applied Mathematics",
        date: "c. 287\u2013212 BCE",
        year: -287,
        yearEnd: -212,
        keywords: "Buoyancy \u00B7 Pi \u00B7 Eureka \u00B7 War machines \u00B7 Lever",
        description: "Archimedes of Syracuse was the ancient world\u2019s greatest mathematician and engineer. He discovered the principle of buoyancy (reputedly shouting \u2018Eureka!\u2019 in his bath), calculated pi with remarkable accuracy, and famously declared \u2018Give me a lever long enough and I shall move the world.\u2019 He designed war machines \u2014 giant claws and focused mirrors \u2014 that held off Roman armies for two years. He proved that a sphere\u2019s volume is exactly two-thirds of its circumscribed cylinder, and loved this result so much he asked for the diagram on his tombstone. Killed by a Roman soldier during the siege of Syracuse, Archimedes showed that pure mathematics has real-world power.",
        quizDescription: "Archimedes discovered buoyancy, calculated pi, and designed war machines using mathematics.",
        location: { lat: 37.1, lng: 15.3, region: "Europe", place: "Syracuse, Sicily" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "The \u2018Eureka\u2019 bathtub story comes from Vitruvius, writing two centuries later, and is likely apocryphal. The \u2018death ray\u2019 mirrors are almost certainly legend \u2014 modern experiments (including a MythBusters test) have failed to replicate them. Archimedes\u2019 mathematical achievements, however, are well attested.",
        }
    },
    {
        id: "f130",
        title: "Galileo & the Telescope",
        date: "1609\u20131633 CE",
        year: 1609,
        yearEnd: 1633,
        keywords: "Telescope \u00B7 Moons of Jupiter \u00B7 Heliocentrism \u00B7 Inquisition \u00B7 Experiment",
        description: "In 1609, Galileo Galilei turned a newly invented telescope to the sky and saw what no human had seen before: mountains on the Moon, four moons orbiting Jupiter, and the phases of Venus. Each observation contradicted the Church-backed Ptolemaic model of a perfect, Earth-centered cosmos. Galileo\u2019s public advocacy for the Copernican heliocentric model led to his trial by the Roman Inquisition in 1633, where he was forced to recant and spent his remaining years under house arrest. Legend says he muttered \u2018And yet it moves\u2019 \u2014 whether or not he did, science had permanently escaped the control of authority.",
        quizDescription: "Galileo\u2019s telescope observations proved the Earth-centered model of the cosmos was wrong.",
        location: { lat: 43.8, lng: 11.3, region: "Europe", place: "Florence & Rome, Italy" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "Galileo did not invent the telescope \u2014 Hans Lippershey patented the design in 1608. The \u2018Eppur si muove\u2019 (\u2018And yet it moves\u2019) quote is likely a later invention; no contemporary source records it. His conflict with the Church was also partly personal \u2014 he satirized Pope Urban VIII, a former supporter, in his Dialogue.",
        }
    },
    {
        id: "f131",
        title: "Newton\u2019s Principia",
        date: "1687 CE",
        year: 1687,
        keywords: "Gravity \u00B7 Laws of motion \u00B7 Calculus \u00B7 Principia \u00B7 Universal laws",
        description: "In 1687, Isaac Newton published the \u2018Principia Mathematica\u2019 \u2014 three laws of motion and a universal law of gravitation that explained everything from falling apples to orbiting planets in a single mathematical framework. He co-invented calculus to do the calculations, simultaneously with Leibniz \u2014 sparking one of history\u2019s bitterest priority disputes. Newton unified terrestrial and celestial physics for the first time, showing that the same laws govern both the heavens and the Earth. For over two centuries, Newtonian mechanics seemed to describe reality completely \u2014 until Einstein came along.",
        quizDescription: "Newton\u2019s laws of motion and universal gravitation explained the physical universe.",
        location: { lat: 52.2, lng: 0.1, region: "Europe", place: "Cambridge, England" },
        category: "science",
        difficulty: 3,
        controversyNotes: {
            date: "The Newton\u2013Leibniz calculus priority dispute was one of the most acrimonious in science history. Both developed calculus independently in the 1660s\u20131670s, but Newton used his position as Royal Society president to stack the investigative committee against Leibniz. Modern historians credit both with independent invention.",
        }
    },
    {
        id: "f132",
        title: "Lavoisier & the Chemical Revolution",
        date: "1770s\u20131794 CE",
        year: 1775,
        yearEnd: 1794,
        keywords: "Oxygen \u00B7 Conservation of mass \u00B7 Phlogiston \u00B7 Chemical nomenclature",
        description: "Antoine Lavoisier demolished the ancient theory of phlogiston and replaced it with modern chemistry. By carefully weighing substances before and after chemical reactions, he proved that combustion requires oxygen, not a mysterious \u2018fire element.\u2019 He named oxygen and hydrogen, wrote the first modern chemistry textbook, and established the law of conservation of mass. Tragically, Lavoisier was guillotined during the French Revolution in 1794 \u2014 executed primarily for his role as a tax collector. In a single lifetime, he transformed chemistry into a modern, quantitative science.",
        quizDescription: "Lavoisier disproved the phlogiston theory and founded modern chemistry.",
        location: { lat: 48.9, lng: 2.3, region: "Europe", place: "Paris, France" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "The famous quote \u2018the Republic has no need for scientists\u2019 is likely apocryphal \u2014 no contemporary source records it. Lavoisier was executed for his role as a \u2018fermier g\u00E9n\u00E9ral\u2019 (tax farmer), not for his science. Joseph Priestley independently discovered oxygen around the same time, and some historians argue Lavoisier\u2019s contribution was more in systematizing chemistry than in discovering oxygen itself.",
        }
    },
    {
        id: "f133",
        title: "Darwin & the Origin of Species",
        date: "1859 CE",
        year: 1859,
        keywords: "Natural selection \u00B7 Evolution \u00B7 HMS Beagle \u00B7 Adaptation \u00B7 Common descent",
        description: "In 1859, Charles Darwin published \u2018On the Origin of Species,\u2019 arguing that all life evolves through natural selection \u2014 organisms with traits better suited to their environment survive and reproduce, gradually changing species over millions of years. Darwin had begun developing the idea two decades earlier, inspired by observations from his voyage on HMS Beagle, but delayed publication for years, fearing the controversy. He was right to worry: the idea that humans share ancestry with apes outraged Victorian society. Yet natural selection elegantly explained the diversity of life without divine design, and remains the foundation of modern biology.",
        quizDescription: "Darwin proposed that all life evolves through natural selection.",
        location: { lat: 51.4, lng: 0.0, region: "Europe", place: "London, England" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "Alfred Russel Wallace independently conceived natural selection and sent Darwin his paper in 1858, prompting the joint presentation at the Linnean Society. Wallace received far less credit despite developing the same theory. The scientific debate was largely settled by the 1870s, though religious opposition continues in some communities today.",
        }
    },
    {
        id: "f134",
        title: "Marie Curie & Radioactivity",
        date: "1898\u20131911 CE",
        year: 1898,
        yearEnd: 1911,
        keywords: "Radioactivity \u00B7 Polonium \u00B7 Radium \u00B7 Nobel Prize \u00B7 Radiation",
        description: "Marie Curie discovered two new elements \u2014 polonium and radium \u2014 by painstakingly processing tonnes of uranium ore in a leaky shed. She coined the term \u2018radioactivity\u2019 and became the first woman to win a Nobel Prize (1903, Physics), then the first person ever to win Nobel Prizes in two different sciences (1911, Chemistry). Despite revolutionary contributions, she faced persistent sexism: the French Academy of Sciences refused her membership, and tabloids attacked her personal life. She died in 1934 from aplastic anemia caused by years of radiation exposure \u2014 her notebooks remain too radioactive to handle without protection.",
        quizDescription: "Marie Curie discovered polonium and radium, winning two Nobel Prizes.",
        location: { lat: 48.9, lng: 2.3, region: "Europe", place: "Paris, France" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "Pierre Curie shared the 1903 Nobel, and the committee initially planned to exclude Marie entirely \u2014 only Pierre\u2019s insistence got her added. Henri Becquerel discovered radioactivity first (1896); the Curies extended his work. Some historians debate whether key conceptual breakthroughs came from Marie or Pierre, though her solo second Nobel settled the question of her independent brilliance.",
        }
    },
    {
        id: "f135",
        title: "Einstein & Relativity",
        date: "1905\u20131915 CE",
        year: 1905,
        yearEnd: 1915,
        keywords: "E=mc\u00B2 \u00B7 Spacetime \u00B7 General relativity \u00B7 Special relativity \u00B7 Gravity",
        description: "In 1905, a 26-year-old patent clerk named Albert Einstein published four papers that rewrote physics. Special relativity showed that time and space are not absolute but depend on the observer\u2019s motion, and that mass and energy are interchangeable (E=mc\u00B2). Ten years later, general relativity revealed that gravity is not a force but the curvature of spacetime caused by mass. These ideas predicted black holes, gravitational waves, and the expansion of the universe \u2014 all confirmed decades later. Einstein did not just correct Newton \u2014 he showed that reality itself is stranger than anyone had imagined.",
        quizDescription: "Einstein\u2019s relativity revealed that time, space, and gravity are not what they seem.",
        location: { lat: 46.9, lng: 7.4, region: "Europe", place: "Bern & Berlin" },
        category: "science",
        difficulty: 3,
        controversyNotes: {
            what: "Einstein\u2019s first wife, Mileva Mari\u0107, was a physicist, and some historians argue she contributed to the 1905 papers. The evidence is inconclusive \u2014 she is listed on none of the publications and Einstein\u2019s correspondence is ambiguous. Henri Poincar\u00E9 and Hendrik Lorentz independently developed ideas close to special relativity around the same time.",
        }
    },
    {
        id: "f136",
        title: "DNA & the Secret of Life",
        date: "1953 CE",
        year: 1953,
        keywords: "Double helix \u00B7 Rosalind Franklin \u00B7 Genetics \u00B7 Heredity \u00B7 Molecular biology",
        description: "In 1953, James Watson and Francis Crick announced the double helix structure of DNA \u2014 the molecule that carries the genetic instructions for all known life. Their discovery relied critically on X-ray crystallography images taken by Rosalind Franklin, whose contribution was long underrecognized. The double helix revealed how heredity works: DNA copies itself by unzipping and rebuilding each strand. This single insight launched modern genetics and made possible everything from forensic science and genome sequencing to CRISPR gene editing.",
        quizDescription: "Watson and Crick discovered DNA\u2019s double helix, using Rosalind Franklin\u2019s X-ray data.",
        location: { lat: 52.2, lng: 0.1, region: "Europe", place: "Cambridge, England" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "Rosalind Franklin\u2019s crucial X-ray photograph (\u2018Photo 51\u2019) was shown to Watson without her knowledge or consent by her colleague Maurice Wilkins. Franklin died of ovarian cancer in 1958, possibly caused by radiation exposure, and was not included in the 1962 Nobel Prize (which cannot be awarded posthumously). The extent of her intellectual contribution beyond the photograph remains actively debated.",
        }
    },
    {
        id: "f137",
        title: "The Higgs Boson",
        date: "July 4, 2012",
        year: 2012,
        keywords: "CERN \u00B7 Large Hadron Collider \u00B7 Particle physics \u00B7 Standard Model \u00B7 Mass",
        description: "On July 4, 2012, scientists at CERN announced the discovery of the Higgs boson \u2014 a particle predicted 48 years earlier by Peter Higgs and others. The Higgs field gives other fundamental particles their mass; without it, electrons would be massless, atoms could not form, and neither could you. Finding the Higgs required the largest machine ever built (a 27-kilometer underground ring), billions of dollars, and thousands of scientists from over 100 countries. Peter Higgs, 83 years old at the announcement, wept at the press conference. It was the greatest confirmation of theoretical physics since relativity.",
        quizDescription: "CERN discovered the Higgs boson, the particle that explains why matter has mass.",
        location: { lat: 46.2, lng: 6.1, region: "Europe", place: "CERN, Geneva, Switzerland" },
        category: "science",
        difficulty: 3,
        controversyNotes: {
            what: "Six physicists independently proposed the Higgs mechanism in 1964: Peter Higgs, Fran\u00E7ois Englert, Robert Brout, Gerald Guralnik, C. R. Hagen, and Tom Kibble. Only Higgs and Englert received the 2013 Nobel Prize (Brout had died in 2011). The nickname \u2018God Particle\u2019 was coined by publisher Leon Lederman and is widely disliked by physicists, including Higgs himself.",
        }
    },
    // ─── Level 2: Exploration & Discovery ────────────────────────────────
    {
        id: "f138",
        title: "Polynesian Voyaging",
        date: "c. 1500 BCE \u2013 1200 CE",
        year: -1500,
        yearEnd: 1200,
        keywords: "Star navigation \u00B7 Wayfinding \u00B7 Pacific settlement \u00B7 Outrigger canoes",
        description: "Over nearly three millennia, Polynesian navigators crossed the largest ocean on Earth using nothing but the stars, ocean swells, wind patterns, and the flight of birds. Starting from island Southeast Asia, they reached Samoa and Tonga by 1000 BCE, Hawai\u2019i by 400 CE, and finally Aotearoa (New Zealand) around 1200 CE. Their double-hulled canoes carried entire communities \u2014 families, livestock, and crop seeds \u2014 across thousands of kilometers of open water. It was the greatest feat of open-ocean exploration in human history, accomplished without compass, chart, or metal.",
        quizDescription: "Polynesians navigated the Pacific by stars and waves, settling islands from Samoa to New Zealand.",
        location: { lat: -17.7, lng: -149.4, region: "Oceania", place: "Pacific Ocean" },
        category: "culture",
        difficulty: 2,
        controversyNotes: {
            date: "The chronology of Polynesian expansion is actively debated. Radiocarbon dates for early settlement of Remote Oceania range widely, and the \u2018short chronology\u2019 (rapid expansion after 1000 CE) challenges the older \u2018long chronology.\u2019 Settlement of New Zealand is relatively firm at c. 1250\u20131300 CE, but dates for Hawai\u2019i and Easter Island remain contested.",
            what: "Whether Polynesians reached South America (or vice versa) is debated. The presence of sweet potato in Polynesia before European contact and recent DNA evidence from Rapa Nui suggest some contact, but the nature and direction remain unclear.",
        }
    },
    {
        id: "f139",
        title: "The Silk Road Opens",
        date: "c. 130 BCE",
        year: -130,
        keywords: "Zhang Qian \u00B7 Han Dynasty \u00B7 Trade routes \u00B7 Cultural exchange",
        description: "In 138 BCE, Han Emperor Wu sent diplomat Zhang Qian westward to find allies against the Xiongnu nomads. Zhang Qian was captured and held prisoner for over a decade, but eventually returned with extraordinary intelligence about Central Asian kingdoms, their horses, and their trade goods. His reports opened the network of routes later called the Silk Road \u2014 a 6,400-kilometer web of paths linking China to Persia, India, and eventually Rome. Silk, spices, paper, and gunpowder flowed west; glass, gold, and horses flowed east. Ideas traveled too: Buddhism entered China along these very roads.",
        quizDescription: "Zhang Qian\u2019s mission for the Han Dynasty opened the Silk Road trade routes linking China to Rome.",
        location: { lat: 39.9, lng: 73.5, region: "Central Asia", place: "Central Asia" },
        category: "politics",
        difficulty: 2,
        controversyNotes: {
            what: "The term \u2018Silk Road\u2019 was coined by German geographer Ferdinand von Richthofen in 1877 \u2014 no one in antiquity used it. The routes were not a single road but a shifting network of trails, oases, and middlemen. Silk was not even the primary commodity; it was simply the most exotic to European eyes. Recent scholarship emphasizes the Silk Road as a web of regional exchanges rather than a single transcontinental highway.",
        }
    },
    {
        id: "f140",
        title: "Ibn Battuta\u2019s Odyssey",
        date: "1325\u20131354 CE",
        year: 1325,
        yearEnd: 1354,
        keywords: "Islamic world \u00B7 Travel writing \u00B7 Dar al-Islam \u00B7 Rihla",
        description: "At age 21, Moroccan scholar Ibn Battuta left Tangier on a pilgrimage to Mecca \u2014 and didn\u2019t stop traveling for nearly 30 years. He crossed North Africa, the Middle East, East Africa, Central Asia, India, Southeast Asia, and China, covering an estimated 120,000 kilometers \u2014 three times the distance Marco Polo traveled. His account, the Rihla, is the most detailed portrait of the 14th-century Islamic world. He served as a judge in the Maldives, survived shipwrecks and bandits, and witnessed the aftermath of the Black Death firsthand.",
        quizDescription: "Ibn Battuta traveled 120,000 km across the Islamic world over 29 years.",
        location: { lat: 35.8, lng: -5.8, region: "Middle East", place: "Tangier, Morocco to China" },
        category: "culture",
        difficulty: 2,
        controversyNotes: {
            what: "Some scholars question whether Ibn Battuta actually visited every place he claimed, particularly China. His account was dictated from memory to the scholar Ibn Juzayy, who may have embellished or borrowed from earlier travel writings. However, most of his itinerary is considered broadly reliable.",
        }
    },
    {
        id: "f141",
        title: "Zheng He\u2019s Treasure Fleets",
        date: "1405\u20131433 CE",
        year: 1405,
        yearEnd: 1433,
        keywords: "Ming Dynasty \u00B7 Naval exploration \u00B7 Indian Ocean \u00B7 Tribute system",
        description: "Chinese admiral Zheng He commanded seven massive naval expeditions across the Indian Ocean with fleets of up to 300 ships \u2014 some over 120 meters long, dwarfing anything Europe would build for centuries. His armadas visited Southeast Asia, India, Arabia, and the East African coast, establishing diplomatic and trade relationships across the known world. Then, abruptly, the Ming court ordered the fleets destroyed and overseas voyages banned. China turned inward just decades before European ships would transform the same ocean routes into colonial highways.",
        quizDescription: "Ming China\u2019s admiral Zheng He led massive fleets across the Indian Ocean decades before Columbus.",
        location: { lat: 32.1, lng: 118.8, region: "East Asia", place: "Nanjing, China" },
        category: "politics",
        difficulty: 2,
        controversyNotes: {
            what: "The size of Zheng He\u2019s ships is debated. Chinese sources describe \u2018treasure ships\u2019 of 120+ meters, which would make them the largest wooden vessels ever built. Many Western historians consider these dimensions exaggerated, suggesting 60\u201370 meters is more plausible. The reasons for ending the voyages are also debated: Confucian ideology, fiscal pressure, and factional politics at court all played roles.",
        }
    },
    {
        id: "f142",
        title: "Vasco da Gama Reaches India",
        date: "1498 CE",
        year: 1498,
        keywords: "Sea route \u00B7 Spice trade \u00B7 Portuguese Empire \u00B7 Cape of Good Hope",
        description: "In 1498, Portuguese navigator Vasco da Gama rounded the Cape of Good Hope and reached Calicut (Kozhikode) on India\u2019s southwest coast \u2014 the first European to sail directly from Europe to Asia. The voyage took 10 months and cost the lives of half his crew to scurvy. But its impact was seismic: it broke the Muslim and Venetian monopoly on the spice trade, shifted global commerce from overland routes to sea lanes, and launched the Portuguese maritime empire. Within a decade, Portugal controlled key ports from Mozambique to Malacca.",
        quizDescription: "Da Gama sailed around Africa to India, opening the first European sea route to Asia.",
        location: { lat: 11.3, lng: 75.8, region: "South Asia", place: "Calicut, India" },
        category: "war",
        difficulty: 2,
        controversyNotes: {
            location: "Da Gama sailed from Lisbon but the event\u2019s significance is the arrival in India, not the departure. Calicut (modern Kozhikode, Kerala) was a major spice trading port. The Zamorin (ruler) of Calicut was initially unimpressed by da Gama\u2019s gifts, which were suited for African trade, not Indian royalty.",
            what: "Da Gama\u2019s second voyage (1502) was far more violent than the first \u2014 he bombarded Calicut and committed atrocities against Muslim traders. The \u2018Age of Discovery\u2019 is increasingly reframed as the \u2018Age of Invasion\u2019 by historians emphasizing its devastating impact on Indigenous peoples and existing trade networks.",
        }
    },
    {
        id: "f143",
        title: "The Conquistadors",
        date: "1519\u20131533 CE",
        year: 1519,
        yearEnd: 1533,
        keywords: "Cort\u00E9s \u00B7 Pizarro \u00B7 Aztec Empire \u00B7 Inca Empire \u00B7 Colonization",
        description: "In just 14 years, small bands of Spanish soldiers toppled the two largest empires in the Americas. Hern\u00E1n Cort\u00E9s and around 600 men conquered the Aztec capital Tenochtitl\u00E1n (1521) \u2014 a city of 200,000, larger than any in Spain. Francisco Pizarro captured the Inca emperor Atahualpa with fewer than 200 soldiers (1532). The conquistadors succeeded not through military superiority alone but through a catastrophic combination of European diseases (which killed up to 90% of Indigenous populations), local alliances with subject peoples, and devastating technology gaps in steel and horses.",
        quizDescription: "Spanish conquistadors toppled the Aztec and Inca empires using disease, alliances, and technology.",
        location: { lat: 19.4, lng: -99.1, region: "Central America", place: "Mexico and Peru" },
        category: "war",
        difficulty: 2,
        controversyNotes: {
            what: "The narrative of a few hundred Spaniards defeating millions oversimplifies. Cort\u00E9s relied on tens of thousands of Indigenous allies (especially the Tlaxcalans) who had their own reasons to oppose the Aztecs. Disease, while devastating, was not immediate \u2014 the siege of Tenochtitl\u00E1n lasted months. Recent scholarship emphasizes Indigenous agency and the complex political alliances that enabled conquest.",
        }
    },
    {
        id: "f144",
        title: "Captain Cook\u2019s Pacific Voyages",
        date: "1768\u20131779 CE",
        year: 1768,
        yearEnd: 1779,
        keywords: "HMS Endeavour \u00B7 Pacific mapping \u00B7 Scientific exploration \u00B7 Australia",
        description: "British navigator James Cook led three voyages that mapped more of the Earth\u2019s surface than any explorer before or since. He charted New Zealand, the east coast of Australia, and hundreds of Pacific islands; disproved the existence of a great southern continent (Terra Australis); and was the first European to reach Hawai\u2019i. His ships carried naturalists, astronomers, and artists who documented plants, animals, and peoples unknown to European science. Yet Cook\u2019s voyages also opened the Pacific to colonization, displacing the Indigenous peoples whose ancestors had navigated these waters for millennia.",
        quizDescription: "Cook\u2019s three voyages mapped the Pacific, reaching Australia, New Zealand, and Hawai\u2019i.",
        location: { lat: -33.9, lng: 151.2, region: "Oceania", place: "Pacific Ocean" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "Cook is celebrated as a navigator and scientist but increasingly criticized for his role in colonialism. His \u2018discovery\u2019 of lands already inhabited for thousands of years is seen as the opening act of dispossession. In Australia and New Zealand, debates over Cook memorials and the concept of \u2018discovery\u2019 itself are ongoing. Cook was killed by Native Hawaiians at Kealakekua Bay in 1779 during a dispute that may have involved misunderstandings about his divine status.",
        }
    },
    {
        id: "f145",
        title: "Humboldt\u2019s Scientific Expedition",
        date: "1799\u20131804 CE",
        year: 1799,
        yearEnd: 1804,
        keywords: "Alexander von Humboldt \u00B7 Natural philosophy \u00B7 Ecology \u00B7 South America",
        description: "Prussian naturalist Alexander von Humboldt spent five years exploring South America, climbing volcanoes, measuring everything he encountered, and connecting it all into a unified vision of nature. He mapped ocean currents (the Humboldt Current still bears his name), discovered that altitude affects climate zones exactly like latitude, and showed that deforestation causes environmental damage \u2014 the first scientific warning about human impact on nature. His writings directly inspired Darwin, Thoreau, and John Muir. Humboldt essentially invented ecology and biogeography, seeing the natural world as an interconnected web rather than a catalog of specimens.",
        quizDescription: "Humboldt explored South America for five years, essentially inventing ecology and biogeography.",
        location: { lat: 0.2, lng: -78.5, region: "South America", place: "South America" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "Humboldt traveled with French botanist Aim\u00E9 Bonpland, whose contributions are often overshadowed. Humboldt also relied heavily on Indigenous knowledge and local guides, a debt he sometimes acknowledged but that traditional accounts underemphasize. His fame faded in the English-speaking world partly because of anti-German sentiment during the World Wars, but he remains a towering figure in the history of science.",
        }
    },
    {
        id: "f146",
        title: "Darwin\u2019s Voyage on the Beagle",
        date: "1831\u20131836 CE",
        year: 1831,
        yearEnd: 1836,
        keywords: "HMS Beagle \u00B7 Natural selection \u00B7 Gal\u00E1pagos \u00B7 Origin of Species",
        description: "In 1831, a 22-year-old Charles Darwin joined HMS Beagle as the ship\u2019s naturalist for a five-year survey voyage around the world. In South America he found fossils of giant extinct mammals. In the Gal\u00E1pagos Islands he noticed that finches on different islands had different beaks adapted to local food sources. These observations, combined with decades of further research, led to On the Origin of Species (1859) and the theory of evolution by natural selection \u2014 perhaps the most transformative scientific idea since Copernicus moved Earth from the center of the universe.",
        quizDescription: "Darwin\u2019s five-year voyage on the Beagle inspired his theory of evolution by natural selection.",
        location: { lat: -0.7, lng: -90.3, region: "South America", place: "Gal\u00E1pagos Islands & worldwide" },
        category: "science",
        difficulty: 2,
        controversyNotes: {
            what: "Alfred Russel Wallace independently conceived the theory of natural selection while in Southeast Asia. Darwin rushed to publish only after receiving Wallace\u2019s letter in 1858; their papers were presented jointly to the Linnean Society. Wallace\u2019s contribution is historically underrecognized. Darwin himself was initially reluctant to publish, fearing religious and social backlash.",
            date: "The voyage itself (1831\u20131836) is well documented, but Darwin did not publish On the Origin of Species until 1859 \u2014 23 years later. The long delay is attributed to his desire for overwhelming evidence, fear of controversy, and chronic illness.",
        }
    },


    // ─── Level 2 Chapter: Money & Trade ──────────────────────────────
    {
        id: "f147",
        title: "The Invention of Coinage",
        date: "c. 600 BCE",
        year: -600,
        keywords: "Electrum \u00B7 Lydia \u00B7 Standardized currency \u00B7 Trade",
        description: "Around 600 BCE, the kingdom of Lydia in western Anatolia began minting the world\u2019s first standardized coins from electrum, a natural gold-silver alloy. Before coins, trade relied on barter or weighed metal \u2014 clumsy systems that slowed commerce and bred mistrust. Lydian coins bore a lion\u2019s head stamp guaranteeing their weight and purity, creating trust between strangers. The idea spread rapidly to Greece, Persia, and India, transforming economies from local barter networks into interconnected trading systems.",
        quizDescription: "Lydia minted the first standardized coins, replacing barter with trusted currency.",
        location: { lat: 38.5, lng: 28.0, region: "Middle East", place: "Sardis, Lydia (modern Turkey)" },
        category: "culture",
        difficulty: 1,
        controversyNotes: {
            date: "China and India may have developed coin-like objects around the same time. Chinese bronze spade and knife money appeared by the 7th century BCE, and Indian punch-marked coins date to roughly the 6th century BCE. Whether Lydian coins were truly \u2018first\u2019 depends on how strictly one defines \u2018coin.\u2019",
        }
    },
    {
        id: "f148",
        title: "The Silk Road Opens",
        date: "c. 130 BCE \u2013 1450 CE",
        year: -130,
        yearEnd: 1450,
        keywords: "Zhang Qian \u00B7 East-West trade \u00B7 Caravans \u00B7 Cultural exchange",
        description: "In 138 BCE, Chinese emperor Wu of Han sent diplomat Zhang Qian westward to forge alliances against nomadic raiders. The mission failed diplomatically but revealed a 6,500-kilometer web of trade routes connecting China to the Mediterranean. Silk, spices, paper, and gunpowder flowed west; gold, glass, and horses traveled east. The Silk Road was not a single path but a shifting network of oases, mountain passes, and caravanserais where goods changed hands many times \u2014 with middlemen at each stop adding markups and cultural exchange.",
        quizDescription: "Zhang Qian\u2019s diplomatic mission opened trade routes connecting China to the Mediterranean.",
        location: { lat: 40, lng: 65, region: "Central Asia", place: "Central Asia (China to Rome)" },
        category: "culture",
        difficulty: 2,
        controversyNotes: {
            what: "The name \u2018Silk Road\u2019 was coined by German geographer Ferdinand von Richthofen in 1877 \u2014 ancient traders never used it. Some scholars argue the term overemphasizes a single commodity and a single route, when in reality it was a complex web of many routes trading many goods over many centuries.",
        }
    },
    {
        id: "f149",
        title: "Indian Ocean Trade Network",
        date: "c. 800\u20131500 CE",
        year: 800,
        yearEnd: 1500,
        keywords: "Monsoon winds \u00B7 Swahili coast \u00B7 Maritime trade \u00B7 Dhows",
        description: "For centuries, monsoon winds powered a vast maritime trading network linking East Africa, Arabia, India, Southeast Asia, and China. Swahili port cities like Kilwa and Mombasa grew wealthy exporting gold, ivory, and enslaved people in exchange for Chinese porcelain, Indian textiles, and Persian glass. Unlike later European colonial trade, this was a multicultural system \u2014 Arab dhows, Chinese junks, and Indian merchants all participated as relative equals. The network\u2019s reach was staggering: medieval African rulers dined off Chinese celadon plates, while Indonesian spices flavored Middle Eastern cuisine.",
        quizDescription: "Monsoon-powered maritime trade linked East Africa, Arabia, India, and China for centuries.",
        location: { lat: -6, lng: 39, region: "East Africa", place: "Kilwa, East Africa (Indian Ocean)" },
        category: "culture",
        difficulty: 2,
        controversyNotes: {
            location: "The Indian Ocean network had no single center \u2014 Kilwa, Calicut, Malacca, Guangzhou, and Aden were all major hubs at different times. The choice of Kilwa highlights often-overlooked African participation, but the network was truly pan-oceanic.",
        }
    },
    {
        id: "f150",
        title: "Paper Money in China",
        date: "1024 CE",
        year: 1024,
        keywords: "Song Dynasty \u00B7 Jiaozi \u00B7 Fiat currency \u00B7 Inflation",
        description: "In 1024, the Song Dynasty government took over the issuance of jiaozi \u2014 paper promissory notes that Sichuan merchants had been using privately for decades. These became the world\u2019s first government-backed paper currency. The innovation was born of necessity: the government restricted copper coinage in Sichuan, forcing merchants to use iron coins so heavy that a major purchase required a cartload of currency. The system worked brilliantly for generations, enabling sophisticated commerce across China\u2019s vast territory. But later dynasties printed too much, causing devastating inflation \u2014 a cautionary tale that would repeat whenever governments discovered how easy it was to create money from paper.",
        quizDescription: "The Song Dynasty issued the first government paper currency, revolutionizing commerce.",
        location: { lat: 30.6, lng: 104.1, region: "East Asia", place: "Chengdu, China" },
        category: "culture",
        difficulty: 2,
        controversyNotes: {
            date: "Private jiaozi notes circulated in Sichuan from around 997 CE. The 1024 date marks when the Song government established a monopoly on their issuance. Some historians date the true beginning of paper money to these earlier private notes rather than the government takeover.",
        }
    },
    {
        id: "f151",
        title: "The Hanseatic League",
        date: "c. 1241\u20131669",
        year: 1241,
        yearEnd: 1669,
        keywords: "L\u00FCbeck \u00B7 Merchant confederation \u00B7 Baltic trade \u00B7 Commercial law",
        description: "Beginning with an alliance between L\u00FCbeck and Hamburg in 1241, the Hanseatic League grew into a confederation of nearly 200 merchant cities stretching from London to Novgorod. In an era of feudal lords and constant warfare, the League offered something revolutionary: a zone of commercial law, standardized weights, and mutual defense for traders. Hanseatic merchants controlled the Baltic herring trade, Russian furs, and Scandinavian timber, making them richer than many kings. The League proved that economic power could rival military might \u2014 a merchant republic before the age of republics.",
        quizDescription: "A confederation of merchant cities dominated Northern European trade for four centuries.",
        location: { lat: 53.9, lng: 10.7, region: "Europe", place: "L\u00FCbeck, Northern Europe" },
        category: "politics",
        difficulty: 2,
        controversyNotes: {
            what: "Whether the Hanseatic League was a formal political entity or a loose commercial network is debated. It had no constitution, no permanent officials, and no standing army. Some historians describe it as the world\u2019s first multinational corporation; others insist it was merely a set of bilateral trade agreements.",
        }
    },
    {
        id: "f152",
        title: "The Medici Bank",
        date: "1397\u20131494",
        year: 1397,
        yearEnd: 1494,
        keywords: "Florence \u00B7 Double-entry bookkeeping \u00B7 Renaissance patronage \u00B7 Banking",
        description: "Founded by Giovanni di Bicci de\u2019 Medici in 1397, the Medici Bank became Europe\u2019s most powerful financial institution by perfecting innovations still central to banking: letters of credit, branch networks across major cities, and meticulous double-entry bookkeeping. The bank\u2019s real genius was disguising interest charges (forbidden by the Church as usury) as currency exchange fees. Medici wealth funded the Renaissance \u2014 Botticelli, Michelangelo, and Brunelleschi all depended on Medici patronage. The family\u2019s rise from merchants to rulers of Florence and popes of Rome demonstrated how financial power could reshape politics and culture alike.",
        quizDescription: "The Medici Bank pioneered modern banking practices and funded the Italian Renaissance.",
        location: { lat: 43.77, lng: 11.25, region: "Europe", place: "Florence, Italy" },
        category: "culture",
        difficulty: 2,
        controversyNotes: {
            description: "Double-entry bookkeeping was not invented by the Medici \u2014 it was already in use by Italian merchants in the 13th century and was systematized by Luca Pacioli in 1494. The Medici Bank perfected and scaled these practices rather than originating them.",
        }
    },
    {
        id: "f153",
        title: "The Dutch East India Company",
        date: "1602\u20131799",
        year: 1602,
        yearEnd: 1799,
        keywords: "VOC \u00B7 Stock exchange \u00B7 Spice trade \u00B7 Corporate imperialism",
        description: "Chartered in 1602, the Vereenigde Oostindische Compagnie (VOC) was the world\u2019s first publicly traded company \u2014 and arguably the most powerful corporation in history. It could wage war, negotiate treaties, establish colonies, and mint its own coins. At its peak, the VOC controlled the global spice trade, employed 50,000 people, and commanded 40 warships. Its Amsterdam stock exchange created the first modern financial market, complete with speculation and short-selling. The VOC was also ruthlessly exploitative, enslaving populations and destroying entire ecosystems to maintain spice monopolies.",
        quizDescription: "The world\u2019s first publicly traded company controlled the global spice trade from Amsterdam.",
        location: { lat: 52.37, lng: 4.9, region: "Europe", place: "Amsterdam, Netherlands" },
        category: "politics",
        difficulty: 2,
        controversyNotes: {
            what: "Some scholars argue the English East India Company (founded 1600) or earlier Italian joint-stock ventures deserve the \u2018first corporation\u2019 title. The VOC\u2019s claim rests on being the first to issue freely tradable shares on a public exchange, but the definition of \u2018corporation\u2019 and \u2018stock exchange\u2019 is debated.",
        }
    },
    {
        id: "f154",
        title: "The South Sea Bubble",
        date: "1720",
        year: 1720,
        keywords: "Speculation \u00B7 Financial crash \u00B7 Isaac Newton \u00B7 Market regulation",
        description: "In 1720, shares in the South Sea Company \u2014 which held a monopoly on British trade with South America \u2014 surged from \u00A3128 to over \u00A31,000 in months, driven by wild speculation and insider manipulation. Nobles, scholars, and servants alike mortgaged everything to buy shares. When the bubble burst, fortunes evaporated overnight. Isaac Newton reportedly lost \u00A320,000 and lamented he could calculate the motions of heavenly bodies but not the madness of people. The crash led to Britain\u2019s first financial regulations and proved a truth that would haunt markets for centuries: speculative fever is as old as markets themselves.",
        quizDescription: "Britain\u2019s first great financial crash wiped out fortunes and led to early market regulations.",
        location: { lat: 51.5, lng: -0.1, region: "Europe", place: "London, England" },
        category: "politics",
        difficulty: 2,
        controversyNotes: {
            what: "Newton\u2019s famous quote about \u2018calculating the madness of people\u2019 is likely apocryphal \u2014 the earliest source is an 1855 biography. That he lost money in the crash is well documented, but the exact amount and his emotional reaction are less certain.",
        }
    },
    {
        id: "f155",
        title: "The Bretton Woods Conference",
        date: "July 1944",
        year: 1944,
        keywords: "IMF \u00B7 World Bank \u00B7 Gold standard \u00B7 Keynes \u00B7 Post-war order",
        description: "In July 1944, delegates from 44 Allied nations gathered at a New Hampshire resort to design a new global financial system from the ruins of two world wars and a devastating depression. The agreements created the International Monetary Fund, the World Bank, and pegged world currencies to the US dollar, which was tied to gold. British economist John Maynard Keynes clashed bitterly with American negotiator Harry Dexter White over the design \u2014 but both agreed that unregulated markets had nearly destroyed civilization and that international cooperation was the only path forward.",
        quizDescription: "Allied nations created the IMF, World Bank, and dollar-based monetary system.",
        location: { lat: 44.26, lng: -71.44, region: "North America", place: "Bretton Woods, New Hampshire" },
        category: "politics",
        difficulty: 2,
        controversyNotes: {
            what: "Harry Dexter White, the American chief negotiator, was later accused of being a Soviet agent. Declassified evidence from the Venona project suggests he did pass information to Soviet intelligence, though whether this influenced the Bretton Woods agreements remains debated.",
        }
    },
    {
        id: "f156",
        title: "The Rise of Globalization",
        date: "1995",
        year: 1995,
        keywords: "WTO \u00B7 Free trade \u00B7 Supply chains \u00B7 Inequality \u00B7 Container shipping",
        description: "On January 1, 1995, the World Trade Organization replaced the postwar GATT system with a permanent institution governing global commerce. Combined with the explosion of container shipping, the internet, and the fall of the Soviet bloc, this accelerated a transformation already underway: by 2000, a T-shirt\u2019s cotton might be grown in India, spun in Bangladesh, sewn in Vietnam, and sold in New York. Global trade more than doubled in a decade. Hundreds of millions escaped poverty, especially in China and Southeast Asia. But globalization also hollowed out manufacturing in the developed world, widened inequality, and made supply chains vulnerable to shocks \u2014 tensions that fueled populist movements in the 2010s.",
        quizDescription: "The WTO\u2019s founding accelerated global trade, lifting millions from poverty while disrupting economies.",
        location: { lat: 46.2, lng: 6.15, region: "Europe", place: "Geneva, Switzerland" },
        category: "politics",
        difficulty: 3,
        controversyNotes: {
            what: "Whether globalization\u2019s net effect is positive or negative remains one of the most contested questions in economics. Proponents point to billions lifted from poverty; critics highlight rising inequality, environmental destruction, and the vulnerability of long supply chains exposed by COVID-19.",
        }
    }
];

// ─── EVENT CONNECTIONS (cause-and-effect) ────────────────────────────
// Each key maps an event id to its related events with directional labels.
// Attached to CORE_EVENTS below so every event has a `relatedEvents` field.
const EVENT_CONNECTIONS = {
    f1: [
        { id: "f2", label: "Freed hands for tool use, eventually enabling fire control" },
    ],
    f2: [
        { id: "f1", label: "Built on bipedalism from the Ancestral Split" },
        { id: "f3", label: "Cooking fueled the brain growth behind Homo sapiens" },
    ],
    f3: [
        { id: "f2", label: "Larger brains powered by the Cooking Revolution" },
        { id: "f5", label: "Homo sapiens migrated out of Africa" },
    ],
    f4: [
        { id: "f3", label: "Emerged from Homo sapiens' growing cognitive abilities" },
        { id: "f5", label: "Language and planning enabled long-distance migration" },
    ],
    f5: [
        { id: "f4", label: "Made possible by the language of Behavioral Modernity" },
        { id: "f6", label: "Settled populations eventually adopted agriculture" },
    ],
    f6: [
        { id: "f5", label: "Farming arose after humans settled worldwide" },
        { id: "f7", label: "Surpluses enabled the first cities in Sumer" },
        { id: "f8", label: "Nile agriculture made Egyptian unification possible" },
    ],
    f7: [
        { id: "f6", label: "Cities arose from agricultural surpluses" },
        { id: "f9", label: "Managing city economies required writing" },
    ],
    f8: [
        { id: "f6", label: "Nile agriculture enabled unification" },
    ],
    f9: [
        { id: "f7", label: "Sumerian city management demanded record-keeping" },
        { id: "f10", label: "Writing enabled the first written legal codes" },
    ],
    f10: [
        { id: "f9", label: "Built on the written language of cuneiform" },
    ],
    f13: [
        { id: "f17", label: "The Republic's tensions led to Caesar's assassination" },
    ],
    f14: [
        { id: "f15", label: "Philosophical ideas shaped Alexander's ambitions" },
    ],
    f15: [
        { id: "f14", label: "Driven by Axial Age philosophical traditions" },
    ],
    f17: [
        { id: "f13", label: "Grew from the Roman Republic's political tensions" },
        { id: "f18", label: "Caesar's death cleared the way for Augustus" },
    ],
    f18: [
        { id: "f17", label: "Augustus rose from the chaos after Caesar's death" },
        { id: "f21", label: "Pax Romana eventually gave way to Rome's decline" },
    ],
    f19: [
        { id: "f18", label: "Christianity emerged during the Pax Romana" },
        { id: "f20", label: "Christianity grew until Constantine legalized it" },
    ],
    f20: [
        { id: "f19", label: "Legalized Christianity after centuries of growth" },
        { id: "f21", label: "Even state Christianity could not prevent Rome's fall" },
    ],
    f21: [
        { id: "f18", label: "Centuries of decline after the Pax Romana" },
        { id: "f20", label: "Rome fell despite adopting Christianity" },
        { id: "f27", label: "Left a power vacuum Charlemagne would fill" },
    ],
    f22: [
        { id: "f24", label: "Byzantine weakness opened the door for Islam's rise" },
    ],
    f24: [
        { id: "f22", label: "Byzantine plague weakness aided Islam's expansion" },
        { id: "f26", label: "Islam's expansion fueled the Golden Age of scholarship" },
    ],
    f26: [
        { id: "f24", label: "Built on Islam's rapid expansion" },
        { id: "f34", label: "Preserved ancient knowledge that later sparked the Renaissance" },
    ],
    f27: [
        { id: "f21", label: "Filled the power vacuum left by Rome's fall" },
    ],
    f29: [
        { id: "f30", label: "Mongol trade routes carried plague to Europe" },
    ],
    f30: [
        { id: "f29", label: "Plague traveled west along Mongol trade routes" },
        { id: "f34", label: "The plague's aftermath helped spark the Renaissance" },
    ],
    f31: [
        { id: "f33", label: "Drove European powers to seek new western routes" },
        { id: "f34", label: "Greek scholars fleeing to Italy fueled the Renaissance" },
    ],
    f32: [
        { id: "f34", label: "Printing spread Renaissance ideas to a mass audience" },
        { id: "f36", label: "The press made Luther's Reformation unstoppable" },
    ],
    f33: [
        { id: "f31", label: "Constantinople's fall pushed exploration westward" },
        { id: "f39", label: "Opened the path for the Atlantic slave trade" },
        { id: "f35", label: "Inspired the quest to circumnavigate the globe" },
    ],
    f34: [
        { id: "f30", label: "Post-plague upheaval helped spark cultural rebirth" },
        { id: "f32", label: "The printing press spread Renaissance ideas widely" },
        { id: "f38", label: "Renaissance curiosity fed the Scientific Revolution" },
    ],
    f35: [
        { id: "f33", label: "Columbus's voyages inspired further exploration" },
    ],
    f36: [
        { id: "f32", label: "The printing press made Luther's ideas unstoppable" },
        { id: "f37", label: "Religious divisions erupted into the Thirty Years' War" },
    ],
    f37: [
        { id: "f36", label: "Reformation divisions exploded into religious wars" },
    ],
    f38: [
        { id: "f34", label: "Built on Renaissance curiosity and inquiry" },
        { id: "f40", label: "Scientific thinking inspired Enlightenment philosophy" },
    ],
    f39: [
        { id: "f33", label: "Columbus opened the path for the slave trade" },
        { id: "f48", label: "The abolitionist movement fought to end slavery" },
    ],
    f40: [
        { id: "f38", label: "Applied the Scientific Revolution's logic to society" },
        { id: "f42", label: "Directly inspired the American Revolution" },
        { id: "f43", label: "Enlightenment ideals fueled the French Revolution" },
    ],
    f41: [
        { id: "f46", label: "Powered the Industrial Revolution's factories" },
    ],
    f42: [
        { id: "f40", label: "Enlightenment ideals drove the revolution" },
        { id: "f43", label: "American success inspired French revolutionaries" },
    ],
    f43: [
        { id: "f42", label: "Inspired by the American Revolution's success" },
        { id: "f40", label: "Fueled by Enlightenment ideals" },
        { id: "f44", label: "Revolutionary chaos led to Napoleon's rise" },
    ],
    f44: [
        { id: "f43", label: "Napoleon rose from the French Revolution's chaos" },
        { id: "f45", label: "Napoleon's defeat led to the Congress of Vienna" },
    ],
    f45: [
        { id: "f44", label: "Convened to restore order after Napoleon's defeat" },
        { id: "f47", label: "Vienna's conservative order provoked democratic revolts" },
    ],
    f46: [
        { id: "f41", label: "Watt's steam engine accelerated industrialization" },
        { id: "f48", label: "Industrial economics shifted views on slavery" },
        { id: "f49", label: "Industrial powers competed for African resources" },
    ],
    f47: [
        { id: "f45", label: "Vienna's restored monarchies provoked these uprisings" },
    ],
    f48: [
        { id: "f46", label: "Industrialization strengthened abolitionist movements" },
        { id: "f39", label: "Fought to end the Atlantic slave trade" },
    ],
    f49: [
        { id: "f46", label: "Industrial powers needed African raw materials" },
        { id: "f56", label: "Colonial exploitation planted seeds of decolonization" },
    ],
    f50: [
        { id: "f55", label: "Created the Soviet bloc, one pole of the Cold War" },
    ],
    f51: [
        { id: "f52", label: "Harsh reparations contributed to the Great Depression" },
    ],
    f52: [
        { id: "f51", label: "Worsened by Versailles's punitive economic terms" },
        { id: "f53", label: "Economic collapse helped fuel World War II" },
    ],
    f53: [
        { id: "f52", label: "Fueled by Depression-era instability" },
        { id: "f54", label: "Led to the founding of the United Nations" },
        { id: "f55", label: "Victory split the world into Cold War blocs" },
    ],
    f54: [
        { id: "f53", label: "Founded in the aftermath of World War II" },
    ],
    f55: [
        { id: "f53", label: "Arose from World War II's aftermath" },
        { id: "f50", label: "Soviet communism formed the eastern bloc" },
        { id: "f59", label: "Ended with the fall of the Berlin Wall" },
    ],
    f56: [
        { id: "f53", label: "WWII exposed and weakened colonial empires" },
        { id: "f49", label: "Colonial exploitation fueled independence movements" },
    ],
    f57: [
        { id: "f55", label: "Cold War rivalry drove the Space Race" },
    ],
    f58: [
        { id: "f55", label: "Cold War military research birthed the internet" },
    ],
    f59: [
        { id: "f55", label: "The Cold War's end freed Eastern Europe" },
        { id: "f60", label: "Enabled European reunification and the EU" },
    ],
    f60: [
        { id: "f59", label: "Made possible by the fall of the Berlin Wall" },
    ],
};

// ─── Level 2: Revolutions chapter connections ───────────────────────
const LEVEL2_CONNECTIONS = {
    // New events
    f61: [
        { id: "f42", label: "English constitutional ideas inspired American colonists" },
        { id: "f43", label: "The execution of a king foreshadowed the French Revolution" },
    ],
    f62: [
        { id: "f43", label: "Inspired by the French Revolution\u2019s declaration of rights" },
        { id: "f48", label: "First successful slave revolution accelerated global abolition" },
        { id: "f63", label: "Haiti\u2019s success emboldened Latin American independence movements" },
    ],
    f63: [
        { id: "f42", label: "American independence provided a model for liberation" },
        { id: "f44", label: "Napoleon\u2019s invasion of Spain weakened colonial control" },
        { id: "f62", label: "Haiti showed that colonial liberation was possible" },
    ],
    f64: [
        { id: "f50", label: "War exhaustion and famine in Russia triggered revolution" },
        { id: "f51", label: "The war\u2019s end produced the Treaty of Versailles" },
        { id: "f53", label: "Unresolved tensions and harsh reparations led to World War II" },
        { id: "f65", label: "WWI\u2019s aftermath destabilized China, enabling revolution" },
    ],
    f65: [
        { id: "f50", label: "The Bolshevik success provided the communist model" },
        { id: "f64", label: "WWI and its aftermath radicalized Chinese politics" },
        { id: "f55", label: "Communist China became a key player in the Cold War" },
    ],
    f66: [
        { id: "f55", label: "Cold War meddling in Iran fueled anti-Western sentiment" },
        { id: "f67", label: "Iran\u2019s revolution inspired Islamist movements across the region" },
    ],
    f67: [
        { id: "f66", label: "Decades of authoritarian rule, partly shaped by Iran\u2019s example, bred discontent" },
        { id: "f56", label: "Post-colonial authoritarian regimes sparked popular uprisings" },
    ],
    // Cross-connections: append to existing events
    f42: [
        { id: "f61", label: "Inspired by England\u2019s parliamentary revolution" },
        { id: "f63", label: "American independence inspired Latin American liberators" },
    ],
    f43: [
        { id: "f61", label: "Followed the precedent of England\u2019s regicide" },
        { id: "f62", label: "French ideals of liberty inspired the Haitian Revolution" },
        { id: "f63", label: "Revolutionary ideals spread to Latin America" },
    ],
    f47: [
        { id: "f63", label: "Latin American independence joined the global revolutionary wave" },
    ],
    f50: [
        { id: "f64", label: "World War I\u2019s collapse triggered the revolution" },
        { id: "f65", label: "Provided the communist model for Mao\u2019s revolution" },
    ],
};

// Merge Level 2 connections into the main connections object
for (const [eventId, connections] of Object.entries(LEVEL2_CONNECTIONS)) {
    if (EVENT_CONNECTIONS[eventId]) {
        EVENT_CONNECTIONS[eventId].push(...connections);
    } else {
        EVENT_CONNECTIONS[eventId] = connections;
    }
}

// --- Level 2: Road to AI chapter connections ---
const LEVEL2_AI_CONNECTIONS = {
    f68: [
        { id: "f38", label: "The Scientific Revolution\u2019s empiricism inspired Babbage\u2019s mechanical thinking" },
        { id: "f69", label: "Lovelace\u2019s vision of programmable machines anticipated Boolean logic\u2019s role" },
    ],
    f69: [
        { id: "f68", label: "Boole formalized the logic that Babbage\u2019s machines would need" },
        { id: "f70", label: "Boolean algebra became the mathematical foundation for Turing\u2019s work" },
    ],
    f70: [
        { id: "f69", label: "Turing built on Boolean logic to define computation" },
        { id: "f71", label: "Turing\u2019s theoretical blueprint was realized in electronic computers" },
        { id: "f73", label: "The Turing Test framed the central question of artificial intelligence" },
    ],
    f71: [
        { id: "f70", label: "ENIAC proved Turing\u2019s theoretical machine could be built" },
        { id: "f72", label: "Vacuum-tube limitations drove the invention of the transistor" },
    ],
    f72: [
        { id: "f71", label: "The transistor replaced ENIAC\u2019s fragile vacuum tubes" },
        { id: "f58", label: "Integrated circuits powered the digital revolution" },
        { id: "f73", label: "Affordable computing made AI research practical" },
    ],
    f73: [
        { id: "f70", label: "Built on Turing\u2019s question: can machines think?" },
        { id: "f72", label: "Cheap transistors made AI experimentation possible" },
        { id: "f74", label: "Dartmouth\u2019s grand promises set the stage for disappointment" },
    ],
    f74: [
        { id: "f73", label: "Overpromising at Dartmouth led to backlash when AI fell short" },
        { id: "f75", label: "Despite the winters, specialized AI like Deep Blue showed promise" },
    ],
    f75: [
        { id: "f74", label: "Deep Blue emerged as AI recovered from its second winter" },
        { id: "f76", label: "Kasparov\u2019s defeat renewed public interest in machine intelligence" },
    ],
    f76: [
        { id: "f75", label: "Deep Blue showed brute force; deep learning showed genuine pattern recognition" },
        { id: "f77", label: "The deep learning revolution led directly to large language models" },
    ],
    f77: [
        { id: "f76", label: "Built on the deep learning techniques proven in 2012" },
        { id: "f58", label: "The internet provided the massive training data LLMs needed" },
    ],
    // Cross-connections: append to existing events
    f38: [
        { id: "f68", label: "Scientific empiricism inspired the dream of thinking machines" },
    ],
    f58: [
        { id: "f76", label: "The internet provided the massive datasets deep learning required" },
        { id: "f77", label: "The internet provided the data that trained modern AI" },
    ],
};

for (const [eventId, connections] of Object.entries(LEVEL2_AI_CONNECTIONS)) {
    if (EVENT_CONNECTIONS[eventId]) {
        EVENT_CONNECTIONS[eventId].push(...connections);
    } else {
        EVENT_CONNECTIONS[eventId] = connections;
    }
}

// --- Level 2: Fight for Freedom chapter connections ---
const LEVEL2_FREEDOM_CONNECTIONS = {
    f78: [
        { id: "f40", label: "Enlightenment ideals of individual rights fueled the moral case against slavery" },
        { id: "f39", label: "Directly opposed the Atlantic slave trade at its peak" },
        { id: "f48", label: "Britain\u2019s abolitionist success launched global abolition" },
        { id: "f79", label: "Inspired American abolitionists and the Underground Railroad" },
    ],
    f79: [
        { id: "f78", label: "British abolitionists inspired American resistance to slavery" },
        { id: "f42", label: "Enslaved people claimed the American Revolution\u2019s promise of freedom" },
        { id: "f48", label: "Douglass\u2019s voice helped push America toward abolition" },
        { id: "f82", label: "The long tradition of Black resistance laid groundwork for Civil Rights" },
    ],
    f80: [
        { id: "f40", label: "Enlightenment ideals of equality were extended to demand women\u2019s rights" },
        { id: "f43", label: "The Women\u2019s March on Versailles was an early spark for feminist action" },
        { id: "f82", label: "Suffrage tactics of marches and civil disobedience inspired Civil Rights" },
    ],
    f81: [
        { id: "f49", label: "Colonial exploitation of India fueled the independence movement" },
        { id: "f56", label: "Gandhi\u2019s non-violent methods became the blueprint for decolonization worldwide" },
        { id: "f82", label: "Gandhi\u2019s non-violence directly inspired Martin Luther King Jr." },
    ],
    f82: [
        { id: "f79", label: "Continued the centuries-long struggle for Black freedom" },
        { id: "f81", label: "King adopted Gandhi\u2019s non-violent resistance strategy" },
        { id: "f48", label: "Abolition ended legal slavery, but segregation persisted for a century" },
        { id: "f83", label: "American and South African movements inspired each other" },
        { id: "f84", label: "Civil rights tactics and rhetoric inspired the LGBTQ+ movement" },
    ],
    f83: [
        { id: "f49", label: "The Scramble for Africa created the racial hierarchies apartheid formalized" },
        { id: "f56", label: "South Africa resisted decolonization longer than any African state" },
        { id: "f82", label: "Mandela studied King; both movements strengthened each other" },
        { id: "f59", label: "Apartheid\u2019s fall was part of the wave of liberation in the early 1990s" },
    ],
    f84: [
        { id: "f82", label: "Civil rights logic expanded to include sexual and gender identity" },
        { id: "f87", label: "LGBTQ+ activism pioneered the identity-based movements of the digital age" },
    ],
    f85: [
        { id: "f65", label: "Students protested the communist state Mao\u2019s revolution had created" },
        { id: "f59", label: "Same year as the Berlin Wall\u2019s fall \u2014 same spirit, opposite outcome" },
        { id: "f55", label: "Cold War dynamics shaped China\u2019s response to democratic demands" },
        { id: "f87", label: "Tiananmen\u2019s global broadcast foreshadowed the power of digital witness" },
    ],
    f86: [
        { id: "f49", label: "Belgium\u2019s colonial partition deepened the Hutu\u2013Tutsi divide" },
        { id: "f56", label: "Post-colonial politics weaponized ethnic identities left by colonizers" },
        { id: "f54", label: "Exposed the UN\u2019s failure to uphold \u2018Never Again\u2019" },
    ],
    f87: [
        { id: "f58", label: "The internet provided the infrastructure for digital activism" },
        { id: "f67", label: "The Arab Spring was the first mass social-media protest movement" },
        { id: "f82", label: "Black Lives Matter continued the Civil Rights Movement in a digital age" },
        { id: "f81", label: "Non-violent mass action went global through digital coordination" },
    ],
    // Cross-connections: append to existing events
    f40: [
        { id: "f78", label: "Enlightenment rights philosophy powered the abolitionist crusade" },
    ],
    f39: [
        { id: "f78", label: "The abolitionist movement rose to oppose the slave trade" },
        { id: "f79", label: "Enslaved people built secret networks to resist from within" },
    ],
    f48: [
        { id: "f78", label: "British abolitionists led the first wave of global abolition" },
        { id: "f79", label: "Douglass and the Underground Railroad pushed America toward abolition" },
    ],
    f49: [
        { id: "f83", label: "The Scramble for Africa created the racial order apartheid enforced" },
        { id: "f86", label: "Colonial borders and ethnic manipulation led to the Rwandan genocide" },
    ],
    f42: [
        { id: "f79", label: "Enslaved Americans claimed the Revolution\u2019s promise of liberty" },
    ],
};

for (const [eventId, connections] of Object.entries(LEVEL2_FREEDOM_CONNECTIONS)) {
    if (EVENT_CONNECTIONS[eventId]) {
        EVENT_CONNECTIONS[eventId].push(...connections);
    } else {
        EVENT_CONNECTIONS[eventId] = connections;
    }
}

// --- Level 2: Empires Rise & Fall chapter connections ---
const LEVEL2_EMPIRES_CONNECTIONS = {
    f88: [
        { id: "f15", label: "Alexander conquered the Persian Empire, spreading Greek culture east" },
        { id: "f89", label: "Persian administrative methods influenced the Maurya Empire" },
    ],
    f89: [
        { id: "f88", label: "Maurya governance borrowed from Persian imperial administration" },
        { id: "f14", label: "Ashoka\u2019s philosophy drew from the Axial Age\u2019s moral traditions" },
        { id: "f91", label: "Maurya decline eventually gave way to the Gupta golden age" },
    ],
    f90: [
        { id: "f18", label: "The Han and Roman empires traded along the Silk Road without meeting" },
        { id: "f25", label: "The Tang Dynasty rebuilt and expanded what the Han began" },
        { id: "f91", label: "Han China and Gupta India traded ideas along the Silk Road" },
    ],
    f91: [
        { id: "f89", label: "Centuries after the Maurya, India experienced its classical golden age" },
        { id: "f90", label: "Gupta scholars exchanged knowledge with Han China via the Silk Road" },
        { id: "f26", label: "Indian mathematics, including zero, flowed into the Islamic Golden Age" },
    ],
    f92: [
        { id: "f31", label: "The Ottomans conquered Constantinople, ending the Byzantine Empire" },
        { id: "f29", label: "The Ottomans filled the power vacuum left by the Mongol collapse" },
        { id: "f95", label: "Six centuries of Ottoman power ended in World War I" },
        { id: "f96", label: "The Ottomans and Mughals competed for influence across the Islamic world" },
    ],
    f93: [
        { id: "f29", label: "The Ming rose by driving out the Mongols" },
        { id: "f33", label: "China\u2019s withdrawal from the seas left exploration to European powers" },
        { id: "f92", label: "Ming and Ottoman empires were contemporaries dominating East and West" },
    ],
    f94: [
        { id: "f46", label: "Industrial Revolution gave Britain the economic engine for global empire" },
        { id: "f49", label: "British imperial ambition drove the Scramble for Africa" },
        { id: "f56", label: "British Empire\u2019s overreach planted the seeds of decolonization" },
        { id: "f96", label: "Britain dismantled the Mughal Empire to colonize India" },
    ],
    f95: [
        { id: "f92", label: "Six centuries of Ottoman power collapsed in the 20th century" },
        { id: "f64", label: "Entering WWI on the losing side sealed the empire\u2019s fate" },
        { id: "f56", label: "European-drawn borders in former Ottoman lands sparked decades of conflict" },
    ],
    f96: [
        { id: "f29", label: "Babur descended from both Genghis Khan and Timur" },
        { id: "f92", label: "Mughals and Ottomans were the twin pillars of Islamic imperial power" },
        { id: "f94", label: "British exploitation ended the Mughal Dynasty" },
        { id: "f81", label: "Mughal decline and British rule set the stage for Indian independence" },
    ],
    // Cross-connections: append to existing events
    f15: [
        { id: "f88", label: "Alexander destroyed the Persian Empire and spread Greek culture east" },
    ],
    f18: [
        { id: "f90", label: "Rome and Han China were contemporaries linked by the Silk Road" },
    ],
    f29: [
        { id: "f92", label: "Mongol collapse left a power vacuum the Ottomans filled" },
        { id: "f93", label: "China drove out the Mongols and established the Ming Dynasty" },
    ],
    f31: [
        { id: "f92", label: "The Ottoman conquest ended the last remnant of the Roman Empire" },
    ],
    f46: [
        { id: "f94", label: "Industrial power fueled British global dominance" },
    ],
};

for (const [eventId, connections] of Object.entries(LEVEL2_EMPIRES_CONNECTIONS)) {
    if (EVENT_CONNECTIONS[eventId]) {
        EVENT_CONNECTIONS[eventId].push(...connections);
    } else {
        EVENT_CONNECTIONS[eventId] = connections;
    }
}

// --- Level 2: Plagues & Pandemics chapter connections ---
const LEVEL2_PLAGUES_CONNECTIONS = {
    f97: [
        { id: "f18", label: "The plague struck at the height of the Pax Romana" },
        { id: "f21", label: "Military weakness from the plague contributed to Rome\u2019s eventual fall" },
        { id: "f22", label: "The Antonine Plague foreshadowed the even deadlier Plague of Justinian" },
    ],
    f98: [
        { id: "f33", label: "European contact with the Americas brought devastating disease" },
        { id: "f39", label: "Indigenous population collapse opened the way for the slave trade" },
    ],
    f99: [
        { id: "f30", label: "London\u2019s Great Plague was the Black Death\u2019s final European echo" },
        { id: "f100", label: "Plague\u2019s recurring horror drove the search for prevention" },
    ],
    f100: [
        { id: "f99", label: "Centuries of plague created urgency for a preventive cure" },
        { id: "f38", label: "Jenner applied the Scientific Revolution\u2019s empirical method to medicine" },
        { id: "f104", label: "Jenner\u2019s vaccine was the first step toward smallpox\u2019s total eradication" },
    ],
    f101: [
        { id: "f100", label: "Jenner proved prevention was possible; Snow proved tracking was possible" },
        { id: "f46", label: "Industrial cities\u2019 crowding and filth made cholera epidemics inevitable" },
        { id: "f102", label: "Snow\u2019s methods would be desperately needed against the Spanish Flu" },
    ],
    f102: [
        { id: "f101", label: "Epidemiology was still too young to contain a global pandemic" },
        { id: "f64", label: "WWI troop movements and censorship helped the virus spread" },
        { id: "f103", label: "The flu\u2019s devastation drove urgency for antibiotics and better medicine" },
    ],
    f103: [
        { id: "f102", label: "The Spanish Flu showed how vulnerable humanity remained to infection" },
        { id: "f100", label: "Jenner prevented disease; Fleming cured it \u2014 two pillars of modern medicine" },
        { id: "f104", label: "Antibiotics and vaccines together made disease eradication conceivable" },
    ],
    f104: [
        { id: "f100", label: "Jenner\u2019s 1796 experiment set the stage for total eradication 184 years later" },
        { id: "f103", label: "Antibiotics and vaccines together gave humanity tools to eliminate diseases" },
        { id: "f105", label: "Smallpox\u2019s eradication raised hopes that HIV could be conquered too" },
    ],
    f105: [
        { id: "f104", label: "After eradicating smallpox, the world thought plagues were over \u2014 then HIV emerged" },
        { id: "f106", label: "Lessons from HIV\u2019s slow response shaped the COVID-19 response" },
    ],
    f106: [
        { id: "f105", label: "HIV showed the cost of delayed response; COVID tested if we\u2019d learned" },
        { id: "f102", label: "COVID-19 echoed the Spanish Flu \u2014 a century later, similar patterns" },
        { id: "f100", label: "mRNA vaccines fulfilled Jenner\u2019s vision at unprecedented speed" },
    ],
    // Cross-connections: append to existing events
    f22: [
        { id: "f97", label: "The Plague of Justinian was the deadlier successor to the Antonine Plague" },
    ],
    f30: [
        { id: "f99", label: "The Black Death returned as London\u2019s Great Plague three centuries later" },
    ],
    f33: [
        { id: "f98", label: "European arrival in the Americas unleashed devastating epidemics" },
    ],
    f64: [
        { id: "f102", label: "WWI troop movements and censorship helped spread the Spanish Flu" },
    ],
};

for (const [eventId, connections] of Object.entries(LEVEL2_PLAGUES_CONNECTIONS)) {
    if (EVENT_CONNECTIONS[eventId]) {
        EVENT_CONNECTIONS[eventId].push(...connections);
    } else {
        EVENT_CONNECTIONS[eventId] = connections;
    }
}

// --- Level 2: Kingdoms of Africa chapter connections ---
const LEVEL2_AFRICA_CONNECTIONS = {
    f107: [
        { id: "f108", label: "As Kush declined, Aksum rose to dominate the Horn of Africa" },
        { id: "f8", label: "Kush inherited and rivaled Egyptian civilization" },
    ],
    f108: [
        { id: "f107", label: "Aksum rose as Kush\u2019s power faded in the upper Nile" },
        { id: "f109", label: "Trans-Saharan trade routes connected East and West Africa" },
        { id: "f19", label: "Aksum adopted Christianity, joining Rome\u2019s religious revolution" },
    ],
    f109: [
        { id: "f108", label: "Trade networks linked Ghana to Aksum across the continent" },
        { id: "f110", label: "Mali absorbed Ghana\u2019s territory and trade networks" },
    ],
    f110: [
        { id: "f109", label: "Mali conquered Ghana and inherited its gold trade" },
        { id: "f112", label: "Songhai conquered Mali and inherited Timbuktu" },
        { id: "f118", label: "Mansa Musa\u2019s pilgrimage connected Mali to the Islamic world\u2019s golden age" },
    ],
    f111: [
        { id: "f113", label: "Great Zimbabwe and Benin were parallel stone and bronze civilizations" },
        { id: "f109", label: "Both Ghana and Zimbabwe grew wealthy from controlling gold trade" },
    ],
    f112: [
        { id: "f110", label: "Songhai built on Mali\u2019s foundations and surpassed it" },
        { id: "f113", label: "Contemporary West African kingdoms with distinct art traditions" },
        { id: "f118", label: "Timbuktu\u2019s scholars connected to the broader Islamic intellectual world" },
    ],
    f113: [
        { id: "f111", label: "Benin and Zimbabwe represent Africa\u2019s parallel artistic achievements" },
        { id: "f112", label: "Benin and Songhai were contemporary West African powers" },
        { id: "f125", label: "African masks directly inspired Picasso\u2019s Cubist revolution" },
    ],
    f114: [
        { id: "f115", label: "African military resistance to European encroachment" },
        { id: "f49", label: "The Zulu wars coincided with Europe\u2019s Scramble for Africa" },
    ],
    f115: [
        { id: "f114", label: "Ethiopia\u2019s victory continued Africa\u2019s tradition of military resistance" },
        { id: "f116", label: "Adwa proved African sovereignty was possible and inspired independence movements" },
        { id: "f49", label: "Ethiopia was the great exception to the Scramble for Africa" },
    ],
    f116: [
        { id: "f115", label: "Adwa\u2019s legacy inspired the independence generation" },
        { id: "f56", label: "Part of the broader global decolonization wave" },
        { id: "f83", label: "South Africa was the last holdout of colonial-era racial rule" },
    ],
    // Cross-connections: append to existing events
    f8: [
        { id: "f107", label: "Egyptian civilization influenced and was rivaled by Kush to the south" },
    ],
    f49: [
        { id: "f115", label: "Ethiopia alone defeated European colonizers at Adwa" },
    ],
    f56: [
        { id: "f116", label: "African independence was decolonization\u2019s largest chapter" },
    ],
};

for (const [eventId, connections] of Object.entries(LEVEL2_AFRICA_CONNECTIONS)) {
    if (EVENT_CONNECTIONS[eventId]) {
        EVENT_CONNECTIONS[eventId].push(...connections);
    } else {
        EVENT_CONNECTIONS[eventId] = connections;
    }
}

// --- Level 2: Art That Changed the World chapter connections ---
const LEVEL2_ART_CONNECTIONS = {
    f117: [
        { id: "f119", label: "Homer inspired Renaissance humanism and the return to classical ideals" },
        { id: "f120", label: "Shakespeare drew heavily on classical storytelling traditions" },
    ],
    f118: [
        { id: "f119", label: "Islamic preservation of classical texts fueled the Renaissance" },
        { id: "f110", label: "The Islamic Golden Age connected to Mali\u2019s centers of learning" },
        { id: "f26", label: "The Golden Age built on the foundations of early Islamic civilization" },
    ],
    f119: [
        { id: "f117", label: "Renaissance artists rediscovered Homer and classical Greek ideals" },
        { id: "f118", label: "Islamic scholars preserved the classical texts that inspired the Renaissance" },
        { id: "f122", label: "Impressionists rebelled against the Renaissance rules of perspective" },
        { id: "f34", label: "The Renaissance coincided with the era of the Black Death\u2019s aftermath" },
    ],
    f120: [
        { id: "f117", label: "Shakespeare\u2019s storytelling descended from Homer\u2019s epic tradition" },
        { id: "f124", label: "Theater\u2019s storytelling tradition evolved into cinema" },
        { id: "f119", label: "Shakespeare was a contemporary of the late Renaissance masters" },
    ],
    f121: [
        { id: "f123", label: "Romantic individualism paved the way for jazz\u2019s personal expression" },
        { id: "f47", label: "Beethoven\u2019s revolution in music paralleled the French Revolution in politics" },
    ],
    f122: [
        { id: "f119", label: "Impressionists rejected 400 years of Renaissance perspective rules" },
        { id: "f125", label: "Picasso pushed past Impressionism into total abstraction" },
    ],
    f123: [
        { id: "f121", label: "Jazz extended Romanticism\u2019s emphasis on individual expression" },
        { id: "f124", label: "Jazz soundtracks defined early cinema; Harlem fed Hollywood" },
        { id: "f82", label: "The Harlem Renaissance laid cultural groundwork for the Civil Rights Movement" },
    ],
    f124: [
        { id: "f120", label: "Cinema inherited theater\u2019s storytelling craft" },
        { id: "f123", label: "Jazz and Harlem Renaissance culture fed Hollywood\u2019s golden age" },
        { id: "f126", label: "Cinema was democratized by digital tools and streaming" },
    ],
    f125: [
        { id: "f122", label: "Picasso built on and then shattered Impressionist innovations" },
        { id: "f113", label: "African masks directly inspired Picasso\u2019s breakthrough work" },
        { id: "f126", label: "Modern art\u2019s \u2018anyone can create\u2019 philosophy meets digital tools" },
    ],
    f126: [
        { id: "f124", label: "Digital tools democratized the filmmaking cinema invented" },
        { id: "f125", label: "Modern art\u2019s democratizing impulse reached its logical conclusion" },
        { id: "f58", label: "The Digital Revolution provided the infrastructure for creative democratization" },
    ],
    // Cross-connections: append to existing events
    f34: [
        { id: "f119", label: "The aftermath of the Black Death helped fuel the Renaissance\u2019s creative explosion" },
    ],
    f47: [
        { id: "f121", label: "Beethoven\u2019s musical revolution paralleled the political revolutions of his era" },
    ],
    f82: [
        { id: "f123", label: "The Harlem Renaissance\u2019s cultural pride laid groundwork for Civil Rights" },
    ],
};

for (const [eventId, connections] of Object.entries(LEVEL2_ART_CONNECTIONS)) {
    if (EVENT_CONNECTIONS[eventId]) {
        EVENT_CONNECTIONS[eventId].push(...connections);
    } else {
        EVENT_CONNECTIONS[eventId] = connections;
    }
}

// --- Level 2: Science That Changed Everything connections ---
const LEVEL2_SCIENCE_CONNECTIONS = {
    f127: [
        { id: "f128", label: "Greek rational inquiry inspired Euclid\u2019s axiomatic method" },
        { id: "f129", label: "Hippocratic observation influenced Archimedes\u2019 empirical approach" },
    ],
    f128: [
        { id: "f127", label: "Built on the Greek tradition of rational inquiry Hippocrates pioneered" },
        { id: "f129", label: "Archimedes extended Euclid\u2019s geometry into engineering and physics" },
        { id: "f26", label: "Islamic scholars preserved and extended Euclid\u2019s Elements" },
    ],
    f129: [
        { id: "f128", label: "Built directly on Euclid\u2019s geometric foundations" },
        { id: "f131", label: "Newton\u2019s calculus completed what Archimedes began with infinitesimals" },
    ],
    f130: [
        { id: "f38", label: "Galileo was a central figure in the Scientific Revolution" },
        { id: "f131", label: "Galileo\u2019s observations provided the data Newton\u2019s laws explained" },
    ],
    f131: [
        { id: "f130", label: "Built on Galileo\u2019s observations and Kepler\u2019s laws" },
        { id: "f129", label: "Calculus fulfilled Archimedes\u2019 early work with infinitesimals" },
        { id: "f38", label: "The Principia was the culmination of the Scientific Revolution" },
        { id: "f135", label: "Newton\u2019s laws reigned supreme until Einstein rewrote them" },
    ],
    f132: [
        { id: "f43", label: "Lavoisier was guillotined during the French Revolution he witnessed" },
        { id: "f134", label: "Modern chemistry enabled Curie\u2019s work on radioactive elements" },
    ],
    f133: [
        { id: "f136", label: "DNA confirmed Darwin\u2019s theory by revealing the mechanism of heredity" },
    ],
    f134: [
        { id: "f132", label: "Chemistry\u2019s foundations enabled research into radioactive elements" },
        { id: "f135", label: "Radioactivity research fed into the nuclear physics Einstein theorized" },
    ],
    f135: [
        { id: "f131", label: "Einstein corrected Newton\u2019s laws after two centuries of dominance" },
        { id: "f134", label: "Curie\u2019s radioactivity work opened the atomic world Einstein theorized about" },
        { id: "f137", label: "Relativity and quantum mechanics led to the Standard Model and the Higgs" },
        { id: "f53", label: "E=mc\u00B2 made the atomic bomb possible" },
    ],
    f136: [
        { id: "f133", label: "DNA provided the physical mechanism Darwin\u2019s natural selection needed" },
    ],
    f137: [
        { id: "f135", label: "The Standard Model combined relativity and quantum mechanics" },
    ],
    // Cross-connections: append to existing events
    f26: [
        { id: "f128", label: "Islamic scholars translated and extended Euclid\u2019s geometry" },
    ],
    f38: [
        { id: "f130", label: "Galileo\u2019s telescope observations were a turning point in the Scientific Revolution" },
        { id: "f131", label: "Newton\u2019s Principia was the Scientific Revolution\u2019s crowning achievement" },
    ],
    f43: [
        { id: "f132", label: "The Revolution executed Lavoisier, France\u2019s greatest scientist" },
    ],
};

for (const [eventId, connections] of Object.entries(LEVEL2_SCIENCE_CONNECTIONS)) {
    if (EVENT_CONNECTIONS[eventId]) {
        EVENT_CONNECTIONS[eventId].push(...connections);
    } else {
        EVENT_CONNECTIONS[eventId] = connections;
    }
}

// --- Level 2: Money & Trade chapter connections ---
const LEVEL2_TRADE_CONNECTIONS = {
    f147: [
        { id: "f148", label: "Standardized money made long-distance trade like the Silk Road feasible" },
        { id: "f150", label: "Coins were the first step in money\u2019s evolution toward paper currency" },
    ],
    f148: [
        { id: "f147", label: "Coins made trade across the Silk Road practical" },
        { id: "f149", label: "Overland Silk Road routes inspired the search for maritime alternatives" },
        { id: "f29", label: "The Mongol Empire later unified and protected Silk Road trade" },
    ],
    f149: [
        { id: "f148", label: "Maritime routes complemented overland Silk Road trade" },
        { id: "f110", label: "Great Zimbabwe\u2019s gold wealth came from Indian Ocean trade" },
        { id: "f150", label: "Chinese trade wealth across the Indian Ocean drove financial innovation back home" },
    ],
    f150: [
        { id: "f147", label: "Paper money evolved from the same need that created coins: easier trade" },
        { id: "f152", label: "Chinese monetary innovation foreshadowed European banking" },
    ],
    f151: [
        { id: "f153", label: "Hanseatic merchant confederation modeled collective commercial power for later companies" },
        { id: "f152", label: "Northern merchant cities and Italian banks competed to dominate European trade" },
    ],
    f152: [
        { id: "f34", label: "Medici wealth directly funded the Italian Renaissance" },
        { id: "f151", label: "Italian banking and Northern merchant leagues were rivals for European commercial dominance" },
        { id: "f153", label: "Italian banking innovations were adopted by Dutch trading companies" },
    ],
    f153: [
        { id: "f152", label: "Built on Italian financial innovations like shares and branch banking" },
        { id: "f33", label: "Portuguese and Spanish voyages opened the sea routes the VOC exploited" },
        { id: "f39", label: "Colonial trading companies fueled the Atlantic slave trade" },
        { id: "f154", label: "Stock market speculation pioneered by the VOC led to the first bubbles" },
    ],
    f154: [
        { id: "f153", label: "The VOC\u2019s stock market created the conditions for speculative mania" },
        { id: "f52", label: "The South Sea Bubble foreshadowed the Great Depression\u2019s speculative excess" },
        { id: "f155", label: "Recurring financial crashes eventually demanded international regulation" },
    ],
    f155: [
        { id: "f52", label: "The Great Depression proved unregulated markets could destroy economies" },
        { id: "f53", label: "World War II\u2019s destruction created urgency for a new financial order" },
        { id: "f156", label: "Bretton Woods institutions evolved into the WTO and modern global trade" },
    ],
    f156: [
        { id: "f155", label: "Built on the post-war financial institutions created at Bretton Woods" },
        { id: "f58", label: "The internet enabled the borderless commerce globalization depends on" },
    ],
    // Cross-connections: append to existing events
    f9: [
        { id: "f147", label: "Writing was originally a bookkeeping tool; coins formalized what scribes tracked" },
    ],
    f15: [
        { id: "f148", label: "Alexander\u2019s conquests opened East-West contacts that became the Silk Road" },
    ],
    f29: [
        { id: "f148", label: "Mongol peace protected Silk Road merchants and boosted transcontinental trade" },
    ],
    f34: [
        { id: "f152", label: "The Renaissance was bankrolled by Medici money" },
    ],
};

for (const [eventId, connections] of Object.entries(LEVEL2_TRADE_CONNECTIONS)) {
    if (EVENT_CONNECTIONS[eventId]) {
        EVENT_CONNECTIONS[eventId].push(...connections);
    } else {
        EVENT_CONNECTIONS[eventId] = connections;
    }
}

// ─── Level 2: Exploration & Discovery chapter connections ─────────────
const LEVEL2_EXPLORATION_CONNECTIONS = {
    f138: [
        { id: "f139", label: "While Polynesians navigated the Pacific, the Silk Road connected Eurasia by land" },
        { id: "f144", label: "Cook \u2018discovered\u2019 islands Polynesians had settled millennia earlier" },
    ],
    f139: [
        { id: "f25", label: "The Silk Road reached its peak under the Tang Dynasty centuries later" },
        { id: "f140", label: "Ibn Battuta traveled many of the routes the Silk Road had established" },
        { id: "f138", label: "Land routes complemented the maritime routes Polynesians had pioneered" },
    ],
    f140: [
        { id: "f139", label: "Traveled routes that the Silk Road had connected for over a millennium" },
        { id: "f141", label: "Ibn Battuta visited many of the same ports Zheng He\u2019s fleets would later reach" },
        { id: "f29", label: "Witnessed the aftermath of the Mongol Empire across Central Asia" },
        { id: "f30", label: "Encountered the Black Death firsthand during his travels" },
    ],
    f141: [
        { id: "f140", label: "Visited the same Indian Ocean ports Ibn Battuta had described" },
        { id: "f33", label: "China turned inward just decades before Columbus sailed west" },
        { id: "f142", label: "European sailors later dominated the ocean routes Zheng He had explored" },
    ],
    f142: [
        { id: "f33", label: "Da Gama reached India by sea six years after Columbus reached the Americas" },
        { id: "f35", label: "Portuguese route around Africa complemented Magellan\u2019s westward circumnavigation" },
        { id: "f141", label: "Europeans seized control of the Indian Ocean trade Zheng He had navigated peacefully" },
        { id: "f139", label: "The sea route undermined the Silk Road\u2019s overland spice trade" },
    ],
    f143: [
        { id: "f33", label: "Columbus\u2019s arrival opened the way for Spanish conquest" },
        { id: "f35", label: "Magellan\u2019s expedition was part of the same wave of Iberian expansion" },
        { id: "f39", label: "The devastation of Indigenous populations fed the Atlantic slave trade" },
        { id: "f98", label: "Smallpox brought by conquistadors killed up to 90% of the Indigenous population" },
    ],
    f144: [
        { id: "f138", label: "Cook mapped islands that Polynesians had settled thousands of years before" },
        { id: "f145", label: "Cook\u2019s scientific approach to exploration directly inspired Humboldt" },
        { id: "f146", label: "The Beagle voyage followed routes Cook had charted decades earlier" },
    ],
    f145: [
        { id: "f144", label: "Humboldt was inspired by Cook\u2019s scientific exploration model" },
        { id: "f146", label: "Humboldt\u2019s vision of interconnected nature directly inspired Darwin" },
        { id: "f133", label: "Humboldt\u2019s ecological thinking foreshadowed Darwin\u2019s evolutionary theory" },
    ],
    f146: [
        { id: "f145", label: "Darwin built on Humboldt\u2019s vision of nature as an interconnected web" },
        { id: "f133", label: "Darwin\u2019s voyage provided the observations behind the theory of evolution" },
        { id: "f57", label: "Scientific exploration reached its ultimate frontier in the Space Race" },
    ],
    // Cross-connections: append to existing events
    f25: [
        { id: "f139", label: "The Tang Dynasty was the Silk Road\u2019s golden age, but the routes began centuries earlier" },
    ],
    f29: [
        { id: "f140", label: "The Mongol Empire\u2019s peace enabled Ibn Battuta\u2019s vast travels" },
    ],
    f33: [
        { id: "f141", label: "Columbus sailed west while China was abandoning Zheng He\u2019s eastward voyages" },
        { id: "f143", label: "Columbus\u2019s voyages led directly to the Spanish conquest of the Americas" },
    ],
    f35: [
        { id: "f142", label: "Magellan\u2019s circumnavigation proved da Gama\u2019s route was not the only way east" },
    ],
    f57: [
        { id: "f146", label: "The Space Race extended humanity\u2019s exploration from oceans to orbit" },
    ],
};

for (const [eventId, connections] of Object.entries(LEVEL2_EXPLORATION_CONNECTIONS)) {
    if (EVENT_CONNECTIONS[eventId]) {
        EVENT_CONNECTIONS[eventId].push(...connections);
    } else {
        EVENT_CONNECTIONS[eventId] = connections;
    }
}

// Attach connections to each core event
for (const event of CORE_EVENTS) {
    if (EVENT_CONNECTIONS[event.id]) {
        event.relatedEvents = EVENT_CONNECTIONS[event.id];
    }
}

// ─── Importance levels ────────────────────────────────────────────────────────
// 5 tiers: fundamental → major → notable → minor → anecdotal
// Applied via map to keep event objects clean.
const IMPORTANCE_MAP = {
    // ── Fundamental ── civilization-defining, reshapes human history
    f1: 'fundamental', f2: 'fundamental', f3: 'fundamental', f4: 'fundamental',
    f5: 'fundamental', f6: 'fundamental', f9: 'fundamental', f19: 'fundamental',
    f21: 'fundamental', f24: 'fundamental', f30: 'fundamental', f32: 'fundamental',
    f33: 'fundamental', f36: 'fundamental', f38: 'fundamental', f39: 'fundamental',
    f40: 'fundamental', f43: 'fundamental', f46: 'fundamental', f50: 'fundamental',
    f53: 'fundamental', f55: 'fundamental', f58: 'fundamental', f64: 'fundamental',
    f100: 'fundamental',
    // ── Major ── highly significant, wide and lasting impact
    f7: 'major', f8: 'major', f10: 'major', f13: 'major', f14: 'major',
    f15: 'major', f16: 'major', f17: 'major', f18: 'major', f20: 'major',
    f22: 'major', f25: 'major', f26: 'major', f27: 'major', f29: 'major',
    f31: 'major', f34: 'major', f37: 'major', f41: 'major', f42: 'major',
    f44: 'major', f48: 'major', f49: 'major', f51: 'major', f52: 'major',
    f54: 'major', f56: 'major', f57: 'major', f59: 'major',
    f61: 'major', f62: 'major', f63: 'major', f65: 'major', f66: 'major',
    f70: 'major', f72: 'major', f76: 'major', f77: 'major', f78: 'major',
    f80: 'major', f81: 'major', f82: 'major', f83: 'major', f86: 'major',
    f88: 'major', f89: 'major', f90: 'major', f92: 'major', f94: 'major',
    f95: 'major', f98: 'major', f102: 'major', f103: 'major', f104: 'major',
    f105: 'major', f110: 'major', f116: 'major', f117: 'major', f118: 'major',
    f128: 'major', f131: 'major', f133: 'major', f135: 'major', f136: 'major',
    f147: 'major', f148: 'major', f149: 'major', f153: 'major', f155: 'major',
    f138: 'major', f139: 'major', f141: 'major', f142: 'major', f143: 'major',
    f146: 'major',
    // ── Notable ── historically significant; everything else defaults here
};

for (const event of CORE_EVENTS) {
    event.importance = IMPORTANCE_MAP[event.id] || 'notable';
}

export const ALL_EVENTS = [
    ...CORE_EVENTS,
    ...DAILY_QUIZ_EVENTS.map(e => ({ ...e, importance: e.importance || 'minor' })),
];

export const CORE_EVENT_COUNT = CORE_EVENTS.length; // 156 (60 Level 1 + 96 Level 2)

/** Level 1 events are f1–f60; Level 2 events are f61+. */
export function isLevel2Event(event) {
    if (!event?.id) return false;
    const num = parseInt(event.id.replace('f', ''), 10);
    return num > 60;
}

export function isDiHEvent(event) {
    return event?.source === 'daily';
}

export function getEventById(id) {
    return ALL_EVENTS.find(e => e.id === id);
}

export function getEventsByIds(ids) {
    return ids.map(id => ALL_EVENTS.find(e => e.id === id)).filter(Boolean);
}

export { EVENT_CONNECTIONS };

export function getRelatedEvents(eventId, seenEventIds) {
    const event = getEventById(eventId);
    if (!event?.relatedEvents) return [];
    return event.relatedEvents
        .map(rel => {
            const target = getEventById(rel.id);
            if (!target) return null;
            if (seenEventIds && !seenEventIds.has(rel.id)) return null;
            return { ...target, connectionLabel: rel.label };
        })
        .filter(Boolean);
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

export const IMPORTANCE_CONFIG = {
    fundamental: { label: "Fundamental", color: "#B91C1C", bg: "rgba(185, 28, 28, 0.09)"  },
    major:       { label: "Major",       color: "#B45309", bg: "rgba(180, 83, 9, 0.09)"   },
    notable:     { label: "Notable",     color: "#2D7B6E", bg: "rgba(45, 123, 110, 0.09)" },
    minor:       { label: "Minor",       color: "#6B7BA4", bg: "rgba(107, 123, 164, 0.09)"},
    anecdotal:   { label: "Anecdotal",   color: "#94A3B8", bg: "rgba(148, 163, 184, 0.09)"},
};

export const IMPORTANCE_ORDER = ['fundamental', 'major', 'notable', 'minor', 'anecdotal'];

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
