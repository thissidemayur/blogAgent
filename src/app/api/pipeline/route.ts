import { runPipeline } from "@/pipeline/orchestrator";
import { error } from "console";
import { NextRequest  } from "next/server";



export async function POST(req:NextRequest) {
    const data = await req.json()
    console.log(`[Pipeline API Data]: `,data)
    const{topic} = data

    if(!topic || topic.trim().length < 5) {
        return Response.json({error:"Topic too sort"},{status:400})
    }

    const runId = crypto.randomUUID()

    // runs in background, emits event as it goes
    setImmediate(()=>runPipeline(runId,topic.trim()))

    return Response.json({runId}) //now browser can open SSE connection

}