import { Button, Card } from './shared';
import Mascot from './Mascot';

/**
 * Onboarding overlay screens. Rendered based on onboardingStep.
 * Steps handled here: 'welcome'
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
                    <button onClick={skip} className="onboarding-skip">
                        Skip tutorial
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
