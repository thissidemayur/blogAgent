import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const SIGNUP_CREDITS = 1;

function displayName(firstName: string | null, lastName: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ") || null;
}

export async function getOrCreateCurrentUser(clerkId: string) {
  const existing = await prisma.user.findUnique({
    where: { clearkId: clerkId },
    include: { credit: true },
  });

  if (existing?.credit) {
    return existing;
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Unable to load Clerk user");
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    `${clerkId}@clerk.local`;

  const name = displayName(clerkUser.firstName, clerkUser.lastName);

  await prisma.$transaction(async (tx) => {
    const user =
      existing ??
      (await tx.user.create({
        data: {
          clearkId: clerkId,
          email,
          name,
        },
      }));

    if (!existing?.credit) {
      await tx.credit.create({
        data: { userId: user.id, balance: SIGNUP_CREDITS },
      });

      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          amount: SIGNUP_CREDITS,
          type: "SIGNUP_BONOUS",
          description: "Welcome! 1 free blog generation on us",
        },
      });
    }
  });

  return prisma.user.findUniqueOrThrow({
    where: { clearkId: clerkId },
    include: { credit: true },
  });
}
