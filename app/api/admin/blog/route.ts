import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const article = await prisma.article.create({
    data: {
      title: data.title,
      subtitle: data.subtitle,
      category: data.category ?? "Réussite client",
      image: data.image ?? null,
      imageAlt: data.imageAlt ?? null,
      content: JSON.stringify(data.content),
      readTime: data.readTime ?? "3 min",
      date: data.date ?? String(new Date().getFullYear()),
      published: data.published ?? true,
      linkedinUrl: data.linkedinUrl ?? null,
      tags: JSON.stringify(data.tags ?? []),
    },
  });
  return NextResponse.json(article, { status: 201 });
}
