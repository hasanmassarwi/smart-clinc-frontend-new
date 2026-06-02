import { useNavigate } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";

export default function FinancePage() {
  const navigate = useNavigate();

  return (
    <ProtectedLayout title="ניהול פיננסי" subtitle="חשבוניות ותנועות תשלום">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן יוצגו סיכומים פיננסיים וחשבוניות.</p>
        <button
          type="button"
          onClick={() => navigate("/finance/123")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          פתח דוגמת חשבונית
        </button>
      </div>
    </ProtectedLayout>
  );
}
