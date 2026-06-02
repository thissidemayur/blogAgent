"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href, label }: BackButtonProps) {
  const router = useRouter();

  const content = (
    <span
      className="
      group inline-flex items-center gap-2
      text-sm text-white/40 hover:text-white/80
      transition-colors duration-150
    "
    >
      <ArrowLeft
        className="
        w-4 h-4
        group-hover:-translate-x-0.5
        transition-transform duration-150
      "
      />
      {label ?? "Back"}
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <button onClick={() => router.back()}>{content}</button>;
}
