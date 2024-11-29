import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import {
  db,
  auth,
  USERS_COLLECTION,
  ADMINS_COLLECTION,
} from "@/config/firebase";

export async function createNewAdmin({
  email,
  password,
  name,
  createdBy = "system",
}) {
  try {
    // 1. Create the user account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;
    const timestamp = new Date().toISOString();

    // 2. Add to users collection with role
    await setDoc(doc(db, USERS_COLLECTION, uid), {
      uid,
      email,
      name,
      role: "admin",
      createdAt: timestamp,
      createdBy,
    });

    // 3. Add to admins collection
    const adminData = {
      uid,
      email,
      name,
      role: "admin",
      status: "active",
      createdAt: timestamp,
      createdBy,
      isSuper: false,
    };

    const adminsRef = collection(db, ADMINS_COLLECTION);
    const adminDoc = await addDoc(adminsRef, adminData);

    return {
      success: true,
      adminId: adminDoc.id,
      uid: uid,
    };
  } catch (error) {
    console.error("Error creating admin:", error);
    let errorMessage = "Failed to create admin";

    // Handle specific Firebase errors
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email is already registered";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak";
    }

    throw new Error(errorMessage);
  }
}
