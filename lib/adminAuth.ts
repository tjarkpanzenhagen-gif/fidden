const TTL_MS = 8 * 3600_000;

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? "fidden_local_dev_secret";
}

export async function createToken(): Promise<string> {
  const ts = Date.now().toString();
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(getSecret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(ts));
  const hex = Array.from(new Uint8Array(sig), b => b.toString(16).padStart(2, "0")).join("");
  return `${ts}.${hex}`;
}

export async function verifyToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const ts = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const age = Date.now() - Number(ts);
  if (isNaN(age) || age < 0 || age > TTL_MS) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(getSecret()), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
  );
  const pairs = sig.match(/.{2}/g);
  if (!pairs || pairs.length !== 32) return false;
  const sigBytes = Uint8Array.from(pairs.map(b => parseInt(b, 16)));
  return crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(ts));
}

export function getAuthToken(req: Request): string | null {
  return req.headers.get("authorization")?.replace(/^Bearer\s+/, "") ?? null;
}
