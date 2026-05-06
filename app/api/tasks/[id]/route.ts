import { NextResponse, type NextRequest } from "next/server";
import { supabase, type TaskRow } from "../../../lib/supabase";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const taskId = Number(id);
  if (!Number.isFinite(taskId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const body = await request.json();
  const patch: Record<string, unknown> = {};
  for (const k of ["title", "category", "status", "priority", "assignee", "due_time", "notes"]) {
    if (k in body) patch[k] = body[k];
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "no fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(patch)
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as TaskRow);
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const taskId = Number(id);
  if (!Number.isFinite(taskId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
