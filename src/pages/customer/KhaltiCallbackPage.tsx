import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ordersApi } from "@/api/orders";
import Spinner from "@/components/ui/Spinner";

const KhaltiCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Khalti redirects back with ?pidx=xxx&status=Completed&...
    // We only need pidx to verify — the backend confirms the real status
    // by calling Khalti's lookup API rather than trusting the URL params
    const pidx = searchParams.get("pidx");
    const khaltiStatus = searchParams.get("status");

    if (!pidx) {
      setStatus("error");
      setErrorMessage("No payment ID received from Khalti.");
      return;
    }

    // If Khalti already tells us it was cancelled/failed in the URL,
    // skip the verify call and show error immediately
    if (khaltiStatus === "User canceled" || khaltiStatus === "Failed") {
      setStatus("error");
      setErrorMessage("Payment was cancelled or failed.");
      return;
    }

    ordersApi
      .verifyKhaltiPayment(pidx)
      .then((order) => {
        setOrderId(order.id);
        setStatus("success");
      })
      .catch((err: unknown) => {
        const e = err as { response?: { data?: { message?: string } } };
        setErrorMessage(
          e.response?.data?.message ?? "Payment verification failed."
        );
        setStatus("error");
      });
  }, [searchParams]);

  useEffect(() => {
    if (status === "success" && orderId) {
      const timer = setTimeout(() => {
        navigate(`/orders/${orderId}`, { replace: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, orderId, navigate]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      {status === "verifying" && (
        <>
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-500">
            Verifying your payment…
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-7 w-7 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mt-4 font-display text-xl font-bold text-ink">
            Payment successful
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Redirecting to your order…
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-7 w-7 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="mt-4 font-display text-xl font-bold text-ink">
            Payment verification failed
          </h1>
          <p className="mt-1 text-sm text-gray-500">{errorMessage}</p>
          <Link
            to="/orders"
            className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
          >
            View my orders
          </Link>
        </>
      )}
    </div>
  );
};

export default KhaltiCallbackPage;