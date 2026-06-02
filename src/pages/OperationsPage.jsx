import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";
import { Loader } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function OperationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [date, setDate] = useState("");

  const treatmentOptions = ["הוצאת שן", "בדיקה", "טיפול שורש", "השתלת שיניים", "חיסון"];

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [docsRes, patsRes] = await Promise.all([api.get("/users/staff/doctors"), api.get("/users/patients")]);
      const docs = docsRes.data || [];
      const pats = patsRes.data || [];
      setDoctors(docs);
      setPatients(pats);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }

  const myProviders = doctors.filter((d) => d.isMyProvider || d.isAssignedToCurrentUser);

  async function handleAssign(e) {
    e.preventDefault();
    setError("");
    if (!selectedDoctor || !selectedPatient || !selectedTreatment) {
      setError("בחר רופא, מטופל וטיפול לפני שמירה");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        doctorId: selectedDoctor.id || selectedDoctor._id,
        patientId: selectedPatient.id || selectedPatient._id,
        treatment: selectedTreatment,
        scheduledAt: date || undefined,
        createdBy: user?.id || user?._id
      };
      await api.post("/appointments", payload);
      // refresh lists or show success
      setSelectedDoctor(null);
      setSelectedPatient(null);
      setSelectedTreatment("");
      setDate("");
      await fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "שגיאה ביצירת התור");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ProtectedLayout title="חדרים ומשמרות" subtitle="ניהול אזורי פעילות ושיבוצים">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctors list column */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm text-right">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">רופאים במערכת</h2>
            <div className="text-sm text-slate-500">הצג את כל הרופאים או רק את המטפלים שלי</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader size={20} className="animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDoctors((d) => [...d])}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs"
                >
                  כל הרופאים
                </button>
                <button
                  type="button"
                  onClick={() => setDoctors(myProviders)}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs"
                >
                  המטפלים שלי
                </button>
              </div>

              <ul className="space-y-3">
                {doctors.map((doc) => (
                  <li
                    key={doc.id || doc._id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`flex items-center justify-between cursor-pointer rounded-lg border p-3 hover:bg-slate-50 ${
                      selectedDoctor && (selectedDoctor.id === doc.id || selectedDoctor._id === doc._id)
                        ? "ring-2 ring-blue-200"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{doc.fullName}</p>
                      <p className="text-xs text-slate-500">{doc.email || doc.phone || "-"}</p>
                    </div>
                    <div className="text-xs text-slate-400">
                      {doc.isMyProvider ? <span className="rounded-full bg-blue-100 px-2 py-0.5">מטפל שלי</span> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Assignment panel */}
        <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
          <h3 className="text-lg font-semibold mb-3">שיבוץ מטופל לרופא</h3>
          <form onSubmit={handleAssign} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">רופא נבחר</label>
              <div className="rounded-lg border border-slate-200 px-3 py-2 bg-slate-50">
                {selectedDoctor ? (
                  <div>
                    <p className="text-sm font-medium">{selectedDoctor.fullName}</p>
                    <p className="text-xs text-slate-500">{selectedDoctor.email || selectedDoctor.phone}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">בחר רופא מהרשימה</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">בחר מטופל</label>
              <select
                value={selectedPatient ? selectedPatient.id || selectedPatient._id : ""}
                onChange={(e) => setSelectedPatient(patients.find((p) => (p.id || p._id) === e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="">בחר מטופל</option>
                {patients.map((p) => (
                  <option key={p.id || p._id} value={p.id || p._id}>
                    {p.fullName} — {p.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">טיפול</label>
              <select
                value={selectedTreatment}
                onChange={(e) => setSelectedTreatment(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="">בחר טיפול</option>
                {treatmentOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">תאריך (אופציונלי)</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "שומר..." : "שבץ מטופל"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDoctor(null);
                  setSelectedPatient(null);
                  setSelectedTreatment("");
                  setDate("");
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                נקה
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
}
