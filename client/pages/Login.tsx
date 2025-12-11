import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (error.code === "auth/user-not-found") {
        setError("User not found");
      } else if (error.code === "auth/wrong-password") {
        setError("Wrong password");
      } else {
        setError(error.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "GitHub sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{
        backgroundColor: "#0E0E0F",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23222223' fill-opacity='0.08'%3E%3Cpath d='M29 30l-1-1 1-1 1 1-1 1M30 29l-1-1 1-1 1 1-1 1M30 31l-1 1 1 1 1-1-1-1M31 30l 1-1-1-1-1 1 1 1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }}
    >
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 mb-12 text-slate-400 hover:text-white transition"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F91e2732f1c03487e879c66ee97e72712%2Fee08390eccc04e8dbea3ce5415d97e92?format=webp&width=800"
            alt="PinPinCloud"
            className="w-6 h-6"
          />
          <span className="text-sm font-medium">PinPinCloud</span>
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Welcome back
          </h1>
          <p className="text-slate-400 text-base">
            Sign in to your account to continue
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-lg p-8 space-y-6 border"
          style={{
            backgroundColor: "#111214",
            borderColor: "#1F2124",
          }}
        >
          {/* Error Message */}
          {error && (
            <div
              className="px-4 py-3 rounded text-sm border"
              style={{
                backgroundColor: "#1F1315",
                borderColor: "#4A2428",
                color: "#FF6B6B",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 pl-11 text-white placeholder-slate-600 text-sm rounded-lg border transition-colors focus:outline-none"
                  style={{
                    backgroundColor: "#141518",
                    borderColor: "#1F2124",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#2A2E33";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#1F2124";
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-blue-400 hover:text-blue-300 transition font-medium"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-11 text-white placeholder-slate-600 text-sm rounded-lg border transition-colors focus:outline-none"
                  style={{
                    backgroundColor: "#141518",
                    borderColor: "#1F2124",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#2A2E33";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#1F2124";
                  }}
                  required
                />
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded bg-slate-800 border accent-blue-500 cursor-pointer"
                style={{
                  borderColor: "#2A2E33",
                }}
                defaultChecked
              />
              <span className="text-sm text-slate-400">Remember me</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-8"
              style={{
                background: `linear-gradient(135deg, #1A2647 0%, #0F0F10 100%)`,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-3">
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: "#1F2124" }}
              ></div>
              <span className="text-xs text-slate-600 uppercase tracking-wide">
                Or
              </span>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: "#1F2124" }}
              ></div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="py-2.5 px-4 rounded-lg text-slate-300 text-sm font-medium transition-colors hover:text-white disabled:opacity-50 disabled:cursor-not-allowed border"
                style={{
                  backgroundColor: "#0F1113",
                  borderColor: "#1F2124",
                }}
              >
                Google
              </button>
              <button
                type="button"
                onClick={handleGithubSignIn}
                disabled={loading}
                className="py-2.5 px-4 rounded-lg text-slate-300 text-sm font-medium transition-colors hover:text-white disabled:opacity-50 disabled:cursor-not-allowed border"
                style={{
                  backgroundColor: "#0F1113",
                  borderColor: "#1F2124",
                }}
              >
                GitHub
              </button>
            </div>
          </form>

          {/* Footer */}
          <div
            className="text-center pt-6 border-t"
            style={{ borderColor: "#1F2124" }}
          >
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-slate-200 hover:text-white font-semibold transition"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Back Link */}
          <Link
            to="/"
            className="block text-center text-xs text-slate-500 hover:text-slate-400 transition mt-2"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
