import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!record || record.used || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Lien invalide ou expiré." }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);

  // Update the first (and only) admin user
  const user = await prisma.adminUser.findFirst();
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: hash },
  });

  // Mark token as used
  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { used: true },
  });

  return NextResponse.json({ ok: true });
}
