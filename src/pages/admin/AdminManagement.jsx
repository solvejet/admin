import React, { useState, useCallback, useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
} from "firebase/auth";
import {
  db,
  auth,
  USERS_COLLECTION,
  ADMINS_COLLECTION,
} from "@/config/firebase";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import useAuthStore from "@/store/authStore";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = useMemo(
    () => ({
      active:
        "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400",
      inactive: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400",
    }),
    []
  );

  return (
    <span
      className={cn(
        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
        styles[status]
      )}
    >
      {status}
    </span>
  );
};

// Action Button Component
const ActionButton = ({ icon: Icon, onClick, label, variant }) => {
  const styles = {
    edit: "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300",
    delete:
      "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300",
  };

  return (
    <button
      onClick={onClick}
      className={cn(styles[variant], "transition-colors")}
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmation = ({ isOpen, onClose, onConfirm, adminName }) => (
  <Dialog.Root open={isOpen} onOpenChange={onClose}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn" />
      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-amber-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Delete Admin
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete {adminName}? This action cannot be
              undone.
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onConfirm}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

// Form Component with improved validation and error handling
const AdminForm = React.memo(({ admin, onSubmit, onClose, open }) => {
  const initialFormState = {
    email: admin?.email || "",
    name: admin?.name || "",
    role: "admin",
    status: admin?.status || "active",
    password: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData({
        email: admin?.email || "",
        name: admin?.name || "",
        role: "admin",
        status: admin?.status || "active",
        password: "",
      });
      setErrors({});
    }
  }, [open, admin]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!admin && !formData.password)
      newErrors.password = "Password is required";
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await onSubmit(formData);
      if (!result.success) {
        setErrors({ submit: result.error });
      } else {
        setFormData(initialFormState);
        onClose();
      }
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 shadow-xl data-[state=open]:animate-contentShow"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
              {admin ? "Edit Admin" : "Add New Admin"}
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <Form.Root onSubmit={handleSubmit} className="p-6 space-y-6">
            <Form.Field name="name">
              <Form.Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </Form.Label>
              <Form.Control asChild>
                <input
                  className={cn(
                    "w-full rounded-lg border bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white",
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  )}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter admin name"
                />
              </Form.Control>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </Form.Field>

            <Form.Field name="email">
              <Form.Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </Form.Label>
              <Form.Control asChild>
                <input
                  className={cn(
                    "w-full rounded-lg border bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white",
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  )}
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter admin email"
                  disabled={admin}
                />
              </Form.Control>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </Form.Field>

            {!admin && (
              <Form.Field name="password">
                <Form.Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Form.Label>
                <Form.Control asChild>
                  <input
                    className={cn(
                      "w-full rounded-lg border bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:text-white",
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    )}
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Enter password"
                  />
                </Form.Control>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </Form.Field>
            )}

            <Form.Field name="status">
              <Form.Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </Form.Label>
              <Form.Control asChild>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Form.Control>
            </Form.Field>

            {errors.submit && (
              <p className="text-sm text-red-500">{errors.submit}</p>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Form.Submit asChild>
                <Button disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    <>{admin ? "Update" : "Add"} Admin</>
                  )}
                </Button>
              </Form.Submit>
            </div>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

AdminForm.displayName = "AdminForm";

// Main AdminManagement Component
const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [deletingAdmin, setDeletingAdmin] = useState(null);
  const [toast, setToast] = useState(null);
  const user = useAuthStore((state) => state.user);

  const fetchAdmins = useCallback(async () => {
    try {
      const adminsRef = collection(db, ADMINS_COLLECTION);
      const q = query(adminsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const adminsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdmins(adminsList);
    } catch (error) {
      setToast({
        type: "error",
        message: `Failed to fetch admins: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleAddAdmin = async (adminData) => {
    try {
      const result = await createNewAdmin({
        email: adminData.email,
        password: adminData.password,
        name: adminData.name,
        createdBy: user?.uid || "system",
      });

      if (result.success) {
        setShowForm(false);
        fetchAdmins();
        setToast({
          type: "success",
          message: "Admin added successfully",
        });
      }
      return result;
    } catch (error) {
      console.error("Error adding admin:", error);
      setToast({
        type: "error",
        message: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  // Create new admin function
  const createNewAdmin = async ({
    email,
    password,
    name,
    createdBy = "system",
  }) => {
    try {
      // First try to create auth user
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = userCredential.user.uid;
        const timestamp = new Date().toISOString();

        // Then create user document
        await setDoc(doc(db, USERS_COLLECTION, uid), {
          uid,
          email,
          name,
          role: "admin",
          createdAt: timestamp,
          createdBy,
        });

        // Finally create admin document
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

        const adminDoc = await addDoc(
          collection(db, ADMINS_COLLECTION),
          adminData
        );

        return {
          success: true,
          adminId: adminDoc.id,
          uid: uid,
        };
      } catch (error) {
        // Handle Firebase Auth specific errors
        if (error.code === "auth/email-already-in-use") {
          return {
            success: false,
            error: "Email is already registered",
          };
        }
        throw error; // Rethrow other errors
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      let errorMessage = "Failed to create admin";

      // Handle other Firebase Auth errors
      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password must be at least 6 characters";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleEditAdmin = async (adminData) => {
    try {
      const updates = {
        name: adminData.name,
        status: adminData.status,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.uid || "system",
      };

      const adminRef = doc(db, ADMINS_COLLECTION, editingAdmin.id);
      const userRef = doc(db, USERS_COLLECTION, editingAdmin.uid);

      await Promise.all([
        updateDoc(adminRef, updates),
        updateDoc(userRef, {
          name: adminData.name,
          updatedAt: updates.updatedAt,
          updatedBy: updates.updatedBy,
        }),
      ]);

      setEditingAdmin(null);
      fetchAdmins();
      setToast({
        type: "success",
        message: "Admin updated successfully",
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating admin:", error);
      setToast({
        type: "error",
        message: "Failed to update admin",
      });
      return { success: false, error: error.message };
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAdmin) return;

    try {
      await deleteDoc(doc(db, ADMINS_COLLECTION, deletingAdmin.id));
      await deleteDoc(doc(db, USERS_COLLECTION, deletingAdmin.uid));

      try {
        const authInstance = getAuth();
        const user = await authInstance.getUser(deletingAdmin.uid);
        if (user) {
          await deleteUser(user);
        }
      } catch (authError) {
        console.error("Error deleting auth user:", authError);
      }

      fetchAdmins();
      setToast({
        type: "success",
        message: "Admin deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting admin:", error);
      setToast({
        type: "error",
        message: "Failed to delete admin: " + error.message,
      });
    } finally {
      setDeletingAdmin(null);
    }
  };

  const handleCloseDialog = useCallback(() => {
    setShowForm(false);
    setEditingAdmin(null);
    setDeletingAdmin(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Admin Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage system administrators and their access
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : admins.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-900/20">
              <PlusIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No admins found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by adding a new admin
              </p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Admin
            </Button>
          </div>
        </div>
      ) : (
        /* Admin List Table */
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {admin.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {admin.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={admin.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <ActionButton
                          icon={PencilIcon}
                          onClick={() => setEditingAdmin(admin)}
                          label="Edit admin"
                          variant="edit"
                        />
                        <ActionButton
                          icon={TrashIcon}
                          onClick={() => setDeletingAdmin(admin)}
                          label="Delete admin"
                          variant="delete"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Form Dialog */}
      <AdminForm
        admin={editingAdmin}
        onSubmit={editingAdmin ? handleEditAdmin : handleAddAdmin}
        onClose={handleCloseDialog}
        open={showForm || !!editingAdmin}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={!!deletingAdmin}
        onClose={() => setDeletingAdmin(null)}
        onConfirm={handleDeleteConfirm}
        adminName={deletingAdmin?.name}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminManagement;
