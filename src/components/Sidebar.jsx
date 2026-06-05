import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  User,
  LogOut,
  Briefcase,
  HelpCircle,
} from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analysis", label: "Skill Analysis", icon: Settings },
  { to: "/profile", label: "Profile", icon: User },
];

// Fixed left navigation. Mirrors the design: centered brand mark at top, a
// vertical nav with an active left-bar indicator, and a help/logout group
// pinned to the bottom.
export default function Sidebar() {
  const navigate = useNavigate();
  return (
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
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition hover:bg-slate-50 hover:text-ink"
        >
          <HelpCircle size={18} />
          Help Center
        </button>
        <button
          onClick={() => navigate("/login")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
