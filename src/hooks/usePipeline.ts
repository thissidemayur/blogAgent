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
  running: boolean;
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
  { label: string; icon: string; desc: string; color: string }
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
  done: false,
  error: null,
  critic: null,
  awaitingApproval: false,
  plannerOutput: null,
});

// ── Hook ───────────────────────────────────────────────────────────────────
export function usePipeline() {
  const [state, setState] = useState<PipelineState>(initialState);

  // useRef — stores EventSource without triggering re-render
  const sourceRef = useRef<EventSource | null>(null);

  async function start(topic: string) {
    // Close any existing SSE connection from previous run
    sourceRef.current?.close();

    // ✅ Set running:true IMMEDIATELY — before any await
    // This disables the button and shows the thinking UI instantly
    // User sees feedback the moment they click generate
    setState({ ...initialState(), running: true });

    // ✅ Generate runId on the BROWSER side
    // This allows us to open SSE connection BEFORE calling the pipeline API
    // Prevents race condition where pipeline emits events before SSE is registered
    const runId = crypto.randomUUID();

    // ✅ Open SSE connection FIRST — before POST /api/pipeline
    // When server calls setImmediate(runPipeline), emitter.register()
    // has already been called so zero events are lost
    const source = new EventSource(`/api/pipeline/stream?runId=${runId}`);
    sourceRef.current = source;

    // ── SSE event listeners ────────────────────────────────────────────────

    // Fires when orchestrator calls emitter.agentStart()
    source.addEventListener("agent_start", (e) => {
      const { agent } = JSON.parse(e.data) as { agent: AgentName };
      setState((p) => ({
        ...p,
        agents: {
          ...p.agents,
          [agent]: { ...p.agents[agent], status: "running" },
        },
      }));
    });

    // Fires when orchestrator calls emitter.agentDone()
    // output contains the agent's structured JSON result — shown in toggle
    source.addEventListener("agent_done", (e) => {
      const { agent, output } = JSON.parse(e.data) as {
        agent: AgentName;
        output: Record<string, unknown>;
      };
      setState((p) => ({
        ...p,
        agents: { ...p.agents, [agent]: { status: "done", output } },
        // store critic output separately for score card component
        ...(agent === "critic"
          ? { critic: output as unknown as CriticOutput }
          : {}),
      }));
    });

    // Fires hundreds of times — one chunk per word from editor streaming
    // Each chunk appended to blog string — renders word by word in BlogOutput
    source.addEventListener("text_chunk", (e) => {
      const { chunk } = JSON.parse(e.data) as { chunk: string };
      setState((p) => ({ ...p, blog: p.blog + chunk }));
    });

    // Fires after planner completes — pipeline pauses for human approval
    // Frontend shows ApprovalBanner with the outline
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

    // Fires once when all 6 agents complete successfully
    source.addEventListener("done", () => {
      setState((p) => ({
        ...p,
        running: false,
        done: true,
        awaitingApproval: false,
      }));
      source.close();
    });

    // Fires if orchestrator throws — shows error message in UI
    source.addEventListener("error_event", (e) => {
      const { message } = JSON.parse(e.data) as { message: string };
      setState((p) => ({ ...p, running: false, error: message }));
      source.close();
    });

    // Connection-level error — browser will auto-reconnect after 3s
    // Only force close if pipeline already finished
    source.onerror = () => {
      setState((p) => {
        if (p.done) source.close();
        return p;
      });
    };

    // ✅ NOW call the pipeline API — SSE is already listening
    // Server will call setImmediate(runPipeline) which fires after response
    // By that point emitter.register() has already been called
    let res: Response;
    try {
      res = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ Send runId to server — server no longer generates it
        body: JSON.stringify({ topic, runId }),
      });
    } catch {
      setState((p) => ({ ...p, running: false, error: "Cannot reach server" }));
      source.close();
      return;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Request failed" }));

      if (res.status === 402) {
        // Insufficient credits — PipelineShell opens BuyCreditsModal on this error
        setState((p) => ({
          ...p,
          running: false,
          error: "INSUFFICIENT_CREDITS",
        }));
      } else {
        setState((p) => ({
          ...p,
          running: false,
          error: body.error ?? "Request failed",
        }));
      }

      source.close();
      return;
    }

    // Pipeline started — store runId in state
    // running stays true — already set at the top of this function
    setState((p) => ({ ...p, runId }));
  }

  // Stop — closes SSE connection and resets running flag
  // Pipeline continues on server but frontend stops listening
  function stop() {
    sourceRef.current?.close();
    setState((p) => ({ ...p, running: false }));
  }

  return { state, start, stop };
}
