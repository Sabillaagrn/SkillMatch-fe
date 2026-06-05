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
      <svg width={size} height={size} className="-rotate-90">
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
          style={{ transition: "stroke-dashoffset .8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-ink">{pct}%</span>
        <span className="text-xs font-semibold text-muted">Kecocokan</span>
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

  // [BARU] Trik untuk menyembunyikan hasil ketika menu lain diklik
  const [isCleared, setIsCleared] = useState(() => {
    // Cek apakah ada pesan penitipan dari halaman Jobs
    const keep = sessionStorage.getItem("keepAnalysis");
    if (keep) {
      sessionStorage.removeItem("keepAnalysis"); // Hapus pesannya agar bersih lagi
      return false; // Jangan di-clear, tampilkan hasil yang lama
    }
    return true; // Default: bersihkan hasil (hilangkan)
  });

  // Hasil yang aktif (jika isCleared true, paksa jadi null agar layar kembali kosong)
  const currentResult = isCleared ? null : result;

  const lastSavedRef = useRef(null);

  useEffect(() => {
    // Gunakan currentResult agar tidak menyimpan data yang sedang di-clear
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
    
    // Ketika user klik submit, pastikan layarnya tidak di-clear lagi
    setIsCleared(false);
    
    const role = TARGET_ROLES.find((r) => r.id === roleId);
    const jd = [role?.description, extra.trim()].filter(Boolean).join(" ");
    await analyze([...selected], jd);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          Analisis Skill
        </h1>
        <p className="mt-1 text-sm text-muted">
          Evaluasi kemampuan Anda saat ini terhadap posisi yang ditargetkan.
        </p>
      </div>

      <ErrorBanner message={error} onClose={() => setError("")} />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="relative overflow-hidden p-6">
          <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-50" />
          <form onSubmit={onSubmit} className="relative space-y-6">
            <h2 className="text-xl font-bold text-ink">Parameter Analisis</h2>

            <div>
              <label className="mb-2 block text-sm font-bold text-ink">
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

            <div>
              <label className="block text-sm font-bold text-ink">
                Detail Kemampuan
              </label>
              <p className="mb-3 text-xs text-muted">
                Pilih kemampuan yang ingin dievaluasi
              </p>
              <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">
                {SKILLS.map((s) => {
                  const active = selected.has(s.code);
                  return (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => toggle(s.code)}
                      className={[
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition",
                        active
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-line bg-slate-50 text-muted hover:border-brand-300 hover:text-ink",
                      ].join(" ")}
                    >
                      {s.name}
                      {active ? <X size={14} /> : <Plus size={14} />}
                    </button>
                  );
                })}
              </div>
              <input
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="Tambah kemampuan lain…"
                className="mt-3 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-ink">
                Tingkat Kemahiran Saat Ini
              </label>
              <div className="grid grid-cols-3 gap-2">
                {LEVELS.map((lv) => (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => setLevel(lv)}
                    className={[
                      "rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                      level === lv
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-line bg-white text-ink hover:border-brand-300",
                    ].join(" ")}
                  >
                    {lv}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <Spinner className="h-5 w-5" /> : <BarChart3 size={18} />}
              {loading ? "Menganalisis…" : "Analisis Kemampuan"}
            </Button>
          </form>
        </Card>

        {loading ? (
          <Card className="grid min-h-[420px] place-items-center p-6">
            <div className="flex flex-col items-center text-muted">
              <Spinner className="h-8 w-8 text-brand-600" />
              <p className="mt-3 text-sm font-medium">Menganalisis kemampuan…</p>
            </div>
          </Card>
        ) : currentResult ? (
          <Results result={currentResult} />
        ) : (
          <Card className="grid min-h-[420px] place-items-center p-8 text-center">
            <div className="max-w-sm">
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-500">
                <BarChart3 size={32} />
              </span>
              <h3 className="mt-5 text-xl font-bold text-ink">Belum Ada Analisis</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Silakan isi parameter analisis di sebelah kiri dan klik tombol
                Analisis Kemampuan untuk melihat hasil kecocokan dan gap skill
                Anda.
              </p>
            </div>
          </Card>
        )}
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
    <div className="space-y-6">
      <Card className="relative overflow-hidden p-6">
        <span
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full"
          style={{ background: `${b.color}1a` }}
        />
        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <Ring value={pct} color={b.color} />
          <div>
            <h2 className="text-2xl font-extrabold text-ink">{b.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Anda memiliki {b.desc} ini, namun ada beberapa area kunci yang
              perlu ditingkatkan untuk mencapai tingkat kompetitif.
            </p>
            <span
              className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold"
              style={{ background: `${b.color}1a`, color: b.color }}
            >
              <TrendingUp size={14} /> Status: {b.status}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-2 flex items-center gap-2">
          <Search className="text-brand-600" size={20} />
          <h3 className="text-lg font-bold text-ink">Skill Gap Analysis</h3>
        </div>
        <p className="mb-5 text-sm text-muted">
          Berikut adalah area yang perlu Anda fokuskan untuk dipelajari
          berdasarkan target posisi Anda.
        </p>

        {gaps.length === 0 ? (
          <p className="text-sm text-muted">
            Luar biasa — kamu sudah memenuhi semua skill utama untuk posisi ini.
          </p>
        ) : (
          <ul className="space-y-5">
            {gaps.map((g) => (
              <li key={g.code} className="flex gap-3">
                <span
                  className={[
                    "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full",
                    g.tone === "rose"
                      ? "bg-rose-50 text-rose-600"
                      : g.tone === "amber"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-brand-50 text-brand-600",
                  ].join(" ")}
                >
                  <g.icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-ink">{g.label}</h4>
                    <Badge tone={g.tone} className="shrink-0">
                      {g.priority}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted">
                    {g.label} dibutuhkan untuk posisi target dan belum kamu
                    kuasai — fokuskan pembelajaran untuk menutup kesenjangan.
                  </p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className={[
                        "h-1.5 rounded-full",
                        g.bar === "rose"
                          ? "bg-rose-500"
                          : g.bar === "amber"
                          ? "bg-amber-500"
                          : "bg-brand-600",
                      ].join(" ")}
                      style={{ width: `${Math.max(20, Math.round(g.ratio * 100))}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/jobs"
            state={{ relatedJobs: result.related_jobs }}
            onClick={() => sessionStorage.setItem("keepAnalysis", "true")} // [BARU] Menitipkan pesan agar tidak di-clear saat kembali
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
          >
            Lihat Rekomendasi Lowongan <ArrowRight size={16} />
          </Link>
        </div>
      </Card>
    </div>
  );
}