import { useEffect, useState } from "react";
import ProtectedLayout from "../components/ProtectedLayout";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api";
import { Loader, Calendar } from "lucide-react";

function getShiftPeriodLabel(shift) {
  const start = new Date(shift.startsAt).getHours();
  if (start >= 20 || start < 8) return "לילה";
  if (start >= 14) return "ערב";
  return "בוקר";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestHistory, setRequestHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    async function fetchShifts() {
      try {
        setLoading(true);
        const { data } = await api.get("/operations/my-shifts");
        setShifts(data || []);
      } catch (err) {
        console.error("Failed to fetch doctor shifts:", err);
        setError(err?.response?.data?.message || "שגיאה בטעינת המשמרות");
      } finally {
        setLoading(false);
      }
    }

    async function fetchRequestHistory() {
      try {
        setHistoryLoading(true);
        const { data } = await api.get("/documents/requests");
        setRequestHistory(data || []);
      } catch (err) {
        console.error("Failed to fetch request history:", err);
        setHistoryError(err?.response?.data?.message || "שגיאה בטעינת היסטוריית הדוחות");
      } finally {
        setHistoryLoading(false);
      }
    }

    if (user?.role === "DOCTOR" || user?.role === "doctor") {
      fetchShifts();
      fetchRequestHistory();
    }
  }, [user]);

  return (
    <ProtectedLayout title="לוח בקרה" subtitle="ברוכים הבאים למערכת SmartClinic">
      <div className="grid gap-6">
        {/* <div className="rounded-3xl border border-slate-200 bg-white p-6 text-right shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">ברוך הבא</h2>
          <p className="mt-2 text-sm text-slate-600">זוהי דוגמת מסך הבית של מערכת הניהול שלך.</p>
        </div> */}

        {(user?.role === "DOCTOR" || user?.role === "doctor") && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-right shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">היסטוריית דוחות שנשלחו</h2>
                  <p className="text-sm text-slate-500">צפה בבקשות הדוח שנשלחו ללקוחות שלך.</p>
                </div>
                <Calendar className="text-blue-600" size={28} />
              </div>

              {historyLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader size={28} className="animate-spin text-slate-400" />
                </div>
              ) : historyError ? (
                <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{historyError}</div>
              ) : requestHistory.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-600">
                  עדיין לא נשלחו דוחות.
                </div>
              ) : (
                <div className="space-y-3">
                  {requestHistory.slice(0, 5).map((request) => (
                    <div key={request._id} className="rounded-2xl border border-slate-200 p-4 text-right shadow-sm">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{request.title}</p>
                          <p className="text-xs text-slate-500 mt-1">מטופל: {request.patient?.fullName || "-"}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{request.status}</span>
                      </div>
                      <p className="mt-3 text-xs text-slate-500">
                        {new Date(request.createdAt).toLocaleDateString("he-IL")} • {request.type}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-right shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">המשמרות שלי</h2>
                  <p className="text-sm text-slate-500">צפה במשמרות המתוזמנות עם שעות וקטגוריית משמרת.</p>
                </div>
                <Calendar className="text-blue-600" size={28} />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader size={28} className="animate-spin text-slate-400" />
                </div>
              ) : error ? (
                <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
              ) : shifts.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-600">
                  אין משמרות מתוזמנות
                </div>
              ) : (
                <div className="space-y-3">
                  {shifts.slice(0, 5).map((shift) => (
                    <div key={shift._id} className="rounded-2xl border border-slate-200 p-4 text-right shadow-sm">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">{shift.room?.name || "חדר לא ידוע"}</p>
                          <p className="text-xs text-slate-500 mt-1">{shift.room?.type || "-"}</p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {getShiftPeriodLabel(shift)}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <span>
                          {new Date(shift.startsAt).toLocaleTimeString("he-IL", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                        <span>-</span>
                        <span>
                          {new Date(shift.endsAt).toLocaleTimeString("he-IL", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                          {shift.status === "SCHEDULED" ? "מתוזמן" : shift.status === "COMPLETED" ? "הושלם" : "בוטל"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
