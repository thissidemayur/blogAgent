"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {TopicInput} from "@/components/dashboard/core/TopicInput";
import { generateSlug } from "@/lib/slug";

export default function NewBlogPage() {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = topic.trim();
    if (trimmed.length < 5) return;

    setLoading(true);

    try {
      const runId = crypto.randomUUID();
      const slug = generateSlug(trimmed, runId);

      router.push(
        `/dashboard/${slug}?topic=${encodeURIComponent(trimmed)}&runId=${runId}`,
      );
    } catch (err) {
      console.error("[NEW BLOG ERROR]", err);
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#09090b] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-100">
            What do you want to write about?
          </h1>
          <p className="text-sm text-zinc-500">
            Generate production-ready blogs using AI pipeline
          </p>
        </div>

        <TopicInput
          value={topic}
          onChange={setTopic}
          onSubmit={handleSubmit}
          disabled={loading}
          isRunning={false}
          centered={true}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
