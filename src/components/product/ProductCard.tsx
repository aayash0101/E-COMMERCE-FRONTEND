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
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-900/[0.06]"
    >
      <div className="aspect-square overflow-hidden bg-gray-50">
        {product.images[0] ? (
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {product.categoryId?.name}
        </p>
        <h3 className="mt-1.5 truncate text-[15px] font-medium text-ink">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            ${product.price.toFixed(2)}
          </span>
          {product.reviewCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="h-3.5 w-3.5 fill-amber-400" viewBox="0 0 20 20">
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
              </svg>
              {product.averageRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;