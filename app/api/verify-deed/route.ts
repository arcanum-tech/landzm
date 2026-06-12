import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// POST — seller submits verification request (after payment)
export async function POST(req: NextRequest) {
  const { listing_id, seller_id, title_deed_number, notes } = await req.json();
  if (!listing_id || !seller_id) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { data, error } = await supabaseAdmin.from("deed_verification_requests").insert({
    listing_id, seller_id, title_deed_number, notes, is_paid: false, status: "pending",
  }).select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}

// PATCH — admin updates status (verify or reject)
export async function PATCH(req: NextRequest) {
  const adminPassword = req.headers.get("x-admin-password");
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { request_id, status, admin_notes } = await req.json();
  if (!request_id || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Update the request
  await supabaseAdmin.from("deed_verification_requests")
    .update({ status, admin_notes, updated_at: new Date().toISOString() })
    .eq("id", request_id);

  // If verified, update the listing title_deed_status too
  if (status === "verified") {
    const { data: req_ } = await supabaseAdmin.from("deed_verification_requests")
      .select("listing_id").eq("id", request_id).single();
    if (req_?.listing_id) {
      await supabaseAdmin.from("land_listings")
        .update({ title_deed_status: "verified" })
        .eq("id", req_.listing_id);
    }
  }

  return NextResponse.json({ ok: true });
}
