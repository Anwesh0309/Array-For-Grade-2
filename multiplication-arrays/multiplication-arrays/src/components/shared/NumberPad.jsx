export default function NumberPad({ max = 100, value, onChange, onSubmit }) {
  const nums = [];
  for (let i = 1; i <= Math.min(max, 10); i++) nums.push(i);
  if (max > 10) {
    for (let i = 12; i <= Math.min(max, 100); i += (i < 30 ? 2 : i < 60 ? 5 : 10)) nums.push(i);
  }

  // Always show 0–10 for typical quiz use
  const display = [1,2,3,4,5,6,7,8,9,10,0,'⌫'];

  const handleClick = (n) => {
    if (n === '⌫') {
      const s = String(value || '');
      onChange(s.slice(0, -1) || '');
    } else {
      const s = String(value || '');
      const next = s + n;
      if (Number(next) <= max) onChange(next);
    }
  };

  return (
    <div className="number-pad" role="group" aria-label="Number pad">
      {display.slice(0, 10).map(n => (
        <button
          key={n}
          className={`btn-num ${String(value) === String(n) ? 'selected' : ''}`}
          onClick={() => handleClick(n)}
          aria-label={`Number ${n}`}
        >
          {n}
        </button>
      ))}
      <button className="btn-num" onClick={() => handleClick(0)} aria-label="Zero">0</button>
      <button className="btn-num" onClick={() => handleClick('⌫')} aria-label="Backspace">⌫</button>
      {onSubmit && (
        <button
          className="btn-gold"
          style={{ gridColumn: '1/-1', marginTop: 8 }}
          onClick={onSubmit}
          disabled={value === '' || value === undefined}
        >
          Check ✓
        </button>
      )}
    </div>
  );
}
