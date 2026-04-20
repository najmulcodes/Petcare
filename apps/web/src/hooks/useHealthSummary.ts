// apps/web/src/hooks/useHealthSummary.ts
//
// Drop this into your existing hooks directory.
// Wire the result into a DashboardAlerts component on the dashboard page.

import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface HealthAlert {
  petId: string;
  petName: string;
  type: "vaccination" | "medication";
  name: string;
  dueDate: string;
  status: "overdue" | "due_today" | "due_soon";
  daysUntilDue: number;
}

export interface HealthSummary {
  overdue: HealthAlert[];
  dueToday: HealthAlert[];
  dueSoon: HealthAlert[];
  totalAlerts: number;
}

export function useHealthSummary() {
  return useQuery<HealthSummary>({
    queryKey: ["health-summary"],
    queryFn: async () => {
      const res = await api.get("/health-summary");
      return res.data.data;
    },
    // Re-fetch every 10 minutes — this data doesn't need to be real-time
    staleTime: 1000 * 60 * 10,
  });
}
