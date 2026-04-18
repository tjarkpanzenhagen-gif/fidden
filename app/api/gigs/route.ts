import { NextResponse } from "next/server";
import { DEFAULT_GIGS } from "@/lib/gigs";

async function kv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function GET() {
  try {
    const db = await kv();
    if (!db) return NextResponse.json(DEFAULT_GIGS);
    const gigs = await db.get("fidden_gigs");
    return NextResponse.json(gigs ?? DEFAULT_GIGS);
  } catch {
    return NextResponse.json(DEFAULT_GIGS);
  }
}

export async function POST(req: Request) {
  try {
    const db = await kv();
    if (!db) return NextResponse.json({ ok: false, error: "KV nicht konfiguriert" }, { status: 503 });
    const gigs = await req.json();
    await db.set("fidden_gigs", gigs);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
