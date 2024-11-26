import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetAdminListQuery,
} from "../../lib/services/usersApi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

const UNASSIGNED_VALUE = "unassigned";

export function UserForm({ user, schema, onClose }) {
  const { toast } = useToast();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data: adminListResponse, isLoading: isLoadingAdmins } =
    useGetAdminListQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      ...user,
      assignedAdmin: user?.assignedAdmin?._id || UNASSIGNED_VALUE,
    },
  });

  const onSubmit = async (data) => {
    try {
      const submitData = {
        ...data,
        assignedAdmin:
          data.assignedAdmin === UNASSIGNED_VALUE ? null : data.assignedAdmin,
      };

      if (user) {
        await updateUser({ id: user._id, data: submitData }).unwrap();
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        await createUser(submitData).unwrap();
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to save user",
        variant: "destructive",
      });
    }
  };

  const renderField = (fieldName, fieldSchema) => {
    // Special handling for admin assignment
    if (fieldName === "assignedAdmin") {
      return (
        <select
          {...register(fieldName)}
          disabled={isLoadingAdmins}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value={UNASSIGNED_VALUE}>None (No Assignment)</option>
          {adminListResponse?.admins?.map((admin) => (
            <option key={admin._id} value={admin._id}>
              {admin.username} ({admin.email})
            </option>
          ))}
        </select>
      );
    }

    const commonProps = {
      id: fieldName,
      ...register(fieldName, {
        required: fieldSchema.required && `${fieldName} is required`,
        minLength: fieldSchema.minlength && {
          value: fieldSchema.minlength,
          message: `Minimum length is ${fieldSchema.minlength}`,
        },
        maxLength: fieldSchema.maxlength && {
          value: fieldSchema.maxlength,
          message: `Maximum length is ${fieldSchema.maxlength}`,
        },
        min: fieldSchema.min,
        max: fieldSchema.max,
        pattern: fieldSchema.pattern,
      }),
    };

    switch (fieldSchema.type.toLowerCase()) {
      case "string":
        if (fieldSchema.enum) {
          return (
            <select
              {...register(fieldName)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {fieldSchema.enum.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        }
        return <Input type="text" {...commonProps} />;

      case "number":
        return <Input type="number" {...commonProps} />;

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldName}
              checked={watch(fieldName) || false}
              onCheckedChange={(checked) => setValue(fieldName, checked)}
            />
          </div>
        );

      case "date":
        return <Input type="date" {...commonProps} />;

      default:
        return <Input type="text" {...commonProps} />;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Assignment Field */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Assigned Admin
          </label>
          {renderField("assignedAdmin", { type: "admin" })}
          {errors.assignedAdmin && (
            <p className="text-sm text-destructive mt-1">
              {errors.assignedAdmin.message}
            </p>
          )}
        </div>

        {/* Regular Schema Fields */}
        {Object.entries(schema || {}).map(([fieldName, fieldSchema]) => {
          if (fieldName === "assignedAdmin") return null;

          return (
            <div key={fieldName} className="space-y-2">
              <label
                htmlFor={fieldName}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {fieldSchema.label || fieldName}
                {fieldSchema.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </label>
              {renderField(fieldName, fieldSchema)}
              {errors[fieldName] && (
                <p className="text-sm text-destructive mt-1">
                  {errors[fieldName].message}
                </p>
              )}
              {fieldSchema.description && (
                <p className="text-sm text-muted-foreground">
                  {fieldSchema.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {user ? "Updating..." : "Creating..."}
            </>
          ) : user ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </form>
  );
}
