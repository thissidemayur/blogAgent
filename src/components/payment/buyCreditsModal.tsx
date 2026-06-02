"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CREDIT_PACK, PackId } from "@/lib/credit_pack";
import { RazorpayPaymentButton } from "./razorPayPaymentButton";


interface BuyCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
  userName?: string;
  onSuccess: (newBalance: number) => void;
}

export function BuyCreditsModal({
  open,
  onOpenChange,
  userEmail,
  userName,
  onSuccess,
}: BuyCreditsModalProps) {
  function handleSuccess(newBalance: number) {
    onSuccess(newBalance);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>You&apos;re out of credits</DialogTitle>
          <DialogDescription>
            Purchase a pack to continue generating blogs. Credits never expire.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 mt-2">
          {Object.entries(CREDIT_PACK).map(([packId, pack]) => (
            <div
              key={pack.id}
              className={`
                relative rounded-lg border p-4
                ${
                  pack.label === "Pro"
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20"
                    : "border-border bg-card"
                }
              `}
            >
              {pack.label === "Pro" && (
                <Badge className="absolute -top-2.5 left-4 bg-violet-600 text-white text-xs">
                  Most popular
                </Badge>
              )}

              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-sm">{pack.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {pack.credit} blogs
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ₹{(pack.amountInInr / pack.credit).toFixed(0)} per blog
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-lg font-semibold">
                    ₹{pack.amountInInr}
                  </span>
                  <RazorpayPaymentButton
                    packId={packId as PackId}
                    userEmail={userEmail}
                    userName={userName}
                    onSuccess={handleSuccess}
                    className={
                      pack.label ==="Pro"
                        ? "bg-violet-600 hover:bg-violet-700 text-white px-4"
                        : "px-4"
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Secured by Razorpay · UPI, cards, netbanking accepted · Credits never
          expire
        </p>
      </DialogContent>
    </Dialog>
  );
}
