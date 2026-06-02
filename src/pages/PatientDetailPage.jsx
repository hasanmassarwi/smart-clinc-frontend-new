import { useParams } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";

export default function PatientDetailPage() {
  const { id } = useParams();

  return (
    <ProtectedLayout title="פרטי מטופל" subtitle={`מטופל מספר ${id}`}>
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן יוצגו פרטי המטופל עם מזהה {id}.</p>
      </div>
    </ProtectedLayout>
  );
}
