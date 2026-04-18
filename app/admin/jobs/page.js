"use client";
import { useState, useEffect } from 'react';

export default function AdminJobsApproval() {
  const [pendingJobs, setPendingJobs] = useState([]);

  useEffect(() => {
    // Fetch only jobs that are 'pending'
    fetch('http://localhost:5001/jobs?status=pending')
      .then(res => res.json())
      .then(data => setPendingJobs(data));
  }, []);

  const handleApprove = async (id) => {
    await fetch(`http://localhost:5001/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }) // Update status to approved
    });
    
    // Remove from local list
    setPendingJobs(pendingJobs.filter(job => job.id !== id));
    alert("Job Approved!");
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Job Approvals Queue</h1>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4">Job Title</th>
              <th className="p-4">Employer</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingJobs.map(job => (
              <tr key={job.id} className="border-b">
                <td className="p-4 font-bold text-black">{job.title}</td>
                <td className="p-4 text-gray-600">{job.companyName}</td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleApprove(job.id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
            {pendingJobs.length === 0 && (
              <tr>
                <td colSpan="3" className="p-20 text-center text-gray-400 font-bold">
                  No pending jobs to approve.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}