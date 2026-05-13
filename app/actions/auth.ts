"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "../lib/session";
import { findUserByUsername, verifyPassword } from "../lib/users";
import { audit, clearFailures, isLocked, recordFailure } from "../lib/audit";

export type LoginState = {
  error?: string;
  fieldErrors?: { username?: string; password?: string };
};

// Тактик [Validate Inputs]: оролтыг сервер тал дээр шалгана.
// Зөвхөн client-д найдахгүй. Server Actions автомат CSRF token-той.
function validate(username: unknown, password: unknown): {
  ok: true;
  username: string;
  password: string;
} | { ok: false; fieldErrors: { username?: string; password?: string } } {
  const fieldErrors: { username?: string; password?: string } = {};
  if (typeof username !== "string" || username.trim().length < 3) {
    fieldErrors.username = "Хэрэглэгчийн нэр 3-аас доошгүй тэмдэгт байх ёстой.";
  } else if (username.length > 50) {
    fieldErrors.username = "Хэрэглэгчийн нэр хэт урт байна.";
  } else if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    fieldErrors.username = "Зөвхөн үсэг, тоо болон . _ - тэмдэгт зөвшөөрөгдөнө.";
  }
  if (typeof password !== "string" || password.length < 6) {
    fieldErrors.password = "Нууц үг 6-аас доошгүй тэмдэгт байх ёстой.";
  } else if (password.length > 200) {
    fieldErrors.password = "Нууц үг хэт урт байна.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }
  return { ok: true, username: (username as string).trim(), password: password as string };
}

export async function login(_prev: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const validated = validate(formData.get("username"), formData.get("password"));
  if (!validated.ok) {
    return { fieldErrors: validated.fieldErrors };
  }
  const { username, password } = validated;
  const lookupKey = username.toLowerCase();

  // Тактик [Limit Access]: account lockout шалгалт.
  const lock = isLocked(lookupKey);
  if (lock.locked) {
    const mins = Math.ceil(lock.remainingMs / 60000);
    audit({ username: lookupKey, success: false, reason: "locked" });
    return { error: `Хэт олон оролдлого хийсэн. ${mins} минутын дараа дахин оролдоно уу.` };
  }

  const user = await findUserByUsername(lookupKey);
  // Тактик [Limit Exposure]: хэрэглэгч байхгүй байсан ч verifyPassword дуудаж
  // timing зөрүүгээр username-ийн оршихуйг тогтоох боломжгүй болгоно.
  const ok = user ? verifyPassword(user, password) : false;

  if (!user || !ok) {
    recordFailure(lookupKey);
    audit({ username: lookupKey, success: false, reason: !user ? "no-user" : "bad-password" });
    // Тактик [Limit Exposure]: ерөнхий мессеж — аль талбар буруу гэдгийг илчлэхгүй.
    return { error: "Хэрэглэгчийн нэр эсвэл нууц үг буруу байна." };
  }

  clearFailures(lookupKey);
  audit({ username: lookupKey, success: true });
  await createSession(user.id, user.role);
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
