import { useEffect, useState, type FormEvent } from "react";
import type { Product } from "@/types";
import { productsApi, type ProductFormFields } from "@/api/products";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { categoriesApi, type CategoryOption } from "@/api/categories";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  product?: Product | null;
}

const emptyForm: ProductFormFields = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  categoryId: "",
};

const ProductFormModal = ({
  open,
  onClose,
  onSaved,
  product,
}: ProductFormModalProps) => {
  const isEdit = Boolean(product);

  const [form, setForm] = useState<ProductFormFields>(emptyForm);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId?.id ?? "",
      });
      setStatus(product.status === "flagged" ? "inactive" : product.status);
    } else {
      setForm(emptyForm);
      setStatus("active");
    }
    setImages([]);
    setError(null);
  }, [product, open]);
  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(() => setCategories([]));
  }, []);

  const updateField = <K extends keyof ProductFormFields>(
    field: K,
    value: ProductFormFields[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      form.name.trim().length < 3 ||
      form.description.trim().length < 10 ||
      form.price <= 0 ||
      form.stock < 0 ||
      !form.categoryId.trim()
    ) {
      setError("Please check all fields - name (3+ chars), description (10+ chars), price > 0, category ID required.");
      return;
    }

    if (!isEdit && images.length === 0) {
      setError("At least one product image is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit && product) {
        await productsApi.update(product.id, { ...form, status });
      } else {
        await productsApi.create(form, images);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Product" : "Add Product"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Product name"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => updateField("price", Number(e.target.value))}
          />
          <Input
            label="Stock"
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => updateField("stock", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">Select a category…</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {isEdit && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "active" | "inactive")
              }
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}

        {!isEdit && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files ?? []))}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3.5 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
            />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;