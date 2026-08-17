import ArrayBuilderStation from '../simulations/ArrayBuilderStation.jsx';
import MissingFactorStation from '../simulations/MissingFactorStation.jsx';
import SentenceStation from '../simulations/SentenceStation.jsx';
import { narrate, stopNarration, cheer, say, emphasize } from '../../utils/audio.js';
import { useState } from 'react';

const STATIONS = [
  { id: 0, label: 'Array Builder',          icon: '🏗️' },
  { id: 1, label: 'Missing Factor',          icon: '🔍' },
  { id: 2, label: 'Multiplication Sentence', icon: '🔢' },
];

const TRANSITION_NARRATION = [
  cheer("Great job! You completed all three stations!"),
  say("You built arrays, found missing factors, and wrote multiplication sentences."),
  emphasize("Now you are entering Test Mode. Answer all 100 questions to show what you know."),
  say("Good luck! You can do this!"),
];

export default function SimulatePhase({ audioEnabled, state, dispatch, ACTIONS, onComplete }) {
  const current   = state.currentSimStation;
  const complete  = state.simStationsComplete;
  const [transitioning, setTransitioning] = useState(false);

  const handleStationComplete = (idx) => {
    dispatch({ type: ACTIONS.COMPLETE_SIM_STATION, payload: idx });
    if (idx < 2) {
      dispatch({ type: ACTIONS.ADVANCE_SIM_STATION });
    } else {
      // Station C complete — show transition screen + play narration then enter Play
      setTransitioning(true);
      stopNarration();
      if (audioEnabled) {
        narrate(TRANSITION_NARRATION).then(() => {
          setTransitioning(false);
          onComplete();
        });
      } else {
        // No audio — show screen briefly then advance
        setTimeout(() => { setTransitioning(false); onComplete(); }, 2200);
      }
    }
  };

  return (
    /* Full-height column — header offset handled by app-main margin-top */
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Phase colour band */}
{/* Station tab bar — fixed inside this column, never scrolls away */}
      <div style={{
        display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap',
        padding: '10px 16px 6px',
        flexShrink: 0,
      }}>
        {STATIONS.map(st => (
          <div
            key={st.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px',
              borderRadius: 50,
              border: current === st.id
                ? '2px solid #06b6d4'
                : complete[st.id]
                  ? '2px solid #4caf50'
                  : '1.5px solid rgba(255,255,255,0.12)',
              background: current === st.id
                ? 'rgba(6,182,212,0.15)'
                : complete[st.id]
                  ? 'rgba(76,175,80,0.12)'
                  : 'rgba(20,20,80,0.55)',
              boxShadow: current === st.id ? '0 0 14px rgba(6,182,212,0.25)' : 'none',
              opacity: st.id > current && !complete[st.id] ? 0.45 : 1,
              transition: 'all 0.25s',
            }}
          >
            <span style={{ fontSize: 15 }}>{complete[st.id] ? '✅' : st.icon}</span>
            <span style={{
              fontFamily: 'Fredoka One, sans-serif', fontWeight: 900,
              fontSize: 'clamp(10px,1.4vw,13px)',
              color: current === st.id ? '#06b6d4' : complete[st.id] ? '#4caf50' : 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              {st.label}
            </span>
          </div>
        ))}
      </div>

      {/* Scrollable station content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '8px 16px 24px',
        display: 'flex',
        justifyContent: 'center',
        /* Custom scrollbar */
        scrollbarWidth: 'thin',
        scrollbarColor: '#6d28d9 #0d0b26',
      }}>
        <div style={{
          background: 'rgba(20,20,80,0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20,
          padding: 'clamp(16px,2.5vh,28px) clamp(14px,2.5vw,28px)',
          width: '100%',
          maxWidth: 640,
          display: 'flex',
          justifyContent: 'center',
          alignSelf: 'flex-start', // don't stretch — let content size it
        }}>
          {current === 0 && (
            <ArrayBuilderStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(0)}
            />
          )}
          {current === 1 && (
            <MissingFactorStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(1)}
            />
          )}
          {current === 2 && (
            <SentenceStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(2)}
            />
          )}
        </div>
      </div>

      {/* ── Transition overlay: plays while narration runs ── */}
      {transitioning && (
        <div style={{
          position:'absolute', inset:0, zIndex:50,
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          background:'rgba(8,5,32,0.92)',
          backdropFilter:'blur(10px)',
          gap:'clamp(14px,2.5vh,24px)',
          animation:'fadeInUp 0.4s ease',
          padding:24,
          textAlign:'center',
        }}>
          {/* Trophy */}
          <div style={{ fontSize:'clamp(52px,10vh,80px)', lineHeight:1, animation:'bounce 0.6s ease infinite' }}>🏆</div>

          {/* All stations complete */}
          <div style={{
            fontFamily:'Fredoka One,sans-serif', fontWeight:900,
            fontSize:'clamp(18px,3vw,30px)', color:'#4ade80',
          }}>
            All 3 Stations Complete! ✅
          </div>

          {/* Station badges */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
            {['🏗️ Array Builder','🔍 Missing Factor','🔢 Multiplication Sentence'].map((s,i) => (
              <div key={i} style={{
                background:'rgba(74,222,128,0.15)', border:'1.5px solid #4ade80',
                borderRadius:50, padding:'5px 14px',
                fontFamily:'Fredoka One,sans-serif', fontWeight:900,
                fontSize:'clamp(11px,1.5vw,14px)', color:'#4ade80',
              }}>{s}</div>
            ))}
          </div>

          {/* Entering test mode message */}
          <div style={{
            background:'rgba(239,68,68,0.15)', border:'2px solid rgba(239,68,68,0.5)',
            borderRadius:16, padding:'14px 28px',
            maxWidth:420, width:'100%',
          }}>
            <div style={{
              fontFamily:'Fredoka One,sans-serif', fontWeight:900,
              fontSize:'clamp(16px,2.5vw,24px)', color:'#fca5a5', marginBottom:6,
            }}>
              📝 Entering Test Mode...
            </div>
            <div style={{
              fontFamily:'Nunito,sans-serif', fontWeight:700,
              fontSize:'clamp(12px,1.7vw,15px)', color:'rgba(255,255,255,0.6)',
              lineHeight:1.5,
            }}>
              Answer 100 questions across 10 worlds.<br />
              Good luck — you've got this! 🚀
            </div>
          </div>

          {/* Animated dots */}
          <div style={{ display:'flex', gap:8 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width:10, height:10, borderRadius:'50%', background:'#facc15',
                animation:`bounce 0.8s ease ${i*0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
