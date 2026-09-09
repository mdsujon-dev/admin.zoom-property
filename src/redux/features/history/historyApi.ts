import { baseApi } from "../../api/baseApi";

const historyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * The change history of any record that keeps one.
     *
     * One endpoint for every entity rather than a `history` endpoint per
     * module: the server writes them all into one collection with the entity
     * name on the row, so a second copy of this query per module would only be
     * a second place to keep the same URL.
     */
    getRecordHistory: builder.query<any[], { entity: string; id: string }>({
      query: ({ entity, id }) => ({
        url: `history/${entity}/${id}`,
        method: "GET",
      }),
      transformResponse: (r: { data: any[] }) => r.data || [],
      providesTags: ["properties", "projects", "areas", "blog", "reviews"],
    }),
  }),
});

export const { useGetRecordHistoryQuery } = historyApi;
