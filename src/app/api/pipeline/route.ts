import { addCredits, CREDIT_COSTS, deductCredits } from "@/lib/credits";
import { getOrCreateCurrentUser } from "@/lib/users";
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
    let data: { topic?: unknown; runId?: unknown };
    try {
        data = await req.json();
    } catch {
        return Response.json({
            error: "INVALID_REQUEST_BODY",
            message: "Request body must be valid JSON.",
        }, { status: 400 });
    }

    const { topic, runId } = data;
    const trimmedTopic = typeof topic === "string" ? topic.trim() : "";
    const trimmedRunId = typeof runId === "string" ? runId.trim() : "";

    if (trimmedTopic.length < 5) {
        return Response.json({
            error: "INVALID_TOPIC",
            message: "Please provide a topic with at least 5 characters.",
        }, { status: 400 });
    }

    if (!trimmedRunId) {
        return Response.json({
            error: "MISSING_RUN_ID",
            message: "Missing runId for the pipeline stream.",
        }, { status: 400 });
    }
    let user: Awaited<ReturnType<typeof getOrCreateCurrentUser>>;
    try {
        user = await getOrCreateCurrentUser(clearkId);
    } catch (error) {
        console.error("[Pipeline User Sync Error]:", error);
        return Response.json({
            error: "USER_SYNC_FAILED",
            message: "Could not prepare your account. Please refresh and try again.",
        }, { status: 500 });
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
        runPipeline(trimmedRunId, trimmedTopic).catch(async (err) => {
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
