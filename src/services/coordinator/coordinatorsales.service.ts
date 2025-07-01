import { apiSlice } from "../base-query";
import type { Sales } from "@/types/sales";

export const salesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all sales
    getSales: builder.query<
      {
        data: Sales[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/coordinator/sales?paginate=${paginate}&page=${page}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Sales[];
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

    // ✅ Get sales by ID
    getSalesById: builder.query<Sales, number>({
      query: (id) => ({
        url: `/coordinator/sales/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Sales;
      }) => response.data,
    }),

    // ✅ Create sales
    createSales: builder.mutation<Sales, Partial<Sales>>({
      query: (payload) => ({
        url: "/coordinator/sales",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Sales;
      }) => response.data,
    }),

    // ✅ Update sales
    updateSales: builder.mutation<
      Sales,
      { id: number; payload: Partial<Sales> }
    >({
      query: ({ id, payload }) => ({
        url: `/coordinator/sales/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Sales;
      }) => response.data,
    }),

    // ✅ Delete sales
    deleteSales: builder.mutation<{ code: number; message: string }, number>({
      query: (id) => ({
        url: `/coordinator/sales/${id}`,
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
  useGetSalesQuery,
  useGetSalesByIdQuery,
  useCreateSalesMutation,
  useUpdateSalesMutation, 
  useDeleteSalesMutation,
} = salesApi;
