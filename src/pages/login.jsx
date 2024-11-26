// src/pages/login.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/auth-provider";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";

const InputGroup = ({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  name,
  autoComplete,
  required = true,
  showPasswordToggle = false,
  onPasswordToggle,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <input
          type={type}
          name={name}
          id={name}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          className="w-full rounded-md border border-input bg-background px-11 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onPasswordToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {type === "password" ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);

    try {
      await login({
        username: formData.get("username"),
        password: formData.get("password"),
      });
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
      {/* Left Panel - Login Form */}
      <div className="relative flex items-center justify-center p-8 md:col-span-2 lg:col-span-1">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-[350px] space-y-6">
          {/* Logo */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Pixe Admin</h1>
            <p className="text-sm text-muted-foreground">
              Enterprise administration platform
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
              <div className="flex">
                <div className="flex-1 text-sm text-destructive">{error}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputGroup
              label="Username"
              icon={Mail}
              name="username"
              autoComplete="username"
              placeholder="Enter your username"
            />

            <InputGroup
              label="Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              showPasswordToggle
              onPasswordToggle={() => setShowPassword(!showPassword)}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="pt-4">
            <p className="px-8 text-center text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="relative hidden bg-muted md:col-span-1 md:block lg:col-span-1">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/10 to-background backdrop-blur-sm">
          <div className="flex h-full items-center justify-center p-8">
            <div className="space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome to Pixe Technologies
                </h2>
                <p className="text-muted-foreground">
                  Manage your Whatsapp Cloud API efficiently and securely
                </p>
              </div>

              {/* Feature List */}
              <div className="grid gap-4 pt-4">
                {[
                  "Latest Whatsapp Cloud API",
                  "User Management",
                  "Role-based Access",
                  "Advanced Analytics",
                  "Secure Infrastructure",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="rounded-lg bg-background/50 backdrop-blur-sm p-4 shadow-sm"
                  >
                    <p className="font-medium text-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
