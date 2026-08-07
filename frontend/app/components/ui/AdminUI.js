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
