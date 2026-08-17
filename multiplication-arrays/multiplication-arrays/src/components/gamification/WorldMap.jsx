import { calcStars, canUnlockWorld } from '../../utils/scoring.js';

const WORLDS = [
  { id:0,  name:'Candy Land',     icon:'🍭', range:'up to 5×5' },
  { id:1,  name:'Jungle Trek',    icon:'🌴', range:'up to 5×5' },
  { id:2,  name:'Ocean Deep',     icon:'🌊', range:'up to 5×10' },
  { id:3,  name:'Sky Islands',    icon:'☁️', range:'up to 5×10' },
  { id:4,  name:'Volcano Peak',   icon:'🌋', range:'up to 5×10' },
  { id:5,  name:'Space Station',  icon:'🚀', range:'up to 10×10' },
  { id:6,  name:'Dragon Cave',    icon:'🐉', range:'up to 10×10' },
  { id:7,  name:'Crystal Tower',  icon:'💎', range:'up to 10×10' },
  { id:8,  name:'Rainbow Bridge', icon:'🌈', range:'up to 10×10' },
  { id:9,  name:'Number Palace',  icon:'👑', range:'mixed, hard' },
];

export default function WorldMap({ worldScores, currentWorld, onSelectWorld }) {
  return (
    <div className="world-grid" role="list" aria-label="World map">
      {WORLDS.map((w) => {
        const score = worldScores[w.id];
        const stars = score !== null && score !== undefined ? calcStars(score) : 0;
        const unlocked = w.id === 0 || canUnlockWorld(worldScores[w.id - 1]);
        const isCurrent = w.id === currentWorld;
        const isComplete = score !== null && score !== undefined;

        return (
          <div
            key={w.id}
            className={`world-card ${!unlocked ? 'locked' : ''} ${isCurrent ? 'current' : ''} ${isComplete ? 'complete' : ''}`}
            onClick={() => unlocked && onSelectWorld && onSelectWorld(w.id)}
            role="listitem"
            aria-label={`${w.name}: ${unlocked ? (isComplete ? `${score}/10 correct, ${stars} stars` : 'unlocked') : 'locked'}`}
            tabIndex={unlocked ? 0 : -1}
            onKeyDown={e => e.key === 'Enter' && unlocked && onSelectWorld && onSelectWorld(w.id)}
          >
            <div className="world-icon">{!unlocked ? '🔒' : w.icon}</div>
            <div style={{ fontSize: 'clamp(10px,1.4vw,13px)', color: 'var(--color-text-muted)', fontFamily: 'Fredoka One', fontWeight: 900, marginTop: 2 }}>
              {w.name}
            </div>
            {isComplete && (
              <div className="world-stars">
                {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
              </div>
            )}
            {isCurrent && !isComplete && (
              <div style={{ fontSize: 10, color: 'var(--color-gold)', fontFamily: 'Fredoka One', fontWeight: 900 }}>▶ NOW</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
