import { useNavigate } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";

export default function DocumentsPage() {
  const navigate = useNavigate();

  return (
    <ProtectedLayout title="מסמכים" subtitle="ניהול מסמכים רפואיים ומנהליים">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן תוכלו לראות את רשימת המסמכים ולנווט לעמוד מסמך ספציפי.</p>
        <button
          type="button"
          onClick={() => navigate("/documents/123")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          פתח דוגמת מסמך
        </button>
      </div>
    </ProtectedLayout>
  );
}
