// Matches screenshot exactly:
// 01 Wonder ——— 02 Story ——— 03 Simulate ——— 04 Play ——— 05 Reflect
// Active: yellow filled circle + yellow bold label
// Completed: green circle with ✓ + white/green label
// Future: dim circle number only + grey label

const STEPS = [
  { id: 'wonder',   label: 'Wonder',   num: '01' },
  { id: 'story',    label: 'Story',    num: '02' },
  { id: 'simulate', label: 'Simulate', num: '03' },
  { id: 'play',     label: 'Play',     num: '04' },
  { id: 'reflect',  label: 'Reflect',  num: '05' },
];

const ORDER = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect', 'results'];

export default function ProgressMap({ currentPhase, phaseComplete }) {
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
        const isFuture   = !isActive && !isComplete;

        /* Circle styles */
        const circleBg = isActive
          ? '#facc15'
          : isComplete
          ? '#22c55e'
          : 'rgba(255, 255, 255, 0.1)';
        const circleColor = isActive
          ? '#0f0a2e'
          : isComplete
          ? '#fff'
          : 'rgba(255, 255, 255, 0.4)';
        const circleBorder = (isActive || isComplete)
          ? 'none'
          : '1px solid rgba(255, 255, 255, 0.2)';

        /* Label styles */
        const labelColor = isActive
          ? '#facc15'
          : isComplete
          ? '#fff'
          : 'rgba(255, 255, 255, 0.35)';
        const labelWeight = isActive ? 900 : 700;

        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)' }}>
            {/* Step node */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              {/* Numbered circle */}
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: circleBg,
                border: circleBorder,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fredoka One, sans-serif', fontWeight: 900,
                fontSize: 10, color: circleColor,
                flexShrink: 0,
                transition: 'all 0.3s',
              }}>
                {isComplete ? '✓' : step.num}
              </div>

              {/* Label */}
              <span style={{
                fontFamily: 'Fredoka One, sans-serif',
                fontWeight: labelWeight,
                fontSize: 'clamp(11px, 1.2vw, 13px)',
                color: labelColor,
                whiteSpace: 'nowrap',
                transition: 'color 0.3s',
              }}>
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div style={{
                width: 'clamp(10px, 1.8vw, 24px)',
                height: 1,
                background: isComplete || (isActive && ORDER.indexOf(STEPS[i+1].id) <= phaseIdx)
                  ? 'rgba(34, 197, 94, 0.5)'
                  : 'rgba(255, 255, 255, 0.15)',
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
