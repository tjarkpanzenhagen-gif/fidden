import { NextResponse } from "next/server";

async function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export async function GET() {
  try {
    const redis = await getRedis();
    if (!redis) return NextResponse.json([]);
    const dates = await redis.get("fidden_bookings");
    return NextResponse.json(dates ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const redis = await getRedis();
    if (!redis) return NextResponse.json({ ok: false, error: "Redis nicht konfiguriert" }, { status: 503 });
    const dates = await req.json();
    await redis.set("fidden_bookings", dates);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
