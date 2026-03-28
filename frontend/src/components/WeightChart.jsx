export default function WeightChart({ entries, xAxisLabel, yAxisLabel }) {
  if (!entries.length) {
    return <p className="text-sm text-onSurfaceVariant">No data yet.</p>;
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
      className="h-56 w-full rounded-xl bg-surfaceContainerLowest"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="weightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-primary-container)" />
        </linearGradient>
      </defs>

      {yTicks.map((tick) => {
        const y = chartTop + ((max - tick) / range) * innerHeight;
        return (
          <g key={tick}>
            <circle cx={chartLeft - 8} cy={y} r={3} fill="var(--color-outline-variant)" />
            <text x={chartLeft - 14} y={y + 4} textAnchor="end" fill="var(--color-on-surface-variant)" fontSize="11">
              {tick}
            </text>
          </g>
        );
      })}

      {chartPoints.map((point) => (
        <g key={point.entry_date}>
          <circle cx={point.x} cy={height - chartBottom + 6} r={3} fill="var(--color-outline-variant)" />
          <text
            x={point.x}
            y={height - chartBottom + 20}
            transform={`rotate(-30, ${point.x}, ${height - chartBottom + 20})`}
            textAnchor="end"
            fill="var(--color-on-surface-variant)"
            fontSize="11"
          >
            {point.entry_date}
          </text>
        </g>
      ))}

      <text x={width / 2} y={height - 8} textAnchor="middle" fill="var(--color-on-surface)" fontSize="13" fontWeight="600">
        {xAxisLabel}
      </text>
      <text
        x={20}
        y={height / 2}
        transform={`rotate(-90, 20, ${height / 2})`}
        textAnchor="middle"
        fill="var(--color-on-surface)"
        fontSize="13"
        fontWeight="600"
      >
        {yAxisLabel}
      </text>

      <polyline
        fill="none"
        stroke="var(--color-primary-fixed)"
        strokeWidth="10"
        points={points}
        strokeLinecap="round"
        opacity="0.35"
      />
      <polyline
        fill="none"
        stroke="url(#weightGradient)"
        strokeWidth="8"
        points={points}
        strokeLinecap="round"
      />
      {chartPoints.map((point) => (
        <circle key={point.entry_date} cx={point.x} cy={point.y} r="6" fill="var(--color-surface-container-high)" stroke="var(--color-primary)" strokeWidth="2" />
      ))}
    </svg>
  );
}
