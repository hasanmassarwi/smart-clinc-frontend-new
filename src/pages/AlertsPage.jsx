import { Link } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";

export default function AlertsPage() {
  return (
    <ProtectedLayout title="התראות" subtitle="כל ההתראות של המערכת במקום אחד">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן תוצג רשימת התראות מערכת. ההפניה חזרה ללוח הבקרה פעילה.</p>
        <div className="mt-4">
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            ← חזרה ללוח הבקרה
          </Link>
        </div>
      </div>
    </ProtectedLayout>
  );
}
