// src/services/product/fundingproductcategory.service.ts
import { apiSlice } from "../base-query";
import { FundingProductCategory } from "@/types/sales-manage"; // pastikan sudah buat type ini

export const fundingProductCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all funding product categories (paginated)
    getFundingProductCategories: builder.query<
      {
        data: FundingProductCategory[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/product/funding/categories?paginate=${paginate}&page=${page}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          data: FundingProductCategory[];
          current_page: number;
          last_page: number;
          total: number;
          per_page: number;
        };
      }) => ({
        data: response.data.data,
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // ✅ Get by ID
    getFundingProductCategoryById: builder.query<
      FundingProductCategory,
      number
    >({
      query: (id) => ({
        url: `/product/funding/categories/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: FundingProductCategory;
      }) => response.data,
    }),

    // ✅ Create
    createFundingProductCategory: builder.mutation<
      FundingProductCategory,
      Partial<FundingProductCategory>
    >({
      query: (payload) => ({
        url: `/product/funding/categories`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: FundingProductCategory;
      }) => response.data,
    }),

    // ✅ Update
    updateFundingProductCategory: builder.mutation<
      FundingProductCategory,
      { id: number; payload: Partial<FundingProductCategory> }
    >({
      query: ({ id, payload }) => ({
        url: `/product/funding/categories/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: FundingProductCategory;
      }) => response.data,
    }),

    // ✅ Delete
    deleteFundingProductCategory: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/product/funding/categories/${id}`,
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
  useGetFundingProductCategoriesQuery,
  useGetFundingProductCategoryByIdQuery,
  useCreateFundingProductCategoryMutation,
  useUpdateFundingProductCategoryMutation,
  useDeleteFundingProductCategoryMutation,
} = fundingProductCategoryApi;