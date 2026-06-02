// @ts-nocheck

import Image from "next/image";
import { CodeBlock } from "./CodeBlock";

export const markdownComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-3xl font-bold mt-10 mb-5 border-b border-white/10 pb-3">
      {children}
    </h1>
  ),

  h2: ({ children }: any) => (
    <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
  ),

  h3: ({ children }: any) => (
    <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
  ),

  p: ({ children }: any) => (
    <p className="text-zinc-300 leading-7 my-3 text-[15px]">{children}</p>
  ),

  code({ inline, className, children, ...props }: any) {
    if (inline) {
      return (
        <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm text-blue-400">
          {children}
        </code>
      );
    }

    return (
      <CodeBlock className={className}>{String(children).trim()}</CodeBlock>
    );
  },

  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-zinc-600 pl-4 text-zinc-400 italic my-4">
      {children}
    </blockquote>
  ),

  ul: ({ children }: any) => (
    <ul className="list-disc pl-6 space-y-1 text-zinc-300">{children}</ul>
  ),

  ol: ({ children }: any) => (
    <ol className="list-decimal pl-6 space-y-1 text-zinc-300">{children}</ol>
  ),

  a: ({ href, children }: any) => (
    <a href={href} className="text-blue-400 hover:underline" target="_blank">
      {children}
    </a>
  ),

  img: ({ src, alt }: any) => (
    <div className="my-6">
      <img
        src={src}
        alt={alt || ""}
        loading="lazy"
        className="rounded-xl border border-white/10 w-full h-auto object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  ),
};
