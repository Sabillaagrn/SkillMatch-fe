import { Check } from "lucide-react";
import { SKILLS } from "../lib/skills.js";

// Multi-select chips over the 35 canonical skill categories.
// Controlled: parent owns the Set of selected codes.
export default function SkillChips({ selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SKILLS.map((s) => {
        const active = selected.has(s.code);
        return (
          <button
            key={s.code}
            type="button"
            onClick={() => onToggle(s.code)}
            className={[
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition",
              active
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-line bg-white text-muted hover:border-brand-300 hover:text-ink",
            ].join(" ")}
          >
            {active && <Check size={14} />}
            {s.name}
          </button>
        );
      })}
    </div>
  );
}
