import { apiSlice } from "./base-query";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<
      any,
      {
        role_id: number;
        name: string;
        email: string;
        phone: string;
        password: string;
        password_confirmation: string;
        status: boolean;
      }
    >({
      query: (newUser) => ({
        url: "/user",
        method: "POST",
        body: newUser,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: any;
      }) => response.data,
    }),

    getUsers: builder.query<
      any,
      { page: number; paginate: number; search?: string; search_by?: string }
    >({
      query: ({ page, paginate, search = "", search_by = "name" }) => ({
        url: `/user?paginate=${paginate}&page=${page}&search=${search}&search_by=${search_by}`,
        method: "GET",
      }),
      transformResponse: (response: { code: number; data: any }) => response,
    }),

    updateUser: builder.mutation({
      query: ({ id, payload }: { id: number; payload: any }) => {
        console.log("Update User Payload:", payload);
        return {
          url: `/user/${id}`,
          method: "PUT",
          body: payload,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        };
      },
      transformResponse: (response: { code: number; data: any }) =>
        response.data,
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { code: number; data: any }) =>
        response.data,
    }),

    updateUserStatus: builder.mutation<any, { id: number; payload: any }>({
      query: ({ id, payload }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    getRoles: builder.query<
      Array<{
        id: number;
        name: string;
        guard_name: string;
        created_at: string;
        updated_at: string;
      }>,
      void
    >({
      query: () => ({
        url: "/role",
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: any;
      }) => response.data.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useGetRolesQuery,
} = usersApi;
