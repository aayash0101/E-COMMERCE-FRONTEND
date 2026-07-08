import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "@/api/orders";
import type { Order } from "@/types";
import Spinner from "@/components/ui/Spinner";

const paymentStatusColors: Record<Order["paymentStatus"], string> = {
  pending: "text-amber-600",
  paid: "text-green-600",
  failed: "text-red-600",
  refunded: "text-gray-500",
};

interface DeliveryStatus {
  label: string;
  color: string;
}

const getDeliveryStatus = (order: Order): DeliveryStatus => {
  const statuses = order.items.map((item) => item.itemStatus);

  if (statuses.every((s) => s === "delivered")) {
    return { label: "Delivered", color: "bg-green-100 text-green-700" };
  }
  if (statuses.every((s) => s === "cancelled")) {
    return { label: "Cancelled", color: "bg-red-100 text-red-700" };
  }
  if (statuses.some((s) => s === "shipped" || s === "delivered")) {
    return { label: "Shipped", color: "bg-blue-100 text-blue-700" };
  }
  return { label: "Processing", color: "bg-amber-100 text-amber-700" };
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
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="mt-12 text-center text-sm text-gray-500">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100">
          {orders.map((order) => {
            const delivery = getDeliveryStatus(order);
            return (
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
                    {order.items.length !== 1 ? "s" : ""} ·{" "}
                    <span className={paymentStatusColors[order.paymentStatus]}>
                      Payment {order.paymentStatus}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${delivery.color}`}
                  >
                    {delivery.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;