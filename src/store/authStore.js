// src/store/authStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState = {
  user: null,
  role: null,
  loading: false,
  error: null,
  isInitialized: false,
};

export const useAuthStore = create(
  devtools((set) => ({
    ...initialState,

    // Actions
    setUser: (user) => set({ user }),
    setRole: (role) => set({ role }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setInitialized: () => set({ isInitialized: true }),

    // Reset store
    reset: () => set(initialState),

    // Update multiple fields
    updateState: (updates) => set((state) => ({ ...state, ...updates })),
  }))
);

// Selectors
export const selectUser = (state) => state.user;
export const selectRole = (state) => state.role;
export const selectIsAuthenticated = (state) => !!state.user;
export const selectIsLoading = (state) => state.loading;
export const selectError = (state) => state.error;
export const selectIsInitialized = (state) => state.isInitialized;

export default useAuthStore;
