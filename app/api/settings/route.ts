import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.upsert({
    where:  { id: "singleton" },
    update: {},
    create: { id: "singleton", totalSubventions: 2300000 },
  });
  return NextResponse.json(settings);
}
