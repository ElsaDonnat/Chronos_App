/**
 * Sound effects (Web Audio API) and haptic feedback (@capacitor/haptics).
 *
 * Sounds are generated programmatically — no audio files needed.
 * Triangle waves with smooth envelopes for a warm, musical feel.
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

let config = { soundVolume: 1, hapticsEnabled: true };

export function configure({ soundVolume, hapticsEnabled }) {
  config = { soundVolume: soundVolume ?? 1, hapticsEnabled };
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

function playTone(freq, duration, startDelay = 0, gain = 0.12, waveform = 'triangle') {
  if (!config.soundVolume) return;
  try {
    const ac = getAudioContext();
    const osc = ac.createOscillator();
    const vol = ac.createGain();

    osc.type = waveform;
    osc.frequency.value = freq;
    vol.gain.value = 0;

    osc.connect(vol);
    vol.connect(ac.destination);

    const scaledGain = gain * config.soundVolume;
    const start = ac.currentTime + startDelay;
    // Smooth attack
    vol.gain.setValueAtTime(0, start);
    vol.gain.linearRampToValueAtTime(scaledGain, start + 0.02);
    // Sustain then smooth decay
    vol.gain.setValueAtTime(scaledGain, start + duration * 0.5);
    vol.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.start(start);
    osc.stop(start + duration);
  } catch { /* silent */
    // Silently fail — audio not critical
  }
}

/** Layer two slightly-detuned oscillators for a warm, rich timbre */
function playWarmTone(freq, duration, startDelay = 0, gain = 0.12) {
  playTone(freq, duration, startDelay, gain * 0.65, 'triangle');
  playTone(freq * 1.003, duration * 1.1, startDelay, gain * 0.35, 'sine');
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

/** Green answer — warm ascending major third (G4 → B4) */
export function correct() {
  playWarmTone(392.00, 0.12, 0, 0.12);       // G4
  playWarmTone(493.88, 0.15, 0.09, 0.11);    // B4
  hapticNotification(NotificationType.Success);
}

/** Yellow answer — gentle warm tone (A4) */
export function close() {
  playTone(440.00, 0.14, 0, 0.09);           // A4
  hapticNotification(NotificationType.Warning);
}

/** Red answer — soft descending minor second (G4 → F#4) */
export function wrong() {
  playTone(392.00, 0.12, 0, 0.07);           // G4
  playTone(369.99, 0.16, 0.09, 0.05);        // F#4
  hapticNotification(NotificationType.Error);
}

/** Lesson or quiz complete — warm ascending arpeggio (C4 → E4 → G4 → C5) */
export function complete() {
  playWarmTone(261.63, 0.14, 0, 0.10);       // C4
  playWarmTone(329.63, 0.14, 0.10, 0.10);    // E4
  playWarmTone(392.00, 0.14, 0.20, 0.10);    // G4
  playWarmTone(523.25, 0.22, 0.30, 0.10);    // C5
  hapticImpact(ImpactStyle.Medium);
}

/** Achievement unlocked — bright sparkle (C5 → E5 → G5 → C6) with shimmer */
export function achievement() {
  playWarmTone(523.25, 0.12, 0, 0.10);       // C5
  playWarmTone(659.25, 0.12, 0.08, 0.10);    // E5
  playWarmTone(783.99, 0.12, 0.16, 0.10);    // G5
  playWarmTone(1046.50, 0.25, 0.24, 0.09);   // C6
  playTone(2093.00, 0.30, 0.24, 0.03, 'sine'); // C7 faint sparkle
  hapticImpact(ImpactStyle.Heavy);
}

/** Heart lost — descending tritone (B4 → F4) */
export function heartLost() {
  playTone(493.88, 0.18, 0, 0.09);           // B4
  playTone(349.23, 0.22, 0.12, 0.07);        // F4
  hapticNotification(NotificationType.Error);
}

/** Game over — slow descending A minor (E4 → C4 → A3) */
export function gameOver() {
  playWarmTone(329.63, 0.20, 0, 0.08);       // E4
  playWarmTone(261.63, 0.20, 0.18, 0.07);    // C4
  playWarmTone(220.00, 0.30, 0.36, 0.06);    // A3
  hapticImpact(ImpactStyle.Heavy);
}

/** Convenience: play feedback by score string */
export function forScore(score) {
  if (score === 'green') correct();
  else if (score === 'yellow') close();
  else if (score === 'red') wrong();
}
