import { NextResponse } from "next/server";
import { supabase, type StatusRow } from "../../lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("statuses")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as StatusRow[]);
}

// Bulk replace: client sends the full ordered list, server diffs against existing.
export async function PUT(request: Request) {
  const body = await request.json();
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "expected array of statuses" }, { status: 400 });
  }

  const list = body as Array<Partial<StatusRow>>;
  for (const s of list) {
    if (!s.id || !s.label) {
      return NextResponse.json(
        { error: "each status requires id and label" },
        { status: 400 }
      );
    }
  }

  const { data: existing, error: fetchErr } = await supabase
    .from("statuses")
    .select("id");
  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }

  const existingIds = new Set((existing as { id: string }[]).map((s) => s.id));
  const newIds = new Set(list.map((s) => s.id as string));
  const toDelete = [...existingIds].filter((id) => !newIds.has(id));

  if (toDelete.length) {
    const { error } = await supabase.from("statuses").delete().in("id", toDelete);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const rows = list.map((s, i) => ({
    id: s.id as string,
    label: s.label as string,
    color: s.color ?? "#525252",
    bg: s.bg ?? "#e5e5e5",
    dot: s.dot ?? "#525252",
    pulse: s.pulse ?? false,
    is_done: s.is_done ?? false,
    sort_order: i,
  }));

  const { error: upsertErr } = await supabase
    .from("statuses")
    .upsert(rows, { onConflict: "id" });
  if (upsertErr) {
    return NextResponse.json({ error: upsertErr.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("statuses")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as StatusRow[]);
}
