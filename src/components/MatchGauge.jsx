// Circular gauge showing the weighted match percentage.
// SVG stroke-dashoffset arc — no chart lib needed for a single ring.
function band(pct) {
  if (pct >= 80) return { label: "Sangat Cocok", color: "#10b981" };
  if (pct >= 60) return { label: "Potensi Baik", color: "#1d4ed8" };
  if (pct >= 40) return { label: "Perlu Pengembangan", color: "#f59e0b" };
  return { label: "Kesenjangan Besar", color: "#f43f5e" };
}

export default function MatchGauge({ value = 0, size = 180 }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const { label, color } = band(pct);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#eef2f7"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset .8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-ink">{pct}%</span>
          <span className="text-xs font-semibold text-muted">Kecocokan</span>
        </div>
      </div>
      <span
        className="mt-3 rounded-full px-3 py-1 text-sm font-semibold"
        style={{ background: `${color}1a`, color }}
      >
        {label}
      </span>
    </div>
  );
}
