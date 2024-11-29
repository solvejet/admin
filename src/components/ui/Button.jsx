// src/components/ui/Button.jsx
import { Button as RadixButton } from "@radix-ui/themes";
import { LoadingSpinner } from "./LoadingSpinner";
import { cn } from "@/lib/utils";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  ...props
}) => {
  // Map our variants to Radix UI Theme colors and variants
  const variantStyles = {
    primary:
      "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600",
    secondary:
      "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600",
    outline:
      "border border-gray-300 dark:border-gray-600 bg-transparent dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800",
    destructive:
      "bg-red-600 dark:bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-700",
  };

  // Map sizes to Tailwind classes
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const buttonClasses = cn(
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          <span className="ml-2">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
