export default function XPTracker({ xp, totalStars, streak, maxStreak }) {
  return (
    <div className="game-hud" aria-label="Game stats">
      <span className="hud-item hud-xp" title="Experience points">
        ⚡ {xp} XP
      </span>
      <span className="hud-item hud-stars" title="Total stars earned">
        ⭐ {totalStars}
      </span>
      {streak > 0 && (
        <span className="hud-item hud-streak" title={`Current streak: ${streak}`} style={{ animation: streak >= 5 ? 'pulseGold 1.5s infinite' : 'none' }}>
          🔥 {streak}
        </span>
      )}
    </div>
  );
}
