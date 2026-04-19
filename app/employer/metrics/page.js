"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function JobPerformanceMetrics() {
  const { user } = useSelector((state) => state.auth || {});
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) return;
      
      try {
        // 1. Fetch all jobs posted by THIS employer
        const jobRes = await fetch(`https://job-portal-api-zi92.onrender.com/jobs?employerId=${user.id}`);
        const jobs = await jobRes.json();

        // 2. Fetch all applications belonging to THIS employer
        const appRes = await fetch(`https://job-portal-api-zi92.onrender.com/applications?employerId=${user.id}`);
        const apps = await appRes.json();

        // 3. COMBINE AND COUNT (Strict Logic)
        const combinedData = jobs.map(job => {
          // We convert both to String to ensure "j1" matches "j1" and 1 matches "1"
          const jobAppsCount = apps.filter(app => 
            String(app.jobId) === String(job.id)
          ).length;

          return {
            id: job.id,
            title: job.title,
            views: job.views || 0,
            applications: jobAppsCount,
          };
        });

        setMetrics(combinedData);
      } catch (error) {
        console.error("Error calculating performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  if (loading) return <div className="p-20 text-center text-black font-bold text-xl">Updating Metrics...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Job Performance</h1>
        <p className="text-gray-500 mb-10 font-bold">Real-time tracking of your job listings.</p>

        <div className="grid grid-cols-1 gap-6">
          {metrics.map((item) => (
            <div key={item.id} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between transition-transform hover:scale-[1.01]">
              
              <div className="flex-1">
                <h2 className="text-2xl font-black text-blue-900 mb-1">{item.title}</h2>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Listing ID: {item.id}</p>
                </div>
              </div>

              <div className="flex gap-12 text-center items-center">
                <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Views</p>
                  <p className="text-4xl font-black text-gray-900">{item.views}</p>
                </div>

                <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Applications</p>
                  <p className="text-4xl font-black text-blue-700">{item.applications}</p>
                </div>
              </div>

            </div>
          ))}

          {metrics.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold text-lg">You haven't posted any jobs yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}