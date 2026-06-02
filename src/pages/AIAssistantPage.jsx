import ProtectedLayout from "../components/ProtectedLayout";

export default function AIAssistantPage() {
  return (
    <ProtectedLayout title="עוזר AI" subtitle="כלים חכמים לניתוח נתונים ותמיכה החלטתית">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן יופעל העוזר החכם של המערכת.</p>
      </div>
    </ProtectedLayout>
  );
}
