// src/components/auth-provider.jsx
import { createContext, useContext, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../lib/services/authApi";
import { setCredentials, logout } from "../lib/features/authSlice";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();

  const login = useCallback(
    async (credentials) => {
      try {
        const result = await loginMutation(credentials).unwrap();
        dispatch(setCredentials(result));
        return result;
      } catch (error) {
        throw new Error(error.data?.message || "Login failed");
      }
    },
    [dispatch, loginMutation]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const value = useMemo(
    () => ({
      login,
      logout: handleLogout,
      isLoading: isLoginLoading,
    }),
    [login, handleLogout, isLoginLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
