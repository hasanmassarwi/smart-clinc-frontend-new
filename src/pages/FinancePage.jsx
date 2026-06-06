import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";
import { Loader } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function FinancePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchFinanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchFinanceData() {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (user?.role === "DOCTOR") {
        params.doctorId = user.id || user._id;
      }
      const { data } = await api.get("/appointments", { params });
      setAppointments(data || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "שגיאה בטעינת נתוני פיננסים");
    } finally {
      setLoading(false);
    }
  }

  const totalEarnings = appointments.reduce((sum, appt) => sum + Number(appt.amount || 0), 0);

  return (
    <ProtectedLayout title="ניהול פיננסי" subtitle="חשבוניות ותנועות תשלום">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm text-slate-500">הכנסות מן הטיפולים שנרשמו</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">₪{totalEarnings.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">סך כל הטיפולים</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{appointments.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 flex items-center justify-center py-8">
            <Loader size={20} className="animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="mt-6 py-8 text-slate-500">לא נמצאו ביקורים פיננסיים</div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-5 gap-4 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <span>מטופל</span>
              <span>טיפול</span>
              <span>תאריך</span>
              <span>סכום</span>
              <span className="text-right">סטטוס</span>
            </div>
            <div className="divide-y divide-slate-200 bg-white">
              {appointments.map((appt) => (
                <div
                  key={appt._id || appt.id}
                  className="grid grid-cols-5 gap-4 px-4 py-4 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <div>{appt.patient?.fullName || appt.patient?.email || "-"}</div>
                  <div>{appt.treatment}</div>
                  <div>{appt.scheduledAt ? new Date(appt.scheduledAt).toLocaleDateString("he-IL") : "לא נקבע"}</div>
                  <div>₪{(appt.amount || 0).toFixed(2)}</div>
                  <div className="text-right font-semibold text-slate-900">{appt.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
