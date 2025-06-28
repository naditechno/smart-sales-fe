import { apiSlice } from "./base-query";
import { User, CreateUserPayload, Role } from "@/types/user";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ 1. createUser
    createUser: builder.mutation<User, CreateUserPayload>({
      query: (newUser) => ({
        url: "/user",
        method: "POST",
        body: newUser,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: User;
      }) => response.data,
    }),

    // ✅ 2. getUsers
    getUsers: builder.query<
      { code: number; data: { data: User[]; last_page: number } },
      { page: number; paginate: number; search?: string; search_by?: string }
    >({
      query: ({ page, paginate, search = "", search_by = "name" }) => ({
        url: `/user?paginate=${paginate}&page=${page}&search=${search}&search_by=${search_by}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        data: { data: User[]; last_page: number };
      }) => response,
    }),

    // ✅ 3. updateUser
    updateUser: builder.mutation<
      User,
      { id: number; payload: Partial<CreateUserPayload> }
    >({
      query: ({ id, payload }) => {
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
      transformResponse: (response: { code: number; data: User }) =>
        response.data,
    }),

    // ✅ 4. deleteUser
    deleteUser: builder.mutation<{ code: number; message: string }, number>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => response,
    }),

    // ✅ 5. updateUserStatus
    updateUserStatus: builder.mutation<
      User,
      { id: number; payload: Partial<User> }
    >({
      query: ({ id, payload }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    // ✅ 6. getRoles
    getRoles: builder.query<Role[], void>({
      query: () => ({
        url: "/role",
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: { data: Role[] };
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
