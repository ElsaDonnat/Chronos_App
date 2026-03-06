import Mascot from './Mascot';
import { Button } from './shared';

function getMessage(days) {
  if (days >= 7) return "It's been a while! I really missed you. Ready to pick up where we left off?";
  if (days >= 4) return "I missed you! Let's learn something new together.";
  return "I'm glad you're back, I was waiting for you.";
}

export default function WelcomeBackModal({ daysAway, onDismiss }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-5"
      style={{ backgroundColor: 'rgba(var(--color-ink-rgb), 0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 text-center animate-welcome-back"
        style={{ backgroundColor: 'var(--color-card)', boxShadow: 'var(--shadow-elevated)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center mb-3">
          <Mascot mood="celebrating" size={80} />
        </div>
        <h2
          className="text-xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink)' }}
        >
          Welcome!
        </h2>
        <p
          className="text-sm mb-5"
          style={{ color: 'var(--color-ink-secondary)', lineHeight: 1.5 }}
        >
          {getMessage(daysAway)}
        </p>
        <Button variant="primary" onClick={onDismiss}>
          Let's go! →
        </Button>
      </div>
    </div>
  );
}
