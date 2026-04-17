"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import JobCard from '../../../components/JobCard'; // Adjust path if needed
import Link from 'next/link';

export default function SavedJobsPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (isAuthenticated && user?.savedJobs?.length > 0) {
        try {
          // Fetch all jobs and filter those whose ID is in the user's savedJobs list
          const res = await fetch('http://localhost:5000/jobs?status=approved');
          const allJobs = await res.json();
          
          const filtered = allJobs.filter(job => user.savedJobs.includes(job.id));
          setSavedJobs(filtered);
        } catch (error) {
          console.error("Error fetching saved jobs:", error);
        }
      }
      setLoading(false);
    };

    fetchSavedJobs();
  }, [user, isAuthenticated]);

  if (!isAuthenticated) return <div className="p-20 text-center text-black font-bold">Please login to view saved jobs.</div>;
  if (loading) return <div className="p-20 text-center text-black">Loading your saved jobs...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Saved Jobs</h1>
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-bold">
          {savedJobs.length} Jobs Saved
        </span>
      </div>

      {savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-xl text-gray-500 mb-6">You haven't saved any jobs yet.</p>
          <Link href="/jobs" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
}