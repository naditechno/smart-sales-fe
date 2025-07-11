import { apiSlice } from "./base-query";
import { User } from "@/types/user";
import { Assignment } from "@/types/assignment";

export const referenceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoordinators: builder.query<
      User[],
      { search: string; paginate: number }
    >({
      query: ({ search, paginate }) => ({
        url: `/reference/user/coordinator?search=${search}&paginate=${paginate}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: { current_page: number; data: User[] };
      }) => response.data.data,
    }),

    getAllSales: builder.query<
      User[],
      { search?: string; paginate?: number } 
    >({
      query: ({ search, paginate }) => {
        // Buat URL dengan parameter query secara kondisional
        const params = new URLSearchParams();
        if (search) {
          params.append("search", search);
        }
        if (paginate) {
          params.append("paginate", paginate.toString());
        }
        const queryString = params.toString();
        return {
          url: `/reference/user/sales${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        code: number;
        message: string;
        data: { current_page: number; data: User[] };
      }) => response.data.data,
    }),

    getUnassignedSales: builder.query<
      User[],
      { search: string; paginate: number }
    >({
      query: ({ search, paginate }) => ({
        url: `/reference/user/sales/not-assigned?search=${search}&paginate=${paginate}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: { current_page: number; data: User[] };
      }) => response.data.data,
    }),

    // ✅ PERBAIKAN: Tambah dukungan pencarian
    getSalesByCoordinatorId: builder.query<
      User[],
      { id: number; search?: string }
    >({
      query: ({ id, search }) => ({
        url: `/reference/user/coordinator/${id}/sales`,
        method: "GET",
        params: {
          search: search || "",
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: { current_page: number; data: User[] };
      }) => response.data.data,
    }),

    getCoordinatorAssignments: builder.query<Assignment[], void>({
      query: () => ({
        url: "/coordinator/assignments",
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: { current_page: number; data: Assignment[] };
      }) => response.data.data,
    }),
  }),
});

export const {
  useGetAllCoordinatorsQuery,
  useGetAllSalesQuery,
  useGetUnassignedSalesQuery,
  useGetSalesByCoordinatorIdQuery,
  useGetCoordinatorAssignmentsQuery,
} = referenceApi;
