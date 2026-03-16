import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const articles = await prisma.article.findMany({
    where:   { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, image: true, imageAlt: true, category: true,
      title: true, subtitle: true, date: true, readTime: true,
      linkedinUrl: true, tags: true, content: true,
    },
  });
  return NextResponse.json(articles);
}
