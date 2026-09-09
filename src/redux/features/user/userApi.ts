import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (userInfo) => {
        return {
          url: "user",
          method: "POST",
          body: userInfo,
        };
      },
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ["users"],
    }),
    myProfile: builder.query({
      query: () => {
        return {
          url: "user/me",
          method: "GET",
        };
      },
      providesTags: ["user_profile"],
    }),

    getAllUser: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit) queryParams.append("limit", params.limit.toString());
          if (params.search) queryParams.append("search", params.search);
        }
        return {
          url: `user?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: { data: any[]; meta: any }) => ({
        result: response.data || [],
        meta: response.meta || {},
      }),
      providesTags: ["users"],
    }),
    getUserById: builder.query({
      query: (id: string) => ({ url: `user/${id}`, method: "GET" }),
      transformResponse: (r: { data: any }) => r.data,
      providesTags: ["users"],
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `user/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ["users"],
    }),
    updateUserRole: builder.mutation({
      query: (user) => {
        return {
          url: `user/update-role/${user.userId}`,
          method: "PUT",
          body: { role: user.role },
        };
      },
      invalidatesTags: ["users"],
    }),
    toggleUserStatus: builder.mutation({
      query: (userId) => {
        return {
          url: `user/${userId}/status`,
          method: "PATCH",
        };
      },
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ["users"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => {
        return {
          url: `user/${userId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["users"],
    }),
    changePassword: builder.mutation({
      query: ({ userId, newPassword }) => {
        return {
          url: `user/${userId}/password`,
          method: "PATCH",
          body: { newPassword },
        };
      },
      transformResponse: (response: { data: any }) => response.data,
    }),
    uploadProfileImage: builder.mutation({
      query: (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        return {
          url: "user/profile-image",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: { data: { url: string; user: any } }) =>
        response.data,
      invalidatesTags: ["user_profile", "users"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useMyProfileQuery,
  useUpdateUserRoleMutation,
  useGetAllUserQuery,
  useGetUserByIdQuery,
  useLazyGetAllUserQuery,
  useToggleUserStatusMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
  useUploadProfileImageMutation,
} = authApi;
