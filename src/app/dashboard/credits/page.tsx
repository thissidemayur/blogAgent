"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { RazorpayPaymentButton } from "@/components/payment/razorPayPaymentButton";
import { Badge } from "@/components/ui/badge";
import { CREDIT_PACK } from "@/lib/credit_pack";
import Link from "next/link";
import {
  Zap,
  ArrowUpRight,
  Sparkles,
  Shield,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Transaction } from "../transactions/page";
import { BackButton } from "@/components/ui/back-button";

function BalanceSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-4 w-28 rounded-full bg-white/10" />
          <div className="h-16 w-24 rounded-xl bg-white/10" />
          <div className="h-4 w-48 rounded-full bg-white/10" />
          <div className="flex gap-3 mt-2">
            <div className="h-7 w-20 rounded-full bg-white/10" />
            <div className="h-7 w-20 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="h-4 w-16 rounded-full bg-white/10" />
            <div className="h-8 w-20 rounded-lg bg-white/10" />
            <div className="h-4 w-28 rounded-full bg-white/10" />
            <div className="h-10 w-full rounded-xl bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CreditsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // lifted up
  const [loading, setLoading] = useState(true);

  async function fetchCredits() {
    const res = await fetch("/api/user/credits");
    if (!res.ok) return;
    const data = await res.json();
    if (data.balance !== undefined) setBalance(data.balance);
    if (data.transactions) setTransactions(data.transactions);
  }

  useEffect(() => {
   async function load() {
    try{
      await fetchCredits()
    }finally{
      setLoading(false)
    }
   }
   load()
  }, []);

  function handlePaymentSuccess(newBalance: number) {

    toast.success(` credits added!`, {
      description: "Your balance has been updated.",
      duration: 2000,
    
    });

    setBalance(newBalance);

    setTimeout(() => {
      fetchCredits(); 
    }, 800);
     setTimeout(() => {
       router.push("/dashboard");
     }, 1500); 
  }



  const creditStatus =
    balance === null
      ? null
      : balance === 0
        ? { label: "No credits", color: "text-red-400", dot: "bg-red-400" }
        : balance <= 3
          ? {
              label: "Low credits",
              color: "text-amber-400",
              dot: "bg-amber-400",
            }
          : {
              label: "Active",
              color: "text-emerald-400",
              dot: "bg-emerald-400",
            };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* subtle grid bg */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <BackButton href="/dashboard" />
          </div>
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/90 transition-colors group"
          >
            All transactions
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Credits</h1>
          <p className="text-sm text-white/40 mt-1">
            Manage your BlogoAI generation credits
          </p>
        </div>

        {loading ? (
          <BalanceSkeleton />
        ) : (
          <>
            {/* ── Balance card ── */}
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden">
              {/* purple glow blob */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-40 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col items-center text-center py-10 px-6 gap-2">
                {/* status pill */}
                {creditStatus && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${creditStatus.dot}`}
                    />
                    <span
                      className={`text-xs font-medium ${creditStatus.color}`}
                    >
                      {creditStatus.label}
                    </span>
                  </div>
                )}

                <p className="text-sm text-white/40">Available credits</p>

                <div className="flex items-end gap-2 my-1">
                  <span className="text-7xl font-bold tracking-tighter leading-none">
                    {balance}
                  </span>
                </div>

                <p className="text-sm text-white/40">
                  {balance === 0
                    ? "Purchase a pack below to continue"
                    : `${balance} blog generation${balance === 1 ? "" : "s"} remaining`}
                </p>

                {/* stat pills */}
                <div className="flex items-center gap-3 mt-4 flex-wrap justify-center">
                  <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    <Zap className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs text-white/60">
                      Instant delivery
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    <Clock className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs text-white/60">Never expire</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    <Shield className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs text-white/60">
                      Razorpay secured
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Pack cards ── */}
            <div>
              <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-4">
                Choose a pack
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.values(CREDIT_PACK).map((pack) => {
                  const isPro = pack.label === "Pro";
                  const perBlog = (pack.amountInInr / pack.credit).toFixed(0);

                  return (
                    <div
                      key={pack.id}
                      className={`
                        relative rounded-2xl border p-6 flex flex-col gap-5 transition-all
                        ${
                          isPro
                            ? "border-violet-500/60 bg-violet-500/[0.08] shadow-[0_0_40px_-8px_rgba(139,92,246,0.3)]"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                        }
                      `}
                    >
                      {isPro && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-violet-600 hover:bg-violet-600 text-white text-[11px] px-3 py-0.5 rounded-full border-0 shadow-lg shadow-violet-900/50">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Most popular
                          </Badge>
                        </div>
                      )}

                      {/* Pack info */}
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-white/70">
                          {pack.label}
                        </p>
                        <div className="flex items-end gap-1">
                          <span className="text-3xl font-bold tracking-tight">
                            ₹{pack.amountInInr}
                          </span>
                        </div>
                        <p className="text-xs text-white/40">
                          {pack.credit} blogs · ₹{perBlog} per blog
                        </p>
                      </div>

                      {/* Value indicator bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] text-white/30">
                          <span>Value</span>
                          <span>₹{perBlog}/blog</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isPro
                                ? "bg-violet-500 w-[85%]"
                                : pack.label === "Power"
                                  ? "bg-emerald-500 w-full"
                                  : "bg-white/40 w-[55%]"
                            }`}
                          />
                        </div>
                      </div>

                      <RazorpayPaymentButton
                        packId={pack.id as keyof typeof CREDIT_PACK}
                        userEmail={user?.primaryEmailAddress?.emailAddress}
                        userName={user?.fullName ?? undefined}
                        onSuccess={handlePaymentSuccess}
                        className={
                          isPro
                            ? "w-full rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium py-2.5 transition-colors border-0"
                            : "w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-2.5 transition-colors"
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Recent transactions preview ── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-white/30 uppercase tracking-widest">
                  Recent activity
                </p>
                <Link
                  href="/dashboard/transactions"
                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  View all
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <RecentTransactions />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RecentTransactions() {
  const [transactions, setTransactions] = useState<
    {
      id: string;
      amount: number;
      description: string;
      type: string;
      createdAt: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/credits")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.transactions) setTransactions(data.transactions.slice(0, 3));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 rounded-xl bg-white/5 border border-white/5"
          />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <p className="text-sm text-white/30">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/5 overflow-hidden">
      {transactions.map((tx) => (
        <TransactionRow key={tx.id} tx={tx} compact />
      ))}
    </div>
  );
}

export function TransactionRow({
  tx,
  compact = false,
}: {
  tx: {
    id: string;
    amount: number;
    description: string;
    type: string;
    createdAt: string;
  };
  compact?: boolean;
}) {
  const isCredit = tx.amount > 0;

  const typeConfig: Record<string, { label: string; className: string }> = {
    SIGNUP_BONOUS: {
      label: "Signup bonus",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    PURCHASE: {
      label: "Purchase",
      className: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    },
    GENERATION: {
      label: "Generation",
      className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    REFUND: {
      label: "Refund",
      className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  };

  const typeInfo = typeConfig[tx.type] ?? {
    label: tx.type,
    className: "bg-white/5 text-white/40 border-white/10",
  };

  return (
    <div className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        {/* type badge */}
        <span
          className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full border ${typeInfo.className}`}
        >
          {typeInfo.label}
        </span>

        {!compact && (
          <div className="min-w-0">
            <p className="text-sm text-white/80 truncate">{tx.description}</p>
            <p className="text-xs text-white/30 mt-0.5">
              {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}

        {compact && (
          <p className="text-sm text-white/60 truncate">{tx.description}</p>
        )}
      </div>

      <span
        className={`text-sm font-semibold shrink-0 ml-4 ${
          isCredit ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {isCredit ? "+" : ""}
        {tx.amount}
      </span>
    </div>
  );
}
