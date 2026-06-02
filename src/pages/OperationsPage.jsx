import { useNavigate } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";

export default function OperationsPage() {
  const navigate = useNavigate();

  return (
    <ProtectedLayout title="חדרים ומשמרות" subtitle="ניהול אזורי פעילות ושיבוצים">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן יוצגו חדרים, משמרות ומשימות ניהול מבצעי.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate("/operations/rooms/123")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            חדר דוגמה
          </button>
          <button
            type="button"
            onClick={() => navigate("/operations/shifts/456")}
            className="rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800"
          >
            משמרת דוגמה
          </button>
        </div>
      </div>
    </ProtectedLayout>
  );
}
