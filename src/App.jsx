import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { Helmet } from "react-helmet-async";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Hooks
import { usePWA } from "@/hooks/usePWA";
import { useAuth } from "@/hooks/useAuth";
import usePageTracking from "@/hooks/usePageTracking";

// Config & Utils
import { auth } from "@/config/firebase";
import { getUserRole } from "@/utils/roleUtils";

// Store
import useAuthStore from "@/store/authStore";

// Components
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Alert } from "@/components/ui/Alert";
import { Toast } from "@/components/ui/Toast";
import { OfflineBanner } from "@/components/OfflineBanner";

// Layouts
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));

// Pages
const Login = lazy(() => import("@/pages/auth/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminManagement = lazy(() => import("@/pages/admin/AdminManagement"));
const HRDashboard = lazy(() => import("@/pages/hr/Dashboard"));
const VendorDashboard = lazy(() => import("@/pages/vendor/Dashboard"));
const SalesDashboard = lazy(() => import("@/pages/sales/Dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full px-4">
      <Alert
        type="error"
        title="Something went wrong"
        message={error.message}
        action={{
          label: "Try again",
          onClick: resetErrorBoundary,
        }}
      />
    </div>
  </div>
);

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <LoadingSpinner size="lg" />
  </div>
);

// Page Tracker Component
const PageTracker = () => {
  usePageTracking();
  return null;
};

// Protected Route Component (kept for future use)
const ProtectedRoute = ({ children, allowedRoles, title }) => {
  const { user, role, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user || !allowedRoles.includes(role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const { isOnline, isUpdateAvailable, updateServiceWorker } = usePWA();
  const { loading } = useAuthStore();

  // Handle auth state changes
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const role = await getUserRole(user.uid);
          useAuthStore.setState({ user, role, loading: false });
        } catch (error) {
          console.error("Error fetching user role:", error);
          useAuthStore.setState({ user: null, role: null, loading: false });
        }
      } else {
        useAuthStore.setState({ user: null, role: null, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <Helmet
          titleTemplate="%s | SolveJet Admin"
          defaultTitle="SolveJet Admin"
        />
        <PageTracker />

        {!isOnline && <OfflineBanner />}

        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Login />
                </Suspense>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <DashboardLayout />
              </Suspense>
            }
          >
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminDashboard />
                </Suspense>
              }
            />
            <Route
              path="manage"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminManagement />
                </Suspense>
              }
            />
          </Route>

          {/* HR Routes */}
          <Route
            path="/hr"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <DashboardLayout />
              </Suspense>
            }
          >
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <HRDashboard />
                </Suspense>
              }
            />
          </Route>

          {/* Vendor Routes */}
          <Route
            path="/vendor"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <DashboardLayout />
              </Suspense>
            }
          >
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <VendorDashboard />
                </Suspense>
              }
            />
          </Route>

          {/* Sales Routes */}
          <Route
            path="/sales"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <DashboardLayout />
              </Suspense>
            }
          >
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <SalesDashboard />
                </Suspense>
              }
            />
          </Route>

          {/* Root redirect */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  useAuthStore.getState().user
                    ? `/${useAuthStore.getState().role}/dashboard`
                    : "/login"
                }
                replace
              />
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>

        {/* PWA Update Notification */}
        {isUpdateAvailable && (
          <Toast
            message="New version available!"
            action={{
              label: "Update",
              onClick: updateServiceWorker,
            }}
          />
        )}
      </Router>
    </ErrorBoundary>
  );
}

export default App;
