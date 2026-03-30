import { env } from "@/config/env";
import { razorpay } from "@/config/razorpay";
import { CREDIT_PACK, PackId } from "@/lib/credit_pack";
import {auth} from "@clerk/nextjs/server"
import { NextRequest } from "next/server";


export async function POST(req:NextRequest) {
    // confirm authentication
    const {userId:clerkId} = await auth()
    if(!clerkId) {
        return Response.json({error:"Unauthorized"},{status:401})
    }

    // read which pack user choose
    const body = await req.json()
    const packId = body.packId as PackId
    // validate
    if(!packId || !CREDIT_PACK[packId]) {
        return Response.json({error:"Invalid pack"},{status:401})
    }
    const pack = CREDIT_PACK[packId]


    // create the order on razorpay
    try {
        const order = await razorpay.orders.create({
            currency:"INR",
            amount:pack.amountInPaise,
            receipt:`receipt_${clerkId}_${packId}_${Date.now()}`,
            notes:{
                clerkId,
                packId,
                credits:pack.credit.toString()
            }
        })

        return Response.json({
            orderId:order.id,
            amount:order.amount,
            currency:"INR",
            keyId:env.NEXT_PUBLIC_RAZORPAY_KEY_ID ,
            pack:{
                lavel:pack.label,
                credits:pack.credit,
                amountInINR:pack.amountInInr
            }
        })


    } catch (error) {
        console.error("[RAZORPAY ORDER CREATION FAILED]: ",error)
        return Response.json({error:"could not create order"},{status:500})
    }
}