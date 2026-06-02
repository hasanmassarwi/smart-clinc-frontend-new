import { useState, useEffect } from "react";
import { X, UserPlus, Loader } from "lucide-react";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "patient"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data } = await api.get("/users");
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    
    if (!form.fullName || !form.email || !form.password || !form.userType) {
      setError("כל השדות חובה");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/users", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        userType: form.userType
      });
      
      setForm({ fullName: "", email: "", password: "", userType: "patient" });
      setShowModal(false);
      await fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "שגיאה ביצירת משתמש");
    } finally {
      setSubmitting(false);
    }
  }

  const userTypeLabels = {
    doctor: "רופא",
    secretary: "מזכירה",
    patient: "מטופל"
  };

  const userTypeColors = {
    doctor: "bg-blue-100 text-blue-800",
    secretary: "bg-purple-100 text-purple-800",
    patient: "bg-green-100 text-green-800"
  };

  return (
    <ProtectedLayout title="משתמשים" subtitle="ניהול חשבונות וגישה למערכת">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
        >
          <UserPlus size={20} />
          הוסף משתמש
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={24} className="animate-spin text-slate-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-500">אין משתמשים במערכת</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-700">שם מלא</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-700">אימייל</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-700">סוג משתמש</th>
                  <th className="px-6 py-3 text-sm font-semibold text-slate-700">תאריך הוספה</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id || index} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm text-slate-900">{user.fullName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${userTypeColors[user.userType] || "bg-slate-100 text-slate-800"}`}>
                        {userTypeLabels[user.userType] || user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(user.createdAt).toLocaleDateString("he-IL")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">הוסף משתמש חדש</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">שם מלא</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="ד״ר יוחנן כהן"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">אימייל</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="doctor@clinic.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">סיסמה</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">סוג משתמש</label>
                <select
                  value={form.userType}
                  onChange={(e) => setForm({ ...form, userType: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  required
                >
                  <option value="doctor">רופא</option>
                  <option value="secretary">מזכירה</option>
                  <option value="patient">מטופל</option>
                </select>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "יוצר..." : "צור משתמש"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  בטל
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
