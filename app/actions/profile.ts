"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "../lib/dal";
import {
  findUserById,
  setUserPassword,
  updateUserName,
  verifyPassword,
} from "../lib/users";
import { audit } from "../lib/audit";

export type ProfileState = {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: { name?: string };
};

export type PasswordState = {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
};

// Тактик [Validate Inputs]: нэрийг сервер тал дээр шалгана.
function validateName(raw: unknown): { ok: true; name: string } | { ok: false; error: string } {
  if (typeof raw !== "string") return { ok: false, error: "Нэр буруу байна." };
  const name = raw.trim();
  if (name.length < 2) return { ok: false, error: "Нэр 2-аас доошгүй тэмдэгт байх ёстой." };
  if (name.length > 80) return { ok: false, error: "Нэр хэт урт байна." };
  // Тактик [Validate Inputs]: HTML/XSS тэмдэгт хязгаарлана.
  if (/[<>]/.test(name)) return { ok: false, error: "Зөвшөөрөгдөөгүй тэмдэгт байна." };
  return { ok: true, name };
}

export async function updateProfile(
  _prev: ProfileState | undefined,
  formData: FormData
): Promise<ProfileState> {
  // Тактик [Authorize]: server action бүрд session-ийг дахин шалгана.
  const session = await verifySession();
  const v = validateName(formData.get("name"));
  if (!v.ok) {
    return { fieldErrors: { name: v.error } };
  }
  const updated = await updateUserName(session.userId, v.name);
  if (!updated) {
    return { error: "Хэрэглэгч олдсонгүй." };
  }
  audit({ username: updated.username, success: true, reason: "profile-name-updated" });
  revalidatePath("/profile");
  revalidatePath("/");
  return { ok: true, message: "Нэр амжилттай шинэчлэгдлээ." };
}

// Нууц үгийн нарийвчлал шалгалт.
function validateNewPassword(raw: unknown): { ok: true; password: string } | { ok: false; error: string } {
  if (typeof raw !== "string") return { ok: false, error: "Нууц үг буруу байна." };
  if (raw.length < 8) return { ok: false, error: "8-аас доошгүй тэмдэгт байх ёстой." };
  if (raw.length > 200) return { ok: false, error: "Нууц үг хэт урт байна." };
  if (!/[a-zA-Z]/.test(raw)) return { ok: false, error: "Үсэг агуулсан байх ёстой." };
  if (!/[0-9]/.test(raw)) return { ok: false, error: "Тоо агуулсан байх ёстой." };
  if (!/[^a-zA-Z0-9]/.test(raw)) return { ok: false, error: "Тусгай тэмдэгт агуулсан байх ёстой." };
  return { ok: true, password: raw };
}

export async function changePassword(
  _prev: PasswordState | undefined,
  formData: FormData
): Promise<PasswordState> {
  const session = await verifySession();
  const user = await findUserById(session.userId);
  if (!user) {
    return { error: "Хэрэглэгч олдсонгүй." };
  }

  const currentPassword = formData.get("currentPassword");
  const newPasswordRaw = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  const fieldErrors: PasswordState["fieldErrors"] = {};
  if (typeof currentPassword !== "string" || currentPassword.length === 0) {
    fieldErrors.currentPassword = "Одоогийн нууц үгээ оруулна уу.";
  }
  const newValid = validateNewPassword(newPasswordRaw);
  if (!newValid.ok) {
    fieldErrors.newPassword = newValid.error;
  }
  if (typeof confirmPassword !== "string" || confirmPassword !== newPasswordRaw) {
    fieldErrors.confirmPassword = "Шинэ нууц үг таарахгүй байна.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  // Тактик [Authenticate / Re-auth]: чухал үйлдэл хийхдээ
  // одоогийн нууц үгийг дахин шалгана.
  if (!verifyPassword(user, currentPassword as string)) {
    audit({ username: user.username, success: false, reason: "pw-change-bad-current" });
    // Тактик [Limit Exposure]: ерөнхий мессеж.
    return { error: "Одоогийн нууц үг буруу байна." };
  }

  // Тактик [Confidentiality]: шинэ нууц үг хуучинтайгаа адил байж болохгүй.
  if (verifyPassword(user, newValid.ok ? newValid.password : "")) {
    return { error: "Шинэ нууц үг хуучин нууц үгтэй адил байж болохгүй." };
  }

  await setUserPassword(user.id, newValid.ok ? newValid.password : "");
  audit({ username: user.username, success: true, reason: "pw-changed" });
  return { ok: true, message: "Нууц үг амжилттай шинэчлэгдлээ." };
}
