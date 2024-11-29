// src/components/ErrorBoundary.jsx
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/Button";

export const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
          Something went wrong
        </h2>
        <pre className="text-sm text-gray-500 dark:text-gray-400 overflow-auto">
          {error.message}
        </pre>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </div>
  </div>
);

export const ErrorBoundary = ({ children }) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ReactErrorBoundary>
);
