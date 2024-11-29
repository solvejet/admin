import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import * as Form from "@radix-ui/react-form";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_ROUTES } from "@/utils/roleUtils";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import SolvejetLogo from "@/components/SolveJetLogo";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <SolvejetLogo className="h-12 w-auto" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-md rounded-lg sm:px-10">
            <Form.Root onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Form.Field className="space-y-2" name="email">
                  <Form.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </Form.Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      <Mail className="h-5 w-5" />
                    </div>
                    <Form.Control asChild>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white pl-11 pr-3 py-3 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                      />
                    </Form.Control>
                  </div>
                  <Form.Message
                    match="valueMissing"
                    className="text-sm text-red-500"
                  >
                    Please enter your email
                  </Form.Message>
                  <Form.Message
                    match="typeMismatch"
                    className="text-sm text-red-500"
                  >
                    Please enter a valid email
                  </Form.Message>
                </Form.Field>
              </div>

              <div>
                <Form.Field className="space-y-2" name="password">
                  <Form.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Form.Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      <Lock className="h-5 w-5" />
                    </div>
                    <Form.Control asChild>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white pl-11 pr-12 py-3 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                      />
                    </Form.Control>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <Form.Message
                    match="valueMissing"
                    className="text-sm text-red-500"
                  >
                    Please enter your password
                  </Form.Message>
                </Form.Field>
              </div>

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
                    className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {error && (
                <Alert
                  type="error"
                  message={error}
                  className="animate-in fade-in slide-in-from-top-2"
                />
              )}

              <Form.Submit asChild>
                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  className="flex justify-center py-3"
                >
                  Sign in
                </Button>
              </Form.Submit>
            </Form.Root>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
