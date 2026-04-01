
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clearkId: clerkId },
    select: { id: true },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const blogs = await prisma.blogPost.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      topic: true,
      title: true,
      content: true,
      wordCount: true,
      createdAt: true,
    },
  });

  return Response.json({ blogs });
}

// POST /api/user/blogs — save a completed blog
// Call this from your pipeline's "done" event
export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topic, title, content } = await req.json();

  if (!topic || !title || !content) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { clearkId: clerkId },
    select: { id: true },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // rough word count from markdown content
  const wordCount = content
    .replace(/[#*`>\-\[\]()]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;

  const blog = await prisma.blogPost.create({
    data: {
      userId: user.id,
      topic,
      title,
      content,
      wordCount,
    },
  });

  return Response.json({ blog }, { status: 201 });
}
