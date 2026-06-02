import ProtectedLayout from "../components/ProtectedLayout";

export default function SecurityPage() {
  return (
    <ProtectedLayout title="אבטחה" subtitle="הגדרות גישה ורישום פעולות">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן ניתן לנהל חוקים, הרשאות ובקרת אבטחה.</p>
      </div>
    </ProtectedLayout>
  );
}
