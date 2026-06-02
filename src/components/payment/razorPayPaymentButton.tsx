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

interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  pack: {
    id: PackId;
    label: string;
    credits: number;
    amountInInr: number;
  };
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
    if (!pack) {
      console.error("[Payment] Invalid packId passed to RazorpayPaymentButton", {
        packId,
        availablePackIds: Object.keys(CREDIT_PACK),
      });
      setError("Selected credit pack is invalid. Please refresh and try again.");
      return;
    }

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

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) {
        console.error("[Payment] create-order failed", {
          packId,
          pack,
          orderData,
        });
        throw new Error(
          orderData?.message ??
            orderData?.error ??
            "Could not create payment order. Please try again.",
        );
      }

      if (!isCreateOrderResponse(orderData)) {
        console.error("[Payment] create-order returned invalid pack details", {
          packId,
          localPack: pack,
          orderData,
        });
        throw new Error("Payment order is missing pack details. Please try again.");
      }

      const checkoutDescription = `${orderData.pack.label} — ₹${orderData.pack.amountInInr} · ${orderData.pack.credits} blog credits`;

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "BlogoAI",
        description: checkoutDescription,
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
          : pack
            ? `Buy ${pack.label} — ₹${pack.amountInInr} (${pack.credit} credits)`
            : "Invalid pack"}
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

function isCreateOrderResponse(data: unknown): data is CreateOrderResponse {
  if (!data || typeof data !== "object") return false;

  const value = data as Partial<CreateOrderResponse>;
  const pack = value.pack;

  return (
    typeof value.orderId === "string" &&
    typeof value.amount === "number" &&
    typeof value.currency === "string" &&
    typeof value.keyId === "string" &&
    !!pack &&
    typeof pack.id === "string" &&
    typeof pack.label === "string" &&
    typeof pack.credits === "number" &&
    typeof pack.amountInInr === "number"
  );
}
