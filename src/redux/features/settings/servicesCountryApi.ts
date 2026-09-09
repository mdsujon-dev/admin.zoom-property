import { baseApi } from "../../api/baseApi";

export interface IServicesCountry {
  _id?: string;
  name: string;
  slug?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const servicesCountryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServicesCountries: builder.query({
      query: (params: { keyword?: string; isActive?: string } = {}) => {
        const search = new URLSearchParams();
        if (params.keyword) search.set("keyword", params.keyword);
        if (params.isActive !== undefined && params.isActive !== "")
          search.set("isActive", params.isActive);
        const qs = search.toString();
        return {
          url: `/services-countries${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["services-countries"],
    }),

    getServicesCountryById: builder.query({
      query: (id: string) => ({
        url: `/services-countries/${id}`,
        method: "GET",
      }),
      providesTags: ["services-countries"],
    }),

    createServicesCountry: builder.mutation({
      query: (data: Partial<IServicesCountry>) => ({
        url: "/services-countries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["services-countries"],
    }),

    updateServicesCountry: builder.mutation({
      query: ({
        id,
        data,
      }: {
        id: string;
        data: Partial<IServicesCountry>;
      }) => ({
        url: `/services-countries/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["services-countries"],
    }),

    deleteServicesCountry: builder.mutation({
      query: (id: string) => ({
        url: `/services-countries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["services-countries"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetServicesCountriesQuery,
  useGetServicesCountryByIdQuery,
  useCreateServicesCountryMutation,
  useUpdateServicesCountryMutation,
  useDeleteServicesCountryMutation,
} = servicesCountryApi;
