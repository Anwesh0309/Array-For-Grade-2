import audioMap from './audioMap.js';

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL    = 'eleven_multilingual_v2';

const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// ── Internal state ───────────────────────────────────────────────────────────
let _audioEnabled  = true;
let activeQueueId  = null;   // Symbol id of the currently running queue
let currentAudio   = null;   // The <audio> element currently playing
let pausedSegments = null;   // { segments, index } saved when muted mid-queue
const audioCache   = new Map();

// ── Public API ───────────────────────────────────────────────────────────────

/** Called by App when the user toggles the mute button */
export function setAudioEnabled(val) {
  const wasEnabled = _audioEnabled;
  _audioEnabled = val;

  if (!val) {
    // Muting: pause + save position so we can resume later
    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
      // pausedSegments already has the right position from the narrate loop
    }
  } else {
    // Unmuting: resume from saved position if available
    if (pausedSegments) {
      const { segments, index } = pausedSegments;
      pausedSegments = null;
      // Resume from the segment we paused on
      _narrateFrom(segments, index);
    }
  }
}

/** Stop everything and clear saved state */
export function stopNarration() {
  activeQueueId  = null;
  pausedSegments = null;
  _stopCurrent();
}

/** Play an array of { text, style } segments sequentially.
 *  Cancels any currently playing narration first. */
export async function narrate(segments) {
  if (!segments || segments.length === 0) return;
  // Always cancel any running queue
  activeQueueId  = null;
  pausedSegments = null;
  _stopCurrent();

  if (!_audioEnabled) return; // queued but won't play until unmute

  await _narrateFrom(segments, 0);
}

// ── Internal helpers ─────────────────────────────────────────────────────────

async function _narrateFrom(segments, startIndex) {
  const myId = Symbol();
  activeQueueId = myId;

  for (let i = startIndex; i < segments.length; i++) {
    if (activeQueueId !== myId) break; // cancelled by newer call

    // If muted mid-loop: save position and pause
    if (!_audioEnabled) {
      pausedSegments = { segments, index: i };
      _stopCurrent();
      return;
    }

    const { text, style = 'statement' } = segments[i];
    if (!text) continue;

    const url = await getAudioUrl(text, style);
    if (!url) continue;
    if (activeQueueId !== myId || !_audioEnabled) {
      if (!_audioEnabled) pausedSegments = { segments, index: i };
      break;
    }

    // Preload next
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style || 'statement');
    }

    await new Promise(resolve => {
      const audio = new Audio(url);
      currentAudio = audio;
      audio.onended  = resolve;
      audio.onerror  = resolve;
      audio.play().catch(() => resolve());
    });

    if (activeQueueId !== myId) break;
  }

  if (activeQueueId === myId) {
    activeQueueId = null;
    currentAudio  = null;
  }
}

function _stopCurrent() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
}

async function getAudioUrl(text, style = 'statement') {
  if (audioMap[text]) return audioMap[text];
  const key = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
  if (!key) return null;
  if (audioCache.has(text)) return audioCache.get(text);
  try {
    const settings = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_id: MODEL, voice_settings: settings }),
    });
    if (!res.ok) return null;
    const url = URL.createObjectURL(await res.blob());
    audioCache.set(text, url);
    return url;
  } catch { return null; }
}

// ── Segment builder helpers ──────────────────────────────────────────────────
export const say      = (text) => ({ text, style: 'statement'   });
export const ask      = (text) => ({ text, style: 'question'    });
export const cheer    = (text) => ({ text, style: 'celebration' });
export const emphasize= (text) => ({ text, style: 'emphasis'    });
export const think    = (text) => ({ text, style: 'thinking'    });
export const celebrate= (text) => ({ text, style: 'celebration' });
export const instruct = (text) => ({ text, style: 'statement'   });
export const encourage= (text) => ({ text, style: 'encouragement' });

// ── Web Audio sound effects ──────────────────────────────────────────────────
let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playTone(freq, dur, type = 'sine', gain = 0.28) {
  if (!_audioEnabled) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(); osc.stop(ctx.currentTime + dur);
  } catch {}
}
export function sfxCorrect() {
  playTone(523,0.10); setTimeout(()=>playTone(659,0.10),100); setTimeout(()=>playTone(784,0.20),200);
}
export function sfxWrong()   { playTone(220,0.15,'sawtooth',0.18); setTimeout(()=>playTone(196,0.20,'sawtooth',0.15),120); }
export function sfxBadge()   { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,0.15),i*80)); }
export function sfxStreak()  { [784,880,988,1047].forEach((f,i)=>setTimeout(()=>playTone(f,0.10),i*60)); }
export function sfxLevelUp() { [523,587,659,698,784,880,988,1047].forEach((f,i)=>setTimeout(()=>playTone(f,0.10),i*50)); }
