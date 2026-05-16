import { NextResponse } from "next/server";

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
    const pending = await redis.get<string[]>("fidden_pending");
    return NextResponse.json(pending ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
