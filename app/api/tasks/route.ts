import { NextResponse } from "next/server";
import { supabase, type TaskRow } from "../../lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as TaskRow[]);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.title || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: body.title,
      category: body.category ?? "Бусад",
      status: body.status ?? "pending",
      priority: body.priority ?? "medium",
      assignee: body.assignee ?? "",
      due_time: body.due_time ?? "",
      notes: body.notes ?? "",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as TaskRow, { status: 201 });
}
