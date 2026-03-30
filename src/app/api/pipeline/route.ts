import { addCredits, CREDIT_COSTS, deductCredits } from "@/lib/credits";
import { runPipeline } from "@/pipeline/orchestrator";
import { auth } from "@clerk/nextjs/server";
import { NextRequest  } from "next/server";

export const runtime ="nodejs"
export const dyynamic="force-dynamic"

export async function POST(req:NextRequest) {
    
    const {userId:clearkId} = await auth()
    if(!clearkId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // check and  credit balance 
    const deductCredit = await deductCredits(clearkId,CREDIT_COSTS.BLOG_GENERATION,"Blog generation")

    if (!deductCredit.success) {
        if(deductCredit.error === "INSUFFICIENT_CREDITS") {
            // 402 payment required- frontend check for 402 and shows "Buy credits " model
            return Response.json({
              error: "INSUFFICIENT_CREDITS",
              message:
                "You have no credits left. Please purchase a pack to continue.",
            },{status:402});
        }
        return Response.json(
            { error: "Something went wrong" },
            { status: 500 },
        );

    }

    // Core Logic
    try {
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
    
    } catch (error) {
        // refund on failure
        await addCredits(clearkId,CREDIT_COSTS.BLOG_GENERATION,"Refund: generation failed")
        console.error("[PIPELINE failed Error]: ",error)
        return Response.json({error:"Pipeline failed"},{status:500})
    }
}