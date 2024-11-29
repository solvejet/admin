// src/utils/roleUtils.js
import { doc, getDoc } from "firebase/firestore";
import { db, USERS_COLLECTION } from "@/config/firebase";

export const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    throw new Error("User role not found");
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw error;
  }
};

export const ROLES = {
  ADMIN: "admin",
  HR: "hr",
  VENDOR: "vendor",
  SALES: "sales",
};

export const ROLE_ROUTES = {
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.HR]: "/hr/dashboard",
  [ROLES.VENDOR]: "/vendor/dashboard",
  [ROLES.SALES]: "/sales/dashboard",
};
