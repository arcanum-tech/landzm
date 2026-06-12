import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SellerDashboard({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ upgraded?: string; verified?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const { data: seller } = await supabaseAdmin.from("land_sellers").select("*").eq("id", id).single();
  if (!seller) return notFound();

  const { data: listings } = await supabaseAdmin.from("land_listings")
    .select("*, land_enquiries(count)")
    .eq("seller_id", id)
    .order("created_at", { ascending: false });

  const isPro = seller.subscription_tier === "pro" && seller.subscription_expires_at
    && new Date(seller.subscription_expires_at) > new Date();

  const payUrl = `https://arcanum-payments.vercel.app/pay?app=landzm&product=LandZM+PRO&amount=150&callback=${encodeURIComponent(`https://landzm.vercel.app/api/subscription?seller_id=${id}&status=success`)}`;

  const deedBadge = (s: string) => {
    if (s === "verified") return { bg: "#d1fae5", text: "#065f46", label: "✓ Verified" };
    if (s === "pending") return { bg: "#fef3c7", text: "#92400e", label: "⏳ Pending" };
    return { bg: "#fee2e2", text: "#991b1b", label: "⚠ No Deed" };
  };

  return (
    <div className="min-h-screen" style={{ background: "#fffbeb" }}>
      <header style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }} className="text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-black text-lg">LandZM 🏡</h1>
            <p className="text-xs opacity-70">{seller.name}</p>
          </div>
          <Link href="/list" className="text-xs font-black px-4 py-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}>+ New Listing</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {sp.verified === "1" && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-5 py-3 text-sm font-semibold">
            🛡 Verification request submitted! We will check at the Lands & Deeds Registry within 1–3 business days.
          </div>
        )}
        {sp.verified === "0" && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm font-semibold">
            Payment was not completed. Try the verification request again.
          </div>
        )}
        {sp.upgraded === "1" && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-3 text-sm font-semibold">
            🎉 You are now PRO! Your listings get featured placement.
          </div>
        )}
        {sp.upgraded === "0" && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm font-semibold">
            Payment was not completed. Try again below.
          </div>
        )}

        {/* Plan */}
        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-black text-gray-800">{isPro ? "⭐ PRO Plan" : "Free Plan"}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {isPro
                  ? `Featured until ${new Date(seller.subscription_expires_at).toLocaleDateString("en-ZM")}`
                  : "Free: Unlimited listings · Buyers see your contact directly"}
              </p>
            </div>
            {!isPro && (
              <a href={payUrl} className="text-white font-black text-xs px-4 py-2 rounded-full"
                style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
                Upgrade to PRO — ZMW 150/mo
              </a>
            )}
          </div>
          {!isPro && (
            <p className="text-xs text-gray-400 mt-3">PRO: Your listings appear at the top of search results with ⭐ Featured badge</p>
          )}
        </div>

        {/* Listings */}
        <div>
          <h2 className="font-black text-gray-800 mb-3">Your Listings ({listings?.length ?? 0})</h2>
          {!listings?.length ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-amber-100 text-gray-400">
              <p className="text-3xl mb-2">🏜</p>
              <p className="text-sm">No listings yet.</p>
              <Link href={`/list?seller_id=${id}`} className="text-sm font-bold mt-2 inline-block" style={{ color: "#b45309" }}>
                Add your first listing →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((l: any) => {
                const deed = deedBadge(l.title_deed_status);
                const enquiries = l.land_enquiries?.[0]?.count ?? 0;
                return (
                  <div key={l.id} className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-black text-gray-800 text-sm">{l.title}</p>
                        <p className="text-xs text-gray-500">{l.area}, {l.district} · ZMW {Number(l.price_zmw).toLocaleString()}</p>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                          style={{ background: deed.bg, color: deed.text }}>{deed.label}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-400">{enquiries} enquir{enquiries === 1 ? "y" : "ies"}</p>
                        <Link href={`/listing/${l.id}`} className="text-xs font-bold" style={{ color: "#b45309" }}>View →</Link>
                      </div>
                    </div>
                    {l.title_deed_status !== "verified" && (
                      <Link href={`/verify/${l.id}`}
                        className="block text-center text-xs font-black py-2 rounded-xl border-2"
                        style={{ borderColor: "#b45309", color: "#b45309" }}>
                        🛡 Get ✓ Verified Badge — ZMW 50
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Link href={`/list?seller_id=${id}`}
          className="block w-full text-center text-white font-black py-4 rounded-xl text-sm"
          style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
          + Add New Listing
        </Link>
      </main>
    </div>
  );
}
