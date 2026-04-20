// apps/web/src/components/DashboardAlerts.tsx
//
// Plug this into DashboardPage.tsx wherever you want the summary widget.
// Uses your existing Badge + Card UI components.

import { useHealthSummary, type HealthAlert } from "../hooks/useHealthSummary";

function AlertRow({ alert }: { alert: HealthAlert }) {
  const isOverdue = alert.status === "overdue";
  const daysLabel =
    isOverdue
      ? `${Math.abs(alert.daysUntilDue)}d overdue`
      : alert.status === "due_today"
      ? "Due today"
      : `Due in ${alert.daysUntilDue}d`;

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-sm font-medium text-gray-800 truncate">{alert.petName}</span>
        <span className="text-gray-400">·</span>
        <span className="text-sm text-gray-600 truncate">{alert.name}</span>
      </div>
      <span
        className={`text-xs font-medium shrink-0 ml-3 px-2 py-0.5 rounded-full ${
          isOverdue
            ? "bg-red-100 text-red-700"
            : alert.status === "due_today"
            ? "bg-amber-100 text-amber-700"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        {daysLabel}
      </span>
    </div>
  );
}

export function DashboardAlerts() {
  const { data: summary, isLoading } = useHealthSummary();

  if (isLoading) return null;
  if (!summary || summary.totalAlerts === 0) return null;

  const allAlerts = [...summary.overdue, ...summary.dueToday, ...summary.dueSoon];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Health Alerts</h3>
        {summary.overdue.length > 0 && (
          <span className="text-xs bg-red-100 text-red-700 font-medium px-2 py-0.5 rounded-full">
            {summary.overdue.length} overdue
          </span>
        )}
      </div>

      <div>
        {allAlerts.slice(0, 5).map((alert) => (
          <AlertRow key={`${alert.type}:${alert.petId}:${alert.name}`} alert={alert} />
        ))}
        {allAlerts.length > 5 && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            +{allAlerts.length - 5} more
          </p>
        )}
      </div>
    </div>
  );
}
