// src/layouts/AuthLayout.jsx
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ThemeToggle from "@/components/ThemeToggle";

const AuthLayout = () => {
  return (
    <>
      <Helmet>
        <title>Sign In | SolveJet Admin</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ThemeToggle />
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AuthLayout;
