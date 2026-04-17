"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function ManageJobs() {
  const { user } = useSelector((state) => state.auth || {});
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = async () => {
    if (user) {
      try {
        // Fetch jobs where employerId matches the logged-in user's ID
        const res = await fetch(`http://localhost:5000/jobs?employerId=${user.id}`);
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, [user]);

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job listing?")) {
      await fetch(`http://localhost:5000/jobs/${jobId}`, { method: 'DELETE' });
      // Refresh the list after deletion
      setJobs(jobs.filter(job => job.id !== jobId));
      alert("Job deleted successfully.");
    }
  };

  if (loading) return <div className="p-20 text-center text-black font-bold">Loading your listings...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Manage Job Listings</h1>
          <Link href="/employer/post-job" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            + Post New Job
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="p-4 font-bold uppercase text-sm">Job Title</th>
                <th className="p-4 font-bold uppercase text-sm">Date Posted</th>
                <th className="p-4 font-bold uppercase text-sm">Status</th>
                <th className="p-4 font-bold uppercase text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <p className="font-bold text-gray-900 text-lg">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.location} | {job.jobType}</p>
                    </td>
                    <td className="p-4 text-gray-700">
                      {new Date(job.postedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        job.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {job.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <Link href={`/jobs/${job.id}`} className="text-blue-600 font-bold hover:underline">
                          View
                        </Link>
                        <button 
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 font-bold hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-gray-500 italic text-lg">
                    No jobs posted yet. Click "+ Post New Job" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}