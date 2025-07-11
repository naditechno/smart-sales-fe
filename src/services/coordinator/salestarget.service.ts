import { apiSlice } from "../base-query";
import { SalesTargetFunding } from "@/types/sales";

export const salesTargetFundingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All Sales Target Funding (paginated + optional search)
    getSalesTargetFundings: builder.query<
      {
        data: SalesTargetFunding[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string }
    >({
      query: ({ page, paginate, search }) => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("paginate", String(paginate));
        if (search) {
          params.append("search", search);
        }

        return {
          url: `/coordinator/sales-target-fundings?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          data: SalesTargetFunding[];
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
    getSalesTargetFundingById: builder.query<SalesTargetFunding, number>({
      query: (id) => ({
        url: `/coordinator/sales-target-fundings/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: SalesTargetFunding;
      }) => response.data,
    }),

    // ✅ Create
    createSalesTargetFunding: builder.mutation<
      SalesTargetFunding,
      Partial<SalesTargetFunding>
    >({
      query: (payload) => ({
        url: `/coordinator/sales-target-fundings`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: SalesTargetFunding;
      }) => response.data,
    }),

    // ✅ Update
    updateSalesTargetFunding: builder.mutation<
      SalesTargetFunding,
      { id: number; payload: Partial<SalesTargetFunding> }
    >({
      query: ({ id, payload }) => ({
        url: `/coordinator/sales-target-fundings/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: SalesTargetFunding;
      }) => response.data,
    }),

    // ✅ Delete
    deleteSalesTargetFunding: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/coordinator/sales-target-fundings/${id}`,
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
  useGetSalesTargetFundingsQuery,
  useGetSalesTargetFundingByIdQuery,
  useCreateSalesTargetFundingMutation,
  useUpdateSalesTargetFundingMutation,
  useDeleteSalesTargetFundingMutation,
} = salesTargetFundingApi;
