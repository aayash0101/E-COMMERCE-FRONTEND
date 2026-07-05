import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "@/api/products";
import type { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import Spinner from "@/components/ui/Spinner";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    productsApi
      .list({ limit: 8, sortBy: "-createdAt" })
      .then((result) => {
        if (active) setProducts(result.products);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Shop thousands of
            <br />
            independent sellers
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] text-gray-300">
            One marketplace, every kind of store. Find something you'll love.
          </p>
          <Link
            to="/products"
            className="mt-10 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-gray-100"
          >
            Browse all products
          </Link>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            New arrivals
          </h2>
          <Link
            to="/products"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            No products available yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;