"use client";

import { useState } from "react";
import Link from "next/link";

export default function TitleVerificationPage() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    plot_number: "", location: "", seller_name: "",
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
      body: JSON.stringify({ ...form, service_type: "title_verification" }),
    });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) { setError(d.error); return; }
    setDone(true);
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 bg-gray-50";

  return (
    <div className="min-h-screen" style={{ background: "#f0fdf9" }}>
      <header style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }} className="text-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-yellow-200 hover:text-white text-sm">← Back</Link>
          <h1 className="text-lg font-black">LandZM 🏡</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {done ? (
          <div className="bg-white rounded-2xl p-8 border border-teal-100 shadow-sm text-center">
            <p className="text-5xl mb-4">✅</p>
            <h2 className="text-xl font-black text-gray-900 mb-2">Request Received!</h2>
            <p className="text-sm text-gray-600 mb-2">Our legal partner will verify the title deed status at the Ministry of Lands and contact you within <strong>48 hours</strong> with a report.</p>
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
                style={{ background: "#0f766e" }}>
                🔍 Ministry of Lands Check
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Title Deed Verification</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Before you buy land in Zambia, verify the title deed is genuine and unencumbered. Our legal partner physically checks the plot status at the Ministry of Lands — caveats, encumbrances, correct ownership, and outstanding rates.
              </p>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 mb-6 space-y-2">
              <p className="font-black text-teal-900 text-sm">What we check</p>
              {[
                "Genuine title deed registration at Ministry of Lands",
                "Correct current ownership vs. seller's claim",
                "Outstanding caveats or encumbrances",
                "Unpaid LCC rates or government charges",
                "Subdivision or boundary disputes",
              ].map(i => (
                <p key={i} className="text-xs text-teal-800">✓ {i}</p>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-6">
              <p className="text-xs font-black text-amber-800">⚠ Protect yourself</p>
              <p className="text-xs text-amber-700 mt-1">Land fraud is common in Zambia. Never pay any deposit before a verified title deed check is complete. ARCANUM TECH LIMITED is not liable for transactions made without verification.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-sm space-y-4">
                <h3 className="font-black text-gray-800">Your Details</h3>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Full Name</label>
                  <input required value={form.name} onChange={e => set("name", e.target.value)}
                    placeholder="e.g. Mary Zulu" className={inp} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Phone Number</label>
                  <input required value={form.phone} onChange={e => set("phone", e.target.value)}
                    placeholder="e.g. 0976123456" type="tel" className={inp} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Email (optional)</label>
                  <input value={form.email} onChange={e => set("email", e.target.value)}
                    placeholder="e.g. mary@email.com" type="email" className={inp} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-sm space-y-4">
                <h3 className="font-black text-gray-800">Property to Verify</h3>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Plot / Stand Number</label>
                  <input required value={form.plot_number} onChange={e => set("plot_number", e.target.value)}
                    placeholder="e.g. Plot 456, Stand 12" className={inp} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Location / District</label>
                  <input required value={form.location} onChange={e => set("location", e.target.value)}
                    placeholder="e.g. Woodlands, Lusaka" className={inp} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Name of Seller (as on title)</label>
                  <input value={form.seller_name} onChange={e => set("seller_name", e.target.value)}
                    placeholder="e.g. James Phiri (name on title deed)" className={inp} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Additional Notes</label>
                  <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
                    placeholder="Any concerns — e.g. you've seen the original title, boundary seems off, etc."
                    rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400 bg-gray-50 resize-none" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-teal-100 text-sm text-gray-500">
                <p className="font-semibold text-gray-800 mb-1">💡 How this works</p>
                <p className="text-xs">Submit enquiry → legal partner visits Ministry of Lands → full written report sent to you within 48 hours → you decide whether to proceed. ARCANUM TECH LIMITED earns a referral fee from the legal partner.</p>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full text-white font-black py-4 rounded-xl text-sm disabled:opacity-50 hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
                {loading ? "Submitting..." : "Request Title Verification →"}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
