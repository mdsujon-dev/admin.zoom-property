import { baseApi } from "../../api/baseApi";

export interface CmsContentDoc {
  key: string;
  value?: unknown;
  group?: string;
  type?: string;
}

export interface CmsUpsertItem {
  key: string;
  value: string;
  group: string;
  type: "text";
}

const cmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Everything stored for one page, as `{ key: doc }`.
     *
     * The map endpoint rather than the paginated admin list: the editor needs
     * every field of a page at once, and asking for them a page at a time
     * would mean a form that fills in halfway.
     */
    getCmsContent: builder.query({
      query: (group: string) => ({
        url: `dynamic-content/map?group=${encodeURIComponent(group)}`,
        method: "GET",
      }),
      transformResponse: (r: { data: Record<string, CmsContentDoc> }) =>
        r.data || {},
      providesTags: ["dynamic-content"],
    }),

    /** One section's worth of fields, saved together. */
    saveCmsContent: builder.mutation({
      query: (contents: CmsUpsertItem[]) => ({
        url: "dynamic-content/bulk-upsert",
        method: "PUT",
        body: { contents },
      }),
      invalidatesTags: ["dynamic-content"],
    }),

    /** Clears overrides so the field falls back to the site's built-in text. */
    resetCmsContent: builder.mutation({
      query: (keys: string[]) => ({
        url: "dynamic-content/bulk-delete",
        method: "DELETE",
        body: { keys },
      }),
      invalidatesTags: ["dynamic-content"],
    }),
  }),
});

export const {
  useGetCmsContentQuery,
  useSaveCmsContentMutation,
  useResetCmsContentMutation,
} = cmsApi;
