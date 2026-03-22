export default function WeightChart({ entries, xAxisLabel, yAxisLabel }) {
  if (!entries.length) {
    return <p className="text-sm text-ink/70">No data yet.</p>;
  }

  const width = 360;
  const height = 240;
  const chartLeft = 48;
  const chartRight = 18;
  const chartTop = 16;
  const chartBottom = 64;
  const innerWidth = width - chartLeft - chartRight;
  const innerHeight = height - chartTop - chartBottom;

  const values = entries.map((entry) => entry.weight_kg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const yTicks = Array.from(new Set(values))
    .sort((a, b) => b - a)
    .slice(0, 5);

  const chartPoints = entries.map((entry, index) => {
    const x =
      entries.length === 1
        ? width / 2
        : chartLeft + (index / (entries.length - 1)) * innerWidth;
    const y = chartTop + ((max - entry.weight_kg) / range) * innerHeight;
    return { ...entry, x, y };
  });

  const points = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Weight trend chart with ${xAxisLabel} and ${yAxisLabel} axes`}
      className="h-56 w-full rounded-xl bg-white"
      preserveAspectRatio="xMidYMid meet"
    >
      <line x1={chartLeft} y1={chartTop} x2={chartLeft} y2={height - chartBottom} stroke="#4a5568" strokeWidth="1.5" />
      <line
        x1={chartLeft}
        y1={height - chartBottom}
        x2={width - chartRight}
        y2={height - chartBottom}
        stroke="#4a5568"
        strokeWidth="1.5"
      />
      {yTicks.map((tick) => {
        const y = chartTop + ((max - tick) / range) * innerHeight;
        return (
          <g key={tick}>
            <line x1={chartLeft - 6} y1={y} x2={chartLeft} y2={y} stroke="#4a5568" strokeWidth="1.5" />
            <text x={chartLeft - 10} y={y + 4} textAnchor="end" fill="#334155" fontSize="12">
              {tick}
            </text>
          </g>
        );
      })}
      {chartPoints.map((point) => (
        <g key={point.entry_date}>
          <line
            x1={point.x}
            y1={height - chartBottom}
            x2={point.x}
            y2={height - chartBottom + 6}
            stroke="#4a5568"
            strokeWidth="1.5"
          />
          <text
            x={point.x}
            y={height - chartBottom + 18}
            transform={`rotate(-35, ${point.x}, ${height - chartBottom + 18})`}
            textAnchor="end"
            fill="#334155"
            fontSize="11"
          >
            {point.entry_date}
          </text>
        </g>
      ))}
      <text x={width / 2} y={height - 10} textAnchor="middle" fill="#334155" fontSize="13" fontWeight="600">
        {xAxisLabel}
      </text>
      <text
        x={16}
        y={height / 2}
        transform={`rotate(-90, 16, ${height / 2})`}
        textAnchor="middle"
        fill="#334155"
        fontSize="13"
        fontWeight="600"
      >
        {yAxisLabel}
      </text>
      <polyline fill="none" stroke="#1f7a8c" strokeWidth="3" points={points} strokeLinecap="round" />
      {chartPoints.map((point) => (
        <circle key={point.entry_date} cx={point.x} cy={point.y} r="4" fill="#022b3a" />
      ))}
    </svg>
  );
}
