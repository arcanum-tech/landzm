import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { phone, name } = await req.json();
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  const normalized = phone.replace(/\s+/g, "").replace(/^\+26/, "0").replace(/^26/, "0");

  // Try find existing
  const { data: existing } = await supabaseAdmin.from("land_sellers").select("id").eq("phone", normalized).single();
  if (existing) return NextResponse.json({ id: existing.id });

  // Create new
  if (!name) return NextResponse.json({ error: "Name required for new sellers" }, { status: 400 });
  const { data, error } = await supabaseAdmin.from("land_sellers").insert({ phone: normalized, name }).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
