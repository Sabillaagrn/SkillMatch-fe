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
    <div className="mx-auto max-w-5xl space-y-6">
      <button
        type="button"
        onClick={() =>
          window.history.length > 1 ? navigate(-1) : navigate("/analysis")
        }
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-ink"
      >
        <ArrowLeft size={16} /> Kembali
      </button>

      <Card className="flex items-center gap-3 p-5">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
          <Briefcase size={20} />
        </span>
        <div>
          <h2 className="font-bold text-ink">Lowongan yang Cocok untukmu</h2>
          <p className="text-sm text-muted">
            Rekomendasi posisi lain berdasarkan skill yang kamu kuasai.
          </p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((j, i) => (
          <Card key={`${j.title}-${i}`} className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-muted">
                <Building2 size={18} />
              </span>
              <Badge tone={matchTone(j.match)}>
                <Target size={12} /> {j.match}% cocok
              </Badge>
            </div>
            <h3 className="mt-3 font-bold leading-snug text-ink">{j.title}</h3>
            {j.company && <p className="text-sm text-muted">{j.company}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              {j.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {j.location}
                </span>
              )}
              {j.type && <Badge tone="slate">{j.type}</Badge>}
            </div>
            {j.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {j.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
            
            {/* Tautan dinamis ke portal pekerjaan */}
            <a 
              href={getJobSearchUrl(j.title, j.company)}
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto pt-4 block"
            >
              <Button variant="soft" size="sm" className="w-full">
                Lihat Lowongan <ArrowUpRight size={15} />
              </Button>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}