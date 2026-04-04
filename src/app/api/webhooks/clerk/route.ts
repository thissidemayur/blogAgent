import { env } from "@/config/env.server";
import { prisma } from "@/lib/prisma";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { Webhook } from "svix";

export async function POST(req:NextRequest) {
    const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET
      if (!WEBHOOK_SECRET) {
        throw new Error("CLERK_WEBHOOK_SECRET missing from .env");
      }
    
    // headers send by cleark with every weebhook
    const headerPayload = await headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")
      if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing svix headers", { status: 400 });
      }

    //   get raw request body - for signature verification
    // if you pass it to json first,the string change hence signature breaks
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // if signature fails , means request is not commingfrom cleark
    const wh = new Webhook(WEBHOOK_SECRET)
    let event:WebhookEvent
    try {
        event = wh.verify(body, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (error) {
        console.error(`[WEBHOOK Signature Verification fail]`)
        console.error(error)
        return new Response("Invalid signature", { status: 401 });
    }

    // hande event type- user.created
    const eventType= event.type
    if (eventType === "user.created") {
      const {
        id: clearkId,
        email_addresses,
        first_name,
        last_name,
      } = event.data;

      // get primarly email address bcz cleark user have many email
      const primaryEmail = email_addresses.find(
        (e) => e.id === event.data.primary_email_address_id,
      );
      if (!primaryEmail) {
        return new Response("No primary email found", { status: 400 });
      }

      try {
        // @ts-expect-error: Prisma tx type inference fails in Next.js build
        await prisma.$transaction(async (tx) => {
          const user = await tx.user.upsert({
            where: { clearkId },
            update: {},
            create: {
              clearkId,
              email: primaryEmail.email_address,
              name: [first_name, last_name].filter(Boolean).join(" ") || null,
            },
          });

          const isNew = user.createdAt.getTime() === user.updatedAt.getTime();
          if (isNew) {
            await tx.credit.create({
              data: { userId: user.id, balance: 20 },
            });
            await tx.creditTransaction.create({
              data: {
                userId: user.id,
                amount: 1,
                type: "SIGNUP_BONOUS",
                description: "Welcome! 1 free blog generation on us",
              },
            });
          }
        });
        return new Response("Webhook processed", { status: 200 });
      } catch (error: unknown) {
        // P2002 = unique constraint — user already exists, treat as success
        if (
          error instanceof Error &&
          "code" in error &&
          (error as { code: string }).code === "P2002"
        ) {
          return new Response("User already exists", { status: 200 });
        }
        console.error("[Clerk Webhook DB Error]:", error);
        return new Response("Database error", { status: 500 });
      }
    }

    
}