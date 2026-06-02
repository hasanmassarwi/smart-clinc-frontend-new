import ProtectedLayout from "../components/ProtectedLayout";

export default function DashboardPage() {
  return (
    <ProtectedLayout title="לוח בקרה" subtitle="ברוכים הבאים למערכת SmartClinic">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-right shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">ברוך הבא</h2>
        <p className="mt-2 text-sm text-slate-600">זוהי דוגמת מסך הבית של מערכת הניהול שלך.</p>
      </div>
    </ProtectedLayout>
  );
}
