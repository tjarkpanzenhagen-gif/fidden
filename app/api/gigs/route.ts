import { NextResponse } from "next/server";
import { DEFAULT_GIGS } from "@/lib/gigs";

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
    if (!redis) return NextResponse.json(DEFAULT_GIGS);
    const gigs = await redis.get("fidden_gigs");
    return NextResponse.json(gigs ?? DEFAULT_GIGS);
  } catch {
    return NextResponse.json(DEFAULT_GIGS);
  }
}

export async function POST(req: Request) {
  try {
    const redis = await getRedis();
    if (!redis) return NextResponse.json({ ok: false, error: "Redis nicht konfiguriert" }, { status: 503 });
    const gigs = await req.json();
    await redis.set("fidden_gigs", gigs);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
