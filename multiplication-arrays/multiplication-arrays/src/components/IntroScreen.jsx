export default function IntroScreen({ onStart }) {
  return (
    <div className="intro-page">

      {/* Curriculum badge */}
      <div className="intro-badge">✨ Singapore MOE Curriculum · Grade 2</div>

      {/* Main title */}
      <h1 className="intro-title">
        Multiplication: Introduction to{' '}
        <span className="intro-title-highlight">Arrays</span>
      </h1>

      {/* Mascot + speech bubble */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-avatar" aria-label="LearnFlow mascot">🐻</div>
        <div className="intro-speech-bubble">
          Ready for a multiplication<br />adventure? 🚀
        </div>
      </div>

      {/* Subtitle */}
      <p className="intro-subtitle">
        Join Ryan on a journey to build, read, and multiply arrays<br />
        through stories, simulations, and fun games!
      </p>

      {/* ── YOUR LEARNING JOURNEY — large card matching screenshot ── */}
      <div className="intro-journey-card">
        <div className="intro-journey-label">YOUR LEARNING JOURNEY</div>

        {/* Row 1: Wonder → Story → Simulate */}
        <div className="intro-journey-row">
          <div className="intro-journey-step-big">
            <div className="intro-step-icon-big">🔮</div>
            <div className="intro-step-name-big">Wonder</div>
            <div className="intro-step-desc-big">Spark your curiosity</div>
          </div>
          <div className="intro-arrow-big">→</div>
          <div className="intro-journey-step-big">
            <div className="intro-step-icon-big">📖</div>
            <div className="intro-step-name-big">Story</div>
            <div className="intro-step-desc-big">Hear the tale</div>
          </div>
          <div className="intro-arrow-big">→</div>
          <div className="intro-journey-step-big">
            <div className="intro-step-icon-big">🧪</div>
            <div className="intro-step-name-big">Simulate</div>
            <div className="intro-step-desc-big">Explore &amp; discover</div>
          </div>
        </div>

        {/* Row 2: Play → Reflect */}
        <div className="intro-journey-row" style={{ justifyContent:'center', marginTop:8 }}>
          <div className="intro-journey-step-big">
            <div className="intro-step-icon-big">🎮</div>
            <div className="intro-step-name-big">Play</div>
            <div className="intro-step-desc-big">Test your skills</div>
          </div>
          <div className="intro-arrow-big">→</div>
          <div className="intro-journey-step-big">
            <div className="intro-step-icon-big">📝</div>
            <div className="intro-step-name-big">Reflect</div>
            <div className="intro-step-desc-big">What did you learn?</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="intro-cta-btn" onClick={onStart} aria-label="Begin your journey">
        🚀 Begin Your Journey!
      </button>

      {/* Feature cards */}
      <div className="intro-features">
        <div className="intro-feature-card">
          <span className="intro-feature-icon">📐</span>
          <div className="intro-feature-label">Arrays</div>
        </div>
        <div className="intro-feature-card">
          <span className="intro-feature-icon">🧩</span>
          <div className="intro-feature-label">Simulations</div>
        </div>
        <div className="intro-feature-card">
          <span className="intro-feature-icon">🏆</span>
          <div className="intro-feature-label">10 Game Worlds</div>
        </div>
      </div>
    </div>
  );
}
