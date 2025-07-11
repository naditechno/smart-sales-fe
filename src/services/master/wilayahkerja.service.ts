import { apiSlice } from "../base-query";
import { WilayahKerja } from "@/types/wilayah-kerja";

export const wilayahKerjaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all wilayah kerja with pagination + search
    getWilayahKerja: builder.query<
      {
        data: WilayahKerja[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number; search?: string }
    >({
      query: ({ page, paginate, search = "" }) => ({
        url: `/master/wilayah-kerja`,
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
          data: WilayahKerja[];
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

    // ✅ Get wilayah kerja by ID
    getWilayahKerjaById: builder.query<WilayahKerja, number>({
      query: (id) => ({
        url: `/master/wilayah-kerja/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: WilayahKerja;
      }) => response.data,
    }),

    // ✅ Create wilayah kerja
    createWilayahKerja: builder.mutation<WilayahKerja, Partial<WilayahKerja>>({
      query: (payload) => ({
        url: `/master/wilayah-kerja`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: WilayahKerja;
      }) => response.data,
    }),

    // ✅ Update wilayah kerja
    updateWilayahKerja: builder.mutation<
      WilayahKerja,
      { id: number; payload: Partial<WilayahKerja> }
    >({
      query: ({ id, payload }) => ({
        url: `/master/wilayah-kerja/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: WilayahKerja;
      }) => response.data,
    }),

    // ✅ Delete wilayah kerja
    deleteWilayahKerja: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/master/wilayah-kerja/${id}`,
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
  useGetWilayahKerjaQuery,
  useGetWilayahKerjaByIdQuery,
  useCreateWilayahKerjaMutation,
  useUpdateWilayahKerjaMutation,
  useDeleteWilayahKerjaMutation,
} = wilayahKerjaApi;
