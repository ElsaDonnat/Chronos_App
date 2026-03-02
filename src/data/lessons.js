export const LESSONS = [
    {
        id: "lesson-0",
        number: 0,
        title: "The Big Picture",
        subtitle: "The five chapters of human history",
        mood: "Before we dive in, let\u2019s see the full map of where we\u2019re going\u2026",
        isLesson0: true,
        eventIds: [],
    },
    {
        id: "lesson-1",
        number: 1,
        title: "First Steps",
        subtitle: "The dawn of the human lineage",
        mood: "In the deep past, our ancestors took their first steps upright…",
        periodId: "prehistory",
        eventIds: ["f1", "f2", "f3"]
    },
    {
        id: "lesson-2",
        number: 2,
        title: "The Cognitive Leap",
        subtitle: "Language, art, and the first migrations",
        mood: "They learned to speak, to create, and to wander beyond the horizon…",
        eventIds: ["f4", "f5", "f6"]
    },
    {
        id: "lesson-3",
        number: 3,
        title: "Settling Down",
        subtitle: "Farming, villages, and the first cities",
        mood: "Nomads became farmers, and farmers built the first walls…",
        eventIds: ["f7", "f8", "f9"]
    },
    {
        id: "lesson-4",
        number: 4,
        title: "The Written Word",
        subtitle: "Sumer, Egypt, and the birth of writing",
        mood: "For the first time, human thought outlived a single life…",
        periodId: "ancient",
        eventIds: ["f10", "f11", "f12"]
    },
    {
        id: "lesson-5",
        number: 5,
        title: "Laws & Bronze",
        subtitle: "Hammurabi, the alphabet, and trade networks",
        mood: "Laws carved in stone, letters carved in clay…",
        eventIds: ["f13", "f14", "f15"]
    },
    {
        id: "lesson-6",
        number: 6,
        title: "Iron & Empires",
        subtitle: "Persia, Greece, and the age of iron",
        mood: "Iron replaced bronze, and with it came new empires…",
        eventIds: ["f16", "f17", "f18"]
    },
    {
        id: "lesson-7",
        number: 7,
        title: "The Classical World",
        subtitle: "Alexander, Rome, and philosophy",
        mood: "Philosophers debate while conquerors march…",
        eventIds: ["f19", "f20", "f21"]
    },
    {
        id: "lesson-8",
        number: 8,
        title: "Roads & Faiths",
        subtitle: "The Silk Road, Christianity, and empire",
        mood: "Caravans carry silk, soldiers carry eagles, pilgrims carry faith…",
        eventIds: ["f22", "f23", "f24"]
    },
    {
        id: "lesson-9",
        number: 9,
        title: "Faiths & Falls",
        subtitle: "The fall of Rome and the rise of Islam",
        mood: "An empire crumbles, but new faiths light the path forward…",
        periodId: "medieval",
        eventIds: ["f25", "f26", "f27"]
    },
    {
        id: "lesson-10",
        number: 10,
        title: "The Medieval World",
        subtitle: "Charlemagne, Vikings, and the first universities",
        mood: "Longships cut through fog while monks preserve ancient wisdom…",
        eventIds: ["f28", "f29", "f30"]
    },
    {
        id: "lesson-11",
        number: 11,
        title: "Conquerors & Crusaders",
        subtitle: "The Crusades, Genghis Khan, and the Magna Carta",
        mood: "Holy wars rage, an empire stretches from sea to sea…",
        eventIds: ["f31", "f32", "f33"]
    },
    {
        id: "lesson-12",
        number: 12,
        title: "Plague & Gunpowder",
        subtitle: "The Black Death, the Ottoman rise, and upheaval",
        mood: "Death swept the world, but survivors rebuilt stronger…",
        eventIds: ["f34", "f35", "f36"]
    },
    {
        id: "lesson-13",
        number: 13,
        title: "Renaissance Dawn",
        subtitle: "The printing press, exploration, and rebirth",
        mood: "From devastation springs rebirth — in art, in science, in spirit…",
        periodId: "earlymodern",
        eventIds: ["f37", "f38", "f39"]
    },
    {
        id: "lesson-14",
        number: 14,
        title: "New Worlds",
        subtitle: "The Reformation, conquest, and global trade",
        mood: "Ships cross unknown oceans and a monk challenges an empire of faith…",
        eventIds: ["f40", "f41", "f42"]
    },
    {
        id: "lesson-15",
        number: 15,
        title: "Reason & Revolution",
        subtitle: "Galileo, Enlightenment, and the American Revolution",
        mood: "Reason challenges faith, and colonies challenge kings…",
        eventIds: ["f43", "f44", "f45"]
    },
    {
        id: "lesson-16",
        number: 16,
        title: "The Age of Revolution",
        subtitle: "The French Revolution, Napoleon, and independence",
        mood: "The old order shatters in musket fire and the cry for liberty…",
        periodId: "modern",
        eventIds: ["f46", "f47", "f48"]
    },
    {
        id: "lesson-17",
        number: 17,
        title: "Industry & Empire",
        subtitle: "Steam, Darwin, and the scramble for power",
        mood: "Machines reshape the world and nations draw lines on maps…",
        eventIds: ["f49", "f50", "f51"]
    },
    {
        id: "lesson-18",
        number: 18,
        title: "The World at War",
        subtitle: "World War I, revolution, and aftermath",
        mood: "The guns of August shatter a century of peace…",
        eventIds: ["f52", "f53", "f54"]
    },
    {
        id: "lesson-19",
        number: 19,
        title: "Fire & Ashes",
        subtitle: "World War II, the atomic bomb, and the United Nations",
        mood: "The world burns again, then vows: never again…",
        eventIds: ["f55", "f56", "f57"]
    },
    {
        id: "lesson-20",
        number: 20,
        title: "The Modern World",
        subtitle: "The Cold War, the internet, and the 21st century",
        mood: "Walls fall, networks connect, and a new millennium dawns…",
        eventIds: ["f58", "f59", "f60"]
    }
];

