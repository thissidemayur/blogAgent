import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const user = await prisma.user.findUnique({
    where: { clearkId: clerkId },
    select: { id: true },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const blog = await prisma.blogPost.findFirst({
    where: {
      slug,
      userId: user.id, 
    },
  });

  if (!blog) {
    return Response.json({ error: "Blog not found" }, { status: 404 });
  }

  return Response.json({ blog });
}
