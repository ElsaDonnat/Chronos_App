/**
 * Text sharing via Web Share API with clipboard fallback.
 */

const STORE_URL = 'https://play.google.com/store/apps/details?id=com.elsadonnat.chronos';

/**
 * Share text content. Uses Web Share API on Android/mobile,
 * falls back to clipboard copy on desktop.
 * @returns {Promise<'shared'|'copied'|'dismissed'>}
 */
export async function shareText({ title, text }) {
    if (navigator.share) {
        try {
            await navigator.share({ title, text });
            return 'shared';
        } catch (e) {
            if (e.name === 'AbortError') return 'dismissed';
        }
    }

    try {
        await navigator.clipboard.writeText(text);
        return 'copied';
    } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return 'copied';
    }
}

export function buildLessonShareText({ lessonTitle, greenCount, totalQuestions, xp, streak }) {
    const lines = [`I just completed \‘${lessonTitle}\’ on Chronos!`];
    let stats = `${greenCount}/${totalQuestions} exact \· +${xp} XP`;
    if (streak > 1) stats += ` \· ${streak}-day streak \�\�`;
    lines.push(stats);
    lines.push('', `Learn history with Chronos \— ${STORE_URL}`);
    return lines.join('\n');
}

export function buildPracticeShareText({ sessionMode, greenCount, totalQuestions, perfectSession }) {
    const lines = [];
    if (perfectSession) {
        lines.push('Perfect practice session on Chronos! \✨');
    } else {
        lines.push('Practice session complete on Chronos!');
    }
    lines.push(`${sessionMode} \· ${greenCount}/${totalQuestions} exact`);
    lines.push('', `Learn history with Chronos \— ${STORE_URL}`);
    return lines.join('\n');
}

export function buildDailyQuizShareText({ correctCount, totalEvents, xpEarned, dateLabel }) {
    const lines = [];
    if (correctCount === totalEvents) {
        lines.push(`I aced today\’s Chronos daily quiz! \�\�`);
    } else {
        lines.push(`I scored ${correctCount}/${totalEvents} on today\’s Chronos daily quiz!`);
    }
    lines.push(`${dateLabel} \· +${xpEarned} XP (2\× bonus!)`);
    lines.push('', `Learn history with Chronos \— ${STORE_URL}`);
    return lines.join('\n');
}

export function buildStreakShareText({ currentStreak }) {
    const lines = [];
    if (currentStreak >= 7) {
        lines.push(`I\’m on a ${currentStreak}-day learning streak on Chronos! \�\�`);
        lines.push('Can you beat it?');
    } else {
        lines.push(`I\’ve been learning history ${currentStreak} day${currentStreak === 1 ? '' : 's'} in a row on Chronos! \�\�`);
    }
    lines.push('', `Learn history with Chronos \— ${STORE_URL}`);
    return lines.join('\n');
}
