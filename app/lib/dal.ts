import { cache } from "react";
import { redirect } from "next/navigation";
import { readSession } from "./session";
import { findUserById, type UserRole } from "./users";

// Тактик [Authorize / Limit Access]: хандалтын шалгалт нэг газар төвлөрсөн —
// Data Access Layer. Render-ийн доторх бүх дуудалтыг React.cache-ээр memoize хийнэ.
export const verifySession = cache(async () => {
  const session = await readSession();
  if (!session) {
    redirect("/login");
  }
  return { userId: session.userId, role: session.role };
});

// DTO: зөвхөн UI-д шаардлагатай талбаруудыг буцаана.
// passwordHash, salt зэргийг хэзээ ч client рүү дамжуулахгүй.
export type UserDTO = {
  id: number;
  username: string;
  name: string;
  role: UserRole;
};

export const getUser = cache(async (): Promise<UserDTO | null> => {
  const session = await readSession();
  if (!session) return null;
  const u = await findUserById(session.userId);
  if (!u) return null;
  return { id: u.id, username: u.username, name: u.name, role: u.role };
});
