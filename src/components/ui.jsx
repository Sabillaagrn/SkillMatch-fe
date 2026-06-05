// Small, reusable presentational primitives shared across pages.
// Kept in one file to avoid a sprawl of tiny modules; each is exported by name.
import { useState, useRef, useEffect } from "react";
import { Loader2, ChevronDown, Check, X } from "lucide-react";

const cx = (...c) => c.filter(Boolean).join(" ");

export function Button({
  as: As = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
    soft: "bg-brand-50 text-brand-700 hover:bg-brand-100",
    outline: "border border-line text-ink hover:bg-slate-50",
    ghost: "text-muted hover:bg-slate-100 hover:text-ink",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-5 py-3",
  };
  return (
    <As className={cx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </As>
  );
}

export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={cx(
        "bg-white border border-line rounded-2xl shadow-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ tone = "brand", className = "", children }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Spinner({ className = "" }) {
  return <Loader2 className={cx("animate-spin", className)} />;
}

// Polished select-style dropdown. Controlled: parent owns `value`.
// options: [{ value, label }]. Closes on outside click / selection.
export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Pilih…",
  full = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cx("relative", full && "w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cx(
          "inline-flex items-center justify-between gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-100",
          full && "w-full"
        )}
      >
        <span className={selected ? "text-ink" : "text-muted"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cx("text-muted transition", open && "rotate-180")}
        />
      </button>
      {open && (
        <ul
          className={cx(
            "absolute z-30 mt-2 max-h-64 overflow-auto rounded-xl border border-line bg-white p-1 shadow-card",
            full ? "left-0 right-0" : "right-0 min-w-[200px]"
          )}
        >
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={cx(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition",
                  o.value === value
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink hover:bg-slate-50"
                )}
              >
                {o.label}
                {o.value === value && <Check size={15} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Centered modal dialog with a backdrop. Closes on backdrop click or Escape.
export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-slate-100 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ProgressBar({ value = 0, tone = "brand", className = "" }) {
  const tones = {
    brand: "bg-brand-600",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cx("h-2 w-full rounded-full bg-slate-100", className)}>
      <div
        className={cx("h-2 rounded-full transition-all", tones[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
