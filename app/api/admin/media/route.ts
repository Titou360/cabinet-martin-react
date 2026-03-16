import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { readdir } from "fs/promises";
import { unlink } from "fs/promises";
import path from "path";

const ALLOWED_FOLDERS = ["img/blog", "img/avis", "img/equipe", "img/logos"];

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const folder = req.nextUrl.searchParams.get("folder") ?? "img/blog";
  if (!ALLOWED_FOLDERS.includes(folder)) {
    return NextResponse.json({ error: "Dossier non autorisé" }, { status: 403 });
  }

  const dir = path.join(process.cwd(), "public", folder);
  try {
    const files = await readdir(dir);
    const images = files.filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f));
    return NextResponse.json(images.map(name => ({ name, url: `/${folder}/${name}` })));
  } catch {
    return NextResponse.json([]);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { filePath } = await req.json();
  if (!filePath || !filePath.startsWith("/img/")) {
    return NextResponse.json({ error: "Chemin non autorisé" }, { status: 403 });
  }

  const publicDir = path.join(process.cwd(), "public");
  const absPath   = path.join(publicDir, filePath);
  if (!absPath.startsWith(publicDir)) {
    return NextResponse.json({ error: "Chemin non autorisé" }, { status: 403 });
  }

  try {
    await unlink(absPath);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }
}
