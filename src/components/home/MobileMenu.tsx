"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

interface NavLink {
  label: string;
  href: string;
}

export default function MobileMenu({ links, isSignedIn }: { links: NavLink[]; isSignedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="flex items-center">
      <button 
        onClick={toggleMenu} 
        aria-label="Toggle Menu"
        className="text-zinc-400 hover:text-white transition-colors focus:outline-none"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-in spin-in-90 duration-300" />
        ) : (
          <Menu className="w-6 h-6 animate-in zoom-in-50 duration-300" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 w-full bg-[#09090b] px-6 py-8 flex flex-col gap-8 animate-in slide-in-from-right duration-300 md:hidden">
          {/* Navigation Links */}
          <div className="flex flex-col gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-mono text-sm uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-8 border-t border-white/5">
            {isSignedIn ? (
              <Link 
                href="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="block bg-white text-black text-center py-4 rounded-xl font-mono text-xs font-bold uppercase tracking-[0.1em] hover:bg-zinc-200 transition-all active:scale-95"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors cursor-pointer">
                    login
                  </span>
                </SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <span className="block bg-white text-black text-center py-4 rounded-xl font-mono text-xs font-bold uppercase tracking-[0.1em] hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer">
                    get_started
                  </span>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Minimalist Footer Decor */}
          <div className="mt-auto pb-10 flex justify-center opacity-20">
            <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-white">
              autonomous_pipeline_v1.0
            </span>
          </div>
        </div>
      )}
    </div>
  );
}