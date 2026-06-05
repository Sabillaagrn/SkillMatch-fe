import { Outlet, useLocation, Link } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import Sidebar from "./Sidebar.jsx";

const TITLES = {
  "/dashboard": "Dashboard",
  "/analysis": "Analisis Skill",
  "/jobs": "Rekomendasi Lowongan",
  "/profile": "Profil",
};

// Shell shared by all authenticated pages: fixed sidebar + top bar + routed content.
export default function AppLayout() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || "SkillMatch";
  // The dashboard, analysis, and profile pages provide their own page header,
  // so the shared top bar is hidden there to match the design.
  const ownHeader = ["/dashboard", "/analysis", "/profile"];
  const showHeader = !ownHeader.includes(pathname);
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {showHeader && (
        <header className="flex h-16 items-center justify-between border-b border-line bg-white px-5 md:px-8">
          <h1 className="text-lg font-bold text-ink">{title}</h1>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-muted">
              <Search size={16} />
              <input
                className="w-44 bg-transparent outline-none placeholder:text-muted"
                placeholder="Cari skill atau kursus…"
              />
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted hover:bg-slate-50">
              <Bell size={18} />
            </button>
            <Link
              to="/profile"
              className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white"
            >
              MI
            </Link>
          </div>
        </header>
        )}
        <main className="flex-1 overflow-y-auto bg-canvas p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
