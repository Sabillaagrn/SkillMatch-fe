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
import { Card, Dropdown, Spinner } from "../components/ui.jsx";

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
  { name: "Software Engineering (ENG)", pct: 88, color: "#1d4ed8" },
  { name: "Data Analysis & Analytics (ANLS)", pct: 76, color: "#1d4ed8" },
  { name: "UI/UX Design (DSGN)", pct: 72, color: "#14b8a6" },
  { name: "Project Management (PRJM)", pct: 65, color: "#14b8a6" },
  { name: "IT Infrastructure (IT)", pct: 60, color: "#1d4ed8" },
  { name: "Marketing & SEO (MRKT)", pct: 45, color: "#14b8a6" },
  { name: "Sales & Revenue (SALE)", pct: 38, color: "#14b8a6" },
  { name: "Business Development (BD)", pct: 30, color: "#14b8a6" },
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
    <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function SkillRow({ name, pct, color }) {
  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink group-hover:text-opacity-80 transition-colors">
          {name}
        </span>
        <span className="text-sm font-bold text-ink">{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-brand-100/50">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [range, setRange] = useState("all");
  const [sort, setSort] = useState("high");
  
  const [trendData, setTrendData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setTrendData(MOCK_TREND);
      setSkillsData(MOCK_SKILLS);
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <Spinner className="h-8 w-8 text-brand-600 animate-spin" />
        <p className="text-sm font-medium text-muted animate-pulse">Memuat data pasar kerja terkini...</p>
      </div>
    );
  }

  const currentTrend = range === "all" ? trendData : trendData.slice(-Number(range));

  const sortedSkills = [...skillsData].sort((a, b) => {
    if (sort === "az") return a.name.localeCompare(b.name);
    if (sort === "low") return a.pct - b.pct;
    return b.pct - a.pct;
  });
  
  const mid = Math.ceil(sortedSkills.length / 2);
  const columns = [sortedSkills.slice(0, mid), sortedSkills.slice(mid)];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-24 pb-8 md:pt-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
            Dashboard Tren Skill
          </h1>
          <p className="text-sm text-muted">
            Pantau pergerakan pasar kerja dan sesuaikan jalur karirmu.
          </p>
        </div>
        
        {/* Search Input */}
        <div className="flex w-full sm:w-auto items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-muted shadow-sm transition-all focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
          <Search size={18} className="text-muted" />
          <input
            className="w-full sm:w-56 bg-transparent outline-none placeholder:text-muted/70 text-ink"
            placeholder="Cari skill atau peran…"
          />
        </div>
      </div>

      {/* Chart Section */}
      <Card className="p-4 sm:p-6 lg:p-8 shadow-card">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-ink">Tren Pasar Kerja</h2>
          <Dropdown value={range} onChange={setRange} options={RANGE_OPTIONS} />
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-x-8 gap-y-3">
          <LegendDot color={TECH} label="Teknologi" />
          <LegendDot color={NON_TECH} label="Non-Teknologi" />
        </div>

        <div className="h-[280px] sm:h-[350px] lg:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentTrend}
              margin={{ top: 24, right: 16, left: -16, bottom: 0 }}
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
                dy={12}
              />
              <YAxis
                domain={[0, 1100]}
                ticks={[0, 200, 400, 600, 800, 1000]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e8edf5",
                  boxShadow: "0 10px 25px -5px rgba(16,24,40,.05), 0 8px 10px -6px rgba(16,24,40,.01)",
                  padding: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="tech"
                name="Teknologi"
                stroke={TECH}
                strokeWidth={3}
                fill="url(#techFill)"
                dot={{ r: 4, fill: "#fff", stroke: TECH, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              >
                <LabelList
                  dataKey="tech"
                  position="top"
                  offset={14}
                  style={{ fill: "#0f172a", fontSize: 12, fontWeight: 700 }}
                />
              </Area>
              <Area
                type="monotone"
                dataKey="nonTech"
                name="Non-Teknologi"
                stroke={NON_TECH}
                strokeWidth={3}
                fill="url(#nonTechFill)"
                dot={{ r: 4, fill: "#fff", stroke: NON_TECH, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              >
                <LabelList
                  dataKey="nonTech"
                  position="top"
                  offset={14}
                  style={{ fill: "#0f172a", fontSize: 12, fontWeight: 700 }}
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Skills Section */}
      <Card className="p-4 sm:p-6 lg:p-8 shadow-card">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-ink">Skill Paling Dicari</h2>
          <Dropdown value={sort} onChange={setSort} options={SORT_OPTIONS} />
        </div>
        <div className="grid gap-x-12 gap-y-8 md:grid-cols-2 lg:gap-x-16">
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-6">
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