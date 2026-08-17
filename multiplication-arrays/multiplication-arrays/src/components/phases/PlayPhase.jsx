import { useState, useEffect, useRef } from 'react';
import ArrayDiagram from '../shared/ArrayDiagram.jsx';
import { narrate, stopNarration, sfxCorrect, sfxWrong, sfxStreak, sfxLevelUp, sfxBadge } from '../../utils/audio.js';
import { getQuestionNarration } from '../../utils/narration.js';
import { calcXP, calcStars } from '../../utils/scoring.js';

const WORLDS = [
  { n:1,  name:'Candy Land',      emoji:'🍭' },
  { n:2,  name:'Jungle Trek',     emoji:'🌴' },
  { n:3,  name:'Ocean Deep',      emoji:'🌊' },
  { n:4,  name:'Sky Islands',     emoji:'☁️' },
  { n:5,  name:'Volcano Peak',    emoji:'🌋' },
  { n:6,  name:'Space Station',   emoji:'🚀' },
  { n:7,  name:'Dragon Cave',     emoji:'🐉' },
  { n:8,  name:'Crystal Tower',   emoji:'💎' },
  { n:9,  name:'Rainbow Bridge',  emoji:'🌈' },
  { n:10, name:'Number Palace',   emoji:'👑' },
];

const TYPE_LABELS = {
  array_diagram:     '📐 Array Diagram',
  fill_blank:        '✏️ Fill the Blank',
  picture_array:     '🖼️ Picture Array',
  word_problem:      '📖 Word Problem',
  repeated_addition: '➕ Repeated Addition',
  true_false:        '✅ True or False',
  match_array:       '🔍 Match the Array',
  rows_columns:      '📏 Rows & Columns',
  within_100:        '🔢 Within 100',
  find_factor:       '🔎 Find the Factor',
};

// How long to show result before auto-advancing (ms)
const RESULT_DELAY = 1400;

