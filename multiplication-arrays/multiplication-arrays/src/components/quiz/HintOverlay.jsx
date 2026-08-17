import ArrayDiagram from '../shared/ArrayDiagram.jsx';

export default function HintOverlay({ question, hintLevel, onClose }) {
  if (!question) return null;
  return (
    <div className="feedback-overlay" role="dialog" aria-modal="true" aria-label="Hint">
      <div className="glass-card" style={{ maxWidth: 460, width: '90%', textAlign: 'center', animation: 'bounceIn 0.35s ease' }}>
        <div className="text-accent-label" style={{ marginBottom: 12 }}>💡 Hint {hintLevel}</div>

        {hintLevel === 1 && (
          <>
            <p className="text-body" style={{ marginBottom: 16, fontWeight: 800 }}>{question.hint1}</p>
            <ArrayDiagram
              rows={question.rows} columns={question.columns}
              total={question.total} missing={question.missingSlot}
              animated size="sm"
            />
          </>
        )}

        {hintLevel === 2 && (
          <p className="text-body" style={{ fontWeight: 800 }}>{question.hint2}</p>
        )}

        <button className="btn-gold" onClick={onClose} style={{ marginTop: 16 }}>
          Got it! 👍
        </button>
      </div>
    </div>
  );
}
