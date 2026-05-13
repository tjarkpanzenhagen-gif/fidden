import { NextResponse } from "next/server";
import { verifyToken, getAuthToken } from "@/lib/adminAuth";

async function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const { Redis } = await import("@upstash/redis");
  return new Redis({ url, token });
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
  if (!(await verifyToken(getAuthToken(req)))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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
