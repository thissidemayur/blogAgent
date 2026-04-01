"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  PenLine,
  History,
  CreditCard,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import Image from "next/image";

// ── Nav items ──────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "New blog",
    href: "/dashboard",
    icon: PenLine,
    exact: true,
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: History,
    exact: false,
  },
  {
    label: "Credits",
    href: "/dashboard/credits",
    icon: CreditCard,
    exact: false,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
    exact: false,
  },
] as const;

// ── Logo ───────────────────────────────────────────────────────
function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
    >
      {/* PenLine icon in a gradient pill */}
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shrink-0 shadow-lg shadow-violet-900/40">
        <PenLine className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
      </div>

      {!collapsed && (
        <span className="text-sm font-semibold text-white tracking-tight">
          Blogo<span className="text-violet-400">AI</span>
        </span>
      )}
    </Link>
  );
}

// ── Profile footer ─────────────────────────────────────────────
function ProfileFooter({ collapsed }: { collapsed: boolean }) {
  const { user } = useUser();
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/credits")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setCredits(d.balance);
          setPlan(d.plan?.label ?? null);
        }
      });
  }, []);

  const firstName = user?.firstName ?? "You";
  const initials = (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "");

  if (collapsed) {
    return (
      <div className="p-3 border-t border-white/[0.06]">
        <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/20 flex items-center justify-center mx-auto">
          <span className="text-[10px] font-semibold text-violet-300">
            {initials || "?"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border-t border-white/[0.06]">
      <Link
        href="/dashboard/credits"
        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
      >
        {/* Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-violet-600/20 border border-violet-500/20 flex items-center justify-center shrink-0">
          {user?.imageUrl ? (
            <Image
              fill
              src={user.imageUrl}
              alt={firstName}
              className="object-cover"
            />
          ) : (
            <span className="text-[10px] font-semibold text-violet-300">
              {initials || "?"}
            </span>
          )}
        </div>

        {/* Name + credits */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white/80 truncate leading-tight">
            {firstName}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Zap className="w-3 h-3 text-violet-400 shrink-0" />
            {credits === null ? (
              <div className="h-2.5 w-16 rounded-full bg-white/10 animate-pulse" />
            ) : (
              <span className="text-[11px] text-white/40">
                {credits} credit{credits === 1 ? "" : "s"}
                {plan && (
                  <span className="ml-1 text-violet-400/70">· {plan}</span>
                )}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// ── Main Sidebar ───────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside
      className={`
        relative flex flex-col h-screen
        border-r border-white/[0.06]
        bg-[#0a0a0f]
        transition-all duration-200 ease-in-out
        ${collapsed ? "w-[56px]" : "w-[220px]"}
        shrink-0
      `}
    >
      {/* ── Header / Logo ── */}
      <div className="h-11 flex items-center px-3 border-b border-white/[0.06] shrink-0">
        <Logo collapsed={collapsed} />
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-3 px-2.5 py-2 rounded-lg
                text-sm transition-all duration-150 group
                ${
                  active
                    ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  active
                    ? "text-violet-400"
                    : "text-white/40 group-hover:text-white/60"
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Profile footer ── */}
      <ProfileFooter collapsed={collapsed} />

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="
          absolute -right-3 top-[52px]
          w-6 h-6 rounded-full
          border border-white/10 bg-[#0a0a0f]
          flex items-center justify-center
          hover:bg-white/10 hover:border-white/20
          transition-all duration-150
          z-10
        "
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-white/40" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-white/40" />
        )}
      </button>
    </aside>
  );
}
