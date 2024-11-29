import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Bell,
  User,
  LogOut,
  Sun,
  Moon,
  Shield,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import SolvejetLogo from "@/components/SolveJetLogo";
import React from "react";
import { ROLES } from "@/utils/roleUtils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    name: "Manage Admins",
    href: "/admin/manage",
    icon: Shield,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: FileText,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    allowedRoles: [ROLES.ADMIN],
  },
];

export const Topbar = ({ onSignOut }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const [darkMode, setDarkMode] = React.useState(
    document.documentElement.classList.contains("dark")
  );
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", newMode);
  };

  const filteredNavItems = navigationItems.filter((item) =>
    item.allowedRoles.includes(role)
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-10">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <MenuIcon className="block h-6 w-6" />
                )}
              </button>
              <Link to="/" className="flex items-center ml-4 sm:ml-0">
                <SolvejetLogo className="h-8 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? "border-b-2 border-blue-600 text-gray-900 dark:text-white"
                        : "text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </button>

              {/* Notifications */}
              <button
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                aria-label="View notifications"
              >
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown continued */}
              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                      {user?.email}
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onSignOut}
                          className={`${
                            active ? "bg-gray-100 dark:bg-gray-600" : ""
                          } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition
          show={mobileMenuOpen}
          enter="transition duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/50 dark:border-blue-400 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    } block border-l-4 py-2 pl-3 pr-4 text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-4 h-5 w-5" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};
