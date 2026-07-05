import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useCart } from "@/hooks/useAuth";
import { logout } from "@/features/auth/authSlice";
import { fetchCart } from "@/features/cart/cartSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, dispatch } = useAuth();
  const { cart, dispatch: cartDispatch } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === "customer") {
      cartDispatch(fetchCart());
    }
  }, [isAuthenticated, user?.role, cartDispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    setUserMenuOpen(false);
    navigate("/login");
  };

  const cartCount = cart?.totalItems ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + primary nav */}
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="font-display text-xl font-bold tracking-tight text-ink"
          >
            Marketplace
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            <Link
              to="/products"
              className="text-[13px] font-medium tracking-wide text-gray-600 transition hover:text-ink"
            >
              ALL PRODUCTS
            </Link>
            {user?.role !== "vendor" && user?.role !== "admin" && (
              <Link
                to="/vendor/apply"
                className="text-[13px] font-medium tracking-wide text-gray-600 transition hover:text-ink"
              >
                SELL ON MARKETPLACE
              </Link>
            )}
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {user?.role === "customer" || !user ? (
            <Link
              to="/cart"
              className="relative rounded-full p-2.5 text-ink transition hover:bg-gray-100"
              aria-label="Cart"
            >
              <svg
                className="h-[22px] w-[22px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.792-4.798 1.996-7.377A1.09 1.09 0 0019.9 4.5H5.106M7.5 14.25L5.106 4.5M7.5 14.25L5.25 20.25M4.836 4.5H4.5"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          ) : null}

          {isAuthenticated && user ? (
            <div className="relative ml-1">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 text-sm font-medium text-ink transition hover:bg-gray-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.name}</span>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg shadow-gray-900/5">
                    {user.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {user.role === "vendor" && (
                      <Link
                        to="/vendor/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                      >
                        Vendor Dashboard
                      </Link>
                    )}
                    {user.role === "customer" && (
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                      >
                        My Orders
                      </Link>
                    )}
                    <div className="my-1 h-px bg-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-1 sm:flex">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-ink transition hover:bg-gray-100"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="ml-1 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-2.5 text-ink transition hover:bg-gray-100 md:hidden"
            aria-label="Menu"
          >
            <svg
              className="h-[22px] w-[22px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.6}
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              All Products
            </Link>
            {user?.role !== "vendor" && user?.role !== "admin" && (
              <Link
                to="/vendor/apply"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Sell on Marketplace
              </Link>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-primary-600 hover:bg-gray-100"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;