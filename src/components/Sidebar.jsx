import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  User,
  LogOut,
  Briefcase,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analysis", label: "Skill Analysis", icon: Settings },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔥 MOBILE TOP BAR (BURGER DI ATAS FULL WIDTH) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-line bg-white/95 backdrop-blur-sm px-5 py-3.5 shadow-sm transition-all">
        <div className="flex items-center gap-2.5 font-extrabold text-brand-700 text-lg tracking-tight">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-brand-600 text-white shadow-sm">
            <Briefcase size={16} />
          </span>
          SkillMatch
        </div>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open Menu"
          className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* SPACE PENGGANTI TOPBAR (biar konten ga ketiban) */}
      <div className="md:hidden h-16 shrink-0" />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-72 shrink-0 flex-col border-r border-line bg-white shadow-[1px_0_10px_rgba(0,0,0,0.02)] transition-all">
        <div className="flex flex-col items-center gap-4 px-6 pt-10 pb-8">
          <span className="grid place-items-center h-16 w-16 rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
            <Briefcase size={28} />
          </span>
          <div className="text-center">
            <div className="text-2xl font-extrabold tracking-tight text-brand-700">
              SkillMatch
            </div>
            <div className="mt-0.5 text-sm font-semibold tracking-wide text-muted uppercase">
              Career Growth
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-muted hover:bg-slate-50 hover:text-ink",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {/* Indikator Aktif */}
                  {isActive && (
                    <span className="absolute -left-4 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-brand-600 shadow-sm" />
                  )}
                  <Icon 
                    size={20} 
                    className={`transition-colors duration-200 ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-ink'}`} 
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-2 border-t border-line px-4 py-6 mt-auto">
          <button className="group flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold text-muted transition-all duration-200 hover:bg-slate-50 hover:text-ink focus:outline-none">
            <HelpCircle size={20} className="text-slate-400 transition-colors group-hover:text-ink" />
            Help Center
          </button>

          <button
            onClick={() => navigate("/login")}
            className="group flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold text-rose-600 transition-all duration-200 hover:bg-rose-50 focus:outline-none"
          >
            <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay Background */}
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setOpen(false)}
          />

          {/* Drawer Content */}
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl p-5 flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5 font-extrabold text-brand-700 text-lg tracking-tight">
                <span className="grid place-items-center h-8 w-8 rounded-lg bg-brand-600 text-white shadow-sm">
                  <Briefcase size={16} />
                </span>
                SkillMatch
              </div>

              <button 
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-muted transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5">
              {NAV.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-200",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-muted hover:bg-slate-50 hover:text-ink",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon 
                        size={20} 
                        className={isActive ? 'text-brand-600' : 'text-slate-400'} 
                      />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto space-y-2 border-t border-line pt-6">
              <button className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-bold text-muted transition-colors hover:bg-slate-50 hover:text-ink">
                <HelpCircle size={20} className="text-slate-400" />
                Help Center
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}