import { useState } from "react";
import type { Review } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { reviewsApi } from "@/api/reviews";
import Button from "@/components/ui/Button";

interface ReviewListProps {
  reviews: Review[];
  onChanged: () => void;
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`h-4 w-4 ${star <= rating ? "fill-amber-400" : "fill-gray-200"}`}
        viewBox="0 0 20 20"
      >
        <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
      </svg>
    ))}
  </div>
);

const ReviewList = ({ reviews, onChanged }: ReviewListProps) => {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No reviews yet — be the first to share your thoughts.
      </p>
    );
  }

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (reviewId: string) => {
    setBusyId(reviewId);
    try {
      await reviewsApi.update(reviewId, {
        rating: editRating,
        comment: editComment.trim(),
      });
      setEditingId(null);
      onChanged();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    setBusyId(reviewId);
    try {
      await reviewsApi.remove(reviewId);
      onChanged();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      {reviews.map((review) => {
        const isOwner = user?.id === review.customerId.id;
        const isEditing = editingId === review.id;

        return (
          <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {review.customerId.name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Stars rating={isEditing ? editRating : review.rating} />
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {isOwner && !isEditing && (
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(review)}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={busyId === review.id}
                    className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="mt-3 space-y-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                    >
                      <svg
                        className={`h-5 w-5 ${star <= editRating ? "fill-amber-400" : "fill-gray-200"}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => saveEdit(review.id)}
                    isLoading={busyId === review.id}
                  >
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;