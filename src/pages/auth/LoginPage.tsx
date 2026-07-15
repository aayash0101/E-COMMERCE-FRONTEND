import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { login } from "@/features/auth/authSlice";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError("Please enter your email and password.");
      return;
    }

    const result = await dispatch(login({ email: email.trim(), password }));

    if (login.fulfilled.match(result)) {
      const role = result.payload.user.role;
      const from = (location.state as { from?: string })?.from;

      if (from) {
        navigate(from, { replace: true });
      } else if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "vendor") {
        navigate("/vendor/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Form column */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:w-1/2 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight text-ink">
            Marketplace
          </Link>

          <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue shopping or manage your store.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
                placeholder="••••••••"
              />
            </div>

            {(formError || error) && (
              <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                {formError || error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Brand column */}
      <div className="hidden bg-ink sm:flex sm:w-1/2 sm:items-center sm:justify-center">
        <div className="max-w-md px-12 text-white">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight">
            One marketplace, thousands of sellers.
          </h2>
          <p className="mt-4 text-gray-300">
            Buy from independent vendors, or sign in to manage your own
            storefront orders, inventory, and revenue, all in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;