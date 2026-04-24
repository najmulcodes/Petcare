/**
 * Builds an inclusive-start, exclusive-end date range for a given month string.
 * @param month - Format: "YYYY-MM"
 * @returns { from: "YYYY-MM-01", to: "YYYY-MM-01" } (next month's first day)
 */
export function buildMonthRange(month: string): { from: string; to: string } {
  const [year, m] = month.split("-").map(Number);
  const from = `${month}-01`;
  const nextMonth = m === 12 ? 1 : m + 1;
  const nextYear = m === 12 ? year + 1 : year;
  const to = `${String(nextYear).padStart(4, "0")}-${String(nextMonth).padStart(2, "0")}-01`;
  return { from, to };
}
