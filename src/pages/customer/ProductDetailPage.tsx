import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { productsApi } from "@/api/products";
import { reviewsApi } from "@/api/reviews";
import type { Product, Review } from "@/types";
import { useAuth, useCart } from "@/hooks/useAuth";
import { addToCart } from "@/features/cart/cartSlice";
import { getImageUrl } from "@/utils/getImageUrl";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import ReviewList from "@/components/product/ReviewList";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { dispatch: cartDispatch, isLoading: cartLoading } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadReviews = () => {
    if (!id) return;
    reviewsApi
      .getProductReviews(id)
      .then(setReviews)
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    if (!id) return;
    let active = true;
    setIsLoading(true);

    productsApi
      .getById(id)
      .then((data) => {
        if (active) setProduct(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    loadReviews();

    return () => {
      active = false;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    await cartDispatch(addToCart({ productId: product.id, quantity }));
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">Product not found.</p>
      </div>
    );
  }

  const canAddToCart = !user || user.role === "customer";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-gray-50">
            {product.images[activeImage] ? (
              <img
                src={getImageUrl(product.images[activeImage])}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300">
                No image
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                    activeImage === i ? "border-primary-600" : "border-transparent"
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {product.categoryId?.name}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
            {product.name}
          </h1>

          {product.reviewCount > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
              <svg className="h-4 w-4 fill-amber-400" viewBox="0 0 20 20">
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
              </svg>
              {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
            </div>
          )}

          <p className="mt-4 font-display text-4xl font-bold tracking-tight text-ink">
            ${product.price.toFixed(2)}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>

          <p className="mt-4 text-sm text-gray-500">
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </p>

          {canAddToCart && (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-gray-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                isLoading={cartLoading}
                disabled={product.stock === 0}
              >
                {addedMessage ? "Added!" : "Add to Cart"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
          Reviews {product.reviewCount > 0 && `(${product.reviewCount})`}
        </h2>
        <div className="mt-6">
          <ReviewList reviews={reviews} onChanged={loadReviews} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;