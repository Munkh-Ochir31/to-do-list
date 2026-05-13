// Supabase-д анхны хэрэглэгчдийг seed хийх скрипт.
// Ажиллуулах: node --env-file=.env.local scripts/seed-users.mjs

import { createClient } from "@supabase/supabase-js";
import { scryptSync, randomBytes } from "node:crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL эсвэл key тохируулаагүй байна.");
  process.exit(1);
}

const supabase = createClient(url, key);

function hashPassword(password, salt) {
  return scryptSync(password, salt, 64).toString("hex");
}

const users = [
  { username: "admin",    name: "Админ",        role: "admin", password: "Admin@123"  },
  { username: "monkhbat", name: "Б. Мөнхбат",   role: "user",  password: "Password1!" },
  { username: "sarnai",   name: "О. Сарнай",    role: "user",  password: "Password1!" },
];

for (const u of users) {
  const password_salt = randomBytes(16).toString("hex");
  const password_hash = hashPassword(u.password, password_salt);
  const { error } = await supabase
    .from("users")
    .upsert(
      { username: u.username, name: u.name, role: u.role, password_hash, password_salt },
      { onConflict: "username" }
    );
  if (error) {
    console.error(`Алдаа [${u.username}]:`, error.message);
  } else {
    console.log(`✓ ${u.username} (${u.role})`);
  }
}
