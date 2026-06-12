import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get("seller_id");
  const status = searchParams.get("status");

  if (!sellerId) return NextResponse.json({ error: "Missing seller_id" }, { status: 400 });

  if (status === "success") {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    await supabaseAdmin.from("land_sellers").update({
      subscription_tier: "pro",
      subscription_expires_at: expires.toISOString(),
    }).eq("id", sellerId);
    return NextResponse.redirect(new URL(`/seller/${sellerId}?upgraded=1`, req.url));
  }

  return NextResponse.redirect(new URL(`/seller/${sellerId}?upgraded=0`, req.url));
}
