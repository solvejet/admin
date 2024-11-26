// src/components/ui/right-sidebar.jsx
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const sidebarWidths = {
  sm: "w-full sm:w-[380px]",
  default: "w-full sm:w-[460px]",
  md: "w-full sm:w-[520px]",
  lg: "w-full sm:w-[620px]",
  xl: "w-full sm:w-[720px]",
};

export function RightSidebar({
  open,
  onClose,
  children,
  title,
  description,
  className,
  showClose = true,
  size = "default",
}) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 bg-background border-l",
          "transform transition-all duration-300 ease-in-out",
          sidebarWidths[size],
          className
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex flex-col border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{title}</h2>
              {showClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
