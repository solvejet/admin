// src/components/ui/LoadingSpinner.jsx
import * as Progress from "@radix-ui/react-progress";

export const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <Progress.Root className={`relative rounded-full ${sizeClasses[size]}`}>
      <Progress.Indicator
        className="absolute inset-0 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"
        style={{ transform: "translateZ(0)" }}
      />
    </Progress.Root>
  );
};
