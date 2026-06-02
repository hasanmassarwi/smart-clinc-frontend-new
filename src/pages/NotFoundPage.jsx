import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-right">
      <div className="rounded-3xl bg-white p-10 shadow-xl max-w-xl">
        <h1 className="text-3xl font-semibold text-slate-900">404 - לא נמצא</h1>
        <p className="mt-4 text-slate-600">הדף שביקשת לא קיים או הוזן כתובת שגויה.</p>
        <Link to="/dashboard" className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          לחזרה ללוח הבקרה
        </Link>
      </div>
    </main>
  );
}
