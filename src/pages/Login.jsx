import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui.jsx";
import { BrandLogo, SocialButtons, AuthIllustration } from "../components/AuthArt.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const enter = () => navigate("/dashboard");
  
  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Email atau password salah.");
    }

    localStorage.setItem("email", email);

    enter();
    
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Kolom Ilustrasi (Kiri pada Desktop) */}
      <div className="hidden lg:flex relative bg-brand-50/30">
        <AuthIllustration className="h-full w-full object-cover" />
      </div>

      {/* Kolom Form (Kanan pada Desktop) */}
      <div className="flex flex-col justify-center bg-white px-6 py-12 sm:px-10 lg:px-12 xl:px-16 animate-in fade-in duration-500">
        <div className="mx-auto w-full max-w-[420px]">
          <BrandLogo />

          <div className="mt-10 mb-8 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
              Welcome Back!
            </h1>
            <p className="text-sm sm:text-base text-muted">
              Sign in to continue your career growth journey.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-center rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm font-semibold text-rose-600 shadow-sm animate-in fade-in slide-in-from-top-2">
              {errorMsg}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-ink">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-muted/70 hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-ink">Password</label>
                <button
                  type="button"
                  className="text-xs sm:text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 hover:underline focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Input Password"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-muted/70 hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
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
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted/80">
            <span className="h-px flex-1 bg-line/80" />
            Or continue with
            <span className="h-px flex-1 bg-line/80" />
          </div>

          <SocialButtons onProvider={enter} />

          <p className="mt-10 text-center text-sm font-medium text-muted">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-bold text-brand-600 transition-colors hover:text-brand-700 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}