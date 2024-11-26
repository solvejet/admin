// src/components/users/user-sidebar.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../lib/services/usersApi";
import { RightSidebar } from "../ui/right-sidebar";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export function UserSidebar({ open, onClose, user, schema }) {
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: user || {},
  });

  useEffect(() => {
    if (open) {
      reset(user || {});
    }
  }, [open, user, reset]);

  const onSubmit = async (data) => {
    try {
      if (user) {
        await updateUser({ id: user._id, data }).unwrap();
      } else {
        await createUser(data).unwrap();
      }
      onClose();
      reset();
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const renderField = (fieldName, fieldSchema) => {
    const type = fieldSchema.type.toLowerCase();
    const props = {
      ...register(fieldName, {
        required: fieldSchema.required && `${fieldName} is required`,
        min: fieldSchema.min,
        max: fieldSchema.max,
        minLength: fieldSchema.minlength,
        maxLength: fieldSchema.maxlength,
        pattern: fieldSchema.pattern,
      }),
    };

    switch (type) {
      case "string":
        if (fieldSchema.enum) {
          return (
            <select
              {...props}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select {fieldName}</option>
              {fieldSchema.enum.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        }
        return (
          <input
            type="text"
            {...props}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
          />
        );
      case "number":
        return (
          <input
            type="number"
            {...props}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
          />
        );
      case "boolean":
        return (
          <div className="flex items-center h-9">
            <input
              type="checkbox"
              {...props}
              className="h-4 w-4 rounded border-input"
            />
          </div>
        );
      case "date":
        return (
          <input
            type="date"
            {...props}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
          />
        );
      default:
        return null;
    }
  };

  return (
    <RightSidebar
      open={open}
      onClose={onClose}
      title={user ? "Edit User" : "Add User"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          {Object.entries(schema?.fields || {}).map(
            ([fieldName, fieldSchema]) => (
              <div key={fieldName} className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                  {fieldSchema.required && (
                    <span className="text-destructive">*</span>
                  )}
                </label>
                {renderField(fieldName, fieldSchema)}
                {errors[fieldName] && (
                  <p className="text-sm text-destructive">
                    {errors[fieldName].message}
                  </p>
                )}
              </div>
            )
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {(isCreating || isUpdating) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {user ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </RightSidebar>
  );
}
