import { apiSlice } from "../base-query";
import { SalesType } from "@/types/salestype";

export const salesTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all sales types
    getSalesTypes: builder.query<
      {
        data: SalesType[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/master/sales-type?paginate=${paginate}&page=${page}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: SalesType[];
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
    getSalesTypeById: builder.query<SalesType, number>({
      query: (id) => ({
        url: `/master/sales-type/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: SalesType;
      }) => response.data,
    }),

    // ✅ Create
    createSalesType: builder.mutation<SalesType, Partial<SalesType>>({
      query: (payload) => ({
        url: `/master/sales-type`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: SalesType;
      }) => response.data,
    }),

    // ✅ Update
    updateSalesType: builder.mutation<
      SalesType,
      { id: number; payload: Partial<SalesType> }
    >({
      query: ({ id, payload }) => ({
        url: `/master/sales-type/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: SalesType;
      }) => response.data,
    }),

    // ✅ Delete
    deleteSalesType: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/master/sales-type/${id}`,
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
  useGetSalesTypesQuery,
  useGetSalesTypeByIdQuery,
  useCreateSalesTypeMutation,
  useUpdateSalesTypeMutation,
  useDeleteSalesTypeMutation,
} = salesTypeApi;
