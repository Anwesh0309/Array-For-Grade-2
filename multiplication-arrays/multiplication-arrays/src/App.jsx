import { useEffect } from 'react';
import { useGameState } from './hooks/useGameState.js';
import { setAudioEnabled } from './utils/audio.js';

import FloatingBg from './components/shared/FloatingBg.jsx';
import ProgressMap from './components/ProgressMap.jsx';
import XPTracker from './components/gamification/XPTracker.jsx';

import IntroScreen from './components/IntroScreen.jsx';
import WonderPhase from './components/phases/WonderPhase.jsx';
import StoryPhase from './components/phases/StoryPhase.jsx';
import SimulatePhase from './components/phases/SimulatePhase.jsx';
import PlayPhase from './components/phases/PlayPhase.jsx';
import ReflectPhase from './components/phases/ReflectPhase.jsx';

export default function App() {
  const { state, dispatch, ACTIONS } = useGameState();
  const { phase, audioEnabled, phaseComplete, xp, totalStars, streak, maxStreak } = state;

  useEffect(() => { setAudioEnabled(audioEnabled); }, [audioEnabled]);

  const go = (p) => dispatch({ type: ACTIONS.SET_PHASE, payload: p });
  const completePhase = (p) => dispatch({ type: ACTIONS.COMPLETE_PHASE, payload: p });

  const handleStart           = () => go('wonder');
  const handleWonderComplete  = () => { completePhase('wonder');   go('story');    };
  const handleStoryComplete   = () => { completePhase('story');    go('simulate'); };
  const handleSimulateComplete= () => { completePhase('simulate'); go('play');     };
  const handlePlayComplete    = () => { completePhase('play');     go('reflect');  };
  const handleReflectComplete = () => { completePhase('reflect');  go('results');  };
  const handleReset           = () => dispatch({ type: ACTIONS.RESET });

  const showHeader = phase !== 'intro';

  return (
    <div className="app-shell">
      <FloatingBg />

      {showHeader && (
        <header style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
          height: 'clamp(56px, 9vh, 80px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'clamp(12px, 3vh, 24px) clamp(16px, 4vw, 32px) 0 clamp(16px, 4vw, 32px)',
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          pointerEvents: 'none', // let click pass through where empty
        }} role="banner">

          {/* ── Left: Home pill ── */}
          <button
            onClick={handleReset}
            aria-label="Go to home"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 50, padding: '5px 16px 5px 6px',
              fontFamily: 'Fredoka One, sans-serif', fontWeight: 900,
              fontSize: 13, color: '#fff', cursor: 'pointer',
              transition: 'background 0.2s, transform 0.2s', whiteSpace: 'nowrap',
              flexShrink: 0,
              pointerEvents: 'auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: 24, height: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12
            }}>
              🏠
            </span>
            Home
          </button>

          {/* ── Center: Journey progress ── */}
          <div style={{ pointerEvents: 'auto' }}>
            <ProgressMap currentPhase={phase} phaseComplete={phaseComplete} />
          </div>

          {/* ── Right: close button ── */}
          <button
            onClick={handleReset}
            aria-label="Close lesson"
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: '#3b82f6', border: 'none',
              color: '#fff', fontSize: 18, fontWeight: 900,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s, transform 0.2s',
              flexShrink: 0,
              pointerEvents: 'auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
        </header>
      )}

      {/* ── Phase content ── */}
      <main
        className="app-main"
        role="main"
        aria-label="Lesson content"
        style={!showHeader ? { marginTop: 0, height: '100vh' } : undefined}
      >
        {phase === 'intro' && <IntroScreen onStart={handleStart} />}

        {phase === 'wonder' && (
          <WonderPhase audioEnabled={audioEnabled} onComplete={handleWonderComplete} />
        )}
        {phase === 'story' && (
          <StoryPhase audioEnabled={audioEnabled} onComplete={handleStoryComplete} />
        )}
        {phase === 'simulate' && (
          <SimulatePhase
            audioEnabled={audioEnabled} state={state}
            dispatch={dispatch} ACTIONS={ACTIONS} onComplete={handleSimulateComplete}
          />
        )}
        {phase === 'play' && (
          <PlayPhase
            audioEnabled={audioEnabled} state={state}
            dispatch={dispatch} ACTIONS={ACTIONS} onComplete={handlePlayComplete}
          />
        )}
        {phase === 'reflect' && (
          <ReflectPhase audioEnabled={audioEnabled} state={state} onComplete={handleReflectComplete} />
        )}
        {phase === 'results' && (
          <div className="phase-screen z-1 center">
            <div className="glass-card" style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(40px,7vh,64px)', marginBottom: 14 }}>🌟</div>
              <h2 className="text-h2 text-gold">Amazing Work!</h2>
              <p className="text-body" style={{ margin: '12px 0 22px' }}>
                You completed Multiplication: Arrays!<br />
                <span className="text-gold" style={{ fontFamily: 'Fredoka One', fontWeight: 900 }}>{xp} XP</span>
                {' · '}
                <span className="text-gold" style={{ fontFamily: 'Fredoka One', fontWeight: 900 }}>{totalStars} ⭐</span>
              </p>
              <button className="btn-gold" onClick={handleReset} style={{ width: '100%' }}>
                Start Again 🔄
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
