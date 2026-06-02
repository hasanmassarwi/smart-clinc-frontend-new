import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", twoFactorCode: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(form.email, form.password, form.twoFactorCode || undefined);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Clinic Admin Login</h1>
            <p className="text-sm text-slate-500">Secure access to the management dashboard</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="you@clinic.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              required
            />
          </div>

          {/* <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">2FA Code (optional)</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter if 2FA is enabled"
              value={form.twoFactorCode}
              onChange={(e) => updateField("twoFactorCode", e.target.value)}
            />
          </div> */}

          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
