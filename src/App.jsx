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

// Hooks
import { usePWA } from "@/hooks/usePWA";
import usePageTracking from "@/hooks/usePageTracking";

// Config & Utils
import { auth } from "@/config/firebase";
import { getUserRole, ROLES } from "@/utils/roleUtils";

// Store
import useAuthStore from "@/store/authStore";

// Components
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Alert } from "@/components/ui/Alert";
import { Toast } from "@/components/ui/Toast";
import { OfflineBanner } from "@/components/OfflineBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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

// Protected Route Component with Role-Based Access Control
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { user, role, loading } = useAuthStore();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, role } = useAuthStore();
  const location = useLocation();

  if (user && role) {
    const destination = location.state?.from || `/${role}/dashboard`;
    return <Navigate to={destination} replace />;
  }

  return children;
};

// Unauthorized Access Component
const UnauthorizedAccess = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full px-4">
      <Alert
        type="error"
        title="Unauthorized Access"
        message="You don't have permission to access this page."
        action={{
          label: "Go Back",
          onClick: () => window.history.back(),
        }}
      />
    </div>
  </div>
);

function App() {
  const { isOnline, isUpdateAvailable, updateServiceWorker } = usePWA();
  const [authInitialized, setAuthInitialized] = React.useState(false);

  // Handle auth state changes
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const role = await getUserRole(user.uid);
          if (role) {
            useAuthStore.setState({
              user,
              role,
              loading: false,
              isInitialized: true,
            });
          } else {
            await auth.signOut();
            useAuthStore.setState({
              user: null,
              role: null,
              loading: false,
              isInitialized: true,
              error: "No role assigned to user",
            });
          }
        } else {
          useAuthStore.setState({
            user: null,
            role: null,
            loading: false,
            isInitialized: true,
          });
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        useAuthStore.setState({
          user: null,
          role: null,
          loading: false,
          isInitialized: true,
          error: error.message,
        });
      } finally {
        setAuthInitialized(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Show initial loading state
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
                <PublicRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <Login />
                  </Suspense>
                </PublicRoute>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
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
            <Route
              path="*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Route>

          {/* HR Routes */}
          <Route
            path="/hr"
            element={
              <ProtectedRoute allowedRoles={[ROLES.HR]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/hr/dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <HRDashboard />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/hr/dashboard" replace />} />
          </Route>

          {/* Vendor Routes */}
          <Route
            path="/vendor"
            element={
              <ProtectedRoute allowedRoles={[ROLES.VENDOR]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<Navigate to="/vendor/dashboard" replace />}
            />
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <VendorDashboard />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={<Navigate to="/vendor/dashboard" replace />}
            />
          </Route>

          {/* Sales Routes */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SALES]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/sales/dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <SalesDashboard />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={<Navigate to="/sales/dashboard" replace />}
            />
          </Route>

          {/* Special Routes */}
          <Route path="/unauthorized" element={<UnauthorizedAccess />} />

          {/* Root redirect */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  useAuthStore.getState().user && useAuthStore.getState().role
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
