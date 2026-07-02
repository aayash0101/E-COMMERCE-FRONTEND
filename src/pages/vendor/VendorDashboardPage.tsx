import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "@/api/products";
import { ordersApi } from "@/api/orders";
import type { Product, Order } from "@/types";
import Spinner from "@/components/ui/Spinner";

interface StatCardProps {
  label: string;
  value: string;
  accent?: string;
}

const StatCard = ({ label, value, accent = "text-gray-900" }: StatCardProps) => (
  <div className="rounded-xl border border-gray-200 p-5">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className={`mt-2 text-2xl font-semibold ${accent}`}>{value}</p>
  </div>
);

const VendorDashboardPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([productsApi.getMine(), ordersApi.getVendorOrders()])
      .then(([p, o]) => {
        setProducts(p);
        setOrders(o);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => {
    return (
      sum +
      order.items
        .filter((item) => item.itemStatus === "delivered")
        .reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
    );
  }, 0);

  const pendingItemsCount = orders.reduce(
    (count, order) =>
      count + order.items.filter((item) => item.itemStatus === "pending").length,
    0
  );

  const lowStockProducts = products.filter((p) => p.stock <= 5 && p.stock > 0);
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        Vendor Dashboard
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Products" value={String(products.length)} />
        <StatCard
          label="Revenue (Delivered)"
          value={`$${totalRevenue.toFixed(2)}`}
          accent="text-green-600"
        />
        <StatCard
          label="Pending Items"
          value={String(pendingItemsCount)}
          accent="text-amber-600"
        />
        <StatCard
          label="Out of Stock"
          value={String(outOfStockCount)}
          accent={outOfStockCount > 0 ? "text-red-600" : "text-gray-900"}
        />
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">
            {lowStockProducts.length} product
            {lowStockProducts.length !== 1 ? "s" : ""} running low on stock
          </p>
          <ul className="mt-2 space-y-1">
            {lowStockProducts.map((p) => (
              <li key={p.id} className="text-sm text-amber-700">
                {p.name} — {p.stock} left
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link
          to="/vendor/products"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          Manage Products
        </Link>
        <Link
          to="/vendor/orders"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default VendorDashboardPage;