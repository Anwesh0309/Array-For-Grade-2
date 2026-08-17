import { useState, useEffect } from 'react';
import Mascot from '../shared/Mascot.jsx';
import BadgePanel from '../gamification/BadgePanel.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { reflectNarration } from '../../utils/narration.js';
import { calcStars } from '../../utils/scoring.js';

const PROMPTS = [
  "Tell me one thing you learned today! 💭",
  "What part of arrays was trickiest for you? 🤔",
  "Can you think of arrays you see in real life? 🏠",
  "How does knowing arrays help with multiplication? ⭐",
];

const WORLD_NAMES = [
  'Candy Land','Jungle Trek','Ocean Deep','Sky Islands','Volcano Peak',
  'Space Station','Dragon Cave','Crystal Tower','Rainbow Bridge','Number Palace',
];

export default function ReflectPhase({ audioEnabled, state, onComplete }) {
  const [response, setResponse]   = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [promptIdx]               = useState(Math.floor(Math.random() * PROMPTS.length));
  const [confidence, setConfidence] = useState(null);

  const { xp, totalStars, streak, maxStreak, badges, worldScores, worldCorrect } = state;

  // Total correct across all worlds
  const totalCorrect = (worldCorrect || []).reduce((s, n) => s + (n || 0), 0);
  const totalQuestions = (worldCorrect || []).filter((_, i) => worldScores[i] !== null).length * 10;
  const pct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  useEffect(() => {
    stopNarration();
    // Only play narration on the journal prompt — NOT on the certificate
    if (!submitted && audioEnabled) narrate(reflectNarration());
    return () => stopNarration();
  }, [audioEnabled, submitted]);

  const handleSubmit = () => {
    if (response.trim() || confidence) {
      stopNarration(); // stop reflect audio when moving to certificate
      setSubmitted(true);
    }
  };

  // Grade based on percentage
  const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
  const gradeColor = pct >= 80 ? '#4ade80' : pct >= 60 ? '#facc15' : '#f87171';

  return (
    <div style={{
      width:'100%', height:'100%',
      display:'flex', flexDirection:'column',
      overflow:'hidden', position:'relative',
    }}>
<div style={{
        flex:1, overflowY:'auto', overflowX:'hidden',
        display:'flex', alignItems:'flex-start', justifyContent:'center',
        padding:'12px 16px 24px',
        scrollbarWidth:'thin', scrollbarColor:'#6d28d9 #0d0b26',
      }}>
        <div style={{
          background:'rgba(20,20,80,0.75)', backdropFilter:'blur(20px)',
          border:'1px solid rgba(255,255,255,0.12)', borderRadius:24,
          padding:'clamp(16px,2.5vh,28px) clamp(16px,3vw,32px)',
          width:'100%', maxWidth:680,
        }}>

        {!submitted ? (
          /* ── Journal prompt form ── */
          <div style={{ display:'flex', flexDirection:'column', gap:'clamp(10px,1.8vh,18px)' }}>
            <div style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900,
              fontSize:'clamp(11px,1.5vw,14px)', color:'#facc15',
              textTransform:'uppercase', letterSpacing:2 }}>
              📝 Reflect — What did you learn?
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <Mascot mood="happy" size="sm" />
              <div style={{
                background:'rgba(10,10,50,0.6)', border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:14, padding:'12px 18px', flex:1,
              }}>
                <p style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900,
                  fontSize:'clamp(14px,2vw,20px)', color:'#fff', lineHeight:1.4 }}>
                  {PROMPTS[promptIdx]}
                </p>
              </div>
            </div>

            <textarea
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="Type your answer here… (or just pick a confidence level below)"
              style={{
                width:'100%', minHeight:80,
                background:'rgba(10,10,50,0.7)',
                border:'1.5px solid rgba(255,255,255,0.14)',
                borderRadius:12, padding:'12px 16px', color:'#fff',
                fontFamily:'Nunito,sans-serif', fontSize:'clamp(13px,1.8vw,16px)', fontWeight:700,
                resize:'vertical', outline:'none',
              }}
              aria-label="Reflection response"
            />

            {/* Confidence picker */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900,
                fontSize:'clamp(10px,1.4vw,13px)', color:'#facc15',
                textTransform:'uppercase', letterSpacing:1.5 }}>
                How confident do you feel about arrays?
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {[
                  { level:1, emoji:'😕', label:'Still learning' },
                  { level:2, emoji:'🙂', label:'Getting there'  },
                  { level:3, emoji:'😊', label:'Pretty good'    },
                  { level:4, emoji:'🤩', label:'I got this!'    },
                ].map(c => (
                  <button key={c.level} onClick={() => setConfidence(c.level)}
                    style={{
                      flex:'1 1 80px', padding:'8px 10px', cursor:'pointer',
                      borderRadius:12, textAlign:'center',
                      border: confidence === c.level
                        ? '2px solid #facc15' : '1.5px solid rgba(255,255,255,0.12)',
                      background: confidence === c.level
                        ? 'rgba(250,204,21,0.15)' : 'rgba(20,20,80,0.6)',
                      transition:'all 0.2s',
                    }}
                    aria-pressed={confidence === c.level}
                  >
                    <div style={{ fontSize:'clamp(18px,3vw,26px)' }}>{c.emoji}</div>
                    <div style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900,
                      fontSize:'clamp(9px,1.2vw,11px)', color:'rgba(255,255,255,0.7)',
                      marginTop:3, textTransform:'uppercase', letterSpacing:1 }}>
                      {c.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-gold"
              onClick={handleSubmit}
              disabled={!response.trim() && !confidence}
              style={{ width:'100%' }}>
              Complete My Lesson! 🌟
            </button>
          </div>

        ) : (
          /* ── CERTIFICATE ── */
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
            gap:'clamp(10px,1.8vh,18px)', textAlign:'center' }}>

            {/* Certificate header */}
            <div style={{ fontSize:'clamp(36px,7vh,60px)', lineHeight:1 }}>🏆</div>
            <h2 style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900,
              fontSize:'clamp(20px,3.5vw,34px)', color:'#facc15', margin:0 }}>
              Lesson Complete!
            </h2>
            <div style={{ fontFamily:'Nunito,sans-serif', fontWeight:700,
              fontSize:'clamp(12px,1.7vw,15px)', color:'rgba(255,255,255,0.65)' }}>
              Multiplication: Introduction to Arrays · Grade 2 Math
            </div>

            {/* Big grade circle */}
            <div style={{
              width:'clamp(80px,12vw,110px)', height:'clamp(80px,12vw,110px)',
              borderRadius:'50%',
              background: `radial-gradient(circle, rgba(20,20,80,0.9), rgba(10,10,40,0.95))`,
              border:`4px solid ${gradeColor}`,
              boxShadow:`0 0 28px ${gradeColor}55`,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            }}>
              <div style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900,
                fontSize:'clamp(26px,5vw,40px)', color:gradeColor, lineHeight:1 }}>{grade}</div>
              <div style={{ fontFamily:'Nunito,sans-serif', fontWeight:900,
                fontSize:'clamp(10px,1.4vw,13px)', color:'rgba(255,255,255,0.6)' }}>{pct}%</div>
            </div>

            {/* Score summary */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)',
              gap:'clamp(8px,1.2vw,14px)', width:'100%' }}>
              {[
                { icon:'✅', label:'Correct',     val:`${totalCorrect}/100`      },
                { icon:'⭐', label:'Stars',        val:totalStars                 },
                { icon:'⚡', label:'XP Earned',   val:xp                         },
                { icon:'🔥', label:'Best Streak', val:maxStreak                  },
                { icon:'🏅', label:'Badges',      val:badges.length              },
                { icon:'😊', label:'Confidence',  val:['','😕','🙂','😊','🤩'][confidence||3] },
              ].map((s,i) => (
                <div key={i} style={{
                  background:'rgba(10,10,50,0.6)',
                  border:'1px solid rgba(255,255,255,0.1)',
                  borderRadius:14, padding:'10px 8px', textAlign:'center',
                }}>
                  <div style={{ fontSize:'clamp(16px,2.8vw,24px)' }}>{s.icon}</div>
                  <div style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900,
                    fontSize:'clamp(14px,2.2vw,20px)', color:'#facc15' }}>{s.val}</div>
                  <div style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900,
                    fontSize:'clamp(9px,1.2vw,11px)', color:'rgba(255,255,255,0.45)',
                    textTransform:'uppercase', letterSpacing:1, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Per-world scores */}
            {worldScores.some(ws => ws !== null) && (
              <div style={{ width:'100%' }}>
                <div style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900,
                  fontSize:'clamp(10px,1.4vw,13px)', color:'#facc15',
                  textTransform:'uppercase', letterSpacing:2, marginBottom:8 }}>
                  World Scores
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
                  {WORLD_NAMES.map((name, i) => {
                    const ws = worldScores[i];
                    const stars = ws !== null ? calcStars(ws) : null;
                    return (
                      <div key={i} style={{
                        background: ws !== null ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
                        border:`1px solid ${ws !== null ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius:10, padding:'6px 4px', textAlign:'center',
                      }}>
                        <div style={{ fontFamily:'Nunito,sans-serif', fontWeight:900,
                          fontSize:'clamp(9px,1.1vw,11px)', color:'rgba(255,255,255,0.6)',
                          marginBottom:2 }}>{name.split(' ')[0]}</div>
                        {ws !== null ? (
                          <>
                            <div style={{ fontFamily:'Fredoka One,sans-serif', fontWeight:900,
                              fontSize:'clamp(11px,1.6vw,15px)', color:'#4ade80' }}>{ws}/10</div>
                            <div style={{ fontSize:9, color:'#facc15' }}>
                              {'⭐'.repeat(stars)}{'☆'.repeat(3-stars)}
                            </div>
                          </>
                        ) : (
                          <div style={{ fontSize:14, color:'rgba(255,255,255,0.2)' }}>🔒</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <BadgePanel earned={badges} />

            <button className="btn-gold" onClick={onComplete} style={{ width:'100%', marginTop:4 }}>
              Back to Home 🏠
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
