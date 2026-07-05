import { useEffect, useState } from "react";
import { adminApi, type AdminOrder } from "@/api/admin";
import Spinner from "@/components/ui/Spinner";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAllOrders()
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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        Orders
      </h1>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  #{order.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {typeof order.customerId === "string" ? (
                    order.customerId
                  ) : (
                    <>
                      <div>{order.customerId.name}</div>
                      <div className="text-xs text-gray-400">
                        {order.customerId.email}
                      </div>
                    </>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {order.items.length}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.paymentStatus]}`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;