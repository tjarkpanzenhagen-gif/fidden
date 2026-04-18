import { NextResponse } from "next/server";

async function kv() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function GET() {
  try {
    const db = await kv();
    if (!db) return NextResponse.json([]);
    const dates = await db.get("fidden_bookings");
    return NextResponse.json(dates ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const db = await kv();
    if (!db) return NextResponse.json({ ok: false, error: "KV nicht konfiguriert" }, { status: 503 });
    const dates = await req.json();
    await db.set("fidden_bookings", dates);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
