import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const area = searchParams.get("area");
  const type = searchParams.get("type");
  const max = searchParams.get("max");

  let query = supabase.from("land_listings")
    .select("*, land_sellers(name, is_verified)")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (area) query = query.eq("area", area);
  if (type) query = query.eq("land_type", type);
  if (max) query = query.lte("price_zmw", parseFloat(max));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ listings: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { seller_id, title, area, district, size_acres, price_zmw, land_type, title_deed_status, description, contact_phone } = body;

  if (!title || !area || !price_zmw || !land_type || !contact_phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from("land_listings").insert({
    seller_id: seller_id || null,
    title, area, district: district || "Lusaka",
    size_acres: size_acres || null,
    price_zmw, land_type,
    title_deed_status: title_deed_status || "pending",
    description: description || null,
    contact_phone,
  }).select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
