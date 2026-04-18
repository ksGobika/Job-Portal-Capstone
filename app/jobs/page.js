"use client";
import { useState, useEffect } from 'react';
import JobCard from '../../components/JobCard'; // Adjust path if needed

export default function JobSearchPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to fetch jobs from json-server
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // 1. Start with the base URL (only approved jobs)
      let url = `http://localhost:5001/jobs?status=approved`;

      // 2. Add Job Type filter if selected
      if (filterType) {
        url += `&jobType=${filterType}`;
      }

      // 3. Add Search query (json-server uses 'q' for global search)
      if (search) {
        url += `&q=${search}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobs();
  }, []); // Runs once on mount

  // Optional: Automatically search when filter changes
  useEffect(() => {
    fetchJobs();
  }, [filterType]);

  const handleSearchClick = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Explore Opportunities</h1>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white p-4 shadow-sm rounded-lg border">
        <input 
          type="text" 
          placeholder="Search by title, skills, or company..." 
          className="flex-1 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-black"
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchJobs()} // Search on Enter key
        />
        
        <select 
          className="p-3 border rounded-md bg-white text-black"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
          <option value="Part-time">Part-time</option>
        </select>

        <button 
          onClick={handleSearchClick}
          className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold hover:bg-blue-700 transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Job Grid */}
      {loading ? (
        <div className="text-center py-20 text-xl text-gray-500">Loading jobs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0 ? (
            jobs.map(job => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-gray-500">No jobs found matching "{search}"</p>
              <button 
                onClick={() => {setSearch(''); setFilterType(''); fetchJobs();}}
                className="text-blue-600 underline mt-2"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}