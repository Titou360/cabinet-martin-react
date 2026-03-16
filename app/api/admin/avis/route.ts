import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const review = await prisma.review.create({ data });
  return NextResponse.json(review, { status: 201 });
}
