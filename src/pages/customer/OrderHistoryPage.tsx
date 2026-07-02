import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "@/api/orders";
import type { Order } from "@/types";
import Spinner from "@/components/ui/Spinner";

const statusColors: Record<Order["paymentStatus"], string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .getMyOrders()
      .then(setOrders)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-12 text-center text-sm text-gray-500">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex items-center justify-between p-4 transition hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Order #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                  {order.items.length} item
                  {order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.paymentStatus]}`}
                >
                  {order.paymentStatus}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;