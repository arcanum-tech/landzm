"use client";

import { useState, use } from "react";
import Link from "next/link";

export default function RequestVerificationPage({ params }: { params: Promise<{ listing_id: string }> }) {
  const { listing_id } = use(params);
  const [sellerId, setSellerId] = useState("");
  const [deedNumber, setDeedNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");

    // Create the verification request first
    const res = await fetch("/api/verify-deed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id, seller_id: sellerId, title_deed_number: deedNumber, notes }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }

    // Redirect to payment
    const callbackUrl = encodeURIComponent(
      `https://landzm.vercel.app/api/verify-callback?request_id=${data.id}&seller_id=${sellerId}&status=success`
    );
    window.location.href = `https://arcanum-payments.vercel.app/pay?app=landzm&product=LandZM+Deed+Verification&amount=50&callback=${callbackUrl}`;
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50";

  return (
    <div className="min-h-screen" style={{ background: "#fffbeb" }}>
      <header style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }} className="text-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-amber-200 hover:text-white text-sm">← LandZM</Link>
          <h1 className="text-lg font-black">Deed Verification</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
          <p className="text-2xl mb-2">🛡</p>
          <h2 className="text-xl font-black text-gray-900 mb-1">Request Title Deed Verification</h2>
          <p className="text-sm text-gray-500">Our team will physically verify your title deed at the Lands & Deeds Registry. Your listing will get the <strong>✓ Title Deed Verified</strong> badge once confirmed.</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-2 text-sm">
          <p className="font-black text-gray-800">What happens:</p>
          <ul className="space-y-1 text-gray-600 text-xs">
            <li>1. Fill in your deed details and pay ZMW 50</li>
            <li>2. ARCANUM TECH LIMITED verifies at the Lands & Deeds Registry (1–3 business days)</li>
            <li>3. Your listing gets the ✓ Verified badge if confirmed</li>
            <li>4. If not verified, you are notified with the reason</li>
          </ul>
          <p className="text-xs text-gray-400 pt-1">Fee: ZMW 50 (non-refundable if deed is found invalid)</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-4">
          <h3 className="font-black text-gray-800">Your Details</h3>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Your Seller ID</label>
            <input value={sellerId} onChange={(e) => setSellerId(e.target.value)} required placeholder="From your dashboard URL" className={inp} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Title Deed Number (if known)</label>
            <input value={deedNumber} onChange={(e) => setDeedNumber(e.target.value)} placeholder="e.g. LUS/12345/T" className={inp} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Additional Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Any info to help our team verify faster..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50 resize-none" />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full text-white font-black py-4 rounded-xl text-sm disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
            {loading ? "Processing..." : "Pay ZMW 50 & Submit →"}
          </button>
        </form>
      </main>
    </div>
  );
}
