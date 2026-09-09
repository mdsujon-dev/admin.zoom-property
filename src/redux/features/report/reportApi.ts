import { baseApi } from "../../api/baseApi";

export type ReportQuery = {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

export type ReportResult<S = any, R = any> = {
  summary: S;
  rows: R[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  allRows?: R[];
};

const params = (q: ReportQuery = {}) => {
  const s = new URLSearchParams();
  if (q.startDate) s.append("startDate", q.startDate);
  if (q.endDate) s.append("endDate", q.endDate);
  if (q.page) s.append("page", String(q.page));
  if (q.limit) s.append("limit", String(q.limit));
  return s.toString();
};

const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    financialReport: builder.query<ReportResult, ReportQuery | void>({
      query: (q) => ({ url: `reports/financial?${params(q || {})}` }),
      transformResponse: (r: { data: ReportResult }) => r.data,
    }),
    cashBookReport: builder.query<ReportResult, ReportQuery | void>({
      query: (q) => ({ url: `reports/cash-book?${params(q || {})}` }),
      transformResponse: (r: { data: ReportResult }) => r.data,
    }),
    profitLossReport: builder.query<any, ReportQuery | void>({
      query: (q) => ({ url: `reports/profit-loss?${params(q || {})}` }),
      transformResponse: (r: { data: any }) => r.data,
    }),
  }),
});

export const {
  useFinancialReportQuery,
  useCashBookReportQuery,
  useProfitLossReportQuery,
} = reportApi;
