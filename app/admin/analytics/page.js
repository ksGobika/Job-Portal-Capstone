"use client";
import { useState, useEffect } from 'react';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [uRes, jRes, aRes] = await Promise.all([
          fetch('http://localhost:5001/users'),
          fetch('http://localhost:5001/jobs'),
          fetch('http://localhost:5001/applications')
        ]);

        const users = await uRes.json();
        const jobs = await jRes.json();
        const apps = await aRes.json();

        // --- CALCULATIONS ---
        
        // 1. User Breakdown
        const seekers = users.filter(u => u.role === 'seeker').length;
        const employers = users.filter(u => u.role === 'employer').length;

        // 2. Job Status
        const approvedJobs = jobs.filter(j => j.status === 'approved').length;
        const pendingJobs = jobs.filter(j => j.status === 'pending').length;

        // 3. Platform Engagement
        const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);
        const avgAppsPerJob = jobs.length > 0 ? (apps.length / jobs.length).toFixed(1) : 0;

        // 4. Application Success Rate
        const shortlisted = apps.filter(a => a.status === 'shortlisted').length;
        const successRate = apps.length > 0 ? ((shortlisted / apps.length) * 100).toFixed(1) : 0;

        // 5. Popular Industries (Top 3)
        const industries = jobs.reduce((acc, job) => {
          acc[job.industry] = (acc[job.industry] || 0) + 1;
          return acc;
        }, {});
        const sortedIndustries = Object.entries(industries)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);

        setData({
          seekers, employers, approvedJobs, pendingJobs,
          totalViews, avgAppsPerJob, successRate, sortedIndustries,
          totalApps: apps.length
        });
      } catch (err) {
        console.error("Analytics Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-20 text-center text-black font-bold">Generating Reports...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Platform Analytics</h1>
        <p className="text-gray-500 mb-10 font-bold">In-depth insights into platform performance and user trends.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* USER DISTRIBUTION */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col justify-between">
            <h3 className="text-gray-400 font-black uppercase text-xs tracking-widest mb-6">User Distribution</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-gray-700 font-bold">Seekers</span>
                <span className="text-3xl font-black text-blue-600">{data.seekers}</span>
              </div>
              <div className="w-full bg-gray-100 h-4 rounded-full">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(data.seekers / (data.seekers + data.employers)) * 100}%` }}></div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-gray-700 font-bold">Employers</span>
                <span className="text-3xl font-black text-green-600">{data.employers}</span>
              </div>
            </div>
          </div>

          {/* ENGAGEMENT METRICS */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
            <h3 className="text-gray-400 font-black uppercase text-xs tracking-widest mb-6">Engagement</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400">TOTAL VIEWS</p>
                <p className="text-2xl font-black text-slate-900">{data.totalViews}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400">APPS / JOB</p>
                <p className="text-2xl font-black text-slate-900">{data.avgAppsPerJob}</p>
              </div>
              <div className="bg-blue-50 col-span-2 p-4 rounded-2xl text-center">
                <p className="text-xs font-bold text-blue-400 uppercase">Hiring Success Rate</p>
                <p className="text-4xl font-black text-blue-700">{data.successRate}%</p>
              </div>
            </div>
          </div>

          {/* POPULAR CATEGORIES */}
          <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white">
            <h3 className="text-slate-400 font-black uppercase text-xs tracking-widest mb-6">Trending Industries</h3>
            <div className="space-y-6">
              {data.sortedIndustries.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold">{name}</span>
                    <span className="text-blue-400 font-black">{count} Jobs</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(count / data.approvedJobs) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM SUMMARY TABLE */}
        <div className="mt-12 bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="font-black text-gray-900">Platform Health Report</h3>
            <button onClick={() => window.print()} className="text-xs font-bold bg-white border px-4 py-2 rounded-lg hover:bg-gray-100 transition">Download PDF</button>
          </div>
          <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Total Applications</p>
              <p className="text-3xl font-black text-gray-900">{data.totalApps}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Jobs Approved</p>
              <p className="text-3xl font-black text-green-600">{data.approvedJobs}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Jobs Waiting</p>
              <p className="text-3xl font-black text-yellow-600">{data.pendingJobs}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Conversion</p>
              <p className="text-3xl font-black text-purple-600">{data.successRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}