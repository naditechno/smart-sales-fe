import { apiSlice } from "../base-query";
import { Bank } from "@/types/bank";

export const bankApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all banks with pagination + search
    getBanks: builder.query<
      {
        data: Bank[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string } // <--- Tambahkan search
    >({
      query: ({ page, paginate, search = "" }) => ({
        url: `/master/bank`,
        method: "GET",
        params: {
          page,
          paginate,
          search,
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Bank[];
          last_page: number;
          total: number;
          per_page: number;
        };
      }) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // ✅ Get bank by ID
    getBankById: builder.query<Bank, number>({
      query: (id) => ({
        url: `/master/bank/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Bank;
      }) => response.data,
    }),

    // ✅ Create bank
    createBank: builder.mutation<Bank, Partial<Bank>>({
      query: (payload) => ({
        url: `/master/bank`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Bank;
      }) => response.data,
    }),

    // ✅ Update bank
    updateBank: builder.mutation<Bank, { id: number; payload: Partial<Bank> }>({
      query: ({ id, payload }) => ({
        url: `/master/bank/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Bank;
      }) => response.data,
    }),

    // ✅ Delete bank
    deleteBank: builder.mutation<{ code: number; message: string }, number>({
      query: (id) => ({
        url: `/master/bank/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => response,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBanksQuery,
  useGetBankByIdQuery,
  useCreateBankMutation,
  useUpdateBankMutation,
  useDeleteBankMutation,
} = bankApi;
