import { useNavigate } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";

export default function PatientsPage() {
  const navigate = useNavigate();

  return (
    <ProtectedLayout title="מטופלים" subtitle="ניהול רשימת מטופלים ופרטיהם">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן תוצג רשימת המטופלים.</p>
        <button
          type="button"
          onClick={() => navigate("/patients/123")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          פתח מטופל דוגמה
        </button>
      </div>
    </ProtectedLayout>
  );
}
