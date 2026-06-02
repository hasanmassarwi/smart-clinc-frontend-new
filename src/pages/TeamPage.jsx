import { useState, useEffect } from "react";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";
import { Loader } from "lucide-react";

export default function TeamPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      setLoading(true);
      const { data } = await api.get("/users");
      const onlyPatients = (data || []).filter(
        (u) => u.role === "PATIENT" || u.role === "patient"
      );
      setPatients(onlyPatients);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.phone) {
      setError("שם מלא וטלפון נדרשים");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/users", {
        fullName: form.fullName,
        email: form.email || undefined,
        password: form.password || form.phone || "password123",
        phone: form.phone,
        role: "PATIENT"
      });
      setForm({ fullName: "", phone: "", email: "", password: "" });
      await fetchPatients();
    } catch (err) {
      setError(err?.response?.data?.message || "שגיאה ביצירת מטופל");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ProtectedLayout title="ניהול צוות" subtitle="תצוגת צוות, תפקידים וקבוצות עבודה">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create patient form (left on LTR, right on RTL due to text-right) */}
        <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
          <h2 className="mb-3 text-lg font-semibold">צור מטופל חדש</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">שם מלא</label>
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="יוחנן כהן"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">טלפון</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="050-1234567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">אימייל (אופציונלי)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="patient@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">סיסמה (אופציונלי)</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="אם לא נבחרת, ייווצר סיסמה אוטומטית"
              />
            </div>

            {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "יוצר..." : "צור מטופל"}
              </button>
            </div>
          </form>
        </div>

        {/* Patients list */}
        <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
          <h2 className="mb-3 text-lg font-semibold">מטופלים ברשימה</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader size={20} className="animate-spin text-slate-400" />
            </div>
          ) : patients.length === 0 ? (
            <div className="py-8 text-slate-500">אין מטופלים ברשימה</div>
          ) : (
            <ul className="space-y-3">
              {patients.map((p) => (
                <li key={p.id || p._id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{p.fullName}</p>
                    <p className="text-xs text-slate-500">{p.phone} {p.email ? `· ${p.email}` : null}</p>
                  </div>
                  <div className="text-xs text-slate-400">{p.createdAt ? new Date(p.createdAt).toLocaleDateString("he-IL") : "-"}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
