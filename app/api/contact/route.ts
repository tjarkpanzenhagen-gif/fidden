import { NextResponse } from "next/server";
import { verifyToken, getAuthToken } from "@/lib/adminAuth";

export interface ContactEntry {
  id: string;
  ts: number;
  name: string;
  email: string;
  tel?: string;
  msg: string;
  read: boolean;
}

async function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const { Redis } = await import("@upstash/redis");
  return new Redis({ url, token });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, tel, msg } = body;
    if (!name?.trim() || !email?.trim() || !msg?.trim()) {
      return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
    }
    const entry: ContactEntry = {
      id:    crypto.randomUUID(),
      ts:    Date.now(),
      name:  String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      tel:   tel ? String(tel).slice(0, 50) : undefined,
      msg:   String(msg).slice(0, 2000),
      read:  false,
    };
    const redis = await getRedis();
    if (redis) {
      const existing = (await redis.get<ContactEntry[]>("fidden_contacts")) ?? [];
      await redis.set("fidden_contacts", [...existing, entry]);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Senden." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const token = getAuthToken(req);
  if (!(await verifyToken(token))) {
    return NextResponse.json([], { status: 401 });
  }
  const redis = await getRedis();
  if (!redis) return NextResponse.json([]);
  const data = (await redis.get<ContactEntry[]>("fidden_contacts")) ?? [];
  return NextResponse.json(data.slice().sort((a, b) => b.ts - a.ts));
}

export async function PATCH(req: Request) {
  const token = getAuthToken(req);
  if (!(await verifyToken(token))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = await req.json();
  const { id } = body;
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ ok: false, error: "Ungültige ID" }, { status: 400 });
  }
  const redis = await getRedis();
  if (!redis) return NextResponse.json({ ok: false }, { status: 503 });
  const data = (await redis.get<ContactEntry[]>("fidden_contacts")) ?? [];
  const updated = data.map(e => e.id === id ? { ...e, read: true } : e);
  await redis.set("fidden_contacts", updated);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const token = getAuthToken(req);
  if (!(await verifyToken(token))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const redis = await getRedis();
  if (!redis) return NextResponse.json({ ok: false }, { status: 503 });
  await redis.set("fidden_contacts", []);
  return NextResponse.json({ ok: true });
}
