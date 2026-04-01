// Return current user's credit balance + transacition history using atomic state

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

function getPlanLabel(balance: number): string {
  if (balance === 0) return "No credits";
  if (balance <= 5) return "Starter";
  if (balance <= 15) return "Pro";
  return "Power";
}

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

    const balance = user.credit.balance;
    return Response.json({
      balance: balance,
      transactions: user.transcations,
      plan: {
        label: getPlanLabel(balance),
        balance,
      },
    });

}