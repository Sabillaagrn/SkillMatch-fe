import { Card, ProgressBar, Badge } from "./ui.jsx";
import { CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { SKILL_NAME } from "../lib/skills.js";

// Renders the required-skill breakdown returned by /match:
// which required skills the user already has vs. the gaps to close,
// plus prioritised recommendations.
export default function SkillGapAnalysis({ result }) {
  const { matching = [], missing = [], required = [] } = result;
  const reqByCode = Object.fromEntries(required.map((r) => [r.code, r.score]));
  const maxScore = Math.max(1, ...required.map((r) => r.score || 0));

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle2 className="text-emerald-500" size={18} />
          <h3 className="font-bold text-ink">Skill yang Sudah Dimiliki</h3>
          <Badge tone="emerald" className="ml-auto">
            {matching.length}
          </Badge>
        </div>
        {matching.length === 0 ? (
          <p className="text-sm text-muted">
            Belum ada skill yang cocok dengan persyaratan posisi ini.
          </p>
        ) : (
          <ul className="space-y-3">
            {matching.map((item) => {
              const code = item?.code ?? item;
              const label = item?.name || SKILL_NAME[code] || code;
              return (
                <li key={code}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-ink">{label}</span>
                    <span className="text-muted">
                      bobot {Math.round((reqByCode[code] || 0) * 100) / 100}
                    </span>
                  </div>
                  <ProgressBar
                    tone="emerald"
                    value={((reqByCode[code] || 0) / maxScore) * 100}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={18} />
          <h3 className="font-bold text-ink">Kesenjangan Skill</h3>
          <Badge tone="amber" className="ml-auto">
            {missing.length}
          </Badge>
        </div>
        {missing.length === 0 ? (
          <p className="text-sm text-muted">
            Luar biasa — kamu memenuhi semua skill utama untuk posisi ini.
          </p>
        ) : (
          <ul className="space-y-3">
            {missing.map((item) => {
              const code = item?.code ?? item;
              const label = item?.name || SKILL_NAME[code] || code;
              return (
                <li key={code}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{label}</span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <TrendingUp size={13} /> prioritas
                    </span>
                  </div>
                  <ProgressBar
                    tone="amber"
                    value={((reqByCode[code] || 0) / maxScore) * 100}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
