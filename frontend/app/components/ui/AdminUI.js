export function Card({ className = "", children }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function Badge({ tone = "", children }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function CapacityMeter({ current, maximum, large = false }) {
  const ratio = maximum ? current / maximum : 0;
  const tone = ratio >= 1 ? "full" : ratio >= 0.75 ? "near" : "";
  return <div className={`meter ${large ? "largeMeter" : ""} ${tone}`} aria-label={`${current} of ${maximum} capacity used`}>
    <i style={{ width: `${Math.min(ratio * 100, 100)}%` }} />
  </div>;
}

export function ErrorMessage({ message }) {
  return message ? <p className="error" role="alert">{message}</p> : null;
}

// Simple 0-100 sparkline, used for both the per-visit wellbeing series and the
// concern-score history. Moved here from ElderWellbeingReport so both cards draw
// the same shape; `series` allows a second, fainter comparison line (e.g. the
// rules-based score plotted behind the AI score).
//
// series: [{ values: number[], faint?: boolean }]
export function TrendGraph({ series = [], emptyMessage = "Not enough data yet for a trend." }) {
  const drawable = series.filter((s) => s.values?.length >= 2);
  if (!drawable.length) return <p className="empty">{emptyMessage}</p>;

  const w = 600, h = 160, pad = 8, max = 100;
  // Pad the vertical range so markers at 0 and 100 aren't clipped by the viewBox.
  const y = (value) => pad + (1 - Math.min(Math.max(value, 0), max) / max) * (h - pad * 2);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} role="img">
      {drawable.map((s, si) => {
        const stepX = w / (s.values.length - 1);
        const path = s.values.map((v, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${y(v)}`).join(" ");
        return (
          <g key={si} strokeOpacity={s.faint ? 0.3 : 1} fillOpacity={s.faint ? 0.3 : 1}>
            <path d={path} fill="none" stroke="currentColor" strokeWidth="2"
              strokeDasharray={s.faint ? "4 4" : undefined} />
            {!s.faint && s.values.map((v, i) => <circle key={i} cx={i * stepX} cy={y(v)} r="3" />)}
          </g>
        );
      })}
    </svg>
  );
}
