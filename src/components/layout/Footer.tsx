import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-bold text-primary-600">
              Marketplace
            </span>
            <p className="mt-2 text-sm text-gray-500">
              Shop from independent vendors, all in one place.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Shop</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/products" className="hover:text-gray-900">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-gray-900">
                  Track an Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Sell</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/vendor/apply" className="hover:text-gray-900">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link to="/vendor/dashboard" className="hover:text-gray-900">
                  Vendor Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/about" className="hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;