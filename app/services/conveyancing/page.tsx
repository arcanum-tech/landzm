"use client";

import { useState } from "react";
import Link from "next/link";

export default function ConveyancingPage() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    property_description: "", location: "", sale_price: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/service-enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, service_type: "conveyancing" }),
    });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) { setError(d.error); return; }
    setDone(true);
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50";

  return (
    <div className="min-h-screen" style={{ background: "#fffbeb" }}>
      <header style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }} className="text-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-yellow-200 hover:text-white text-sm">← Back</Link>
          <h1 className="text-lg font-black">LandZM 🏡</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {done ? (
          <div className="bg-white rounded-2xl p-8 border border-amber-100 shadow-sm text-center">
            <p className="text-5xl mb-4">✅</p>
            <h2 className="text-xl font-black text-gray-900 mb-2">Enquiry Received!</h2>
            <p className="text-sm text-gray-600 mb-2">Our legal partner will contact you within <strong>24 hours</strong> to discuss your conveyancing needs.</p>
            <p className="text-xs text-gray-400 mb-6">ARCANUM TECH LIMITED · TPIN 2003723894</p>
            <Link href="/" className="inline-block text-white font-black px-6 py-3 rounded-xl text-sm"
              style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
              Back to Listings →
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 text-white"
                style={{ background: "#b45309" }}>
                ⚖️ Professional Legal Service
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Conveyancing</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our licensed legal partner handles the full transfer of property ownership — drafting sale agreements, title deed transfer, Ministry of Lands processing, and all legal documentation. We facilitate, they execute.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 space-y-2">
              <p className="font-black text-amber-900 text-sm">What's included</p>
              {[
                "Sale agreement drafting & review",
                "Title deed transfer at Ministry of Lands",
                "Stamp duty calculation & processing",
                "Consent to transfer (where applicable)",
                "Final title deed in buyer's name",
              ].map(i => (
                <p key={i} className="text-xs text-amber-800">✓ {i}</p>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-4">
                <h3 className="font-black text-gray-800">Your Details</h3>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Full Name</label>
                  <input required value={form.name} onChange={e => set("name", e.target.value)}
                    placeholder="e.g. John Banda" className={inp} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Phone Number</label>
                  <input required value={form.phone} onChange={e => set("phone", e.target.value)}
                    placeholder="e.g. 0976123456" type="tel" className={inp} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Email (optional)</label>
                  <input value={form.email} onChange={e => set("email", e.target.value)}
                    placeholder="e.g. john@email.com" type="email" className={inp} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-4">
                <h3 className="font-black text-gray-800">Property Details</h3>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Property Description</label>
                  <input required value={form.property_description} onChange={e => set("property_description", e.target.value)}
                    placeholder="e.g. Plot 456, Stand 12, Woodlands — 0.5 acres residential" className={inp} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Location / Area</label>
                  <input required value={form.location} onChange={e => set("location", e.target.value)}
                    placeholder="e.g. Woodlands, Lusaka" className={inp} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Agreed Sale Price (ZMW)</label>
                  <input value={form.sale_price} onChange={e => set("sale_price", e.target.value)}
                    placeholder="e.g. 500000" type="number" className={inp} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Additional Notes</label>
                  <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
                    placeholder="Any other details — e.g. are both buyer and seller ready? Any complications?"
                    rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50 resize-none" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-amber-100 text-sm text-gray-500">
                <p className="font-semibold text-gray-800 mb-1">💡 How this works</p>
                <p className="text-xs">Submit your enquiry → our legal partner contacts you within 24 hours → you agree on fees → they process your conveyancing end to end. ARCANUM TECH LIMITED earns a referral fee from the legal partner.</p>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full text-white font-black py-4 rounded-xl text-sm disabled:opacity-50 hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
                {loading ? "Submitting..." : "Request Conveyancing →"}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
