"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const AREAS = ["Lusaka", "Chilanga", "Kafue", "Chongwe", "Kabwe", "Ndola", "Kitwe", "Livingstone", "Other"];
const DISTRICTS = ["Lusaka", "Kafue", "Chongwe", "Chilanga", "Kabwe", "Ndola", "Kitwe", "Livingstone", "Other"];
const TYPES = ["residential", "commercial", "agricultural", "industrial"];
const DEED_STATUSES = [
  { value: "verified", label: "✓ I have a registered Title Deed" },
  { value: "pending", label: "⏳ Title Deed is being processed" },
  { value: "none", label: "⚠ No Title Deed / Informal Offer Letter" },
];

function ListForm() {
  const searchParams = useSearchParams();
  const sellerId = searchParams.get("seller_id") ?? "";
  const router = useRouter();

  const CACHE_KEY = `landzm_list_${sellerId || "guest"}`;
  const [form, setForm] = useState({
    seller_id: sellerId,
    title: "", area: "Lusaka", district: "Lusaka", size_acres: "",
    price_zmw: "", land_type: "residential", title_deed_status: "pending",
    description: "", contact_phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try { const s = sessionStorage.getItem(CACHE_KEY); if (s) { const d = JSON.parse(s); if (d) setForm(prev => ({ ...prev, ...d, seller_id: sellerId })); } } catch {}
  }, [CACHE_KEY, sellerId]);
  useEffect(() => {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(form)); } catch {}
  }, [form, CACHE_KEY]);

  function set(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, size_acres: form.size_acres ? parseFloat(form.size_acres) : null, price_zmw: parseFloat(form.price_zmw) }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    try { sessionStorage.removeItem(CACHE_KEY); } catch {}
    router.push(sellerId ? `/seller/${sellerId}` : `/listing/${data.id}`);
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50";
  const sel = inp + " cursor-pointer";

  return (
    <div className="min-h-screen" style={{ background: "#fffbeb" }}>
      <header style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }} className="text-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href={sellerId ? `/seller/${sellerId}` : "/"} className="text-amber-200 hover:text-white text-sm">← Back</Link>
          <h1 className="text-lg font-black">LandZM 🏡</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-black text-gray-900 mb-1">List Your Land</h2>
        <p className="text-sm text-gray-500 mb-6">Free listing. Buyers contact you directly.</p>

        <form onSubmit={submit} className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-4">
            <h3 className="font-black text-gray-800">Property Details</h3>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Listing Title</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} required className={inp}
                placeholder="e.g. 2-Acre Residential Plot in Lusaka East" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Area / Suburb</label>
                <select value={form.area} onChange={(e) => set("area", e.target.value)} className={sel}>
                  {AREAS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">District</label>
                <select value={form.district} onChange={(e) => set("district", e.target.value)} className={sel}>
                  {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Land Type</label>
                <select value={form.land_type} onChange={(e) => set("land_type", e.target.value)} className={sel}>
                  {TYPES.map((t) => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Size (acres, optional)</label>
                <input value={form.size_acres} onChange={(e) => set("size_acres", e.target.value)} type="number" step="0.01"
                  placeholder="e.g. 0.5" className={inp} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Asking Price (ZMW)</label>
              <input value={form.price_zmw} onChange={(e) => set("price_zmw", e.target.value)} type="number" required
                placeholder="e.g. 250000" className={inp} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Description (optional)</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3}
                placeholder="Describe the land — road access, utilities, surroundings..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50 resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-3">
            <h3 className="font-black text-gray-800">Title Deed Status</h3>
            <p className="text-xs text-gray-400">Be honest — buyers will trust you more</p>
            {DEED_STATUSES.map((d) => (
              <label key={d.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.title_deed_status === d.value ? "border-amber-400 bg-amber-50" : "border-gray-200"}`}>
                <input type="radio" name="deed" value={d.value} checked={form.title_deed_status === d.value}
                  onChange={() => set("title_deed_status", d.value)} className="accent-amber-600" />
                <span className="text-sm font-semibold text-gray-700">{d.label}</span>
              </label>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-3">
            <h3 className="font-black text-gray-800">Contact Details</h3>
            <input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} required
              placeholder="Phone number for buyers to call (e.g. 0976123456)" className={inp} />
            {!sellerId && (
              <input value={form.seller_id} onChange={(e) => set("seller_id", e.target.value)}
                placeholder="Your seller ID (from your dashboard)" className={inp} />
            )}
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full text-white font-black py-4 rounded-xl text-sm disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
            {loading ? "Submitting..." : "List My Land — Free"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function ListPage() {
  return <Suspense><ListForm /></Suspense>;
}
