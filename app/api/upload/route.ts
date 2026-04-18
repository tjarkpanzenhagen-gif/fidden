import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Nur JPG, PNG, WebP oder GIF erlaubt." }, { status: 400 });
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Datei zu groß (max. 8 MB)." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext    = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const name   = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, name), buffer);

    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload fehlgeschlagen. Bitte erneut versuchen." }, { status: 500 });
  }
}
