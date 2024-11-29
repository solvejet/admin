// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Form from "@radix-ui/react-form";
import { Lock, Mail, Loader2, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_ROUTES } from "@/utils/roleUtils";
import { Alert } from "@/components/ui/Alert";

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
      <Icon className="h-5 w-5" />
    </div>
    <input
      {...props}
      className="w-full rounded-lg border border-gray-200 bg-white px-11 py-3.5 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
    />
  </div>
);

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);
      if (result.success) {
        const redirectTo =
          location.state?.from || ROLE_ROUTES[result.role] || "/";
        navigate(redirectTo, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            SolveJet Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm dark:bg-gray-800">
          <Form.Root onSubmit={handleSubmit} className="space-y-6">
            <Form.Field name="email">
              <Form.Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email address
              </Form.Label>
              <Form.Control asChild>
                <Input
                  type="email"
                  icon={Mail}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter your email"
                  required
                />
              </Form.Control>
              <Form.Message
                match="valueMissing"
                className="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                Please enter your email
              </Form.Message>
              <Form.Message
                match="typeMismatch"
                className="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                Please enter a valid email
              </Form.Message>
            </Form.Field>

            <Form.Field name="password">
              <Form.Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </Form.Label>
              <Form.Control asChild>
                <Input
                  type="password"
                  icon={Lock}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter your password"
                  required
                />
              </Form.Control>
              <Form.Message
                match="valueMissing"
                className="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                Please enter your password
              </Form.Message>
            </Form.Field>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <Alert
                type="error"
                message={error}
                className="animate-in fade-in slide-in-from-top-2"
              />
            )}

            <Form.Submit asChild>
              <button
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </Form.Submit>
          </Form.Root>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} SolveJet. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
