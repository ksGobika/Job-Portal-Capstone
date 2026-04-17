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
        // 1. Fetch all jobs by this employer
        const jobRes = await fetch(`http://localhost:5000/jobs?employerId=${user.id}`);
        const jobs = await jobRes.json();

        // 2. Fetch all applications for this employer
        const appRes = await fetch(`http://localhost:5000/applications?employerId=${user.id}`);
        const apps = await appRes.json();

        // 3. Combine the data
        const combinedData = jobs.map(job => {
          const jobApps = apps.filter(app => app.jobId === job.id).length;
          return {
            id: job.id,
            title: job.title,
            views: job.views || 0,
            applications: jobApps,
            // Calculate Conversion Rate (Apps / Views)
            conversion: job.views > 0 ? ((jobApps / job.views) * 100).toFixed(1) : 0
          };
        });

        setMetrics(combinedData);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  if (loading) return <div className="p-20 text-center text-black font-bold">Calculating Metrics...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Job Performance Metrics</h1>
        <p className="text-gray-600 mb-8 font-medium">Analyze how your listings are performing.</p>

        <div className="grid grid-cols-1 gap-6">
          {metrics.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col md:flex-row items-center gap-8">
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-blue-900">{item.title}</h2>
                <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">Job ID: {item.id}</p>
              </div>

              {/* Stats Grid */}
              <div className="flex gap-10 text-center">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Views</p>
                  <p className="text-3xl font-black text-gray-900">{item.views}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Applications</p>
                  <p className="text-3xl font-black text-green-600">{item.applications}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Conversion Rate</p>
                  <p className="text-3xl font-black text-blue-600">{item.conversion}%</p>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full md:w-48 bg-gray-100 h-3 rounded-full overflow-hidden border">
                <div 
                  className="bg-blue-500 h-full transition-all duration-1000" 
                  style={{ width: `${Math.min(item.conversion * 5, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}

          {metrics.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
              No data available yet. Post a job to see metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}