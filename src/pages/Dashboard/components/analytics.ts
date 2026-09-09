// Lead-side aggregation helpers for the dashboard.
//
// The backend exposes inquiries as plain lists (contact messages + quotation
// requests), so the trend / breakdown charts are derived here from each row's
// `createdAt` and `service` fields.

type Dated = { createdAt?: string };

// Local (not UTC) day key so grouping matches the viewer's calendar day.
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const lastNDays = (n: number): Date[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(d);
  }
  return out;
};

export interface EnquiryPoint {
  label: string;
  leads: number;
  quotations: number;
}

const countByDay = (items: Dated[]): Map<string, number> => {
  const m = new Map<string, number>();
  items.forEach((it) => {
    if (!it?.createdAt) return;
    const d = new Date(it.createdAt);
    if (isNaN(d.getTime())) return;
    const k = dayKey(d);
    m.set(k, (m.get(k) || 0) + 1);
  });
  return m;
};

/** Merged daily counts of contact messages (leads) and quotations (leads). */
export const buildEnquirySeries = (
  contacts: Dated[] = [],
  quotations: Dated[] = [],
  n = 14
): EnquiryPoint[] => {
  const cMap = countByDay(contacts);
  const qMap = countByDay(quotations);
  return lastNDays(n).map((d) => {
    const k = dayKey(d);
    return {
      label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      leads: cMap.get(k) || 0,
      quotations: qMap.get(k) || 0,
    };
  });
};

/** Flat array of daily counts — used for the KPI card sparklines. */
export const dailyCounts = (items: Dated[] = [], n = 14): number[] => {
  const m = countByDay(items);
  return lastNDays(n).map((d) => m.get(dayKey(d)) || 0);
};

/** Quotation requests grouped by service (top 7), for the leads donut. */
export const buildServiceBreakdown = (
  quotations: { service?: string }[] = []
): { name: string; value: number }[] => {
  const m = new Map<string, number>();
  quotations.forEach((q) => {
    const s = (q?.service || "").trim() || "General";
    m.set(s, (m.get(s) || 0) + 1);
  });
  return Array.from(m.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);
};
