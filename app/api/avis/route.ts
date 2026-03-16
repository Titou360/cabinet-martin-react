import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(reviews);
}
