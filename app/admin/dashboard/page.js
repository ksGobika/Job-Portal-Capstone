"use client";
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, jobs: 0, apps: 0 });
  const [pendingJobs, setPendingJobs] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      const [u, j, a] = await Promise.all([
        fetch('http://localhost:5000/users').then(res => res.json()),
        fetch('http://localhost:5000/jobs').then(res => res.json()),
        fetch('http://localhost:5000/applications').then(res => res.json())
      ]);

      setStats({ users: u.length, jobs: j.length, apps: a.length });
      setPendingJobs(j.filter(job => job.status === 'pending'));
    };
    fetchAdminData();
  }, []);

  const approveJob = async (jobId) => {
    await fetch(`http://localhost:5000/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' })
    });
    setPendingJobs(pendingJobs.filter(job => job.id !== jobId));
    alert("Job Approved!");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Control Panel</h1>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border-l-4 border-blue-500 p-6 shadow-sm">
          <p className="text-gray-500">Total Users</p>
          <p className="text-3xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-white border-l-4 border-green-500 p-6 shadow-sm">
          <p className="text-gray-500">Total Job Listings</p>
          <p className="text-3xl font-bold">{stats.jobs}</p>
        </div>
        <div className="bg-white border-l-4 border-purple-500 p-6 shadow-sm">
          <p className="text-gray-500">Applications Sent</p>
          <p className="text-3xl font-bold">{stats.apps}</p>
        </div>
      </div>

      {/* Requirement C-2: Job Listing Approval */}
      <h2 className="text-2xl font-bold mb-4">Pending Approvals ({pendingJobs.length})</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Company</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingJobs.map(job => (
              <tr key={job.id} className="border-t">
                <td className="p-4">{job.title}</td>
                <td className="p-4 text-gray-600">{job.companyName}</td>
                <td className="p-4">
                  <button onClick={() => approveJob(job.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm mr-2">Approve</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}