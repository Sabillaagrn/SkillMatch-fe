import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Plus,
  X,
  TrendingUp,
  AlertTriangle,
  Gauge,
  ListChecks,
  ArrowRight,
  Search,
} from "lucide-react";
import { Card, Button, Spinner, Badge, Dropdown } from "../components/ui.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { useAnalyze } from "../hooks/useAnalyze.js";
import { SKILLS, SKILL_NAME, TARGET_ROLES } from "../lib/skills.js";
import { loadProfile } from "../lib/storage.js";

const API_URL = import.meta.env.VITE_API_URL;

const LEVELS = ["Pemula", "Menengah", "Ahli"];

function band(pct) {
  if (pct >= 80)
    return {
      heading: "Sangat Cocok",
      status: "Kompetitif",
      color: "#10b981",
      desc: "fondasi yang sangat kuat untuk posisi",
    };
  if (pct >= 60)
    return {
      heading: "Potensi Baik",
      status: "Berkembang",
      color: "#10b981",
      desc: "fondasi yang kuat untuk posisi",
    };
  if (pct >= 40)
    return {
      heading: "Perlu Pengembangan",
      status: "Awal",
      color: "#f59e0b",
      desc: "beberapa dasar yang relevan untuk posisi",
    };
  return {
    heading: "Kesenjangan Besar",
    status: "Dasar",
    color: "#f43f5e",
    desc: "kesenjangan yang cukup besar untuk posisi",
  };
}

function priorityOf(ratio) {
  if (ratio >= 0.66)
    return { priority: "Prioritas Tinggi", tone: "rose", icon: AlertTriangle, bar: "rose" };
  if (ratio >= 0.33)
    return { priority: "Prioritas Menengah", tone: "amber", icon: Gauge, bar: "amber" };
  return { priority: "Prioritas Rendah", tone: "brand", icon: ListChecks, bar: "brand" };
}

function Ring({ value, color, size = 150 }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 drop-shadow-sm">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef2f7" strokeWidth={stroke} />
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
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-ink">{pct}%</span>
        <span className="text-xs font-bold uppercase tracking-wider text-muted">Kecocokan</span>
      </div>
    </div>
  );
}

