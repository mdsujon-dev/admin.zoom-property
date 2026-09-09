import { baseApi } from "../../api/baseApi";

/** The managed option lists a listing draws from. */
export type PropertyOptionKind = "amenities";

export type PropertyStatus =
  | "draft"
  | "available"
  | "reserved"
  | "sold"
  | "rented"
  | "archived";

const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (params: any) => {
        const q = new URLSearchParams();
        if (params) {
          if (params.page) q.append("page", String(params.page));
          if (params.limit) q.append("limit", String(params.limit));
          if (params.searchTerm) q.append("searchTerm", params.searchTerm);
          if (params.status) q.append("status", params.status);
          if (params.purpose) q.append("purpose", params.purpose);
          if (params.type) q.append("type", params.type);
          if (params.area) q.append("area", params.area);
          if (params.agent) q.append("agent", params.agent);
          if (params.project) q.append("project", params.project);
          if (params.sort) q.append("sort", params.sort);
          // Dropdowns that offer a listing must never offer a draft.
          if (params.publishedOnly) q.append("publishedOnly", "true");
        }
        return { url: `properties?${q.toString()}`, method: "GET" };
      },
      transformResponse: (r: { data: any[]; meta: any }) => ({
        result: r.data || [],
        meta: r.meta || {},
      }),
      providesTags: ["properties"],
    }),

    getPropertyById: builder.query({
      query: (id: string) => ({ url: `properties/${id}`, method: "GET" }),
      transformResponse: (r: { data: any }) => r.data,
      providesTags: ["properties"],
    }),

    createProperty: builder.mutation({
      query: (body) => ({ url: "properties", method: "POST", body }),
      invalidatesTags: ["properties"],
    }),

    updateProperty: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `properties/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["properties"],
    }),

    changePropertyStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: PropertyStatus }) => ({
        url: `properties/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["properties"],
    }),

    togglePropertyFeatured: builder.mutation({
      query: (id: string) => ({
        url: `properties/${id}/featured`,
        method: "PATCH",
      }),
      invalidatesTags: ["properties"],
    }),

    deleteProperty: builder.mutation({
      query: (id: string) => ({ url: `properties/${id}`, method: "DELETE" }),
      invalidatesTags: ["properties"],
    }),

    /* ── Option lists (amenities) ────────────────────────────────────────
       One set of endpoints for every list; `kind` picks which. */
    getPropertyOptions: builder.query({
      query: ({
        kind,
        activeOnly,
      }: {
        kind: PropertyOptionKind;
        activeOnly?: boolean;
      }) => ({
        url: `properties/options/${kind}${activeOnly ? "?activeOnly=true" : ""}`,
        method: "GET",
      }),
      transformResponse: (r: { data: any[] }) => r.data || [],
      providesTags: ["property-options"],
    }),

    createPropertyOption: builder.mutation({
      query: ({ kind, data }: { kind: PropertyOptionKind; data: any }) => ({
        url: `properties/options/${kind}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["property-options"],
    }),

    updatePropertyOption: builder.mutation({
      query: ({
        kind,
        id,
        data,
      }: {
        kind: PropertyOptionKind;
        id: string;
        data: any;
      }) => ({
        url: `properties/options/${kind}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["property-options"],
    }),

    deletePropertyOption: builder.mutation({
      query: ({ kind, id }: { kind: PropertyOptionKind; id: string }) => ({
        url: `properties/options/${kind}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["property-options"],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useChangePropertyStatusMutation,
  useTogglePropertyFeaturedMutation,
  useDeletePropertyMutation,
  useGetPropertyOptionsQuery,
  useCreatePropertyOptionMutation,
  useUpdatePropertyOptionMutation,
  useDeletePropertyOptionMutation,
} = propertyApi;
