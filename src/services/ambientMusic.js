/**
 * Ambient music player — loops an MP3 track with smooth crossfade.
 *
 * Uses an HTML Audio element for efficient streaming of the file,
 * routed through Web Audio API gain nodes for smooth fade-in/out
 * and crossfade looping (so the track restarts seamlessly since
 * it naturally fades quiet at the beginning and end).
 *
 * Usage:
 *   import * as ambientMusic from '../services/ambientMusic';
 *   ambientMusic.configure({ musicEnabled: true });
 */

const TRACK_URL = '/bensound-silentwaves.mp3';
const FADE_IN_SEC = 3;
const FADE_OUT_SEC = 2;
const CROSSFADE_SEC = 6; // overlap between ending and restarting
const VOLUME_MAX = 0.02; // absolute gain ceiling (~30% of original)

// musicVolume: 0–1 user slider value; effectiveVolume = VOLUME_MAX * musicVolume
let config = { musicVolume: 0 };
function effectiveVolume() { return VOLUME_MAX * (config.musicVolume ?? 1); }

let ac = null;
let audio = null;
let sourceNode = null;
let gainNode = null;
let isPlaying = false;
let savedTime = 0; // remember position for resume after WebView kill
let yieldedToExternal = false; // true when system suspended us (another app has audio focus)
let ownSuspend = false; // guards against treating our own pause() as external

// ── AudioContext (lazy) ─────────────────────────────────────────────────
function getAudioContext() {
    if (!ac || ac.state === 'closed') {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        // Detect when the system suspends us (another app took audio focus)
        ac.addEventListener('statechange', () => {
            if (ac.state === 'suspended' && isPlaying && !ownSuspend) {
                yieldedToExternal = true;
                isPlaying = false;
            }
        });
    }
    return ac;
}

// ── Setup audio element + Web Audio routing ─────────────────────────────
function createAudio() {
    const ctx = getAudioContext();

    audio = new Audio(TRACK_URL);
    audio.preload = 'auto';
    audio.loop = false; // we handle looping ourselves for crossfade

    sourceNode = ctx.createMediaElementSource(audio);
    gainNode = ctx.createGain();
    gainNode.gain.value = 0;

    sourceNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    // When the track ends, restart it (crossfade is handled by timeupdate)
    audio.addEventListener('ended', () => {
        if (isPlaying && config.musicVolume > 0) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
            fadeIn();
        }
    });

    // Track position for resume & crossfade near end
    audio.addEventListener('timeupdate', () => {
        if (!audio) return;
        savedTime = audio.currentTime;
        if (!isPlaying || !audio.duration) return;
        const remaining = audio.duration - audio.currentTime;
        if (remaining <= CROSSFADE_SEC && remaining > 0) {
            const progress = remaining / CROSSFADE_SEC; // 1 → 0
            gainNode.gain.value = progress * effectiveVolume();
        }
    });
}

// ── Fade helpers ────────────────────────────────────────────────────────
function fadeIn() {
    if (!gainNode || !ac) return;
    const now = ac.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(effectiveVolume(), now + FADE_IN_SEC);
}

function fadeOut(duration = FADE_OUT_SEC) {
    if (!gainNode || !ac) return;
    const now = ac.currentTime;
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);
}

// ── Cleanup ─────────────────────────────────────────────────────────────
function cleanup() {
    if (audio) {
        savedTime = audio.currentTime || 0;
        audio.pause();
    }
    if (sourceNode) { try { sourceNode.disconnect(); } catch { /* */ } sourceNode = null; }
    if (gainNode) { try { gainNode.disconnect(); } catch { /* */ } gainNode = null; }
    audio = null;
}

// ── Public API ──────────────────────────────────────────────────────────
export async function start() {
    if (isPlaying || !config.musicVolume) return;
    try {
        // Don't override if another app currently has audio focus.
        // On mobile WebViews the AudioContext stays 'suspended' when focus is taken.
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            await ctx.resume();
            // Give the system a moment to reflect true focus state.
            await new Promise(r => setTimeout(r, 150));
            if (ctx.state !== 'running') return;
        }
        yieldedToExternal = false;
        if (!audio) createAudio();
        audio.currentTime = 0;
        savedTime = 0;
        audio.play().catch(() => {});
        fadeIn();
        isPlaying = true;
    } catch { /* silent */ }
}

export function stop() {
    if (!isPlaying) return;
    fadeOut();
    setTimeout(() => cleanup(), (FADE_OUT_SEC + 0.2) * 1000);
    isPlaying = false;
}

export function pause() {
    if (!isPlaying || !audio) return;
    try {
        savedTime = audio.currentTime || 0;
        if (ac && ac.state === 'running') {
            ownSuspend = true;
            ac.suspend().finally(() => { ownSuspend = false; });
        }
    } catch { /* silent */ }
}

export function resume() {
    if (!config.musicVolume) return;
    // Don't resume if we stopped because external audio took focus
    if (yieldedToExternal) return;

    // If audio nodes are still alive, just resume the AudioContext
    if (isPlaying && audio && ac) {
        try {
            if (ac.state === 'suspended') ac.resume();
            // Also make sure audio element is actually playing
            if (audio.paused) {
                audio.play().catch(() => {});
                fadeIn();
            }
        } catch { /* silent */ }
        return;
    }

    // Audio was lost (WebView killed, etc.) — recreate and resume from saved position
    if (!isPlaying && config.musicVolume) {
        try {
            createAudio();
            audio.currentTime = savedTime || 0;
            audio.play().catch(() => {});
            fadeIn();
            isPlaying = true;
        } catch { /* silent */ }
    }
}

export function configure({ musicVolume }) {
    const wasEnabled = config.musicVolume > 0;
    config.musicVolume = musicVolume ?? 1;
    const isEnabled = config.musicVolume > 0;

    if (isEnabled && !wasEnabled && !isPlaying) {
        // Volume raised from 0 — clear any external-yield flag and start
        yieldedToExternal = false;
        start();
    } else if (!isEnabled && wasEnabled && isPlaying) {
        stop();
    } else if (isPlaying && gainNode && ac) {
        // Volume changed while playing — update gain smoothly
        gainNode.gain.setTargetAtTime(effectiveVolume(), ac.currentTime, 0.3);
    }
}
