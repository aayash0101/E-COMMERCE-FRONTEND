interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

const StarRatingInput = ({ value, onChange }: StarRatingInputProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition"
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          <svg
            className={`h-7 w-7 ${star <= value ? "fill-amber-400" : "fill-gray-200"}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;