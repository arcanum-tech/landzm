"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SellerLogin() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/sellers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name: isNew ? name : undefined }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    router.push(`/seller/${data.id}`);
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#fffbeb" }}>
      <Link href="/" className="text-sm font-bold mb-6" style={{ color: "#b45309" }}>← LandZM</Link>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm border border-amber-100">
        <div className="text-center mb-6">
          <p className="text-3xl mb-2">🏡</p>
          <h1 className="text-xl font-black text-gray-900">Seller Portal</h1>
          <p className="text-xs text-gray-500 mt-1">Enter your phone to continue</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="flex gap-2 mb-1">
            <button type="button" onClick={() => setIsNew(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${!isNew ? "text-white border-transparent" : "border-gray-200 text-gray-500"}`}
              style={!isNew ? { background: "linear-gradient(135deg,#b45309,#92400e)" } : {}}>
              Existing Seller
            </button>
            <button type="button" onClick={() => setIsNew(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${isNew ? "text-white border-transparent" : "border-gray-200 text-gray-500"}`}
              style={isNew ? { background: "linear-gradient(135deg,#b45309,#92400e)" } : {}}>
              New Seller
            </button>
          </div>
          {isNew && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required className={inp} />}
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (e.g. 0976123456)" required className={inp} />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full text-white font-black py-3 rounded-xl text-sm disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
            {loading ? "..." : "Continue →"}
          </button>
        </form>
      </div>
    </div>
  );
}
