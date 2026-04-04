"use client";

import { useState } from "react";

export function CodeBlock({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative my-4">
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
      >
        {copied ? "copied" : "copy"}
      </button>

      <pre className="bg-[#161b22] p-4 rounded-lg overflow-x-auto text-sm">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
