import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const members = await prisma.member.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const member = await prisma.member.create({ data });
  return NextResponse.json(member, { status: 201 });
}
