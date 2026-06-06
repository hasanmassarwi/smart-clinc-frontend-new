import { useState, useEffect } from "react";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";
import { Loader, Calendar } from "lucide-react";

export default function MyShiftsPage() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchShifts();
  }, []);

  async function fetchShifts() {
    try {
      setLoading(true);
      const { data } = await api.get("/operations/my-shifts");
      setShifts(data || []);
    } catch (err) {
      console.error("Failed to fetch shifts:", err);
      setError(err?.response?.data?.message || "שגיאה בטעינת המשמרות");
    } finally {
      setLoading(false);
    }
  }

  const groupedShifts = shifts.reduce((acc, shift) => {
    const date = new Date(shift.startsAt).toLocaleDateString("he-IL");
    if (!acc[date]) acc[date] = [];
    acc[date].push(shift);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "מתוזמן";
      case "COMPLETED":
        return "הושלם";
      case "CANCELLED":
        return "בוטל";
      default:
        return status;
    }
  };

  return (
    <ProtectedLayout
      title="המשמרות שלי"
      subtitle="צפה בכל המשמרות שהוקצו לך"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size={32} className="animate-spin text-slate-400" />
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-50 p-6 text-center text-red-700">
          {error}
        </div>
      ) : shifts.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-600 text-lg">אין משמרות מתוזמנות</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedShifts).map(([date, dayShifts]) => (
            <div key={date} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Calendar size={20} className="text-blue-600" />
                {date}
              </h2>
              <div className="space-y-3">
                {dayShifts.map((shift) => (
                  <div
                    key={shift._id}
                    className="rounded-lg border border-slate-200 p-4 hover:shadow-md transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 text-right">
                        <p className="text-base font-semibold text-slate-900">
                          {shift.room?.name || "חדר לא ידוע"}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          סוג: {shift.room?.type || "-"}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(shift.startsAt).toLocaleTimeString("he-IL", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(shift.endsAt).toLocaleTimeString("he-IL", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-block rounded-full px-4 py-1 text-xs font-semibold ${getStatusColor(
                            shift.status
                          )}`}
                        >
                          {getStatusLabel(shift.status)}
                        </span>
                      </div>
                    </div>
                    {shift.notes && (
                      <p className="text-sm text-slate-600 mt-3 border-t border-slate-100 pt-3">
                        הערות: {shift.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </ProtectedLayout>
  );
}
