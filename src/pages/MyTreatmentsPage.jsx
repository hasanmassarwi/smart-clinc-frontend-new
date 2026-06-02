import { useEffect, useState } from "react";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";
import { Loader } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function MyTreatmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchAppointments() {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      const id = user.id || user._id;
      const params = {};
      if (user.role === "DOCTOR") params.doctorId = id;
      else if (user.role === "PATIENT") params.patientId = id;
      // Admins see all appointments
      const { data } = await api.get("/appointments", { params });
      setAppointments(data || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "שגיאה בטעינת טיפולים");
    } finally {
      setLoading(false);
    }
  }

  const statusColors = {
    SCHEDULED: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800"
  };

  return (
    <ProtectedLayout title="הטיפולים שלי" subtitle="רשימת הטיפולים המשוייכים אלי">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <h2 className="text-lg font-semibold mb-4">הטיפולים שלי</h2>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size={20} className="animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="py-8 text-slate-500">לא נמצאו טיפולים</div>
        ) : (
          <ul className="space-y-3">
            {appointments.map((a) => (
              <li key={a._id || a.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-xs text-slate-500">שם טיפול:</div>
                              <span className="rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-sm font-semibold">{a.treatment}</span>
                            </div>
                        </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600">
                      <div>
                        <div className="text-xs text-slate-500">מטופל</div>
                        <div className="mt-1">{a.patient?.fullName || a.patient?.email || "-"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">תאריך</div>
                        <div className="mt-1">{a.scheduledAt ? new Date(a.scheduledAt).toLocaleString("he-IL") : "לא נקבע"}</div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">סטטוס</div>
                        <div className={`inline-block mt-1 rounded-full px-3 py-1 text-xs font-medium ${statusColors[a.status] || "bg-slate-100 text-slate-800"}`}>{a.status}</div>
                      </div>
                    </div>

                    {a.notes ? <div className="mt-3 text-sm text-slate-700">הערות: {a.notes}</div> : null}
                  </div>
                  {/* createdAt removed per UX request */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedLayout>
  );
}
