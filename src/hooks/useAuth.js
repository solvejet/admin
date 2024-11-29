// src/hooks/useAuth.js
import { useCallback } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import { getUserRole } from "@/utils/roleUtils";
import useAuthStore from "@/store/authStore";

const ERROR_MESSAGES = {
  "auth/user-not-found": "Invalid email or password",
  "auth/wrong-password": "Invalid email or password",
  "auth/too-many-requests": "Too many attempts. Please try again later",
  "auth/network-request-failed": "Network error. Please check your connection",
  "auth/invalid-email": "Invalid email address",
  DEFAULT: "An unexpected error occurred",
};

export const useAuth = () => {
  const signIn = useCallback(async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const role = await getUserRole(userCredential.user.uid);

      useAuthStore.getState().setUser(userCredential.user);
      useAuthStore.getState().setRole(role);

      return { success: true, role };
    } catch (error) {
      console.error("Auth error:", error);
      const errorMessage = ERROR_MESSAGES[error.code] || ERROR_MESSAGES.DEFAULT;
      return { success: false, error: errorMessage };
    }
  }, []);

  return { signIn };
};
