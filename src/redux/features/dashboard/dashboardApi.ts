import { baseApi } from "../../api/baseApi";

export type DashboardStatKey =
  | "blogs"
  | "projects"
  | "caseStudies"
  | "categories";

export interface DashboardStat {
  key: DashboardStatKey;
  title: string;
  value: number | string;
  change: string;
  trend: "up" | "down" | "neutral";
}

export interface TrafficSourceItem {
  name: string;
  value: number;
}

export interface WeeklyActivityItem {
  day: string;
  views: number;
  clicks: number;
}

/**
 * The agency's own numbers.
 *
 * Every section is nullable: a role granted only "Income" gets the money block
 * and `null` for everything else — the card is not merely hidden, the number
 * never leaves the server.
 */
export interface CompanyOverview {
  listings: {
    available: number;
    reserved: number;
    sold: number;
    rented: number;
    draft: number;
    featured: number;
    total: number;
  } | null;
  projects: { active: number; completed: number } | null;
  agents: { active: number; total: number } | null;
  /** Each figure is granted separately — see the note on the server side. */
  money: {
    income: number | null;
    expense: number | null;
    netProfit: number | null;
  } | null;
  enquiries: { contact: number; quotations: number; total: number } | null;
  /** Listings added per month for the last six, oldest first. */
  trend: { month: string; listings: number }[] | null;
  content: {
    published: number;
    drafts: number;
    pendingReviews: number;
  } | null;
}

export interface QuickStats {
  page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_seconds: number;
}

export interface DashboardOverview {
  stats: DashboardStat[];
  traffic_sources: TrafficSourceItem[];
  weekly_activity: WeeklyActivityItem[];
  quick_stats: QuickStats;
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    dashboardOverview: builder.query<DashboardOverview, void>({
      query: () => ({ url: "/dashboard/overview", method: "GET" }),
      transformResponse: (response: ApiEnvelope<DashboardOverview>) =>
        response.data,
    }),
    dashboardStats: builder.query<DashboardStat[], void>({
      query: () => ({ url: "/dashboard/stats", method: "GET" }),
      transformResponse: (response: ApiEnvelope<DashboardStat[]>) =>
        response.data,
    }),
    dashboardTrafficSources: builder.query<TrafficSourceItem[], void>({
      query: () => ({ url: "/dashboard/traffic-sources", method: "GET" }),
      transformResponse: (response: ApiEnvelope<TrafficSourceItem[]>) =>
        response.data,
    }),
    dashboardWeeklyActivity: builder.query<WeeklyActivityItem[], void>({
      query: () => ({ url: "/dashboard/weekly-activity", method: "GET" }),
      transformResponse: (response: ApiEnvelope<WeeklyActivityItem[]>) =>
        response.data,
    }),
    dashboardQuickStats: builder.query<QuickStats, void>({
      query: () => ({ url: "/dashboard/quick-stats", method: "GET" }),
      transformResponse: (response: ApiEnvelope<QuickStats>) => response.data,
    }),

    /**
     * The agency's own numbers.
     *
     * One call for the whole dashboard rather than one per card: the sections
     * a role may not see come back as null, decided server-side, so the page
     * renders what it was given instead of asking for things it will hide.
     */
    companyOverview: builder.query<CompanyOverview, void>({
      query: () => ({ url: "/dashboard/company", method: "GET" }),
      transformResponse: (response: ApiEnvelope<CompanyOverview>) =>
        response.data,
      providesTags: ["properties", "projects"],
    }),
  }),
});

export const {
  useCompanyOverviewQuery,
  useDashboardOverviewQuery,
  useDashboardStatsQuery,
  useDashboardTrafficSourcesQuery,
  useDashboardWeeklyActivityQuery,
  useDashboardQuickStatsQuery,
} = dashboardApi;
