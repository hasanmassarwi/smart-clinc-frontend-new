import ProtectedLayout from "../components/ProtectedLayout";

export default function ReportsPage() {
  return (
    <ProtectedLayout title="דוחות" subtitle="דוחות מערכת וניתוחים חשובים">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן יוצגו דוחות מסחריים ומערכות.</p>
      </div>
    </ProtectedLayout>
  );
}
