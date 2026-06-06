const navItems = [
  { key: "dashboard", label: "לוח בקרה" },
  { key: "finance", label: "פיננסי" },
  { key: "reports", label: "דוחות" },
  { key: "documents", label: "מסמכים" },
  { key: "rooms", label: "חדרים" },
  { key: "staff", label: "צוות" },
  { key: "ai", label: "AI" },
  { key: "users", label: "משתמשים" },
  { key: "security", label: "אבטחה" },
];

export default function NavBar({ currentPage, onNavigate }) {
  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-3 px-4 py-3 text-sm sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-slate-700">
          <span className="text-lg font-bold">SmartClinic</span>
          <span className="text-slate-500">מערכת ניהול מרפאה</span>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                currentPage === item.key
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

