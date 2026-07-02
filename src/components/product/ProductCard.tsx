import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { getImageUrl } from "@/utils/getImageUrl";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        {product.images[0] ? (
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            No image
          </div>
        )}
      </div>
      <div className="p-3.5">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-gray-400">
          {product.categoryId?.name}
        </p>
        <h3 className="mt-1 truncate text-sm font-medium text-gray-900">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.reviewCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg
                className="h-3.5 w-3.5 fill-amber-400"
                viewBox="0 0 20 20"
              >
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
              </svg>
              {product.averageRating.toFixed(1)} ({product.reviewCount})
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;