import { baseApi } from "../../api/baseApi";

export interface CompanySettings {
  _id?: string;
  name: string;
  shortName?: string;
  tagline?: string;
  logo?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  licenceNo?: string;
  invoicePrefix?: string;
  invoiceFooter?: string;
  reportFooter?: string;
  idCardNote?: string;
  /** Which card design each group is printed on — see Settings → ID Cards. */
  idCardTemplates?: {
    agent?: string;
    employee?: string;
  };
  /** Per-group tweaks on top of the design: colour, rows, terms. */
  idCardOptions?: Record<string, unknown>;
}

const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanySettings: builder.query<CompanySettings, void>({
      query: () => ({ url: "company", method: "GET" }),
      transformResponse: (r: { data: CompanySettings }) => r.data,
      providesTags: ["company"],
    }),
    updateCompanySettings: builder.mutation<
      CompanySettings,
      Partial<CompanySettings>
    >({
      query: (body) => ({ url: "company", method: "PATCH", body }),
      transformResponse: (r: { data: CompanySettings }) => r.data,
      invalidatesTags: ["company"],
    }),
  }),
});

export const {
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
} = companyApi;
