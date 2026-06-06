import { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import Icons from "../assets/icons";

const StatCard = ({ icon, value, label, trend, trendUp }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
    <div className="text-2xl mb-3">{icon}</div>
    <div className="text-2xl font-black text-slate-800 tracking-tight">{value}</div>
    <div className="text-sm text-slate-500 mt-1">{label}</div>
    <div className={`flex items-center gap-1 text-xs mt-2 font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
      {trendUp ? <Icons.TrendUp /> : <Icons.TrendDown />}
      {trend}
    </div>
  </div>
);

const BarChart = () => {
  const data = [
    { label: "מרץ", h: 45 }, { label: "אפר", h: 60 }, { label: "מאי", h: 55 },
    { label: "יוני", h: 70 }, { label: "יולי", h: 65 }, { label: "אוג", h: 80 },
    { label: "ספט", h: 72 }, { label: "אוק", h: 68 }, { label: "נוב", h: 75 },
    { label: "דצמ", h: 82 }, { label: "ינו", h: 78 }, { label: "פבר", h: 95, highlight: true },
  ];
  return (
    <div className="flex items-end gap-2 h-28 mt-2">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full rounded-t-md transition-all duration-300 cursor-pointer hover:opacity-80 ${d.highlight ? "bg-emerald-500" : "bg-blue-400"}`}
            style={{ height: `${d.h}%` }}
          />
          <span className="text-xs text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
};


const DashboardPanel = () => (
  <div className="space-y-5" dir="rtl">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon="💰" value="₪84,200" label="הכנסות החודש" trend="12% לעומת חודש קודם" trendUp />
      <StatCard icon="✅" value="142" label="תשלומים שהתקבלו" trend="8 תשלומים היום" trendUp />
      <StatCard icon="⚠️" value="7" label="חובות פתוחים" trend="₪12,400 סה״כ" trendUp={false} />
      <StatCard icon="📋" value="38" label="מסמכים ממתינים" trend="5 דחופים" trendUp={false} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2">
        <Card title="הכנסות לפי חודש" action={<span className="text-xs text-blue-600">12 חודשים אחרונים</span>}>
          <BarChart />
        </Card>
      </div>
      <Card title="🚨 התראות פעילות" action={<button className="text-xs text-blue-600">נקה הכל</button>}>
        <div className="space-y-3">
          {[
            { icon: "⚠️", color: "bg-red-50 border-red-200", text: "חשבונית #4821 — תשלום באיחור", time: "לפני 2 שעות" },
            { icon: "📄", color: "bg-amber-50 border-amber-200", text: "מסמך חסר: כהן יעל", time: "לפני 4 שעות" },
            { icon: "🔄", color: "bg-blue-50 border-blue-200", text: "גיבוי נתונים הושלם", time: "לפני 6 שעות" },
          ].map((a, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${a.color}`}>
              <span className="text-lg">{a.icon}</span>
              <div>
                <div className="text-sm font-medium text-slate-700">{a.text}</div>
                <div className="text-xs text-slate-400 mt-0.5">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
    <Card title="תשלומים אחרונים" action={<button className="text-xs text-blue-600">הצג הכל</button>}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {["#", "מטופל", "סוג טיפול", "רופא", "סכום", "תאריך", "סטטוס"].map(h => (
                <th key={h} className="text-right py-2 px-3 text-xs text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { id: "#4831", name: "אברהם לוי", type: "בדיקה שגרתית", doctor: "ד״ר מזרחי", amount: "₪350", date: "25/02/26", status: "paid", statusLabel: "שולם" },
              { id: "#4830", name: "שרה גולן", type: "טיפול שיניים", doctor: "ד״ר כהן", amount: "₪1,200", date: "25/02/26", status: "paid", statusLabel: "שולם" },
              { id: "#4829", name: "דוד ישראלי", type: "ייעוץ קרדיולוגי", doctor: "ד״ר לוין", amount: "₪800", date: "24/02/26", status: "pending", statusLabel: "ממתין" },
              { id: "#4828", name: "מרים שטרן", type: "אולטרסאונד", doctor: "ד״ר אביב", amount: "₪650", date: "24/02/26", status: "late", statusLabel: "איחור" },
              { id: "#4827", name: "יוסף ברק", type: "בדיקת דם", doctor: "ד״ר מזרחי", amount: "₪180", date: "23/02/26", status: "paid", statusLabel: "שולם" },
            ].map((row) => (
              <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3 text-slate-400">{row.id}</td>
                <td className="py-3 px-3 font-medium text-slate-700">{row.name}</td>
                <td className="py-3 px-3 text-slate-600">{row.type}</td>
                <td className="py-3 px-3 text-slate-600">{row.doctor}</td>
                <td className="py-3 px-3 font-semibold text-slate-800">{row.amount}</td>
                <td className="py-3 px-3 text-slate-500">{row.date}</td>
                <td className="py-3 px-3"><StatusBadge status={row.status} label={row.statusLabel} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);


const FinancePage = () => (
  <div className="space-y-5" dir="rtl">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon="💵" value="₪84,200" label="סה״כ הכנסות" trend="12%" trendUp />
      <StatCard icon="🔴" value="₪12,400" label="חובות פתוחים" trend="7 מטופלים" trendUp={false} />
      <StatCard icon="🟡" value="₪8,750" label="ממתין לאישור" trend="15 חשבוניות" trendUp={false} />
      <StatCard icon="📊" value="94%" label="אחוז גבייה" trend="2%" trendUp />
    </div>
    <Card title="ניהול חשבוניות ותשלומים" action={
      <div className="flex gap-2">
        <button className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">ייצוא Excel</button>
        <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 rounded-lg text-white hover:bg-blue-700 flex items-center gap-1"><Icons.Plus /> חשבונית חדשה</button>
      </div>
    }>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {["#", "מטופל", "טיפול", "רופא", "סכום", "תאריך", "תשלום", "סטטוס", "פעולות"].map(h => (
                <th key={h} className="text-right py-2 px-3 text-xs text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { id: "#4831", name: "2אברהם לוי", type: "בדיקה שגרתית", doc: "ד״ר מזרחי", amount: "₪350", date: "25/02/26", method: "כרטיס", status: "paid", label: "שולם", action: "view" },
              { id: "#4830", name: "שרה גולן", type: "טיפול שיניים", doc: "ד״ר כהן", amount: "₪1,200", date: "25/02/26", method: "העברה", status: "paid", label: "שולם", action: "view" },
              { id: "#4829", name: "דוד ישראלי", type: "ייעוץ קרדיולוגי", doc: "ד״ר לוין", amount: "₪800", date: "24/02/26", method: "-", status: "pending", label: "ממתין", action: "approve" },
              { id: "#4828", name: "מרים שטרן", type: "אולטרסאונד", doc: "ד״ר אביב", amount: "₪650", date: "24/02/26", method: "מזומן", status: "late", label: "איחור", action: "collect" },
              { id: "#4826", name: "רינה כהן", type: "ייעוץ גינקולוגי", doc: "ד״ר שמיר", amount: "₪700", date: "23/02/26", method: "-", status: "pending", label: "ממתין", action: "approve" },
            ].map((row) => (
              <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 px-3 text-slate-400">{row.id}</td>
                <td className="py-3 px-3 font-medium text-slate-700">{row.name}</td>
                <td className="py-3 px-3 text-slate-600">{row.type}</td>
                <td className="py-3 px-3 text-slate-600">{row.doc}</td>
                <td className="py-3 px-3 font-semibold">{row.amount}</td>
                <td className="py-3 px-3 text-slate-500">{row.date}</td>
                <td className="py-3 px-3 text-slate-500">{row.method}</td>
                <td className="py-3 px-3"><StatusBadge status={row.status} label={row.label} /></td>
                <td className="py-3 px-3">
                  {row.action === "approve" && <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded-lg">אשר</button>}
                  {row.action === "collect" && <button className="px-2 py-1 text-xs border border-red-300 text-red-600 rounded-lg">גבה</button>}
                  {row.action === "view" && <button className="px-2 py-1 text-xs border border-slate-200 text-slate-600 rounded-lg">הצג</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const ReportsPage = () => (
  <div className="space-y-5" dir="rtl">
    <Card title="ניתוח הכנסות לפי סוג טיפול" action={
      <div className="flex gap-2">
        <button className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600">הפק PDF</button>
        <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 rounded-lg text-white">דוח מותאם</button>
      </div>
    }>
      <div className="space-y-3">
        {[
          { label: "בדיקות שגרתיות", val: "₪28,400", pct: 34, color: "bg-blue-500" },
          { label: "טיפולי שיניים", val: "₪22,100", pct: 26, color: "bg-violet-500" },
          { label: "ייעוץ מומחים", val: "₪18,300", pct: 22, color: "bg-emerald-500" },
          { label: "בדיקות מעבדה", val: "₪9,800", pct: 12, color: "bg-amber-500" },
          { label: "אחר", val: "₪5,600", pct: 6, color: "bg-slate-400" },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-semibold text-slate-800">{item.val} ({item.pct}%)</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card title="הכנסות לפי רופא">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-100">{["רופא","מטופלים","הכנסות"].map(h=><th key={h} className="text-right py-2 text-xs text-slate-500 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {[{doc:"ד״ר מזרחי",p:48,i:"₪24,100"},{doc:"ד״ר כהן",p:36,i:"₪19,800"},{doc:"ד״ר לוין",p:29,i:"₪17,200"},{doc:"ד״ר אביב",p:22,i:"₪13,600"},{doc:"ד״ר שמיר",p:18,i:"₪9,500"}].map(r=>(
              <tr key={r.doc} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-2.5 font-medium text-slate-700">{r.doc}</td>
                <td className="py-2.5 text-slate-500">{r.p}</td>
                <td className="py-2.5 font-semibold">{r.i}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card title="תחזית AI">
        <p className="text-xs text-slate-400 mb-3">בהתבסס על נתוני 12 חודשים אחרונים</p>
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-sm font-medium text-emerald-700">📈 מרץ 2026: ₪91,500</div>
            <div className="text-xs text-emerald-600 mt-0.5">צפי גידול של 8.7%</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
            <div className="text-sm font-medium text-blue-700">📊 רבעון 2: ₪280,000</div>
            <div className="text-xs text-blue-600 mt-0.5">רמת ביטחון: 82%</div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);


const DocumentsPage = () => (
  <div className="space-y-5" dir="rtl">
    <div className="flex gap-2 flex-wrap">
      {["+ מסמך חדש","📤 סריקה","📋 מרשם","🏥 הפניה","📄 אישור מחלה"].map((btn,i)=>(
        <button key={btn} className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${i===0?"bg-blue-600 text-white hover:bg-blue-700":"border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{btn}</button>
      ))}
    </div>
    <Card title="ניהול מסמכים">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-100">{["מסמך","מטופל","סוג","תאריך","יוצר","סטטוס","פעולות"].map(h=><th key={h} className="text-right py-2 px-3 text-xs text-slate-500 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {[
              {name:"📋 מרשם #1204",patient:"אברהם לוי",type:"מרשם",date:"25/02/26",creator:"ד״ר מזרחי",status:"active",label:"פעיל"},
              {name:"🏥 הפניה #892",patient:"שרה גולן",type:"הפניה",date:"25/02/26",creator:"ד״ר כהן",status:"success",label:"שוגר"},
              {name:"📄 אישור מחלה",patient:"דוד ישראלי",type:"אישור",date:"24/02/26",creator:"ד״ר לוין",status:"pending",label:"ממתין"},
              {name:"📊 תוצאות מעבדה",patient:"מרים שטרן",type:"ממצאים",date:"24/02/26",creator:"מעבדה",status:"active",label:"פעיל"},
              {name:"🔬 ממצאי CT",patient:"יוסף ברק",type:"הדמיה",date:"23/02/26",creator:"מחלקת הדמיה",status:"active",label:"פעיל"},
            ].map(row=>(
              <tr key={row.name} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 px-3 font-medium text-slate-700">{row.name}</td>
                <td className="py-3 px-3 text-slate-600">{row.patient}</td>
                <td className="py-3 px-3 text-slate-500">{row.type}</td>
                <td className="py-3 px-3 text-slate-500">{row.date}</td>
                <td className="py-3 px-3 text-slate-500">{row.creator}</td>
                <td className="py-3 px-3"><StatusBadge status={row.status} label={row.label}/></td>
                <td className="py-3 px-3">
                  {row.status==="pending"?<button className="px-2 py-1 text-xs bg-blue-600 text-white rounded-lg">אשר</button>:<button className="px-2 py-1 text-xs border border-slate-200 text-slate-600 rounded-lg">הצג</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const RoomsPage = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" dir="rtl">
    <Card title="מצב חדרים">
      <div className="grid grid-cols-3 gap-3">
        {[{num:"101",who:"ד״ר מזרחי",occ:true},{num:"102",who:"ד״ר כהן",occ:true},{num:"103",who:"פנוי",occ:false},{num:"104",who:"ד״ר לוין",occ:true},{num:"105",who:"פנוי",occ:false},{num:"106",who:"ד״ר אביב",occ:true}].map(room=>(
          <div key={room.num} className={`p-4 rounded-xl border text-center cursor-pointer transition-all hover:scale-105 ${room.occ?"bg-emerald-50 border-emerald-200":"bg-slate-50 border-slate-200 hover:border-blue-200"}`}>
            <div className="text-2xl font-black text-slate-700">{room.num}</div>
            <div className={`text-xs mt-1 font-medium ${room.occ?"text-emerald-600":"text-slate-400"}`}>{room.who}</div>
          </div>
        ))}
      </div>
    </Card>
    <Card title="ניהול ציוד" action={<button className="text-xs text-blue-600">+ הוסף</button>}>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-slate-100">{["ציוד","כמות","סטטוס"].map(h=><th key={h} className="text-right py-2 text-xs text-slate-500 font-medium">{h}</th>)}</tr></thead>
        <tbody>
          {[{name:"ECG מכשיר",qty:3,status:"success",label:"תקין"},{name:"אולטרסאונד",qty:2,status:"success",label:"תקין"},{name:"כסא רופא שיניים",qty:4,status:"success",label:"תקין"},{name:"מד לחץ דם",qty:8,status:"warning",label:"תחזוקה"},{name:"מדחום דיגיטלי",qty:15,status:"success",label:"תקין"}].map(item=>(
            <tr key={item.name} className="border-b border-slate-50 hover:bg-slate-50">
              <td className="py-2.5 font-medium text-slate-700">{item.name}</td>
              <td className="py-2.5 text-slate-500">{item.qty}</td>
              <td className="py-2.5"><StatusBadge status={item.status} label={item.label}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

const StaffPage = () => (
  <div dir="rtl">
    <Card title="משמרות היום — 25/02/26" action={<button className="px-3 py-1.5 text-xs font-medium bg-blue-600 rounded-lg text-white flex items-center gap-1"><Icons.Plus /> הוסף משמרת</button>}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-100">{["עובד","תפקיד","משמרת","שעות","מטופלים","סטטוס"].map(h=><th key={h} className="text-right py-2 px-3 text-xs text-slate-500 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {[
              {name:"ד״ר מזרחי",role:"רופא כללי",shift:"בוקר",hours:"08:00–16:00",patients:12,status:"active",label:"בפעילות"},
              {name:"ד״ר כהן",role:"רופאת שיניים",shift:"בוקר",hours:"08:00–14:00",patients:8,status:"success",label:"הסתיים"},
              {name:"מירה לוי",role:"מזכירה",shift:"בוקר",hours:"07:30–15:30",patients:0,status:"active",label:"בפעילות"},
              {name:"ד״ר לוין",role:"קרדיולוג",shift:"צהריים",hours:"12:00–20:00",patients:6,status:"active",label:"בפעילות"},
              {name:"ניר שפירא",role:"אח",shift:"לילה",hours:"20:00–08:00",patients:0,status:"pending",label:"לא התחיל"},
            ].map(r=>(
              <tr key={r.name} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 px-3 font-medium text-slate-700">{r.name}</td>
                <td className="py-3 px-3 text-slate-500">{r.role}</td>
                <td className="py-3 px-3 text-slate-500">{r.shift}</td>
                <td className="py-3 px-3 text-slate-500">{r.hours}</td>
                <td className="py-3 px-3 text-slate-500">{r.patients||"—"}</td>
                <td className="py-3 px-3"><StatusBadge status={r.status} label={r.label}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);


const botAnswers = {
  "כמה תשלומים ממתינים לאישור?": "📊 ישנם 7 תשלומים ממתינים לאישור, בסכום כולל של ₪8,750. 2 דחופים מעל 48 שעות.",
  "מה ההכנסות החודש?": "💰 ההכנסות לפברואר 2026: ₪84,200 — עלייה של 12% לעומת ינואר.",
  "אילו מסמכים חסרים?": "📄 נמצאו 5 מסמכים חסרים: טופס הסכמה ל-2 מטופלים, תוצאות מעבדה ל-1, אישורי ביטוח ל-2.",
  "איזה רופא הכי עמוס היום?": "👨‍⚕️ ד״ר מזרחי — 12 מטופלים ב-8 שעות. ממוצע: 1.5 מטופל לשעה.",
  "הפק דוח הכנסות לפברואר": "📊 הדוח נוצר בהצלחה! סה״כ: ₪84,200 | מטופלים: 153 | ממוצע לביקור: ₪550.",
};

const AIPage = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "שלום! אני MediBot. שאל אותי על תשלומים, הכנסות, מסמכים ועוד." }
  ]);
  const [input, setInput] = useState("");

  const send = (q) => {
    const question = q || input.trim();
    if (!question) return;
    const answer = botAnswers[question] || "🤔 לא מצאתי תשובה מוכנה. נסה אחת מהשאלות המהירות.";
    setMessages(m => [...m, { from: "user", text: question }, { from: "bot", text: answer }]);
    setInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" dir="rtl">
      <div className="lg:col-span-2">
        <Card title="עוזר AI מנהלי" action={<span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full font-semibold">AI</span>}>
          <div className="bg-slate-50 rounded-xl p-4 h-64 overflow-y-auto flex flex-col gap-3 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.from==="bot"?"bg-white border border-slate-200 self-start":"bg-blue-600 text-white self-end"}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="שאל אותי משהו..." className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 bg-white" dir="rtl"/>
            <button onClick={()=>send()} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-1.5 text-sm font-medium"><Icons.Send /> שלח</button>
          </div>
        </Card>
      </div>
      <Card title="שאלות מהירות">
        <div className="flex flex-col gap-2">
          {Object.keys(botAnswers).map(q=>(
            <button key={q} onClick={()=>send(q)} className="text-right px-4 py-3 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all">{q}</button>
          ))}
        </div>
      </Card>
    </div>
  );
};

const UsersPage = () => (
  <div dir="rtl">
    <Card title="ניהול משתמשים והרשאות" action={<button className="px-3 py-1.5 text-xs font-medium bg-blue-600 rounded-lg text-white flex items-center gap-1"><Icons.Plus /> משתמש חדש</button>}>
      <div className="flex gap-2 mb-4">
        {["כולם","רופאים","מזכירות","מנהלים"].map((tab,i)=>(
          <button key={tab} className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${i===0?"bg-blue-600 text-white":"border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{tab}</button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-100">{["משתמש","אימייל","תפקיד","הרשאות","כניסה אחרונה","סטטוס","פעולות"].map(h=><th key={h} className="text-right py-2 px-3 text-xs text-slate-500 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {[
              {name:"ד״ר מזרחי",email:"mazrahi@clinic.co.il",role:"רופא",perms:"קריאה + כתיבה",last:"היום 08:12",status:"active",label:"פעיל"},
              {name:"מירה לוי",email:"mira@clinic.co.il",role:"מזכירה",perms:"קריאה בלבד",last:"היום 07:30",status:"active",label:"פעיל"},
              {name:"מנהל מערכת",email:"admin@clinic.co.il",role:"Admin",perms:"גישה מלאה",last:"עכשיו",status:"active",label:"פעיל"},
            ].map(u=>(
              <tr key={u.email} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 px-3 font-medium text-slate-700">{u.name}</td>
                <td className="py-3 px-3 text-slate-500 text-xs">{u.email}</td>
                <td className="py-3 px-3 text-slate-600">{u.role}</td>
                <td className="py-3 px-3 text-slate-500 text-xs">{u.perms}</td>
                <td className="py-3 px-3 text-slate-500 text-xs">{u.last}</td>
                <td className="py-3 px-3"><StatusBadge status={u.status} label={u.label}/></td>
                <td className="py-3 px-3"><button className="px-2 py-1 text-xs border border-slate-200 text-slate-600 rounded-lg">ערוך</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const SecurityPage = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" dir="rtl">
    <Card title="סטטוס אבטחה">
      <div className="space-y-3">
        {[
          {icon:"🔒",text:"הצפנה מלאה פעילה (AES-256)",sub:"כל הנתונים מוצפנים",color:"bg-emerald-50 border-emerald-200"},
          {icon:"💾",text:"גיבוי אחרון: לפני 6 שעות",sub:"הגיבוי הבא בעוד 18 שעות",color:"bg-emerald-50 border-emerald-200"},
          {icon:"✅",text:"עמידה בתקן HIPAA + ISO 27001",sub:"עדכון תקן: 01/2026",color:"bg-emerald-50 border-emerald-200"},
          {icon:"🔐",text:"אימות דו-שלבי: 8/10 משתמשים",sub:"2 משתמשים ללא 2FA",color:"bg-blue-50 border-blue-200"},
        ].map((item,i)=>(
          <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${item.color}`}>
            <span className="text-xl">{item.icon}</span>
            <div>
              <div className="text-sm font-medium text-slate-700">{item.text}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
    <Card title="לוג גישה אחרון">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-slate-100">{["משתמש","פעולה","שעה"].map(h=><th key={h} className="text-right py-2 text-xs text-slate-500 font-medium">{h}</th>)}</tr></thead>
        <tbody>
          {[{user:"Admin",action:"כניסה למערכת",time:"עכשיו"},{user:"ד״ר מזרחי",action:"צפיה בתיק מטופל",time:"08:45"},{user:"מירה לוי",action:"עדכון פרטי מטופל",time:"08:20"},{user:"ד״ר כהן",action:"הפקת חשבונית",time:"07:55"},{user:"System",action:"גיבוי אוטומטי",time:"02:00"}].map((r,i)=>(
            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
              <td className="py-2.5 font-medium text-slate-700">{r.user}</td>
              <td className="py-2.5 text-slate-500">{r.action}</td>
              <td className="py-2.5 text-slate-400 text-xs">{r.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);


const DashboardPage = () => {
  const [page, setPage] = useState("dashboard");

  const pageTitles = {
    dashboard: { title: "לוח בקרה", sub: "סקירה כללית — יום רביעי, 25 פברואר 2026" },
    finance: { title: "ניהול פיננסי", sub: "תשלומים, חובות וחשבוניות" },
    reports: { title: "דוחות כספיים", sub: "ניתוח הכנסות ותחזיות AI" },
    documents: { title: "ניהול מסמכים", sub: "מרשמים, הפניות ואישורים" },
    rooms: { title: "חדרים וציוד", sub: "ניהול תפעולי" },
    staff: { title: "צוות ומשמרות", sub: "תיאום עובדים ומשימות" },
    ai: { title: "עוזר AI מנהלי", sub: "בינה מלאכותית לניהול חכם" },
    users: { title: "משתמשים והרשאות", sub: "ניהול גישה ואבטחה" },
    security: { title: "אבטחת מידע", sub: "הצפנה, גיבויים ותאימות" },
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPanel />;
      case "finance": return <FinancePage />;
      case "reports": return <ReportsPage />;
      case "documents": return <DocumentsPage />;
      case "rooms": return <RoomsPage />;
      case "staff": return <StaffPage />;
      case "ai": return <AIPage />;
      case "users": return <UsersPage />;
      case "security": return <SecurityPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" dir="rtl">
      <NavBar currentPage={page} onNavigate={setPage} />
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">{pageTitles[page].title}</h1>
          <p className="text-sm text-slate-500 mt-1">{pageTitles[page].sub}</p>
        </div>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
