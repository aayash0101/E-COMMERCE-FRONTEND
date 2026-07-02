import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { vendorsApi } from "@/api/vendors";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const VendorApplyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user?.role === "vendor") {
    navigate("/vendor/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (storeName.trim().length < 2) {
      setError("Store name must be at least 2 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await vendorsApi.apply({
        storeName: storeName.trim(),
        storeDescription: storeDescription.trim() || undefined,
      });
      navigate("/vendor/dashboard", { replace: true });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Become a Vendor
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Tell us about your store. An admin will review your application
        shortly.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          label="Store name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="e.g. Aayash's Electronics"
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Store description (optional)
          </label>
          <textarea
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="What do you sell?"
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Submit Application
        </Button>
      </form>
    </div>
  );
};

export default VendorApplyPage;