export default function Analysis() {
  const [selected, setSelected] = useState(new Set());
  const [roleId, setRoleId] = useState("");
  const [level, setLevel] = useState("Menengah");
  const [extra, setExtra] = useState("");
  const { loading, error, result, analyze, setError } = useAnalyze();

  const [isCleared, setIsCleared] = useState(() => {
    const keep = sessionStorage.getItem("keepAnalysis");
    if (keep) {
      sessionStorage.removeItem("keepAnalysis");
      return false;
    }
    return true;
  });

  const currentResult = isCleared ? null : result;
  const lastSavedRef = useRef(null);

  useEffect(() => {
    if (currentResult && currentResult !== lastSavedRef.current && roleId) {
      lastSavedRef.current = currentResult; 

      const saveHistoryToProfile = async () => {
        const currentUser = loadProfile();
        if (!currentUser?.email) return; 

        const role = TARGET_ROLES.find((r) => r.id === roleId);
        const pct = Math.round(currentResult.match_pct || 0);
        
        let tone = "amber";
        if (pct >= 80) tone = "emerald";
        else if (pct >= 60) tone = "brand";

        const today = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });

        const newHistoryItem = {
          date: today,
          role: role ? role.label : "Target Posisi",
          pct: pct,
          tone: tone,
        };

        try {
          const res = await fetch(`${API_URL}/profile?email=${encodeURIComponent(currentUser.email)}`);
          if (!res.ok) return;
          const profileData = await res.json();

          const lastHistory = profileData.history?.[0];
          if (
            lastHistory &&
            lastHistory.role === newHistoryItem.role &&
            lastHistory.pct === newHistoryItem.pct &&
            lastHistory.date === newHistoryItem.date
          ) {
            return; 
          }

          const updatedProfile = {
            ...profileData,
            email: currentUser.email,
            history: [newHistoryItem, ...(profileData.history || [])],
          };

          await fetch(`${API_URL}/profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProfile),
          });
        } catch (err) {
          console.error("Gagal menyimpan riwayat analisis:", err);
        }
      };

      saveHistoryToProfile();
    }
  }, [currentResult, roleId]);

  const toggle = (code) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!roleId) {
      setError("Pilih posisi target terlebih dahulu.");
      return;
    }
    if (selected.size === 0) {
      setError("Pilih minimal satu kemampuan yang ingin dievaluasi.");
      return;
    }
    
    setIsCleared(false);
    
    const role = TARGET_ROLES.find((r) => r.id === roleId);
    const jd = [role?.description, extra.trim()].filter(Boolean).join(" ");
    await analyze([...selected], jd);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          Analisis Skill
        </h1>
        <p className="text-sm text-muted">
          Evaluasi kemampuan Anda saat ini terhadap posisi yang ditargetkan.
        </p>
      </div>

      <ErrorBanner message={error} onClose={() => setError("")} />

      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Form Section */}
        <Card className="relative overflow-hidden p-5 sm:p-7 shadow-card lg:col-span-5 xl:col-span-4">
          <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-50/80" />
          <form onSubmit={onSubmit} className="relative space-y-7">
            <h2 className="text-xl font-bold text-ink">Parameter Analisis</h2>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-ink">
                Pilih Posisi Target
              </label>
              <Dropdown
                full
                value={roleId}
                onChange={setRoleId}
                placeholder="Pilih posisi…"
                options={TARGET_ROLES.map((r) => ({
                  value: r.id,
                  label: r.label,
                }))}
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-ink">
                  Detail Kemampuan
                </label>
                <p className="mt-0.5 text-xs text-muted">
                  Pilih kemampuan yang ingin dievaluasi
                </p>
              </div>
              
              {/* Custom Scrollbar & Spacing for Skills */}
              <div className="flex max-h-48 flex-wrap gap-2.5 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-line scrollbar-track-transparent">
                {SKILLS.map((s) => {
                  const active = selected.has(s.code);
                  return (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => toggle(s.code)}
                      className={[
                        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200",
                        active
                          ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                          : "border-line bg-slate-50 text-muted hover:border-brand-300 hover:bg-white hover:text-ink",
                      ].join(" ")}
                    >
                      {s.name}
                      {active ? <X size={14} className="opacity-80" /> : <Plus size={14} className="opacity-60" />}
                    </button>
                  );
                })}
              </div>
              
              <input
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="Tambah kemampuan lain (opsional)…"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-muted/70 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-ink">
                Tingkat Kemahiran Saat Ini
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {LEVELS.map((lv) => (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => setLevel(lv)}
                    className={[
                      "rounded-xl border px-2 sm:px-4 py-3 text-xs sm:text-sm font-semibold transition-all duration-200",
                      level === lv
                        ? "border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600/20"
                        : "border-line bg-white text-ink hover:border-brand-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {lv}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full shadow-sm" disabled={loading}>
              {loading ? <Spinner className="h-5 w-5 animate-spin" /> : <BarChart3 size={18} />}
              {loading ? "Menganalisis…" : "Analisis Kemampuan"}
            </Button>
          </form>
        </Card>

        {/* Results Section */}
        <div className="lg:col-span-7 xl:col-span-8">
          {loading ? (
            <Card className="grid min-h-[450px] place-items-center p-6 shadow-card">
              <div className="flex flex-col items-center text-muted">
                <Spinner className="h-10 w-10 text-brand-600 animate-spin" />
                <p className="mt-4 text-sm font-medium animate-pulse">Memproses miliaran data (bercanda, sedang menganalisis kemampuanmu)…</p>
              </div>
            </Card>
          ) : currentResult ? (
            <Results result={currentResult} />
          ) : (
            <Card className="grid min-h-[450px] place-items-center p-8 text-center shadow-card">
              <div className="max-w-md">
                <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand-50 text-brand-500 shadow-sm">
                  <BarChart3 size={40} />
                </span>
                <h3 className="mt-6 text-xl sm:text-2xl font-bold text-ink">Belum Ada Analisis</h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
                  Silakan isi parameter analisis di sebelah kiri dan klik tombol{" "}
                  <strong className="text-ink font-semibold">Analisis Kemampuan</strong>{" "}
                  untuk melihat hasil kecocokan dan *skill gap* Anda.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Results({ result }) {
  const pct = Math.round(result.match_pct || 0);
  const b = band(pct);

  const required = result.required || [];
  const reqByCode = Object.fromEntries(required.map((r) => [r.code, r.score]));
  const maxScore = Math.max(1, ...required.map((r) => r.score || 0));
  const gaps = (result.missing || [])
    .map((item) => {
      const code = item?.code ?? item;
      const ratio = (reqByCode[code] || 0) / maxScore;
      return {
        code,
        label: item?.name || SKILL_NAME[code] || code,
        ratio,
        ...priorityOf(ratio),
      };
    })
    .sort((a, b) => b.ratio - a.ratio);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="relative overflow-hidden p-6 sm:p-8 shadow-card">
        <span
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50"
          style={{ background: `${b.color}1a` }}
        />
        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left sm:gap-8">
          <Ring value={pct} color={b.color} size={160} />
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">{b.heading}</h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted max-w-lg">
              Anda memiliki {b.desc} ini, namun ada beberapa area kunci yang
              perlu ditingkatkan untuk mencapai tingkat kompetitif.
            </p>
            <span
              className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold shadow-sm"
              style={{ background: `${b.color}1a`, color: b.color }}
            >
              <TrendingUp size={16} /> Status: {b.status}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8 shadow-card">
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-2">
            <Search className="text-brand-600" size={22} />
            <h3 className="text-lg sm:text-xl font-bold text-ink">Skill Gap Analysis</h3>
          </div>
          <p className="text-sm sm:text-base text-muted">
            Berikut adalah area yang perlu Anda fokuskan untuk dipelajari
            berdasarkan target posisi Anda.
          </p>
        </div>

        {gaps.length === 0 ? (
          <div className="rounded-xl bg-emerald-50 p-5 text-center text-emerald-700 border border-emerald-100">
            <p className="font-medium">
              🎉 Luar biasa — kamu sudah memenuhi semua skill utama untuk posisi ini.
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {gaps.map((g) => (
              <li key={g.code} className="flex gap-4 sm:gap-5">
                <span
                  className={[
                    "mt-1.5 grid h-10 w-10 shrink-0 place-items-center rounded-full shadow-sm",
                    g.tone === "rose"
                      ? "bg-rose-50 text-rose-600"
                      : g.tone === "amber"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-brand-50 text-brand-600",
                  ].join(" ")}
                >
                  <g.icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <h4 className="font-bold text-ink text-base">{g.label}</h4>
                    <Badge tone={g.tone} className="shrink-0 w-fit">
                      {g.priority}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    <strong className="font-medium text-ink/80">{g.label}</strong> dibutuhkan untuk posisi target dan belum kamu
                    kuasai — fokuskan pembelajaran untuk menutup kesenjangan.
                  </p>
                  
                  {/* Progress Bar dengan Animasi Halus */}
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={[
                        "h-full rounded-full transition-all duration-1000 ease-out",
                        g.bar === "rose"
                          ? "bg-rose-500"
                          : g.bar === "amber"
                          ? "bg-amber-500"
                          : "bg-brand-600",
                      ].join(" ")}
                      style={{ width: `${Math.max(15, Math.round(g.ratio * 100))}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 border-t border-line pt-6 text-center">
          <Link
            to="/jobs"
            state={{ relatedJobs: result.related_jobs }}
            onClick={() => sessionStorage.setItem("keepAnalysis", "true")}
            className="group inline-flex items-center gap-2 rounded-xl bg-brand-50 px-6 py-3 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-100"
          >
            Lihat Rekomendasi Lowongan 
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Card>
    </div>
  );
}