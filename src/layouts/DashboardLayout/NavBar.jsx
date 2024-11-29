// src/layouts/DashboardLayout/NavBar.jsx
import { memo } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { UserMenu } from "./UserMenu";

export const NavBar = memo(({ onSignOut }) => (
  <nav className="bg-white dark:bg-gray-800 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              SolveJet
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserMenu onSignOut={onSignOut} />
        </div>
      </div>
    </div>
  </nav>
));

NavBar.displayName = "NavBar";
