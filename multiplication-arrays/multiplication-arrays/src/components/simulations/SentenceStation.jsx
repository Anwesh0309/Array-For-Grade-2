import { useState, useEffect } from 'react';
import ArrayDiagram from '../shared/ArrayDiagram.jsx';
import NumberPad from '../shared/NumberPad.jsx';
import { narrate, stopNarration, sfxCorrect, sfxWrong } from '../../utils/audio.js';
import { simulateStationCIntro } from '../../utils/narration.js';

const PROBLEMS = [
  { rows: 3, columns: 4, missing: 'total' },
  { rows: 5, columns: 2, missing: 'total' },
  { rows: 4, columns: 5, missing: 'columns' },
  { rows: 2, columns: 6, missing: 'rows' },
  { rows: 3, columns: 3, missing: 'total' },
];

export default function SentenceStation({ audioEnabled, onComplete }) {
  const [idx, setIdx]         = useState(0);
  const [input, setInput]     = useState('');
  const [status, setStatus]   = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore]     = useState(0);
  const [done, setDone]       = useState(false);

  const prob = PROBLEMS[idx];
  const correct =
    prob.missing === 'rows'    ? prob.rows :
    prob.missing === 'columns' ? prob.columns : prob.rows * prob.columns;

  useEffect(() => {
    if (audioEnabled) narrate(simulateStationCIntro());
    return () => stopNarration();
  }, [audioEnabled]);

  const check = () => {
    if (Number(input) === correct) {
      sfxCorrect();
      setStatus('correct');
      setScore(s => s + 1);
    } else {
      sfxWrong();
      setStatus('wrong');
    }
  };

  const next = () => {
    setStatus(null);
    setInput('');
    setShowHint(false);
    if (idx < PROBLEMS.length - 1) setIdx(i => i + 1);
    else { setDone(true); onComplete(); }
  };

  const renderSentence = () => {
    const blank = (
      <div className="sim-box sim-box.editable" style={{ minWidth: 64, border: '2px solid var(--color-sky)', color: input === '' ? 'rgba(255,255,255,0.3)' : 'var(--color-gold)' }}>
        {input === '' ? '_' : input}
      </div>
    );
    if (prob.missing === 'rows') return <>{blank}<span className="sim-operator">×</span><div className="sim-box">{prob.columns}</div><span className="sim-operator">=</span><div className="sim-box">{prob.rows * prob.columns}</div></>;
    if (prob.missing === 'columns') return <><div className="sim-box">{prob.rows}</div><span className="sim-operator">×</span>{blank}<span className="sim-operator">=</span><div className="sim-box">{prob.rows * prob.columns}</div></>;
    return <><div className="sim-box">{prob.rows}</div><span className="sim-operator">×</span><div className="sim-box">{prob.columns}</div><span className="sim-operator">=</span>{blank}</>;
  };

  return (
    <div className="col gap-md" style={{ alignItems: 'center', width: '100%', maxWidth: 560 }}>
      <div className="text-accent-label">🔢 Station C — Multiplication Sentence</div>

      <div className="row gap-sm" style={{ justifyContent: 'center' }}>
        {PROBLEMS.map((_, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: i < idx ? 'var(--color-green)' : i === idx ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div className="glass-panel w-full" style={{ textAlign: 'center', border: status === 'correct' ? '2px solid var(--color-green)' : status === 'wrong' ? '2px solid var(--color-coral)' : undefined }}>
        <p className="text-body" style={{ marginBottom: 16 }}>Fill in the missing number to complete the sentence:</p>
        <div className="sim-sentence" style={{ justifyContent: 'center', marginBottom: 16 }}>
          {renderSentence()}
        </div>

        {showHint && (
          <div style={{ marginBottom: 16, animation: 'slideInUp 0.35s ease' }}>
            <ArrayDiagram rows={prob.rows} columns={prob.columns} total={prob.rows*prob.columns} missing={prob.missing} animated size="sm" />
          </div>
        )}

        {status === 'correct' && <div style={{ color: 'var(--color-green)', fontFamily: 'Fredoka One', fontWeight: 900, fontSize: 'clamp(16px,2.5vw,24px)', marginBottom: 8 }}>✓ Correct! {prob.rows} × {prob.columns} = {prob.rows*prob.columns} 🎉</div>}
        {status === 'wrong'   && <div style={{ color: 'var(--color-coral)', fontFamily: 'Fredoka One', fontWeight: 900, fontSize: 'clamp(14px,2vw,20px)', marginBottom: 8 }}>The answer is {correct}. Keep trying!</div>}
      </div>

      {!status && (
        <>
          <div className="row gap-sm" style={{ justifyContent: 'center' }}>
            <button className="btn-hint" onClick={() => setShowHint(s => !s)}>
              {showHint ? 'Hide hint 🙈' : 'Show array hint 🔢'}
            </button>
          </div>
          <NumberPad max={100} value={input} onChange={setInput} onSubmit={check} />
        </>
      )}

      {status && (
        <button className="btn-gold" onClick={next}>
          {idx < PROBLEMS.length - 1 ? 'Next Problem →' : 'Finish Station C ✓'}
        </button>
      )}

      <p className="text-body" style={{ textAlign: 'center' }}>
        Score: <span className="text-gold" style={{ fontFamily: 'Fredoka One', fontWeight: 900 }}>{score}</span> / {PROBLEMS.length}
      </p>
    </div>
  );
}
