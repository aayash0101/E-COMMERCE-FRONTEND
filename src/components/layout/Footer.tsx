import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Marketplace
            </span>
            <p className="mt-2.5 text-sm text-gray-500">
              Shop from independent vendors, all in one place.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              <li>
                <Link to="/products" className="transition hover:text-ink">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/orders" className="transition hover:text-ink">
                  Track an Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Sell
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              <li>
                <Link to="/vendor/apply" className="transition hover:text-ink">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link to="/vendor/dashboard" className="transition hover:text-ink">
                  Vendor Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              <li>
                <Link to="/about" className="transition hover:text-ink">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-ink">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;