// src/components/ui/Toast.jsx
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Add proper types for toast variants
const variants = {
  info: "bg-blue-500/80 dark:bg-blue-600/80",
  success: "bg-green-500/80 dark:bg-green-600/80",
  warning: "bg-yellow-500/80 dark:bg-yellow-600/80",
  error: "bg-red-500/80 dark:bg-red-600/80",
};

export function Toast({
  message,
  type = "info",
  duration = 5000,
  action,
  onClose,
  className,
}) {
  return (
    <ToastPrimitive.Provider>
      <ToastPrimitive.Root
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg p-4 shadow-lg transition-all",
          variants[type],
          "backdrop-blur-sm",
          className
        )}
      >
        <div className="flex items-center gap-4">
          <ToastPrimitive.Description className="text-sm font-medium text-white">
            {message}
          </ToastPrimitive.Description>
        </div>
        {action && (
          <ToastPrimitive.Action altText={action.label} asChild>
            <button
              className="inline-flex items-center justify-center rounded px-3 py-1 text-xs font-medium text-white bg-white/20 hover:bg-white/30 transition-colors"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          </ToastPrimitive.Action>
        )}
        <ToastPrimitive.Close
          className="absolute right-2 top-2 rounded-md p-1 text-white/80 opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-auto max-w-[420px]" />
    </ToastPrimitive.Provider>
  );
}