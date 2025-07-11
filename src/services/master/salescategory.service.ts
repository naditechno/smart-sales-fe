import { apiSlice } from "../base-query";
import { SalesCategory } from "@/types/salescategory";

export const salesCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all sales categories
    getSalesCategories: builder.query<
      {
        data: SalesCategory[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/master/sales-category?paginate=${paginate}&page=${page}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: SalesCategory[];
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
    getSalesCategoryById: builder.query<SalesCategory, number>({
      query: (id) => ({
        url: `/master/sales-category/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: SalesCategory;
      }) => response.data,
    }),

    // ✅ Create
    createSalesCategory: builder.mutation<
      SalesCategory,
      Partial<SalesCategory>
    >({
      query: (payload) => ({
        url: `/master/sales-category`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: SalesCategory;
      }) => response.data,
    }),

    // ✅ Update
    updateSalesCategory: builder.mutation<
      SalesCategory,
      { id: number; payload: Partial<SalesCategory> }
    >({
      query: ({ id, payload }) => ({
        url: `/master/sales-category/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: SalesCategory;
      }) => response.data,
    }),

    // ✅ Delete
    deleteSalesCategory: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/master/sales-category/${id}`,
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
  useGetSalesCategoriesQuery,
  useGetSalesCategoryByIdQuery,
  useCreateSalesCategoryMutation,
  useUpdateSalesCategoryMutation,
  useDeleteSalesCategoryMutation,
} = salesCategoryApi;
