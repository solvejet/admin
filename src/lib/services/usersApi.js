// src/lib/services/usersApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.pixe.in/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users", "Schema"],
  endpoints: (builder) => ({
    // Users CRUD
    getUsers: builder.query({
      query: (params = {}) => ({
        url: "user",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
          sort: params.sort || "-createdAt",
          ...params,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ _id }) => ({ type: "Users", id: _id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    getUserById: builder.query({
      query: (id) => `user/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    createUser: builder.mutation({
      query: (data) => ({
        url: "user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    bulkDeleteUsers: builder.mutation({
      query: (ids) => ({
        url: "user/bulk-delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    // Schema Management
    getUserSchema: builder.query({
      query: () => "user/schema",
      providesTags: ["Schema"],
    }),

    addSchemaField: builder.mutation({
      query: (data) => ({
        url: "user/schema/add-field",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Schema"],
    }),

    updateSchemaField: builder.mutation({
      query: ({ fieldName, data }) => ({
        url: `user/schema/update/${encodeURIComponent(fieldName)}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Schema"],
    }),

    deleteSchemaField: builder.mutation({
      query: (fieldName) => ({
        url: `user/schema/delete/${encodeURIComponent(fieldName)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Schema"],
    }),

    // User Assignments
    assignUsers: builder.mutation({
      query: ({ adminId, userIds }) => ({
        url: "user/assign",
        method: "POST",
        body: { adminId, userIds },
      }),
      invalidatesTags: (result, error, { userIds }) => [
        { type: "Users", id: "LIST" },
        ...userIds.map((id) => ({ type: "Users", id })),
      ],
    }),

    unassignUsers: builder.mutation({
      query: ({ adminId, userIds }) => ({
        url: "user/unassign",
        method: "POST",
        body: { adminId, userIds },
      }),
      invalidatesTags: (result, error, { userIds }) => [
        { type: "Users", id: "LIST" },
        ...userIds.map((id) => ({ type: "Users", id })),
      ],
    }),

    // User Import/Export
    importUsers: builder.mutation({
      query: (formData) => ({
        url: "user/import",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    exportUsers: builder.query({
      query: (params) => ({
        url: "user/export",
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // User Status Management
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `user/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    bulkUpdateUserStatus: builder.mutation({
      query: ({ ids, status }) => ({
        url: "user/bulk-status",
        method: "PATCH",
        body: { ids, status },
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    // Get Admin List
    getAdminList: builder.query({
      query: () => ({
        url: "admin/list",
      }),
      providesTags: ["Admins"],
    }),

    // Assign User to Admin
    assignUserToAdmin: builder.mutation({
      query: ({ userId, adminId }) => ({
        url: "user/assign",
        method: "POST",
        body: { userId, adminId },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Users", id: userId },
        { type: "Users", id: "LIST" },
      ],
    }),

    // Unassign User from Admin
    unassignUser: builder.mutation({
      query: ({ userId }) => ({
        url: "user/unassign",
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Users", id: userId },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Users CRUD
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBulkDeleteUsersMutation,

  // Schema Management
  useGetUserSchemaQuery,
  useAddSchemaFieldMutation,
  useUpdateSchemaFieldMutation,
  useDeleteSchemaFieldMutation,

  // User Assignments
  useAssignUsersMutation,
  useUnassignUsersMutation,

  // Import/Export
  useImportUsersMutation,
  useExportUsersQuery,

  // Status Management
  useUpdateUserStatusMutation,
  useBulkUpdateUserStatusMutation,

  // Assign Admin
  useGetAdminListQuery,
  useAssignUserToAdminMutation,
  useUnassignUserMutation
} = usersApi;

// Export api for store configuration
export const { reducerPath, reducer, middleware } = usersApi;
