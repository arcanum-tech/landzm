import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("request_id");
  const sellerId = searchParams.get("seller_id");
  const status = searchParams.get("status");

  if (!requestId || !sellerId) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  if (status === "success") {
    await supabaseAdmin.from("deed_verification_requests")
      .update({ is_paid: true, status: "paid" })
      .eq("id", requestId);
    return NextResponse.redirect(new URL(`/seller/${sellerId}?verified=1`, req.url));
  }

  return NextResponse.redirect(new URL(`/seller/${sellerId}?verified=0`, req.url));
}
