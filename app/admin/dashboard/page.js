"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0, pending: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [u, j, a] = await Promise.all([
        fetch('http://localhost:5001/users').then(res => res.json()),
        fetch('http://localhost:5001/jobs').then(res => res.json()),
        fetch('http://localhost:5001/applications').then(res => res.json())
      ]);
      setStats({
        users: u.length,
        jobs: j.length,
        applications: a.length,
        pending: j.filter(job => job.status === 'pending').length
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Admin Overview</h1>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-blue-600">
          <p className="text-gray-500 font-bold uppercase text-xs">Total Users</p>
          <p className="text-4xl font-black text-gray-900">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-green-600">
          <p className="text-gray-500 font-bold uppercase text-xs">Job Listings</p>
          <p className="text-4xl font-black text-gray-900">{stats.jobs}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-purple-600">
          <p className="text-gray-500 font-bold uppercase text-xs">Applications</p>
          <p className="text-4xl font-black text-gray-900">{stats.applications}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl shadow-md border-b-4 border-red-600">
          <p className="text-red-500 font-bold uppercase text-xs">Pending Approvals</p>
          <p className="text-4xl font-black text-red-600">{stats.pending}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 text-gray-800">Management Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/jobs" className="p-6 bg-slate-900 text-white rounded-xl hover:bg-black font-bold text-center transition">📋 Job Approvals</Link>
        <Link href="/admin/users" className="p-6 bg-slate-900 text-white rounded-xl hover:bg-black font-bold text-center transition">👥 User Management</Link>
        <Link href="/admin/announcements" className="p-6 bg-slate-900 text-white rounded-xl hover:bg-black font-bold text-center transition">📢 Announcements</Link>
        <Link href="/admin/content" className="p-6 bg-slate-900 text-white rounded-xl hover:bg-black font-bold text-center transition">⚙️ Content / FAQs</Link>
      </div>
    </div>
  );
}