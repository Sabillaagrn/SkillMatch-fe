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
    <div className="grid min-h-full lg:grid-cols-2">
      <div className="flex items-center justify-center bg-white p-6 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-[420px]">
          <BrandLogo />

          <h1 className="mt-10 text-4xl font-extrabold tracking-tight text-ink">
            Start Your Journey
          </h1>
          <p className="mt-2 text-muted">
            Empower your career with data-driven skill matching and professional
            growth paths.
          </p>

          {errorMsg && (
            <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-600">
              {errorMsg}
            </div>
          )}

          <label className="mt-8 block text-sm font-bold text-ink">
            Full Name
          </label>
          <input
            required
            value={form.name}
            onChange={set("name")}
            placeholder="Enter your full name"
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />

          <label className="mt-5 block text-sm font-bold text-ink">
            Email Address
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={set("email")}
            placeholder="name@company.com"
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />

          <label className="mt-5 block text-sm font-bold text-ink">
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              type={showPw ? "text" : "password"}
              required
              value={form.password}
              onChange={set("password")}
              placeholder="Create a strong password"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 pr-11 text-sm outline-none placeholder:text-muted focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : (
              <>Sign Up <ArrowRight size={18} /></>
            )}
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted">
            <span className="h-px flex-1 bg-line" />
            Or join with
            <span className="h-px flex-1 bg-line" />
          </div>

          <SocialButtons onProvider={enter} />

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-600 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>

      <AuthIllustration className="hidden lg:flex" />
    </div>
  );
}