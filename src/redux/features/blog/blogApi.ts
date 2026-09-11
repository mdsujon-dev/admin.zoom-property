import { baseApi } from "../../api/baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: (params: any) => {
        const q = new URLSearchParams();
        if (params) {
          if (params.page) q.append("page", String(params.page));
          if (params.limit) q.append("limit", String(params.limit));
          if (params.searchTerm) q.append("searchTerm", params.searchTerm);
          if (params.category) q.append("category", params.category);
          if (params.status) q.append("status", params.status);
        }
        return { url: `blog?${q.toString()}`, method: "GET" };
      },
      transformResponse: (r: { data: any[]; meta: any }) => ({
        result: r.data || [],
        meta: r.meta || {},
      }),
      providesTags: ["blog"],
    }),

    getPostById: builder.query({
      query: (id: string) => ({ url: `blog/${id}`, method: "GET" }),
      transformResponse: (r: { data: any }) => r.data,
      providesTags: ["blog"],
    }),

    createPost: builder.mutation({
      query: (body) => ({ url: "blog", method: "POST", body }),
      invalidatesTags: ["blog"],
    }),

    updatePost: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `blog/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),

    deletePost: builder.mutation({
      query: (id: string) => ({ url: `blog/${id}`, method: "DELETE" }),
      invalidatesTags: ["blog"],
    }),

    /* ── Categories ───────────────────────────────────────────────────── */
    getBlogCategories: builder.query({
      query: (params: any) => ({
        url: `blog/categories${params?.activeOnly ? "?activeOnly=true" : ""}`,
        method: "GET",
      }),
      transformResponse: (r: { data: any[] }) => r.data || [],
      providesTags: ["blog-categories"],
    }),

    createBlogCategory: builder.mutation({
      query: (body) => ({ url: "blog/categories", method: "POST", body }),
      invalidatesTags: ["blog-categories"],
    }),

    updateBlogCategory: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `blog/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blog-categories"],
    }),

    deleteBlogCategory: builder.mutation({
      query: (id: string) => ({
        url: `blog/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog-categories"],
    }),
    /* ── Comments ───────────────────────────────────────────────────── */
    getBlogComments: builder.query({
      query: (params: any) => {
        const q = new URLSearchParams();
        if (params) {
          if (params.page) q.append("page", String(params.page));
          if (params.limit) q.append("limit", String(params.limit));
        }
        return { url: `blog-comments?${q.toString()}`, method: "GET" };
      },
      transformResponse: (r: { data: any[]; meta: any }) => ({
        result: r.data || [],
        meta: r.meta || {},
      }),
      providesTags: ["blog-comments"],
    }),

    updateBlogCommentStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `blog-comments/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["blog-comments"],
    }),

    deleteBlogComment: builder.mutation({
      query: (id: string) => ({ url: `blog-comments/${id}`, method: "DELETE" }),
      invalidatesTags: ["blog-comments"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
  useGetBlogCommentsQuery,
  useUpdateBlogCommentStatusMutation,
  useDeleteBlogCommentMutation,
} = blogApi;
