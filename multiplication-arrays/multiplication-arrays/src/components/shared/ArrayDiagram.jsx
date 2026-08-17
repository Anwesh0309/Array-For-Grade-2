// Reusable SVG array diagram
export default function ArrayDiagram({ rows, columns, total, missing, animated = false, size = 'md' }) {
  const cellSizes = { sm: 22, md: 30, lg: 38 };
  const cell = cellSizes[size] || 30;
  const gap = 6;
  const ox = 16, oy = 16;

  const tileColors = {
    total:   { fill: '#8b5cf6', stroke: '#a78bfa' },
    rows:    { fill: '#fb923c', stroke: '#fdba74' },
    columns: { fill: '#38bdf8', stroke: '#7dd3fc' },
    default: { fill: '#8b5cf6', stroke: '#a78bfa' },
  };
  const col = tileColors[missing] || tileColors.default;

  const svgW = ox * 2 + columns * (cell + gap) - gap;
  const svgH = oy * 2 + rows * (cell + gap) - gap + 32;

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: '100%', height: 'auto' }}
      aria-label={`Array diagram: ${rows} rows × ${columns} columns = ${total}`}
      role="img"
    >
      {Array(rows).fill(0).map((_, r) =>
        Array(columns).fill(0).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={ox + c * (cell + gap)}
            y={oy + r * (cell + gap)}
            width={cell} height={cell} rx={6}
            fill={col.fill} stroke={col.stroke} strokeWidth={1.5}
            style={animated ? {
              animation: `tileStagger 0.3s ease both`,
              animationDelay: `${(r * columns + c) * 0.03}s`,
            } : {}}
          />
        ))
      )}
      <text
        x={ox} y={oy + rows * (cell + gap) + 20}
        fontSize={14} fontWeight="bold" fill="#e2e8f0"
        fontFamily="Fredoka One, sans-serif"
      >
        {missing === 'rows' ? '?' : rows}
        {' × '}
        {missing === 'columns' ? '?' : columns}
        {' = '}
        {missing === 'total' ? '?' : total}
      </text>
    </svg>
  );
}
