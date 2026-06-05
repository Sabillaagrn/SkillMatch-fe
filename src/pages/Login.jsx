import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui.jsx";
import { BrandLogo, SocialButtons, AuthIllustration } from "../components/AuthArt.jsx";
import { loadProfile, saveProfile } from "../lib/storage.js";

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
    <div className="grid min-h-full lg:grid-cols-2">
      <AuthIllustration className="hidden lg:flex" />

      <div className="flex items-center justify-center bg-white p-6 sm:p-10">
        <form onSubmit={submit} className="w-full max-w-[420px]">
          <BrandLogo />

          <h1 className="mt-10 text-4xl font-extrabold tracking-tight text-ink">
            Welcome Back!
          </h1>
          <p className="mt-2 text-muted">
            Sign in to continue your career growth journey.
          </p>

          {errorMsg && (
            <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-600">
              {errorMsg}
            </div>
          )}

          <label className="mt-8 block text-sm font-bold text-ink">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />

          <div className="mt-4 flex items-center justify-between">
            <label className="text-sm font-bold text-ink">Password</label>
            <button
              type="button"
              className="text-sm font-semibold text-brand-600 hover:underline"
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
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs font-medium text-muted">
            <span className="h-px flex-1 bg-line" />
            Or continue with
            <span className="h-px flex-1 bg-line" />
          </div>

          <SocialButtons onProvider={enter} />

          <p className="mt-8 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}