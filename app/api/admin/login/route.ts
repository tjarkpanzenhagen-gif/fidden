import { NextResponse } from "next/server";
import { createToken } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const { user, pass } = await req.json();
    const validUser = process.env.ADMIN_USER ?? "Fiete_Rasser";
    const validPass = process.env.ADMIN_PASS ?? "12345";
    if (user !== validUser || pass !== validPass) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const token = await createToken();
    return NextResponse.json({ ok: true, token });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
