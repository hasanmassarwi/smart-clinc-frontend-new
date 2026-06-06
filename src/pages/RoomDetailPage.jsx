import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";
import { Loader, X } from "lucide-react";

const ROOMS = [
  { id: 1, name: "חדר בדיקה 1", type: "בדיקה כללית", equipment: ["מיטה", "מטבח חומרים"] },
  { id: 2, name: "חדר בדיקה 2", type: "בדיקה כללית", equipment: ["מיטה", "מטבח חומרים"] },
  { id: 3, name: "חדר כירורגיה", type: "ניתוח", equipment: ["שולחן ניתוח", "מכשור מעקב"] },
  { id: 4, name: "חדר שיניים", type: "שיניים", equipment: ["כיסא שיניים", "מקדחה", "יניקה"] },
  { id: 5, name: "חדר קרדיולוגיה", type: "בדיקות לב", equipment: ["ECG", "הולטר", "אולטראסאונד"] },
];

const SHIFTS = [
  { id: "morning", label: "בוקר", hours: "08:00–14:00" },
  { id: "evening", label: "ערב", hours: "14:00–20:00" },
  { id: "night", label: "לילה", hours: "20:00–08:00" },
];

const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

export default function RoomDetailPage() {
  const { id } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState({});
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - new Date().getDay())));
  const [draggedDoctor, setDraggedDoctor] = useState(null);
  const [draggedShift, setDraggedShift] = useState(null);

  const room = ROOMS.find((r) => r.id === parseInt(id)) || ROOMS[0];

  useEffect(() => {
    fetchDoctors();
    fetchRoom();
  }, []);

  async function fetchDoctors() {
    try {
      setLoading(true);
      const { data } = await api.get("/users");
      const doctorsList = (data || []).filter(
        (u) => u.role === "DOCTOR" || u.role === "doctor"
      );
      setDoctors(doctorsList);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setError("שגיאה בטעינת רופאים");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRoom() {
    try {
      // if id looks like a numeric index (from the local ROOMS stub), fetch all rooms and pick index
      const isNumericId = /^\d+$/.test(id);
      if (isNumericId) {
        const { data } = await api.get(`/operations/rooms`);
        const idx = parseInt(id, 10) - 1;
        const found = (data || [])[idx] || (data || [])[0] || null;
        setRoomData(found);
        return;
      }

      // otherwise try to fetch by id (assume it's a Mongo _id)
      const { data } = await api.get(`/operations/rooms/${id}`);
      setRoomData(data);
    } catch (err) {
      // fallback: try to create the room in backend when UI used numeric stub id
      console.warn("Failed to fetch room from backend:", err);
      const fallback = ROOMS.find((r) => r.id === parseInt(id)) || ROOMS[0];
      setRoomData(fallback);

      // attempt to create room in backend if numeric id (so we can obtain a Mongo _id)
      try {
        const isNumericId = /^\d+$/.test(id);
        if (isNumericId && fallback) {
          const createPayload = {
            name: fallback.name,
            roomType: "CONSULTATION",
            capacity: 1
          };
          const { data: created } = await api.post(`/operations/rooms`, createPayload);
          setRoomData(created);
        }
      } catch (createErr) {
        console.warn("Failed to create room in backend:", createErr);
      }
    }
  }

  function getWeekDates() {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }

  function handleDragStart(doctor, shift) {
    setDraggedDoctor(doctor);
    setDraggedShift(shift);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e, dayIndex) {
    e.preventDefault();
    if (!draggedDoctor || !draggedShift) return;

    const key = `${dayIndex}-${draggedShift.id}`;
    setAssignments({
      ...assignments,
      [key]: {
        id: Math.random(),
        doctorName: draggedDoctor.fullName,
        doctorId: draggedDoctor.id || draggedDoctor._id,
        shiftId: draggedShift.id,
        shiftLabel: draggedShift.label,
        hours: draggedShift.hours,
      },
    });

    setDraggedDoctor(null);
    setDraggedShift(null);
  }

  function removeAssignment(dayIndex, shiftId) {
    const key = `${dayIndex}-${shiftId}`;
    const newAssignments = { ...assignments };
    delete newAssignments[key];
    setAssignments(newAssignments);
  }

  async function handleSaveCalendar() {
    setSaving(true);
    setError("");

    try {
      // resolve backend room _id
      let roomIdToUse = roomData && roomData._id ? roomData._id : null;
      if (!roomIdToUse) {
        // attempt to resolve by fetching rooms list
        try {
          const { data: rooms } = await api.get(`/operations/rooms`);
          const idx = parseInt(id, 10) - 1;
          let found = null;
          if (!Number.isNaN(idx) && rooms && rooms.length > idx) found = rooms[idx];
          if (!found && rooms) {
            found = rooms.find((r) => r.name === room.name) || null;
          }
          if (found && found._id) roomIdToUse = found._id;
        } catch (err) {
          // ignore — we'll handle below
        }
      }

      if (!roomIdToUse) {
        setError("לא נמצא מזהה חדר חוקי בשרת (למשל _id של MongoDB). אנא וודא שהחדר רשום בבסיס הנתונים.");
        setSaving(false);
        return;
      }

      // log payload to aid debugging
      console.log("POST /operations/rooms/" + roomIdToUse + "/shifts/bulk", { assignments });

      const { data } = await api.post(`/operations/rooms/${roomIdToUse}/shifts/bulk`, {
        assignments
      });

      alert(`הוקצו ${data.createdCount} משמרות בהצלחה`);
      setAssignments({});
    } catch (err) {
      setError(err?.response?.data?.message || "שגיאה בשמירת הלוח");
    } finally {
      setSaving(false);
    }
  }

  const weekDates = getWeekDates();
  const hasAssignments = Object.keys(assignments).length > 0;

  return (
    <ProtectedLayout
      title={`פרטי חדר - ${room.name}`}
      subtitle={`סוג: ${room.type}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Weekly Calendar */}
        <div className="lg:col-span-3 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">לוח זמנים שבועי</h2>
            <div className="flex gap-2">
                            {hasAssignments && (
                              <button
                                onClick={handleSaveCalendar}
                                disabled={saving}
                                className="px-4 py-1 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                              >
                                {saving ? "שומר..." : `שמור (${Object.keys(assignments).length})`}
                              </button>
                            )}
              <button
                onClick={() => setStartDate(new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
                className="px-3 py-1 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
              >
                ← הקודם
              </button>
              <button
                onClick={() => setStartDate(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
                className="px-3 py-1 rounded-lg border border-slate-200 text-sm hover:bg-slate-50"
              >
                הבא →
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
                      {error && (
                        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                          {error}
                        </div>
                      )}
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50"></th>
                  {weekDates.map((date, idx) => (
                    <th key={idx} className="border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 bg-slate-50">
                      <div>{DAYS[date.getDay()]}</div>
                      <div className="text-slate-500">{date.toLocaleDateString("he-IL")}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHIFTS.map((shift) => (
                  <tr key={shift.id}>
                    <td className="border border-slate-200 px-3 py-3 bg-slate-50 font-medium text-xs text-slate-700 whitespace-nowrap">
                      <div>{shift.label}</div>
                      <div className="text-slate-500">{shift.hours}</div>
                    </td>
                    {weekDates.map((date, dayIdx) => {
                      const key = `${dayIdx}-${shift.id}`;
                      const assignment = assignments[key];
                      return (
                        <td
                          key={`${dayIdx}-${shift.id}`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, dayIdx)}
                          className="border border-slate-200 px-2 py-3 min-h-24 bg-white hover:bg-blue-50 transition cursor-drop"
                        >
                          {assignment ? (
                            <div className="relative rounded-lg bg-blue-100 border border-blue-300 p-2">
                              <button
                                onClick={() => removeAssignment(dayIdx, shift.id)}
                                className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                              >
                                <X size={12} />
                              </button>
                              <p className="text-xs font-semibold text-blue-900">{assignment.doctorName}</p>
                              <p className="text-xs text-blue-700 mt-1">{assignment.shiftLabel}</p>
                            </div>
                          ) : (
                            <div className="text-xs text-slate-400 text-center py-6">גרור רופא לכאן</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Selection Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white p-6 shadow-sm sticky top-20 text-right">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">רופאים</h2>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader size={20} className="animate-spin text-slate-400" />
              </div>
            ) : (
              <div className="space-y-2">
                {doctors.length === 0 ? (
                  <p className="text-sm text-slate-500">אין רופאים</p>
                ) : (
                  doctors.map((doctor) => (
                    <div key={doctor.id || doctor._id} className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700">{doctor.fullName}</p>
                      <div className="flex gap-1">
                        {SHIFTS.map((shift) => (
                          <button
                            key={shift.id}
                            draggable
                            onDragStart={() => handleDragStart(doctor, shift)}
                            className="flex-1 rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-2 py-1 text-xs font-medium text-white hover:from-blue-600 hover:to-blue-700 transition cursor-move shadow-sm"
                            title={`גרור ל${shift.label}`}
                          >
                            {shift.label.charAt(0)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Room Info Footer */}
      {/* <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm text-right">
        <h3 className="mb-3 text-base font-semibold text-slate-900">מידע החדר</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-500">שם</p>
            <p className="text-base font-medium text-slate-900">{room.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">סוג</p>
            <p className="text-base font-medium text-slate-900">{room.type}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-2">ציוד</p>
            <div className="flex flex-wrap gap-1">
              {room.equipment.map((item, idx) => (
                <span key={idx} className="inline-block rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div> */}
    </ProtectedLayout>
  );
}

