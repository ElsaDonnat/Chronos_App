import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LESSONS } from '../data/lessons';
import { getEventsByIds } from '../data/events';
import { Card, MasteryDots } from '../components/shared';
import LessonFlow from '../components/learn/LessonFlow';
import Lesson0Flow from '../components/learn/Lesson0Flow';
import Mascot from '../components/Mascot';

export default function LearnPage({ onSessionChange, registerBackHandler }) {
    const { state } = useApp();
    const [activeLessonId, setActiveLessonId] = useState(null);

    useEffect(() => {
        onSessionChange?.(!!activeLessonId);
    }, [activeLessonId, onSessionChange]);

    // Register back handler when in a lesson
    useEffect(() => {
        if (activeLessonId && registerBackHandler) {
            return registerBackHandler(() => setActiveLessonId(null));
        }
    }, [activeLessonId, registerBackHandler]);

    if (activeLessonId) {
        const lesson = LESSONS.find(l => l.id === activeLessonId);
        if (lesson?.isLesson0) {
            return <Lesson0Flow lesson={lesson} onComplete={() => setActiveLessonId(null)} />;
        }
        return <LessonFlow lesson={lesson} onComplete={() => setActiveLessonId(null)} />;
    }

    return (
        <div className="py-6">
            <div className="text-center mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-ink-muted)' }}>
                    Chapter 1
                </h2>
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                    The Story of Humanity
                </h1>
                <p className="text-sm mt-2" style={{ color: 'var(--color-ink-muted)' }}>
                    60 events across 16 lessons
                </p>
            </div>

            <div className="space-y-3">
                {LESSONS.map((lesson, index) => {
                    const isUnlocked = index === 0 || state.completedLessons[LESSONS[index - 1].id];
                    const isCompleted = state.completedLessons[lesson.id];
                    const isLesson0 = !!lesson.isLesson0;
                    const events = isLesson0 ? [] : getEventsByIds(lesson.eventIds);
                    const seenCount = isLesson0 ? 0 : lesson.eventIds.filter(id => state.seenEvents.includes(id)).length;
                    const masteryData = isLesson0 ? [] : lesson.eventIds.map(id => state.eventMastery[id]).filter(Boolean);

                    return (
                        <Card
                            key={lesson.id}
                            onClick={isUnlocked ? () => setActiveLessonId(lesson.id) : undefined}
                            className={`lesson-card-row animate-fade-in-up ${!isUnlocked ? 'opacity-50' : ''}`}
                            style={{
                                animationDelay: `${index * 60}ms`,
                                animationFillMode: 'backwards',
                                backgroundColor: isCompleted ? 'rgba(5, 150, 105, 0.04)' : 'var(--color-card)',
                            }}
                        >
                            <div className="flex items-center gap-4">
                                {/* Progress indicator */}
                                <div className="flex-shrink-0">
                                    {!isUnlocked ? (
                                        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(28, 25, 23, 0.06)' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                        </div>
                                    ) : isCompleted ? (
                                        <div className="w-11 h-11 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: isLesson0 ? 'var(--color-burgundy)' : 'var(--color-success)', boxShadow: isLesson0 ? '0 2px 8px rgba(139, 65, 87, 0.3)' : '0 2px 8px rgba(5, 150, 105, 0.3)' }}>
                                            {isLesson0 ? (
                                                <span className="text-base">🌍</span>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            )}
                                        </div>
                                    ) : isLesson0 ? (
                                        <div className="w-11 h-11 rounded-full flex items-center justify-center"
                                            style={{ border: '2px solid var(--color-burgundy)', background: 'var(--color-burgundy-soft)' }}>
                                            <span className="text-base">🌍</span>
                                        </div>
                                    ) : seenCount > 0 ? (
                                        <div className="w-11 h-11 rounded-full flex items-center justify-center relative"
                                            style={{ border: '2px solid var(--color-burgundy)' }}>
                                            <svg width="44" height="44" viewBox="0 0 44 44" className="absolute inset-0">
                                                <circle cx="22" cy="22" r="19" fill="none" stroke="var(--color-burgundy)" strokeWidth="2"
                                                    strokeDasharray={`${(seenCount / events.length) * 119} 119`}
                                                    strokeLinecap="round" transform="rotate(-90 22 22)" opacity="0.3" />
                                            </svg>
                                            <span className="text-xs font-bold" style={{ color: 'var(--color-burgundy)' }}>
                                                {seenCount}/{events.length}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="w-11 h-11 rounded-full flex items-center justify-center"
                                            style={{ border: '2px solid var(--color-ink-faint)' }}>
                                            <span className="text-sm font-bold" style={{ color: 'var(--color-ink-muted)' }}>
                                                {lesson.number}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-ink-faint)' }}>
                                            {isLesson0 ? 'Prologue' : `Lesson ${lesson.number}`}
                                        </span>
                                        {masteryData.length > 0 && (
                                            <div className="flex gap-0.5">
                                                {lesson.eventIds.slice(0, 7).map(id => {
                                                    const m = state.eventMastery[id];
                                                    return (
                                                        <div key={id} className="w-1.5 h-1.5 rounded-full" style={{
                                                            backgroundColor: m ? (
                                                                m.overallMastery >= 7 ? 'var(--color-success)' :
                                                                    m.overallMastery >= 3 ? 'var(--color-warning)' : 'var(--color-error)'
                                                            ) : 'var(--color-ink-faint)',
                                                            opacity: m ? 1 : 0.2
                                                        }} />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-base font-bold leading-tight" style={{ fontFamily: 'var(--font-serif)', color: isUnlocked ? 'var(--color-ink)' : 'var(--color-ink-faint)' }}>
                                        {lesson.title}
                                    </h3>
                                    <p className="text-sm mt-0.5" style={{ color: 'var(--color-ink-muted)' }}>
                                        {lesson.subtitle}
                                    </p>
                                </div>

                                {/* Right side: event count + arrow */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="text-xs hidden sm:block" style={{ color: 'var(--color-ink-faint)' }}>
                                        {isLesson0 ? '5 eras' : `${events.length} events`}
                                    </span>
                                    {isUnlocked && (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2" className="flex-shrink-0">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Empty state mascot at the bottom */}
            {Object.keys(state.completedLessons).length === 0 && (
                <div className="text-center mt-10 animate-fade-in">
                    <Mascot mood="happy" size={60} />
                    <p className="text-sm mt-2" style={{ color: 'var(--color-ink-muted)', fontFamily: 'var(--font-serif)' }}>
                        Start your journey through history!
                    </p>
                </div>
            )}
        </div>
    );
}
