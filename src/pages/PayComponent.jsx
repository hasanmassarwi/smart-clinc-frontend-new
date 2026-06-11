import { useEffect, useMemo, useState } from "react";
import ProtectedLayout from "../components/ProtectedLayout";
import api from "../lib/api";
import { Loader, Wallet, UserRound, ReceiptText } from "lucide-react";

export default function PayComponent() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingPatientId, setSavingPatientId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentInputs, setPaymentInputs] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [patientsRes, appointmentsRes, invoicesRes] = await Promise.all([
        api.get("/users/patients"),
        api.get("/appointments"),
        api.get("/finance/invoices")
      ]);

      setPatients(patientsRes.data || []);
      setAppointments(appointmentsRes.data || []);
      setInvoices(invoicesRes.data || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "לא ניתן לטעון את נתוני התשלום");
    } finally {
      setLoading(false);
    }
  }

  const patientBilling = useMemo(() => {
    const byPatient = new Map();

    for (const appointment of appointments) {
      const patientId = appointment.patient?._id || appointment.patient;
      if (!patientId) continue;

      const entry = byPatient.get(patientId) || {
        patient: appointment.patient,
        appointments: [],
        totalAmount: 0
      };

      entry.appointments.push(appointment);
      entry.totalAmount += Number(appointment.amount || 0);
      byPatient.set(patientId, entry);
    }

    return Array.from(byPatient.values()).map((entry) => {
      const invoice = invoices.find((item) => String(item.patient?._id || item.patient) === String(entry.patient?._id || entry.patient));
      const paidAmount = Number(invoice?.paidAmount || 0);
      const balance = Math.max(Number(entry.totalAmount || 0) - paidAmount, 0);

      return {
        ...entry,
        invoice,
        paidAmount,
        balance
      };
    });
  }, [appointments, invoices]);

  async function handleSavePayment(patientId, totalAmount) {
    const amount = Number(paymentInputs[patientId] || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("יש להזין סכום תשלום תקין");
      return;
    }

    if (amount > totalAmount) {
      setError("הסכום ששולם אינו יכול להיות גבוה מהסכום הכולל");
      return;
    }

    try {
      setSavingPatientId(patientId);
      setError("");
      setSuccess("");

      const patient = patients.find((item) => String(item._id || item.id) === String(patientId));
      const existingInvoice = invoices.find((item) => String(item.patient?._id || item.patient) === String(patientId));
      const appointmentsForPatient = appointments.filter((item) => String(item.patient?._id || item.patient) === String(patientId));

      let invoiceId = existingInvoice?._id || existingInvoice?.id;

      if (!invoiceId) {
        const invoicePayload = {
          invoiceNumber: `INV-${String(patientId).slice(-6).toUpperCase()}-${Date.now()}`,
          patient: patientId,
          items: appointmentsForPatient.map((appointment) => ({
            treatmentType: appointment.treatment,
            description: appointment.visitSummary || appointment.treatment,
            doctor: appointment.doctor?._id || appointment.doctor,
            quantity: 1,
            unitPrice: Number(appointment.amount || 0),
            total: Number(appointment.amount || 0)
          })),
          subtotal: Number(totalAmount || 0),
          discount: 0,
          tax: 0,
          totalAmount: Number(totalAmount || 0),
          status: "ISSUED",
          dueDate: new Date().toISOString()
        };

        const { data: createdInvoice } = await api.post("/finance/invoices", invoicePayload);
        invoiceId = createdInvoice?._id || createdInvoice?.id;
      }

      await api.post(`/finance/invoices/${invoiceId}/payments`, {
        invoiceId,
        amount,
        method: "CASH",
        note: `תשלום ידני מהמסך PayComponent`
      });

      setSuccess("הסכום עודכן בהצלחה במערכת");
      setPaymentInputs((current) => ({ ...current, [patientId]: "" }));
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "לא ניתן לעדכן את התשלום");
    } finally {
      setSavingPatientId("");
    }
  }

  return (
    <ProtectedLayout title="תשלומים" subtitle="ניהול חיובים ותשלומים למטופלים">
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm text-right">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size={20} className="animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : null}

        {success ? <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div> : null}

        {patientBilling.length === 0 ? (
          <div className="py-8 text-slate-500">אין מטופלים עם חיובים להצגה</div>
        ) : (
          <div className="space-y-3">
            {patientBilling.map((entry) => {
              const patientId = entry.patient?._id || entry.patient?.id || "";
              const patientName = entry.patient?.fullName || entry.patient?.email || "מטופל ללא שם";
              const totalAmount = Number(entry.totalAmount || 0);
              const paidAmount = Number(entry.paidAmount || 0);
              const balance = Math.max(totalAmount - paidAmount, 0);

              return (
                <div key={patientId} className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-900">
                        <UserRound size={18} className="text-blue-600" />
                        <span className="text-base font-semibold">{patientName}</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {entry.appointments.length} ביקורים רשומים
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <ReceiptText size={16} />
                        <span>סכום כולל</span>
                      </div>
                      <div className="mt-1 text-xl font-semibold text-slate-900">₪{totalAmount.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-3 text-sm text-slate-700">
                      <div className="text-slate-500">שולם</div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">₪{paidAmount.toFixed(2)}</div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                      <div>נותר לתשלום</div>
                      <div className="mt-1 text-lg font-semibold">₪{balance.toFixed(2)}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-sm text-slate-500">הזן סכום ששולם</div>
                      <div className="mt-2 flex gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={paymentInputs[patientId] ?? ""}
                          onChange={(event) =>
                            setPaymentInputs((current) => ({ ...current, [patientId]: event.target.value }))
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                          placeholder="לדוגמה 500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSavePayment(patientId, totalAmount)}
                          disabled={savingPatientId === patientId}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {savingPatientId === patientId ? "שומר..." : "שמור"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
