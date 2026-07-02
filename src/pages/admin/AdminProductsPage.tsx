import { useEffect, useState } from "react";
import { adminApi, type AdminProduct } from "@/api/admin";
import Spinner from "@/components/ui/Spinner";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  flagged: "bg-red-100 text-red-700",
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadProducts = () => {
    setIsLoading(true);
    adminApi
      .getAllProducts()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleFlagToggle = async (product: AdminProduct) => {
    setBusyId(product.id);
    try {
      const updated =
        product.status === "flagged"
          ? await adminApi.unflagProduct(product.id)
          : await adminApi.flagProduct(product.id);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Permanently delete this product?")) return;
    setBusyId(productId);
    try {
      await adminApi.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Products</h1>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {typeof product.vendorId === "string"
                    ? product.vendorId
                    : product.vendorId.storeName}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {typeof product.categoryId === "string"
                    ? product.categoryId
                    : product.categoryId.name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[product.status]}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleFlagToggle(product)}
                    disabled={busyId === product.id}
                    className="mr-3 text-xs font-medium text-amber-600 hover:text-amber-700 disabled:opacity-50"
                  >
                    {product.status === "flagged" ? "Unflag" : "Flag"}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={busyId === product.id}
                    className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsPage;