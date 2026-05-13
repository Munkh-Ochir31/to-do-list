import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Service role key-г серверт ашиглана (RLS-г тойрч гарна).
// .env.local-д SUPABASE_SERVICE_ROLE_KEY тохируулаагүй бол anon key ашиглана.
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const db = createClient(url, key);
