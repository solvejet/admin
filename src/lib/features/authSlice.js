// src/lib/features/authSlice.js
// Remove token validation and simplify the auth state

import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("admin")
    ? JSON.parse(localStorage.getItem("admin"))
    : null;
  return {
    user: admin,
    token,
    permissions: admin?.permissions || [],
    isAuthenticated: !!token && !!admin,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, { payload }) => {
      const { token, admin } = payload;
      state.user = admin;
      state.token = token;
      state.permissions = admin.permissions || [];
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
      localStorage.setItem("admin", JSON.stringify(admin));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.permissions = [];
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
export const selectPermissions = (state) => state.auth.permissions;

// Permission check helper
export const hasPermission = (permissions, permissionName) => {
  return permissions.some((p) => p.name === permissionName && p.allowed);
};

export const authReducer = authSlice.reducer;
