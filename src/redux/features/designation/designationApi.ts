import { baseApi } from "../../api/baseApi";

export const designationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * All designations, or one scope's worth.
     *
     * `scope` narrows to "employee" or "agent" — the employee form and the
     * agent form each want their own vocabulary, and offering an accountant
     * "Guest Agent" was how the list stopped meaning anything. Omit it for the
     * settings list, which shows both.
     *
     * The "client" scope is never returned whatever is asked for: it holds one
     * system row issued with a portal login, not a job title anybody assigns.
     */
    getDesignations: builder.query({
      query: (args?: { scope?: "employee" | "agent" } | void) => ({
        url: "/designations",
        method: "GET",
        params: args?.scope ? { scope: args.scope } : undefined,
      }),
      providesTags: ["designations"],
    }),

    // Get single designation by ID
    getDesignationById: builder.query({
      query: (id: string) => ({
        url: `/designations/${id}`,
        method: "GET",
      }),
      providesTags: ["designations"],
    }),

    // Create designation
    createDesignation: builder.mutation({
      query: (data: {
        name: string;
        description?: string;
        is_active?: boolean;
        scope?: "employee" | "agent";
      }) => ({
        url: "/designations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["designations"],
    }),

    // Update designation
    updateDesignation: builder.mutation({
      query: ({
        id,
        data,
      }: {
        id: string;
        data: {
          name?: string;
          description?: string;
          is_active?: boolean;
          scope?: "employee" | "agent";
        };
      }) => ({
        url: `/designations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["designations"],
    }),

    // Delete designation
    deleteDesignation: builder.mutation({
      query: (id: string) => ({
        url: `/designations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["designations"],
    }),

    // Toggle designation status
    toggleDesignationStatus: builder.mutation({
      query: (id: string) => ({
        url: `/designations/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["designations"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDesignationsQuery,
  useGetDesignationByIdQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
  useToggleDesignationStatusMutation,
} = designationApi;

