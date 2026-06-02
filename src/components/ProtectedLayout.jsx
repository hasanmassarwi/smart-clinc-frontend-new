import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Bot,
  Building2,
  FileBarChart2,
  FileText,
  LayoutDashboard,
  UserCog,
  Wallet,
  Bell
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

function navLinkActive(href, pathname) {
  if (href === "/dashboard") {
    if (pathname === "/dashboard") return true;
    if (pathname.startsWith("/dashboard/") && !pathname.startsWith("/dashboard/alerts")) return true;
    return false;
  }
  if (href === "/team") {
    return pathname === "/team" || pathname === "/staff" || pathname.startsWith("/team/") || pathname.startsWith("/staff/");
  }
  if (pathname === href) return true;
  if (pathname.startsWith(`${href}/`)) return true;
  return false;
}

const navLinks = [
  { href: "/dashboard", label: "לוח בקרה", icon: LayoutDashboard },
  // { href: "/dashboard/alerts", label: "התראות", icon: Bell },
  { href: "/finance", label: "פיננסי", icon: Wallet },
  { href: "/reports", label: "דוחות", icon: FileBarChart2 },
  { href: "/documents", label: "מסמכים", icon: FileText },
  { href: "/operations", label: "חדרים", icon: Building2 },
  { href: "/team", label: "צוות", icon: Users },
  // { href: "/ai-assistant", label: "עוזר AI", icon: Bot },
  { href: "/users", label: "משתמשים", icon: UserCog }
  // { href: "/security", label: "אבטחה", icon: Shield }
];

export default function ProtectedLayout({ title, subtitle, children }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router("/login", { replace: true });
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">טוען...</div>;
  }

  const initial = (user?.fullName || user?.email || "?").slice(0, 1).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-[#eef2fb]">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-8">
            <Link to="/dashboard" className="flex shrink-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-500/25">
                <span className="text-lg font-bold text-white">✚</span>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-lg font-extrabold tracking-tight text-slate-900">SmartClinic</p>
                <p className="text-xs text-slate-500">מערכת ניהול מרפאה</p>
              </div>
            </Link>

            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto lg:flex">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = navLinkActive(link.href, pathname);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative flex shrink-0 flex-col items-center gap-0.5 rounded-xl px-2.5 py-2 text-xs font-medium transition md:px-3 md:text-sm ${
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon size={18} strokeWidth={active ? 2.25 : 2} className={active ? "text-white" : ""} />
                    <span className="whitespace-nowrap">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-3 md:gap-4">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-xl p-2 text-slate-400 opacity-75"
              aria-label="התראות — בקרוב"
              title="התראות — בקרוב"
            >
              {/* <Bell size={22} /> */}
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pl-2 pr-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">מנהל מערכת</p>
                <p className="max-w-[120px] truncate text-xs text-slate-500">{user?.fullName || user?.email}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white shadow-inner">
                {initial}
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                await logout();
                router("/login");
              }}
              className="hidden rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50 sm:inline"
            >
              התנתקות
            </button>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = navLinkActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs ${
                  active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                <Icon size={14} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 text-right">
          <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-1.5 text-sm text-slate-600 md:text-base">{subtitle}</p> : null}
        </div>
        {children}
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-500">
        © 2025 SmartClinic — כל הזכויות שמורות
      </footer>
    </div>
  );
}
