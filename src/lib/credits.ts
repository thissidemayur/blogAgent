import { prisma } from "./prisma";



export const CREDIT_COSTS = {
    BLOG_GENERATION:1,
} as const

type DeductResult =
  | { success: true; remainingBalance: number }
  | { success: false; error: "INSUFFICIENT_CREDITS" | "USER_NOT_FOUND" };

export async function deductCredits(userId:string, cost:number,description:string):Promise<DeductResult>{
    try {
        const result = await prisma.$transaction(async(tx)=>{
            // find user and his credit
            const user = await tx.user.findUnique({
                where:{id:userId},
                include:{credit:true}
            })
            if(!user || !user.credit) {
                return { success: false, error: "USER_NOT_FOUND" } as const;
            }

            if (user.credit.balance < cost) {
                return {
                  success: false,
                  error: "INSUFFICIENT_CREDITS",
                } as const;
            }

            // deduct from balance
            const updatedCredit = await tx.credit.update({
                where:{userId:user.id},
                data:{
                    balance:{decrement:cost}
                }
            })

            // log the deduction
            await tx.creditTransaction.create({
                data:{
                    userId:user.id,
                    amount:-cost, // -ve = deducation
                    type:"GENERATION",
                    description,

                }
            })

            return {
                success:true ,
                remainingBalance: updatedCredit.balance
            } as const
        })
        return result

    } catch (error) {
        console.error(`[Credit Deduction Error]: `,error)
        return {
            success:false, error:"INSUFFICIENT_CREDITS"
        }
    }
}



// Add credit- called by razorpay webhook after payment verified
export async function addCredits(userId:string,amount:number,description:string, razorpayId?:string):Promise<boolean>{
    try {
        await prisma.$transaction(async(tx)=>{
            const user = await tx.user.findUnique({
              where: { id:userId },
            });

             if (!user ) throw new Error("User not found")
            
            await tx.credit.update({
                where:{
                    userId:user.id
                },
                data:{balance:{increment:amount}}
            })

            await tx.creditTransaction.create({
                data:{
                    userId:user.id,
                    amount,
                    description,
                    type:"PURCHASE",
                    razorpayId: razorpayId ?? null
                }
            })
        })
        return true
    } catch (error) {
        console.error(`[Credit Addition failed Error]: `, error);
        return false
    }
}
