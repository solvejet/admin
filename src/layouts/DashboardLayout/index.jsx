// src/layouts/DashboardLayout/index.jsx
import { memo, useCallback, Suspense } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import useAuthStore from "@/store/authStore";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const role = useAuthStore((state) => state.role);

  const handleSignOut = useCallback(async () => {
    const result = await signOut();
    if (result.success) {
      navigate("/login");
    }
  }, [signOut, navigate]);

  return (
    <>
      <Helmet>
        <title>Dashboard | SolveJet Admin</title>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Topbar role={role} onSignOut={handleSignOut} />
        <main className="flex-grow container mx-auto px-4 py-6 pt-24 pb-24 sm:px-6 lg:px-8">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DashboardLayout;
