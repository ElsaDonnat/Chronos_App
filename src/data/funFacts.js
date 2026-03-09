/**
 * Fun Facts — casual trivia questions tied to existing event cards.
 * Each fact reveals a surprising detail NOT found in the card's
 * description, quizDescription, or descriptionDistractors.
 */

export const FUN_FACTS = [
    {
        id: 'ff1',
        eventId: 'f1',
        question: 'Humans share approximately what percentage of their DNA with chimpanzees?',
        correctAnswer: 'About 98.7%',
        wrongAnswers: ['About 85%', 'About 92%', 'About 75%'],
        explanation: 'Despite millions of years of separate evolution, humans and chimpanzees share roughly 98.7% of their DNA. The small differences account for everything from brain size to walking upright. We also share about 60% of our DNA with bananas \u2013 so the percentage alone doesn\u2019t tell the whole story.',
    },
    {
        id: 'ff2',
        eventId: 'f2',
        question: 'What happened to the human jaw and teeth as a result of cooking food?',
        correctAnswer: 'They became significantly smaller',
        wrongAnswers: ['They grew stronger and larger', 'They developed a second row of molars', 'They remained unchanged for millennia'],
        explanation: 'Because cooked food is softer and easier to chew, humans no longer needed massive jaws and large teeth. Over time, jaw muscles shrank and teeth got smaller. This freed up skull space, which some researchers believe helped the brain expand.',
    },
    {
        id: 'ff3',
        eventId: 'f12',
        question: 'What did ancient Olympic athletes wear during competition?',
        correctAnswer: 'Nothing \u2013 they competed nude',
        wrongAnswers: ['Leather armor', 'Simple white tunics', 'Bronze helmets only'],
        explanation: 'Ancient Greek athletes competed completely naked. The word \u201Cgymnasium\u201D comes from the Greek \u201Cgymnos,\u201D meaning \u201Cnaked.\u201D Legend says this tradition started when a runner\u2019s loincloth fell off mid-race and he won anyway, prompting others to follow suit.',
    },
    {
        id: 'ff4',
        eventId: 'f15',
        question: 'What happened to Alexander the Great\u2019s empire immediately after his death?',
        correctAnswer: 'His generals divided it among themselves',
        wrongAnswers: ['His son inherited the entire empire', 'It was peacefully handed to Persia', 'The Senate of Macedonia governed it as a republic'],
        explanation: 'When Alexander died at 32, he reportedly said his empire should go \u201Cto the strongest.\u201D His generals, called the Diadochi, fought brutal wars for decades and split the empire into rival kingdoms \u2013 the Ptolemaic (Egypt), Seleucid (Persia), and Antigonid (Macedonia).',
    },
    {
        id: 'ff5',
        eventId: 'f32',
        question: 'What was the first major book printed on Gutenberg\u2019s press?',
        correctAnswer: 'The Bible (Gutenberg Bible)',
        wrongAnswers: ['A dictionary of the German language', 'A collection of Greek philosophy', 'A manual on printing techniques'],
        explanation: 'Gutenberg\u2019s first major printed work was a Latin Bible, now called the Gutenberg Bible. Around 180 copies were printed, and each took about three years to complete. Only 49 copies survive today, and each is worth tens of millions of dollars.',
    },
    {
        id: 'ff6',
        eventId: 'f33',
        question: 'How many voyages did Columbus make to the Americas in total?',
        correctAnswer: 'Four voyages',
        wrongAnswers: ['Just one', 'Two voyages', 'Six voyages'],
        explanation: 'Columbus made four voyages between 1492 and 1504. Despite reaching Central and South America on later trips, he never accepted that he had found a new continent. He died in 1506 still believing he had reached the outskirts of Asia.',
    },
    {
        id: 'ff7',
        eventId: 'f43',
        question: 'What measuring system was created during the French Revolution to replace chaotic old units?',
        correctAnswer: 'The metric system',
        wrongAnswers: ['The imperial system', 'The French foot system', 'The decimal clock'],
        explanation: 'Revolutionaries wanted to rationalize everything, including measurement. In 1795 they introduced the meter, defined as one ten-millionth of the distance from the North Pole to the equator. They also tried a decimal clock with 10-hour days, but that idea was quietly abandoned.',
    },
    {
        id: 'ff8',
        eventId: 'f46',
        question: 'What was the average life expectancy in industrial Manchester, England around 1840?',
        correctAnswer: 'About 25 years',
        wrongAnswers: ['About 45 years', 'About 55 years', 'About 35 years'],
        explanation: 'Factory workers in Manchester had shockingly low life expectancy due to pollution, overcrowding, and disease. While the national average was around 40, in industrial slums it dropped to 25. Child labor was so common that children as young as five worked 12-hour shifts.',
    },
    {
        id: 'ff9',
        eventId: 'f57',
        question: 'Did NASA really spend millions developing a pen that works in space while the Soviets just used pencils?',
        correctAnswer: 'No \u2013 it\u2019s a famous myth',
        wrongAnswers: ['Yes, NASA spent $12 million', 'Yes, but it only cost $1 million', 'The Soviets actually developed the pen first'],
        explanation: 'This is a famous myth! NASA didn\u2019t spend millions on a space pen \u2013 a private company (Fisher) developed it independently. Both NASA and the Soviets initially used pencils, but graphite fragments floating in zero gravity were a fire hazard, so both agencies eventually bought Fisher Space Pens.',
    },
    {
        id: 'ff10',
        eventId: 'f8',
        question: 'The Great Pyramid of Giza was the tallest man-made structure on Earth for how long?',
        correctAnswer: 'Nearly 4,000 years',
        wrongAnswers: ['About 500 years', 'About 1,000 years', 'About 2,000 years'],
        explanation: 'Built around 2560 BCE, the Great Pyramid stood at 146 meters (481 feet) and remained the tallest man-made structure until Lincoln Cathedral in England surpassed it around 1311 CE. That\u2019s nearly four millennia of holding the record \u2013 a feat unlikely ever to be matched.',
    },
    {
        id: 'ff11',
        eventId: 'f3',
        question: 'How many human species coexisted on Earth at the same time as early Homo sapiens?',
        correctAnswer: 'At least five or six',
        wrongAnswers: ['Just one (Neanderthals)', 'None \u2013 we were always alone', 'Exactly two'],
        explanation: 'When Homo sapiens first appeared, Earth was home to several other human species including Neanderthals, Denisovans, Homo erectus, Homo floresiensis (the "Hobbit"), and Homo naledi. We weren\u2019t always the only humans \u2013 for most of our history, we shared the planet with close relatives.',
    },
    {
        id: 'ff12',
        eventId: 'f6',
        question: 'What surprising health consequence did early farmers experience compared to hunter-gatherers?',
        correctAnswer: 'They became shorter and less healthy',
        wrongAnswers: ['They immediately grew taller', 'They developed immunity to all diseases', 'Their lifespans doubled'],
        explanation: 'Early farmers were actually shorter and had worse nutrition than hunter-gatherers. A grain-heavy diet lacked the variety of wild foods, and living close to animals introduced new diseases. Average height dropped by about 5 inches. It took thousands of years for farming societies to recover.',
    },
    {
        id: 'ff13',
        eventId: 'f9',
        question: 'What were the very first things ever written down by the Sumerians?',
        correctAnswer: 'Lists of grain and livestock',
        wrongAnswers: ['Epic poems about gods', 'Laws for governing cities', 'Letters between kings'],
        explanation: 'The world\u2019s earliest writing wasn\u2019t poetry or law \u2013 it was accounting. Sumerians pressed wedge-shaped marks into clay tablets to record things like "10 barrels of barley owed to the temple." Literature, law codes, and letters came centuries later. Writing was invented for taxes, not art.',
    },
    {
        id: 'ff14',
        eventId: 'f17',
        question: 'How many times was Julius Caesar stabbed by the senators who assassinated him?',
        correctAnswer: '23 times',
        wrongAnswers: ['3 times', '7 times', '47 times'],
        explanation: 'According to ancient sources, Caesar was stabbed 23 times by a group of about 60 conspirators on March 15, 44 BCE (the "Ides of March"). Ironically, a physician later concluded that only one of the 23 wounds was actually fatal. Many senators missed or only inflicted superficial cuts in the chaos.',
    },
    {
        id: 'ff15',
        eventId: 'f29',
        question: 'What surprising postal service did the Mongol Empire operate?',
        correctAnswer: 'A relay system spanning 50,000+ km with rest stations every 40 km',
        wrongAnswers: ['Carrier pigeons trained to fly between capitals', 'Ships that circled the empire\u2019s coastline', 'Underground tunnels connecting major cities'],
        explanation: 'The Yam postal relay system was one of the Mongol Empire\u2019s greatest achievements. Riders on fast horses could relay urgent messages up to 300 km per day across a network of over 1,400 stations. Merchants and diplomats could also rest and get fresh horses. Marco Polo described it as the most efficient system in the world.',
    },
    {
        id: 'ff16',
        eventId: 'f30',
        question: 'What unusual method did some medieval doctors use to "treat" the Black Death?',
        correctAnswer: 'Sitting between two large fires',
        wrongAnswers: ['Drinking molten silver', 'Sleeping with live chickens', 'Bathing in vinegar daily for a month'],
        explanation: 'Medieval doctors tried many desperate remedies. Pope Clement VI\u2019s personal physician advised him to sit between two large fires, believing heat would purify the air \u2013 and the Pope survived (possibly because the fires kept fleas away). Other treatments included bloodletting, sniffing flowers, and placing live frogs on the sores.',
    },
    {
        id: 'ff17',
        eventId: 'f34',
        question: 'What did Leonardo da Vinci write in his notebooks to keep his ideas secret?',
        correctAnswer: 'Mirror writing (backwards script)',
        wrongAnswers: ['An invented language', 'Invisible ink made from lemon juice', 'Ancient Egyptian hieroglyphs'],
        explanation: 'Leonardo filled over 7,000 pages of notebooks with mirror writing \u2013 text that reads normally only when held up to a mirror. Some scholars believe he did this for secrecy, while others think it was simply more natural for a left-handed person to write right-to-left to avoid smudging the ink.',
    },
    {
        id: 'ff18',
        eventId: 'f42',
        question: 'What percentage of American colonists actually supported the Revolution?',
        correctAnswer: 'Roughly one-third',
        wrongAnswers: ['Over 90%', 'About 75%', 'Less than 10%'],
        explanation: 'The Revolution was far from unanimous. Historians estimate roughly a third of colonists were Patriots (supporting independence), a third were Loyalists (supporting Britain), and a third were neutral or indifferent. Many Loyalists fled to Canada after the war \u2013 about 60,000 to 80,000 people.',
    },
    {
        id: 'ff19',
        eventId: 'f53',
        question: 'What common household product was originally developed for military use during World War II?',
        correctAnswer: 'Duct tape',
        wrongAnswers: ['Aluminum foil', 'Plastic wrap', 'Paper towels'],
        explanation: 'Duct tape was invented in 1943 by a factory worker whose sons were soldiers. She suggested a strong, waterproof tape to seal ammunition cases. The military loved it \u2013 soldiers called it "duck tape" because it was waterproof like a duck. After the war, it was marketed for sealing heating ducts, and the name stuck.',
    },
    {
        id: 'ff20',
        eventId: 'f59',
        question: 'How did the Berlin Wall actually come to be opened on November 9, 1989?',
        correctAnswer: 'A spokesperson accidentally announced it at a press conference',
        wrongAnswers: ['Protesters broke through with sledgehammers', 'The East German president signed an order', 'Western tanks pushed through a checkpoint'],
        explanation: 'East German spokesman G\u00FCnter Schabowski was handed a note about relaxed travel rules and asked when they took effect. Unprepared, he shrugged and said "immediately, without delay." The announcement was broadcast live, and thousands of East Berliners rushed to the checkpoints. Overwhelmed guards opened the gates. It was essentially a bureaucratic accident.',
    },
];

/**
 * Return all fun facts (no longer gated by learned events).
 */
export function getFunFactsForSeenEvents() {
    return FUN_FACTS;
}

/**
 * Get the next fun fact to show.
 * Prioritizes unseen facts; once all are seen, picks a random previously-seen one.
 */
export function getNextFunFact(seenFunFactIds, availableFacts, index) {
    if (!availableFacts || availableFacts.length === 0) return null;

    const seenSet = new Set(seenFunFactIds || []);
    const unseen = availableFacts.filter(ff => !seenSet.has(ff.id));

    if (unseen.length > 0) {
        return unseen[index % unseen.length];
    }

    // All seen — pick a random one (use index as seed for variety)
    return availableFacts[index % availableFacts.length];
}
