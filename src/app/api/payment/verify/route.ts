import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/config/env.server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { CREDIT_PACK, PackId } from "@/lib/credit_pack";
import { addCredits } from "@/lib/credits";
export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    await req.json();

  if (
    !razorpay_payment_id ||
    !razorpay_order_id ||
    !razorpay_signature 
  ) {
    return Response.json({ error: "Missing payment details" }, { status: 400 });
  }

  // Signature verification
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    console.error(`[PAYMENT Signature Verification Failed]: `, {
      clerkId,
      razorpay_order_id,
    });

    return Response.json(
      { error: "Invalid payment signature" },
      { status: 400 },
    );
  }
  
  // fetch order from DB
  const order  =await prisma.razorpayorder.findUnique({
    where:{orderId:razorpay_order_id}
  })
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

  // Idempotency check
  const alreadyProcessed = await prisma.creditTransaction.findFirst({
    where: { razorpayId: razorpay_payment_id },
  });

  if (alreadyProcessed) {
      const user = await prisma.user.findUnique({
        where: { clearkId: clerkId },
        include: { credit: true },
      });
      return Response.json({
        success: true,
        alreadyProcessed: true,
        newBalance: user?.credit?.balance,
      });
  }

  // add credit
  const pack = CREDIT_PACK[order.packId as PackId];
  if (!pack) {
    return Response.json({ error: "Invalid pack" }, { status: 400 });
  }

  const success = await addCredits(
    order.userId,
    pack.credit,
    `${pack.label} pack — ₹${pack.amountInInr} `,
    razorpay_payment_id,
  );

  if (!success) {
    return Response.json({ error: "Failed to add credits" }, { status: 500 });
  }

  // update order
  await prisma.razorpayorder.update({
    where:{orderId:razorpay_order_id},
    data:{
      status:"PAID",
      paymentId:razorpay_payment_id
    }
  })
  
  const user = await prisma.user.findUnique({
    where: { clearkId: clerkId },
    include: { credit: true },
  });

  return Response.json({
    success: true,
    creditsAdded: pack.credit,
    newBalance: user?.credit?.balance,
  });
}
