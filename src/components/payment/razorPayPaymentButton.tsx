import { CREDIT_PACK, PackId } from "@/lib/credit_pack";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: number;
  };
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: object;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

interface PaymentButtonProps {
  packId: PackId;
  userEmail?: string;
  userName?: string;
  onSuccess: (newBalance: number) => void; // parent update balance display
  className?:string
}

// dynamically load razorpay's script only when needed
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // if already loaded, reolve it
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

export function RazorpayPaymentButton({
  packId,
  userEmail,
  userName,
  onSuccess,
  className,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const pack = CREDIT_PACK[packId];

  async function handlePayment() {
    setLoading(true);
    setError(null);

    try {
      // load razorpay sdk
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error(
          "Failed to laod payment SDK. Check your internt connection.",
        );
      }

      // create order on your server
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packId }),
      });

      if (!orderResponse) {
        throw new Error("Could not create payment order. Please try again.");
      }
      const orderData = await orderResponse.json();
      console.log("OrderData: ", orderData);

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "BlogoAI",
        description: `${orderData.pack.label} — ${orderData.pack.credits} blog credits`,
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            setLoading(false);
          },
        },

        handler: async function (response: RazorpayResponse) {
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verifucation failed."); // it should respect backend error message
            }

            const verifyData = await verifyResponse.json();
            // tell parent componont to update the balance display
            onSuccess(verifyData.newBalance);
          } catch (error) {
            console.error(
              `[Payment Recieved but credit delayed. Refesh in a moment.`,
            );
            console.error(error);
            setError(
              "Payment received but credit update delayed. Refresh in a moment.",
            );
          } finally {
            setLoading(false);
          }
        },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  // Base styles always applied — className from parent overrides/extends
  const baseClass = `
    relative inline-flex items-center justify-center gap-2
    w-full py-2.5 px-4 rounded-xl
    text-sm font-medium
    transition-all duration-150
    disabled:opacity-50 disabled:cursor-not-allowed
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50
  `;

  // Default style when no className passed — fits dark glassmorphism
  const defaultClass = `
    border border-white/10 bg-white/5 hover:bg-white/10 text-white
  `;

  return (
    <div className="w-full">
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`${baseClass} ${className ?? defaultClass}`}
      >
        {loading
          ? "Processing..."
          : `Buy ${pack.label} — ₹${pack.amountInInr} (${pack.credit} credits)`}
      </button>

      {error && (
        <p
          style={{
            color: "var(--color-text-danger)",
          }}
          className="mt-[8px] font-[13px] "
        >
          {error}
        </p>
      )}
    </div>
  );
}
