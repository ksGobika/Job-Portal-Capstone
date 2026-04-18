
"use client";
import { useState, useEffect } from 'react';

export default function AdminBroadcast() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/announcements?_limit=5&_sort=id&_order=desc')
      .then(res => res.json()).then(data => setHistory(data));
  }, []);

  const sendBroadcast = async (e) => {
    e.preventDefault();
    const announcement = { message, date: new Date().toISOString(), active: true };
    const res = await fetch('http://localhost:5001/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcement)
    });
    if (res.ok) {
      alert("Broadcast sent to all users!");
      setMessage("");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Platform Broadcast</h1>
      
      <form onSubmit={sendBroadcast} className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white mb-10">
        <label className="block mb-4 font-bold text-slate-400 uppercase tracking-widest text-xs">New Announcement</label>
        <textarea required rows="4" className="w-full p-4 rounded-2xl bg-slate-800 border-none text-white focus:ring-2 focus:ring-blue-500 outline-none mb-4"
          placeholder="Enter message for all Seekers & Employers..."
          value={message} onChange={e => setMessage(e.target.value)} />
        <button className="w-full bg-blue-600 py-4 rounded-2xl font-black text-lg hover:bg-blue-500 transition">Broadcast to Everyone</button>
      </form>

      <h3 className="font-bold text-gray-500 mb-4">Recent Broadcasts</h3>
      <div className="space-y-4">
        {history.map(h => (
          <div key={h.id} className="p-4 border-l-4 border-blue-600 bg-white shadow-sm rounded-r-xl">
            <p className="text-gray-900 font-medium">{h.message}</p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{new Date(h.date).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}