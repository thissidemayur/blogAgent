"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { markdownComponents } from "./MarkdownComponents";

import "highlight.js/styles/github-dark.css";

interface BlogRendererProps {
  content: string;
}

export function BlogRenderer({ content }: BlogRendererProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
