import { env } from "@/config/env";
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
  callback_url: string;
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
      const orderResponse = await fetch("api/payment/create-order", {
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

        callback_url: env.RAZORPAY_CALLBACK_URL,
        handler: async function (response: RazorpayResponse) {
          try {
            const verifyResponse = await fetch("api/payment/verify", {
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
            setError(
              "Payment received but credit update delayed. Refresh in a moment.",
            );
          } finally {
            setLoading(false);
          }
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: loading ? "var(--color-background-secondary)" : "#6366f1",
          color: loading ? "var(--color-text-secondary)" : "#fff",
          border: "none",
          borderRadius: "var(--border-radius-md)",
          fontSize: "14px",
          fontWeight: 500,
          cursor: loading ? "not-allowed" : "pointer",
          width: "100%",
          transition: "opacity 0.15s",
        }}
      >
        {loading? "Processing...":`Buy ${pack.label} — ₹${pack.amountInInr} (${pack.credit} credits)`}
      </button>

      {
        error && (
            <p style={{
                color: "var(--color-text-danger)"
            }} className="mt-[8px] font-[13px] ">
{error}
            </p>
        )
      }
    </div>
  );
}
