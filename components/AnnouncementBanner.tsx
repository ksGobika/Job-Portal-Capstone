"use client";
import { useEffect, useState } from 'react';

export default function AnnouncementBanner() {
  const [msg, setMsg] = useState<{ message: string } | null>(null);

  useEffect(() => {
    // Fetches the latest announcement from db.json
    fetch('http://localhost:5001/announcements?_limit=1&_sort=id&_order=desc')
      .then(res => res.json())
      .then(data => { 
        if(data.length > 0) setMsg(data[0]); 
      })
      .catch(err => console.log("No announcements found"));
  }, []);

  if (!msg) return null;

  return (
    <div className="bg-blue-600 text-white py-2 px-4 text-center text-sm font-bold animate-pulse sticky top-0 z-[60]">
      📢 Platform Update: {msg.message}
    </div>
  );
}