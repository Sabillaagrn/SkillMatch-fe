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
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-line bg-white px-4 py-3">
        <div className="flex items-center gap-2 font-extrabold text-brand-700">
          <Briefcase size={18} />
          SkillMatch
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* SPACE PENGGANTI TOPBAR (biar konten ga ketiban) */}
      <div className="md:hidden h-14" />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-64 shrink-0 flex-col border-r border-line bg-white">
        <div className="flex flex-col items-center gap-3 px-6 pt-9 pb-7">
          <span className="grid place-items-center h-14 w-14 rounded-full bg-brand-600 text-white shadow-card">
            <Briefcase size={24} />
          </span>
          <div className="text-center">
            <div className="text-xl font-extrabold tracking-tight text-brand-700">
              SkillMatch
            </div>
            <div className="text-sm font-medium text-muted">Career Growth</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-muted hover:bg-slate-50 hover:text-ink",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-600" />
                  )}
                  <Icon size={18} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-line px-3 py-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted hover:bg-slate-50 hover:text-ink">
            <HelpCircle size={18} />
            Help Center
          </button>

          <button
            onClick={() => navigate("/login")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-extrabold text-brand-700">
                <Briefcase size={18} />
                SkillMatch
              </div>

              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <nav className="space-y-1">
              {NAV.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-muted hover:bg-slate-50 hover:text-ink",
                    ].join(" ")
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto space-y-1 border-t border-line pt-4">
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted">
                <HelpCircle size={18} />
                Help Center
              </button>

              <button
                onClick={() => navigate("/login")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}