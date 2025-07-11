import { apiSlice } from "../base-query";
import { Branch } from "@/types/branch";

export const branchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all branches with pagination + search
    getBranches: builder.query<
      {
        data: Branch[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string } // <--- Tambahkan search
    >({
      query: ({ page, paginate, search = "" }) => ({
        url: `/master/cabang`,
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
          data: Branch[];
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

    // ✅ Get branch by ID
    getBranchById: builder.query<Branch, number>({
      query: (id) => ({
        url: `/master/cabang/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Branch;
      }) => response.data,
    }),

    // ✅ Create branch
    createBranch: builder.mutation<Branch, Partial<Branch>>({
      query: (payload) => ({
        url: `/master/cabang`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Branch;
      }) => response.data,
    }),

    // ✅ Update branch
    updateBranch: builder.mutation<
      Branch,
      { id: number; payload: Partial<Branch> }
    >({
      query: ({ id, payload }) => ({
        url: `/master/cabang/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Branch;
      }) => response.data,
    }),

    // ✅ Delete branch
    deleteBranch: builder.mutation<{ code: number; message: string }, number>({
      query: (id) => ({
        url: `/master/cabang/${id}`,
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
  useGetBranchesQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApi;
