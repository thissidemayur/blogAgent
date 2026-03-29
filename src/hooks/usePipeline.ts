"use client";

import { useRef, useState } from "react";

type AgentStatus = "pending" | "running" | "done";
type AgentName =
  | "thinker"
  | "researcher"
  | "planner"
  | "writer"
  | "editor"
  | "critic";

interface PipelineState {
  agents: Record<AgentName, AgentStatus>;
  blog: string; //accumlates chunks as editor stream
  running: boolean;
  done: boolean;
  error: string | null;
}

const initalAgents: Record<AgentName, AgentStatus> = {
  thinker: "pending",
  researcher: "pending",
  planner: "pending",
  writer: "pending",
  editor: "pending",
  critic: "pending",
};

// hook
export function usePipeline() {
  const [state, setState] = useState<PipelineState>({
    agents: initalAgents,
    blog: "",
    running: false,
    done: false,
    error: null,
  });

  // useref doesnot cause re-render when it change
  // thats why we store eventsource in useRef
  const sourceRef = useRef<EventSource | null>(null);
  
  async function start(topic: string) {
    // close an exisitng connection from preivous run
    sourceRef.current?.close();

    // reset state for new run
    setState({
      agents: initalAgents,
      blog: "",
      running: true,
      done: false,
      error: null,
    });

    // step1: start pipeline
    const res = await fetch("/api/pipeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      setState((prev) => ({ ...prev, running: false, error }));
      return;
    }

    const { runId } = await res.json();

    // step2: open SSE connection
    // browser open GET /api/pipeline/stream?runId=abc
    // connection stay open, events flow in
    const source = new EventSource(`/api/pipeline/stream?runId=${runId}`);
    sourceRef.current = source;

    // fire when backend call emiter.agentStart()
    source.addEventListener("agent_start", (e) => {
      const { agent } = JSON.parse(e.data) as { agent: AgentName };
      setState((prev) => ({ ...prev, agents:{...prev.agents,[agent]:"running"} }));
    });

    source.addEventListener("agent_done", (e) => {
      const { agent } = JSON.parse(e.data) as { agent: AgentName };

      setState((prev) => ({
        ...prev,
        agents: { ...prev.agents, [agent]: "done" },
      }));
    });

    source.addEventListener("text_chunk",(e)=>{
        const {chunk} = JSON.parse(e.data) as {chunk:string}
        setState(prev=>({
            ...prev,
            blog: prev.blog + chunk // append
        }))
    })

    source.addEventListener("done",()=>{
        setState(prev=>({...prev,running:false,done:true}))
        source.close()
    })

    source.addEventListener("error_event",(e)=>{
        const {message} = JSON.parse(e.data)
        setState(prev=>({...prev,error:message,running:false}))
        source.close()
    })

    // onError fires on CONNECTION errors eg server crashed, network dropped
    source.onerror = ()=>{
        // nrowser will auto reconnect after 3s
        // only force close if pipeline is already done
        if(state.done) source.close()
    }
  }

  function stop(){
    sourceRef.current?.close()
    setState(prev=>({...prev, running:false}))
  }

  return {state,start,stop}
}
