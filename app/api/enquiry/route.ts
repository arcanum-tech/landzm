import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { listing_id, enquirer_name, enquirer_phone, message } = await req.json();
  if (!listing_id || !enquirer_name || !enquirer_phone) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from("land_enquiries").insert({ listing_id, enquirer_name, enquirer_phone, message });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
