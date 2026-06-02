import ProtectedLayout from "../components/ProtectedLayout";

export default function StaffPage() {
  return (
    <ProtectedLayout title="צוות" subtitle="ניהול אנשי צוות ומשימות אישיות">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן יופיעו חברי הצוות ופרטי המשימות שלהם.</p>
      </div>
    </ProtectedLayout>
  );
}
