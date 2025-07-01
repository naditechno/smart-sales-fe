import { apiSlice } from "./base-query";
import { Customer } from "@/types/customer";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all customers
    getCustomers: builder.query<
      {
        data: Customer[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/master/customer?paginate=${paginate}&page=${page}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Customer[];
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

    // ✅ Get customer by ID
    getCustomerById: builder.query<Customer, number>({
      query: (id) => ({
        url: `/master/customer/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Customer;
      }) => response.data,
    }),

    // ✅ Create new customer
    createCustomer: builder.mutation<Customer, Partial<Customer>>({
      query: (payload) => ({
        url: "/master/customer",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Customer;
      }) => response.data,
    }),

    // ✅ Update customer
    updateCustomer: builder.mutation<
      Customer,
      { id: number; payload: Partial<Customer> }
    >({
      query: ({ id, payload }) => ({
        url: `/master/customer/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Customer;
      }) => response.data,
    }),

    // ✅ Delete customer
    deleteCustomer: builder.mutation<{ code: number; message: string }, number>(
      {
        query: (id) => ({
          url: `/master/customer/${id}`,
          method: "DELETE",
        }),
        transformResponse: (response: {
          code: number;
          message: string;
          data: null;
        }) => response,
      }
    ),

    // ✅ Import customer (file upload)
    importCustomer: builder.mutation<{ message: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/master/customer/import",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: { code: number; message: string }) =>
        response,
    }),

    // ✅ Export customer (with payload)
    exportCustomer: builder.mutation<
      boolean, 
      Partial<Customer>
    >({
      async queryFn(payload, _queryApi, _extraOptions, baseQuery) {
        const response = await baseQuery({
          url: "/master/customer/export",
          method: "POST",
          body: payload,
          responseHandler: (r) => r.blob(),
        });

        if (response.error) return { error: response.error };

        const blob = response.data as Blob;

        const contentType = blob.type;

        if (
          !contentType.includes("sheet") &&
          contentType !==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          const text = await blob.text();

          const error: FetchBaseQueryError = {
            status: 500,
            data: {
              message: "INVALID_FILE",
              detail: text,
            },
          };

          return { error };
        }

        return { data: true };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useImportCustomerMutation,
  useExportCustomerMutation,
} = customerApi;
