// src/components/layout.jsx
import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  Users,
  Shield,
  UserCircle,
  BellRing,
  Search,
  Layers,
  MessagesSquare,
} from "lucide-react";
import { useAuth } from "./auth-provider";
import { ThemeToggle } from "./theme-toggle";
import { selectCurrentUser } from "../lib/features/authSlice";
import { cn } from "../lib/utils";

const MainNav = ({ items, className, ...props }) => {
  const location = useLocation();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            location.pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

const SidebarItem = ({ icon: Icon, title, href, isActive }) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-x-2 text-sm font-semibold rounded-lg px-3 py-2 transition-colors",
      isActive
        ? "bg-primary/10 text-primary hover:bg-primary/15"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    <Icon className="h-5 w-5" />
    {title}
  </Link>
);

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const mainMenuItems = [
    { title: "Overview", href: "/" },
    { title: "Customers", href: "/customers" },
    { title: "Analytics", href: "/analytics" },
    { title: "Reports", href: "/reports" },
  ];

  const sidebarItems = [
    { icon: LayoutDashboard, title: "Dashboard", href: "/" },
    { icon: Users, title: "Users", href: "/users" },
    { icon: Shield, title: "Roles", href: "/roles" },
    { icon: Layers, title: "Groups", href: "/groups" },
    { icon: MessagesSquare, title: "Messages", href: "/messages" },
  ];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">
                Pixe Admin
              </span>
            </Link>
            <MainNav items={mainMenuItems} />
          </div>
          <button
            className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </button>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-muted rounded-full"
            >
              <Search className="h-5 w-5" />
            </button>

            <button className="p-2 hover:bg-muted rounded-full relative">
              <BellRing className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </button>

            <ThemeToggle />

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-full bg-muted p-2"
              >
                <UserCircle className="h-6 w-6" />
                <span className="hidden text-sm font-medium md:inline-block">
                  {user?.username}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-card p-1 shadow-lg">
                  <div className="p-2">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <div className="h-px bg-muted my-1" />
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-2 rounded-md p-2 text-sm hover:bg-muted"
                  >
                    <User className="h-4 w-4" />
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 rounded-md p-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transition-transform duration-300 ease-in-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center border-b px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-muted rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              isActive={location.pathname === item.href}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="container py-6">
          <Outlet />
        </main>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="fixed top-[20%] w-full max-w-2xl rounded-lg border bg-card p-6 shadow-lg sm:top-[15%]">
            <div className="flex items-center border-b pb-4">
              <Search className="h-5 w-5 mr-2" />
              <input
                type="search"
                placeholder="Search anything..."
                className="flex-1 bg-transparent focus:outline-none"
                autoFocus
              />
              <kbd className="hidden pointer-events-none select-none rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground sm:inline-block">
                ESC
              </kbd>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                No recent searches
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
