import { Button, Card } from './shared';
import Mascot from './Mascot';

/**
 * Onboarding overlay screens. Rendered based on onboardingStep.
 * Steps handled here: 'welcome', 'post_lesson0', 'placement_offer'
 * ('guide_lesson0' is handled by LearnPage with spotlight, 'placement_active' by PlacementQuizFlow)
 */
export default function OnboardingOverlay({ step, dispatch }) {
    const skip = () => dispatch({ type: 'SET_ONBOARDING_STEP', step: 'complete' });

    if (step === 'welcome') {
        return (
            <div className="onboarding-overlay animate-fade-in">
                <div className="onboarding-card">
                    <Mascot mood="celebrating" size={72} />
                    <h1 className="text-2xl font-bold mt-5 mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                        Welcome to Chronos
                    </h1>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-ink-secondary)' }}>
                        Learn the story of humanity through 60 key events.
                        Each lesson teaches you 3 events, then you practice and build mastery over time.
                    </p>
                    <Button className="w-full" onClick={() => dispatch({ type: 'SET_ONBOARDING_STEP', step: 'guide_lesson0' })}>
                        Get Started
                    </Button>
                    <button onClick={skip} className="onboarding-skip mt-4">
                        Skip tutorial
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'post_lesson0') {
        return (
            <div className="onboarding-overlay animate-fade-in">
                <div className="onboarding-card">
                    <Mascot mood="happy" size={64} />
                    <h2 className="text-xl font-bold mt-4 mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                        Great start!
                    </h2>
                    <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--color-ink-secondary)' }}>
                        You just completed the overview of all five historical eras.
                    </p>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-ink-secondary)' }}>
                        Each lesson from here teaches 3 events with quizzes. Use the <strong>Practice</strong> tab to review
                        and the <strong>Timeline</strong> to explore.
                    </p>
                    <Button className="w-full" onClick={() => dispatch({ type: 'SET_ONBOARDING_STEP', step: 'placement_offer' })}>
                        Continue
                    </Button>
                    <button onClick={skip} className="onboarding-skip mt-4">
                        Skip tutorial
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'placement_offer') {
        return (
            <div className="onboarding-overlay animate-fade-in">
                <div className="onboarding-card">
                    <div className="mb-2"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-burgundy)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L2 9l10 6 10-6-10-6z" fill="var(--color-burgundy)" opacity="0.1" /><path d="M2 9l10 6 10-6" /><path d="M6 11.5v5c0 2 3 3.5 6 3.5s6-1.5 6-3.5v-5" /><line x1="22" y1="9" x2="22" y2="15" /></svg></div>
                    <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}>
                        Already know some history?
                    </h2>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-ink-secondary)' }}>
                        Take a quick placement quiz to skip lessons you already know.
                        Score 9+ out of 10 on each era to skip ahead.
                    </p>
                    <Button className="w-full mb-3" onClick={() => dispatch({ type: 'SET_ONBOARDING_STEP', step: 'placement_active' })}>
                        Take Placement Quiz
                    </Button>
                    <Button variant="secondary" className="w-full" onClick={skip}>
                        Start from the beginning
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}
