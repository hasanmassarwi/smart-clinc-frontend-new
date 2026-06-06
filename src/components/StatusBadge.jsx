const statusClasses = {
  active: "bg-emerald-100 text-emerald-700",
  success: "bg-sky-100 text-sky-700",
  pending: "bg-amber-100 text-amber-700",
  warning: "bg-orange-100 text-orange-700",
  danger: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status, label }) {
  const classes = statusClasses[status] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}

