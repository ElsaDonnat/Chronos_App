// ─── "This Day in History" Daily Quiz Content ───
// 10 days of content, 3 real historical events each, cycling from March 2, 2026.

export const DAILY_QUIZ_DAYS = [
    {
        // Day 0 — March 2
        dateLabel: 'March 2',
        events: [
            {
                title: 'Texas Declares Independence',
                year: 1836,
                location: 'Washington-on-the-Brazos, Texas',
                description: 'Fifty-nine delegates gathered in a small, unfinished building to sign the Texas Declaration of Independence, breaking away from Mexico and establishing the Republic of Texas.',
                question: {
                    prompt: 'Where was the Texas Declaration of Independence signed?',
                    options: ['Washington-on-the-Brazos', 'San Antonio', 'Houston', 'Austin'],
                    correctIndex: 0,
                },
            },
            {
                title: 'Wilt Chamberlain Scores 100 Points',
                year: 1962,
                location: 'Hershey, Pennsylvania',
                description: 'Wilt Chamberlain of the Philadelphia Warriors scored 100 points against the New York Knicks \u2014 a record that still stands as the most points scored by a single player in an NBA game.',
                question: {
                    prompt: 'How many points did Wilt Chamberlain score in his record-breaking game?',
                    options: ['82', '100', '91', '78'],
                    correctIndex: 1,
                },
            },
            {
                title: 'King Kong Premieres in New York',
                year: 1933,
                location: 'New York City, USA',
                description: 'The original King Kong film premiered at Radio City Music Hall and the RKO Roxy Theatre, becoming a massive hit and pioneering the use of stop-motion animation in cinema.',
                question: {
                    prompt: 'In what decade did the original King Kong premiere?',
                    options: ['1920s', '1930s', '1940s', '1950s'],
                    correctIndex: 1,
                },
            },
        ],
    },
    {
        // Day 1 — March 3
        dateLabel: 'March 3',
        events: [
            {
                title: 'Star-Spangled Banner Becomes National Anthem',
                year: 1931,
                location: 'Washington, D.C., USA',
                description: 'President Herbert Hoover signed a congressional resolution making "The Star-Spangled Banner" the official national anthem of the United States, more than a century after Francis Scott Key wrote the lyrics.',
                question: {
                    prompt: 'Who wrote the lyrics to "The Star-Spangled Banner"?',
                    options: ['Francis Scott Key', 'Thomas Jefferson', 'Benjamin Franklin', 'John Philip Sousa'],
                    correctIndex: 0,
                },
            },
            {
                title: 'Alexander Graham Bell Is Born',
                year: 1847,
                location: 'Edinburgh, Scotland',
                description: 'Alexander Graham Bell, the inventor who would patent the telephone and transform global communication, was born in Edinburgh to a family deeply involved in the study of speech and elocution.',
                question: {
                    prompt: 'Where was Alexander Graham Bell born?',
                    options: ['London, England', 'Edinburgh, Scotland', 'Boston, USA', 'Dublin, Ireland'],
                    correctIndex: 1,
                },
            },
            {
                title: 'Florida Becomes a US State',
                year: 1845,
                location: 'Florida, USA',
                description: 'Florida was admitted as the 27th state of the United States. It had been a Spanish colony, then briefly British, before being ceded to the US in 1821 through the Adams\u2013On\u00eds Treaty.',
                question: {
                    prompt: 'Which country ceded Florida to the United States?',
                    options: ['France', 'Britain', 'Spain', 'Mexico'],
                    correctIndex: 2,
                },
            },
        ],
    },
    {
        // Day 2 — March 4
        dateLabel: 'March 4',
        events: [
            {
                title: 'US Constitution Takes Effect',
                year: 1789,
                location: 'New York City, USA',
                description: 'The United States Constitution officially went into effect as the new framework of government, replacing the Articles of Confederation. The first Congress convened in New York City, the temporary capital.',
                question: {
                    prompt: 'What document did the US Constitution replace?',
                    options: ['The Magna Carta', 'The Bill of Rights', 'The Articles of Confederation', 'The Declaration of Independence'],
                    correctIndex: 2,
                },
            },
            {
                title: 'Swan Lake Premieres in Moscow',
                year: 1877,
                location: 'Moscow, Russia',
                description: 'Tchaikovsky\'s Swan Lake received its world premiere at the Bolshoi Theatre. The initial reception was lukewarm, but it would later become the most famous ballet in history.',
                question: {
                    prompt: 'Who composed Swan Lake?',
                    options: ['Stravinsky', 'Rachmaninoff', 'Tchaikovsky', 'Prokofiev'],
                    correctIndex: 2,
                },
            },
            {
                title: 'Vermont Joins the Union',
                year: 1791,
                location: 'Vermont, USA',
                description: 'Vermont was admitted as the 14th state \u2014 the first to join after the original thirteen colonies. It had operated as an independent republic since 1777, with its own constitution that banned slavery.',
                question: {
                    prompt: 'What was notable about Vermont\'s 1777 constitution?',
                    options: ['It established a monarchy', 'It banned slavery', 'It was written in French', 'It gave women the vote'],
                    correctIndex: 1,
                },
            },
        ],
    },
    {
        // Day 3 — March 5
        dateLabel: 'March 5',
        events: [
            {
                title: 'The Boston Massacre',
                year: 1770,
                location: 'Boston, Massachusetts',
                description: 'British soldiers fired into a crowd of colonists, killing five people. The event became a rallying point for the anti-British movement and helped fuel the American Revolution five years later.',
                question: {
                    prompt: 'How many colonists were killed in the Boston Massacre?',
                    options: ['Three', 'Five', 'Eight', 'Twelve'],
                    correctIndex: 1,
                },
            },
            {
                title: 'Joseph Stalin Dies',
                year: 1953,
                location: 'Moscow, Soviet Union',
                description: 'Soviet leader Joseph Stalin died after suffering a stroke, ending nearly three decades of totalitarian rule. His death set off a power struggle that was eventually won by Nikita Khrushchev.',
                question: {
                    prompt: 'Who succeeded Stalin as the leader of the Soviet Union?',
                    options: ['Brezhnev', 'Khrushchev', 'Molotov', 'Malenkov'],
                    correctIndex: 1,
                },
            },
            {
                title: 'Gerardus Mercator Is Born',
                year: 1512,
                location: 'Rupelmonde, Flanders',
                description: 'The cartographer who would create the most influential map projection in history was born. The Mercator projection, published in 1569, became the standard for nautical navigation for centuries.',
                question: {
                    prompt: 'What is Mercator most famous for?',
                    options: ['Discovering a continent', 'A map projection', 'Inventing the compass', 'Circumnavigating the globe'],
                    correctIndex: 1,
                },
            },
        ],
    },
    {
        // Day 4 — March 6
        dateLabel: 'March 6',
        events: [
            {
                title: 'The Fall of the Alamo',
                year: 1836,
                location: 'San Antonio, Texas',
                description: 'After a 13-day siege, Mexican forces under General Santa Anna overran the Alamo mission. Nearly all of the roughly 200 Texan defenders were killed, but "Remember the Alamo!" became a battle cry that fueled Texas independence.',
                question: {
                    prompt: 'Who led the Mexican forces at the Battle of the Alamo?',
                    options: ['Pancho Villa', 'Santa Anna', 'Benito Ju\u00e1rez', 'Porfirio D\u00edaz'],
                    correctIndex: 1,
                },
            },
            {
                title: 'Mendeleev Presents the Periodic Table',
                year: 1869,
                location: 'Saint Petersburg, Russia',
                description: 'Dmitri Mendeleev presented his periodic table of elements to the Russian Chemical Society. He arranged elements by atomic weight and boldly left gaps for elements not yet discovered \u2014 predictions later proven correct.',
                question: {
                    prompt: 'What made Mendeleev\'s periodic table revolutionary?',
                    options: ['It included all known elements', 'It predicted undiscovered elements', 'It was the first table ever made', 'It sorted elements alphabetically'],
                    correctIndex: 1,
                },
            },
            {
                title: 'Ghana Gains Independence',
                year: 1957,
                location: 'Accra, Ghana',
                description: 'Ghana became the first sub-Saharan African country to gain independence from colonial rule, led by Kwame Nkrumah. It inspired a wave of decolonization across the continent.',
                question: {
                    prompt: 'Who led Ghana to independence?',
                    options: ['Jomo Kenyatta', 'Nelson Mandela', 'Kwame Nkrumah', 'Patrice Lumumba'],
                    correctIndex: 2,
                },
            },
        ],
    },
    {
        // Day 5 — March 7
        dateLabel: 'March 7',
        events: [
            {
                title: 'Bell Patents the Telephone',
                year: 1876,
                location: 'Washington, D.C., USA',
                description: 'Alexander Graham Bell received US patent No. 174,465 for the telephone, beating rival inventor Elisha Gray by just hours. Three days later, he made the first successful telephone call.',
                question: {
                    prompt: 'Who was Bell\'s rival in the race to patent the telephone?',
                    options: ['Thomas Edison', 'Nikola Tesla', 'Elisha Gray', 'Guglielmo Marconi'],
                    correctIndex: 2,
                },
            },
            {
                title: 'Bloody Sunday in Selma',
                year: 1965,
                location: 'Selma, Alabama, USA',
                description: 'Civil rights marchers crossing the Edmund Pettus Bridge were brutally attacked by state troopers with tear gas and clubs. The televised violence shocked the nation and led directly to the Voting Rights Act of 1965.',
                question: {
                    prompt: 'What legislation resulted from the events of Bloody Sunday?',
                    options: ['Civil Rights Act', 'Voting Rights Act', 'Emancipation Proclamation', 'Fair Housing Act'],
                    correctIndex: 1,
                },
            },
            {
                title: 'Monopoly Goes on Sale',
                year: 1935,
                location: 'USA',
                description: 'Parker Brothers began selling Monopoly, which would become the best-selling board game in the world. The game was based on earlier designs by Elizabeth Magie, whose original version was meant to demonstrate the problems of land monopolies.',
                question: {
                    prompt: 'Who originally designed the game that Monopoly was based on?',
                    options: ['Charles Darrow', 'Milton Bradley', 'Elizabeth Magie', 'George Parker'],
                    correctIndex: 2,
                },
            },
        ],
    },
    {
        // Day 6 — March 8
        dateLabel: 'March 8',
        events: [
            {
                title: 'International Women\u2019s Day Proposed',
                year: 1910,
                location: 'Copenhagen, Denmark',
                description: 'Clara Zetkin proposed the creation of an International Women\u2019s Day at the International Socialist Women\u2019s Conference. It was first celebrated in 1911 and is now observed worldwide on March 8.',
                question: {
                    prompt: 'Who proposed International Women\u2019s Day?',
                    options: ['Emmeline Pankhurst', 'Clara Zetkin', 'Rosa Luxemburg', 'Simone de Beauvoir'],
                    correctIndex: 1,
                },
            },
            {
                title: 'February Revolution Begins in Russia',
                year: 1917,
                location: 'Petrograd, Russia',
                description: 'On International Women\u2019s Day (February 23 in the Julian calendar), women textile workers in Petrograd went on strike, sparking the February Revolution that would topple Tsar Nicholas II within days.',
                question: {
                    prompt: 'What event sparked the February Revolution?',
                    options: ['A military mutiny', 'An assassination', 'A women\u2019s workers\u2019 strike', 'A food riot'],
                    correctIndex: 2,
                },
            },
            {
                title: 'Malaysian Airlines Flight 370 Disappears',
                year: 2014,
                location: 'Indian Ocean',
                description: 'Malaysian Airlines Flight 370 vanished during a flight from Kuala Lumpur to Beijing with 239 people aboard. Despite the largest search in aviation history, the aircraft has never been fully recovered.',
                question: {
                    prompt: 'Where was MH370 flying from when it disappeared?',
                    options: ['Singapore', 'Jakarta', 'Kuala Lumpur', 'Bangkok'],
                    correctIndex: 2,
                },
            },
        ],
    },
    {
        // Day 7 — March 9
        dateLabel: 'March 9',
        events: [
            {
                title: 'Barbie Doll Debuts',
                year: 1959,
                location: 'New York City, USA',
                description: 'The Barbie doll was unveiled at the American International Toy Fair by Mattel co-founder Ruth Handler. Named after her daughter Barbara, it became the best-selling fashion doll in history.',
                question: {
                    prompt: 'Who created the Barbie doll?',
                    options: ['Mary Quant', 'Ruth Handler', 'Coco Chanel', 'Estée Lauder'],
                    correctIndex: 1,
                },
            },
            {
                title: 'Pancho Villa Raids Columbus',
                year: 1916,
                location: 'Columbus, New Mexico, USA',
                description: 'Mexican revolutionary Pancho Villa led nearly 500 guerrillas in a cross-border raid on the US town of Columbus, killing 18 Americans. It prompted the US to send General Pershing on an unsuccessful punitive expedition into Mexico.',
                question: {
                    prompt: 'Which US general was sent to pursue Pancho Villa?',
                    options: ['Patton', 'MacArthur', 'Pershing', 'Eisenhower'],
                    correctIndex: 2,
                },
            },
            {
                title: 'Amerigo Vespucci Is Born',
                year: 1454,
                location: 'Florence, Italy',
                description: 'The explorer and navigator whose first name would lend itself to two continents was born in Florence. His voyages to the New World helped establish that the Americas were separate continents, not part of Asia.',
                question: {
                    prompt: 'What are the Americas named after?',
                    options: ['Christopher Columbus', 'Amerigo Vespucci', 'Ferdinand Magellan', 'Marco Polo'],
                    correctIndex: 1,
                },
            },
        ],
    },
    {
        // Day 8 — March 10
        dateLabel: 'March 10',
        events: [
            {
                title: 'First Telephone Call',
                year: 1876,
                location: 'Boston, Massachusetts, USA',
                description: 'Alexander Graham Bell made the first successful telephone call, speaking to his assistant Thomas Watson in the next room: "Mr. Watson, come here. I want to see you." It was just three days after receiving his patent.',
                question: {
                    prompt: 'What were the famous first words spoken on the telephone?',
                    options: ['"Can you hear me now?"', '"Mr. Watson, come here"', '"Hello, is anyone there?"', '"Testing, one two three"'],
                    correctIndex: 1,
                },
            },
            {
                title: 'Harriet Tubman Dies',
                year: 1913,
                location: 'Auburn, New York, USA',
                description: 'Harriet Tubman, the legendary conductor of the Underground Railroad who led roughly 70 enslaved people to freedom, died at age 91. She also served as a spy for the Union Army during the Civil War.',
                question: {
                    prompt: 'Approximately how many people did Harriet Tubman lead to freedom?',
                    options: ['About 20', 'About 70', 'About 200', 'About 500'],
                    correctIndex: 1,
                },
            },
            {
                title: 'Tibetan Uprising Begins',
                year: 1959,
                location: 'Lhasa, Tibet',
                description: 'Tens of thousands of Tibetans surrounded the Norbulingka Palace to prevent the Dalai Lama from being taken by Chinese forces. The uprising was crushed, and the Dalai Lama fled to India, where he has lived in exile ever since.',
                question: {
                    prompt: 'Where did the Dalai Lama flee after the 1959 uprising?',
                    options: ['Nepal', 'India', 'Bhutan', 'Mongolia'],
                    correctIndex: 1,
                },
            },
        ],
    },
    {
        // Day 9 — March 11
        dateLabel: 'March 11',
        events: [
            {
                title: 'T\u014dhoku Earthquake and Tsunami',
                year: 2011,
                location: 'T\u014dhoku, Japan',
                description: 'A magnitude 9.1 earthquake struck off the coast of Japan, triggering a massive tsunami that devastated coastal communities and caused the Fukushima nuclear disaster. Nearly 20,000 people lost their lives.',
                question: {
                    prompt: 'What nuclear disaster was caused by the 2011 T\u014dhoku tsunami?',
                    options: ['Chernobyl', 'Three Mile Island', 'Fukushima', 'Kashiwazaki'],
                    correctIndex: 2,
                },
            },
            {
                title: 'Gorbachev Becomes Soviet Leader',
                year: 1985,
                location: 'Moscow, Soviet Union',
                description: 'Mikhail Gorbachev became General Secretary of the Communist Party at age 54, making him the youngest Soviet leader in decades. His reforms of glasnost and perestroika would eventually lead to the dissolution of the USSR.',
                question: {
                    prompt: 'Which reform policy of Gorbachev meant "openness"?',
                    options: ['Perestroika', 'Glasnost', 'Detente', 'Ostpolitik'],
                    correctIndex: 1,
                },
            },
            {
                title: 'First Cases of the Spanish Flu',
                year: 1918,
                location: 'Fort Riley, Kansas, USA',
                description: 'The first known cases of the 1918 influenza pandemic were reported at a US Army camp. The Spanish Flu would go on to infect a third of the world\u2019s population and kill an estimated 50\u2013100 million people.',
                question: {
                    prompt: 'Where were the first known cases of the Spanish Flu reported?',
                    options: ['Spain', 'France', 'Fort Riley, Kansas', 'New York City'],
                    correctIndex: 2,
                },
            },
        ],
    },
];

// March 2, 2026 is day 0. Calculate which day index we're on today.
export function getTodaysDailyQuiz() {
    const start = new Date(2026, 2, 2); // March 2, 2026 (month is 0-indexed)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    const dayIndex = ((diffDays % 10) + 10) % 10; // handles negative values
    return DAILY_QUIZ_DAYS[dayIndex];
}

// XP per correct answer in daily quiz (double the normal 10)
export const DAILY_QUIZ_XP_PER_CORRECT = 20;
