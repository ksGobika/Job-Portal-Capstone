"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function ReviewApplicants() {
  const { user } = useSelector(state => state.auth);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/applications?employerId=${user.id}`)
      .then(res => res.json())
      .then(data => setApps(data));
  }, [user]);

  const updateStatus = async (appId, newStatus) => {
    await fetch(`http://localhost:5000/applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    // Refresh local state
    setApps(apps.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    
    // Requirement #5: Notification trigger (Mock)
    console.log(`Notification sent to seeker for ${newStatus}`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Received Applications</h1>
      <div className="space-y-4">
        {apps.map(app => (
          <div key={app.id} className="border p-4 rounded flex justify-between items-center bg-white shadow-sm">
            <div>
              <h3 className="font-bold text-lg">{app.seekerName}</h3>
              <p className="text-gray-600">Applied for: <span className="font-medium text-blue-600">{app.jobTitle}</span></p>
              <p className="text-sm text-gray-400">Date: {new Date(app.appliedAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateStatus(app.id, 'shortlisted')} 
                className="bg-green-600 text-white px-4 py-1 rounded text-sm">Shortlist</button>
              <button onClick={() => updateStatus(app.id, 'rejected')} 
                className="bg-red-600 text-white px-4 py-1 rounded text-sm">Reject</button>
            </div>
          </div>
        ))}
        {apps.length === 0 && <p>No applications received yet.</p>}
      </div>
    </div>
  );
}