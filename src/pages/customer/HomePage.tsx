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
      .list({ limit: 8, sortBy: "newest" })
      .then((result) => {
        if (active) setProducts(result.data);
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
      <section className="bg-primary-600">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Shop thousands of independent sellers
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-100">
            One marketplace, every kind of store. Find something you'll love.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
          >
            Browse all products
          </Link>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">New arrivals</h2>
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