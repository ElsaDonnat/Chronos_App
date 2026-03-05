/**
 * Sound effects (Web Audio API) and haptic feedback (@capacitor/haptics).
 *
 * Sounds are generated programmatically — no audio files needed.
 * Layered sine waves with lowpass filtering for a warm, polished feel
 * reminiscent of wooden marimba / bell tones.
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

/**
 * Play a rich, filtered tone with natural ADSR envelope.
 * Layers fundamental + octave partial through a lowpass filter
 * for a warm marimba-like sound instead of raw oscillator blips.
 */
function playNote(freq, duration, startDelay = 0, gain = 0.05) {
  if (!config.soundVolume) return;
  try {
    const ac = getAudioContext();
    const scaledGain = gain * config.soundVolume;
    const start = ac.currentTime + startDelay;

    // Master gain for this note
    const master = ac.createGain();
    master.gain.value = 0;
    master.connect(ac.destination);

    // Lowpass filter — removes harsh upper harmonics
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = Math.min(freq * 4, 6000);
    filter.Q.value = 0.7;
    filter.connect(master);

    // Fundamental (sine — clean, warm)
    const osc1 = ac.createOscillator();
    const g1 = ac.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = freq;
    g1.gain.value = 1.0;
    osc1.connect(g1);
    g1.connect(filter);

    // Octave partial (sine, softer) — adds body
    const osc2 = ac.createOscillator();
    const g2 = ac.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    g2.gain.value = 0.15;
    osc2.connect(g2);
    g2.connect(filter);

    // Sub-octave body (very soft, adds warmth)
    const osc3 = ac.createOscillator();
    const g3 = ac.createGain();
    osc3.type = 'sine';
    osc3.frequency.value = freq * 0.5;
    g3.gain.value = 0.12;
    osc3.connect(g3);
    g3.connect(filter);

    // Natural ADSR envelope — gentle attack, smooth exponential decay
    const attack = 0.015;
    const decayStart = start + attack;
    master.gain.setValueAtTime(0, start);
    master.gain.linearRampToValueAtTime(scaledGain, decayStart);
    // Sustain briefly then natural decay
    master.gain.setTargetAtTime(scaledGain * 0.6, decayStart, duration * 0.15);
    master.gain.setTargetAtTime(0.0001, decayStart + duration * 0.3, duration * 0.25);

    const endTime = start + duration + 0.1;
    osc1.start(start); osc1.stop(endTime);
    osc2.start(start); osc2.stop(endTime);
    osc3.start(start); osc3.stop(endTime);
  } catch {
    // Silently fail — audio not critical
  }
}

/**
 * Play a chord (multiple notes simultaneously) for a richer sound.
 * Each note gets reduced gain to avoid clipping.
 */
function playChord(freqs, duration, startDelay = 0, gain = 0.05) {
  const perNote = gain / Math.sqrt(freqs.length);
  freqs.forEach(f => playNote(f, duration, startDelay, perNote));
}

// ── Lightweight UI sound primitive ───────────────────────────────────

/** Ultra-short single-sine tone for UI micro-interactions. */
function playTick(freq, duration, startDelay = 0, gain = 0.025) {
  if (!config.soundVolume) return;
  try {
    const ac = getAudioContext();
    const scaledGain = gain * config.soundVolume;
    const start = ac.currentTime + startDelay;

    const osc = ac.createOscillator();
    const vol = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;

    // Soft lowpass to remove any harshness
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = Math.min(freq * 3, 4000);
    filter.Q.value = 0.5;

    osc.connect(filter);
    filter.connect(vol);
    vol.connect(ac.destination);

    vol.gain.setValueAtTime(0, start);
    vol.gain.linearRampToValueAtTime(scaledGain, start + 0.008);
    vol.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.start(start);
    osc.stop(start + duration + 0.01);
  } catch {
    // Silently fail
  }
}

// ── Haptic primitives ───────────────────────────────────────────────

function hapticNotification(type) {
  if (!config.hapticsEnabled) return;
  if (Capacitor.getPlatform() === 'web') return;
  try {
    Haptics.notification({ type });
  } catch {
    // Silently fail
  }
}

function hapticImpact(style) {
  if (!config.hapticsEnabled) return;
  if (Capacitor.getPlatform() === 'web') return;
  try {
    Haptics.impact({ style });
  } catch {
    // Silently fail
  }
}

