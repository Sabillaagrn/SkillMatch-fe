import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";
import { Card, Dropdown, Spinner } from "../components/ui.jsx"; // Pastikan komponen Spinner sudah di-import

// Data sementara (Mock Data) yang akan digantikan API nanti
const MOCK_TREND = [
  { month: "Jan", tech: 324, nonTech: 178 },
  { month: "Feb", tech: 560, nonTech: 225 },
  { month: "Mar", tech: 584, nonTech: 369 },
  { month: "Apr", tech: 733, nonTech: 470 },
  { month: "May", tech: 665, nonTech: 300 },
  { month: "Jun", tech: 868, nonTech: 492 },
  { month: "Jul", tech: 743, nonTech: 490 },
  { month: "Aug", tech: 1050, nonTech: 700 },
];

const MOCK_SKILLS = [
  { name: "Software Engineering (ENG)", pct: 88, color: "#1d4ed8" }, // TECH
  { name: "Data Analysis & Analytics (ANLS)", pct: 76, color: "#1d4ed8" }, // TECH
  { name: "UI/UX Design (DSGN)", pct: 72, color: "#14b8a6" }, // NON_TECH
  { name: "Project Management (PRJM)", pct: 65, color: "#14b8a6" }, // NON_TECH
  { name: "IT Infrastructure (IT)", pct: 60, color: "#1d4ed8" }, // TECH
  { name: "Marketing & SEO (MRKT)", pct: 45, color: "#14b8a6" }, // NON_TECH
  { name: "Sales & Revenue (SALE)", pct: 38, color: "#14b8a6" }, // NON_TECH
  { name: "Business Development (BD)", pct: 30, color: "#14b8a6" }, // NON_TECH
];

const TECH = "#1d4ed8";
const NON_TECH = "#14b8a6";

const RANGE_OPTIONS = [
  { value: "all", label: "Semua bulan" },
  { value: "6", label: "6 bulan terakhir" },
  { value: "3", label: "3 bulan terakhir" },
];

const SORT_OPTIONS = [
  { value: "high", label: "Tertinggi" },
  { value: "low", label: "Terendah" },
  { value: "az", label: "A–Z" },
];

function LegendDot({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
      <span
        className="h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function SkillRow({ name, pct, color }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-ink">{name}</span>
        <span className="text-sm font-bold text-ink">{pct}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-brand-100">
        <div
          className="h-2.5 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [range, setRange] = useState("all");
  const [sort, setSort] = useState("high");
  
  // State untuk menyimpan data dinamis dan status loading
  const [trendData, setTrendData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi pemanggilan API (Mocking)
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      // Simulasi delay jaringan selama 1.2 detik biar terasa seperti ambil data asli
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      // Masukkan data mock ke dalam state
      setTrendData(MOCK_TREND);
      setSkillsData(MOCK_SKILLS);
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Tampilkan spinner jika data "belum datang"
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <Spinner className="h-8 w-8 text-brand-600" />
        <p className="text-sm font-medium text-muted">Memuat data pasar kerja terkini...</p>
      </div>
    );
  }

  // Logika UI tetap sama, tapi sekarang merujuk ke data di dalam state
  const currentTrend = range === "all" ? trendData : trendData.slice(-Number(range));

  const sortedSkills = [...skillsData].sort((a, b) => {
    if (sort === "az") return a.name.localeCompare(b.name);
    if (sort === "low") return a.pct - b.pct;
    return b.pct - a.pct;
  });
  
  const mid = Math.ceil(sortedSkills.length / 2);
  const columns = [sortedSkills.slice(0, mid), sortedSkills.slice(mid)];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            Dashboard Tren Skill
          </h1>
          <p className="mt-1 text-sm text-muted">
            Pantau pergerakan pasar kerja dan sesuaikan jalur karirmu.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-muted shadow-card">
          <Search size={16} />
          <input
            className="w-44 bg-transparent outline-none placeholder:text-muted"
            placeholder="Cari skill atau peran…"
          />
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">Tren Pasar Kerja</h2>
          <Dropdown value={range} onChange={setRange} options={RANGE_OPTIONS} />
        </div>

        <div className="mb-4 flex justify-center gap-6">
          <LegendDot color={TECH} label="Teknologi" />
          <LegendDot color={NON_TECH} label="Non-Teknologi" />
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentTrend}
              margin={{ top: 24, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="techFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={TECH} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={TECH} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="nonTechFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={NON_TECH} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={NON_TECH} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#e8edf5"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                domain={[0, 1100]}
                ticks={[0, 200, 400, 600, 800, 1000]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e8edf5",
                  boxShadow: "0 4px 16px rgba(16,24,40,.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="tech"
                name="Teknologi"
                stroke={TECH}
                strokeWidth={2.5}
                fill="url(#techFill)"
                dot={{ r: 4, fill: "#fff", stroke: TECH, strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              >
                <LabelList
                  dataKey="tech"
                  position="top"
                  offset={12}
                  style={{ fill: "#0f172a", fontSize: 12, fontWeight: 700 }}
                />
              </Area>
              <Area
                type="monotone"
                dataKey="nonTech"
                name="Non-Teknologi"
                stroke={NON_TECH}
                strokeWidth={2.5}
                fill="url(#nonTechFill)"
                dot={{ r: 4, fill: "#fff", stroke: NON_TECH, strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              >
                <LabelList
                  dataKey="nonTech"
                  position="top"
                  offset={12}
                  style={{ fill: "#0f172a", fontSize: 12, fontWeight: 700 }}
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex justify-center gap-6">
          <LegendDot color={TECH} label="Teknologi" />
          <LegendDot color={NON_TECH} label="Non-Teknologi" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">Skill Paling Dicari</h2>
          <Dropdown value={sort} onChange={setSort} options={SORT_OPTIONS} />
        </div>
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          {columns.map((col, i) => (
            <div key={i} className="space-y-6">
              {col.map((s) => (
                <SkillRow key={s.name} {...s} />
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}