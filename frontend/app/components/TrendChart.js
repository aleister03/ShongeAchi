"use client";

// Small dependency-free SVG line chart for the concern-score trend.
// Renders points on a fixed 0-100 y-axis with weekly x-axis labels.
export default function TrendChart({ points }) {
  const width = 700;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const xStep = points.length > 1 ? plotWidth / (points.length - 1) : 0;

  function xFor(i) {
    return padding.left + i * xStep;
  }
  function yFor(score) {
    return padding.top + plotHeight - (score / 100) * plotHeight;
  }

  const scored = points.filter((p) => p.concernScore !== null);
  const linePath = scored
    .map((p) => {
      const i = points.indexOf(p);
      return `${xFor(i)},${yFor(p.concernScore)}`;
    })
    .join(" ");

  const gridLines = [0, 20, 40, 60, 80, 100];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {gridLines.map((g) => (
        <g key={g}>
          <line x1={padding.left} x2={width - padding.right} y1={yFor(g)} y2={yFor(g)} stroke="#e5e7eb" strokeWidth="1" />
          <text x={padding.left - 10} y={yFor(g) + 4} textAnchor="end" fontSize="12" fill="#9ca3af">
            {g}%
          </text>
        </g>
      ))}

      {scored.length > 1 && (
        <polyline points={linePath} fill="none" stroke="#f2b544" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {points.map((p, i) =>
        p.concernScore !== null ? <circle key={i} cx={xFor(i)} cy={yFor(p.concernScore)} r="5" fill="#f2b544" /> : null
      )}

      {points.map((p, i) => (
        <text key={p.weekLabel} x={xFor(i)} y={height - 6} textAnchor="middle" fontSize="12" fill="#6b7280">
          {p.weekLabel}
        </text>
      ))}
    </svg>
  );
}