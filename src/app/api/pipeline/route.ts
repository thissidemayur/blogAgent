import { runPipeline } from "@/pipeline/orchestrator";
import { NextRequest  } from "next/server";

export const runtime ="nodejs"
export const dynamic="force-dynamic"

export async function POST(req:NextRequest) {
    let data:{topic?:string}
    try {
        data = await req.json()
    } catch (error) {
        console.error("[ROUTE PIPELINE ERROR]: ",error)
        return Response.json(
          { error: "Invalid request body" },
          { status: 400 },
        );
    }
    const {topic} = data

    if(!topic || topic.trim().length < 5) {
        return Response.json({error:"Topic too sort"},{status:400})
    }

    const runId = crypto.randomUUID()

    // runs in background, emits event as it goes
    setImmediate(
        ()=>runPipeline(runId,topic.trim()).catch((err)=>{
            console.error(`[Pipeline ${runId}] crashed: `,err?.message)
        })
    )

    return Response.json({runId}) //now browser can open SSE connection

}