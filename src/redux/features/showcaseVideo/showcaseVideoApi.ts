import { baseApi } from "../../api/baseApi";

const showcaseVideoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShowcaseVideos: builder.query({
      query: (params: any) => {
        const q = new URLSearchParams();
        if (params) {
          if (params.page) q.append("page", String(params.page));
          if (params.limit) q.append("limit", String(params.limit));
          if (params.searchTerm) q.append("searchTerm", params.searchTerm);
        }
        return { url: `showcase-videos?${q.toString()}`, method: "GET" };
      },
      transformResponse: (r: { data: any[]; meta: any }) => ({
        result: r.data || [],
        meta: r.meta || {},
      }),
      providesTags: ["showcase-videos"],
    }),

    createShowcaseVideo: builder.mutation({
      query: (body) => ({ url: "showcase-videos", method: "POST", body }),
      invalidatesTags: ["showcase-videos"],
    }),

    updateShowcaseVideo: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `showcase-videos/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["showcase-videos"],
    }),

    deleteShowcaseVideo: builder.mutation({
      query: (id: string) => ({
        url: `showcase-videos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["showcase-videos"],
    }),
  }),
});

export const {
  useGetShowcaseVideosQuery,
  useCreateShowcaseVideoMutation,
  useUpdateShowcaseVideoMutation,
  useDeleteShowcaseVideoMutation,
} = showcaseVideoApi;
