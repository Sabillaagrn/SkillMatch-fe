import { useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Building2,
  ArrowUpRight,
  ArrowLeft,
  Target,
} from "lucide-react";
import { Card, Badge, Button } from "../components/ui.jsx";
import { loadLastAnalysis } from "../lib/storage.js";

// Katalog fallback statis (hanya muncul jika API gagal atau belum ada data)
const JOBS = [
  {
    title: "Frontend Developer",
    company: "PT Tokopedia",
    location: "Jakarta",
    type: "Remote",
    match: 88,
    skills: ["React", "TypeScript", "Tailwind"],
  },
  {
    title: "Data Analyst",
    company: "Gojek",
    location: "Jakarta",
    type: "Hybrid",
    match: 82,
    skills: ["SQL", "Python", "Analytics"],
  },
];

function matchTone(pct) {
  if (pct >= 80) return "emerald";
  if (pct >= 60) return "brand";
  return "amber";
}

function getJobSearchUrl(jobTitle, companyName) {
  const cleanTitle = jobTitle.split(/[-–(]/)[0].trim();
  const cleanCompany = (companyName === "Perusahaan Tersedia" || !companyName) ? "" : companyName;
  const searchQuery = encodeURIComponent(`${cleanTitle} ${cleanCompany}`.trim());
  return `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}&location=Indonesia`;
}

export default function Jobs() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Menarik data asli dari state Analysis atau local storage
  const related = state?.relatedJobs ?? loadLastAnalysis()?.related_jobs;
  
  // Memetakan data dari backend FastAPI ke UI Card
  const jobs =
    Array.isArray(related) && related.length > 0
      ? related.map((j) => ({
          title: j.title,
          company: j.company || "Perusahaan Tersedia", // Fallback jika API tidak mengirim nama PT
          location: j.location || "Indonesia",
          type: j.type || "Full-time",
          // Menggunakan match_pct dari skema API FastAPI
          match: Math.round(j.match_pct || (j.similarity * 100) || 0), 
          skills: j.skills || [],
        }))
      : JOBS;

  return (
    <div className="mx-auto max-w-5xl px-4 pt-24 pb-8 md:pt-8 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Back Button */}
      <button
        type="button"
        onClick={() =>
          window.history.length > 1 ? navigate(-1) : navigate("/analysis")
        }
        className="group inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-1" /> 
        Kembali
      </button>

      {/* Header Card */}
      <Card className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 p-5 sm:p-6 shadow-sm border border-line/60">
        <span className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 shadow-sm">
          <Briefcase size={24} className="sm:h-7 sm:w-7" />
        </span>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-ink">Lowongan yang Cocok untukmu</h2>
          <p className="mt-1 text-sm sm:text-base text-muted">
            Rekomendasi posisi lain berdasarkan skill yang kamu kuasai.
          </p>
        </div>
      </Card>

      {/* Jobs Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {jobs.map((j, i) => (
          <Card 
            key={`${j.title}-${i}`} 
            className="group flex flex-col h-full p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand-200 border border-line/60"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
                <Building2 size={20} />
              </span>
              <Badge tone={matchTone(j.match)} className="shrink-0 shadow-sm">
                <Target size={14} className="mr-1 inline-block" /> {j.match}% cocok
              </Badge>
            </div>
            
            <div className="mt-4 flex-1">
              <h3 className="text-base sm:text-lg font-bold leading-snug text-ink group-hover:text-brand-700 transition-colors">
                {j.title}
              </h3>
              {j.company && <p className="mt-1 text-sm font-medium text-muted">{j.company}</p>}
              
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted">
                {j.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" /> {j.location}
                  </span>
                )}
                {j.type && <Badge tone="slate" className="px-2 py-0.5 text-[11px]">{j.type}</Badge>}
              </div>
              
              {j.skills?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {j.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover:bg-brand-50/50 group-hover:border-brand-100 group-hover:text-brand-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Tautan dinamis ke portal pekerjaan */}
            <a 
              href={getJobSearchUrl(j.title, j.company)}
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 block focus:outline-none"
            >
              <Button 
                variant="soft" 
                size="sm" 
                className="w-full justify-center gap-2 transition-all group-hover:bg-brand-100 group-hover:text-brand-800"
              >
                Lihat Lowongan 
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}