"use client";

import { useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
export type AgentStatus = "pending" | "running" | "done";
export type AgentName =
  | "thinker"
  | "researcher"
  | "planner"
  | "writer"
  | "editor"
  | "critic";

export interface CriticScores {
  relevance_to_brief: number;
  readability: number;
  accuracy: number;
  uniqueness: number;
  overall: number;
}

export interface CriticOutput {
  scores: CriticScores;
  passed: boolean;
  feedback: string;
  send_back_to: string;
  issues: string[];
}

export interface PlannerOutput {
  title: string;
  sections: { heading: string }[];
  estimated_total_words: number;
}

export interface AgentState {
  status: AgentStatus;
  output?: Record<string, unknown>;
}

export interface PipelineState {
  runId: string;
  agents: Record<AgentName, AgentState>;
  blog: string;
  // running = SSE connected, pipeline actively processing agents
  running: boolean;
  // loading = between "user clicked" and "first agent_start received"
  // This is the 30s gap where we need to show something
  loading: boolean;
  done: boolean;
  error: string | null;
  critic: CriticOutput | null;
  awaitingApproval: boolean;
  plannerOutput: PlannerOutput | null;
}

// ── Constants ──────────────────────────────────────────────────────────────
export const AGENT_ORDER: AgentName[] = [
  "thinker",
  "researcher",
  "planner",
  "writer",
  "editor",
  "critic",
];

export const AGENT_META: Record<
  AgentName,
  {
    label: string;
    icon: string;
    desc: string;
    color: string;
  }
> = {
  thinker: {
    label: "Thinker",
    icon: "◈",
    desc: "Analysing topic & strategy",
    color: "#a78bfa",
  },
  researcher: {
    label: "Researcher",
    icon: "◉",
    desc: "Gathering facts & sources",
    color: "#34d399",
  },
  planner: {
    label: "Planner",
    icon: "◫",
    desc: "Architecting blog structure",
    color: "#fbbf24",
  },
  writer: {
    label: "Writer",
    icon: "◎",
    desc: "Drafting the blog post",
    color: "#60a5fa",
  },
  editor: {
    label: "Editor",
    icon: "◐",
    desc: "Polishing tone & flow",
    color: "#f472b6",
  },
  critic: {
    label: "Critic",
    icon: "◑",
    desc: "QA scoring & review",
    color: "#fb923c",
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────
const freshAgents = (): Record<AgentName, AgentState> =>
  Object.fromEntries(
    AGENT_ORDER.map((a) => [a, { status: "pending" as AgentStatus }]),
  ) as Record<AgentName, AgentState>;

const initialState = (): PipelineState => ({
  runId: "",
  agents: freshAgents(),
  blog: "",
  running: false,
  loading: false, // ← new field
  done: false,
  error: null,
  critic: null,
  awaitingApproval: false,
  plannerOutput: null,
});

// ── Hook ───────────────────────────────────────────────────────────────────
export function usePipeline() {
  const [state, setState] = useState<PipelineState>(initialState);
  const sourceRef = useRef<EventSource | null>(null);

  async function start(topic: string) {
    sourceRef.current?.close();

    // Phase 1: loading=true, running=false
    // Shows "preparing pipeline" UI immediately
    // Covers the gap while fetch + deductCredits runs (~2-5s)
    setState({ ...initialState(), loading: true });

    const runId = crypto.randomUUID();

    // Open SSE FIRST — before POST so no events are missed
    const source = new EventSource(`/api/pipeline/stream?runId=${runId}`);
    sourceRef.current = source;

    // ── SSE listeners ──────────────────────────────────────────────────────

    source.addEventListener("agent_start", (e) => {
      const { agent } = JSON.parse(e.data) as { agent: AgentName };
      // Phase 2: first agent_start → switch from loading to running
      // Now AgentThinking has something to show
      setState((p) => ({
        ...p,
        loading: false, // ← loading phase ends
        running: true, // ← running phase starts
        agents: {
          ...p.agents,
          [agent]: { ...p.agents[agent], status: "running" },
        },
      }));
    });

    source.addEventListener("agent_done", (e) => {
      const { agent, output } = JSON.parse(e.data) as {
        agent: AgentName;
        output: Record<string, unknown>;
      };
      setState((p) => ({
        ...p,
        agents: { ...p.agents, [agent]: { status: "done", output } },
        ...(agent === "critic"
          ? { critic: output as unknown as CriticOutput }
          : {}),
      }));
    });

    source.addEventListener("text_chunk", (e) => {
      const { chunk } = JSON.parse(e.data) as { chunk: string };
      setState((p) => ({ ...p, blog: p.blog + chunk }));
    });

    source.addEventListener("awaiting_approval", (e) => {
      const data = JSON.parse(e.data) as PlannerOutput;
      setState((p) => ({
        ...p,
        awaitingApproval: true,
        plannerOutput: data,
        agents: {
          ...p.agents,
          planner: {
            status: "done",
            output: data as unknown as Record<string, unknown>,
          },
        },
      }));
    });

    source.addEventListener("done", () => {
      setState((p) => ({
        ...p,
        loading: false,
        running: false,
        done: true,
        awaitingApproval: false,
      }));
      source.close();
    });

    source.addEventListener("error_event", (e) => {
      const { message } = JSON.parse(e.data) as { message: string };
      setState((p) => ({
        ...p,
        loading: false,
        running: false,
        error: message,
      }));
      source.close();
    });

    source.onerror = () => {
      setState((p) => {
        if (p.done) source.close();
        return p;
      });
    };

    // POST pipeline after SSE is listening
    let res: Response;
    try {
      res = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, runId }),
      });
    } catch {
      setState((p) => ({
        ...p,
        loading: false,
        running: false,
        error: "Cannot reach server",
      }));
      source.close();
      return;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Request failed" }));
      if (res.status === 402) {
        setState((p) => ({
          ...p,
          loading: false,
          running: false,
          error: "INSUFFICIENT_CREDITS",
        }));
      } else {
        setState((p) => ({
          ...p,
          loading: false,
          running: false,
          error: body.message ?? body.error ?? "Request failed",
        }));
      }
      source.close();
      return;
    }

    // POST succeeded — pipeline is starting on server
    // loading stays true until first agent_start fires
    setState((p) => ({ ...p, runId }));
  }

  function stop() {
    sourceRef.current?.close();
    setState((p) => ({ ...p, loading: false, running: false }));
  }

  return { state, start, stop };
}
