import { BADGES } from '../../utils/badgeEngine.js';

export default function BadgePanel({ earned }) {
  return (
    <div className="col gap-sm w-full">
      <div className="text-accent-label" style={{ marginBottom: 4 }}>🏆 Your Badges</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {BADGES.map(b => {
          const unlocked = earned.includes(b.id);
          return (
            <div
              key={b.id}
              className="badge-pill"
              style={{
                opacity: unlocked ? 1 : 0.35,
                filter: unlocked ? 'none' : 'grayscale(1)',
                transition: 'all 0.3s',
                transform: unlocked ? 'scale(1)' : 'scale(0.95)',
              }}
              title={b.description}
              aria-label={`${b.label}: ${unlocked ? 'earned' : 'not yet earned'}`}
            >
              {b.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
