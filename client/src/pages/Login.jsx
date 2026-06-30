import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("admin@gym.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-volt">
            <Dumbbell className="h-5 w-5 text-volt-ink" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-semibold">FlexCore</span>
        </div>

        <div className="max-w-md">
          <h1 className="font-display text-4xl font-semibold leading-tight">
            Run your gym like a business, not a spreadsheet.
          </h1>
          <p className="mt-4 text-sm text-white/55">
            Members, memberships, payments, and attendance — all in one clean dashboard built for
            front-desk speed.
          </p>
        </div>

        <p className="text-xs text-white/30">© {new Date().getFullYear()} FlexCore. All rights reserved.</p>

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-volt/10 blur-3xl" />
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-bg p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink">
                <Dumbbell className="h-5 w-5 text-volt" strokeWidth={2.5} />
              </div>
              <span className="font-display text-lg font-semibold text-ink">FlexCore</span>
            </div>
          </div>

          <h2 className="font-display text-2xl font-semibold text-ink">Welcome back</h2>
          <p className="mt-1 text-sm text-ink-soft">Sign in to manage your gym.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>
            )}

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gym.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="volt" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-center text-xs text-ink-faint">
              Demo credentials: admin@gym.com / admin123 (run the seed script)
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
