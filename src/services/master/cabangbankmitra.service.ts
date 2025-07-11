import { apiSlice } from "../base-query";
import { CabangBankMitra } from "@/types/cabangbankmitra";

export const cabangBankMitraApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all Cabang Bank Mitra with pagination, search, and filter status
    getCabangBankMitras: builder.query<
      {
        data: CabangBankMitra[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string; status?: string }
    >({
      query: ({ page, paginate, search = "", status = "" }) => ({
        url: `/master/cabang-bank-mitra`,
        method: "GET",
        params: {
          page,
          paginate,
          search,
          status,
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: CabangBankMitra[];
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

    // ✅ Get by ID
    getCabangBankMitraById: builder.query<CabangBankMitra, number>({
      query: (id) => ({
        url: `/master/cabang-bank-mitra/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: CabangBankMitra;
      }) => response.data,
    }),

    // ✅ Create
    createCabangBankMitra: builder.mutation<
      CabangBankMitra,
      Partial<CabangBankMitra>
    >({
      query: (payload) => ({
        url: `/master/cabang-bank-mitra`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: CabangBankMitra;
      }) => response.data,
    }),

    // ✅ Update
    updateCabangBankMitra: builder.mutation<
      CabangBankMitra,
      { id: number; payload: Partial<CabangBankMitra> }
    >({
      query: ({ id, payload }) => ({
        url: `/master/cabang-bank-mitra/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: CabangBankMitra;
      }) => response.data,
    }),

    // ✅ Delete
    deleteCabangBankMitra: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/master/cabang-bank-mitra/${id}`,
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
  useGetCabangBankMitrasQuery,
  useGetCabangBankMitraByIdQuery,
  useCreateCabangBankMitraMutation,
  useUpdateCabangBankMitraMutation,
  useDeleteCabangBankMitraMutation,
} = cabangBankMitraApi;
