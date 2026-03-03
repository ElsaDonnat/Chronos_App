/**
 * Procedural ambient music generator — ancient Roman / antiquity style.
 *
 * Three layers:
 *   1. Warm drone pad — detuned oscillators at D2 + A2 (root + fifth)
 *   2. Gentle lyre plucks — randomized Dorian mode notes with fast attack / decay
 *   3. Ambient wind texture — filtered looped white noise
 *
 * Usage:
 *   import * as ambientMusic from '../services/ambientMusic';
 *   ambientMusic.configure({ musicEnabled: true });
 */

let config = { musicEnabled: false };
let ac = null;
let isPlaying = false;
let masterGain = null;
let droneOscillators = [];
let droneGainNode = null;
let windSource = null;
let windGainNode = null;
let pluckTimeout = null;

// ── Dorian mode on D (frequencies across octaves 3–5) ──────────────────
const DORIAN_FREQS = [
    // Octave 3: D E F G A B C
    146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63,
    // Octave 4
    293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25,
    // Octave 5 (sparingly, for shimmer)
    587.33, 659.25,
];

const DRONE_ROOT = 73.42;  // D2
const DRONE_FIFTH = 110.00; // A2

// ── AudioContext (lazy) ─────────────────────────────────────────────────
function getAudioContext() {
    if (!ac) {
        ac = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
}

// ── Layer 1: Warm drone pad ─────────────────────────────────────────────
function createDrone() {
    const ctx = getAudioContext();
    droneGainNode = ctx.createGain();
    droneGainNode.gain.value = 0;
    droneGainNode.connect(masterGain);

    // Root (D2) — two slightly detuned sines for slow beating
    for (const detune of [-4, 4]) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = DRONE_ROOT;
        osc.detune.value = detune;
        osc.connect(droneGainNode);
        osc.start();
        droneOscillators.push(osc);
    }

    // Fifth (A2) — two detuned sines, slightly quieter
    const fifthGain = ctx.createGain();
    fifthGain.gain.value = 0.7;
    fifthGain.connect(droneGainNode);
    for (const detune of [-3, 3]) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = DRONE_FIFTH;
        osc.detune.value = detune;
        osc.connect(fifthGain);
        osc.start();
        droneOscillators.push(osc);
    }

    // Harmonic richness — triangle one octave above root, very quiet
    const harmGain = ctx.createGain();
    harmGain.gain.value = 0.15;
    harmGain.connect(droneGainNode);
    const harmOsc = ctx.createOscillator();
    harmOsc.type = 'triangle';
    harmOsc.frequency.value = DRONE_ROOT * 2;
    harmOsc.connect(harmGain);
    harmOsc.start();
    droneOscillators.push(harmOsc);

    // Slow fade in (3s)
    const now = ctx.currentTime;
    droneGainNode.gain.setValueAtTime(0, now);
    droneGainNode.gain.linearRampToValueAtTime(0.5, now + 3);
}

// ── Layer 2: Gentle lyre plucks ─────────────────────────────────────────
function playPluck() {
    if (!isPlaying || !config.musicEnabled) return;
    try {
        const ctx = getAudioContext();
        const freq = DORIAN_FREQS[Math.floor(Math.random() * DORIAN_FREQS.length)];
        const duration = 0.8 + Math.random() * 0.7;
        const gain = 0.03 + Math.random() * 0.04;

        const osc = ctx.createOscillator();
        const vol = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        osc.connect(vol);
        vol.connect(masterGain);

        const now = ctx.currentTime;
        vol.gain.setValueAtTime(0, now);
        vol.gain.linearRampToValueAtTime(gain, now + 0.005);
        vol.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.start(now);
        osc.stop(now + duration + 0.05);

        // 30% chance: play a second note (interval of a 3rd or 5th)
        if (Math.random() < 0.3) {
            const intervals = [1.25, 1.333, 1.5];
            const secondFreq = freq * intervals[Math.floor(Math.random() * intervals.length)];
            if (secondFreq < 800) {
                const osc2 = ctx.createOscillator();
                const vol2 = ctx.createGain();
                osc2.type = 'triangle';
                osc2.frequency.value = secondFreq;
                osc2.connect(vol2);
                vol2.connect(masterGain);
                const delay = 0.08 + Math.random() * 0.06;
                vol2.gain.setValueAtTime(0, now + delay);
                vol2.gain.linearRampToValueAtTime(gain * 0.7, now + delay + 0.005);
                vol2.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
                osc2.start(now + delay);
                osc2.stop(now + delay + duration + 0.05);
            }
        }
    } catch { /* silent */ }
}

function startPluckScheduler() {
    function scheduleNext() {
        if (!isPlaying) return;
        const delay = 2000 + Math.random() * 3000; // 2–5 seconds
        pluckTimeout = setTimeout(() => {
            playPluck();
            scheduleNext();
        }, delay);
    }
    pluckTimeout = setTimeout(() => {
        playPluck();
        scheduleNext();
    }, 1500);
}

// ── Layer 3: Wind texture ───────────────────────────────────────────────
function createWindTexture() {
    const ctx = getAudioContext();

    // 2-second white-noise buffer, looped
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    windSource = ctx.createBufferSource();
    windSource.buffer = buffer;
    windSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 0.5;

    windGainNode = ctx.createGain();
    windGainNode.gain.value = 0;

    windSource.connect(filter);
    filter.connect(windGainNode);
    windGainNode.connect(masterGain);
    windSource.start();

    // Slow fade in (4s)
    const now = ctx.currentTime;
    windGainNode.gain.setValueAtTime(0, now);
    windGainNode.gain.linearRampToValueAtTime(0.025, now + 4);
}

// ── Cleanup ─────────────────────────────────────────────────────────────
function cleanupNodes() {
    try {
        for (const osc of droneOscillators) {
            osc.stop();
            osc.disconnect();
        }
    } catch { /* already stopped */ }
    droneOscillators = [];
    if (droneGainNode) { droneGainNode.disconnect(); droneGainNode = null; }

    try {
        if (windSource) { windSource.stop(); windSource.disconnect(); }
    } catch { /* already stopped */ }
    windSource = null;
    if (windGainNode) { windGainNode.disconnect(); windGainNode = null; }

    if (masterGain) { masterGain.disconnect(); masterGain = null; }
}

// ── Public API ──────────────────────────────────────────────────────────
export function start() {
    if (isPlaying || !config.musicEnabled) return;
    try {
        const ctx = getAudioContext();
        masterGain = ctx.createGain();
        masterGain.gain.value = 0.07;
        masterGain.connect(ctx.destination);

        createDrone();
        createWindTexture();
        startPluckScheduler();
        isPlaying = true;
    } catch { /* silent */ }
}

export function stop() {
    if (!isPlaying) return;
    try {
        const ctx = getAudioContext();
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
        setTimeout(() => cleanupNodes(), 2200);
    } catch {
        cleanupNodes();
    }
    clearTimeout(pluckTimeout);
    pluckTimeout = null;
    isPlaying = false;
}

export function pause() {
    if (!isPlaying || !ac) return;
    try { if (ac.state === 'running') ac.suspend(); } catch { /* silent */ }
}

export function resume() {
    if (!isPlaying || !ac) return;
    try { if (ac.state === 'suspended') ac.resume(); } catch { /* silent */ }
}

export function configure({ musicEnabled }) {
    const wasEnabled = config.musicEnabled;
    config.musicEnabled = musicEnabled;

    if (musicEnabled && !wasEnabled && !isPlaying) {
        start();
    } else if (!musicEnabled && wasEnabled && isPlaying) {
        stop();
    }
}
