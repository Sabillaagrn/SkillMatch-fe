import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui.jsx";
import { BrandLogo, SocialButtons, AuthIllustration } from "../components/AuthArt.jsx";
import { loadProfile, saveProfile } from "../lib/storage.js";
const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const enter = () => navigate("/dashboard");

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Gagal mendaftar. Email mungkin sudah digunakan.");
      }

      // Simpan nama dari form registrasi ke profil lokal
      const currentProfile = loadProfile() || { skills: [] };
      saveProfile({ 
        ...currentProfile, 
        name: form.name, 
        email: form.email 
      });

      navigate("/login");
      
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Kolom Form */}
      <div className="flex flex-col justify-center bg-white px-6 py-12 sm:px-10 lg:px-12 xl:px-16 animate-in fade-in duration-500">
        <div className="mx-auto w-full max-w-[420px]">
          <BrandLogo />

          <div className="mt-10 mb-8 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
              Start Your Journey
            </h1>
            <p className="text-sm sm:text-base text-muted">
              Empower your career with data-driven skill matching and professional
              growth paths.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-center rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm font-semibold text-rose-600 shadow-sm animate-in fade-in slide-in-from-top-2">
              {errorMsg}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {/* Input Full Name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-ink">
                Full Name
              </label>
              <input
                required
                value={form.name}
                onChange={set("name")}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-muted/70 hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Input Email Address */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-ink">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={set("email")}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-muted/70 hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-ink">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Create a strong password"
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 pr-12 text-sm outline-none transition-all placeholder:text-muted/70 hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted transition-colors hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 rounded-lg"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="mt-2 w-full shadow-sm transition-all hover:shadow-md" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-white/80" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign Up <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted/80">
            <span className="h-px flex-1 bg-line/80" />
            Or join with
            <span className="h-px flex-1 bg-line/80" />
          </div>

          <SocialButtons onProvider={enter} />

          <p className="mt-10 text-center text-sm font-medium text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-brand-600 transition-colors hover:text-brand-700 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Kolom Ilustrasi (Hanya muncul di Desktop) */}
      <div className="hidden lg:flex relative bg-brand-50/30">
        <AuthIllustration className="h-full w-full object-cover" />
      </div>
    </div>
  );
}