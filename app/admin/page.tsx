"use client";

import { useState } from "react";

type Request = {
  id: string;
  status: string;
  title_deed_number: string;
  notes: string;
  admin_notes: string;
  is_paid: boolean;
  created_at: string;
  land_listings: { title: string; area: string };
  land_sellers: { name: string; phone: string };
};

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionNote, setActionNote] = useState<Record<string, string>>({});

  async function login(e: React.FormEvent) {
    e.preventDefault();
    // Verify by fetching — server will reject if wrong
    const res = await fetch("/api/admin/requests", { headers: { "x-admin-password": password } });
    if (res.ok) { setAuthed(true); const d = await res.json(); setRequests(d.requests); }
    else alert("Wrong password");
  }

  async function refresh() {
    const res = await fetch("/api/admin/requests", { headers: { "x-admin-password": password } });
    const d = await res.json(); setRequests(d.requests);
  }

  async function action(id: string, status: "verified" | "rejected") {
    setLoading(true);
    await fetch("/api/verify-deed", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ request_id: id, status, admin_notes: actionNote[id] ?? "" }),
    });
    setLoading(false);
    await refresh();
  }

  const statusColor = (s: string): React.CSSProperties => {
    if (s === "verified") return { background: "#d1fae5", color: "#065f46" };
    if (s === "rejected") return { background: "#fee2e2", color: "#991b1b" };
    if (s === "paid") return { background: "#dbeafe", color: "#1e40af" };
    return { background: "#fef3c7", color: "#92400e" };
  };

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#fffbeb" }}>
      <form onSubmit={login} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm border border-amber-100 space-y-4">
        <p className="text-2xl text-center">🔐</p>
        <h1 className="text-xl font-black text-center text-gray-900">LandZM Admin</h1>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password" required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-gray-50" />
        <button type="submit" className="w-full text-white font-black py-3 rounded-xl text-sm"
          style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }}>
          Login
        </button>
      </form>
    </div>
  );

  const pending = requests.filter((r) => r.status === "paid");
  const done = requests.filter((r) => r.status === "verified" || r.status === "rejected");

  return (
    <div className="min-h-screen" style={{ background: "#fffbeb" }}>
      <header style={{ background: "linear-gradient(135deg,#b45309,#92400e)" }} className="text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="font-black text-lg">LandZM Admin 🛡</h1>
          <button onClick={refresh} className="text-xs px-3 py-1.5 rounded-full font-bold" style={{ background: "rgba(255,255,255,0.2)" }}>
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Awaiting Action", value: pending.length, color: "#1e40af" },
            { label: "Verified", value: requests.filter(r => r.status === "verified").length, color: "#065f46" },
            { label: "Rejected", value: requests.filter(r => r.status === "rejected").length, color: "#991b1b" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm text-center">
              <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pending paid requests */}
        <div>
          <h2 className="font-black text-gray-800 mb-3">Awaiting Verification ({pending.length})</h2>
          {!pending.length ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-amber-100 text-gray-400 text-sm">No pending requests</div>
          ) : (
            <div className="space-y-4">
              {pending.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-black text-gray-800">{r.land_listings?.title}</p>
                      <p className="text-xs text-gray-500">{r.land_listings?.area}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Seller: {r.land_sellers?.name} · {r.land_sellers?.phone}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                      style={statusColor(r.status)}>{r.status}</span>
                  </div>
                  {r.title_deed_number && <p className="text-xs text-gray-600">Deed No: <strong>{r.title_deed_number}</strong></p>}
                  {r.notes && <p className="text-xs text-gray-500">Notes: {r.notes}</p>}
                  <p className="text-xs text-gray-400">Submitted: {new Date(r.created_at).toLocaleDateString("en-ZM")}</p>
                  <textarea value={actionNote[r.id] ?? ""} onChange={(e) => setActionNote((p) => ({ ...p, [r.id]: e.target.value }))}
                    placeholder="Admin notes (optional — shown if rejected)" rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-400 bg-gray-50 resize-none" />
                  <div className="flex gap-3">
                    <button onClick={() => action(r.id, "verified")} disabled={loading}
                      className="flex-1 text-white font-black py-2.5 rounded-xl text-sm disabled:opacity-50"
                      style={{ background: "#065f46" }}>
                      ✓ Mark Verified
                    </button>
                    <button onClick={() => action(r.id, "rejected")} disabled={loading}
                      className="flex-1 font-black py-2.5 rounded-xl text-sm border-2 border-red-300 text-red-600 disabled:opacity-50">
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed */}
        {done.length > 0 && (
          <div>
            <h2 className="font-black text-gray-800 mb-3">Completed ({done.length})</h2>
            <div className="space-y-3">
              {done.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{r.land_listings?.title}</p>
                    <p className="text-xs text-gray-500">{r.land_sellers?.name} · {new Date(r.created_at).toLocaleDateString("en-ZM")}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                    style={statusColor(r.status)}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
