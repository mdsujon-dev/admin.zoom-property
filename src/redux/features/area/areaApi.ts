import { baseApi } from "../../api/baseApi";

const areaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAreas: builder.query({
      query: (params: any) => {
        const q = new URLSearchParams();
        if (params) {
          if (params.page) q.append("page", String(params.page));
          if (params.limit) q.append("limit", String(params.limit));
          if (params.searchTerm) q.append("searchTerm", params.searchTerm);
          if (params.city) q.append("city", params.city);
          if (params.activeOnly) q.append("activeOnly", "true");
        }
        return { url: `areas?${q.toString()}`, method: "GET" };
      },
      transformResponse: (r: { data: any[]; meta: any }) => ({
        result: r.data || [],
        meta: r.meta || {},
      }),
      providesTags: ["areas"],
    }),

    getAreaById: builder.query({
      query: (id: string) => ({ url: `areas/${id}`, method: "GET" }),
      transformResponse: (r: { data: any }) => r.data,
      providesTags: ["areas"],
    }),

    createArea: builder.mutation({
      query: (body) => ({ url: "areas", method: "POST", body }),
      invalidatesTags: ["areas"],
    }),

    updateArea: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `areas/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["areas"],
    }),

    deleteArea: builder.mutation({
      query: (id: string) => ({ url: `areas/${id}`, method: "DELETE" }),
      invalidatesTags: ["areas"],
    }),
  }),
});

export const {
  useGetAreasQuery,
  useGetAreaByIdQuery,
  useCreateAreaMutation,
  useUpdateAreaMutation,
  useDeleteAreaMutation,
} = areaApi;
