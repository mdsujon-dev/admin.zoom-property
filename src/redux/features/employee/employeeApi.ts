import { baseApi } from "../../api/baseApi";

/**
 * The employee, both halves of them.
 *
 * An account and an HR file are two documents on the server — login details on
 * `User`, everything a login has no business holding on `EmployeeProfile` — and
 * two endpoints update them. The form should not have to know that, so the
 * mutation below splits one submission across both calls and the screens read
 * one object.
 */

/** Account-side: what `PATCH /employees/:id` accepts. */
const ACCOUNT_FIELDS = [
  "name",
  "email",
  "username",
  "phone",
  "profilePhoto",
  "roleId",
  "designationId",
  "isActive",
  "weekendDays",
  "note",
  "presentDivision",
  "presentDistrict",
  "presentCity",
  "presentPoliceStation",
  "presentPostOffice",
  "presentPostalCode",
  "presentDetailedAddress",
  "permanentDivision",
  "permanentDistrict",
  "permanentCity",
  "permanentPoliceStation",
  "permanentPostOffice",
  "permanentPostalCode",
  "permanentDetailedAddress",
] as const;

/** HR-side: what `PATCH /employees/:id/profile` accepts. */
const PROFILE_FIELDS = [
  "dateOfBirth",
  "gender",
  "bloodGroup",
  "fatherName",
  "motherName",
  "maritalStatus",
  "employmentType",
  "joiningDate",
  "resignDate",
  "salary",
  "salaryType",
  "nidNumber",
  "emergencyContactName",
  "emergencyContactPhone",
  "documents",
  "status",
] as const;

/**
 * Splits a form's values by which endpoint owns them.
 *
 * Undefined is dropped rather than sent: both schemas are strict, and a form
 * that always posts every key would fail on the ones the user never touched.
 */
const pick = (values: Record<string, any>, keys: readonly string[]) => {
  const out: Record<string, any> = {};
  for (const k of keys) {
    if (values[k] !== undefined) out[k] = values[k];
  }
  return out;
};

const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: (params) => {
        const q = new URLSearchParams();
        if (params?.page) q.append("page", String(params.page));
        if (params?.limit) q.append("limit", String(params.limit));
        if (params?.searchTerm) q.append("searchTerm", params.searchTerm);
        return { url: `employees?${q.toString()}`, method: "GET" };
      },
      transformResponse: (r: { data: any[]; meta: any }) => ({
        result: r.data || [],
        meta: r.meta || {},
      }),
      providesTags: ["users"],
    }),

    getEmployeeById: builder.query({
      query: (id: string) => ({ url: `employees/${id}`, method: "GET" }),
      transformResponse: (r: { data: any }) => r.data,
      providesTags: ["users"],
    }),

    createEmployee: builder.mutation({
      query: (body) => ({ url: "employees", method: "POST", body }),
      transformResponse: (r: { data: any }) => r.data,
      invalidatesTags: ["users"],
    }),

    /**
     * One submission, two calls.
     *
     * The account is written first: if it is refused — a duplicate email, say —
     * nothing has been written to the HR file either, so the form can be shown
     * again with both halves intact. The other order would leave a profile
     * updated against an account that never changed.
     */
    updateEmployee: builder.mutation({
      async queryFn({ id, data }, _api, _extra, baseQuery) {
        const account = pick(data, ACCOUNT_FIELDS);
        const profile = pick(data, PROFILE_FIELDS);

        if (Object.keys(account).length) {
          const res = await baseQuery({
            url: `employees/${id}`,
            method: "PATCH",
            body: account,
          });
          if (res.error) return { error: res.error };
        }

        if (Object.keys(profile).length) {
          const res = await baseQuery({
            url: `employees/${id}/profile`,
            method: "PATCH",
            body: profile,
          });
          if (res.error) return { error: res.error };
        }

        return { data: { ok: true } };
      },
      invalidatesTags: ["users"],
    }),

    toggleEmployeeStatus: builder.mutation({
      query: (id: string) => ({
        url: `employees/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),

    changeEmployeePassword: builder.mutation({
      query: ({ id, newPassword }) => ({
        url: `employees/${id}/password`,
        method: "PATCH",
        body: { newPassword },
      }),
      invalidatesTags: ["users"],
    }),

    deleteEmployee: builder.mutation({
      query: (id: string) => ({ url: `employees/${id}`, method: "DELETE" }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useToggleEmployeeStatusMutation,
  useChangeEmployeePasswordMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
