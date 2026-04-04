"use client";
import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Filter } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

export interface Transaction {
  id: string;
  userId: string;
  createdAt: string;
  amount: number;
  type: "SIGNUP_BONOUS" | "PURCHASE" | "GENERATION" | "REFUND";
  description: string;
  razorpayId: string | null;
}

const TYPE_CONFIG = {
  SIGNUP_BONOUS: {
    label: "Signup bonus",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-400",
  },
  PURCHASE: {
    label: "Purchase",
    badgeClass: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    dotClass: "bg-violet-400",
  },
  GENERATION: {
    label: "Generation",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-400",
  },
  REFUND: {
    label: "Refund",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-400",
  },
};

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-px">
      {/* header */}
      <div className="grid grid-cols-[1fr_140px_100px_80px] gap-4 px-5 py-3 mb-2">
        {["w-16", "w-24", "w-16", "w-12"].map((w, i) => (
          <div key={i} className={`h-3 ${w} rounded-full bg-white/10`} />
        ))}
      </div>
      {/* rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_140px_100px_80px] gap-4 px-5 py-4 rounded-xl bg-white/[0.02] border border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
            <div className="space-y-1.5">
              <div
                className={`h-3 ${i % 2 === 0 ? "w-40" : "w-32"} rounded-full bg-white/10`}
              />
              <div className="h-2.5 w-20 rounded-full bg-white/[0.06]" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-5 w-24 rounded-full bg-white/10" />
          </div>
          <div className="flex items-center">
            <div className="h-3 w-20 rounded-full bg-white/10" />
          </div>
          <div className="flex items-center justify-end">
            <div className="h-4 w-12 rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function groupByDate(txs: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.setDate(now.getDate() - 1)).toDateString();

  txs.forEach((tx) => {
    const d = new Date(tx.createdAt).toDateString();
    const label = d === today ? "Today" : d === yesterday ? "Yesterday" : d;
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  });

  return groups;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/user/credits")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.transactions) setTransactions(data.transactions);
        setLoading(false);
      });
  }, []);

  const filterOptions = [
    { value: "ALL", label: "All" },
    { value: "PURCHASE", label: "Purchases" },
    { value: "GENERATION", label: "Generations" },
    { value: "REFUND", label: "Refunds" },
    { value: "SIGNUP_BONOUS", label: "Bonuses" },
  ];

  const filtered =
    filter === "ALL"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const grouped = groupByDate(filtered);

  // summary stats
  const totalAdded = transactions
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0);
  const totalUsed = Math.abs(
    transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0),
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* grid bg */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <BackButton href="/dashboard/credit" />

          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Transactions
              </h1>
              <p className="text-sm text-white/40 mt-0.5">
                Full credit history
              </p>
            </div>
          </div>
        </div>

        {/* ── Summary stats ── */}
        {!loading && (
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Total received",
                value: `+${totalAdded}`,
                sub: "credits added",
                color: "text-emerald-400",
                icon: ArrowDownLeft,
                iconClass: "text-emerald-400 bg-emerald-400/10",
              },
              {
                label: "Total used",
                value: `${totalUsed}`,
                sub: "credits consumed",
                color: "text-red-400",
                icon: ArrowUpRight,
                iconClass: "text-red-400 bg-red-400/10",
              },
              {
                label: "Total transactions",
                value: transactions.length.toString(),
                sub: "all time",
                color: "text-white",
                icon: Filter,
                iconClass: "text-violet-400 bg-violet-400/10",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 flex items-center gap-4"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${stat.iconClass}`}
                >
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-white/40">{stat.label}</p>
                  <p
                    className={`text-xl font-bold tracking-tight ${stat.color}`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-white/25">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Filter pills ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                filter === opt.value
                  ? "border-violet-500/60 bg-violet-500/10 text-violet-300"
                  : "border-white/10 bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/[0.07]"
              }`}
            >
              {opt.label}
              {opt.value !== "ALL" && !loading && (
                <span className="ml-1.5 opacity-50">
                  {transactions.filter((t) => t.type === opt.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Transaction list ── */}
        {loading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-20 text-center">
            <p className="text-white/30 text-sm">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([dateLabel, txs]) => (
              <div key={dateLabel}>
                {/* date group header */}
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-xs font-medium text-white/30 uppercase tracking-widest whitespace-nowrap">
                    {dateLabel}
                  </p>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <p className="text-xs text-white/20">{txs.length}</p>
                </div>

                {/* rows */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/5 overflow-hidden">
                  {txs.map((tx) => {
                    const isCredit = tx.amount > 0;
                    const typeInfo = TYPE_CONFIG[tx.type] ?? {
                      label: tx.type,
                      badgeClass: "bg-white/5 text-white/40 border-white/10",
                      dotClass: "bg-white/40",
                    };

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.025] transition-colors gap-4"
                      >
                        {/* left: icon + text */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* dot icon */}
                          <div className="shrink-0 w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                            {isCredit ? (
                              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm text-white/80 truncate leading-tight">
                              {tx.description}
                            </p>
                            <p className="text-xs text-white/30 mt-0.5">
                              {new Date(tx.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        {/* middle: type badge */}
                        <span
                          className={`shrink-0 hidden sm:inline-flex text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${typeInfo.badgeClass}`}
                        >
                          {typeInfo.label}
                        </span>

                        {/* right: razorpay ref */}
                        <div className="hidden md:flex shrink-0 items-center">
                          {tx.razorpayId ? (
                            <span className="text-[11px] text-white/20 font-mono">
                              {tx.razorpayId.slice(0, 14)}…
                            </span>
                          ) : (
                            <span className="text-[11px] text-white/15">—</span>
                          )}
                        </div>

                        {/* amount */}
                        <span
                          className={`shrink-0 text-sm font-bold tabular-nums ${
                            isCredit ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {isCredit ? "+" : ""}
                          {tx.amount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer note ── */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-white/20 pb-4">
            Showing {filtered.length} transaction
            {filtered.length === 1 ? "" : "s"} · All times in IST
          </p>
        )}
      </div>
    </div>
  );
}
