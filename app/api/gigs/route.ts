import { NextResponse } from "next/server";
import { DEFAULT_GIGS, type Gig } from "@/lib/gigs";
import { verifyToken, getAuthToken } from "@/lib/adminAuth";

async function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const { Redis } = await import("@upstash/redis");
  return new Redis({ url, token });
}

function utcDateISO(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

function processGigs(gigs: Gig[]): { result: Gig[]; pruned: boolean } {
  const today  = utcDateISO();
  const cutoff = utcDateISO(-3); // keep gigs up to 3 days after they happened

  const filtered = gigs.filter(g => g.date >= cutoff);

  // Upcoming first (ascending), then recent past (ascending) at the end
  const result = [...filtered].sort((a, b) => {
    const aFuture = a.date >= today;
    const bFuture = b.date >= today;
    if (aFuture !== bFuture) return aFuture ? -1 : 1;
    return a.date.localeCompare(b.date);
  });

  return { result, pruned: filtered.length !== gigs.length };
}

export async function GET() {
  try {
    const redis = await getRedis();
    if (!redis) {
      return NextResponse.json(processGigs(DEFAULT_GIGS).result);
    }
    const raw = await redis.get<Gig[]>("fidden_gigs");
    const gigs = raw ?? DEFAULT_GIGS;
    const { result, pruned } = processGigs(gigs);
    if (pruned && raw) {
      await redis.set("fidden_gigs", result);
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(processGigs(DEFAULT_GIGS).result);
  }
}

export async function POST(req: Request) {
  if (!(await verifyToken(getAuthToken(req)))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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
