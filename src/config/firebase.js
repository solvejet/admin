import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Collection references
export const USERS_COLLECTION = "users";
export const ADMINS_COLLECTION = "admins";

// Helper function to initialize the first admin
export const initializeFirstAdmin = async (adminData) => {
  try {
    const adminsRef = collection(db, ADMINS_COLLECTION);
    const snapshot = await getDocs(adminsRef);

    if (snapshot.empty) {
      // If no admins exist, create the first one with special permissions
      await addDoc(adminsRef, {
        ...adminData,
        role: "admin",
        isSuper: true,
        createdAt: new Date().toISOString(),
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error initializing first admin:", error);
    throw error;
  }
};
