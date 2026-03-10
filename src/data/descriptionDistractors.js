// Hand-crafted, thematically plausible distractors for description quiz questions.
// Each event maps to:
//   hardCorrect — a non-obvious true statement (used as correct answer at difficulty 3)
//   distractors — array of { text, d } where d = difficulty tier (1 = easy, 2 = hard, 3 = very subtle)
// The quiz picks 3 distractors; difficulty controls which tier is preferred.

export const DESCRIPTION_DISTRACTORS = {
    f1: {
        hardCorrect: "Early ancestors slowly developed upright walking and smaller canine teeth over millions of years.",
        distractors: [
            { text: "A sudden genetic mutation gave early primates the ability to walk upright.", d: 1 },
            { text: "Early humans migrated out of Africa to adapt to new environments.", d: 1 },
            { text: "Brain size doubled immediately after separating from other great apes.", d: 2 },
            { text: "Tool use was the main evolutionary pressure that split human ancestors from other primates.", d: 2 },
            { text: "The divergence was rapid and produced the first stone tool users within a few thousand years.", d: 3 },
        ]
    },
    f2: {
        hardCorrect: "Fire was first preserved from natural sources like lightning strikes, not created from scratch.",
        distractors: [
            { text: "Early humans invented fire by striking flint stones together.", d: 1 },
            { text: "Cooking was developed primarily to kill parasites in raw meat.", d: 1 },
            { text: "Fire allowed humans to settle in caves permanently, creating the first communities.", d: 2 },
            { text: "Cooking reduced the size of human jaws but did not affect brain development.", d: 2 },
            { text: "Fire-making was discovered simultaneously across multiple continents by different species.", d: 3 },
        ]
    },
    f3: {
        hardCorrect: "The leap from keeping fire to making it at will using tools like flint was the key technological advance.",
        distractors: [
            { text: "Homo sapiens first appeared in Europe and spread to Africa.", d: 1 },
            { text: "Our species emerged fully equipped with spoken language from the start.", d: 1 },
            { text: "Homo sapiens evolved independently in several regions rather than emerging first in Africa.", d: 2 },
            { text: "Homo sapiens initially coexisted peacefully with all other human species.", d: 2 },
            { text: "Climate adaptation, not tool use, was the defining advantage of early Homo sapiens.", d: 3 },
        ]
    },
    f4: {
        hardCorrect: "Cave paintings and ochre use during this period reflect an explosion of abstract thinking and symbolic expression.",
        distractors: [
            { text: "Writing systems were first developed during this period.", d: 1 },
            { text: "Agriculture began as humans developed the cognitive ability to plan seasons.", d: 1 },
            { text: "Humans developed the ability to use tools for the first time during this period.", d: 2 },
            { text: "Spoken language allowed the formation of the first permanent settlements.", d: 2 },
            { text: "Abstract thought emerged suddenly through a single genetic mutation around 50,000 years ago.", d: 3 },
        ]
    },
    f5: {
        hardCorrect: "Small groups crossed via the Arabian Peninsula, and later reached the Americas through land bridges exposed by Ice Age sea levels.",
        distractors: [
            { text: "Humans spread from Europe to the rest of the world.", d: 1 },
            { text: "Migration was driven by overpopulation in Africa.", d: 1 },
            { text: "Humans reached the Americas by boat across the Atlantic Ocean.", d: 2 },
            { text: "All non-African populations descend from a single migration wave.", d: 2 },
            { text: "Homo sapiens peacefully absorbed other human species through interbreeding rather than replacing them.", d: 3 },
        ]
    },
    f6: {
        hardCorrect: "Food surpluses from farming enabled population growth and the rise of specialized classes like priests, soldiers, and rulers.",
        distractors: [
            { text: "Humans domesticated animals first, then learned to grow crops centuries later.", d: 1 },
            { text: "Farming began because hunter-gatherer food sources were completely exhausted.", d: 1 },
            { text: "Climate change forced all human communities to adopt farming simultaneously.", d: 2 },
            { text: "Settled communities formed first, then discovered agriculture to feed their growing population.", d: 2 },
            { text: "Early farming villages emerged as a gradual extension of seasonal hunting camps rather than a distinct lifestyle shift.", d: 3 },
        ]
    },
    f7: {
        hardCorrect: "Large-scale irrigation management required sophisticated record-keeping, giving rise to the earliest bureaucratic systems.",
        distractors: [
            { text: "Cities formed primarily as military fortifications against nomadic raiders.", d: 1 },
            { text: "Long-distance trade networks were the primary reason cities first developed.", d: 1 },
            { text: "Religious temples served as the sole administrative centers, managing all aspects of urban life.", d: 2 },
            { text: "Military conquest by a single ruler unified scattered villages into the first cities.", d: 2 },
            { text: "Urban centers developed around natural harbors to facilitate maritime commerce across the Persian Gulf.", d: 3 },
        ]
    },
    f8: {
        hardCorrect: "A centralized bureaucracy enabled massive construction projects like the Pyramids, creating a state that lasted nearly 3,000 years.",
        distractors: [
            { text: "A priestly class united the two kingdoms through religious authority and spiritual conquest.", d: 1 },
            { text: "Egypt unified after building the Great Dam to control Nile flooding.", d: 1 },
            { text: "Military generals from Lower Egypt conquered the south and installed themselves as the first pharaohs.", d: 2 },
            { text: "Unification was a gradual, peaceful merger driven by economic interdependence between north and south.", d: 2 },
            { text: "The pharaoh's divine status was a later development that emerged centuries after the initial political unification.", d: 3 },
        ]
    },
    f9: {
        hardCorrect: "Originally used to track debts and taxes, writing ended the era of pre-history by enabling precise information transmission across generations.",
        distractors: [
            { text: "Writing was invented by priests to record religious hymns and temple rituals.", d: 1 },
            { text: "Egyptian hieroglyphs were the world's first true writing system.", d: 1 },
            { text: "Writing emerged from artistic cave paintings that gradually became more abstract and symbolic.", d: 2 },
            { text: "The earliest writing recorded royal victories and genealogies to legitimize rulers.", d: 2 },
            { text: "Clay tokens used for trade slowly evolved into cuneiform only after centuries as purely decorative seals.", d: 3 },
        ]
    },
    f10: {
        hardCorrect: "The code shifted justice from the arbitrary whim of kings to a standardized written legal code covering family, property, and criminal offenses.",
        distractors: [
            { text: "Hammurabi established the first democratic assembly to create laws by popular vote.", d: 1 },
            { text: "The code primarily regulated trade routes and commercial agreements between city-states.", d: 1 },
            { text: "The laws were created jointly by priests and merchants to protect temple economies.", d: 2 },
            { text: "Hammurabi's code was the very first attempt at any form of legal regulation in human history.", d: 2 },
            { text: "The principle of 'an eye for an eye' meant all citizens were punished equally regardless of social class.", d: 3 },
        ]
    },
    f11: {
        hardCorrect: "Migrations, droughts, and revolts caused a rapid systemic failure that ended the Hittite and Mycenaean civilizations and led to the loss of literacy for centuries.",
        distractors: [
            { text: "A massive volcanic eruption destroyed all major Bronze Age cities simultaneously.", d: 1 },
            { text: "The Roman Empire conquered the Mediterranean, ending the Bronze Age kingdoms.", d: 1 },
            { text: "The Sea Peoples systematically conquered and replaced every ruling dynasty in the eastern Mediterranean.", d: 2 },
            { text: "A prolonged drought was the sole cause, forcing all urban populations to abandon their cities.", d: 2 },
            { text: "The collapse primarily affected coastal trading cities, while inland agricultural communities continued largely unaffected.", d: 3 },
        ]
    },
    f12: {
        hardCorrect: "The games established a sacred truce that solidified a shared Greek identity through noble athletic competition, lasting until suppression in 393 CE.",
        distractors: [
            { text: "The games determined which city-state would rule all of Greece for the next four years.", d: 1 },
            { text: "Athletes from across the Mediterranean, including Egypt and Persia, competed at Olympia.", d: 1 },
            { text: "The games celebrated military victories and crowned successful generals as champions.", d: 2 },
            { text: "Olympic victors received land grants and permanent political authority in their home cities.", d: 2 },
            { text: "Winners were considered semi-divine and could intercede with the gods on behalf of their city-state.", d: 3 },
        ]
    },
    f13: {
        hardCorrect: "A mixed constitution with elected consuls and a Senate was designed to prevent any single person from seizing permanent power.",
        distractors: [
            { text: "The Roman people voted to abolish the monarchy through a peaceful referendum.", d: 1 },
            { text: "A military general overthrew the king and declared himself the first consul.", d: 1 },
            { text: "The republic was modeled on Greek democracy with direct citizen assemblies making all decisions.", d: 2 },
            { text: "The republic gave all adult male citizens equal voting power regardless of wealth or class.", d: 2 },
            { text: "Consuls held power for life but were checked by a Senate that could override their decisions.", d: 3 },
        ]
    },
    f14: {
        hardCorrect: "Greek philosophy, the Hebrew prophetic tradition, Buddhism, and Confucianism emerged independently across different civilizations during the same era.",
        distractors: [
            { text: "A single philosopher traveled the ancient world spreading ethical ideas through trade routes.", d: 1 },
            { text: "These philosophies emerged as direct responses to military threats from the Persian Empire.", d: 1 },
            { text: "Long-distance trade networks allowed Indian, Chinese, and Greek thinkers to develop ideas collaboratively.", d: 2 },
            { text: "Judaism and Zoroastrianism were the primary philosophical traditions of this period.", d: 2 },
            { text: "These philosophies all rejected earlier polytheistic traditions and promoted monotheism as the highest form of belief.", d: 3 },
        ]
    },
    f15: {
        hardCorrect: "His death fragmented the empire into rival successor kingdoms, but created a lasting Hellenistic trade zone spanning the eastern Mediterranean.",
        distractors: [
            { text: "Alexander unified the Greek city-states through diplomacy before turning east toward Persia.", d: 1 },
            { text: "His empire remained intact for centuries under a dynasty of successors he personally appointed.", d: 1 },
            { text: "He settled permanently in Alexandria, ruling his empire from a single administrative capital.", d: 2 },
            { text: "The Greek language alone was enough to unify the diverse populations of Asia and North Africa.", d: 2 },
            { text: "Alexander's empire collapsed because his generals lacked the skill to maintain his administrative systems.", d: 3 },
        ]
    },
    f16: {
        hardCorrect: "By standardizing script and currency across conquered territories, the Qin forged a cohesive national identity from warring kingdoms.",
        distractors: [
            { text: "China was unified through voluntary alliances and trade agreements between rival states.", d: 1 },
            { text: "Confucianism served as the philosophical foundation that united the warring kingdoms.", d: 1 },
            { text: "A network of roads and a unified legal code were the primary tools of Qin unification.", d: 2 },
            { text: "The Great Wall served as the central mechanism for binding the conquered states together.", d: 2 },
            { text: "The Qin preserved each kingdom's local customs while imposing only military and tax obligations.", d: 3 },
        ]
    },
    f17: {
        hardCorrect: "Senators who feared his power as 'Dictator for Life' assassinated him, triggering the civil wars that ended the Republic.",
        distractors: [
            { text: "Caesar's own generals conspired against him after he refused to share military command.", d: 1 },
            { text: "The Roman Empire was immediately established under Caesar's chosen heir after his death.", d: 1 },
            { text: "He was killed over plans to relocate the capital from Rome to Alexandria in Egypt.", d: 2 },
            { text: "The conspiracy included foreign leaders who feared Caesar's plans to conquer their territories.", d: 2 },
            { text: "Caesar was assassinated because he attempted to redistribute aristocratic land to common soldiers.", d: 3 },
        ]
    },
    f18: {
        hardCorrect: "His rule initiated the Pax Romana — 200 years of stability and economic growth across the Mediterranean.",
        distractors: [
            { text: "Augustus pursued aggressive territorial expansion deep into Asia and sub-Saharan Africa.", d: 1 },
            { text: "He instituted a democratic system with elected provincial representatives across the empire.", d: 1 },
            { text: "Augustus preserved the Senate's genuine governing authority while limiting only the military.", d: 2 },
            { text: "The Pax Romana was enforced primarily through allied client kingdoms rather than direct Roman control.", d: 2 },
            { text: "Augustus maintained peace by permanently stationing legions along every border rather than through political reform.", d: 3 },
        ]
    },
    f19: {
        hardCorrect: "His message of spiritual salvation challenged religious authorities and Roman stability, and his followers claimed he rose from the dead.",
        distractors: [
            { text: "Jesus was a political insurgent who organized armed rebellions against Roman occupation.", d: 1 },
            { text: "His own writings formed the original Bible, which was completed during his lifetime.", d: 1 },
            { text: "His teachings directly attacked Roman social hierarchies and called for the abolition of slavery.", d: 2 },
            { text: "Rome executed him specifically for declaring himself the rightful political king of Israel.", d: 2 },
            { text: "Early Christianity spread primarily through wealthy Roman converts who used trade networks to carry the message.", d: 3 },
        ]
    },
    f20: {
        hardCorrect: "Moving the capital to Constantinople ensured the survival of Roman law and Christian faith in the East for another millennium.",
        distractors: [
            { text: "Constantine made Christianity the sole permitted religion and banned all pagan worship.", d: 1 },
            { text: "He rebuilt Rome itself as a grand Christian capital filled with churches and cathedrals.", d: 1 },
            { text: "Constantine compelled all Roman subjects to convert to Christianity under threat of punishment.", d: 2 },
            { text: "The Edict of Milan established the Pope as the supreme authority over both church and state.", d: 2 },
            { text: "Constantinople was built on the ruins of a city Constantine destroyed, not on the ancient Greek colony of Byzantium.", d: 3 },
        ]
    },
    f21: {
        hardCorrect: "Economic decay, political instability, and Germanic invasions ended central authority in the West, while the Eastern Empire survived another 1,000 years.",
        distractors: [
            { text: "A single massive Hun invasion overran Rome and toppled the empire overnight.", d: 1 },
            { text: "The Eastern and Western empires split through peaceful negotiation and mutual agreement.", d: 1 },
            { text: "Internal civil wars alone caused the collapse, with no significant external military pressure.", d: 2 },
            { text: "The Western Empire formally surrendered its territories to Germanic kings in a negotiated treaty.", d: 2 },
            { text: "The Eastern Empire survived mainly because Constantinople's geographic position made it virtually impossible to besiege.", d: 3 },
        ]
    },
    f22: {
        hardCorrect: "The first major bubonic plague outbreak crippled the Byzantine military during their attempted reconquest of the West.",
        distractors: [
            { text: "The plague originated in China and traveled to Constantinople exclusively via the Silk Road.", d: 1 },
            { text: "Constantinople was completely depopulated within a single year of the outbreak.", d: 1 },
            { text: "The plague weakened Western European kingdoms enough to trigger the Viking raids centuries later.", d: 2 },
            { text: "Emperor Justinian himself died of the plague, ending the Byzantine reconquest immediately.", d: 2 },
            { text: "The plague's main long-term effect was accelerating the adoption of Christianity across the Mediterranean.", d: 3 },
        ]
    },
    f23: {
        hardCorrect: "While Europe entered the Middle Ages, the Maya reached their intellectual peak with hieroglyphic writing, the concept of zero, and precise astronomical calendars.",
        distractors: [
            { text: "The Maya built pyramids specifically for sun worship and predicting solar eclipses.", d: 1 },
            { text: "The Maya formed a unified empire through conquest, similar to the Romans.", d: 1 },
            { text: "Maya astronomical knowledge was primarily used for agricultural planning rather than religious ceremonies.", d: 2 },
            { text: "The Maya independently invented an alphabet-based writing system similar to the Greek one.", d: 2 },
            { text: "Maya city-states maintained peaceful relations through a shared religious calendar that prevented warfare during sacred periods.", d: 3 },
        ]
    },
    f24: {
        hardCorrect: "Beginning in Mecca, Muhammad's preaching led to the rapid unification of the Arabian Peninsula and a Caliphate that would stretch from Spain to India.",
        distractors: [
            { text: "Islam began as a reform movement within Christianity, not as a distinct new faith.", d: 1 },
            { text: "Muhammad unified the Arabian tribes primarily through military conquest rather than religious preaching.", d: 1 },
            { text: "Islam spread initially through merchant networks rather than direct preaching and conversion.", d: 2 },
            { text: "The Caliphate was established during Muhammad's lifetime as a formal political institution.", d: 2 },
            { text: "Muhammad's early followers were predominantly wealthy Meccan elites who saw political advantage in the new faith.", d: 3 },
        ]
    },
    f25: {
        hardCorrect: "The Silk Road functioned as a highway of ideas, spreading Buddhism eastward and bringing Middle Eastern inventions across Asia.",
        distractors: [
            { text: "The Tang Dynasty expanded its territory deep into India and Persia through military conquest.", d: 1 },
            { text: "The Silk Road was primarily a single paved road connecting China directly to Rome.", d: 1 },
            { text: "Tang China's prosperity came mainly from maritime trade rather than overland Silk Road routes.", d: 2 },
            { text: "The Tang Dynasty deliberately restricted foreign religions to protect traditional Chinese beliefs.", d: 2 },
            { text: "Silk Road trade declined during the Tang period due to political instability in Central Asia.", d: 3 },
        ]
    },
    f26: {
        hardCorrect: "The House of Wisdom served as an intellectual bridge between the ancient world and the European Renaissance, preserving and advancing classical knowledge.",
        distractors: [
            { text: "Islamic scholars primarily copied Greek texts without making original contributions of their own.", d: 1 },
            { text: "The House of Wisdom was a religious school focused exclusively on Quranic studies.", d: 1 },
            { text: "Algebra was developed independently in India and merely transmitted to Europe through Baghdad.", d: 2 },
            { text: "The Golden Age ended because Islamic authorities banned scientific inquiry as heretical.", d: 2 },
            { text: "European scholars had direct access to Greek and Roman texts throughout the medieval period, making Islamic preservation unnecessary.", d: 3 },
        ]
    },
    f27: {
        hardCorrect: "Crowned 'Emperor of the Romans' by the Pope on Christmas Day 800 CE, he blended Germanic, Roman, and Christian traditions into a new political order.",
        distractors: [
            { text: "Charlemagne launched the first Crusade to reclaim Jerusalem from Muslim control.", d: 1 },
            { text: "His empire was built primarily on naval dominance across the Mediterranean.", d: 1 },
            { text: "He created Europe's first parliament with elected representatives from each kingdom.", d: 2 },
            { text: "Charlemagne unified Europe through religious conversion alone, avoiding military campaigns entirely.", d: 2 },
            { text: "His empire remained unified for centuries after his death under a stable line of successors.", d: 3 },
        ]
    },
    f28: {
        hardCorrect: "Using superior longships, Norse explorers raided and settled across Europe, opened trade routes through Russia to Byzantium, and reached North America.",
        distractors: [
            { text: "Vikings originated from Germanic tribes in central Europe, not Scandinavia.", d: 1 },
            { text: "Viking expansion was purely destructive raiding with no permanent settlements or trade.", d: 1 },
            { text: "Vikings established large permanent trading colonies in North America that lasted for centuries.", d: 2 },
            { text: "Their longships were designed for open ocean voyages but were too large to navigate rivers.", d: 2 },
            { text: "Viking influence on England and France was limited to coastal raids and never affected governance or culture.", d: 3 },
        ]
    },
    f29: {
        hardCorrect: "The Pax Mongolica turned the Silk Road into a superhighway for trade, moving gunpowder and paper westward but also plague-carrying rodents.",
        distractors: [
            { text: "The Mongol Empire was built primarily through diplomatic alliances rather than military conquest.", d: 1 },
            { text: "The Mongols were primarily a naval power that controlled maritime trade across the Indian Ocean.", d: 1 },
            { text: "The Mongol Empire remained stable and unified for centuries under Genghis Khan's direct descendants.", d: 2 },
            { text: "The Mongol postal relay system was their greatest contribution, while Silk Road trade actually declined.", d: 2 },
            { text: "Mongol rulers adopted Chinese administrative systems from the start, governing through existing bureaucracies.", d: 3 },
        ]
    },
    f30: {
        hardCorrect: "The massive labor scarcity that followed collapsed feudalism and empowered survivors, setting the stage for the Renaissance.",
        distractors: [
            { text: "The plague spread primarily through contaminated drinking water in medieval cities.", d: 1 },
            { text: "The epidemic primarily killed the wealthy, leaving peasants largely unaffected.", d: 1 },
            { text: "Survivors faced prolonged famine as agricultural production never recovered.", d: 2 },
            { text: "The Church strengthened its authority during the crisis by providing the only effective medical care.", d: 2 },
            { text: "The plague killed roughly 10% of Europe's population, causing significant but manageable disruption.", d: 3 },
        ]
    },
    f31: {
        hardCorrect: "Greek scholars fled to Italy bringing ancient texts that accelerated the already-flourishing Renaissance.",
        distractors: [
            { text: "Constantinople fell to Christian crusaders in 1453, not the Ottoman Turks.", d: 1 },
            { text: "The city fell primarily because plague had weakened its garrison beyond recovery.", d: 1 },
            { text: "The siege was won through a naval blockade that starved the city into surrender.", d: 2 },
            { text: "The fall had little cultural impact because most ancient texts had already been lost.", d: 2 },
            { text: "Ottoman Sultan Mehmed II destroyed the city's libraries rather than preserving Byzantine scholarship.", d: 3 },
        ]
    },
    f32: {
        hardCorrect: "Movable type permanently broke the monopoly on knowledge held by the elite and clergy, causing an information explosion.",
        distractors: [
            { text: "Gutenberg invented paper and ink in addition to the printing press.", d: 1 },
            { text: "The press was initially used as a propaganda tool by the Church to control information.", d: 1 },
            { text: "Universities maintained control over book distribution even after the printing press spread.", d: 2 },
            { text: "European literacy rates doubled within a single decade of the press's invention.", d: 2 },
            { text: "Chinese and Korean movable type systems had already achieved mass literacy in Asia before Gutenberg.", d: 3 },
        ]
    },
    f33: {
        hardCorrect: "The Columbian Exchange transferred plants, animals, and diseases between continents, with catastrophic consequences for Indigenous populations.",
        distractors: [
            { text: "Columbus landed on the North American mainland during his first voyage.", d: 1 },
            { text: "Columbus established peaceful, equal trading partnerships with Indigenous peoples.", d: 1 },
            { text: "His primary motivation was to spread Christianity rather than find a trade route to Asia.", d: 2 },
            { text: "European diseases had already reached the Americas through earlier Norse contact.", d: 2 },
            { text: "Columbus realized he had reached a new continent during his first voyage and reported this to Spain.", d: 3 },
        ]
    },
    f34: {
        hardCorrect: "Humanism and classical learning fostered individual inquiry, producing Leonardo da Vinci and Michelangelo while challenging Church authority.",
        distractors: [
            { text: "The Scientific Revolution occurred during the Renaissance as part of the same movement.", d: 1 },
            { text: "The Renaissance began in northern Europe and gradually spread south to Italy.", d: 1 },
            { text: "Classical knowledge was recovered through archaeological excavation of Roman ruins.", d: 2 },
            { text: "The Renaissance was primarily a scientific movement with art as a secondary byproduct.", d: 2 },
            { text: "Renaissance artists rejected religious subjects entirely in favor of secular and classical themes.", d: 3 },
        ]
    },
    f35: {
        hardCorrect: "The expedition revealed the Pacific Ocean was far larger than anyone expected, and only 18 of the original 270 crew survived the journey.",
        distractors: [
            { text: "Magellan personally completed the entire circumnavigation of the globe.", d: 1 },
            { text: "Portugal funded the expedition to expand its existing Asian trade routes.", d: 1 },
            { text: "The voyage confirmed that the Pacific Ocean was a small, easily crossable body of water.", d: 2 },
            { text: "The expedition was primarily a military campaign to establish colonial outposts.", d: 2 },
            { text: "The voyage's main contribution was disproving the flat Earth theory that most Europeans still believed.", d: 3 },
        ]
    },
    f36: {
        hardCorrect: "Luther's challenge to Church corruption shattered religious unity and accelerated mass literacy through individual Bible reading.",
        distractors: [
            { text: "Luther intended from the start to break away from the Catholic Church and found a new religion.", d: 1 },
            { text: "The Reformation was primarily about political independence from the Vatican, not religious beliefs.", d: 1 },
            { text: "All European monarchs quickly embraced Protestantism to seize Church wealth and land.", d: 2 },
            { text: "Luther translated the Bible into German to prevent common people from misinterpreting scripture.", d: 2 },
            { text: "The Catholic Church immediately reformed its practices in response, making the Protestant split unnecessary.", d: 3 },
        ]
    },
    f37: {
        hardCorrect: "Conflicts that began as religious wars evolved into power struggles, ultimately establishing the modern system of sovereign nation-states.",
        distractors: [
            { text: "The war was purely a religious conflict between Catholics and Protestants with no political dimensions.", d: 1 },
            { text: "France and England were the primary combatants throughout the entire war.", d: 1 },
            { text: "The Peace of Westphalia created a unified European government to prevent future religious wars.", d: 2 },
            { text: "The war ended when the Pope brokered a compromise that reunified Western Christianity.", d: 2 },
            { text: "Westphalian sovereignty meant that rulers could no longer interfere in other states' religious affairs, but retained rights over trade and borders.", d: 3 },
        ]
    },
    f38: {
        hardCorrect: "From Copernicus proposing heliocentrism to Newton's Principia, observation and experimentation provided tools for modern medicine and industry.",
        distractors: [
            { text: "Galileo's telescope proved for the first time that the Earth was round, not flat.", d: 1 },
            { text: "The Church actively supported and funded most scientific discoveries of this period.", d: 1 },
            { text: "Newton developed his theories by building directly on Islamic scientific traditions without European predecessors.", d: 2 },
            { text: "The Scientific Revolution was confined to physics and astronomy, with no impact on biology or medicine.", d: 2 },
            { text: "Copernicus's heliocentric model was immediately accepted by the scientific community upon publication.", d: 3 },
        ]
    },
    f39: {
        hardCorrect: "Plantation labor in the Americas generated enormous wealth for European empires and created deep racial hierarchies that persist today.",
        distractors: [
            { text: "The majority of enslaved Africans were transported to North America.", d: 1 },
            { text: "Europeans directly captured enslaved people by raiding African villages.", d: 1 },
            { text: "The slave trade was driven primarily by labor demand in European factories, not American plantations.", d: 2 },
            { text: "African kingdoms that participated in the trade accumulated wealth rivaling European empires.", d: 2 },
            { text: "The slave trade gradually declined on its own due to falling economic returns before abolition laws were passed.", d: 3 },
        ]
    },
    f40: {
        hardCorrect: "Scientific Revolution logic applied to society produced the foundational concepts of individual rights, democracy, and the separation of powers.",
        distractors: [
            { text: "The Enlightenment was a purely French intellectual movement that spread outward to other countries.", d: 1 },
            { text: "Enlightenment thinkers argued for stronger monarchies with more centralized control.", d: 1 },
            { text: "Enlightenment ideas were widely adopted by European monarchs who voluntarily reformed their governments.", d: 2 },
            { text: "The movement focused primarily on scientific discovery rather than political and social philosophy.", d: 2 },
            { text: "Enlightenment thinkers universally agreed on the ideal form of government and the extent of individual rights.", d: 3 },
        ]
    },
    f41: {
        hardCorrect: "Watt's engine efficiently turned heat into rotary motion, removing the limit of muscle power and triggering the shift from agricultural to industrial societies.",
        distractors: [
            { text: "James Watt invented the steam engine from scratch with no prior designs to build on.", d: 1 },
            { text: "The steam engine was first used to generate electricity for lighting.", d: 1 },
            { text: "Watt's innovation was increasing steam pressure rather than improving efficiency of existing engines.", d: 2 },
            { text: "Steam power replaced water wheels immediately and completely across all British industries.", d: 2 },
            { text: "The steam engine's main impact was in mining, with transportation applications coming decades later.", d: 3 },
        ]
    },
    f42: {
        hardCorrect: "The Declaration of Independence (1776) was the first large-scale implementation of Enlightenment ideals, later formalized in the US Constitution.",
        distractors: [
            { text: "The colonists rebelled primarily over religious persecution, not taxation and representation.", d: 1 },
            { text: "France played no significant role in the American victory over Britain.", d: 1 },
            { text: "Britain was willing to negotiate independence but the colonists demanded immediate war.", d: 2 },
            { text: "The revolution created a direct democracy where all citizens voted on every law.", d: 2 },
            { text: "The Constitution immediately granted voting rights to all adult residents regardless of race or gender.", d: 3 },
        ]
    },
    f43: {
        hardCorrect: "Feudal privileges were abolished in August 1789, and the Reign of Terror that followed the king's execution consumed the revolution's own leaders.",
        distractors: [
            { text: "The revolution was led by the military, which overthrew the king in a coup.", d: 1 },
            { text: "France became a stable democracy immediately after the revolution.", d: 1 },
            { text: "The revolution was primarily caused by bread shortages in the countryside.", d: 2 },
            { text: "The Declaration of the Rights of Man applied equally to women and men from the start.", d: 2 },
            { text: "The revolution's violence was limited to the execution of the king, with no broader political purges.", d: 3 },
        ]
    },
    f44: {
        hardCorrect: "His legal code abolished feudal privileges and became the foundation of civil law systems worldwide.",
        distractors: [
            { text: "Napoleon was elected by the French people in a democratic vote.", d: 1 },
            { text: "He established permanent French colonies across all of Europe.", d: 1 },
            { text: "His code primarily focused on criminal justice and military regulations.", d: 2 },
            { text: "Napoleon's main legacy was the redrawing of European borders that lasted for centuries.", d: 2 },
            { text: "The Napoleonic Code preserved many feudal privileges while modernizing only commercial law.", d: 3 },
        ]
    },
    f45: {
        hardCorrect: "Restored monarchies and a balance of power prevented another general European war for roughly a century, though regional wars still occurred.",
        distractors: [
            { text: "The Congress was a democratic assembly where all European peoples were represented.", d: 1 },
            { text: "Napoleon participated in the Congress and negotiated the terms of peace.", d: 1 },
            { text: "The balance of power meant that all nations maintained equally sized armies.", d: 2 },
            { text: "The Congress created a permanent European parliament to resolve future disputes.", d: 2 },
            { text: "The borders drawn at Vienna were based on ethnic and linguistic boundaries to prevent future conflicts.", d: 3 },
        ]
    },
    f46: {
        hardCorrect: "Coal-powered machine manufacturing created the urban middle class, massive city growth, and eventually forced the creation of modern labor laws.",
        distractors: [
            { text: "Electricity powered the first factories during the Industrial Revolution.", d: 1 },
            { text: "The Industrial Revolution began in France and spread to Britain.", d: 1 },
            { text: "Factory owners voluntarily improved working conditions out of moral concern for laborers.", d: 2 },
            { text: "The revolution primarily affected agriculture, with manufacturing changing only later.", d: 2 },
            { text: "Skilled artisans benefited most from industrialization as their expertise became more valuable.", d: 3 },
        ]
    },
    f47: {
        hardCorrect: "Simultaneous pro-democracy revolts across dozens of European states permanently weakened absolute monarchies even though many uprisings were suppressed.",
        distractors: [
            { text: "The revolutions were coordinated by a single international democratic organization.", d: 1 },
            { text: "The revolts succeeded in establishing lasting democracies across Europe.", d: 1 },
            { text: "The uprisings were limited to France and Germany, with the rest of Europe unaffected.", d: 2 },
            { text: "The revolutions were primarily driven by peasant demands for land reform, not democratic ideals.", d: 2 },
            { text: "Monarchies that survived 1848 emerged stronger by adopting the reformers' demands.", d: 3 },
        ]
    },
    f48: {
        hardCorrect: "A century-long movement saw Britain ban the trade in 1807, full abolition in 1833, US emancipation in 1865, and Brazil last in 1888.",
        distractors: [
            { text: "Slavery was abolished worldwide through a single international treaty.", d: 1 },
            { text: "The United States was the first major nation to abolish slavery.", d: 1 },
            { text: "Abolition was driven entirely by economic changes that made slavery unprofitable.", d: 2 },
            { text: "Enslaved people played no active role in the abolition movement.", d: 2 },
            { text: "All formerly enslaved people received land and compensation after abolition.", d: 3 },
        ]
    },
    f49: {
        hardCorrect: "The arbitrary 'Paper Partition' ignored ethnic and cultural boundaries, creating geopolitical challenges that persist today.",
        distractors: [
            { text: "African leaders attended the conference and agreed to the borders drawn.", d: 1 },
            { text: "The conference was primarily about resolving conflicts between existing European colonies.", d: 1 },
            { text: "Borders were drawn along natural geographic features like rivers and mountains.", d: 2 },
            { text: "The partition was driven primarily by the discovery of mineral resources rather than imperial competition.", d: 2 },
            { text: "The conference's borders were temporary and were redrawn within a decade to better reflect African realities.", d: 3 },
        ]
    },
    f50: {
        hardCorrect: "Twin revolutions dismantled the Tsarist autocracy and created the world's first major communist state under the Bolsheviks.",
        distractors: [
            { text: "A single military uprising in Moscow overthrew the Tsar.", d: 1 },
            { text: "Military generals led the revolution against the Tsar's failed war policies.", d: 1 },
            { text: "Russia's growing middle class drove the revolution toward parliamentary democracy.", d: 2 },
            { text: "The Bolsheviks seized power through a popular democratic election.", d: 2 },
            { text: "The revolution succeeded primarily because the army remained loyal to the revolutionary leadership.", d: 3 },
        ]
    },
    f51: {
        hardCorrect: "War guilt and massive reparations created the economic resentment and instability that fueled totalitarianism and eventually WWII.",
        distractors: [
            { text: "The treaty divided Germany into occupation zones controlled by the Allied powers.", d: 1 },
            { text: "Germany willingly accepted the treaty as a fair and reasonable peace settlement.", d: 1 },
            { text: "The reparations were modest and Germany's economy recovered quickly.", d: 2 },
            { text: "The treaty successfully prevented future conflicts by creating a strong international peacekeeping body.", d: 2 },
            { text: "All Central Powers were treated equally harshly, not just Germany.", d: 3 },
        ]
    },
    f52: {
        hardCorrect: "Triggered by the US Stock Market Crash, the crisis forced nations to adopt social safety nets while fueling totalitarian regimes.",
        distractors: [
            { text: "European war debts from WWI caused the Depression, not the US stock market crash.", d: 1 },
            { text: "The Depression primarily affected Europe while the US economy remained relatively stable.", d: 1 },
            { text: "The Depression was confined to the United States and had little impact on European or Asian economies.", d: 2 },
            { text: "The Depression ended naturally through market self-correction without government action.", d: 2 },
            { text: "The crisis strengthened democratic institutions everywhere as citizens rallied behind elected leaders.", d: 3 },
        ]
    },
    f53: {
        hardCorrect: "Germany surrendered in May and Japan followed in September after the atomic bombs, shifting power from European empires to two superpowers.",
        distractors: [
            { text: "Germany and Japan surrendered on the same day, ending the war simultaneously.", d: 1 },
            { text: "The atomic bombs were dropped on military bases, not civilian cities.", d: 1 },
            { text: "The war ended through negotiated peace treaties rather than unconditional surrender.", d: 2 },
            { text: "Britain and France emerged as the dominant postwar superpowers.", d: 2 },
            { text: "The US and USSR jointly administered occupied Japan and shared control of the postwar peace terms.", d: 3 },
        ]
    },
    f54: {
        hardCorrect: "Established after WWII to replace the failed League of Nations, with a stronger mandate for international peace and human rights law.",
        distractors: [
            { text: "The United Nations was created after World War I as the first international peace organization.", d: 1 },
            { text: "All member nations joined with equal voting power and no special privileges.", d: 1 },
            { text: "The UN was given authority to override national sovereignty and enforce its decisions.", d: 2 },
            { text: "The Soviet Union refused to join the UN, limiting it to Western democracies.", d: 2 },
            { text: "The UN's primary function was managing postwar economic reconstruction rather than maintaining peace.", d: 3 },
        ]
    },
    f55: {
        hardCorrect: "Mutually Assured Destruction prevented direct war but drove proxy wars and massive technological leaps in aerospace and computing.",
        distractors: [
            { text: "The US and USSR engaged in direct military battles across Europe throughout the Cold War.", d: 1 },
            { text: "The Cold War was primarily an economic competition with no military dimension.", d: 1 },
            { text: "Nuclear weapons were used multiple times in proxy conflicts during the Cold War.", d: 2 },
            { text: "The Cold War ended because the US achieved decisive military superiority over the USSR.", d: 2 },
            { text: "Both superpowers maintained strict neutrality in developing nations, avoiding any involvement in local conflicts.", d: 3 },
        ]
    },
    f56: {
        hardCorrect: "Dozens of nations gained independence, increasing sovereign states from roughly 50 to nearly 200 and shifting politics toward the Global South.",
        distractors: [
            { text: "European powers voluntarily granted independence to all their colonies at the same time.", d: 1 },
            { text: "Decolonization occurred primarily through military conquest by independence movements.", d: 1 },
            { text: "Newly independent nations immediately achieved political stability and economic growth.", d: 2 },
            { text: "The Cold War had no influence on the decolonization process.", d: 2 },
            { text: "Former colonial borders were redrawn along ethnic and linguistic lines after independence.", d: 3 },
        ]
    },
    f57: {
        hardCorrect: "Competition from Sputnik to Apollo 11 proved humanity could achieve extraterrestrial travel and created the profound Overview Effect.",
        distractors: [
            { text: "The US and Soviet Union collaborated on space exploration from the beginning.", d: 1 },
            { text: "The Soviet Union landed humans on the Moon before the United States.", d: 1 },
            { text: "The US and Soviet Union raced to the Moon because they believed it contained valuable mineral resources.", d: 2 },
            { text: "The Moon landing had little cultural impact and quickly faded from public attention.", d: 2 },
            { text: "Both superpowers maintained active crewed Moon programs well into the 1970s.", d: 3 },
        ]
    },
    f58: {
        hardCorrect: "The most significant communication shift since the printing press, decentralizing knowledge and creating the data-driven world.",
        distractors: [
            { text: "The internet was created by commercial companies seeking to sell products online.", d: 1 },
            { text: "The World Wide Web was limited to email communication for its first two decades.", d: 1 },
            { text: "The internet concentrated information control in the hands of a few governments.", d: 2 },
            { text: "Mobile phones were the primary technology that launched the digital revolution.", d: 2 },
            { text: "Academic institutions retained control over internet content well into the 2000s.", d: 3 },
        ]
    },
    f59: {
        hardCorrect: "Mass pro-democracy protests destroyed the barrier dividing Berlin, symbolizing the Eastern Bloc's collapse before the Soviet Union dissolved in 1991.",
        distractors: [
            { text: "Western military pressure forced East Germany to tear down the Berlin Wall.", d: 1 },
            { text: "German reunification was achieved through quiet diplomatic negotiations, not popular protests.", d: 1 },
            { text: "The Soviet Union dissolved immediately when the Berlin Wall fell in 1989.", d: 2 },
            { text: "East Germany's economic prosperity made the Wall unnecessary rather than its economic struggles.", d: 2 },
            { text: "West German agents secretly coordinated the protests from across the border.", d: 3 },
        ]
    },
    f60: {
        hardCorrect: "Transformed the European Economic Community into the EU, establishing the Euro, EU citizenship, and a three-pillar governance structure.",
        distractors: [
            { text: "The EU was founded immediately after World War II as part of the Marshall Plan.", d: 1 },
            { text: "All EU member states were required to adopt the Euro as their currency.", d: 1 },
            { text: "The treaty created a single European government that replaced national parliaments.", d: 2 },
            { text: "The Maastricht Treaty was primarily a military alliance similar to NATO.", d: 2 },
            { text: "Britain and France were the primary architects of the treaty, with Germany playing a minor role.", d: 3 },
        ]
    },
    f61: {
        hardCorrect: "Charles I was tried and executed in 1649 — the first time a European monarch was formally killed by his own people, establishing that rulers answer to the law.",
        distractors: [
            { text: "Parliament created a permanent republic that lasted for centuries after the king's death.", d: 1 },
            { text: "The war was primarily a religious conflict between Catholics and Protestants.", d: 1 },
            { text: "Charles I was exiled to France rather than executed.", d: 2 },
            { text: "Oliver Cromwell fought on the side of the Royalists to preserve the monarchy.", d: 2 },
            { text: "The English Civil War had little influence on later democratic revolutions in America or France.", d: 3 },
        ]
    },
    f62: {
        hardCorrect: "Enslaved Africans overthrew their masters, defeated Napoleon's army, and established the first free Black republic — the second independent nation in the Western Hemisphere.",
        distractors: [
            { text: "French abolitionists in Paris organized and led the uprising on behalf of the enslaved population.", d: 1 },
            { text: "Haiti gained independence through peaceful negotiations with the French colonial government.", d: 1 },
            { text: "France voluntarily withdrew from Saint-Domingue after deciding the colony was unprofitable.", d: 2 },
            { text: "Haiti was the third independent nation in the Americas, after the US and Canada.", d: 2 },
            { text: "The revolution succeeded quickly because Napoleon chose not to send significant military forces to the Caribbean.", d: 3 },
        ]
    },
    f63: {
        hardCorrect: "Inspired by the American and French Revolutions and triggered by Napoleon's invasion of Spain, Creole leaders freed most of Latin America within a single generation.",
        distractors: [
            { text: "Indigenous peoples led the independence movements against Spanish colonial rule.", d: 1 },
            { text: "Spain voluntarily granted independence to its American colonies.", d: 1 },
            { text: "The Haitian Revolution was the sole inspiration for all Latin American independence movements.", d: 2 },
            { text: "A single unified army under Bolívar liberated the entire continent in one campaign.", d: 2 },
            { text: "Independence immediately brought political stability and democratic governance to the new nations.", d: 3 },
        ]
    },
    f64: {
        hardCorrect: "Triggered by a web of alliances after Franz Ferdinand's assassination, the first industrialized war killed millions and destroyed four empires.",
        distractors: [
            { text: "Germany unilaterally started the war by invading France without provocation.", d: 1 },
            { text: "Colonial competition over Africa was the primary cause of the war.", d: 1 },
            { text: "New military technology like machine guns and gas shortened the war by making battles decisive.", d: 2 },
            { text: "The war remained confined to Europe with no fighting in Africa, Asia, or the Middle East.", d: 2 },
            { text: "The assassination of Franz Ferdinand was merely a pretext, as all major powers had already agreed to go to war.", d: 3 },
        ]
    },
    f65: {
        hardCorrect: "Mao's victory in 1949 brought a quarter of humanity under communist rule, reshaping the global balance of power.",
        distractors: [
            { text: "Mao achieved a quick military victory over the Nationalists in a single decisive campaign.", d: 1 },
            { text: "Urban factory workers formed the backbone of Mao's revolutionary movement.", d: 1 },
            { text: "Japan's defeat in 1945 immediately ended the Chinese civil war.", d: 2 },
            { text: "Communist control extended across all of East Asia after 1949, not just China.", d: 2 },
            { text: "The Nationalists surrendered completely rather than retreating to Taiwan.", d: 3 },
        ]
    },
    f66: {
        hardCorrect: "The first modern revolution to install a theocratic government, transforming Iran from a Cold War ally into a center of anti-Western Islamism.",
        distractors: [
            { text: "A military coup installed a secular government after overthrowing the Shah.", d: 1 },
            { text: "The United States backed the revolution, hoping to gain greater influence in Iran.", d: 1 },
            { text: "The revolution was driven by demands for economic modernization, not religious governance.", d: 2 },
            { text: "After the revolution, Iran joined the Soviet bloc as a communist ally.", d: 2 },
            { text: "The Shah was overthrown primarily by the Iranian military, which then handed power to Khomeini.", d: 3 },
        ]
    },
    f67: {
        hardCorrect: "Sparked by a Tunisian street vendor's self-immolation, social media amplified dissent at unprecedented speed across the Arab world.",
        distractors: [
            { text: "A coordinated international movement organized the protests across all Arab nations.", d: 1 },
            { text: "The protests led to stable democracies in every affected country.", d: 1 },
            { text: "Western military intervention was the primary force behind regime changes.", d: 2 },
            { text: "Egypt and Syria both successfully transitioned to democratic governance.", d: 2 },
            { text: "Social media was blocked across the region, so protests relied entirely on traditional organizing.", d: 3 },
        ]
    },
    f68: {
        hardCorrect: "Lovelace prophetically envisioned that programmable machines could go beyond pure mathematics.",
        distractors: [
            { text: "Babbage successfully built and demonstrated his Analytical Engine.", d: 1 },
            { text: "The Analytical Engine used electricity to perform its calculations.", d: 1 },
            { text: "Lovelace invented the first programming language for the machine.", d: 2 },
            { text: "The engine was designed to solve a single type of mathematical equation.", d: 2 },
            { text: "Babbage and Lovelace collaborated equally on both the hardware design and the algorithms.", d: 3 },
        ]
    },
    f69: {
        hardCorrect: "His 1854 'Laws of Thought' showed that all of logic could be expressed as mathematical operations.",
        distractors: [
            { text: "Boole invented the binary number system used in all modern computers.", d: 1 },
            { text: "His work was immediately adopted by engineers to build calculating machines.", d: 1 },
            { text: "He proved that mathematics and logic are fundamentally different fields.", d: 2 },
            { text: "His algebra was designed to improve accounting and financial calculations.", d: 2 },
            { text: "Boole's system required three values — true, false, and unknown — rather than just two.", d: 3 },
        ]
    },
    f70: {
        hardCorrect: "His 1936 paper proved that a single machine could compute anything computable, and in 1950 he proposed the Turing Test for machine intelligence.",
        distractors: [
            { text: "Turing built the first working computer during World War II to crack German codes.", d: 1 },
            { text: "The Turing Test measures how fast a computer can solve mathematical problems.", d: 1 },
            { text: "His universal machine concept was inspired by observing early electronic computers.", d: 2 },
            { text: "Turing proposed that machines could only be considered intelligent if they could feel emotions.", d: 2 },
            { text: "The Enigma code was cracked by a single machine Turing designed alone, without a team.", d: 3 },
        ]
    },
    f71: {
        hardCorrect: "Filling an entire room with 18,000 vacuum tubes, ENIAC performed calculations thousands of times faster than any human.",
        distractors: [
            { text: "ENIAC was a small desktop device that could fit on an office table.", d: 1 },
            { text: "ENIAC was a British code-breaking machine built during the war.", d: 1 },
            { text: "ENIAC used transistors rather than vacuum tubes for its calculations.", d: 2 },
            { text: "The machine was designed exclusively for weather prediction, not military calculations.", d: 2 },
            { text: "ENIAC could store programs in its memory, making reprogramming quick and easy.", d: 3 },
        ]
    },
    f72: {
        hardCorrect: "Bell Labs invented the transistor in 1947, and Kilby and Noyce independently created the integrated circuit in 1958, launching relentless miniaturization.",
        distractors: [
            { text: "The transistor was invented at MIT as part of a government research program.", d: 1 },
            { text: "Transistors replaced mechanical relays, not vacuum tubes.", d: 1 },
            { text: "Integrated circuits were first deployed in consumer electronics like radios and televisions.", d: 2 },
            { text: "A single inventor created both the transistor and the integrated circuit.", d: 2 },
            { text: "Transistors were initially larger and less reliable than the vacuum tubes they replaced.", d: 3 },
        ]
    },
    f73: {
        hardCorrect: "A small summer workshop coined 'artificial intelligence' and set an ambitious agenda: to make machines that could reason, learn, and use language.",
        distractors: [
            { text: "The Dartmouth Conference was a massive international gathering of hundreds of scientists.", d: 1 },
            { text: "Alan Turing organized the conference and presented his vision for AI.", d: 1 },
            { text: "The conference focused narrowly on building chess-playing machines.", d: 2 },
            { text: "Participants were cautious and predicted AI would take centuries to achieve.", d: 2 },
            { text: "The term 'artificial intelligence' had been widely used in academic papers for decades before 1956.", d: 3 },
        ]
    },
    f74: {
        hardCorrect: "After initial hype, AI hit two brutal funding collapses when early systems failed to handle real-world complexity.",
        distractors: [
            { text: "AI research progressed steadily from the 1960s onward with no significant setbacks.", d: 1 },
            { text: "Expert systems solved real-world problems so well that they made AI winters impossible.", d: 1 },
            { text: "The AI winters were caused by hardware limitations, not by the failure of AI approaches.", d: 2 },
            { text: "Government funding for AI remained constant throughout the 1970s and 1980s.", d: 2 },
            { text: "Expert systems failed because they required too much computing power, not because their rules were too brittle.", d: 3 },
        ]
    },
    f75: {
        hardCorrect: "The first time a machine beat a world chess champion under standard rules, though it relied on brute-force calculation rather than understanding.",
        distractors: [
            { text: "Deep Blue learned chess by studying thousands of human games, like modern AI.", d: 1 },
            { text: "Kasparov easily won the match, proving machines couldn't compete at chess.", d: 1 },
            { text: "Deep Blue genuinely understood chess strategy rather than calculating millions of positions.", d: 2 },
            { text: "The victory convinced most AI researchers that general artificial intelligence was imminent.", d: 2 },
            { text: "Deep Blue was a general-purpose AI that could play any board game, not just chess.", d: 3 },
        ]
    },
    f76: {
        hardCorrect: "AlexNet, trained on GPUs, crushed the ImageNet competition and proved that deep neural networks could learn patterns from massive data.",
        distractors: [
            { text: "The deep learning breakthrough came from traditional rule-based programming, not neural networks.", d: 1 },
            { text: "AlexNet was developed by a large government-funded research lab.", d: 1 },
            { text: "The breakthrough proved that small, carefully curated datasets were more important than massive data.", d: 2 },
            { text: "Deep learning was immediately applicable to language processing, not just image recognition.", d: 2 },
            { text: "Neural networks had consistently outperformed other approaches throughout the 1990s and 2000s.", d: 3 },
        ]
    },
    f77: {
        hardCorrect: "Google's 2017 Transformer architecture enabled models like GPT and ChatGPT to process language with unprecedented power.",
        distractors: [
            { text: "ChatGPT was built on 1980s expert system technology rather than neural networks.", d: 1 },
            { text: "A single company developed the entire Transformer technology without building on prior research.", d: 1 },
            { text: "Large language models truly understand language in the same way humans do.", d: 2 },
            { text: "The Transformer architecture was designed specifically to build chatbots.", d: 2 },
            { text: "GPT models were trained primarily on curated encyclopedic content rather than broad internet text.", d: 3 },
        ]
    },
    // ─── Fight for Freedom ───────────────────────────────
    f78: {
        hardCorrect: "Ordinary citizens boycotted sugar and signed mass petitions to pressure Parliament into ending a hugely profitable system.",
        distractors: [
            { text: "Parliament independently decided to end slavery without significant public pressure.", d: 1 },
            { text: "The movement was primarily led by formerly enslaved people who had escaped to Britain.", d: 1 },
            { text: "Britain abolished slavery because the slave trade had become economically unprofitable.", d: 2 },
            { text: "The campaign only targeted slavery within Britain itself, not in the colonies.", d: 2 },
            { text: "Wilberforce convinced Parliament through philosophical arguments alone, without any mass public campaign.", d: 3 },
        ]
    },
    f79: {
        hardCorrect: "Douglass's autobiography and speeches shattered white assumptions about Black intellect and made abolition impossible to ignore.",
        distractors: [
            { text: "The Underground Railroad was a physical railroad system built secretly by abolitionists.", d: 1 },
            { text: "Frederick Douglass was a white politician who championed abolition in Congress.", d: 1 },
            { text: "Most escapees traveled south to Mexico rather than north to Canada.", d: 2 },
            { text: "The network was operated primarily by the federal government through official channels.", d: 2 },
            { text: "Harriet Tubman was both the network's most famous conductor and the movement's primary public spokesperson.", d: 3 },
        ]
    },
    f80: {
        hardCorrect: "New Zealand became the first country to grant women's suffrage in 1893, decades before most Western nations.",
        distractors: [
            { text: "Women gained the right to vote through a single Supreme Court ruling rather than decades of activism.", d: 1 },
            { text: "The United States was the first country to grant women full voting rights.", d: 1 },
            { text: "The suffragette movement achieved its goals entirely through polite petitioning without civil disobedience.", d: 2 },
            { text: "Women's suffrage was widely supported by most male politicians from the movement's beginning.", d: 2 },
            { text: "The Seneca Falls Convention focused primarily on property rights rather than voting rights.", d: 3 },
        ]
    },
    f81: {
        hardCorrect: "The Salt March challenged Britain's monopoly on a basic necessity, uniting millions in civil disobedience.",
        distractors: [
            { text: "Gandhi led an armed insurgency that forced the British to withdraw militarily.", d: 1 },
            { text: "India gained independence peacefully through diplomatic negotiation without mass movements.", d: 1 },
            { text: "The Salt March was a protest against British taxes on Indian textiles.", d: 2 },
            { text: "Partition was a smooth administrative process that both sides agreed to willingly.", d: 2 },
            { text: "Gandhi's non-violent methods were universally supported within the independence movement from the start.", d: 3 },
        ]
    },
    f82: {
        hardCorrect: "Sit-ins, Freedom Rides, and grassroots organizing forced legislative change that the federal government had resisted for decades.",
        distractors: [
            { text: "The federal government imposed desegregation from the top down without significant grassroots activism.", d: 1 },
            { text: "Legal segregation ended primarily through economic pressure from Black-owned businesses.", d: 1 },
            { text: "Brown v. Board of Education immediately desegregated all American schools upon its ruling.", d: 2 },
            { text: "The Civil Rights Act was passed with overwhelming bipartisan support and little opposition.", d: 2 },
            { text: "Martin Luther King Jr.'s strategy was entirely original, developed independently of Gandhi's non-violent methods.", d: 3 },
        ]
    },
    f83: {
        hardCorrect: "International sanctions combined with internal resistance and Mandela's capacity for reconciliation ended apartheid without civil war.",
        distractors: [
            { text: "Apartheid ended when the South African military overthrew the government in a coup.", d: 1 },
            { text: "Mandela was imprisoned for only a few years before being released to lead negotiations.", d: 1 },
            { text: "International sanctions had little effect; apartheid ended purely through internal South African politics.", d: 2 },
            { text: "The first free elections in 1994 were limited to Black South Africans only.", d: 2 },
            { text: "Mandela's release was a planned government strategy from the beginning, not a response to mounting pressure.", d: 3 },
        ]
    },
    f84: {
        hardCorrect: "Bar patrons including figures like Marsha P. Johnson fought back during a police raid, and the first Pride marches followed within a year.",
        distractors: [
            { text: "The modern LGBTQ+ rights movement began with a Supreme Court ruling, not a bar uprising.", d: 1 },
            { text: "Progress came through quiet lobbying of politicians rather than public protest.", d: 1 },
            { text: "The first Pride marches didn't take place until a decade after the Stonewall uprising.", d: 2 },
            { text: "Mainstream civil rights organizations led the movement from its earliest days.", d: 2 },
            { text: "The Stonewall uprising was a single-night incident that received widespread media coverage at the time.", d: 3 },
        ]
    },
    f85: {
        hardCorrect: "Over a million students and workers occupied the square before the military crackdown killed hundreds to thousands on June 4.",
        distractors: [
            { text: "The protests succeeded in establishing democratic reforms in China.", d: 1 },
            { text: "The government resolved the situation through peaceful negotiation with protest leaders.", d: 1 },
            { text: "A small group of dissident leaders organized the protests, which involved only a few thousand people.", d: 2 },
            { text: "International sanctions following the crackdown forced China to release all detained protesters.", d: 2 },
            { text: "The 'Tank Man' photograph was taken during the protests, not after the military crackdown had begun.", d: 3 },
        ]
    },
    f86: {
        hardCorrect: "Colonial Belgium had deliberately deepened ethnic divisions that post-colonial politics then weaponized into genocide.",
        distractors: [
            { text: "The violence erupted suddenly between two groups with no prior history of conflict.", d: 1 },
            { text: "International peacekeeping forces intervened quickly and prevented most of the killings.", d: 1 },
            { text: "The genocide was driven by spontaneous mob violence with no organized planning or leadership.", d: 2 },
            { text: "The ethnic categories of Hutu and Tutsi were ancient tribal divisions unaffected by colonial rule.", d: 2 },
            { text: "The international community was unaware of the genocide until it was already over.", d: 3 },
        ]
    },
    f87: {
        hardCorrect: "Digital tools democratized activism but also exposed movements to surveillance, misinformation, and algorithmic suppression.",
        distractors: [
            { text: "Social media movements like the Arab Spring were organized by traditional political parties using new tools.", d: 1 },
            { text: "Digital activism replaced street protests entirely, making physical demonstrations obsolete.", d: 1 },
            { text: "#MeToo and BLM were primarily American movements with little international reach.", d: 2 },
            { text: "Social media platforms actively supported protest movements by promoting activist content.", d: 2 },
            { text: "Digital activism proved more effective than traditional organizing because it was immune to government interference.", d: 3 },
        ]
    },
    // ─── Empires ─────────────────────────────────────────
    f88: {
        hardCorrect: "The Persians governed through tolerance — respecting local customs, religions, and languages — while the Royal Road connected the empire.",
        distractors: [
            { text: "The Persian Empire was founded by Alexander the Great after his conquest of Greece.", d: 1 },
            { text: "Persia ruled through harsh punishment and forced cultural assimilation of conquered peoples.", d: 1 },
            { text: "The empire's primary strength was its navy, which dominated the Mediterranean Sea.", d: 2 },
            { text: "Cyrus conquered only Mesopotamia; Egypt was added much later by a different dynasty.", d: 2 },
            { text: "Persian tolerance was limited to Greek-speaking peoples, while other subjects faced strict cultural controls.", d: 3 },
        ]
    },
    f89: {
        hardCorrect: "Ashoka renounced violence after the devastating Kalinga conquest and became the first ruler to govern by explicit moral philosophy.",
        distractors: [
            { text: "Ashoka was a lifelong pacifist who never engaged in military conquest.", d: 1 },
            { text: "The Maurya Empire converted to Hinduism under Ashoka's rule.", d: 1 },
            { text: "Ashoka used his military to spread Buddhism across Southeast Asia by force.", d: 2 },
            { text: "The Maurya Empire was Asia's first democracy, with elected regional assemblies.", d: 2 },
            { text: "Ashoka's stone pillars proclaimed military achievements rather than religious tolerance and compassion.", d: 3 },
        ]
    },
    f90: {
        hardCorrect: "The Han created a Confucian-based civil service and opened the Silk Road, linking East Asia to Rome for the first time.",
        distractors: [
            { text: "The Silk Road was established by Roman merchants traveling eastward to China.", d: 1 },
            { text: "The Han Dynasty lasted only a few decades before being overthrown by Mongol invaders.", d: 1 },
            { text: "The Han Dynasty's Silk Road only carried luxury goods like silk, not ideas or religions.", d: 2 },
            { text: "The Han Dynasty's primary achievement was military expansion, not cultural or administrative innovation.", d: 2 },
            { text: "Paper was invented during the Tang Dynasty, several centuries after the Han period.", d: 3 },
        ]
    },
    f91: {
        hardCorrect: "Gupta mathematicians developed zero as a true number \u2014 with its own arithmetic operations \u2014 and the decimal system the world uses today.",
        distractors: [
            { text: "The concept of zero was brought to India by Greek scholars during Alexander's conquests.", d: 1 },
            { text: "The Gupta period was primarily an era of military expansion with little cultural achievement.", d: 1 },
            { text: "Zero and the decimal system were invented in China and later adopted by Indian scholars.", d: 2 },
            { text: "Buddhism, not Hinduism, was the dominant cultural force during the Gupta Golden Age.", d: 2 },
            { text: "Gupta mathematical achievements were primarily translations of earlier Babylonian number systems.", d: 3 },
        ]
    },
    f92: {
        hardCorrect: "Ottoman administration blended Islamic law with pragmatic tolerance of religious minorities across a three-continent empire.",
        distractors: [
            { text: "The Ottomans conquered Constantinople primarily through a naval invasion of the harbor.", d: 1 },
            { text: "The Ottoman Empire lasted only about 200 years before being replaced by the Persian Empire.", d: 1 },
            { text: "The Ottomans forced mass conversion to Islam throughout all their conquered territories.", d: 2 },
            { text: "Suleiman the Magnificent focused exclusively on military conquest rather than law and administration.", d: 2 },
            { text: "The fall of Constantinople was a peaceful transition negotiated between Byzantine and Ottoman leaders.", d: 3 },
        ]
    },
    f93: {
        hardCorrect: "Zheng He's treasure fleets reached Africa decades before Columbus, but China then turned inward and dismantled the fleet.",
        distractors: [
            { text: "The Ming Dynasty expanded primarily through territorial conquest across Southeast Asia.", d: 1 },
            { text: "Ming China had little maritime capability and relied entirely on overland trade routes.", d: 1 },
            { text: "Zheng He's voyages were primarily military campaigns to conquer coastal territories.", d: 2 },
            { text: "The Ming turned inward because their fleet was destroyed in a catastrophic naval battle.", d: 2 },
            { text: "Zheng He's fleet was comparable in size to the ships Columbus would later use to cross the Atlantic.", d: 3 },
        ]
    },
    f94: {
        hardCorrect: "Industrial supremacy, the Royal Navy, and the telegraph created the first truly global empire spanning a quarter of the world.",
        distractors: [
            { text: "The British Empire was built mainly through diplomacy and voluntary trade agreements.", d: 1 },
            { text: "Britain's empire reached its peak during the Tudor period under Queen Elizabeth I.", d: 1 },
            { text: "The empire spread railways and law but had no lasting negative effects on its colonies.", d: 2 },
            { text: "British colonial rule was generally welcomed by local populations as a modernizing force.", d: 2 },
            { text: "Britain's global dominance was primarily naval; the telegraph played no significant role in imperial control.", d: 3 },
        ]
    },
    f95: {
        hardCorrect: "Centuries of slow decline ended when the Ottomans entered WWI on the losing side, and European-drawn borders created lasting conflicts.",
        distractors: [
            { text: "The Ottoman Empire collapsed suddenly in a single year rather than declining over centuries.", d: 1 },
            { text: "The Ottomans remained neutral during World War I and collapsed from internal causes alone.", d: 1 },
            { text: "European powers divided Ottoman territory fairly along ethnic and religious lines.", d: 2 },
            { text: "Atatürk restored the Ottoman sultanate under a new name after the empire's collapse.", d: 2 },
            { text: "The post-war Middle Eastern borders were drawn in consultation with local leaders and have remained stable.", d: 3 },
        ]
    },
    f96: {
        hardCorrect: "Babur, descended from both Genghis Khan and Timur, founded a dynasty where Akbar created a remarkably tolerant multi-religious state.",
        distractors: [
            { text: "The Mughal Empire was founded by a local Indian dynasty with no Central Asian connections.", d: 1 },
            { text: "The Mughals enforced strict religious uniformity and suppressed Hindu practices throughout their rule.", d: 1 },
            { text: "The Taj Mahal was built as a royal palace rather than a memorial to a beloved wife.", d: 2 },
            { text: "The Mughal Empire was overthrown by a popular Indian revolution, not weakened by British exploitation.", d: 2 },
            { text: "Akbar's religious tolerance was limited to different Islamic sects and did not extend to Hindus.", d: 3 },
        ]
    },
    // ─── Plagues & Pandemics ─────────────────────────────
    f97: {
        hardCorrect: "Soldiers returning from eastern campaigns brought the plague during Marcus Aurelius's reign, beginning Rome's centuries-long decline.",
        distractors: [
            { text: "The plague was brought to Rome by Silk Road traders from China.", d: 1 },
            { text: "The Antonine Plague strengthened the Roman Empire by eliminating its weakest citizens.", d: 1 },
            { text: "The plague killed half of Rome's population in a single year.", d: 2 },
            { text: "Marcus Aurelius died before the plague reached Rome and never dealt with its effects.", d: 2 },
            { text: "The plague was a brief epidemic that had no lasting effect on Rome's military capacity.", d: 3 },
        ]
    },
    f98: {
        hardCorrect: "Smallpox killed an estimated 5\u20138 million Aztecs \u2014 far more than any battle \u2014 because Indigenous peoples had no immunity to the disease.",
        distractors: [
            { text: "The Aztec Empire fell primarily due to Spanish military superiority and superior weapons.", d: 1 },
            { text: "Cort\u00e9s conquered the Aztecs with a large army of 50,000 European soldiers.", d: 1 },
            { text: "The Aztecs had partial immunity to smallpox from earlier exposure to similar diseases.", d: 2 },
            { text: "Tenochtitl\u00e1n was a small settlement that fell quickly to the first Spanish assault.", d: 2 },
            { text: "Smallpox arrived in the Americas centuries before the Spanish, carried by earlier Viking explorers.", d: 3 },
        ]
    },
    f99: {
        hardCorrect: "The plague spread through fleas on rats, killed a quarter of London's population, and was the last major bubonic plague outbreak in England.",
        distractors: [
            { text: "The Great Plague spread primarily through contaminated water from the Thames.", d: 1 },
            { text: "It was England's first major plague outbreak, striking a population with no prior experience of the disease.", d: 1 },
            { text: "Quarantine efforts successfully contained the plague to a small area of London.", d: 2 },
            { text: "Wealthy Londoners stayed in the city to organize relief efforts for the sick.", d: 2 },
            { text: "The Great Fire of 1666 had no effect on future plague outbreaks in London.", d: 3 },
        ]
    },
    f100: {
        hardCorrect: "Jenner noticed milkmaids who caught cowpox never got smallpox, and tested his theory by inoculating a boy with cowpox pus.",
        distractors: [
            { text: "Jenner's vaccine used a weakened form of the smallpox virus itself.", d: 1 },
            { text: "Jenner made his discovery through laboratory experiments with animal cells, not field observation.", d: 1 },
            { text: "Vaccination was adopted worldwide within a year of Jenner's first experiment.", d: 2 },
            { text: "Jenner tested the vaccine on himself first before trying it on anyone else.", d: 2 },
            { text: "Jenner's method was immediately accepted by the entire medical establishment without controversy.", d: 3 },
        ]
    },
    f101: {
        hardCorrect: "Snow mapped cholera cases to a single contaminated water pump, disproving the 'bad air' theory and founding epidemiology.",
        distractors: [
            { text: "The government independently decided to remove the Broad Street pump handle without Snow's input.", d: 1 },
            { text: "Snow proved that cholera spread through direct person-to-person contact, not contaminated water.", d: 1 },
            { text: "Snow's work was immediately accepted and the miasma theory was abandoned overnight.", d: 2 },
            { text: "The cholera outbreak affected only a handful of people in a wealthy London neighborhood.", d: 2 },
            { text: "Snow used microscopic analysis to identify the cholera bacterium in the pump water.", d: 3 },
        ]
    },
    f102: {
        hardCorrect: "Neutral Spain reported freely on the pandemic while wartime censorship suppressed news in combatant nations, giving it a misleading name.",
        distractors: [
            { text: "The Spanish Flu originated in Spain and spread to the rest of the world from there.", d: 1 },
            { text: "The pandemic primarily killed the elderly and those with weakened immune systems.", d: 1 },
            { text: "Wartime censorship had no effect on public awareness of the pandemic.", d: 2 },
            { text: "The Spanish Flu killed fewer people than World War I combat casualties.", d: 2 },
            { text: "The pandemic struck evenly across all age groups without targeting any particular demographic.", d: 3 },
        ]
    },
    f103: {
        hardCorrect: "Fleming returned from holiday to find mold killing bacteria on a culture plate \u2014 an accident that launched the antibiotic age.",
        distractors: [
            { text: "Penicillin was first used to treat wounded soldiers in World War I.", d: 1 },
            { text: "Fleming discovered penicillin through deliberate research into tuberculosis treatments.", d: 1 },
            { text: "Mass production of penicillin was achieved immediately after Fleming's discovery.", d: 2 },
            { text: "Fleming's discovery was a planned experiment to test mold's antibacterial properties.", d: 2 },
            { text: "Penicillin was effective against viral infections as well as bacterial ones.", d: 3 },
        ]
    },
    f104: {
        hardCorrect: "Ring vaccination targeted contacts of infected people, tracking the virus to its last hiding places over a thirteen-year campaign.",
        distractors: [
            { text: "Smallpox was eradicated by vaccinating every single person on the planet.", d: 1 },
            { text: "Smallpox disappeared naturally as human immunity evolved, not through vaccination.", d: 1 },
            { text: "Several other diseases have since been eradicated using the same ring vaccination approach.", d: 2 },
            { text: "The eradication campaign took only five years from start to the final declaration in 1980.", d: 2 },
            { text: "The WHO declared smallpox eradicated in 1970, a decade before the actual declaration.", d: 3 },
        ]
    },
    f105: {
        hardCorrect: "Antiretroviral therapy (1996) turned a death sentence into a manageable condition, but the pandemic exposed how inequality determines survival.",
        distractors: [
            { text: "A vaccine for HIV was developed in the 1990s, effectively ending the pandemic.", d: 1 },
            { text: "Governments mounted swift, effective responses as soon as HIV/AIDS was identified.", d: 1 },
            { text: "The pandemic affected all regions and demographics equally around the world.", d: 2 },
            { text: "HIV/AIDS was fully eradicated by 2010 through global public health efforts.", d: 2 },
            { text: "Antiretroviral drugs cured HIV completely rather than managing it as a chronic condition.", d: 3 },
        ]
    },
    f106: {
        hardCorrect: "mRNA vaccines were developed, tested, and deployed in under a year \u2014 a process that normally takes a decade.",
        distractors: [
            { text: "COVID-19 mRNA vaccines followed the normal ten-year development timeline for safety.", d: 1 },
            { text: "The pandemic was contained within China and had minimal impact on other countries.", d: 1 },
            { text: "mRNA vaccine technology was invented specifically in response to COVID-19.", d: 2 },
            { text: "The pandemic had little effect on how people work or attend school.", d: 2 },
            { text: "Traditional vaccine methods, not mRNA technology, were used for the first COVID-19 vaccines.", d: 3 },
        ]
    },
    // ─── African Kingdoms ────────────────────────────────
    f107: {
        hardCorrect: "Kush conquered Egypt in the 8th century BCE, ruling as the 25th Dynasty, and later built more pyramids than Egypt ever did.",
        distractors: [
            { text: "Kush was a small trading post entirely dependent on Egypt for its culture and economy.", d: 1 },
            { text: "The Kingdom of Kush never had any political power over Egypt.", d: 1 },
            { text: "Kush's pyramids were built by Egyptian architects sent south to build colonial monuments.", d: 2 },
            { text: "Meroe was primarily a farming settlement with no significant industrial activity.", d: 2 },
            { text: "Kush's civilization arose after Egypt's decline and never overlapped with Egyptian power.", d: 3 },
        ]
    },
    f108: {
        hardCorrect: "King Ezana converted to Christianity in the 4th century, making Aksum one of the first states to adopt the faith \u2014 decades before Rome made it the state religion.",
        distractors: [
            { text: "Aksum adopted Christianity centuries after the Roman Empire made it the official religion.", d: 1 },
            { text: "The Aksumite Empire was a small, isolated kingdom with no international trade connections.", d: 1 },
            { text: "Aksum's stone obelisks were built by Roman engineers during a period of occupation.", d: 2 },
            { text: "Aksum's primary trading partners were exclusively other African kingdoms.", d: 2 },
            { text: "Aksum converted to Islam rather than Christianity under King Ezana's rule.", d: 3 },
        ]
    },
    f109: {
        hardCorrect: "Ghana taxed every ounce of gold and salt crossing its territory, and Arab geographers called its ruler the richest king on earth.",
        distractors: [
            { text: "The Ghana Empire was located in modern-day Ghana on the West African coast.", d: 1 },
            { text: "Ghana's wealth came primarily from coastal fishing and maritime trade.", d: 1 },
            { text: "Ghana's capital was a small village with no permanent structures.", d: 2 },
            { text: "Muslim merchants were banned from trading in Ghana's territories.", d: 2 },
            { text: "Ghana's wealth declined because the trans-Saharan trade routes shifted east before any successor empires arose.", d: 3 },
        ]
    },
    f110: {
        hardCorrect: "Mansa Musa distributed so much gold on his 1324 pilgrimage to Mecca that he crashed the Egyptian economy for a decade.",
        distractors: [
            { text: "The Mali Empire was a small kingdom that never expanded beyond its original territory.", d: 1 },
            { text: "Mansa Musa was a legendary figure who never actually existed.", d: 1 },
            { text: "Timbuktu was a remote desert outpost with no educational or religious institutions.", d: 2 },
            { text: "Mali's wealth came primarily from diamond mining rather than gold.", d: 2 },
            { text: "Mansa Musa's pilgrimage was a modest journey that went largely unnoticed by the wider world.", d: 3 },
        ]
    },
    f111: {
        hardCorrect: "The Shona people built massive stone walls rising 11 meters high without mortar, housing 18,000 people at the city's peak.",
        distractors: [
            { text: "Great Zimbabwe was built by Phoenician traders who colonized southern Africa.", d: 1 },
            { text: "The ruins of Great Zimbabwe are small remains of a minor settlement.", d: 1 },
            { text: "Great Zimbabwe's economy was based entirely on subsistence farming with no trade connections.", d: 2 },
            { text: "The stone walls were held together with a cement-like mortar imported from the coast.", d: 2 },
            { text: "European archaeologists immediately recognized Great Zimbabwe as an indigenous African achievement.", d: 3 },
        ]
    },
    f112: {
        hardCorrect: "Timbuktu's University of Sankore housed 25,000 students and hundreds of thousands of manuscripts under Songhai rule.",
        distractors: [
            { text: "The Songhai Empire was smaller than the Mali Empire it replaced.", d: 1 },
            { text: "Timbuktu was a remote trading post with no educational significance.", d: 1 },
            { text: "Songhai fell to a neighboring African empire rather than Moroccan invaders with gunpowder.", d: 2 },
            { text: "The empire's intellectual achievements were primarily oral, with no written manuscript tradition.", d: 2 },
            { text: "Askia Muhammad modeled Songhai's government on European feudal systems.", d: 3 },
        ]
    },
    f113: {
        hardCorrect: "Benin's lost-wax bronze casting produced art so sophisticated it astonished Europeans, and the British looted thousands of pieces in 1897.",
        distractors: [
            { text: "The Benin Bronzes were created using simple mold-casting techniques common throughout Africa.", d: 1 },
            { text: "The Kingdom of Benin was located in modern-day Benin rather than Nigeria.", d: 1 },
            { text: "The British acquired the Benin Bronzes through fair trade agreements with the kingdom.", d: 2 },
            { text: "The bronzes were primarily decorative objects with no historical or narrative content.", d: 2 },
            { text: "Most Benin Bronzes have already been returned to Nigeria by Western museums.", d: 3 },
        ]
    },
    f114: {
        hardCorrect: "Shaka revolutionized warfare with the short stabbing spear and disciplined regiment tactics, making the Zulu the dominant force in southern Africa.",
        distractors: [
            { text: "The Zulu Kingdom was a peaceful agricultural society that avoided military conflict.", d: 1 },
            { text: "Shaka inherited a large, already-powerful kingdom rather than transforming a small clan.", d: 1 },
            { text: "Zulu military innovations were based on European tactics learned from Dutch settlers.", d: 2 },
            { text: "The Mfecane displacement affected only a small area immediately around Zulu territory.", d: 2 },
            { text: "The Zulu never posed a serious military challenge to European colonial armies.", d: 3 },
        ]
    },
    f115: {
        hardCorrect: "Menelik II mobilized 100,000 troops and decisively defeated Italy, ensuring Ethiopia remained uncolonized.",
        distractors: [
            { text: "Ethiopia won at Adwa only because European nations supplied Menelik with modern weapons and military advisors.", d: 1 },
            { text: "Ethiopia defeated Italy through guerrilla warfare rather than a decisive pitched battle.", d: 1 },
            { text: "Several other African nations also defeated European colonial armies and remained independent.", d: 2 },
            { text: "Italy sent only a small exploratory force rather than a full colonial army to Ethiopia.", d: 2 },
            { text: "The victory at Adwa had little symbolic impact beyond Ethiopia's own borders.", d: 3 },
        ]
    },
    f116: {
        hardCorrect: "Ghana's 1957 independence triggered a cascade: 1960 alone \u2014 'The Year of Africa' \u2014 saw 17 nations gain independence.",
        distractors: [
            { text: "African independence movements began in the 1970s, not the 1950s.", d: 1 },
            { text: "European powers voluntarily granted independence to all their African colonies at once.", d: 1 },
            { text: "Most African nations gained independence through armed revolution rather than political negotiation.", d: 2 },
            { text: "Colonial borders were redrawn along ethnic lines when African nations became independent.", d: 2 },
            { text: "Cold War superpowers generally supported African independence without attempting to influence new governments.", d: 3 },
        ]
    },
    // ─── Art & Culture ───────────────────────────────────
    f117: {
        hardCorrect: "Homer's Odyssey crystallized the journey as a metaphor for life itself, and every subsequent Western writer has worked in his shadow.",
        distractors: [
            { text: "Homer was a well-documented historical figure whose biography is thoroughly recorded.", d: 1 },
            { text: "The Iliad and Odyssey were written down by Homer himself using the Greek alphabet.", d: 1 },
            { text: "Homer's epics were private literary works read only by the educated elite.", d: 2 },
            { text: "The Iliad and Odyssey had little influence on later Western literature.", d: 2 },
            { text: "The epics were composed as historical records rather than as explorations of heroism, fate, and morality.", d: 3 },
        ]
    },
    f118: {
        hardCorrect: "Baghdad's House of Wisdom preserved Greek, Persian, and Indian knowledge that Europe had lost \u2014 without it, the Renaissance would have had nothing to rediscover.",
        distractors: [
            { text: "Islamic scholars only copied Greek texts without making original contributions.", d: 1 },
            { text: "The Islamic Golden Age took place in Cairo, not Baghdad.", d: 1 },
            { text: "Al-Khwarizmi's algebra was borrowed directly from Greek mathematics without innovation.", d: 2 },
            { text: "Islamic art freely depicted human figures and religious scenes throughout this period.", d: 2 },
            { text: "European scholars had continuous access to Greek texts and did not need Arabic translations.", d: 3 },
        ]
    },
    f119: {
        hardCorrect: "Leonardo and Michelangelo pioneered anatomy and perspective, elevating the artist from craftsman to genius.",
        distractors: [
            { text: "Leonardo and Michelangelo worked together collaboratively on most of their major projects.", d: 1 },
            { text: "Renaissance art was primarily abstract and did not attempt realistic depiction of the human form.", d: 1 },
            { text: "Leonardo completed the Mona Lisa in a single sitting, demonstrating his unmatched speed and skill.", d: 2 },
            { text: "Michelangelo painted the Sistine Chapel ceiling eagerly, as painting was his preferred medium.", d: 2 },
            { text: "Renaissance artistic techniques were entirely original, with no influence from ancient Greek or Roman art.", d: 3 },
        ]
    },
    f120: {
        hardCorrect: "Shakespeare coined or popularized over 1,700 English words still used today and created characters with unprecedented psychological depth.",
        distractors: [
            { text: "Shakespeare wrote his plays for the royal court and they were never performed for common audiences.", d: 1 },
            { text: "Shakespeare's plays were considered great literature in his time but were never staged as performances.", d: 1 },
            { text: "The Globe Theatre was an exclusive venue where only wealthy patrons could see performances.", d: 2 },
            { text: "Shakespeare's plots were entirely original inventions, never borrowed from existing stories.", d: 2 },
            { text: "Shakespeare wrote approximately 10 plays during his career, all tragedies.", d: 3 },
        ]
    },
    f121: {
        hardCorrect: "Beethoven composed his greatest works \u2014 including the Ninth Symphony \u2014 while progressively going deaf, working from memory and inner hearing.",
        distractors: [
            { text: "Beethoven was born deaf and never heard any of his own compositions performed.", d: 1 },
            { text: "Beethoven's music followed the same elegant classical rules established by Mozart and Haydn.", d: 1 },
            { text: "The 'Eroica' Symphony remained dedicated to Napoleon throughout Beethoven's lifetime.", d: 2 },
            { text: "Beethoven's deafness prevented him from composing after his early career.", d: 2 },
            { text: "The Ninth Symphony's 'Ode to Joy' was composed during Beethoven's early period when he could still hear perfectly.", d: 3 },
        ]
    },
    f122: {
        hardCorrect: "The Impressionists were rejected by the official Salon, so they created independent exhibitions \u2014 inventing the idea of the independent art show.",
        distractors: [
            { text: "Impressionism was immediately embraced by the French art establishment and critics.", d: 1 },
            { text: "The Impressionists painted exclusively in studios using traditional techniques.", d: 1 },
            { text: "The term 'Impressionism' was coined as a compliment by admiring art critics.", d: 2 },
            { text: "Impressionist paintings focused on capturing precise, photographic detail rather than light effects.", d: 2 },
            { text: "The Impressionists exhibited at the official Salon alongside traditional artists without controversy.", d: 3 },
        ]
    },
    f123: {
        hardCorrect: "Jazz \u2014 born from blues, spirituals, and ragtime \u2014 became America's greatest cultural export, redefining what music could be.",
        distractors: [
            { text: "Jazz was invented by white musicians in New Orleans and later adopted by Black performers.", d: 1 },
            { text: "The Harlem Renaissance was a movement focused exclusively on visual art, not literature or music.", d: 1 },
            { text: "Langston Hughes and Zora Neale Hurston avoided addressing race in their literary works.", d: 2 },
            { text: "Jazz emerged from European classical music traditions rather than African American musical forms.", d: 2 },
            { text: "The Harlem Renaissance had little lasting impact on American culture beyond the 1920s.", d: 3 },
        ]
    },
    f124: {
        hardCorrect: "Synchronized sound in 1927 transformed cinema into the dominant art form, capable of reaching audiences across the entire planet.",
        distractors: [
            { text: "Silent films were never commercially successful and attracted only small audiences.", d: 1 },
            { text: "The first sound film was produced in the 1940s, not the 1920s.", d: 1 },
            { text: "Hollywood's studio system discouraged creative innovation in favor of purely commercial entertainment.", d: 2 },
            { text: "Cinema remained a niche art form that never rivaled literature or theater in cultural influence.", d: 2 },
            { text: "The transition from silent to sound film was seamless, with no impact on actors' or directors' careers.", d: 3 },
        ]
    },
    f125: {
        hardCorrect: "Picasso's Guernica turned the bombing of a Spanish town into the most powerful anti-war painting ever made.",
        distractors: [
            { text: "Picasso invented Cubism entirely on his own without any collaborators or influences.", d: 1 },
            { text: "Cubism aimed to create perfectly realistic depictions of three-dimensional space.", d: 1 },
            { text: "Les Demoiselles d'Avignon drew exclusively on European artistic traditions without non-Western influence.", d: 2 },
            { text: "Guernica was a commissioned celebration of military victory, not an anti-war protest.", d: 2 },
            { text: "Cubism was a minor artistic movement with little influence on subsequent modern art.", d: 3 },
        ]
    },
    f126: {
        hardCorrect: "YouTube, the iPhone, and streaming platforms meant creativity no longer required publishers, galleries, studios, or record labels.",
        distractors: [
            { text: "The digital revolution made it harder for independent creators to reach audiences.", d: 1 },
            { text: "YouTube launched in the 2010s as a response to the smartphone revolution.", d: 1 },
            { text: "Traditional gatekeepers like record labels and publishers maintained full control over creative distribution.", d: 2 },
            { text: "Digital platforms primarily benefited established artists rather than enabling new creators.", d: 2 },
            { text: "The democratization of creative tools had little effect on the types of art being produced.", d: 3 },
        ]
    },

    // ─── Daily Quiz Events (dih-0 through dih-29) ─────────────────────

    'dih-0': {
        hardCorrect: "Fifty-nine delegates signed the declaration in an unfinished building, breaking from Mexico to form the Republic of Texas.",
        distractors: [
            { text: "Texas declared independence after winning the Battle of the Alamo.", d: 1 },
            { text: "The US Congress voted to annex Texas as a new state.", d: 1 },
            { text: "Sam Houston led a constitutional convention that formally joined the United States.", d: 2 },
            { text: "Texas declared independence following a decisive military victory over Mexican forces.", d: 2 },
            { text: "The declaration was signed at the Alamo by delegates who had just repelled a Mexican siege.", d: 3 },
        ]
    },
    'dih-1': {
        hardCorrect: "Wilt Chamberlain scored 100 points against the Knicks \u2014 a single-game NBA record that still stands.",
        distractors: [
            { text: "Michael Jordan set the all-time NBA scoring record in a single game.", d: 1 },
            { text: "The NBA introduced the three-point line after this record-breaking game.", d: 1 },
            { text: "Chamberlain's 100-point game was played in a sold-out arena in Philadelphia.", d: 2 },
            { text: "The record was set during an NBA Finals game broadcast on national television.", d: 2 },
            { text: "Chamberlain scored 100 points in a playoff game against the Boston Celtics.", d: 3 },
        ]
    },
    'dih-2': {
        hardCorrect: "The original King Kong premiered at Radio City Music Hall, pioneering stop-motion animation in cinema.",
        distractors: [
            { text: "King Kong was the first film to use computer-generated special effects.", d: 1 },
            { text: "Walt Disney produced King Kong as his first live-action feature.", d: 1 },
            { text: "King Kong premiered in Hollywood and was the first film to win an Academy Award for visual effects.", d: 2 },
            { text: "The film used elaborate puppetry rather than stop-motion for its special effects.", d: 2 },
            { text: "King Kong premiered at Grauman's Chinese Theatre and introduced rear-projection techniques to cinema.", d: 3 },
        ]
    },
    'dih-3': {
        hardCorrect: "President Hoover signed a resolution making 'The Star-Spangled Banner' the official US anthem, over a century after Key wrote the lyrics.",
        distractors: [
            { text: "The national anthem was adopted immediately after Francis Scott Key wrote it in 1814.", d: 1 },
            { text: "Congress chose 'America the Beautiful' as the national anthem.", d: 1 },
            { text: "President Roosevelt signed the anthem into law during the Great Depression.", d: 2 },
            { text: "The anthem was adopted by executive order rather than a congressional resolution.", d: 2 },
            { text: "The resolution was signed by President Coolidge after a decade-long public campaign.", d: 3 },
        ]
    },
    'dih-4': {
        hardCorrect: "The inventor of the telephone was born in Edinburgh to a family deeply involved in the study of speech and elocution.",
        distractors: [
            { text: "Alexander Graham Bell was born in London and studied electrical engineering.", d: 1 },
            { text: "The inventor of the telegraph was born in Scotland.", d: 1 },
            { text: "Bell was born in Glasgow to a family of physicians who specialized in hearing disorders.", d: 2 },
            { text: "Bell was born into a family of instrument makers who built early telegraph equipment.", d: 2 },
            { text: "Bell was born in Edinburgh to a family of acoustics researchers who studied sound waves.", d: 3 },
        ]
    },
    'dih-5': {
        hardCorrect: "Florida was admitted as the 27th state after being ceded to the US by Spain through the Adams\u2013On\u00eds Treaty.",
        distractors: [
            { text: "Florida was purchased from France as part of the Louisiana Purchase.", d: 1 },
            { text: "Florida became a state after the Mexican-American War.", d: 1 },
            { text: "Florida was the 25th state admitted, following a territorial war with Britain.", d: 2 },
            { text: "Florida was ceded by Britain to the US after the War of 1812.", d: 2 },
            { text: "Florida was admitted as the 27th state directly after being acquired from Portugal.", d: 3 },
        ]
    },
    'dih-6': {
        hardCorrect: "The Constitution went into effect, replacing the Articles of Confederation, and the first Congress convened in New York City.",
        distractors: [
            { text: "The Declaration of Independence was ratified by all thirteen colonies.", d: 1 },
            { text: "George Washington was inaugurated as the first president.", d: 1 },
            { text: "The Constitution was ratified and the first Congress met in Philadelphia.", d: 2 },
            { text: "The Bill of Rights was adopted alongside the Constitution on the same day.", d: 2 },
            { text: "The Constitution replaced the Articles of Confederation and Congress first convened in Philadelphia.", d: 3 },
        ]
    },
    'dih-7': {
        hardCorrect: "Tchaikovsky's Swan Lake premiered at the Bolshoi Theatre to a lukewarm reception, though it later became the most famous ballet in history.",
        distractors: [
            { text: "Swan Lake premiered to great acclaim and immediately became a worldwide sensation.", d: 1 },
            { text: "The Nutcracker premiered at the Bolshoi Theatre in Moscow.", d: 1 },
            { text: "Swan Lake premiered at the Mariinsky Theatre in Saint Petersburg to mixed reviews.", d: 2 },
            { text: "Tchaikovsky composed Swan Lake after attending a performance at the Paris Opera.", d: 2 },
            { text: "Swan Lake premiered at the Bolshoi Theatre to enthusiastic reviews and was immediately recognized as a masterpiece.", d: 3 },
        ]
    },
    'dih-8': {
        hardCorrect: "Vermont became the 14th state \u2014 the first after the original thirteen \u2014 having been an independent republic with a slavery ban since 1777.",
        distractors: [
            { text: "Vermont was one of the original thirteen colonies.", d: 1 },
            { text: "Maine was the first state admitted after the original thirteen.", d: 1 },
            { text: "Vermont joined as the 15th state and was the second to ban slavery.", d: 2 },
            { text: "Vermont was admitted after its constitution was rewritten to include a slavery compromise.", d: 2 },
            { text: "Vermont became the 14th state after operating as an independent republic that permitted limited indentured servitude.", d: 3 },
        ]
    },
    'dih-9': {
        hardCorrect: "British soldiers fired into a crowd of colonists, killing five people and fueling the anti-British revolutionary movement.",
        distractors: [
            { text: "Colonists attacked a British fort, starting the American Revolution.", d: 1 },
            { text: "The Boston Tea Party was the first violent clash between colonists and British troops.", d: 1 },
            { text: "British soldiers opened fire on a crowd of armed colonial militia, killing twelve.", d: 2 },
            { text: "The clash occurred when colonists stormed a British customs house.", d: 2 },
            { text: "British soldiers fired on a crowd of colonists after being provoked by an organized militia ambush.", d: 3 },
        ]
    },
    'dih-10': {
        hardCorrect: "Stalin died after a stroke, ending nearly three decades of totalitarian rule and triggering a power struggle won by Khrushchev.",
        distractors: [
            { text: "Stalin was overthrown in a military coup led by Soviet generals.", d: 1 },
            { text: "Lenin died, ending the first era of Soviet leadership.", d: 1 },
            { text: "Stalin died of natural causes, and power was immediately transferred to his chosen successor.", d: 2 },
            { text: "Stalin's death led to a peaceful transition of power to Beria.", d: 2 },
            { text: "Stalin died after a stroke, ending his rule; Malenkov consolidated power without significant internal opposition.", d: 3 },
        ]
    },
    'dih-11': {
        hardCorrect: "The cartographer who created the most influential map projection in history was born; the Mercator projection became the standard for nautical navigation.",
        distractors: [
            { text: "The inventor of the compass was born in the Netherlands.", d: 1 },
            { text: "Copernicus, who revolutionized astronomy, was born in Flanders.", d: 1 },
            { text: "The creator of the first globe was born and later published his projection in 1550.", d: 2 },
            { text: "Mercator was born in Amsterdam and his projection was designed for overland trade routes.", d: 2 },
            { text: "Mercator was born in Flanders and his projection, published in 1589, became the standard for aerial navigation.", d: 3 },
        ]
    },
    'dih-12': {
        hardCorrect: "After a 13-day siege, Mexican forces under Santa Anna overran the Alamo, killing nearly all 200 Texan defenders.",
        distractors: [
            { text: "Texan forces won a decisive victory at the Alamo against Mexican troops.", d: 1 },
            { text: "The Battle of San Jacinto was fought inside the Alamo mission.", d: 1 },
            { text: "The siege lasted three days before the Alamo's defenders surrendered.", d: 2 },
            { text: "Mexican forces captured the Alamo after the defenders fled to nearby settlements.", d: 2 },
            { text: "After a 13-day siege, Mexican forces overran the Alamo, though most defenders escaped through a rear exit.", d: 3 },
        ]
    },
    'dih-13': {
        hardCorrect: "Mendeleev presented his periodic table to the Russian Chemical Society, arranging elements by atomic weight and predicting undiscovered ones.",
        distractors: [
            { text: "Einstein presented his theory of atomic structure to the German scientific community.", d: 1 },
            { text: "The periodic table was first published by a British chemist at Oxford.", d: 1 },
            { text: "Mendeleev arranged elements by atomic number and left no gaps in his table.", d: 2 },
            { text: "Mendeleev presented his table in Moscow, arranging elements by their chemical reactivity.", d: 2 },
            { text: "Mendeleev presented his periodic table, arranging elements by atomic weight but making no predictions about undiscovered elements.", d: 3 },
        ]
    },
    'dih-14': {
        hardCorrect: "Ghana became the first sub-Saharan African country to gain independence from colonial rule, led by Kwame Nkrumah.",
        distractors: [
            { text: "Nigeria was the first African nation to gain independence from European colonial rule.", d: 1 },
            { text: "South Africa gained independence and ended apartheid in the 1950s.", d: 1 },
            { text: "Ghana gained independence from France under the leadership of Nkrumah.", d: 2 },
            { text: "Ghana was the second sub-Saharan nation to gain independence, following Liberia's decolonization.", d: 2 },
            { text: "Ghana gained independence from Britain under Nkrumah, becoming the first African nation overall to decolonize.", d: 3 },
        ]
    },
    'dih-15': {
        hardCorrect: "Bell received the telephone patent, beating rival Elisha Gray by just hours; three days later he made the first successful call.",
        distractors: [
            { text: "Edison invented and patented the telephone before anyone else.", d: 1 },
            { text: "The telegraph was patented, revolutionizing long-distance communication.", d: 1 },
            { text: "Bell received the patent after a lengthy court battle with Gray that lasted several years.", d: 2 },
            { text: "Bell patented the telephone and made his first call on the same day.", d: 2 },
            { text: "Bell received the patent, beating Gray by several weeks after Gray withdrew his application.", d: 3 },
        ]
    },
    'dih-16': {
        hardCorrect: "Civil rights marchers on the Edmund Pettus Bridge were attacked by state troopers; the televised violence led to the Voting Rights Act.",
        distractors: [
            { text: "Martin Luther King Jr. led a march on Washington that resulted in the Civil Rights Act.", d: 1 },
            { text: "Rosa Parks led a protest march that was met with police violence.", d: 1 },
            { text: "Marchers crossed the bridge peacefully and the event led to the Civil Rights Act of 1964.", d: 2 },
            { text: "The march was organized in Montgomery and led to the desegregation of public schools.", d: 2 },
            { text: "Marchers were attacked on the Edmund Pettus Bridge, leading directly to the Civil Rights Act of 1964.", d: 3 },
        ]
    },
    'dih-17': {
        hardCorrect: "Parker Brothers began selling Monopoly, based on earlier designs by Elizabeth Magie meant to demonstrate the problems of land monopolies.",
        distractors: [
            { text: "Milton Bradley invented and published the board game Monopoly.", d: 1 },
            { text: "The card game Monopoly was released and became an instant bestseller.", d: 1 },
            { text: "Parker Brothers created Monopoly from scratch as an original game concept.", d: 2 },
            { text: "Monopoly was originally designed as a children's educational game about banking.", d: 2 },
            { text: "Parker Brothers began selling Monopoly, based on a game by Elizabeth Magie that was intended to promote land ownership.", d: 3 },
        ]
    },
    'dih-18': {
        hardCorrect: "Clara Zetkin proposed International Women's Day at the International Socialist Women's Conference; it was first celebrated in 1911.",
        distractors: [
            { text: "International Women's Day was established by the United Nations in 1945.", d: 1 },
            { text: "The first Women's Day march took place in London for voting rights.", d: 1 },
            { text: "Zetkin proposed the day at a labor conference in Berlin, and it was first celebrated in 1915.", d: 2 },
            { text: "International Women's Day was proposed at a suffragette convention in New York.", d: 2 },
            { text: "Zetkin proposed the day at a socialist conference in Copenhagen; it was first celebrated in 1913.", d: 3 },
        ]
    },
    'dih-19': {
        hardCorrect: "On International Women's Day, women textile workers in Petrograd struck, sparking the revolution that toppled Tsar Nicholas II within days.",
        distractors: [
            { text: "Lenin led an armed uprising that overthrew the Tsar.", d: 1 },
            { text: "The Russian army mutinied and forced the Tsar to abdicate.", d: 1 },
            { text: "Male factory workers in Moscow launched a general strike that led to the Tsar's abdication.", d: 2 },
            { text: "Soldiers in Petrograd refused orders and joined a naval mutiny that overthrew the government.", d: 2 },
            { text: "Women workers in Petrograd struck on May Day, sparking the revolution that toppled the Tsar.", d: 3 },
        ]
    },
    'dih-20': {
        hardCorrect: "MH370 vanished en route from Kuala Lumpur to Beijing with 239 aboard; despite the largest aviation search ever, it was never fully recovered.",
        distractors: [
            { text: "A plane crashed into the Pacific Ocean after running out of fuel.", d: 1 },
            { text: "A Malaysian Airlines flight was shot down over a conflict zone.", d: 1 },
            { text: "MH370 disappeared over the South China Sea and was located on the ocean floor within months.", d: 2 },
            { text: "The plane vanished en route from Singapore to Sydney with over 300 passengers.", d: 2 },
            { text: "MH370 vanished en route from Kuala Lumpur to Beijing; wreckage was recovered in the southern Indian Ocean within a year.", d: 3 },
        ]
    },
    'dih-21': {
        hardCorrect: "The Barbie doll was unveiled at the American International Toy Fair by Mattel co-founder Ruth Handler, named after her daughter Barbara.",
        distractors: [
            { text: "The Barbie doll was invented by a toy designer at Hasbro.", d: 1 },
            { text: "The first fashion doll was introduced at a trade show in London.", d: 1 },
            { text: "Barbie was unveiled at a toy fair in Los Angeles and named after Handler's niece.", d: 2 },
            { text: "The doll was created by Mattel's male design team and named by a marketing focus group.", d: 2 },
            { text: "Barbie was unveiled at the toy fair by Ruth Handler and named after her sister Barbara.", d: 3 },
        ]
    },
    'dih-22': {
        hardCorrect: "Pancho Villa led nearly 500 guerrillas in a cross-border raid on Columbus, New Mexico, prompting a US military expedition into Mexico.",
        distractors: [
            { text: "Mexican forces invaded Texas, reigniting tensions along the US-Mexico border.", d: 1 },
            { text: "The Mexican army attacked a US military base during the Mexican Revolution.", d: 1 },
            { text: "Villa raided a US town with a small band of fifty fighters, causing minimal casualties.", d: 2 },
            { text: "Villa's raid targeted a US Army fort and successfully captured American weapons.", d: 2 },
            { text: "Villa led nearly 500 guerrillas in a raid on Columbus, and the subsequent US expedition successfully captured him.", d: 3 },
        ]
    },
    'dih-23': {
        hardCorrect: "The explorer whose first name would lend itself to the Americas was born in Florence; his voyages proved the Americas were separate continents.",
        distractors: [
            { text: "Christopher Columbus was born in Florence and later discovered America.", d: 1 },
            { text: "Marco Polo was born and would later name the American continents.", d: 1 },
            { text: "Vespucci was born in Venice and his voyages confirmed Columbus had reached Asia.", d: 2 },
            { text: "The explorer was born in Rome and named the continents after his family surname.", d: 2 },
            { text: "Vespucci was born in Florence; his voyages confirmed that Columbus had indeed reached the eastern coast of Asia.", d: 3 },
        ]
    },
    'dih-24': {
        hardCorrect: "Bell made the first successful telephone call to his assistant Watson, saying 'Mr. Watson, come here,' just three days after receiving his patent.",
        distractors: [
            { text: "Edison made the first telephone call from New York to Washington.", d: 1 },
            { text: "The first telegraph message was sent across a wire.", d: 1 },
            { text: "Bell's first call was made across town to a colleague at a rival laboratory.", d: 2 },
            { text: "The first telephone call was made one month after Bell received his patent.", d: 2 },
            { text: "Bell made the first call to Watson from an adjacent building, a week after receiving his patent.", d: 3 },
        ]
    },
    'dih-25': {
        hardCorrect: "Harriet Tubman, who led roughly 70 enslaved people to freedom via the Underground Railroad and served as a Union spy, died at 91.",
        distractors: [
            { text: "Frederick Douglass, the famous abolitionist and orator, died in New York.", d: 1 },
            { text: "Sojourner Truth, who escaped slavery and became a famous activist, died.", d: 1 },
            { text: "Tubman led hundreds of enslaved people to freedom and later served in the Confederate Army as a scout.", d: 2 },
            { text: "Tubman escaped slavery and became a prominent abolitionist speaker, though she never returned south.", d: 2 },
            { text: "Tubman led roughly 70 people to freedom and served as a Union nurse, dying at 91.", d: 3 },
        ]
    },
    'dih-26': {
        hardCorrect: "Tens of thousands of Tibetans surrounded the Norbulingka Palace to protect the Dalai Lama; the uprising was crushed and he fled to India.",
        distractors: [
            { text: "The Dalai Lama led a successful revolt and established an independent Tibetan state.", d: 1 },
            { text: "China invaded Tibet for the first time, forcing the Dalai Lama to flee.", d: 1 },
            { text: "Tibetan monks peacefully protested at a monastery, and the Dalai Lama negotiated safe passage to Nepal.", d: 2 },
            { text: "The uprising centered on the Potala Palace, and the Dalai Lama fled to Bhutan.", d: 2 },
            { text: "Tibetans surrounded the Norbulingka Palace to protect the Dalai Lama, who fled to Nepal after the uprising was suppressed.", d: 3 },
        ]
    },
    'dih-27': {
        hardCorrect: "A magnitude 9.1 earthquake off Japan triggered a massive tsunami and the Fukushima nuclear disaster, killing nearly 20,000 people.",
        distractors: [
            { text: "A major volcanic eruption in Japan caused widespread destruction and a nuclear plant failure.", d: 1 },
            { text: "A typhoon struck Japan's coast, causing the Fukushima reactor to melt down.", d: 1 },
            { text: "A magnitude 8.0 earthquake struck Tokyo directly, causing the Fukushima disaster.", d: 2 },
            { text: "The earthquake struck inland, and the resulting landslides caused the nuclear disaster.", d: 2 },
            { text: "A magnitude 9.1 earthquake off Japan triggered a tsunami and the Fukushima disaster, killing nearly 5,000 people.", d: 3 },
        ]
    },
    'dih-28': {
        hardCorrect: "Gorbachev became General Secretary at 54, the youngest Soviet leader in decades; his glasnost and perestroika reforms led to the USSR's dissolution.",
        distractors: [
            { text: "Yeltsin became the leader of the Soviet Union and introduced democratic reforms.", d: 1 },
            { text: "Brezhnev took power and launched a series of economic modernization programs.", d: 1 },
            { text: "Gorbachev became leader at age 65 and his conservative policies preserved the Soviet Union.", d: 2 },
            { text: "Gorbachev introduced reforms that strengthened the Soviet Union's centralized control.", d: 2 },
            { text: "Gorbachev became the youngest Soviet leader and his reforms of glasnost and detente stabilized the USSR.", d: 3 },
        ]
    },
    'dih-29': {
        hardCorrect: "The first known cases of the 1918 flu pandemic appeared at a US Army camp; the virus would infect a third of the world and kill 50\u2013100 million.",
        distractors: [
            { text: "The Spanish Flu originated in Spain and spread to the rest of the world.", d: 1 },
            { text: "A polio epidemic broke out at a military camp during World War I.", d: 1 },
            { text: "The first cases appeared in a European field hospital and the pandemic killed about 10 million.", d: 2 },
            { text: "The pandemic began in a naval base and primarily affected populations in Europe.", d: 2 },
            { text: "The first cases appeared at a US Army camp; the virus infected a quarter of the world's population and killed around 20 million.", d: 3 },
        ]
    },

    // ─── Level 2: Science That Changed Everything ─────────────────────
    f127: {
        hardCorrect: "The Hippocratic school argued that disease comes from diet, environment, and lifestyle \u2014 not divine punishment.",
        distractors: [
            { text: "Hippocrates discovered that diseases are caused by bacteria and viruses.", d: 1 },
            { text: "Hippocrates invented surgery and performed the first known operations in Greece.", d: 1 },
            { text: "Hippocrates personally wrote the Hippocratic Oath that all doctors still swear today.", d: 2 },
            { text: "The Hippocratic school discovered that bloodletting cures most diseases.", d: 2 },
            { text: "Hippocrates established that diseases have natural causes, and he personally authored all 60 texts in the Hippocratic Corpus.", d: 3 },
        ]
    },
    f128: {
        hardCorrect: "Euclid\u2019s axiomatic method \u2014 starting from self-evident postulates and proving everything step by step \u2014 became the model for all scientific reasoning.",
        distractors: [
            { text: "Euclid discovered pi and the Pythagorean theorem.", d: 1 },
            { text: "Euclid invented algebra and used it to solve engineering problems in Alexandria.", d: 1 },
            { text: "Euclid\u2019s Elements was the first book ever printed on Gutenberg\u2019s press.", d: 2 },
            { text: "Euclid\u2019s Elements was the standard textbook for 500 years before being replaced by Arabic mathematics.", d: 2 },
            { text: "Euclid independently originated all the proofs in the Elements rather than compiling earlier Greek mathematicians\u2019 work.", d: 3 },
        ]
    },
    f129: {
        hardCorrect: "Archimedes proved that a sphere\u2019s volume is exactly two-thirds of its circumscribed cylinder \u2014 and asked for this diagram on his tombstone.",
        distractors: [
            { text: "Archimedes invented the steam engine and used it to power ships.", d: 1 },
            { text: "Archimedes designed the Colosseum in Rome using his mathematical principles.", d: 1 },
            { text: "Archimedes calculated pi exactly and published the definitive value still used today.", d: 2 },
            { text: "Archimedes\u2019 death ray mirrors were his greatest military invention, proven effective by modern experiments.", d: 2 },
            { text: "Archimedes discovered buoyancy through a controlled experiment rather than the famous bathtub moment described by a later author.", d: 3 },
        ]
    },
    f130: {
        hardCorrect: "Galileo observed mountains on the Moon, moons orbiting Jupiter, and the phases of Venus \u2014 each contradicting the Church-backed geocentric model.",
        distractors: [
            { text: "Galileo invented the telescope and was the first person to look at the sky through one.", d: 1 },
            { text: "Galileo discovered that the Sun orbits the Earth faster than previously thought.", d: 1 },
            { text: "Galileo was imprisoned for life by the Inquisition and died in a dungeon.", d: 2 },
            { text: "Galileo\u2019s main achievement was proving that the Earth is round, which the Church denied.", d: 2 },
            { text: "Galileo turned a newly invented telescope to the sky and was convicted by the Inquisition primarily for his scientific claims rather than for personally insulting the Pope.", d: 3 },
        ]
    },
    f131: {
        hardCorrect: "Newton unified terrestrial and celestial physics \u2014 showing that the same mathematical laws govern both falling apples and orbiting planets.",
        distractors: [
            { text: "Newton discovered gravity when an apple fell on his head, immediately inspiring the Principia.", d: 1 },
            { text: "Newton\u2019s laws proved that the Earth is the center of the solar system.", d: 1 },
            { text: "Newton single-handedly invented calculus; Leibniz later copied his work.", d: 2 },
            { text: "Newton\u2019s Principia described four laws of motion that are still used unchanged today.", d: 2 },
            { text: "Newton published three laws of motion and universal gravitation that explained the physical universe completely, with no corrections needed until quantum mechanics.", d: 3 },
        ]
    },
    f132: {
        hardCorrect: "Lavoisier established the law of conservation of mass by carefully weighing substances before and after chemical reactions.",
        distractors: [
            { text: "Lavoisier discovered the periodic table of elements.", d: 1 },
            { text: "Lavoisier proved that water is an element, not a compound.", d: 1 },
            { text: "Lavoisier was executed during the French Revolution specifically because the Republic opposed science.", d: 2 },
            { text: "Lavoisier discovered oxygen independently without any knowledge of Priestley\u2019s prior work.", d: 2 },
            { text: "Lavoisier proved combustion requires oxygen and independently discovered the gas without input from Priestley\u2019s parallel research.", d: 3 },
        ]
    },
    f133: {
        hardCorrect: "Darwin delayed publishing his theory for 20 years, fearing controversy \u2014 and was finally prompted by Alfred Russel Wallace\u2019s independent discovery of the same idea.",
        distractors: [
            { text: "Darwin proposed that humans descended directly from chimpanzees.", d: 1 },
            { text: "Darwin\u2019s theory was immediately accepted by the scientific community without debate.", d: 1 },
            { text: "Darwin developed his theory entirely during the Beagle voyage and published it immediately upon return.", d: 2 },
            { text: "Darwin\u2019s Origin of Species argued that evolution is driven by random chance rather than environmental pressures.", d: 2 },
            { text: "Darwin independently conceived natural selection with no other scientist reaching the same conclusion, and published his theory in 1859 after decades of solitary research.", d: 3 },
        ]
    },
    f134: {
        hardCorrect: "Curie coined the term \u2018radioactivity\u2019 and became the first person to win Nobel Prizes in two different sciences.",
        distractors: [
            { text: "Marie Curie discovered X-rays and used them to treat cancer patients.", d: 1 },
            { text: "Curie was the first scientist to split the atom using radium.", d: 1 },
            { text: "Curie won both Nobel Prizes on her own without sharing them with any other scientist.", d: 2 },
            { text: "Curie discovered radioactivity itself, rather than extending Henri Becquerel\u2019s earlier discovery.", d: 2 },
            { text: "Curie discovered polonium and radium and was immediately recognized by the Nobel committee without any initial resistance to honoring a woman.", d: 3 },
        ]
    },
    f135: {
        hardCorrect: "General relativity revealed that gravity is not a force but the curvature of spacetime caused by mass.",
        distractors: [
            { text: "Einstein proved that nothing can travel faster than sound.", d: 1 },
            { text: "Einstein\u2019s theory showed that time always flows at the same rate everywhere in the universe.", d: 1 },
            { text: "Einstein developed relativity over a single year of intense work in 1905.", d: 2 },
            { text: "Einstein\u2019s E=mc\u00B2 was immediately used to build nuclear reactors.", d: 2 },
            { text: "Einstein published special relativity in 1905 and general relativity in 1915, developing both theories entirely without building on any other physicist\u2019s prior work.", d: 3 },
        ]
    },
    f136: {
        hardCorrect: "Watson and Crick\u2019s discovery relied critically on Rosalind Franklin\u2019s X-ray crystallography images, shown to them without her knowledge.",
        distractors: [
            { text: "Watson and Crick discovered DNA itself, proving for the first time that it carries genetic information.", d: 1 },
            { text: "DNA was discovered by looking at it under a simple optical microscope.", d: 1 },
            { text: "Rosalind Franklin chose to share her X-ray data with Watson and Crick as part of a formal collaboration.", d: 2 },
            { text: "The double helix structure was predicted mathematically before any experimental evidence was found.", d: 2 },
            { text: "Watson and Crick discovered the double helix using Franklin\u2019s data and she was publicly acknowledged as an equal contributor during her lifetime.", d: 3 },
        ]
    },
    f137: {
        hardCorrect: "The Higgs field gives other fundamental particles their mass \u2014 without it, electrons would be massless and atoms could not form.",
        distractors: [
            { text: "The Higgs boson was discovered using the Hubble Space Telescope.", d: 1 },
            { text: "Peter Higgs built the Large Hadron Collider himself to prove his theory.", d: 1 },
            { text: "The Higgs boson was found exactly when Peter Higgs first predicted it would be, in the 1970s.", d: 2 },
            { text: "Peter Higgs was the sole physicist to propose the Higgs mechanism, with no other independent proposals.", d: 2 },
            { text: "The Higgs boson was discovered at CERN in 2012, confirming a prediction made 48 years earlier solely by Peter Higgs.", d: 3 },
        ]
    },

    // ─── Level 2 Chapter: Money & Trade ──────────────────────────────
    f147: {
        hardCorrect: "Lydian coins bore a lion\u2019s head stamp guaranteeing weight and purity, creating trust between strangers.",
        distractors: [
            { text: "The first coins were made of pure gold, making them extremely valuable from the start.", d: 1 },
            { text: "Coins were invented in ancient Egypt as a replacement for the pharaoh\u2019s treasury.", d: 1 },
            { text: "The Lydian coins were primarily used for religious offerings rather than everyday trade.", d: 2 },
            { text: "Coinage spread slowly over many centuries, only reaching Greece around 200 BCE.", d: 2 },
            { text: "Lydia minted the first standardized coins from electrum, and the concept spread to Greece within a few decades, though India and China developed their own coin systems independently and possibly earlier.", d: 3 },
        ]
    },
    f148: {
        hardCorrect: "Goods changed hands many times along the route \u2014 most merchants only traveled a segment, with middlemen adding markups at each stop.",
        distractors: [
            { text: "The Silk Road was a single well-paved highway stretching from Beijing to Rome.", d: 1 },
            { text: "The route was primarily used to transport soldiers rather than trade goods.", d: 1 },
            { text: "Zhang Qian successfully forged the military alliance he was sent to negotiate, and trade was a bonus.", d: 2 },
            { text: "Silk was the only commodity traded along the route, giving it its name.", d: 2 },
            { text: "Zhang Qian\u2019s diplomatic mission failed but revealed trade routes connecting China to the Mediterranean \u2014 routes that had never been used for any trade before his journey.", d: 3 },
        ]
    },
    f149: {
        hardCorrect: "Medieval African rulers dined off Chinese celadon plates, while Indonesian spices flavored Middle Eastern cuisine.",
        distractors: [
            { text: "Indian Ocean trade was controlled entirely by Arab merchants who excluded other cultures.", d: 1 },
            { text: "The network only connected India and China, with no significant African participation.", d: 1 },
            { text: "European merchants dominated Indian Ocean trade well before the Age of Exploration.", d: 2 },
            { text: "Swahili port cities mainly exported manufactured goods rather than raw materials.", d: 2 },
            { text: "The Indian Ocean network was a multicultural system where Arab, Chinese, and Indian merchants participated as equals, and it remained entirely free of any involvement in the slave trade.", d: 3 },
        ]
    },
    f150: {
        hardCorrect: "The innovation was born of necessity \u2014 copper coins were too heavy for large transactions and Sichuan was short of metal.",
        distractors: [
            { text: "Paper money was invented in Europe during the Renaissance by Italian bankers.", d: 1 },
            { text: "The Song Dynasty created paper money as a way to fund its space exploration program.", d: 1 },
            { text: "The Chinese government immediately regulated paper money from its inception, never allowing private issuance.", d: 2 },
            { text: "Paper currency was so successful in China that it never experienced inflation problems.", d: 2 },
            { text: "In 1024, the Song Dynasty issued the first government paper currency; these jiaozi were backed by the full gold reserves of the imperial treasury.", d: 3 },
        ]
    },
    f151: {
        hardCorrect: "The League proved that economic power could rival military might \u2014 a merchant republic before the age of republics.",
        distractors: [
            { text: "The Hanseatic League was a military alliance created to fight the Ottoman Empire.", d: 1 },
            { text: "The League was based in Venice and controlled Mediterranean shipping lanes.", d: 1 },
            { text: "At its peak, the League had a formal constitution and a permanent standing army.", d: 2 },
            { text: "The Hanseatic League was founded by monarchs to regulate trade between their kingdoms.", d: 2 },
            { text: "Beginning with L\u00FCbeck and Hamburg, the League grew to nearly 200 cities and created Europe\u2019s first unified legal code governing all aspects of civic and commercial life.", d: 3 },
        ]
    },
    f152: {
        hardCorrect: "The bank disguised interest charges \u2014 forbidden by the Church as usury \u2014 as currency exchange fees.",
        distractors: [
            { text: "The Medici Bank was founded by the Pope to fund Vatican construction projects.", d: 1 },
            { text: "The Medici family made their fortune through military conquest of neighboring city-states.", d: 1 },
            { text: "The Medici Bank invented double-entry bookkeeping, which no one had used before.", d: 2 },
            { text: "The Catholic Church openly supported and encouraged the Medici\u2019s lending practices.", d: 2 },
            { text: "The Medici Bank became Europe\u2019s most powerful by perfecting innovations like letters of credit and branch networks, and the Church fully endorsed their lending as a legitimate public service.", d: 3 },
        ]
    },
    f153: {
        hardCorrect: "The VOC could wage war, negotiate treaties, establish colonies, and mint its own coins \u2014 a state within a state.",
        distractors: [
            { text: "The Dutch East India Company was a charitable organization dedicated to spreading Christianity in Asia.", d: 1 },
            { text: "The VOC only traded in tulips, which is why the Dutch became famous for flowers.", d: 1 },
            { text: "The VOC was the first company to employ workers but never issued tradable shares to the public.", d: 2 },
            { text: "The company operated peacefully and never used military force to protect its trade monopolies.", d: 2 },
            { text: "Chartered in 1602, the VOC was the world\u2019s first publicly traded company, though it operated under strict government oversight that prevented it from acting independently in matters of war or diplomacy.", d: 3 },
        ]
    },
    f154: {
        hardCorrect: "Isaac Newton reportedly lost \u00A320,000 and lamented he could calculate heavenly bodies but not the madness of people.",
        distractors: [
            { text: "The South Sea Bubble happened in the Mediterranean, crashing fishing and olive oil markets.", d: 1 },
            { text: "Only wealthy aristocrats were affected; ordinary people had no access to shares.", d: 1 },
            { text: "The crash was caused by an actual discovery that South America had no valuable resources.", d: 2 },
            { text: "The South Sea Company went bankrupt because its ships were lost at sea in a storm.", d: 2 },
            { text: "Shares surged from \u00A3128 to over \u00A31,000 in months, and the crash that followed led immediately to the abolition of all public stock trading in Britain for a century.", d: 3 },
        ]
    },
    f155: {
        hardCorrect: "Keynes and White clashed bitterly over the system\u2019s design but agreed that unregulated markets had nearly destroyed civilization.",
        distractors: [
            { text: "The Bretton Woods Conference established the European Union as a trade bloc.", d: 1 },
            { text: "The conference was held in London and attended only by European nations.", d: 1 },
            { text: "The system pegged all currencies to the British pound, which was then tied to silver.", d: 2 },
            { text: "Keynes and White agreed on every detail of the new financial system without conflict.", d: 2 },
            { text: "Delegates from 44 nations created the IMF and World Bank, pegging currencies to the dollar, and this system remained completely unchanged through the end of the 20th century.", d: 3 },
        ]
    },
    f156: {
        hardCorrect: "By 2000, a T-shirt\u2019s cotton might be grown in India, spun in Bangladesh, sewn in Vietnam, and sold in New York.",
        distractors: [
            { text: "The WTO was founded in 1945 as part of the original United Nations charter.", d: 1 },
            { text: "Globalization only affected wealthy nations and had no impact on developing countries.", d: 1 },
            { text: "The WTO succeeded the International Monetary Fund as the primary global trade organization.", d: 2 },
            { text: "Globalization uniformly benefited all countries and social classes equally, with no significant opposition.", d: 2 },
            { text: "The WTO\u2019s founding in 1995, combined with container shipping and the internet, tripled global trade in a decade and lifted hundreds of millions from poverty without any significant downsides.", d: 3 },
        ]
    },
};
