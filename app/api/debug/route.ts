import { NextResponse } from "next/server";

export async function GET() {
  const keys = Object.keys(process.env).filter(k =>
    k.includes("REDIS") || k.includes("UPSTASH") || k.includes("KV")
  );
  return NextResponse.json(keys);
}
