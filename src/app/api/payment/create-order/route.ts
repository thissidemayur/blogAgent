import { clientEnv } from "@/config/env.client";
import { razorpay } from "@/config/razorpay";
import { CREDIT_PACK, PackId } from "@/lib/credit_pack";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/users";
import {auth} from "@clerk/nextjs/server"
import { NextRequest } from "next/server";


export async function POST(req:NextRequest) {
    // confirm authentication
    const {userId:clerkId} = await auth()
    if(!clerkId) {
        return Response.json({error:"Unauthorized"},{status:401})
    }

    // read which pack user choose
    let body: { packId?: unknown };
    try {
        body = await req.json()
    } catch {
        return Response.json({
            error:"INVALID_REQUEST_BODY",
            message:"Request body must be valid JSON."
        },{status:400})
    }
    const packId = typeof body.packId === "string" ? body.packId : "";
    // validate
    if(!isPackId(packId)) {
        console.error("[PAYMENT INVALID PACK]: ", {
            packId,
            availablePackIds:Object.keys(CREDIT_PACK)
        })
        return Response.json({
            error:"INVALID_PACK",
            message:"Selected credit pack is invalid."
        },{status:400})
    }
    const pack = CREDIT_PACK[packId]

    const user = await getOrCreateCurrentUser(clerkId);

    // create the order on razorpay
    try {
        const order = await razorpay.orders.create({
            currency:"INR",
            amount:pack.amountInPaise,
            receipt:`receipt_${packId}_${Date.now()}`,
            notes:{
                clerkId,
                packId,
                credits:pack.credit.toString()
            }
        })

        // store in DB
        await prisma.razorpayorder.create({
            data:{
                orderId:order.id,
                userId:user.id,
                packId,
                amount:pack.amountInPaise
            }
        })

        return Response.json({
            orderId:order.id,
            amount:order.amount,
            currency:"INR",
            keyId:clientEnv.NEXT_PUBLIC_RAZORPAY_KEY_ID ,
            pack:{
                id:pack.id,
                label:pack.label,
                credits:pack.credit,
                amountInInr:pack.amountInInr
            }
        })


    } catch (error) {
        console.error("[RAZORPAY ORDER CREATION FAILED]: ",error)
        return Response.json({error:"could not create order"},{status:500})
    }
}

function isPackId(packId: string): packId is PackId {
    return Object.prototype.hasOwnProperty.call(CREDIT_PACK, packId);
}
