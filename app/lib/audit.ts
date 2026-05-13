// Тактик [Limit Access]: brute force халдлагаас сэргийлэх — нэг хэрэглэгчийн нэр
// дээр буруу нэвтрэлтийн оролдлого 5 удаа давсан тохиолдолд 15 минут хүлээлгэнэ.
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

type Attempts = { count: number; firstAt: number; lockedUntil: number };
const attempts = new Map<string, Attempts>();

export function isLocked(username: string): { locked: boolean; remainingMs: number } {
  const a = attempts.get(username);
  if (!a) return { locked: false, remainingMs: 0 };
  const now = Date.now();
  if (a.lockedUntil > now) {
    return { locked: true, remainingMs: a.lockedUntil - now };
  }
  return { locked: false, remainingMs: 0 };
}

export function recordFailure(username: string) {
  const now = Date.now();
  const a = attempts.get(username);
  if (!a || now - a.firstAt > ATTEMPT_WINDOW_MS) {
    attempts.set(username, { count: 1, firstAt: now, lockedUntil: 0 });
    return;
  }
  a.count += 1;
  if (a.count >= MAX_FAILED_ATTEMPTS) {
    a.lockedUntil = now + LOCKOUT_MS;
  }
}

export function clearFailures(username: string) {
  attempts.delete(username);
}

// Тактик [Detect Attacks]: нэвтрэлтийн бүх оролдлогыг лог хийнэ.
// Бодит орчинд SIEM эсвэл logging service рүү дамжуулна.
type AuditEntry = {
  at: string;
  username: string;
  success: boolean;
  reason?: string;
};
const auditLog: AuditEntry[] = [];

export function audit(entry: Omit<AuditEntry, "at">) {
  const e: AuditEntry = { ...entry, at: new Date().toISOString() };
  auditLog.push(e);
  if (auditLog.length > 500) auditLog.shift();
  console.log(
    `[AUDIT] ${e.at} user="${e.username}" success=${e.success}` +
      (e.reason ? ` reason="${e.reason}"` : "")
  );
}

export function getAuditLog(): readonly AuditEntry[] {
  return auditLog;
}
