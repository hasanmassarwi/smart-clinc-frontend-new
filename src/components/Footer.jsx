export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        SmartClinic © {new Date().getFullYear()} • מערכת ניהול מרפאה
      </div>
    </footer>
  );
}
