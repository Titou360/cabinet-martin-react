import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(req: NextRequest) {
  const { totalSubventions } = await req.json();
  const n = parseInt(totalSubventions, 10);
  if (isNaN(n) || n < 0) return NextResponse.json({ error: "Valeur invalide" }, { status: 400 });

  const settings = await prisma.siteSettings.upsert({
    where:  { id: "singleton" },
    update: { totalSubventions: n },
    create: { id: "singleton", totalSubventions: n },
  });
  return NextResponse.json(settings);
}
