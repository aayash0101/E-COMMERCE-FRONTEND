import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productsApi, type ProductSortBy } from "@/api/products";
import type { Product } from "@/types";
import type { PaginationMeta } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const search = searchParams.get("search") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sortBy = (searchParams.get("sortBy") as ProductSortBy) ?? "-createdAt";
  const page = Number(searchParams.get("page") ?? "1");

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    productsApi
      .list({
        search: search || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy,
        page,
        limit: 12,
      })
      .then((result) => {
        if (!active) return;
        setProducts(result.products);
        setMeta(result.meta);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search, minPrice, maxPrice, sortBy, page]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const goToPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        All Products
      </h1>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-end gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParam("search", searchInput);
          }}
          className="flex-1 min-w-[220px]"
        >
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
        </form>

        <div className="w-28">
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Min price
          </label>
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => updateParam("minPrice", e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
        </div>

        <div className="w-28">
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Max price
          </label>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => updateParam("maxPrice", e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
        </div>

        <div className="w-44">
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => updateParam("sortBy", e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
          >
            <option value="-createdAt">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-averageRating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            No products match your filters.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => goToPage(meta.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => goToPage(meta.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;