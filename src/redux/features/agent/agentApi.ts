import { baseApi } from "../../api/baseApi";

export const agentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgents: builder.query({
      query: (params) => ({
        url: "/agents",
        method: "GET",
        params,
      }),
      providesTags: ["agents"],
    }),
    createAgent: builder.mutation({
      query: (data) => ({
        url: "/agents",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["agents"],
    }),
    updateAgent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/agents/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["agents"],
    }),
    deleteAgent: builder.mutation({
      query: (id) => ({
        url: `/agents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["agents"],
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
} = agentApi;
