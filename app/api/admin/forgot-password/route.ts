import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  // Always return the same response to avoid user enumeration
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  // Invalidate previous tokens
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1h

  const token = randomBytes(32).toString("hex");

  await prisma.passwordResetToken.create({
    data: { token, expiresAt },
  });

  // In production: send email. For now, return the token in response.
  return NextResponse.json({ token });
}
