
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, extractSummary, extractMarkdown } from "@/lib/slug";

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
      slug: true,
      topic: true,
      title: true,
      summary: true, 
      wordCount: true,
      createdAt: true,
    },
  });

  return Response.json({ blogs });
}


// POST /api/user/blogs — save a completed blog
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

//  unwrapp content
  const markdownContent = extractMarkdown(content);

  // Word count from clean markdown
  const wordCount = markdownContent
    .replace(/[#*`>\-\[\]()]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;

  const summary = extractSummary(markdownContent, 300);

  // Create the blog first to get the cuid for slug generation
  const blog = await prisma.blogPost.create({
    data: {
      userId: user.id,
      topic,
      title,
      content: markdownContent, 
      summary,
      wordCount,
      slug: "temp", // placeholder — updated immediately below
    },
  });

  const slug = generateSlug(topic, blog.id);

  const updated = await prisma.blogPost.update({
    where: { id: blog.id },
    data: { slug },
  });

  return Response.json({ blog: updated, slug }, { status: 201 });
}
