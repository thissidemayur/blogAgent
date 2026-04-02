import { addCredits, CREDIT_COSTS, deductCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { runPipeline } from "@/pipeline/orchestrator";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {

    const { userId: clearkId } = await auth();
    if (!clearkId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Read + validate body FIRST before touching credits ──
    let data: { topic?: string; runId?: string };
    try {
        data = await req.json();
    } catch {
        return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { topic, runId } = data;

    if (!topic || topic.trim().length < 5) {
        return Response.json({ error: "Topic too short" }, { status: 400 });
    }

    if (!runId) {
        return Response.json({ error: "Missing runId" }, { status: 400 });
    }
       const user = await prisma.user.findUnique({
         where: { clearkId },
       });
       if (!user) {
         return Response.json({ error: "User not found" }, { status: 400 });
       }

    // ── Deduct credit AFTER validation ──────────────────────
    const deductResult = await deductCredits(
        user.id,
        CREDIT_COSTS.BLOG_GENERATION,
        "Blog generation"
    );

    if (!deductResult.success) {
        if (deductResult.error === "INSUFFICIENT_CREDITS") {
            return Response.json({
                error: "INSUFFICIENT_CREDITS",
                message: "You have no credits left. Please purchase a pack to continue.",
            }, { status: 402 });
        }
        return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
 


    setImmediate(() => {
        runPipeline(runId, topic.trim()).catch(async (err) => {
            console.error(`[Pipeline ${runId}] crashed:`, err?.message);
            // Refund token if pipeline crashes
            await addCredits(
                user?.id,
                CREDIT_COSTS.BLOG_GENERATION,
                "Refund: pipeline crashed"
            );
        });
    });

    return Response.json({ ok: true });
}