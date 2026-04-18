"use client";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function PostJobPage() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: 'Full-time',
    industry: '',
    experienceLevel: 'Entry',
    salaryRange: '',
    requiredSkills: '', 
    deadline: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newJob = {
      employerId: user?.id, 
      companyName: user?.name, // Store company name for admin to see
      title: formData.title,
      description: formData.description,
      location: formData.location,
      jobType: formData.jobType,
      industry: formData.industry,
      experienceLevel: formData.experienceLevel,
      salaryRange: formData.salaryRange,
      requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()),
      deadline: formData.deadline,
      postedAt: new Date().toISOString(),
      
      // --- CRITICAL CHANGE START ---
      status: "pending", // Changed from "approved" to "pending"
      // --- CRITICAL CHANGE END ---
      
      views: 0
    };

    try {
      const res = await fetch('http://localhost:5001/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });

      if (res.ok) {
        // Updated alert to inform employer about the approval process
        alert("Job submitted successfully! It will be visible once the Admin approves it.");
        router.push('/employer/dashboard'); 
      }
    } catch (error) {
      alert("Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg mt-10 rounded-xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-blue-900">Post a New Opening</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
          <input type="text" required placeholder="e.g. Senior React Developer"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-black"
            onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Industry</label>
          <input type="text" required placeholder="e.g. IT, Finance"
            className="w-full p-3 border rounded-lg text-black"
            onChange={e => setFormData({...formData, industry: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
          <input type="text" required placeholder="e.g. Remote, Chennai"
            className="w-full p-3 border rounded-lg text-black"
            onChange={e => setFormData({...formData, location: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Job Type</label>
          <select className="w-full p-3 border rounded-lg bg-white text-black"
            onChange={e => setFormData({...formData, jobType: e.target.value})}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Experience Level</label>
          <select className="w-full p-3 border rounded-lg bg-white text-black"
            onChange={e => setFormData({...formData, experienceLevel: e.target.value})}>
            <option>Entry</option>
            <option>Intermediate</option>
            <option>Senior</option>
            <option>Expert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Salary Range</label>
          <input type="text" placeholder="e.g. 80k - 120k"
            className="w-full p-3 border rounded-lg text-black"
            onChange={e => setFormData({...formData, salaryRange: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Application Deadline</label>
          <input type="date" required
            className="w-full p-3 border rounded-lg text-black"
            onChange={e => setFormData({...formData, deadline: e.target.value})} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Required Skills (Comma separated)</label>
          <input type="text" required placeholder="React, Redux, TypeScript"
            className="w-full p-3 border rounded-lg text-black"
            onChange={e => setFormData({...formData, requiredSkills: e.target.value})} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Job Description</label>
          <textarea required rows="4" placeholder="Detailed job requirements..."
            className="w-full p-3 border rounded-lg text-black"
            onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <button disabled={loading} className="md:col-span-2 bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">
          {loading ? "Submitting..." : "Post Job for Approval"}
        </button>
      </form>
    </div>
  );
}