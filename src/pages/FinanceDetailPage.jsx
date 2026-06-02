import { useParams } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";

export default function FinanceDetailPage() {
  const { id } = useParams();

  return (
    <ProtectedLayout title="פרטי חשבונית" subtitle={`חשבונית מספר ${id}`}>
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן יוצגו פרטי החשבונית עם מזהה {id}.</p>
      </div>
    </ProtectedLayout>
  );
}
