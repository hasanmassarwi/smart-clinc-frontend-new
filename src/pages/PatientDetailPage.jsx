import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";
import { Loader, CalendarDays, Stethoscope, Wallet, UserRound, Mail, Phone } from "lucide-react";

const statusStyles = {
  SCHEDULED: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-800"
};

const statusLabels = {
  SCHEDULED: "ממתין",
  APPROVED: "מאושר",
  COMPLETED: "הושלם",
  CANCELLED: "בוטל"
};

export default function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadPatientData() {
      try {
        setLoading(true);
        setError("");
        const [patientRes, appointmentsRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get("/appointments", { params: { patientId: id } })
        ]);
        setPatient(patientRes.data);
        setAppointments(appointmentsRes.data || []);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "לא ניתן לטעון את פרטי המטופל");
      } finally {
        setLoading(false);
      }
    }

    loadPatientData();
  }, [id]);

  const totalAmount = useMemo(() => {
    return appointments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [appointments]);

  return (
    <ProtectedLayout title="פרטי מטופל" subtitle="היסטוריית ביקורים, סיכומים ותמחור">
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm text-right">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size={20} className="animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : !patient ? (
          <div className="py-8 text-slate-500">לא נמצא מטופל</div>
        ) : (
          <>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-900">
                    <UserRound size={18} className="text-blue-600" />
                    <span className="text-lg font-semibold">{patient.fullName || patient.email}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Mail size={15} className="text-slate-400" />
                      {patient.email}
                    </span>
                    {patient.phone ? (
                      <span className="flex items-center gap-1">
                        <Phone size={15} className="text-slate-400" />
                        {patient.phone}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm">
                  <div className="text-slate-500">סה"כ לתשלום</div>
                  <div className="mt-1 text-xl font-semibold text-slate-900">₪{totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">מספר ביקורים</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{appointments.length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">סטטוס אחרון</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{appointments[0]?.status ? statusLabels[appointments[0].status] || appointments[0].status : "אין נתונים"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">מצב חיוב</p>
                <p className="mt-2 text-base font-semibold text-slate-900">מוכן לעיבוד</p>
              </div>
            </div>

            {appointments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                אין ביקורים רשומים למטופל זה עדיין
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment._id || appointment.id} className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-900">
                          <Stethoscope size={18} className="text-blue-600" />
                          <span className="text-base font-semibold">{appointment.treatment}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays size={16} className="text-slate-400" />
                          <span>{appointment.scheduledAt ? new Date(appointment.scheduledAt).toLocaleString("he-IL") : "תאריך לא נקבע"}</span>
                        </div>
                      </div>
                      <div className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[appointment.status] || "bg-slate-100 text-slate-700"}`}>
                        {statusLabels[appointment.status] || appointment.status}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-xl bg-white p-3 text-sm text-slate-700">
                        <div className="font-medium">סיכום הביקור</div>
                        <div className="mt-1 whitespace-pre-wrap text-slate-600">
                          {appointment.visitSummary || "טרם נכתב סיכום ביקור"}
                        </div>
                      </div>

                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                        <div className="flex items-center gap-2 text-sm text-emerald-700">
                          <Wallet size={16} />
                          <span>סכום לתשלום</span>
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-emerald-800">
                          ₪{Number(appointment.amount || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedLayout>
  );
}
