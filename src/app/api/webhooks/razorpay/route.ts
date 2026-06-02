import { env } from "@/config/env.server";
import { CREDIT_PACK, PackId } from "@/lib/credit_pack";
import { addCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
    const rawBody = await req.text();

    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
        return new Response("Missing signature", { status: 400 });
    }

    const expected = crypto
        .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

    if (expected !== signature) {
        return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(rawBody);
    if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;

        const paymentId = payment.id;
        const orderId = payment.order_id;
        const order = await prisma.razorpayorder.findUnique({
            where: { orderId },
        });

        if (!order) {
            return new Response("Order not found", { status: 200 });
        }

        const already = await prisma.creditTransaction.findUnique({
            where: { razorpayId: paymentId }
        });

        if (already) {
            return Response.json({ message: "Already processed" }, { status: 200 });
        }

        const pack = CREDIT_PACK[order.packId as PackId];

        if (!pack) {
            return Response.json({ error: "Invalid pack" }, { status: 200 });
        }

        const success = await addCredits(
            order.userId,
            pack.credit,
            `${pack.label} pack — ₹${pack.amountInInr} (webhook)`,
            paymentId,
        );

        if (!success) {
            return new Response("Credit addition failed", { status: 500 });
        }

        await prisma.razorpayorder.update({
            where: { orderId },
            data: {
                status: "PAID",
                paymentId,
            },
        });

        return new Response("OK", { status: 200 });
    }

    return new Response("Unhandled event", { status: 200 });
}
