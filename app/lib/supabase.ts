import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

export const supabase = createClient(url, anon);

export type TaskRow = {
  id: number;
  title: string;
  category: string;
  status: string;
  priority: string;
  assignee: string;
  due_time: string;
  notes: string;
  created_at: string;
};

export type StatusRow = {
  id: string;
  label: string;
  color: string;
  bg: string;
  dot: string;
  pulse: boolean;
  is_done: boolean;
  sort_order: number;
};
