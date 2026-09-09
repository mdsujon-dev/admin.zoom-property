import { baseApi } from "../../api/baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (params: any) => {
        const q = new URLSearchParams();
        if (params) {
          if (params.page) q.append("page", String(params.page));
          if (params.limit) q.append("limit", String(params.limit));
          if (params.searchTerm) q.append("searchTerm", params.searchTerm);
          if (params.isPublished !== undefined) {
            q.append("isPublished", String(params.isPublished));
          }
        }
        return { url: `reviews?${q.toString()}`, method: "GET" };
      },
      transformResponse: (r: { data: any[]; meta: any }) => ({
        result: r.data || [],
        meta: r.meta || {},
      }),
      providesTags: ["reviews"],
    }),

    getReviewById: builder.query({
      query: (id: string) => ({ url: `reviews/${id}`, method: "GET" }),
      transformResponse: (r: { data: any }) => r.data,
      providesTags: ["reviews"],
    }),

    createReview: builder.mutation({
      query: (body) => ({ url: "reviews", method: "POST", body }),
      invalidatesTags: ["reviews"],
    }),

    updateReview: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `reviews/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["reviews"],
    }),

    /** Approve or pull a review. The one action this screen exists for. */
    toggleReviewPublished: builder.mutation({
      query: (id: string) => ({
        url: `reviews/${id}/publish`,
        method: "PATCH",
      }),
      invalidatesTags: ["reviews"],
    }),

    deleteReview: builder.mutation({
      query: (id: string) => ({ url: `reviews/${id}`, method: "DELETE" }),
      invalidatesTags: ["reviews"],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useToggleReviewPublishedMutation,
  useDeleteReviewMutation,
} = reviewApi;
