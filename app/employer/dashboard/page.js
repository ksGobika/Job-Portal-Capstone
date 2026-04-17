"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function EmployerDashboard() {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({ totalJobs: 0, totalApps: 0 });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const [jobsRes, appsRes] = await Promise.all([
          fetch(`http://localhost:5000/jobs?employerId=${user.id}`),
          fetch(`http://localhost:5000/applications?employerId=${user.id}`)
        ]);
        const jobs = await jobsRes.json();
        const apps = await appsRes.json();
        setStats({ totalJobs: jobs.length, totalApps: apps.length });
      };
      fetchData();
    }
  }, [user]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg">Active Listings</h3>
          <p className="text-4xl font-bold">{stats.totalJobs}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg">Total Applicants</h3>
          <p className="text-4xl font-bold">{stats.totalApps}</p>
        </div>
        <Link href="/employer/post-job" className="bg-gray-800 text-white p-6 rounded-lg shadow flex items-center justify-center text-xl font-bold hover:bg-gray-700">
          + Post New Job
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="flex gap-4">
        <Link href="/employer/my-jobs" className="text-blue-600 underline">Manage Job Listings</Link>
        <Link href="/employer/applicants" className="text-blue-600 underline">Review Applicants</Link>
      </div>
    </div>
  );
}