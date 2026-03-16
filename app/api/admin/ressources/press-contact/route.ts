import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const contact = await prisma.pressContact.findFirst();
  return NextResponse.json(contact);
}
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  // Upsert: only one press contact record
  const existing = await prisma.pressContact.findFirst();
  if (existing) {
    return NextResponse.json(await prisma.pressContact.update({ where: { id: existing.id }, data }));
  }
  return NextResponse.json(await prisma.pressContact.create({ data }), { status: 201 });
}
