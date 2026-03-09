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
];

/**
 * Filter fun facts to only those whose event the user has already learned.
 */
export function getFunFactsForSeenEvents(seenEventIds) {
    const seen = new Set(seenEventIds || []);
    return FUN_FACTS.filter(ff => seen.has(ff.eventId));
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
