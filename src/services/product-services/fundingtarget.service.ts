import { apiSlice } from "../base-query";
import { FundingProductTarget } from "@/types/sales-manage";

export const fundingProductTargetApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all targets (paginated + optional filter by funding_product_id)
    getFundingProductTargets: builder.query<
      {
        data: FundingProductTarget[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; funding_product_id?: number }
    >({
      query: ({ page, paginate, funding_product_id }) => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("paginate", String(paginate));
        if (funding_product_id) {
          params.append("funding_product_id", String(funding_product_id));
        }

        return {
          url: `/product/funding/targets?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          data: FundingProductTarget[];
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
    getFundingProductTargetById: builder.query<FundingProductTarget, number>({
      query: (id) => ({
        url: `/product/funding/targets/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: FundingProductTarget;
      }) => response.data,
    }),

    // ✅ Create
    createFundingProductTarget: builder.mutation<
      FundingProductTarget,
      Partial<FundingProductTarget>
    >({
      query: (payload) => ({
        url: `/product/funding/targets`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: FundingProductTarget;
      }) => response.data,
    }),

    // ✅ Update
    updateFundingProductTarget: builder.mutation<
      FundingProductTarget,
      { id: number; payload: Partial<FundingProductTarget> }
    >({
      query: ({ id, payload }) => ({
        url: `/product/funding/targets/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: FundingProductTarget;
      }) => response.data,
    }),

    // ✅ Delete
    deleteFundingProductTarget: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/product/funding/targets/${id}`,
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
  useGetFundingProductTargetsQuery,
  useGetFundingProductTargetByIdQuery,
  useCreateFundingProductTargetMutation,
  useUpdateFundingProductTargetMutation,
  useDeleteFundingProductTargetMutation,
} = fundingProductTargetApi;