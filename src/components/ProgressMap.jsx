// Matches screenshot exactly:
// 01 Wonder ——— 02 Story ——— 03 Simulate ——— 04 Play ——— 05 Reflect
// Active: yellow filled circle + yellow bold label
// Completed: green circle with ✓ + white/green label
// Future: dim circle number only + grey label

const STEPS = [
  { id: 'wonder',   label: 'Wonder',   num: '01' },
  { id: 'story',    label: 'Story',    num: '02' },
  { id: 'simulate', label: 'Simulate', num: '03' },
  { id: 'play',     label: 'Practice', num: '04' },
  { id: 'reflect',  label: 'Reflect',  num: '05' },
];

const ORDER = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect', 'results'];

export default function ProgressMap({ currentPhase, phaseComplete = {}, onSelectPhase }) {
  const phaseIdx = ORDER.indexOf(currentPhase);

  return (
    <nav
      aria-label="Learning journey progress"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(4px, 1vw, 8px)',
        justifyContent: 'center',
        background: 'rgba(10, 8, 32, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 50,
        padding: '5px clamp(12px, 2vw, 20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        flexShrink: 0,
      }}
    >
      {STEPS.map((step, i) => {
        const stepIdx    = ORDER.indexOf(step.id);
        const isActive   = currentPhase === step.id;
        const isComplete = phaseComplete[step.id] || stepIdx < phaseIdx;

        /* Circle styles */
        const circleBg = isActive
          ? '#facc15'
          : isComplete
          ? '#22c55e'
          : 'rgba(255, 255, 255, 0.15)';
        const circleColor = isActive
          ? '#0f0a2e'
          : isComplete
          ? '#fff'
          : '#fff';
        const circleBorder = (isActive || isComplete)
          ? 'none'
          : '1px solid rgba(255, 255, 255, 0.3)';

        /* Label styles */
        const labelColor = isActive
          ? '#facc15'
          : isComplete
          ? '#fff'
          : 'rgba(255, 255, 255, 0.8)';
        const labelWeight = isActive ? 900 : 800;

        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
            {/* Step node button */}
            <button
              onClick={() => onSelectPhase && onSelectPhase(step.id)}
              aria-label={`Go to ${step.label} phase`}
              title={`Switch to ${step.label}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: 'none',
                padding: '3px 6px',
                borderRadius: 20,
                cursor: 'pointer',
                transition: 'transform 0.2s, opacity 0.2s',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {/* Numbered circle */}
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: circleBg,
                border: circleBorder,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fredoka One, sans-serif', fontWeight: 900,
                fontSize: 12, color: circleColor,
                flexShrink: 0,
                transition: 'all 0.3s',
                boxShadow: isActive ? '0 0 10px rgba(250, 204, 21, 0.5)' : 'none',
              }}>
                {isComplete ? '✓' : step.num}
              </div>

              {/* Label */}
              <span style={{
                fontFamily: 'Fredoka One, sans-serif',
                fontWeight: labelWeight,
                fontSize: 'clamp(13px, 1.5vw, 16px)',
                color: labelColor,
                whiteSpace: 'nowrap',
                transition: 'color 0.3s',
              }}>
                {step.label}
              </span>
            </button>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div style={{
                width: 'clamp(10px, 1.8vw, 24px)',
                height: 1,
                background: isComplete || (isActive && ORDER.indexOf(STEPS[i+1].id) <= phaseIdx)
                  ? 'rgba(34, 197, 94, 0.5)'
                  : 'rgba(255, 255, 255, 0.25)',
                flexShrink: 0,
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        );
      })}
    </nav>
  );
}
