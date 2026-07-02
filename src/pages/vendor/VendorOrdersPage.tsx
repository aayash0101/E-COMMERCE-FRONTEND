import { useEffect, useState } from "react";
import { ordersApi } from "@/api/orders";
import type { Order, OrderItem } from "@/types";
import Spinner from "@/components/ui/Spinner";

const itemStatusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const nextStatusOptions: Record<string, OrderItem["itemStatus"][]> = {
  pending: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const VendorOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const loadOrders = () => {
    setIsLoading(true);
    ordersApi
      .getVendorOrders()
      .then(setOrders)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (
    orderId: string,
    itemId: string,
    status: OrderItem["itemStatus"]
  ) => {
    setUpdatingItemId(itemId);
    try {
      const updated = await ordersApi.updateItemStatus(orderId, itemId, status as "shipped" | "delivered" | "cancelled");
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o))
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-12 text-center text-sm text-gray-500">
          No orders yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Order #{order.id.slice(-8).toUpperCase()}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mt-3 divide-y divide-gray-100">
                {order.items.map((item) => {
                  const nextOptions = nextStatusOptions[item.itemStatus] ?? [];
                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty {item.quantity} · ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${itemStatusColors[item.itemStatus]}`}
                        >
                          {item.itemStatus}
                        </span>

                        {nextOptions.length > 0 && (
                          <select
                            value=""
                            disabled={updatingItemId === item._id}
                            onChange={(e) => {
                              if (e.target.value) {
                                handleStatusUpdate(
                                  order.id,
                                  item._id,
                                  e.target.value as OrderItem["itemStatus"]
                                );
                              }
                            }}
                            className="rounded-lg border border-gray-300 px-2 py-1 text-xs"
                          >
                            <option value="">Update status…</option>
                            {nextOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                Mark as {opt}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrdersPage;