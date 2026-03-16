import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const refs = await prisma.reference.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(refs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const ref = await prisma.reference.create({ data });
  return NextResponse.json(ref, { status: 201 });
}
