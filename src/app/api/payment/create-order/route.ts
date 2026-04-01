import { clientEnv } from "@/config/env.client";
import { razorpay } from "@/config/razorpay";
import { CREDIT_PACK, PackId } from "@/lib/credit_pack";
import { prisma } from "@/lib/prisma";
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

    const user =await prisma.user.findUnique({
        where:{clearkId:clerkId}
    })
    if(!user) {
        return Response.json({error:"user not found"},{status:400})
    }

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
                label:pack.label,
                credits:pack.credit,
                amountInINR:pack.amountInInr
            }
        })


    } catch (error) {
        console.error("[RAZORPAY ORDER CREATION FAILED]: ",error)
        return Response.json({error:"could not create order"},{status:500})
    }
}