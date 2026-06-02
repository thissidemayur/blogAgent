"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopicInput } from "@/components/dashboard/core/TopicInput";
import { generateSlug } from "@/lib/slug";

export default function NewBlogPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = topic.trim();
    if (trimmed.length < 5 || loading) return;

    setLoading(true);

    // Generate slug for the URL — purely cosmetic/readable
    // runId is generated inside usePipeline, not here
    const slug = generateSlug(trimmed, Date.now().toString(36));

    // Pass only topic — no runId in URL
    router.push(`/dashboard/${slug}?topic=${encodeURIComponent(trimmed)}`);
  };


  return (
    <div className="h-full bg-[#09090b] flex flex-col items-center justify-center px-4 gap-10">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-zinc-200 tracking-tight">
          What should the agents write?
        </h1>
        <p className="text-xs font-mono text-zinc-600">
          think → research → plan → write → edit → review
        </p>
      </div>

      <TopicInput
        value={topic}
        onChange={setTopic}
        onSubmit={handleSubmit}
        disabled={loading}
        isRunning={false}
        isLoading={loading}
        centered={true}
      />

    </div>
  );
}
