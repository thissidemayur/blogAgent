// Return current user's credit balance + transacition history using atomic state

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


export async function GET() {
    const {userId:clearkId} = await auth()
    if (!clearkId) {
        return Response.json({error:"Unauthorized"},{status:401})
    }

    const user = await prisma.user.findUnique({
        where:{clearkId},
        include:{
            credit:true,
            transcations:{
                orderBy:{createdAt:"desc"},
                take:20 //last 20 transacition
            }
        }
    })

    if(!user || !user.credit) {
        // due to webhook invocation it doesnot happen
        return Response.json({error:"User not found in DB"},{status:404})
    }

    return Response.json({
        balance:user.credit.balance,
        transactions:user.transcations
    })

}