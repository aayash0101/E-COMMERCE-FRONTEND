import { useEffect, useState } from "react";
import { productsApi } from "@/api/products";
import type { Product } from "@/types";
import { getImageUrl } from "@/utils/getImageUrl";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import ProductFormModal from "@/components/vendor/ProductFormModal";

const statusColors: Record<Product["status"], string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  flagged: "bg-red-100 text-red-700",
};

const VendorProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = () => {
    setIsLoading(true);
    productsApi
      .getMine()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await productsApi.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Products</h1>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-500">
          You haven't listed any products yet.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
                      {product.images[0] && (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[product.status]}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setModalOpen(true);
                      }}
                      className="mr-3 text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      {deletingId === product.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={loadProducts}
        product={editingProduct}
      />
    </div>
  );
};

export default VendorProductsPage;