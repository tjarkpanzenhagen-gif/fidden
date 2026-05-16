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
  type?: "general" | "booking_request";
  requestDate?: string; // ISO date, only for booking_request
  status?: "pending" | "accepted" | "declined";
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
    const { name, email, tel, msg, type, requestDate } = body;
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
    }
    const isBooking = type === "booking_request" && typeof requestDate === "string" && requestDate.match(/^\d{4}-\d{2}-\d{2}$/);

    const entry: ContactEntry = {
      id:    crypto.randomUUID(),
      ts:    Date.now(),
      name:  String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      tel:   tel ? String(tel).slice(0, 50) : undefined,
      msg:   msg ? String(msg).slice(0, 2000) : "",
      read:  false,
      ...(isBooking && {
        type: "booking_request",
        requestDate: String(requestDate),
        status: "pending",
      }),
    };

    const redis = await getRedis();
    if (redis) {
      const existing = (await redis.get<ContactEntry[]>("fidden_contacts")) ?? [];
      await redis.set("fidden_contacts", [...existing, entry]);

      if (isBooking && entry.requestDate) {
        const pendingList = (await redis.get<string[]>("fidden_pending")) ?? [];
        if (!pendingList.includes(entry.requestDate)) {
          await redis.set("fidden_pending", [...pendingList, entry.requestDate]);
        }
      }
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
  const { id, action } = body;
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ ok: false, error: "Ungültige ID" }, { status: 400 });
  }

  const redis = await getRedis();
  if (!redis) return NextResponse.json({ ok: false }, { status: 503 });

  const contacts = (await redis.get<ContactEntry[]>("fidden_contacts")) ?? [];
  const entry = contacts.find(e => e.id === id);

  if (action === "accept" || action === "decline") {
    const status = action === "accept" ? "accepted" : "declined";
    const updated = contacts.map(e => e.id === id ? { ...e, status, read: true } : e);
    await redis.set("fidden_contacts", updated);

    if (entry?.requestDate) {
      // Always remove from pending
      const pendingList = (await redis.get<string[]>("fidden_pending")) ?? [];
      await redis.set("fidden_pending", pendingList.filter(d => d !== entry.requestDate));

      if (action === "accept") {
        // Remove from bookable — day is now booked
        const bookings = (await redis.get<string[]>("fidden_bookings")) ?? [];
        await redis.set("fidden_bookings", bookings.filter(d => d !== entry.requestDate));
      }
    }
    return NextResponse.json({ ok: true });
  }

  // Default: mark as read
  const updated = contacts.map(e => e.id === id ? { ...e, read: true } : e);
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
  await redis.set("fidden_pending", []);
  return NextResponse.json({ ok: true });
}
