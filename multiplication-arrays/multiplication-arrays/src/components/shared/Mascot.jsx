export default function Mascot({ mood = 'idle', speech = null, size = 'md' }) {
  const emojis = {
    idle: '🤖',
    happy: '😄',
    thinking: '🤔',
    celebrating: '🥳',
    curious: '👀',
  };

  const sizeMap = { sm: 60, md: 80, lg: 100 };
  const px = sizeMap[size] || 80;

  return (
    <div className="mascot-wrap" style={{ maxWidth: px + 80 }}>
      <div
        className={`mascot-body ${mood}`}
        style={{ width: px, height: px, fontSize: px * 0.52 }}
        role="img"
        aria-label={`LearnFlow mascot — ${mood}`}
      >
        {emojis[mood] || '🤖'}
      </div>
      {speech && (
        <div className="mascot-speech">
          {speech}
        </div>
      )}
    </div>
  );
}
