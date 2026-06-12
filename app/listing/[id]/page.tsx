import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import EnquiryForm from "./EnquiryForm";

export const dynamic = "force-dynamic";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: l } = await supabase.from("land_listings")
    .select("*, land_sellers(name, phone, is_verified)")
    .eq("id", id).single();
  if (!l) return notFound();

  const deedColor = (s: string) => {
    if (s === "verified") return { bg: "#d1fae5", text: "#065f46", label: "✓ Title Deed Verified" };
    if (s === "pending") return { bg: "#fef3c7", text: "#92400e", label: "⏳ Deed Pending Verification" };
    return { bg: "#fee2e2", text: "#991b1b", label: "⚠ No Title Deed — Proceed with Caution" };
  };
  const deed = deedColor(l.title_deed_status);

  return (
    <div className="min-h-screen" style={{ background: "#fffbeb" }}>
      <header style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }} className="text-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-amber-200 hover:text-white text-sm">← Back</Link>
          <h1 className="text-lg font-black">LandZM 🏡</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
            <h2 className="text-2xl font-black text-gray-900">{l.title}</h2>
            <span className="text-xs px-3 py-1 rounded-full font-semibold capitalize"
              style={{ background: "#fef3c7", color: "#92400e" }}>{l.land_type}</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">📍 {l.area}, {l.district}{l.size_acres ? ` · ${l.size_acres} acres` : ""}</p>
          <span className="text-sm font-bold px-3 py-1.5 rounded-full inline-block mb-4"
            style={{ background: deed.bg, color: deed.text }}>{deed.label}</span>
          <p className="text-3xl font-black mb-2" style={{ color: "#b45309" }}>ZMW {Number(l.price_zmw).toLocaleString()}</p>
          {l.description && <p className="text-sm text-gray-600 leading-relaxed">{l.description}</p>}
        </div>

        {/* Fraud warning if no deed */}
        {l.title_deed_status === "none" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
            <p className="font-black mb-1">⚠ Land Fraud Risk</p>
            <p>This listing has no title deed on record. Do NOT pay any money until you have independently verified ownership at the Lands & Deeds Registry.</p>
          </div>
        )}

        {/* Seller info */}
        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
          <p className="font-black text-gray-800 mb-3">Seller</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm"
              style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
              {l.land_sellers?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{l.land_sellers?.name}</p>
              {l.land_sellers?.is_verified && <p className="text-xs text-blue-600 font-semibold">✓ Verified Seller</p>}
            </div>
          </div>
          <div className="flex gap-3">
            <a href={`tel:${l.contact_phone}`}
              className="flex-1 text-center text-white font-black py-3 rounded-xl text-sm"
              style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
              📞 Call Seller
            </a>
            <a href={`https://wa.me/26${l.contact_phone.replace(/^0/, "")}`} target="_blank"
              className="flex-1 text-center font-black py-3 rounded-xl text-sm border-2"
              style={{ borderColor: "#b45309", color: "#b45309" }}>
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* Enquiry form */}
        <EnquiryForm listingId={l.id} />

        <div className="bg-white rounded-2xl p-4 border border-amber-100 text-xs text-gray-500">
          <p className="font-black text-gray-700 mb-1">🛡 Buyer Safety Tips</p>
          <ul className="space-y-1">
            <li>• Visit the Lands & Deeds Registry to verify title deed ownership</li>
            <li>• Never pay a deposit before physical inspection</li>
            <li>• Use a certified lawyer for all land transactions</li>
            <li>• Verified Seller badge means phone was confirmed — not a title deed verification</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
