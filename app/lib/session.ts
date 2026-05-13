import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { UserRole } from "./users";

export const SESSION_COOKIE = "ldry_session";
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 минут — Тактик [Recover]: session-ийн хугацаа дуусна.

// Тактик [Confidentiality]: secret-ийг env-ээс авна. Дев орчинд default
// утга байгаа ч production-д заавал SESSION_SECRET тохируулна.
const SECRET = process.env.SESSION_SECRET ?? "dev-only-secret-change-in-production";

export type SessionPayload = {
  userId: number;
  role: UserRole;
  exp: number;
  sid: string;
};

function b64urlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

// Тактик [Integrity]: payload-ыг HMAC-SHA256-оор гарын үсэг зурснаар
// клиент талаас засварлах боломжгүй болгоно.
function sign(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  const data = b64urlEncode(Buffer.from(json, "utf-8"));
  const sig = createHmac("sha256", SECRET).update(data).digest();
  return `${data}.${b64urlEncode(sig)}`;
}

export function verifyToken(token: string): SessionPayload | null {
  const dot = token.indexOf(".");
  if (dot < 1) return null;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", SECRET).update(data).digest();
  const provided = b64urlDecode(sig);
  if (expected.length !== provided.length) return null;
  if (!timingSafeEqual(expected, provided)) return null;
  try {
    const payload = JSON.parse(b64urlDecode(data).toString("utf-8")) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (typeof payload.userId !== "number") return null;
    if (payload.role !== "admin" && payload.role !== "user") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(userId: number, role: UserRole) {
  const exp = Date.now() + SESSION_TTL_MS;
  const sid = randomBytes(16).toString("hex");
  const token = sign({ userId, role, exp, sid });
  const cookieStore = await cookies();
  // Тактик [Confidentiality + Limit Exposure]:
  //   httpOnly  → client JS-ээс уншиж чадахгүй (XSS-аас сэргийлнэ)
  //   secure    → production-д зөвхөн HTTPS-ээр илгээгдэнэ
  //   sameSite  → CSRF халдлагаас үндсэн хамгаалалт (lax)
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(exp),
  });
}

export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
