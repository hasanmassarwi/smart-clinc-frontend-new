import { useEffect, useState } from "react";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Loader } from "lucide-react";

const referenceTypes = [
  { label: "אישור רפואי", value: "MEDICAL_APPROVAL" },
  // { label: "דוח", value: "REPORT" },
  { label: "הפניה", value: "REFERRAL" },
  { label: "מרשם", value: "PRESCRIPTION" },
  // { label: "תוצאות מעבדה", value: "LAB_RESULT" },
  // { label: "טופס מנהלי", value: "ADMIN_FORM" }
];

export default function DocumentsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedReference, setSelectedReference] = useState(referenceTypes[0].value);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    fetchPatients();
    fetchRecentRequests();
  }, []);

  async function fetchPatients() {
    try {
      setLoading(true);
      const response = await api.get("/users/patients");
      setPatients(response.data || []);
    } catch (err) {
      console.error("Failed to load patients:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecentRequests() {
    try {
      const response = await api.get("/documents/requests");
      setRecentRequests(response.data || []);
    } catch (err) {
      console.error("Failed to load requests:", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!selectedPatient) {
      setError("בחר מטופל לפני שליחת הבקשה.");
      return;
    }

    if (!selectedReference) {
      setError("בחר סוג מסמך מהרשימה.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/documents/requests", {
        patient: selectedPatient,
        type: selectedReference,
        title: referenceTypes.find((item) => item.value === selectedReference)?.label || "מסמך",
        notes
      });
      setSuccessMessage("הבקשה נשלחה בהצלחה.");
      setSelectedPatient("");
      setNotes("");
      await fetchRecentRequests();
    } catch (err) {
      setError(err?.response?.data?.message || "שגיאה בשליחת הבקשה.");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedPatientObject = patients.find((p) => p.id === selectedPatient || p._id === selectedPatient);

  return (
    <ProtectedLayout title="מסמכים" subtitle="ניהול מסמכים רפואיים ומנהליים">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm text-right">
          <h2 className="text-lg font-semibold mb-4">שליחת הפניה למטופל</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">בחר מטופל</label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="">בחר מטופל</option>
                {patients.map((patient) => (
                  <option key={patient._id || patient.id} value={patient._id || patient.id}>
                    {patient.fullName || patient.email} {patient.phone ? `— ${patient.phone}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">בחר סוג מסמך</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {referenceTypes.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedReference(item.value)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      selectedReference === item.value
                        ? "border-blue-500 bg-blue-50 text-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">פרטי הבקשה (אופציונלי)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="הערות נוספות לגבי אישור רפואי או הפניה"
              />
            </div>

            {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {successMessage && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div>}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "שולח..." : "שלח אישור למטופל"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPatient("");
                  setSelectedReference(referenceTypes[0].value);
                  setNotes("");
                  setError("");
                  setSuccessMessage("");
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 hover:bg-slate-50"
              >
                נקה טופס
              </button>
            </div>
          </form>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-md font-semibold mb-3">רופא נבחר</h3>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">{user?.fullName || "משתמש"}</p>
              <p className="mt-1 text-sm text-slate-600">תפקיד: רופא</p>
              {selectedPatientObject ? (
                <p className="mt-2 text-sm text-slate-700">הבקשה תישלח למטופל: {selectedPatientObject.fullName}</p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">בחר מטופל כדי להקצות את הבקשה.</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
          <h2 className="text-lg font-semibold mb-4">רשימת סוגי הפניה</h2>
          <div className="space-y-3">
            {referenceTypes.map((item) => (
              <div key={item.value} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{item.label}</p>
                  {selectedReference === item.value ? (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">נבחר</span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  בחר כאן כדי לשלוח אישור או הפניה למטופל שלך.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">בקשות אחרונות</h3>
            {recentRequests.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">אין בקשות שנשלחו עדיין.</div>
            ) : (
              <ul className="space-y-3">
                {recentRequests.slice(0, 5).map((request) => (
                  <li key={request._id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                    <div className="flex items-center justify-between gap-3 text-sm text-slate-700">
                      <div>
                        <p className="font-medium">
                          {request.title} — {request.patient?.fullName || "מטופל"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">סטטוס: {request.status}</p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        {new Date(request.createdAt).toLocaleDateString("he-IL")}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
