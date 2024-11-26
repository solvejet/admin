import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { RightSidebar } from "../ui/right-sidebar";
import { Loader2, Plus, X } from "lucide-react";
import { useToast } from "../ui/use-toast";

const FIELD_TYPES = [
  { value: "string", label: "Text" },
  { value: "string_enum", label: "Text with Options" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
];

export function AddFieldSidebar({
  open,
  onClose,
  initialData,
  onSubmit,
  isLoading,
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fieldName: initialData?.fieldName || "",
    fieldType: initialData?.fieldType || "string",
    options: {
      required: initialData?.options?.required || false,
      enumValues: initialData?.options?.enumValues || [],
      default: initialData?.options?.default || "",
      minlength: initialData?.options?.minlength || "",
      maxlength: initialData?.options?.maxlength || "",
      min: initialData?.options?.min || "",
      max: initialData?.options?.max || "",
    },
  });
  const [error, setError] = useState("");

  const handleFieldNameChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      fieldName: e.target.value,
    }));
    if (error) setError("");
  };

  const handleFieldTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      fieldType: value,
      options: {
        ...prev.options,
        enumValues: [],
        default: "",
      },
    }));
  };

  const handleRequiredChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        required: checked,
      },
    }));
  };

  const handleEnumValueAdd = (value) => {
    if (value && !formData.options.enumValues.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          enumValues: [...prev.options.enumValues, value],
        },
      }));
    }
  };

  const handleEnumValueRemove = (valueToRemove) => {
    setFormData((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        enumValues: prev.options.enumValues.filter(
          (value) => value !== valueToRemove
        ),
      },
    }));
  };

  const handleOptionChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        [key]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fieldName.trim()) {
      setError("Field name is required");
      return;
    }

    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(formData.fieldName)) {
      setError(
        "Field name must start with a letter and contain only letters and numbers"
      );
      return;
    }

    // Transform data to match API format
    const submitData = {
      fieldName: formData.fieldName,
      fieldType:
        formData.fieldType === "string_enum" ? "string" : formData.fieldType,
      options: {
        required: formData.options.required,
      },
    };

    // Add enum values if they exist for string_enum type
    if (
      formData.fieldType === "string_enum" &&
      formData.options.enumValues?.length > 0
    ) {
      submitData.options.enum = formData.options.enumValues;
    }

    // Add default value if it exists and is not empty
    if (
      formData.options.default !== undefined &&
      formData.options.default !== ""
    ) {
      submitData.options.default =
        formData.fieldType === "boolean"
          ? Boolean(formData.options.default)
          : formData.options.default;
    }

    // Add validation options based on field type
    if (
      formData.fieldType === "string" ||
      formData.fieldType === "string_enum"
    ) {
      if (formData.options.minlength) {
        submitData.options.minlength = parseInt(formData.options.minlength);
      }
      if (formData.options.maxlength) {
        submitData.options.maxlength = parseInt(formData.options.maxlength);
      }
    }

    if (formData.fieldType === "number") {
      if (formData.options.min) {
        submitData.options.min = parseFloat(formData.options.min);
      }
      if (formData.options.max) {
        submitData.options.max = parseFloat(formData.options.max);
      }
      if (formData.options.default) {
        submitData.options.default = parseFloat(formData.options.default);
      }
    }

    if (formData.fieldType === "date") {
      if (formData.options.min) {
        submitData.options.min = formData.options.min;
      }
      if (formData.options.max) {
        submitData.options.max = formData.options.max;
      }
    }

    try {
      onSubmit(submitData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save field",
        variant: "destructive",
      });
    }
  };

  return (
    <RightSidebar
      open={open}
      onClose={onClose}
      title={initialData ? "Edit Field" : "Add New Field"}
      description={
        initialData
          ? "Modify field properties"
          : "Add a new field to your schema"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Field Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Field Name
            <span className="text-destructive ml-1">*</span>
          </label>
          <Input
            value={formData.fieldName}
            onChange={handleFieldNameChange}
            disabled={initialData}
            placeholder="e.g., firstName"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {/* Field Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Field Type
            <span className="text-destructive ml-1">*</span>
          </label>
          <Select
            disabled={initialData}
            value={formData.fieldType}
            onValueChange={handleFieldTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select field type" />
            </SelectTrigger>
            <SelectContent>
              {FIELD_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Basic Options */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Field Options</h4>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={formData.options.required}
              onCheckedChange={handleRequiredChange}
            />
            <label htmlFor="required" className="text-sm font-medium">
              Required Field
            </label>
          </div>
        </div>

        {/* Type Specific Options */}
        {formData.fieldType === "string" && (
          <div className="space-y-4">
            <Input
              type="text"
              value={formData.options.default || ""}
              onChange={(e) => handleOptionChange("default", e.target.value)}
              placeholder="Default Value"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Length</label>
                <Input
                  type="number"
                  value={formData.options.minlength || ""}
                  onChange={(e) =>
                    handleOptionChange("minlength", e.target.value)
                  }
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Length</label>
                <Input
                  type="number"
                  value={formData.options.maxlength || ""}
                  onChange={(e) =>
                    handleOptionChange("maxlength", e.target.value)
                  }
                  min={0}
                />
              </div>
            </div>
          </div>
        )}

        {formData.fieldType === "string_enum" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Option</label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter option value"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleEnumValueAdd(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={(e) => {
                    const input = e.target.previousSibling;
                    handleEnumValueAdd(input.value);
                    input.value = "";
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Options</label>
              <div className="space-y-2">
                {formData.options.enumValues.map((value) => (
                  <div
                    key={value}
                    className="flex items-center justify-between px-3 py-2 bg-muted rounded-md"
                  >
                    <span className="text-sm">{value}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEnumValueRemove(value)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Default Value</label>
              <Select
                value={formData.options.default || ""}
                onValueChange={(value) => handleOptionChange("default", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default value" />
                </SelectTrigger>
                <SelectContent>
                  {formData.options.enumValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {formData.fieldType === "number" && (
          <div className="space-y-4">
            <Input
              type="number"
              value={formData.options.default || ""}
              onChange={(e) => handleOptionChange("default", e.target.value)}
              placeholder="Default Value"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Value</label>
                <Input
                  type="number"
                  value={formData.options.min || ""}
                  onChange={(e) => handleOptionChange("min", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Value</label>
                <Input
                  type="number"
                  value={formData.options.max || ""}
                  onChange={(e) => handleOptionChange("max", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {formData.fieldType === "date" && (
          <div className="space-y-4">
            <Input
              type="date"
              value={formData.options.default || ""}
              onChange={(e) => handleOptionChange("default", e.target.value)}
              placeholder="Default Value"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Date</label>
                <Input
                  type="date"
                  value={formData.options.min || ""}
                  onChange={(e) => handleOptionChange("min", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Date</label>
                <Input
                  type="date"
                  value={formData.options.max || ""}
                  onChange={(e) => handleOptionChange("max", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {formData.fieldType === "boolean" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="defaultValue"
              checked={formData.options.default || false}
              onCheckedChange={(checked) =>
                handleOptionChange("default", checked)
              }
            />
            <label htmlFor="defaultValue" className="text-sm font-medium">
              Default Value
            </label>
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Field" : "Add Field"}
          </Button>
        </div>
      </form>
    </RightSidebar>
  );
}
