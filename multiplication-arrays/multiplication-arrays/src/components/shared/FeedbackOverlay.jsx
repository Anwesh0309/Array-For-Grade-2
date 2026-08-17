export default function FeedbackOverlay({ isCorrect, explanation, xpGained, onContinue }) {
  return (
    <div className="feedback-overlay" role="dialog" aria-modal="true" aria-label={isCorrect ? 'Correct answer' : 'Incorrect answer'}>
      <div className={`feedback-card ${isCorrect ? 'correct' : 'wrong'}`}>
        <div className="feedback-emoji">
          {isCorrect ? '🎉' : '🔢'}
        </div>
        <div className="feedback-msg">
          {isCorrect
            ? ['Amazing! Well done! 🌟', 'Brilliant! You got it! ⭐', 'Fantastic! Correct! 🎊'][Math.floor(Math.random() * 3)]
            : "Let's try again! Count the rows and columns 🔢"
          }
        </div>
        {explanation && (
          <div className="feedback-explanation">{explanation}</div>
        )}
        {isCorrect && xpGained && (
          <div className="badge-pill" style={{ margin: '0 auto 16px' }}>
            +{xpGained} XP ✨
          </div>
        )}
        <button className="btn-gold" onClick={onContinue} autoFocus>
          {isCorrect ? 'Next Question →' : 'Try Again 🔄'}
        </button>
      </div>
    </div>
  );
}
