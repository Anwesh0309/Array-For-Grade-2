import { useEffect, useState } from 'react';
import Mascot from '../shared/Mascot.jsx';
import ArrayDiagram from '../shared/ArrayDiagram.jsx';
import { narrate, stopNarration, say, emphasize, ask, cheer } from '../../utils/audio.js';

// Per-step narration — stops previous and plays fresh on each step
const STEP_NARRATION = [
  [
    say("Imagine this... The lunch lady is arranging muffins on a tray."),
    say("She places them in neat rows and columns."),
  ],
  [
    ask("She put 3 rows of muffins, with 4 muffins in each row."),
    ask("Can you figure out how many muffins there are in all — without counting one by one?"),
  ],
  [
    emphasize("That is the magic of ARRAYS!"),
    say("When objects are arranged in equal rows and equal columns, we can MULTIPLY instead of count!"),
    cheer("Get ready to discover arrays!"),
  ],
];

export default function WonderPhase({ audioEnabled, onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Imagine this...",
      body: <>The canteen aunty is arranging muffins on a tray. She places them in <strong style={{ color: '#38bdf8', fontSize: '1.1em', fontWeight: 900 }}>neat rows</strong> and <strong style={{ color: '#38bdf8', fontSize: '1.1em', fontWeight: 900 }}>columns</strong>.</>,
      emoji: '🧁'
    },
    {
      title: "Think & Discover!",
      body: <>She put <strong style={{ color: '#facc15', fontSize: '1.2em', fontWeight: 900 }}>3 rows</strong> of muffins, with <strong style={{ color: '#facc15', fontSize: '1.2em', fontWeight: 900 }}>4 muffins</strong> in each row. Can you figure out how many muffins there are in all — <strong style={{ color: '#4ade80', fontSize: '1.1em', fontWeight: 900 }}>without counting one by one</strong>? 🤔</>,
      emoji: '🔢'
    },
    {
      title: "The Magic of Arrays!",
      body: <>When objects are arranged in equal rows and equal columns, we can <strong style={{ color: '#facc15', fontSize: '1.3em', fontWeight: 900, textTransform: 'uppercase' }}>MULTIPLY</strong> instead of count!</>,
      emoji: '⭐'
    },
  ];

  const mascotMoods = ['curious', 'thinking', 'celebrating'];

  // Every time step changes: stop previous narration, start fresh for this step
  useEffect(() => {
    stopNarration();
    if (audioEnabled) narrate(STEP_NARRATION[step]);
    return () => stopNarration();
  }, [step, audioEnabled]);

  const goNext = () => {
    stopNarration();                    // stop immediately on tap
    if (step < steps.length - 1) setStep(s => s + 1);
    else onComplete();
  };

  return (
    <div className="phase-screen z-1" style={{ height: '100%', overflow: 'hidden', padding: 'clamp(12px, 2.5vh, 24px) 16px' }}>
      <div className="glass-card" style={{
        maxWidth: 680, width: '100%', textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: 'clamp(16px, 3vh, 32px)', gap: 'clamp(10px, 1.8vh, 18px)'
      }}>

        <div className="text-accent-label" style={{
          fontSize: 'clamp(14px, 1.8vw, 17px)',
          letterSpacing: 2, color: '#facc15', fontWeight: 900
        }}>
          🔮 WONDER — SPARK YOUR CURIOSITY
        </div>

        <div style={{ fontSize: 'clamp(52px, 9vh, 88px)', lineHeight: 1 }}>
          {steps[step].emoji}
        </div>

        <h2 style={{
          fontFamily: 'Fredoka One, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(26px, 4vw, 36px)',
          color: '#fff',
          margin: 0
        }}>
          {steps[step].title}
        </h2>

        <p style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(20px, 2.8vw, 26px)',
          color: '#ffffff',
          lineHeight: 1.55,
          margin: 0,
          maxWidth: 620
        }}>
          {steps[step].body}
        </p>

        {step === 1 && (
          <div style={{ margin: '4px auto', maxWidth: 240 }}>
            <ArrayDiagram rows={3} columns={4} total={12} missing="total" animated size="sm" />
          </div>
        )}

        {step === 2 && (
          <div className="glass-panel" style={{
            display: 'inline-flex', gap: 14, alignItems: 'center',
            padding: '12px 28px', borderRadius: 18, background: 'rgba(15, 10, 45, 0.8)',
            border: '2px solid rgba(250, 204, 21, 0.4)'
          }}>
            <div style={{
              fontFamily: 'Fredoka One, sans-serif', fontWeight: 900,
              fontSize: 'clamp(22px, 3.5vw, 30px)', color: '#facc15'
            }}>
              3 × 4 = 12
            </div>
            <div style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 800,
              fontSize: 'clamp(14px, 1.8vw, 17px)', color: '#fff'
            }}>
              3 rows of 4 = 12 total
            </div>
          </div>
        )}

        <Mascot mood={mascotMoods[step]} size="sm" />

        {/* Action controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
          {step > 0 && (
            <button className="btn-secondary" onClick={() => setStep(s => s - 1)} style={{
              fontFamily: 'Fredoka One, sans-serif', fontWeight: 900,
              fontSize: 'clamp(16px, 2.2vw, 22px)', padding: '10px 22px'
            }}>
              ← Back
            </button>
          )}

          <button className="btn-gold" onClick={goNext} style={{
            fontFamily: 'Fredoka One, sans-serif', fontWeight: 900,
            fontSize: 'clamp(18px, 2.5vw, 26px)', padding: '12px 32px'
          }}>
            {step < steps.length - 1 ? 'Explore Next →' : 'Hear the Story! 📖'}
          </button>
        </div>

        {/* Step dots - fully clickable */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 4 }}>
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Jump to step ${i + 1}`}
              style={{
                width: 14, height: 14, borderRadius: '50%',
                background: i === step ? '#facc15' : i < step ? '#4ade80' : 'rgba(255,255,255,0.25)',
                border: 'none', cursor: 'pointer',
                transform: i === step ? 'scale(1.25)' : 'scale(1)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
