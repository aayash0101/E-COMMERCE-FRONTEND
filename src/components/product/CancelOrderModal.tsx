import { useState, type FormEvent } from "react";
import { ordersApi } from "@/api/orders";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface CancelOrderModalProps {
  open: boolean;
  onClose: () => void;
  onCancelled: () => void;
  orderId: string;
}

const REASON_OPTIONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Item no longer needed",
  "Other",
];

const CancelOrderModal = ({
  open,
  onClose,
  onCancelled,
  orderId,
}: CancelOrderModalProps) => {
  const [selectedReason, setSelectedReason] = useState(REASON_OPTIONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const isOther = selectedReason === "Other";
    const finalReason = isOther ? customReason.trim() : selectedReason;

    if (isOther && finalReason.length < 3) {
      setError("Please describe your reason for cancelling.");
      return;
    }

    setIsSubmitting(true);
    try {
      await ordersApi.cancelOrder(orderId, finalReason);
      onCancelled();
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "Failed to cancel order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Cancel Order">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          This will cancel all items in this order and cannot be undone.
        </p>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Reason for cancelling
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
          >
            {REASON_OPTIONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {selectedReason === "Other" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Please specify
            </label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
              placeholder="Tell us more…"
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
            Keep Order
          </Button>
          <Button type="submit" variant="danger" isLoading={isSubmitting}>
            Cancel Order
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CancelOrderModal;