import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useAuth";
import { fetchCart, clearCartState } from "@/features/cart/cartSlice";
import { ordersApi, type PaymentMethod } from "@/api/orders";
import type { ShippingAddress } from "@/types";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const emptyAddress: ShippingAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  country: "",
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, isLoading, dispatch } = useCart();

  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash_on_delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cart) dispatch(fetchCart());
  }, [cart, dispatch]);

  useEffect(() => {
    if (!isLoading && cart && cart.items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [isLoading, cart, navigate]);

  const updateField = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const required: (keyof ShippingAddress)[] = [
      "fullName",
      "phone",
      "addressLine1",
      "city",
      "postalCode",
      "country",
    ];
    if (required.some((field) => !address[field]?.trim())) {
      setError("Please fill in all required address fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await ordersApi.placeOrder({
        shippingAddress: address,
        paymentMethod,
      });
      dispatch(clearCartState());
      navigate(`/orders/${order.id}`, { replace: true });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!cart) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-900">
            Shipping Address
          </h2>

          <Input
            label="Full name"
            value={address.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
          />
          <Input
            label="Phone"
            value={address.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
          <Input
            label="Address line 1"
            value={address.addressLine1}
            onChange={(e) => updateField("addressLine1", e.target.value)}
          />
          <Input
            label="Address line 2 (optional)"
            value={address.addressLine2}
            onChange={(e) => updateField("addressLine2", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={address.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
            <Input
              label="Postal code"
              value={address.postalCode}
              onChange={(e) => updateField("postalCode", e.target.value)}
            />
          </div>
          <Input
            label="Country"
            value={address.country}
            onChange={(e) => updateField("country", e.target.value)}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Payment method
            </label>
            <div className="space-y-2">
              {(
                [
                  { value: "cash_on_delivery", label: "Cash on Delivery" },
                  { value: "esewa", label: "eSewa" },
                  { value: "khalti", label: "Khalti" },
                ] as { value: PaymentMethod; label: string }[]
              ).map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2.5 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() => setPaymentMethod(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Place Order
          </Button>
        </form>

        {/* Summary */}
        <div className="h-fit rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900">Order Summary</h2>
          <div className="mt-4 space-y-2">
            {cart.items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between text-sm text-gray-600"
              >
                <span className="truncate pr-2">
                  {item.product.name} × {item.quantity}
                </span>
                <span>${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>${cart.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;