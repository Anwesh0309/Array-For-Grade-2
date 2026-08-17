import { useState, useEffect } from 'react';
import ArrayDiagram from '../shared/ArrayDiagram.jsx';
import NumberPad from '../shared/NumberPad.jsx';
import { narrate, stopNarration, sfxCorrect, sfxWrong } from '../../utils/audio.js';
import { simulateStationBIntro } from '../../utils/narration.js';

const PROBLEMS = [
  { rows: 3, columns: 4, missing: 'total' },
  { rows: 2, columns: 5, missing: 'rows' },
  { rows: 4, columns: 3, missing: 'columns' },
  { rows: 5, columns: 2, missing: 'total' },
  { rows: 3, columns: 3, missing: 'total' },
];

export default function MissingFactorStation({ audioEnabled, onComplete }) {
  const [idx, setIdx]       = useState(0);
  const [input, setInput]   = useState('');
  const [status, setStatus] = useState(null); // null | 'correct' | 'wrong'
  const [score, setScore]   = useState(0);
  const [done, setDone]     = useState(false);

  const prob = PROBLEMS[idx];
  const correct =
    prob.missing === 'rows'    ? prob.rows :
    prob.missing === 'columns' ? prob.columns : prob.rows * prob.columns;

  useEffect(() => {
    if (audioEnabled) narrate(simulateStationBIntro());
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
    if (idx < PROBLEMS.length - 1) {
      setIdx(i => i + 1);
    } else {
      setDone(true);
      onComplete();
    }
  };

  const label = prob.missing === 'rows' ? '? rows × ' + prob.columns + ' = ' + prob.rows * prob.columns
               : prob.missing === 'columns' ? prob.rows + ' × ? columns = ' + prob.rows * prob.columns
               : prob.rows + ' × ' + prob.columns + ' = ?';

  return (
    <div className="col gap-md" style={{ alignItems: 'center', width: '100%', maxWidth: 560 }}>
      <div className="text-accent-label">🔍 Station B — Missing Factor Finder</div>

      <div className="row gap-sm" style={{ justifyContent: 'center' }}>
        {PROBLEMS.map((_, i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: '50%',
            background: i < idx ? 'var(--color-green)' : i === idx ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <div className={`glass-panel w-full ${status === 'correct' ? 'correct' : status === 'wrong' ? 'wrong' : ''}`}
        style={{ textAlign: 'center', border: status === 'correct' ? '2px solid var(--color-green)' : status === 'wrong' ? '2px solid var(--color-coral)' : undefined }}>
        <p className="text-question" style={{ marginBottom: 16 }}>
          Find the missing number: <span className="text-gold">{label}</span>
        </p>

        <div style={{ margin: '0 auto', maxWidth: 220 }}>
          <ArrayDiagram
            rows={prob.rows} columns={prob.columns}
            total={prob.rows * prob.columns}
            missing={prob.missing} animated size="sm"
          />
        </div>

        {status === 'correct' && (
          <div style={{ fontSize: 'clamp(18px,3vw,28px)', color: 'var(--color-green)', fontFamily: 'Fredoka One', fontWeight: 900, margin: '12px 0' }}>
            ✓ Correct! The answer is {correct}! 🎉
          </div>
        )}
        {status === 'wrong' && (
          <div style={{ color: 'var(--color-coral)', fontFamily: 'Fredoka One', fontWeight: 900, fontSize: 'clamp(14px,2vw,20px)', margin: '10px 0' }}>
            Not quite! The answer is {correct}. Try again next time!
          </div>
        )}
      </div>

      {!status && (
        <>
          <div className="sim-sentence">
            <div className="sim-box sim-box.editable" style={{ minWidth: 64, color: 'var(--color-sky)', border: '2px solid var(--color-sky)' }}>
              {input === '' ? '?' : input}
            </div>
          </div>
          <NumberPad max={100} value={input} onChange={setInput} onSubmit={check} />
        </>
      )}

      {status && (
        <button className="btn-gold" onClick={next} style={{ marginTop: 8 }}>
          {idx < PROBLEMS.length - 1 ? 'Next Problem →' : 'Finish Station B ✓'}
        </button>
      )}

      <p className="text-body" style={{ textAlign: 'center' }}>
        Score: <span className="text-gold" style={{ fontFamily: 'Fredoka One', fontWeight: 900 }}>{score}</span> / {PROBLEMS.length}
      </p>
    </div>
  );
}
