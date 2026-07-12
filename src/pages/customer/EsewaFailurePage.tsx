import { Link } from "react-router-dom";

const EsewaFailurePage = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
        <svg className="h-7 w-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="mt-4 font-display text-xl font-bold text-ink">
        Payment was not completed
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Your order has been saved. You can try paying again from your order details.
      </p>
      <Link
        to="/orders"
        className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
      >
        View my orders
      </Link>
    </div>
  );
};

export default EsewaFailurePage;