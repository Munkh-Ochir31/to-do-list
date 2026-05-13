import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { db } from "./db";

export type UserRole = "admin" | "user";

export type User = {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  passwordSalt: string;
};

type UserRow = {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  password_hash: string;
  password_salt: string;
};

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    role: row.role,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
  };
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("username", username)
    .single();
  if (error || !data) return null;
  return rowToUser(data as UserRow);
}

export async function findUserById(id: number): Promise<User | null> {
  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return rowToUser(data as UserRow);
}

// Тактик [Limit Exposure]: timing attack-аас сэргийлэхийн тулд
// timingSafeEqual ашиглан тогтмол хугацаанд харьцуулна.
export function verifyPassword(user: User, password: string): boolean {
  const computed = scryptSync(password, user.passwordSalt, 64);
  const stored = Buffer.from(user.passwordHash, "hex");
  if (computed.length !== stored.length) return false;
  return timingSafeEqual(computed, stored);
}

export async function updateUserName(userId: number, name: string): Promise<User | null> {
  const { data, error } = await db
    .from("users")
    .update({ name })
    .eq("id", userId)
    .select()
    .single();
  if (error || !data) return null;
  return rowToUser(data as UserRow);
}

// Тактик [Confidentiality]: нууц үг солихдоо шинэ salt үүсгэж дахин hash хийнэ.
export async function setUserPassword(userId: number, newPassword: string): Promise<User | null> {
  const passwordSalt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(newPassword, passwordSalt, 64).toString("hex");
  const { data, error } = await db
    .from("users")
    .update({ password_hash: passwordHash, password_salt: passwordSalt })
    .eq("id", userId)
    .select()
    .single();
  if (error || !data) return null;
  return rowToUser(data as UserRow);
}
