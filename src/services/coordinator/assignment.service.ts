import { apiSlice } from "../base-query";
import { Assignment } from "@/types/assignment";

export const assignmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all assignments
    getAssignments: builder.query<
      {
        data: Assignment[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/coordinator/assignments?paginate=${paginate}&page=${page}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Assignment[];
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

    // ✅ Get assignment by ID (ID bisa berupa sales_id atau kombinasi ID unik lainnya)
    getAssignmentById: builder.query<Assignment, number>({
      query: (id) => ({
        url: `/coordinator/assignments/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Assignment;
      }) => response.data,
    }),

    // ✅ Create new assignment
    createAssignment: builder.mutation<Assignment, Partial<Assignment>>({
      query: (payload) => ({
        url: "/coordinator/assignments",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Assignment;
      }) => response.data,
    }),

    // ✅ Update assignment
    updateAssignment: builder.mutation<
      Assignment,
      { id: number; payload: Partial<Assignment> }
    >({
      query: ({ id, payload }) => ({
        url: `/coordinator/assignments/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Assignment;
      }) => response.data,
    }),

    // ✅ Delete assignment
    deleteAssignment: builder.mutation<
      { code: number; message: string },
      number
    >({
      query: (id) => ({
        url: `/coordinator/assignments/${id}`,
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
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentApi;
