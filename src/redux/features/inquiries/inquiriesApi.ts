import { baseApi } from "../../api/baseApi";

const inquiriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allContactMessages: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: { name: string; value: any }) => {
            params.append(item?.name, item?.value);
          });
        }
        return {
          url: `/inquiries/all-contact`,
          method: "GET",
          params: params,
        };
      },
    }),
    allQuotationMessages: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: { name: string; value: any }) => {
            params.append(item?.name, item?.value);
          });
        }
        return {
          url: `/inquiries/all-quotation`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["quotation-messages"],
    }),
    deleteQuotationMessage: builder.mutation({
      query: (id: string) => ({
        url: `/inquiries/quotation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["quotation-messages"],
    }),
    sendQuotationEmail: builder.mutation({
      query: ({
        id,
        subject,
        body,
      }: {
        id: string;
        subject: string;
        body: string;
      }) => ({
        url: `/inquiries/quotation/${id}/send-email`,
        method: "POST",
        body: { subject, body },
      }),
    }),
    sendContactEmail: builder.mutation({
      query: ({
        id,
        subject,
        body,
      }: {
        id: string;
        subject: string;
        body: string;
      }) => ({
        url: `/inquiries/contact/${id}/send-email`,
        method: "POST",
        body: { subject, body },
      }),
    }),
  }),
});

export const {
  useAllContactMessagesQuery,
  useAllQuotationMessagesQuery,
  // Fired on demand by the export buttons, which need every row rather than
  // the page being shown.
  useLazyAllContactMessagesQuery,
  useLazyAllQuotationMessagesQuery,
  useDeleteQuotationMessageMutation,
  useSendQuotationEmailMutation,
  useSendContactEmailMutation,
} = inquiriesApi;
