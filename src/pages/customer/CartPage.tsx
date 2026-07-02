import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useAuth";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
} from "@/features/cart/cartSlice";
import { getImageUrl } from "@/utils/getImageUrl";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, isLoading, dispatch } = useCart();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (isLoading && !cart) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">Your cart is empty.</p>
        <Link
          to="/products"
          className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Your Cart</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
            {cart.items.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.product.image && (
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        dispatch(removeFromCart(item.product.id))
                      }
                      className="text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-gray-300">
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          dispatch(
                            updateCartItem({
                              productId: item.product.id,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        disabled={item.quantity >= item.product.stock}
                        onClick={() =>
                          dispatch(
                            updateCartItem({
                              productId: item.product.id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="h-fit rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>Items ({cart.totalItems})</span>
            <span>${cart.totalAmount.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>${cart.totalAmount.toFixed(2)}</span>
          </div>
          <Button
            fullWidth
            className="mt-5"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;