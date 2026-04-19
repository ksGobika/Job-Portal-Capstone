"use client"; // Required for click handlers and Redux

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice'; // Adjust path to your authSlice

export default function JobCard({ job }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();

  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Check if this specific job is already saved or applied by the user
  useEffect(() => {
    if (isAuthenticated && user) {
      // 1. Check if saved (from user object)
      if (user.savedJobs?.includes(job.id)) {
        setIsSaved(true);
      }
      
      // 2. Check if applied (fetch from applications endpoint)
      fetch(`https://job-portal-api-zi92.onrender.com/applications?jobId=${job.id}&seekerId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) setIsApplied(true);
        });
    }
  }, [user, job.id, isAuthenticated]);

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent navigating to details page if clicking button
    if (!isAuthenticated) return alert("Please login to save jobs");

    const currentSaved = user.savedJobs || [];
    const updatedSaved = isSaved 
      ? currentSaved.filter(id => id !== job.id) 
      : [...currentSaved, job.id];

    const res = await fetch(`https://job-portal-api-zi92.onrender.com/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedJobs: updatedSaved })
    });

    if (res.ok) {
      const updatedUser = { ...user, savedJobs: updatedSaved };
      dispatch(setUser(updatedUser)); // Update Redux state
      setIsSaved(!isSaved);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return alert("Please login to apply");

    const applicationData = {
      jobId: job.id,
      jobTitle: job.title,
      seekerId: user.id,
      seekerName: user.name,
      employerId: job.employerId,
      status: "applied",
      appliedAt: new Date().toISOString()
    };

    const res = await fetch('https://job-portal-api-zi92.onrender.com/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });

    if (res.ok) {
      setIsApplied(true);
      alert("Applied successfully!");
    }
  };

  return (
    <div className="border p-5 rounded-lg shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-blue-700">{job.title}</h3>
            <p className="text-gray-600 font-medium">{job.location} | {job.jobType}</p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {job.salaryRange}
          </span>
        </div>
        <p className="mt-2 text-gray-500 line-clamp-2">{job.description}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {job.requiredSkills.slice(0, 3).map(skill => (
            <span key={skill} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <div className="flex gap-2">
          {/* APPLY BUTTON */}
          <button 
            onClick={handleApply}
            disabled={isApplied}
            className={`flex-1 py-2 rounded text-sm font-bold transition ${
              isApplied 
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isApplied ? "Applied" : "Quick Apply"}
          </button>

          {/* SAVE BUTTON */}
          <button 
            onClick={handleSave}
            className={`px-3 py-2 rounded border transition ${
              isSaved 
                ? "bg-yellow-400 border-yellow-400 text-white" 
                : "border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {isSaved ? "★" : "☆"}
          </button>
        </div>

        {/* VIEW DETAILS BUTTON */}
        <div className="border p-5 rounded-lg shadow-sm bg-white">
      {/* ... other code ... */}
      <Link 
        href={`/jobs/${job.id}`} // This points to the dynamic ID
        className="mt-4 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold"
      >
        View Details
      </Link>
    </div>
      </div>
    </div>
  );
}

