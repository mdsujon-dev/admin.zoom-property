import { baseApi } from "../../api/baseApi";

const landownerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLandownerProjects: builder.query({
      query: (params: any) => {
        const q = new URLSearchParams();
        if (params) {
          if (params.page) q.append("page", String(params.page));
          if (params.limit) q.append("limit", String(params.limit));
          if (params.searchTerm) q.append("searchTerm", params.searchTerm);
        }
        return { url: `landowner-projects?${q.toString()}`, method: "GET" };
      },
      transformResponse: (r: { data: any[]; meta: any }) => ({
        result: r.data || [],
        meta: r.meta || {},
      }),
      providesTags: ["landowner-projects"],
    }),

    createLandownerProject: builder.mutation({
      query: (body) => ({ url: "landowner-projects", method: "POST", body }),
      invalidatesTags: ["landowner-projects"],
    }),

    updateLandownerProject: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `landowner-projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["landowner-projects"],
    }),

    deleteLandownerProject: builder.mutation({
      query: (id: string) => ({
        url: `landowner-projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["landowner-projects"],
    }),
  }),
});

export const {
  useGetLandownerProjectsQuery,
  useCreateLandownerProjectMutation,
  useUpdateLandownerProjectMutation,
  useDeleteLandownerProjectMutation,
} = landownerApi;
