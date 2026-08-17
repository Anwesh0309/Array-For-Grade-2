import { useState, useEffect } from 'react';
import { narrate, stopNarration, sfxCorrect, sfxWrong, say, ask, cheer, emphasize } from '../../utils/audio.js';

const EMOJIS = ['⭐','🧁','🪑','📚','🌸','🔵'];

// A set of build-challenges the student must match
const CHALLENGES = [
  { targetRows: 3, targetCols: 4, label: 'Build an array with 3 rows and 4 columns.' },
  { targetRows: 2, targetCols: 5, label: 'Build an array with 2 rows and 5 columns.' },
  { targetRows: 4, targetCols: 3, label: 'Build an array with 4 rows and 3 columns.' },
];

export default function ArrayBuilderStation({ audioEnabled, onComplete }) {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [rows,    setRows]    = useState(1);
  const [columns, setColumns] = useState(1);
  const [emoji]               = useState(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
  const [highlighted, setHighlighted] = useState(null);
  const [solved,  setSolved]  = useState(false);   // current challenge solved
  const [allDone, setAllDone] = useState(false);

  const challenge = CHALLENGES[challengeIdx];
  const total     = rows * columns;
  const isCorrect = rows === challenge.targetRows && columns === challenge.targetCols;

  // Narrate challenge intro whenever challenge changes
  useEffect(() => {
    stopNarration();
    if (audioEnabled) narrate([
      ask(challenge.label),
      say(`You need ${challenge.targetRows} rows and ${challenge.targetCols} columns. Use the plus and minus buttons to build it!`),
    ]);
    return () => stopNarration();
  }, [challengeIdx, audioEnabled]);

  // Auto-detect correct answer as user adjusts
  useEffect(() => {
    if (isCorrect && !solved) {
      setSolved(true);
      sfxCorrect();
      if (audioEnabled) narrate([cheer(`That is correct! ${challenge.targetRows} times ${challenge.targetCols} equals ${challenge.targetRows * challenge.targetCols}. Well done!`)]);
    }
  }, [rows, columns]);

  const addRow    = () => { setSolved(false); setRows(r => Math.min(10, r + 1)); };
  const removeRow = () => { setSolved(false); setRows(r => Math.max(1, r - 1)); };
  const addCol    = () => { setSolved(false); setColumns(c => Math.min(10, c + 1)); };
  const removeCol = () => { setSolved(false); setColumns(c => Math.max(1, c - 1)); };

  const handleNext = () => {
    if (challengeIdx < CHALLENGES.length - 1) {
      setChallengeIdx(i => i + 1);
      setRows(1);
      setColumns(1);
      setSolved(false);
    } else {
      setAllDone(true);
      onComplete();
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'clamp(10px,1.6vh,16px)', width:'100%', maxWidth:580 }}>

      {/* Station label */}
      <div style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(11px,1.5vw,14px)', color:'#facc15', textTransform:'uppercase', letterSpacing:2 }}>
        🏗️ Station A — Array Builder
      </div>

      {/* Challenge progress dots */}
      <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
        {CHALLENGES.map((_, i) => (
          <div key={i} style={{
            width:10, height:10, borderRadius:'50%',
            background: i < challengeIdx ? '#4ade80' : i === challengeIdx ? '#facc15' : 'rgba(255,255,255,0.2)',
            transition:'background 0.3s',
          }} />
        ))}
      </div>

      {/* Question card */}
      <div style={{
        background:'rgba(10,10,50,0.7)', border:`2px solid ${solved ? '#4ade80' : 'rgba(99,102,241,0.4)'}`,
        borderRadius:16, padding:'14px 20px', width:'100%', textAlign:'center',
        transition:'border-color 0.3s',
        boxShadow: solved ? '0 0 18px rgba(74,222,128,0.25)' : 'none',
      }}>
        <p style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(15px,2.2vw,20px)', color:'#fff', margin:0, lineHeight:1.4 }}>
          {challenge.label}
        </p>
        <p style={{ fontFamily:'Nunito,sans-serif', fontWeight:700, fontSize:'clamp(12px,1.6vw,15px)', color:'rgba(255,255,255,0.55)', marginTop:6 }}>
          Target: <span style={{ color:'#facc15', fontWeight:900 }}>{challenge.targetRows} × {challenge.targetCols} = {challenge.targetRows * challenge.targetCols}</span>
        </p>
        {solved && (
          <div style={{ marginTop:8, fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(14px,2vw,18px)', color:'#4ade80', animation:'bounceIn 0.4s ease' }}>
            ✓ Correct! {rows} × {columns} = {total} 🎉
          </div>
        )}
      </div>

      {/* +/- Controls */}
      <div style={{ display:'flex', gap:'clamp(16px,3vw,32px)', flexWrap:'wrap', justifyContent:'center', alignItems:'center' }}>
        {/* Rows */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <span style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(11px,1.5vw,14px)', color:'#38bdf8', textTransform:'uppercase', letterSpacing:1 }}>Rows</span>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button className="btn-num" onClick={removeRow} style={{ background:'rgba(248,113,113,0.2)', borderColor:'#f87171', color:'#f87171' }} aria-label="Remove row">−</button>
            <div style={{ background:'rgba(10,10,50,0.8)', border:'2px solid #38bdf8', borderRadius:12, padding:'8px 20px', fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(20px,3.5vw,32px)', color:'#38bdf8', minWidth:64, textAlign:'center' }}>{rows}</div>
            <button className="btn-num" onClick={addRow}    style={{ background:'rgba(74,222,128,0.2)', borderColor:'#4ade80', color:'#4ade80' }}   aria-label="Add row">+</button>
          </div>
        </div>

        <span style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(24px,4vw,40px)', color:'rgba(255,255,255,0.4)', marginTop:20 }}>×</span>

        {/* Columns */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <span style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(11px,1.5vw,14px)', color:'#fb923c', textTransform:'uppercase', letterSpacing:1 }}>Columns</span>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button className="btn-num" onClick={removeCol} style={{ background:'rgba(248,113,113,0.2)', borderColor:'#f87171', color:'#f87171' }} aria-label="Remove column">−</button>
            <div style={{ background:'rgba(10,10,50,0.8)', border:'2px solid #fb923c', borderRadius:12, padding:'8px 20px', fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(20px,3.5vw,32px)', color:'#fb923c', minWidth:64, textAlign:'center' }}>{columns}</div>
            <button className="btn-num" onClick={addCol}    style={{ background:'rgba(74,222,128,0.2)', borderColor:'#4ade80', color:'#4ade80' }}   aria-label="Add column">+</button>
          </div>
        </div>
      </div>

      {/* Live array grid */}
      <div style={{
        background:'rgba(10,8,40,0.6)', borderRadius:14, padding:10,
        border:`1px solid ${solved ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.07)'}`,
        transition:'border-color 0.3s',
      }}>
        <div className="array-grid" role="img" aria-label={`Array: ${rows} rows, ${columns} columns`}>
          {Array(rows).fill(0).map((_, r) => (
            <div className="array-row" key={r}>
              {Array(columns).fill(0).map((_, c) => (
                <div
                  key={c}
                  className={`array-tile ${highlighted === r ? 'highlighted' : ''}`}
                  style={{ animationDelay:`${(r * columns + c) * 0.025}s`, fontSize:'clamp(12px,2vw,18px)' }}
                  onMouseEnter={() => setHighlighted(r)}
                  onMouseLeave={() => setHighlighted(null)}
                >
                  {emoji}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Live multiplication sentence */}
      <div style={{ display:'flex', alignItems:'center', gap:'clamp(6px,1vw,12px)', flexWrap:'wrap', justifyContent:'center' }}>
        <div style={{ background:'rgba(10,10,50,0.8)', border:'2px solid #38bdf8', borderRadius:12, padding:'6px 18px', fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(18px,3vw,28px)', color:'#38bdf8', minWidth:52, textAlign:'center' }}>{rows}</div>
        <span style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(18px,3vw,28px)', color:'rgba(255,255,255,0.35)' }}>×</span>
        <div style={{ background:'rgba(10,10,50,0.8)', border:'2px solid #fb923c', borderRadius:12, padding:'6px 18px', fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(18px,3vw,28px)', color:'#fb923c', minWidth:52, textAlign:'center' }}>{columns}</div>
        <span style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(18px,3vw,28px)', color:'rgba(255,255,255,0.35)' }}>=</span>
        <div style={{ background:'rgba(10,10,50,0.8)', border:`2px solid ${solved ? '#4ade80' : '#facc15'}`, borderRadius:12, padding:'6px 18px', fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:'clamp(18px,3vw,28px)', color: solved ? '#4ade80' : '#facc15', minWidth:52, textAlign:'center', transition:'all 0.3s' }}>{total}</div>
      </div>

      {/* Next button — only visible when solved */}
      {solved && (
        <button
          className="btn-gold"
          onClick={handleNext}
          disabled={allDone}
          style={{ marginTop:4, animation:'bounceIn 0.4s ease', minWidth:200 }}
        >
          {challengeIdx < CHALLENGES.length - 1 ? 'Next Challenge →' : 'Finish Station A ✓'}
        </button>
      )}

      {/* Score */}
      <p style={{ fontFamily:'Nunito,sans-serif', fontWeight:700, fontSize:'clamp(11px,1.5vw,13px)', color:'rgba(255,255,255,0.4)', textAlign:'center' }}>
        Challenge {challengeIdx + 1} of {CHALLENGES.length}
      </p>
    </div>
  );
}
