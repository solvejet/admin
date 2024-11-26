// src/components/error-boundary.jsx
import React from "react";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

class ErrorBoundaryFallback extends React.Component {
  render() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 text-2xl font-bold text-foreground">
              Oops! Something went wrong
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {this.props.error?.message || "An unexpected error occurred"}
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
              <Button onClick={() => (window.location.href = "/")}>
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 text-left">
                <details className="text-xs text-muted-foreground">
                  <summary className="cursor-pointer">Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap rounded bg-muted p-4">
                    {this.props.error?.stack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error caught by boundary:", error, errorInfo);

    // If you're using an error reporting service like Sentry
    // Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
