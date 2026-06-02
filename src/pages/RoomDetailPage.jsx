import { useParams } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";

export default function RoomDetailPage() {
  const { id } = useParams();

  return (
    <ProtectedLayout title="פרטי חדר" subtitle={`חדר מספר ${id}`}>
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
        <p>כאן יוצגו פרטי החדר והמזערות שלו.</p>
      </div>
    </ProtectedLayout>
  );
}
