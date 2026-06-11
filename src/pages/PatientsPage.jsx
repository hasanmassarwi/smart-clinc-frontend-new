import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";
import { Loader, Mail, Phone, UserRound, ArrowLeft } from "lucide-react";

export default function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/users/patients");
        setPatients(data || []);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "לא ניתן לטעון את רשימת המטופלים");
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, []);

  return (
    <ProtectedLayout title="מטופלים" subtitle="ניהול רשימת מטופלים ופרטיהם">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size={20} className="animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : patients.length === 0 ? (
          <div className="py-8 text-slate-500">אין מטופלים להצגה</div>
        ) : (
          <div className="space-y-3">
            {patients.map((patient) => (
              <div key={patient._id || patient.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-900">
                    <UserRound size={18} className="text-blue-600" />
                    <span className="text-base font-semibold">{patient.fullName || patient.email}</span>
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

                <button
                  type="button"
                  onClick={() => navigate(`/patients/${patient._id || patient.id}`)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  הצג ביקורים ומידע
                  <ArrowLeft size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
