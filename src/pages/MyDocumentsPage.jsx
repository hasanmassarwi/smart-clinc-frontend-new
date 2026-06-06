import { useEffect, useState } from "react";
import ProtectedLayout from "../components/ProtectedLayout";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const documentTypeLabels = {
  PRESCRIPTION: "מרשם",
  REFERRAL: "הפניה",
  SICK_LEAVE: "אישור מחלה",
  LAB_RESULT: "תוצאות מעבדה",
  ADMIN_FORM: "טופס מנהלי",
  OTHER: "אחר"
};

export default function MyDocumentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      setLoading(true);
      const { data } = await api.get("/documents/requests");
      setDocuments(data || []);
      setError("");
    } catch (err) {
      console.error("Failed to load my documents:", err);
      setError(err?.response?.data?.message || "שגיאה בטעינת המסמכים שלי");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedLayout title="המסמכים שלי" subtitle="מסמכים שהוקצו לך במערכת"> 
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">המסמכים שהוקצו לך</h2>
            <p className="text-sm text-slate-500">כאן תוכל לצפות בכל המסמכים שהוקצו לך ולפתוח אותם לפרטים.</p>
          </div>
          <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            {user?.fullName ? `שלום, ${user.fullName}` : "שלום"}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={28} className="animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : documents.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-8 text-center text-slate-500">
            עדיין לא נקשרו אליך מסמכים.
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((document) => (
              <button
                key={document._id}
                type="button"
                onClick={() => navigate(`/documents/${document._id}`)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-5 text-right shadow-sm transition hover:border-blue-300 hover:bg-white"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{document.title || documentTypeLabels[document.type] || document.type}</p>
                    <p className="mt-1 text-sm text-slate-500">{documentTypeLabels[document.type] || document.type}</p>
                    {document.notes ? <p className="mt-2 text-sm text-slate-500">{document.notes}</p> : null}
                  </div>
                  <div className="flex flex-col items-start gap-2 text-xs text-slate-500 sm:items-end">
                    <span>{new Date(document.createdAt).toLocaleDateString("he-IL")}</span>
                    {document.doctor?.fullName && <span>נוצר על ידי: {document.doctor.fullName}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
