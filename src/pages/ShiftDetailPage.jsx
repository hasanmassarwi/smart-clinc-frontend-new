import { useParams } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";

export default function ShiftDetailPage() {
  const { id } = useParams();

  return (
    <ProtectedLayout title="פרטי משמרת" subtitle={`משמרת מספר ${id}`}>
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן יוצגו פרטי המשמרת והצוות המשוייכים אליה.</p>
      </div>
    </ProtectedLayout>
  );
}
