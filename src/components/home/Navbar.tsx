"use client";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { SignInButton, useAuth } from "@clerk/nextjs";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Protocol", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO: Structural & Modular (No Sparkles) */}
        <Link href="/" className="flex items-center gap-2 group relative z-50">
          <div className="flex items-center font-mono bg-white/[0.03] border border-white/10 rounded-lg px-2 py-1 transition-all group-hover:border-indigo-500/40 group-hover:bg-white/[0.05]">
            <span className="text-white font-black text-sm tracking-tighter uppercase italic">
              blogo
            </span>
            <span className="text-indigo-400 font-black text-sm tracking-tighter uppercase italic ml-1">
              AI
            </span>
          </div>
          {/* Status Indicator replaces Sparkle */}
          <div className="relative flex h-2 w-2">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></div>
            <div className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500/80"></div>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all hover:bg-white/5 rounded-lg"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* DESKTOP CTAS: Styled Directly */}
        <div className="hidden md:flex items-center gap-8">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-white text-black text-[10px] font-mono font-black uppercase tracking-[0.15em] rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              {/* Secondary Action: Login */}
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer">
                  Login
                </span>
              </SignInButton>

              {/* Primary Action: Get Started */}
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <span className="px-5 py-2.5 bg-white text-black text-[10px] font-mono font-black uppercase tracking-[0.15em] rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer">
                  get_started
                </span>
              </SignInButton>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden relative z-50">
          <MobileMenu links={NAV_LINKS} isSignedIn={isSignedIn} />
        </div>
      </nav>
    </header>
  );
}
