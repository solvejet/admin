import { useState } from "react";
import {
  useGetUserSchemaQuery,
  useAddSchemaFieldMutation,
  useUpdateSchemaFieldMutation,
  useDeleteSchemaFieldMutation,
} from "../../lib/services/usersApi";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { AddFieldSidebar } from "./add-field-sidebar";
import { useToast } from "../ui/use-toast";

const PROTECTED_FIELDS = ["name", "number", "assignedAdmin", "status"];

export function SchemaManagement() {
  const { data: schema, isLoading: isLoadingSchema } = useGetUserSchemaQuery();
  const [addField, { isLoading: isAddingField }] = useAddSchemaFieldMutation();
  const [updateField, { isLoading: isUpdatingField }] =
    useUpdateSchemaFieldMutation();
  const [deleteField] = useDeleteSchemaFieldMutation();

  const [selectedField, setSelectedField] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const isProtectedField = (fieldName) => PROTECTED_FIELDS.includes(fieldName);

  const handleAddField = async (data) => {
    try {
      if (selectedField) {
        // For updating existing fields
        await updateField({
          fieldName: selectedField.name,
          data: {
            type: data.fieldType,
            required: data.options.required,
            ...(data.options.enum && { enum: data.options.enum }),
            ...(data.options.default !== undefined && {
              default: data.options.default,
            }),
            ...(data.options.minlength && {
              minlength: parseInt(data.options.minlength),
            }),
            ...(data.options.maxlength && {
              maxlength: parseInt(data.options.maxlength),
            }),
            ...(data.options.min && { min: data.options.min }),
            ...(data.options.max && { max: data.options.max }),
          },
        }).unwrap();
        toast({
          title: "Success",
          description: "Field updated successfully",
        });
      } else {
        // For adding new fields
        await addField({
          fieldName: data.fieldName,
          fieldType: data.fieldType,
          options: {
            required: data.options.required || false,
            ...(data.options.enum && { enum: data.options.enum }),
            ...(data.options.default !== undefined && {
              default: data.options.default,
            }),
            ...(data.options.minlength && {
              minlength: parseInt(data.options.minlength),
            }),
            ...(data.options.maxlength && {
              maxlength: parseInt(data.options.maxlength),
            }),
            ...(data.options.min && { min: data.options.min }),
            ...(data.options.max && { max: data.options.max }),
          },
        }).unwrap();
        toast({
          title: "Success",
          description: "Field added successfully",
        });
      }
      setShowAddForm(false);
      setSelectedField(null);
    } catch (error) {
      console.error("Failed to save field:", error);
      const errorMessage =
        error.data?.error?.message ||
        error.data?.message ||
        "Failed to save field. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleUpdateField = async (fieldName, fieldData) => {
    try {
      await updateField({ id: fieldName, ...fieldData }).unwrap();
      toast({
        title: "Success",
        description: "Field updated successfully",
      });
      setShowAddForm(false);
      setSelectedField(null);
    } catch (error) {
      console.error("Failed to update field:", error);
      toast({
        title: "Error",
        description: error.data?.message || "Failed to update field",
        variant: "destructive",
      });
    }
  };

  const handleDeleteField = async (fieldName) => {
    try {
      await deleteField(fieldName).unwrap();
      setShowDeleteDialog(false);
      setSelectedField(null);
      toast({
        title: "Success",
        description: "Field deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete field:", error);
      toast({
        title: "Error",
        description: error.data?.message || "Failed to delete field",
        variant: "destructive",
      });
    }
  };

  if (isLoadingSchema) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Schema Fields</h3>
          <p className="text-sm text-muted-foreground">
            Manage the fields in your user schema
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedField(null);
            setShowAddForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      <div className="grid gap-4">
        {Object.entries(schema?.fields || {}).map(([fieldName, field]) => (
          <div
            key={fieldName}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">{fieldName}</h4>
                {field.required && <Badge variant="default">Required</Badge>}
                {isProtectedField(fieldName) && (
                  <Badge variant="secondary">Core Field</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Type: {field.type}
                {field.enum && ` (${field.enum.join(", ")})`}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedField({
                    name: fieldName,
                    ...field,
                    fieldType: field.enum ? "string_enum" : field.type,
                    options: {
                      required: field.required,
                      enumValues: field.enum,
                      minlength: field.minlength,
                      maxlength: field.maxlength,
                      min: field.min,
                      max: field.max,
                      default: field.default,
                    },
                  });
                  setShowAddForm(true);
                }}
                disabled={isProtectedField(fieldName)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedField({ name: fieldName, ...field });
                  setShowDeleteDialog(true);
                }}
                disabled={isProtectedField(fieldName)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Field Sidebar */}
      <AddFieldSidebar
        open={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setSelectedField(null);
        }}
        initialData={selectedField}
        onSubmit={handleAddField}
        isLoading={isAddingField || isUpdatingField}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the field "{selectedField?.name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteField(selectedField?.name)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
