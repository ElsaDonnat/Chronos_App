/**
 * Sound effects (Web Audio API) and haptic feedback (@capacitor/haptics).
 *
 * Sounds are generated programmatically — no audio files needed.
 * All tones use sine waves at low gain for a clean, unobtrusive feel.
 *
 * Usage:
 *   import * as feedback from '../services/feedback';
 *   feedback.configure({ soundEnabled: true, hapticsEnabled: true });
 *   feedback.correct();   // green answer
 *   feedback.close();     // yellow answer
 *   feedback.wrong();     // red answer
 *   feedback.complete();  // lesson/quiz finished
 *   feedback.achievement(); // badge unlocked
 */

import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// ── Configuration (synced from AppContext) ──────────────────────────

let config = { soundEnabled: true, hapticsEnabled: true };

export function configure({ soundEnabled, hapticsEnabled }) {
  config = { soundEnabled, hapticsEnabled };
}

// ── Audio Context (lazy) ────────────────────────────────────────────

let ctx = null;

function getAudioContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// ── Tone primitives ─────────────────────────────────────────────────

function playTone(freq, duration, startDelay = 0, gain = 0.12) {
  if (!config.soundEnabled) return;
  try {
    const ac = getAudioContext();
    const osc = ac.createOscillator();
    const vol = ac.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;
    vol.gain.value = 0;

    osc.connect(vol);
    vol.connect(ac.destination);

    const start = ac.currentTime + startDelay;
    // Quick attack
    vol.gain.setValueAtTime(0, start);
    vol.gain.linearRampToValueAtTime(gain, start + 0.015);
    // Sustain then decay
    vol.gain.setValueAtTime(gain, start + duration * 0.6);
    vol.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.start(start);
    osc.stop(start + duration);
  } catch { /* silent */
    // Silently fail — audio not critical
  }
}

// ── Haptic primitives ───────────────────────────────────────────────

function hapticNotification(type) {
  if (!config.hapticsEnabled) return;
  if (Capacitor.getPlatform() === 'web') return;
  try {
    Haptics.notification({ type });
  } catch { /* silent */
    // Silently fail
  }
}

function hapticImpact(style) {
  if (!config.hapticsEnabled) return;
  if (Capacitor.getPlatform() === 'web') return;
  try {
    Haptics.impact({ style });
  } catch { /* silent */
    // Silently fail
  }
}

// ── Public feedback functions ───────────────────────────────────────

/** Green answer — ascending minor third (C5 → E♭5) */
export function correct() {
  playTone(523.25, 0.10, 0, 0.12);       // C5
  playTone(622.25, 0.12, 0.08, 0.10);    // E♭5
  hapticNotification(NotificationType.Success);
}

/** Yellow answer — single warm tone (D5) */
export function close() {
  playTone(587.33, 0.10, 0, 0.09);       // D5
  hapticNotification(NotificationType.Warning);
}

/** Red answer — soft descending minor second (E5 → E♭5) */
export function wrong() {
  playTone(659.25, 0.10, 0, 0.08);       // E5
  playTone(622.25, 0.14, 0.08, 0.06);    // E♭5
  hapticNotification(NotificationType.Error);
}

/** Lesson or quiz complete — ascending arpeggio (C5 → E5 → G5) */
export function complete() {
  playTone(523.25, 0.14, 0, 0.10);       // C5
  playTone(659.25, 0.14, 0.10, 0.10);    // E5
  playTone(783.99, 0.18, 0.20, 0.10);    // G5
  hapticImpact(ImpactStyle.Medium);
}

/** Achievement unlocked — bright sparkle (E5 → G5 → B5 → E6) */
export function achievement() {
  playTone(659.25, 0.12, 0, 0.10);       // E5
  playTone(783.99, 0.12, 0.09, 0.10);    // G5
  playTone(987.77, 0.12, 0.18, 0.10);    // B5
  playTone(1318.51, 0.20, 0.27, 0.08);   // E6
  hapticImpact(ImpactStyle.Heavy);
}

/** Heart lost — descending diminished (B4 → F4) */
export function heartLost() {
  playTone(493.88, 0.15, 0, 0.10);       // B4
  playTone(349.23, 0.20, 0.10, 0.08);    // F4
  hapticNotification(NotificationType.Error);
}

/** Game over — slow descending (G4 → E4 → C4) */
export function gameOver() {
  playTone(392.00, 0.18, 0, 0.08);       // G4
  playTone(329.63, 0.18, 0.15, 0.08);    // E4
  playTone(261.63, 0.25, 0.30, 0.06);    // C4
  hapticImpact(ImpactStyle.Heavy);
}

/** Convenience: play feedback by score string */
export function forScore(score) {
  if (score === 'green') correct();
  else if (score === 'yellow') close();
  else if (score === 'red') wrong();
}
