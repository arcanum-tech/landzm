"use client";

import { useState, useEffect } from "react";

export default function EnquiryForm({ listingId }: { listingId: string }) {
  const CACHE_KEY = `landzm_enquiry_${listingId}`;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  useEffect(() => {
    try { const s = sessionStorage.getItem(CACHE_KEY); if (s) { const d = JSON.parse(s); if (d.name) setName(d.name); if (d.phone) setPhone(d.phone); if (d.message) setMessage(d.message); } } catch {}
  }, [CACHE_KEY]);
  useEffect(() => {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ name, phone, message })); } catch {}
  }, [name, phone, message, CACHE_KEY]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: listingId, enquirer_name: name, enquirer_phone: phone, message }),
    });
    if (res.ok) { try { sessionStorage.removeItem(CACHE_KEY); } catch {} }
    setStatus(res.ok ? "sent" : "error");
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50";

  if (status === "sent") return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
      <p className="text-2xl mb-1">✅</p>
      <p className="font-black text-gray-800">Enquiry sent!</p>
      <p className="text-xs text-gray-500 mt-1">The seller will contact you soon.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-3">
      <h3 className="font-black text-gray-800">Send an Enquiry</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required className={inp} />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone (e.g. 0976123456)" required className={inp} />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message (optional)" rows={3}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50 resize-none" />
      {status === "error" && <p className="text-xs text-red-600">Failed to send. Try again.</p>}
      <button type="submit" className="w-full text-white font-black py-3 rounded-xl text-sm"
        style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
        Send Enquiry
      </button>
    </form>
  );
}
