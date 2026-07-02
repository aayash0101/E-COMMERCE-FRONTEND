import { useEffect, useState } from "react";
import { adminApi } from "@/api/admin";
import { vendorsApi } from "@/api/vendors";
import type { VendorProfile } from "@/types";
import Spinner from "@/components/ui/Spinner";

const AdminVendorsPage = () => {
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadVendors = () => {
    setIsLoading(true);
    adminApi
      .getPendingVendors()
      .then(setVendors)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleApprove = async (id: string) => {
    setBusyId(id);
    try {
      await vendorsApi.approve(id);
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Reason for rejection (min 5 characters):");
    if (!reason || reason.trim().length < 5) return;

    setBusyId(id);
    try {
      await vendorsApi.reject(id, reason.trim());
      setVendors((prev) => prev.filter((v) => v.id !== id));
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
      <h1 className="text-2xl font-semibold text-gray-900">
        Pending Vendor Applications
      </h1>

      {vendors.length === 0 ? (
        <p className="mt-12 text-center text-sm text-gray-500">
          No pending applications.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="flex items-start justify-between rounded-xl border border-gray-200 p-5"
            >
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {vendor.storeName}
                </h2>
                {vendor.storeDescription && (
                  <p className="mt-1 max-w-xl text-sm text-gray-600">
                    {vendor.storeDescription}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  Applied {new Date(vendor.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-shrink-0 gap-2">
                <button
                  onClick={() => handleApprove(vendor.id)}
                  disabled={busyId === vendor.id}
                  className="rounded-lg bg-green-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(vendor.id)}
                  disabled={busyId === vendor.id}
                  className="rounded-lg border border-red-300 px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVendorsPage;