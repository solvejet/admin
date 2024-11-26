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
            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
            location.pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.icon && <item.icon className="h-4 w-4" />}
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

const MobileNav = ({ items, isOpen, onClose }) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden">
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <div className="flex items-center">
          <span className="font-bold">Pixe Admin</span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-md">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4">
        <nav className="flex flex-col space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                location.pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

const Layout = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
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

  const navigationItems = [
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
        setMobileNavOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4">
          {/* Top Bar */}
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Mobile menu button */}
              <button
                className="p-2 hover:bg-muted rounded-md md:hidden"
                onClick={() => setMobileNavOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <span className="font-bold">Pixe Admin</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex">
                <MainNav items={navigationItems} />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
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

              {/* Profile Dropdown */}
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
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        items={navigationItems}
        isOpen={isMobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Content */}
      <main className="container py-6 px-4">
        <Outlet />
      </main>

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
