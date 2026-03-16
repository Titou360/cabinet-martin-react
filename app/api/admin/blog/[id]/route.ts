import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  // Build partial update — only include fields that were sent
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: Record<string, any> = {};
  if (data.title !== undefined)      patch.title      = data.title;
  if (data.subtitle !== undefined)   patch.subtitle   = data.subtitle;
  if (data.category !== undefined)   patch.category   = data.category;
  if ("image" in data)               patch.image      = data.image ?? null;
  if ("imageAlt" in data)            patch.imageAlt   = data.imageAlt ?? null;
  if (data.content !== undefined)    patch.content    = JSON.stringify(data.content);
  if (data.readTime !== undefined)   patch.readTime   = data.readTime;
  if (data.date !== undefined)       patch.date       = data.date;
  if (data.published !== undefined)  patch.published  = data.published;
  if ("linkedinUrl" in data)         patch.linkedinUrl = data.linkedinUrl ?? null;
  if (data.tags !== undefined)       patch.tags       = JSON.stringify(data.tags);

  const article = await prisma.article.update({ where: { id }, data: patch });
  return NextResponse.json(article);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
