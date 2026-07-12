import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ordersApi } from "@/api/orders";
import type { Order } from "@/types";
import { getImageUrl } from "@/utils/getImageUrl";
import { redirectToEsewa } from "@/utils/esewaRedirect";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import ReviewFormModal from "@/components/product/ReviewFormModal";
import CancelOrderModal from "@/components/product/CancelOrderModal";

const itemStatusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<{
    productId: string;
    productName: string;
  } | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const loadOrder = () => {
    if (!id) return;
    ordersApi
      .getOrderById(id)
      .then(setOrder)
      .catch((err: unknown) => {
        const e = err as { response?: { status?: number; data?: { message?: string } } };
        if (e.response?.status === 403) {
          setErrorMessage("You don't have access to this order.");
        } else if (e.response?.status === 404) {
          setErrorMessage("Order not found.");
        } else {
          setErrorMessage(e.response?.data?.message ?? "Failed to load order.");
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePayWithEsewa = async () => {
    if (!order) return;
    setIsPaying(true);
    try {
      const { paymentUrl, fields } = await ordersApi.initiateEsewaPayment(order.id);
      redirectToEsewa(paymentUrl, fields);
    } catch {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">{errorMessage ?? "Order not found."}</p>
      </div>
    );
  }

  const canCancel = order.items.every((item) => item.itemStatus === "pending");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          {order.paymentMethod === "esewa" && order.paymentStatus === "pending" && (
            <Button onClick={handlePayWithEsewa} isLoading={isPaying}>
              Pay with eSewa
            </Button>
          )}
          {canCancel && (
            <Button variant="outline" onClick={() => setCancelModalOpen(true)}>
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {order.cancellationReason && (
        <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            This order was cancelled
            {order.cancelledAt &&
              ` on ${new Date(order.cancelledAt).toLocaleDateString()}`}
          </p>
          <p className="mt-1 text-sm text-red-600">
            Reason: {order.cancellationReason}
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {item.productId?.images?.[0] && (
                  <img
                    src={getImageUrl(item.productId.images[0])}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Qty {item.quantity} · ${item.price.toFixed(2)} each
                </p>
                {item.itemStatus === "delivered" && (
                  <button
                    onClick={() =>
                      setReviewTarget({
                        productId: item.productId.id,
                        productName: item.name,
                      })
                    }
                    className="mt-1.5 text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    Write a review
                  </button>
                )}
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${itemStatusColors[item.itemStatus]}`}
              >
                {item.itemStatus}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Shipping Address
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 && (
                <>
                  <br />
                  {order.shippingAddress.addressLine2}
                </>
              )}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
              <br />
              {order.shippingAddress.phone}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Payment
            </h2>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>Method</span>
              <span className="capitalize">
                {order.paymentMethod.replace(/_/g, " ")}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-sm text-gray-600">
              <span>Status</span>
              <span className="capitalize">{order.paymentStatus}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {reviewTarget && (
        <ReviewFormModal
          open={Boolean(reviewTarget)}
          onClose={() => setReviewTarget(null)}
          onSubmitted={() => {
            /* Could show a toast here; kept silent for now */
          }}
          productId={reviewTarget.productId}
          productName={reviewTarget.productName}
          orderId={order.id}
        />
      )}

      <CancelOrderModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onCancelled={loadOrder}
        orderId={order.id}
      />
    </div>
  );
};

export default OrderDetailPage;