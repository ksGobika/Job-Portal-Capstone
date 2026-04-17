/*"use client";
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
}*/

"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function ReviewApplicants() {
  const { user } = useSelector((state) => state.auth || {});
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    if (user) {
      try {
        // Fetch applications belonging to this employer
        const res = await fetch(`http://localhost:5000/applications?employerId=${user.id}`);
        const data = await res.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  // Update Status Logic (Shortlist / Reject)
  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Update local state to show change immediately
        setApplications(applications.map(app => 
          app.id === appId ? { ...app, status: newStatus } : app
        ));
        alert(`Applicant has been ${newStatus}.`);
      }
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="p-20 text-center text-black font-bold">Loading applicants...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          Review Applicants
        </h1>

        <div className="space-y-6">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Applicant Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{app.seekerName}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'shortlisted' ? 'bg-green-100 text-green-700' : 
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium mb-1">
                    Applied for: <span className="text-blue-600 font-bold">{app.jobTitle}</span>
                  </p>
                  <p className="text-sm text-gray-400 mb-4 italic">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                  
                  {/* Cover Letter Section */}
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Cover Letter Preview:</p>
                    <p className="text-gray-700 text-sm line-clamp-3">{app.coverLetter || "No cover letter provided."}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <a 
                    href={app.resume} 
                    target="_blank" 
                    className="text-center bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-200"
                  >
                    📄 View Resume
                  </a>
                  <button 
                    onClick={() => router.push(`/seeker/messages?targetId=${app.seekerId}&targetName=${app.seekerName}`)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700"
                  >
                    💬 Message
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-green-700"
                    >
                      Shortlist
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(app.id, 'rejected')}
                      className="flex-1 bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-lg font-bold text-xs hover:bg-red-600 hover:text-white"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">No applications received yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}