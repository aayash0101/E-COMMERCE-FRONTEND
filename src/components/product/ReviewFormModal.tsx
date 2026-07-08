import { useState, type FormEvent } from "react";
import { reviewsApi } from "@/api/reviews";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import StarRatingInput from "./StarRatingInput";

interface ReviewFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  productId: string;
  productName: string;
  orderId: string;
}

const ReviewFormModal = ({
  open,
  onClose,
  onSubmitted,
  productId,
  productName,
  orderId,
}: ReviewFormModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Review must be at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewsApi.create({
        productId,
        orderId,
        rating,
        comment: comment.trim(),
      });
      setRating(0);
      setComment("");
      onSubmitted();
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Review ${productName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Your rating
          </label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Your review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="What did you think of this product?"
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
        </div>

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
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewFormModal;