import Link from "next/link";
import { supabase } from "@/lib/supabase";
import HeaderAuth from "./HeaderAuth";

const AREAS = ["All Areas", "Lusaka", "Chilanga", "Kafue", "Chongwe", "Kabwe", "Ndola", "Kitwe", "Livingstone"];
const TYPES = ["All Types", "Residential", "Commercial", "Agricultural", "Industrial"];

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ area?: string; type?: string; max?: string }> }) {
  const sp = await searchParams;
  const area = sp.area || "";
  const type = sp.type || "";
  const max = sp.max ? parseFloat(sp.max) : null;

  let query = supabase
    .from("land_listings")
    .select("*, land_sellers(name, is_verified)")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (area && area !== "All Areas") query = query.eq("area", area);
  if (type && type !== "All Types") query = query.ilike("land_type", type);
  if (max) query = query.lte("price_zmw", max);

  const { data: listings } = await query;

  const deedColor = (status: string) => {
    if (status === "verified") return { bg: "#d1fae5", text: "#065f46", label: "✓ Title Deed Verified" };
    if (status === "pending") return { bg: "#fef3c7", text: "#92400e", label: "⏳ Deed Pending Verification" };
    return { bg: "#fee2e2", text: "#991b1b", label: "⚠ No Title Deed" };
  };

  return (
    <div className="min-h-screen" style={{ background: "#fffbeb", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }} className="text-white px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "rgba(255,255,255,0.2)" }}>🏡</div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">LandZM</h1>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Verified Land & Property 🇿🇲</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/list" className="text-xs font-bold px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
              List Your Land →
            </Link>
            <HeaderAuth />
          </div>
        </div>
      </header>

      <section style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }} className="text-white px-6 pt-10 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(255,255,255,0.15)" }}>
            🛡 Fighting land fraud in Zambia
          </div>
          <h2 className="text-4xl font-black mb-3 leading-tight">
            Find land you can<br />
            <span style={{ color: "#fde68a" }}>actually trust.</span>
          </h2>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.8)" }}>
            Every listing shows title deed status. Know what you&apos;re buying before you pay.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs mb-6">
            {["Title Deed Status Shown", "Direct Seller Contact", "Free to List", "All Districts"].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full font-semibold" style={{ background: "rgba(255,255,255,0.2)" }}>{t}</span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#listings" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white"
              style={{ background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.4)" }}>
              Browse Listings ↓
            </a>
            <Link href="/list" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm"
              style={{ background: "#fde68a", color: "#92400e" }}>
              List Your Land →
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 -mt-6">
        <form className="bg-white rounded-2xl shadow-lg p-4 flex flex-wrap gap-3 border border-amber-100">
          <select name="area" defaultValue={area}
            className="flex-1 min-w-[140px] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50">
            {AREAS.map((a) => <option key={a}>{a}</option>)}
          </select>
          <select name="type" defaultValue={type}
            className="flex-1 min-w-[140px] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50">
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input name="max" type="number" placeholder="Max price (ZMW)" defaultValue={max ?? ""}
            className="flex-1 min-w-[160px] border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50" />
          <button type="submit" className="text-white font-black px-5 py-2.5 rounded-xl text-sm"
            style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
            Search
          </button>
        </form>
      </section>

      {/* Services Section */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#b45309" }}>Professional Services</p>
          <h3 className="text-2xl font-black text-gray-900">We can help you further</h3>
          <p className="text-sm text-gray-500 mt-1">Facilitated by ARCANUM TECH LIMITED · executed by licensed Zambian lawyers</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link href="/services/title-verification"
            className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
              style={{ background: "#fef3c7" }}>🔍</div>
            <h4 className="font-black text-gray-900 text-lg mb-2 group-hover:text-amber-700 transition-colors">Title Deed Verification</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Before you buy, we verify the title deed is genuine at the Ministry of Lands. Check for fraud, encumbrances, and real ownership.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Ministry of Lands check", "Fraud detection", "48-hr report"].map(t => (
                <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#fef3c7", color: "#92400e" }}>{t}</span>
              ))}
            </div>
            <span className="text-sm font-black" style={{ color: "#b45309" }}>Request Verification →</span>
          </Link>

          <Link href="/services/conveyancing"
            className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
              style={{ background: "#fef3c7" }}>⚖️</div>
            <h4 className="font-black text-gray-900 text-lg mb-2 group-hover:text-amber-700 transition-colors">Conveyancing</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Full property transfer handled end-to-end. Sale agreements, title transfer at Ministry of Lands, stamp duty, and final title in your name.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Sale agreement", "Title transfer", "Stamp duty"].map(t => (
                <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#fef3c7", color: "#92400e" }}>{t}</span>
              ))}
            </div>
            <span className="text-sm font-black" style={{ color: "#b45309" }}>Request Conveyancing →</span>
          </Link>
        </div>
      </section>

      <section id="listings" className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-sm text-gray-500 mb-5">{listings?.length ?? 0} listings found</p>
        {!listings?.length ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🏜</p>
            <p className="font-semibold">No listings yet.</p>
            <Link href="/seller/login" className="text-sm font-bold mt-2 inline-block" style={{ color: "#b45309" }}>Be the first to list →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((l: any) => {
              const deed = deedColor(l.title_deed_status);
              return (
                <Link key={l.id} href={`/listing/${l.id}`}
                  className="bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                  {l.is_featured && (
                    <div className="text-xs font-black text-white text-center py-1" style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
                      ⭐ FEATURED
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-black text-gray-900 text-sm leading-snug group-hover:text-amber-700 transition-colors">{l.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize shrink-0"
                        style={{ background: "#fef3c7", color: "#92400e" }}>{l.land_type}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">📍 {l.area}, {l.district}{l.size_acres ? ` · ${l.size_acres} acres` : ""}</p>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full block w-fit mb-3"
                      style={{ background: deed.bg, color: deed.text }}>{deed.label}</span>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black" style={{ color: "#b45309" }}>ZMW {Number(l.price_zmw).toLocaleString()}</span>
                      {l.land_sellers?.is_verified && (
                        <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">✓ Verified Seller</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <footer className="text-center py-8 text-xs" style={{ background: "#111827", color: "#9ca3af" }}>
        <p className="text-white font-black text-base mb-1">LandZM 🏡</p>
        <p className="mb-1">Powered by <span style={{ color: "#fde68a" }}>ARCANUM TECH LIMITED</span> · TPIN: 2003723894 · Lusaka, Zambia</p>
        <p style={{ color: "#6b7280" }}>Always verify title deeds independently before making payment.</p>
      </footer>
    </div>
  );
}
