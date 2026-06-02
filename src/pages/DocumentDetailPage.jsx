import { useParams } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";

export default function DocumentDetailPage() {
  const { id } = useParams();

  return (
    <ProtectedLayout title="פרטי מסמך" subtitle={`מסמך מספר ${id}`}>
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן יוצגו פרטי המסמך עם מזהה {id}.</p>
      </div>
    </ProtectedLayout>
  );
}
