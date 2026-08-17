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
    { text: "Imagine this… The canteen aunty is arranging muffins on a tray. She places them in neat rows and columns.", emoji: '🧁' },
    { text: "She put 3 rows of muffins, with 4 muffins in each row. Can you figure out how many muffins there are in all — without counting one by one? 🤔", emoji: '🔢' },
    { text: "That is the magic of ARRAYS! When objects are arranged in equal rows and equal columns, we can MULTIPLY instead of count!", emoji: '⭐' },
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
    <div className="phase-screen z-1">
      <div className="glass-card" style={{ maxWidth: 660, width: '100%', textAlign: 'center' }}>

        <div className="text-accent-label" style={{ marginBottom: 12 }}>
          🔮 Wonder — Spark your curiosity
        </div>

        <div style={{ fontSize: 'clamp(44px,9vw,88px)', lineHeight: 1, marginBottom: 16 }}>
          {steps[step].emoji}
        </div>

        <p className="text-question" style={{ marginBottom: 20, minHeight: 72 }}>
          {steps[step].text}
        </p>

        {step === 1 && (
          <div style={{ margin: '0 auto 20px', maxWidth: 200 }}>
            <ArrayDiagram rows={3} columns={4} total={12} missing="total" animated size="sm" />
          </div>
        )}

        {step === 2 && (
          <div className="glass-panel" style={{
            display: 'inline-flex', gap: 12, alignItems: 'center',
            padding: '12px 24px', marginBottom: 20,
          }}>
            <span style={{
              fontFamily: 'Fredoka One, sans-serif',
              fontSize: 'clamp(20px,3.5vw,34px)', fontWeight: 900, color: '#facc15',
            }}>3 × 4 = 12</span>
            <span style={{ fontSize: 'clamp(20px,3.5vw,34px)' }}>🎉</span>
          </div>
        )}

        <Mascot mood={mascotMoods[step]} size="sm" />

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
          <button className="btn-gold" onClick={goNext}>
            {step < steps.length - 1 ? 'Show me! →' : 'I am ready to learn! 🚀'}
          </button>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: i <= step ? '#facc15' : 'rgba(255,255,255,0.2)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
