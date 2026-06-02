import { NextRequest } from "next/server";
import { emitter } from "@/lib/emitter";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get("runId");

  if (!runId) {
    return new Response("Missing runId", { status: 400 });
  }

  const stream = new ReadableStream<string>({
    start(ctrl) {
      // store this connection in emmiter
      emitter.register(runId, ctrl);

      // semd immediate confirmation so browser know connection is alive
      ctrl.enqueue(`event: connected\ndata: ${JSON.stringify({ runId })}\n\n`);
    },
    cancel() {
      // bworser close tab or network disconnected
      emitter.unregister(runId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // stops nginx from buffering your events
    },
  });
}
