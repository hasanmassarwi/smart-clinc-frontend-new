import ProtectedLayout from "../components/ProtectedLayout";

export default function TeamPage() {
  return (
    <ProtectedLayout title="ניהול צוות" subtitle="תצוגת צוות, תפקידים וקבוצות עבודה">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן תופיע רשימת הצוות וניהול תפקידים.</p>
      </div>
    </ProtectedLayout>
  );
}
