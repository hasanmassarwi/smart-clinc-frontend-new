import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";
import { Loader } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function AppointmentSummaryPage() {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [summary, setSummary] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    loadAppointment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, appointmentId]);

  async function loadAppointment() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get(`/appointments/${appointmentId}`);
      setAppointment(data);
      setSummary(data.visitSummary || "");
      setAmount(data.amount !== undefined && data.amount !== null ? String(data.amount) : "");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "שגיאה בטעינת ביקור");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!summary && amount === "") {
      setError("אנא הכנס סיכום או סכום טיפול לפני שמירה.");
      return;
    }

    try {
      setSaving(true);
      await api.put(`/appointments/${appointmentId}`, {
        visitSummary: summary,
        amount: amount === "" ? undefined : Number(amount)
      });
      setSuccess("סיכום הביקור נשמר בהצלחה.");
      navigate("/my-treatments");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "שגיאה בשמירת סיכום הביקור");
    } finally {
      setSaving(false);
    }
  }

  const canEdit = user?.role === "DOCTOR";

  return (
    <ProtectedLayout title="סיכום ביקור" subtitle="הוספת סיכום וסכום טיפול למטופל שלך">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size={20} className="animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : !appointment ? (
          <div className="py-8 text-slate-500">לא נמצא ביקור</div>
        ) : !canEdit ? (
          <div className="py-8 text-slate-500">אין לך הרשאה לעדכן סיכום ביקור.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">מטופל</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{appointment.patient?.fullName || appointment.patient?.email}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">טיפול</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{appointment.treatment}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">תאריך</p>
                <p className="mt-2 text-base text-slate-900">
                  {appointment.scheduledAt ? new Date(appointment.scheduledAt).toLocaleString("he-IL") : "לא נקבע"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">סטטוס</p>
                <p className="mt-2 text-base text-slate-900">{appointment.status}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">מטפל</p>
                <p className="mt-2 text-base text-slate-900">{appointment.doctor?.fullName || appointment.doctor?.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">סיכום ביקור</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="כתוב כאן את סיכום הביקור לטיפול"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">סכום טיפול (₪)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="הכנס סכום טיפול"
              />
            </div>

            {success ? <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div> : null}
            {error ? <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "שומר..." : "שמור סיכום"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                חזור
              </button>
            </div>
          </form>
        )}
      </div>
    </ProtectedLayout>
  );
}
