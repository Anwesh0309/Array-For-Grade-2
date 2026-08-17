import ArrayDiagram from '../shared/ArrayDiagram.jsx';

export default function QuestionRenderer({ question, selectedAnswer, onSelect, showResult }) {
  if (!question) return null;
  const { questionText, options, correctAnswer, visual, rows, columns, total, missingSlot, type } = question;

  // For fill_blank / find_factor / rows_columns — render big inline sentence
  const isSentenceType = ['fill_blank', 'find_factor', 'rows_columns', 'repeated_addition'].includes(type);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'clamp(10px,1.6vh,16px)', width:'100%' }}>

      {/* Visual diagram for array/picture types */}
      {(visual === 'array' || visual === 'picture') && rows <= 8 && columns <= 8 && (
        <div style={{ display:'flex', justifyContent:'center', padding:'4px 0' }}>
          <ArrayDiagram
            rows={rows} columns={columns} total={total}
            missing={missingSlot} animated
            size={rows > 6 || columns > 6 ? 'sm' : 'md'}
          />
        </div>
      )}

      {/* Question text card */}
      <div style={{
        background:'rgba(10,10,46,0.7)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:14, padding:'clamp(12px,1.8vh,18px) clamp(14px,2.5vw,22px)',
        textAlign:'center',
      }}>
        <p style={{
          fontFamily:'Fredoka One,sans-serif', fontWeight:900,
          fontSize:'clamp(15px,2.2vw,22px)', color:'#fff', lineHeight:1.45,
          /* Break long sentences onto multiple lines, never overflow */
          wordBreak:'break-word', overflowWrap:'anywhere',
        }}>
          {questionText}
        </p>

        {/* For sentence types: show big visual boxes */}
        {isSentenceType && (
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            gap:'clamp(6px,1vw,12px)', flexWrap:'wrap', marginTop:14,
          }}>
            <SentenceBoxes question={question} />
          </div>
        )}
      </div>

      {/* Answer options grid */}
      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(8px,1.2vw,12px)',
        width:'100%',
      }}>
        {options && options.map((opt, i) => {
          let bg    = 'rgba(20,20,80,0.75)';
          let border= 'rgba(255,255,255,0.12)';
          let color = '#fff';
          let anim  = '';

          if (showResult) {
            if (String(opt) === String(correctAnswer)) {
              bg = 'rgba(74,222,128,0.2)'; border = '#4ade80'; color = '#4ade80'; anim = 'bounceIn 0.4s';
            } else if (String(opt) === String(selectedAnswer)) {
              bg = 'rgba(248,113,113,0.2)'; border = '#f87171'; color = '#fca5a5'; anim = 'shake 0.4s';
            }
          } else if (String(opt) === String(selectedAnswer)) {
            bg = 'rgba(99,102,241,0.3)'; border = '#6366f1';
          }

          return (
            <button
              key={i}
              onClick={() => !showResult && onSelect(opt)}
              disabled={showResult}
              aria-pressed={String(selectedAnswer) === String(opt)}
              aria-label={`Option ${i+1}: ${opt}`}
              style={{
                background:bg,
                border:`2px solid ${border}`,
                borderRadius:14, color,
                padding:'clamp(12px,1.8vh,16px) clamp(10px,1.5vw,16px)',
                fontFamily:'Fredoka One,sans-serif',
                fontSize:'clamp(14px,2vw,20px)', fontWeight:900,
                cursor: showResult ? 'default' : 'pointer',
                transition:'all 0.18s',
                animation:anim,
                textAlign:'center', minHeight:52,
                /* Never clip option text */
                wordBreak:'break-word', lineHeight:1.3,
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Renders the sentence with the blank slot visually highlighted
function SentenceBoxes({ question }) {
  const { rows, columns, total, missingSlot, type } = question;
  const boxStyle = (highlight) => ({
    background: highlight ? 'rgba(56,189,248,0.2)' : 'rgba(10,10,50,0.8)',
    border: `2px solid ${highlight ? '#38bdf8' : 'rgba(255,255,255,0.2)'}`,
    borderRadius: 10,
    padding: '6px 14px', minWidth: 48, textAlign:'center',
    fontFamily:'Fredoka One,sans-serif', fontWeight:900,
    fontSize:'clamp(18px,3vw,28px)',
    color: highlight ? '#38bdf8' : '#facc15',
  });
  const op = { fontFamily:'Fredoka One,sans-serif', fontWeight:900,
    fontSize:'clamp(16px,2.5vw,24px)', color:'rgba(255,255,255,0.5)' };

  if (type === 'fill_blank' || type === 'find_factor') {
    const showRows = missingSlot === 'rows'    ? '?' : String(rows);
    const showCols = missingSlot === 'columns' ? '?' : String(columns);
    const showTot  = missingSlot === 'total'   ? '?' : String(total);
    return (
      <>
        <span style={boxStyle(missingSlot==='rows')}>{showRows}</span>
        <span style={op}>×</span>
        <span style={boxStyle(missingSlot==='columns')}>{showCols}</span>
        <span style={op}>=</span>
        <span style={boxStyle(missingSlot==='total')}>{showTot}</span>
      </>
    );
  }
  return null;
}
