// src/lib/services/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
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
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "admin/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => {
        return {
          token: response.token,
          admin: response.admin,
        };
      },
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "admin/refresh-token",
        method: "POST",
      }),
      transformResponse: (response) => ({
        token: response.token,
        admin: response.admin,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "admin/logout",
        method: "POST",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "admin/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: "admin/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),

    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: "admin/change-password",
        method: "POST",
        body: { currentPassword, newPassword },
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "admin/profile",
        method: "PUT",
        body: data,
      }),
    }),
  }),
  tagTypes: ["Auth"],
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} = authApi;

// Handle 401 errors globally
export const handle401Error = (error, dispatch) => {
  if (error?.status === 401) {
    // Clear auth state and redirect to login
    dispatch(logout());
    window.location.href = "/login";
  }
  return error;
};

// Custom base query with auto refresh token
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery(
      { url: "admin/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Store new token
      api.dispatch(setCredentials(refreshResult.data));

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed - logout
      api.dispatch(logout());
    }
  }

  return result;
};

export default authApi;
