import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setError("");
  }

  function toggleMode() {
    setIsSignup(!isSignup);
    resetForm();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl md:text-2xl text-primary">
            <img src="/logo.png" alt="ZiwaClear" className="rounded-full" width="36" height="36" />
            ZiwaClear
          </Link>
          <h1 className="text-lg md:text-xl font-bold mt-4 md:mt-6">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted text-xs md:text-sm mt-2">
            {isSignup
              ? "Join the marketplace and start trading biomass"
              : "Sign in to access your buyer dashboard"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-tile border border-border-ui rounded-tile p-5 md:p-6 flex flex-col gap-4">
          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-input px-4 py-2">
              {error}
            </div>
          )}

          {isSignup && (
            <div>
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Muthoni"
                autoComplete="name"
                className="w-full mt-1 bg-input border border-border-ui rounded-input px-3 md:px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="buyer@example.com"
              autoComplete="email"
              className="w-full mt-1 bg-input border border-border-ui rounded-input px-3 md:px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="w-full bg-input border border-border-ui rounded-input px-3 md:px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary/40 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-primary text-background font-semibold text-sm
                       py-2.5 rounded-pill hover:bg-primary-hover transition-colors disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-pulse">{isSignup ? "Creating account..." : "Signing in..."}</span>
            ) : (
              <>
                <LogIn size={16} />
                {isSignup ? "Create Account" : "Sign In"}
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-muted hover:text-primary transition-colors"
            >
              {isSignup
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center gap-1 text-xs text-muted hover:text-foreground transition-colors mt-2"
          >
            <ArrowLeft size={12} /> Back to home
          </Link>
        </form>
      </div>
    </div>
  );
}