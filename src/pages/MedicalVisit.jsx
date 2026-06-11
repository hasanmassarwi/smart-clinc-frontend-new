import React, { useEffect, useMemo, useState } from "react";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";
import { Loader } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function MedicalVisit() {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    async function loadVisits() {
      try {
        setLoading(true);
        setError("");
        const [appointmentsRes, invoicesRes] = await Promise.all([
          api.get("/appointments"),
          api.get("/finance/invoices")
        ]);
        setVisits(appointmentsRes.data || []);
        setInvoices(invoicesRes.data || []);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "לא ניתן לטעון את סיכומי הביקורים");
      } finally {
        setLoading(false);
      }
    }

    loadVisits();
  }, [user]);

  const totalAmount = useMemo(() => {
    return visits.reduce((sum, visit) => sum + Number(visit.amount || 0), 0);
  }, [visits]);

  const totalPaid = useMemo(() => {
    return invoices.reduce((sum, invoice) => sum + Number(invoice.paidAmount || 0), 0);
  }, [invoices]);

  const remainingBalance = Math.max(totalAmount - totalPaid, 0);

  return (
    <ProtectedLayout title="הביקורים שלי" subtitle="סיכומי ביקורים ותמחור">
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm text-right">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">מספר ביקורים</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{visits.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">סה"כ לתשלום</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">₪{totalAmount.toFixed(2)}</p>
            <p className="mt-1 text-sm text-amber-700">נותר לתשלום: ₪{remainingBalance.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">סטטוס אחרון</p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {visits[0]?.status || "לא קיים"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size={20} className="animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : visits.length === 0 ? (
          <div className="py-8 text-slate-500">עדיין אין ביקורים להצגה</div>
        ) : (
          <div className="space-y-3">
            {visits.map((visit) => (
              <div key={visit._id || visit.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{visit.treatment}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {visit.scheduledAt ? new Date(visit.scheduledAt).toLocaleString("he-IL") : "תאריך לא נקבע"}
                    </div>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {visit.status}
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  <div className="font-medium">סיכום הביקור</div>
                  <div className="mt-1 whitespace-pre-wrap">
                    {visit.visitSummary || "טרם נכתב סיכום ביקור"}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                  <span>סכום טיפול</span>
                  <span className="font-semibold">₪{Number(visit.amount || 0).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