// ─── Era-based quiz groups for placement quizzes ───
export const ERA_QUIZ_GROUPS = [
    {
        id: 'prehistory',
        label: 'Prehistory',
        lessonIds: ['lesson-1', 'lesson-2', 'lesson-3'],
        get eventIds() {
            return this.lessonIds.flatMap(lid => LESSONS.find(l => l.id === lid)?.eventIds || []);
        },
        questionCount: 9,
        passThreshold: 9, // ceil(0.9 * 9)
    },
    {
        id: 'ancient',
        label: 'The Ancient World',
        lessonIds: ['lesson-4', 'lesson-5', 'lesson-6', 'lesson-7', 'lesson-8'],
        get eventIds() {
            return this.lessonIds.flatMap(lid => LESSONS.find(l => l.id === lid)?.eventIds || []);
        },
        questionCount: 10,
        passThreshold: 9,
    },
    {
        id: 'medieval',
        label: 'The Medieval World',
        lessonIds: ['lesson-9', 'lesson-10', 'lesson-11', 'lesson-12'],
        get eventIds() {
            return this.lessonIds.flatMap(lid => LESSONS.find(l => l.id === lid)?.eventIds || []);
        },
        questionCount: 10,
        passThreshold: 9,
    },
    {
        id: 'earlymodern',
        label: 'The Early Modern Period',
        lessonIds: ['lesson-13', 'lesson-14', 'lesson-15'],
        get eventIds() {
            return this.lessonIds.flatMap(lid => LESSONS.find(l => l.id === lid)?.eventIds || []);
        },
        questionCount: 9,
        passThreshold: 9,
    },
    {
        id: 'modern',
        label: 'The Modern World',
        lessonIds: ['lesson-16', 'lesson-17', 'lesson-18', 'lesson-19', 'lesson-20'],
        get eventIds() {
            return this.lessonIds.flatMap(lid => LESSONS.find(l => l.id === lid)?.eventIds || []);
        },
        questionCount: 10,
        passThreshold: 9,
    },
];

export function getEraQuizGroup(eraId) {
    return ERA_QUIZ_GROUPS.find(g => g.id === eraId);
}