export default function PlayPhase({ audioEnabled, state, dispatch, ACTIONS, onComplete }) {
  const [selected,      setSelected]      = useState(null);
  const [answered,      setAnswered]      = useState(false); // locked after selection
  const [showWorldEnd,  setShowWorldEnd]  = useState(false);
  const [worldEndData,  setWorldEndData]  = useState(null);
  const [xpPop,         setXpPop]         = useState(null); // { val, key }
  const advanceTimer = useRef(null);

  const {
    questionSet, currentQuestion, currentWorld,
    worldCorrect, xp, totalStars, streak, newBadges,
  } = state;

  const question  = questionSet?.[currentQuestion];
  const worldQIdx = currentQuestion % 10;          // 0-9 within world
  const allDone   = currentQuestion >= 100;
  const world     = WORLDS[currentWorld] || WORLDS[0];

  // Load questions on first mount
  useEffect(() => {
    if (!questionSet || questionSet.length === 0)
      dispatch({ type: ACTIONS.LOAD_QUESTIONS });
  }, []);

  // Narrate question when it changes
  useEffect(() => {
    stopNarration();
    setSelected(null);
    setAnswered(false);
    if (question && audioEnabled) narrate(getQuestionNarration(question));
    return () => stopNarration();
  }, [currentQuestion, audioEnabled]);

  // Badge sfx
  useEffect(() => {
    if (newBadges?.length > 0) {
      sfxBadge();
      dispatch({ type: ACTIONS.CLEAR_NEW_BADGES });
    }
  }, [newBadges]);

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  // ── CRITICAL: Never call onComplete() during render ──
  // Only advance to reflect AFTER all 100 questions are answered
  // and only from within the answer handler, not from render
  const isLoading = !questionSet || questionSet.length === 0;

  if (isLoading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
        <div style={{ textAlign:'center' }}>
          <p style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:20, color:'#fff', marginBottom:16 }}>
            Loading questions…
          </p>
          <button className="btn-gold"
            onClick={() => dispatch({ type: ACTIONS.LOAD_QUESTIONS })}>
            Start Test 🎮
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    // Questions loaded but currentQuestion might be out of range — reset
    dispatch({ type: ACTIONS.LOAD_QUESTIONS });
    return null;
  }

  /* ── True test mode: one tap = lock + advance ── */
  const handleSelect = (opt) => {
    if (answered) return; // already locked
    const ok = String(opt) === String(question.correctAnswer);
    setSelected(opt);
    setAnswered(true);

    // XP & state
    if (ok) {
      sfxCorrect();
      if ((streak + 1) >= 5) sfxStreak();
      const xpGained = calcXP(1, 0, streak);
      setXpPop({ val: xpGained, key: Date.now() });
      setTimeout(() => setXpPop(null), 1400);
      dispatch({ type: ACTIONS.ANSWER_CORRECT, payload: { attemptNumber: 1, hintsUsed: 0 } });
    } else {
      sfxWrong();
      dispatch({ type: ACTIONS.ANSWER_INCORRECT });
    }

    // Auto-advance after delay
    advanceTimer.current = setTimeout(() => {
      if (worldQIdx === 9) {
        // End of world
        const correct = (worldCorrect[currentWorld] || 0) + (ok ? 1 : 0);
        const stars   = calcStars(correct);
        setWorldEndData({ world, correct, stars });
        setShowWorldEnd(true);
        if (stars === 3) sfxLevelUp(); else sfxStreak();
      } else {
        dispatch({ type: ACTIONS.NEXT_QUESTION });
      }
    }, RESULT_DELAY);
  };

  const handleWorldEndContinue = () => {
    setShowWorldEnd(false);
    const nextQ = currentQuestion + 1;
    if (nextQ >= 100) {
      // All 100 done — go to reflect phase
      onComplete();
    } else {
      dispatch({ type: ACTIONS.NEXT_QUESTION });
    }
  };

  const progressPct = ((worldQIdx + 1) / 10) * 100;
  const typeLabel   = TYPE_LABELS[question.type] || question.type;

  // Determine if we should show array diagram
  const needsDiagram = ['array_diagram','picture_array','match_array','word_problem']
    .includes(question.type);
  const showDiagram  = question.rows && question.columns &&
    question.rows >= 1 && question.columns >= 1;

  return (
    <div style={{
      width:'100%', height:'100%',
      display:'flex', flexDirection:'column',
      alignItems:'center',
      padding:'clamp(8px,1.2vh,14px) clamp(12px,2vw,20px)',
      gap:'clamp(6px,1vh,10px)',
      /* Allow scroll so nothing is ever cut off */
      overflowY:'auto', overflowX:'hidden',
      boxSizing:'border-box',
      scrollbarWidth:'thin',
      scrollbarColor:'#6d28d9 #0d0b26',
    }}>

      {/* ── World label: "5. Volcano Peak 🌋" ── */}
      <div style={{
        background:'linear-gradient(135deg,#7c3aed,#4f46e5)',
        borderRadius:50, padding:'5px 20px',
        fontFamily:'Fredoka One,sans-serif', fontWeight:900,
        fontSize:'clamp(13px,1.9vw,18px)', color:'#fff',
        boxShadow:'0 4px 18px rgba(99,102,241,0.4)',
        flexShrink:0, letterSpacing:0.3,
      }}>
        {world.n}. {world.name} {world.emoji}
      </div>

      {/* ── Stats row: XP | streak ── */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        width:'100%', maxWidth:540, flexShrink:0,
      }}>
        <div style={{
          fontFamily:'Fredoka One,sans-serif', fontWeight:900,
          fontSize:'clamp(12px,1.7vw,16px)', color:'#facc15',
          display:'flex', alignItems:'center', gap:5,
        }}>⚡ {xp} XP</div>

        <div style={{
          fontFamily:'Fredoka One,sans-serif', fontWeight:900,
          fontSize:'clamp(11px,1.5vw,14px)', color:'rgba(255,255,255,0.4)',
        }}>
          Q {worldQIdx+1}/10 · Total {currentQuestion+1}/100
        </div>

        <div style={{
          fontFamily:'Fredoka One,sans-serif', fontWeight:900,
          fontSize:'clamp(12px,1.7vw,16px)', color:'#fb923c',
          display:'flex', alignItems:'center', gap:5,
        }}>🔥 {streak > 0 ? `${streak}x` : '–'}</div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ width:'100%', maxWidth:540, flexShrink:0 }}>
        <div style={{
          height:6, background:'rgba(255,255,255,0.08)', borderRadius:50, overflow:'hidden',
        }}>
          <div style={{
            width:`${progressPct}%`, height:'100%', borderRadius:50,
            background:'linear-gradient(90deg,#8b5cf6,#facc15)',
            transition:'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* ── Question card ── */}
      <div style={{
        background:'rgba(18,16,56,0.88)',
        border:'1px solid rgba(255,255,255,0.09)',
        borderRadius:20,
        padding:'clamp(12px,1.8vh,20px) clamp(14px,2.5vw,24px)',
        width:'100%', maxWidth:540,
        display:'flex', flexDirection:'column',
        gap:'clamp(8px,1.3vh,14px)',
        boxSizing:'border-box',
        flexShrink:0,
      }}>

        {/* Type badge */}
        <div style={{ display:'flex', justifyContent:'center' }}>
          <div style={{
            background:'linear-gradient(135deg,#f59e0b,#facc15)',
            borderRadius:50, padding:'3px 16px',
            fontFamily:'Fredoka One,sans-serif', fontWeight:900,
            fontSize:'clamp(10px,1.4vw,13px)', color:'#1a1a2e',
            letterSpacing:0.8,
          }}>
            {typeLabel}
          </div>
        </div>

        {/* ── Array diagram — shown for ALL types that have rows/columns ── */}
        {showDiagram && (
          <div style={{
            display:'flex', justifyContent:'center',
            background:'rgba(10,8,40,0.6)',
            borderRadius:12, padding:'6px',
            border:'1px solid rgba(255,255,255,0.07)',
          }}>
            <ArrayDiagram
              rows={question.rows}
              columns={question.columns}
              total={question.total}
              missing={question.missingSlot}
              animated
              size="sm"
            />
          </div>
        )}

        {/* Question text */}
        <p style={{
          fontFamily:'Fredoka One,sans-serif', fontWeight:900,
          fontSize:'clamp(14px,2.1vw,21px)', color:'#fff',
          textAlign:'center', lineHeight:1.4,
          wordBreak:'break-word', margin:0,
          flexShrink:0,
        }}>
          {question.questionText}
        </p>

        {/* Sentence boxes for fill_blank / find_factor */}
        {['fill_blank','find_factor','rows_columns'].includes(question.type) && (
          <SentenceBoxes question={question} />
        )}

        {/* ── 2×2 answer options ── */}
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr',
          gap:'clamp(7px,1.1vw,12px)',
        }}>
          {question.options?.map((opt, i) => {
            const isSelected = String(selected) === String(opt);
            const isCorrect  = String(opt) === String(question.correctAnswer);

            let bg     = 'rgba(255,255,255,0.04)';
            let border = '1.5px solid rgba(255,255,255,0.1)';
            let color  = '#cbd5e1';
            let scale  = 'scale(1)';
            let shadow = 'none';

            if (answered) {
              if (isCorrect) {
                bg='rgba(74,222,128,0.2)'; border='2px solid #4ade80';
                color='#4ade80'; shadow='0 0 14px rgba(74,222,128,0.3)';
              } else if (isSelected && !isCorrect) {
                bg='rgba(248,113,113,0.18)'; border='2px solid #f87171'; color='#fca5a5';
              }
            } else if (isSelected) {
              bg='rgba(99,102,241,0.28)'; border='2px solid #818cf8'; color='#fff'; scale='scale(1.02)';
            }

            return (
              <button key={i}
                onClick={() => handleSelect(opt)}
                disabled={answered}
                style={{
                  background:bg, border, color, borderRadius:13,
                  padding:'clamp(10px,1.5vh,15px) 10px',
                  fontFamily:'Fredoka One,sans-serif', fontWeight:900,
                  fontSize:'clamp(13px,1.9vw,19px)',
                  cursor: answered ? 'default' : 'pointer',
                  transform: scale,
                  boxShadow: shadow,
                  transition:'all 0.18s ease',
                  textAlign:'center', minHeight:48,
                  wordBreak:'break-word', lineHeight:1.3,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Test-mode helper text */}
        {!answered && (
          <div style={{
            textAlign:'center', fontFamily:'Nunito,sans-serif', fontWeight:700,
            fontSize:'clamp(10px,1.3vw,12px)', color:'rgba(255,255,255,0.3)',
            flexShrink:0,
          }}>
            📝 Tap an answer to continue
          </div>
        )}

        {/* Correct / wrong result message */}
        {answered && (
          <div style={{
            textAlign:'center',
            fontFamily:'Fredoka One,sans-serif', fontWeight:900,
            fontSize:'clamp(13px,1.8vw,17px)',
            color: String(selected) === String(question.correctAnswer) ? '#4ade80' : '#fca5a5',
            animation:'fadeInUp 0.3s ease',
            flexShrink:0,
          }}>
            {String(selected) === String(question.correctAnswer)
              ? `✓ Correct! ${question.explanation}`
              : `✗ Answer: ${question.correctAnswer} — ${question.explanation}`
            }
          </div>
        )}
      </div>

      {/* XP pop-up */}
      {xpPop && (
        <div key={xpPop.key} style={{
          position:'fixed', top:62, right:18, zIndex:200,
          background:'linear-gradient(135deg,#fde047,#facc15)',
          color:'#1a1a2e', borderRadius:50, padding:'5px 16px',
          fontFamily:'Fredoka One,sans-serif', fontWeight:900, fontSize:16,
          animation:'floatUp 1.4s ease forwards', pointerEvents:'none',
        }}>
          +{xpPop.val} XP ⚡
        </div>
      )}

      {/* World end modal */}
      {showWorldEnd && worldEndData && (
        <div className="feedback-overlay">
          <div style={{
            background:'linear-gradient(135deg,rgba(30,20,80,0.98),rgba(15,10,40,0.99))',
            border:'2px solid rgba(250,204,21,0.3)',
            borderRadius:24, padding:'clamp(22px,4vh,38px)',
            textAlign:'center', animation:'bounceIn 0.4s ease',
            maxWidth:400, width:'90%',
            boxShadow:'0 0 40px rgba(250,204,21,0.1)',
          }}>
            <div style={{ fontSize:'clamp(38px,6vh,56px)', lineHeight:1, marginBottom:6 }}>
              {worldEndData.world.emoji}
            </div>
            <div style={{
              fontFamily:'Fredoka One,sans-serif', fontWeight:900,
              fontSize:'clamp(16px,2.8vw,26px)', color:'#fff', marginBottom:4,
            }}>
              {worldEndData.world.n}. {worldEndData.world.name} Complete!
            </div>
            <div style={{ fontSize:'clamp(26px,4.5vw,40px)', color:'#facc15', margin:'8px 0' }}>
              {'⭐'.repeat(worldEndData.stars)}{'☆'.repeat(3-worldEndData.stars)}
            </div>
            <div style={{
              fontFamily:'Nunito,sans-serif', fontWeight:700,
              fontSize:'clamp(13px,1.8vw,16px)', color:'rgba(255,255,255,0.6)',
              marginBottom:20,
            }}>
              {worldEndData.correct}/10 correct
            </div>
            <button className="btn-gold" onClick={handleWorldEndContinue} autoFocus
              style={{ width:'100%' }}>
              {currentQuestion+1 >= 100 ? 'See Results! 🏆' : 'Next World →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Sentence boxes */
function SentenceBoxes({ question }) {
  const { rows, columns, total, missingSlot } = question;
  const box = (val, hi) => (
    <span style={{
      background: hi ? 'rgba(56,189,248,0.15)' : 'rgba(10,10,50,0.7)',
      border:`2px solid ${hi ? '#38bdf8' : 'rgba(255,255,255,0.15)'}`,
      borderRadius:9, padding:'4px 14px', minWidth:42, textAlign:'center', display:'inline-block',
      fontFamily:'Fredoka One,sans-serif', fontWeight:900,
      fontSize:'clamp(16px,2.8vw,26px)',
      color: hi ? '#38bdf8' : '#facc15',
    }}>{val}</span>
  );
  const op = (s) => (
    <span style={{
      fontFamily:'Fredoka One,sans-serif', fontWeight:900,
      fontSize:'clamp(14px,2.2vw,22px)', color:'rgba(255,255,255,0.35)',
    }}>{s}</span>
  );
  return (
    <div style={{
      display:'flex', alignItems:'center',
      gap:'clamp(5px,0.9vw,10px)', flexWrap:'wrap',
      justifyContent:'center', marginTop:2,
    }}>
      {box(missingSlot==='rows'    ? '?' : rows,    missingSlot==='rows')}
      {op('×')}
      {box(missingSlot==='columns' ? '?' : columns, missingSlot==='columns')}
      {op('=')}
      {box(missingSlot==='total'   ? '?' : total,   missingSlot==='total')}
    </div>
  );
}