// ── Public feedback functions ───────────────────────────────────────

/** Green answer — warm major chord bloom (C5 + E5 + G5) */
export function correct() {
  playChord([523.25, 659.25, 783.99], 0.35, 0, 0.05);       // C major triad
  playNote(1046.50, 0.25, 0.06, 0.015);                      // C6 shimmer
  hapticNotification(NotificationType.Success);
}

/** Yellow answer — gentle sus4 resolve (Fsus4 → F) */
export function close() {
  playChord([349.23, 466.16], 0.20, 0, 0.035);               // F4 + Bb4
  playNote(440.00, 0.25, 0.08, 0.025);                       // A4 resolve
  hapticNotification(NotificationType.Warning);
}

/** Red answer — soft minor second cluster, gentle */
export function wrong() {
  playChord([311.13, 329.63], 0.30, 0, 0.03);                // Eb4 + E4 dissonance
  playNote(293.66, 0.35, 0.10, 0.02);                        // D4 descend
  hapticNotification(NotificationType.Error);
}

/** Lesson or quiz complete — ascending major 7th arpeggio with bloom */
export function complete() {
  playNote(261.63, 0.25, 0, 0.04);                           // C4
  playNote(329.63, 0.25, 0.12, 0.04);                        // E4
  playNote(392.00, 0.25, 0.24, 0.04);                        // G4
  playChord([523.25, 659.25, 783.99], 0.45, 0.36, 0.04);     // C5 major chord bloom
  hapticImpact(ImpactStyle.Medium);
}

/** Achievement unlocked — bright ascending sparkle with final chord */
export function achievement() {
  playNote(523.25, 0.18, 0, 0.04);                           // C5
  playNote(659.25, 0.18, 0.08, 0.04);                        // E5
  playNote(783.99, 0.18, 0.16, 0.04);                        // G5
  playChord([1046.50, 1318.51, 1567.98], 0.50, 0.26, 0.035); // C6 major chord
  playNote(2093.00, 0.40, 0.30, 0.008);                      // C7 faint sparkle
  hapticImpact(ImpactStyle.Heavy);
}

/** Heart lost — gentle descending minor 3rd */
export function heartLost() {
  playChord([493.88, 587.33], 0.25, 0, 0.035);               // B4 + D5
  playNote(392.00, 0.35, 0.12, 0.025);                       // G4 drop
  hapticNotification(NotificationType.Error);
}

/** Game over — slow descending minor with fading body */
export function gameOver() {
  playChord([329.63, 392.00], 0.30, 0, 0.03);                // E4 + G4
  playChord([261.63, 311.13], 0.30, 0.20, 0.025);            // C4 + Eb4
  playNote(220.00, 0.50, 0.40, 0.02);                        // A3 low fade
  hapticImpact(ImpactStyle.Heavy);
}

/** Convenience: play feedback by score string */
export function forScore(score) {
  if (score === 'green') correct();
  else if (score === 'yellow') close();
  else if (score === 'red') wrong();
}

// ── UI micro-interaction sounds ─────────────────────────────────────

/** Soft pop for primary action buttons */
export function tap() {
  playTick(800, 0.06, 0, 0.02);
  playTick(1200, 0.04, 0, 0.008);
  hapticImpact(ImpactStyle.Light);
}

/** Light click for selecting a quiz option (before result) */
export function select() {
  playTick(600, 0.05, 0, 0.018);
  playTick(900, 0.03, 0.01, 0.006);
}

/** Subtle tick for tab navigation */
export function tabSwitch() {
  playTick(500, 0.04, 0, 0.015);
}

/** Soft rising sweep for card/content reveals */
export function cardReveal() {
  playTick(400, 0.10, 0, 0.012);
  playTick(600, 0.08, 0.03, 0.010);
  playTick(800, 0.06, 0.06, 0.006);
}

/** Gentle swoosh for modal openings */
export function modalOpen() {
  playTick(300, 0.12, 0, 0.012);
  playTick(500, 0.10, 0.04, 0.010);
}

/** Tiny click for toggle switches */
export function toggleClick() {
  playTick(700, 0.035, 0, 0.015);
}

/** Small sparkle for star toggle */
export function starPing() {
  playTick(1200, 0.08, 0, 0.015);
  playTick(1800, 0.06, 0.03, 0.010);
}
