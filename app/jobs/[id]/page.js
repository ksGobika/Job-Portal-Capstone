/*"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { appService } from '@/services/api';

export default function JobDetails({ params }) {
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetch(`http://localhost:5000/jobs/${params.id}`)
      .then(res => res.json())
      .then(data => setJob(data));
  }, [params.id]);

  const handleApply = async () => {
    if (!user) return alert("Please login to apply");
    
    const applicationData = {
      jobId: job.id,
      jobTitle: job.title,
      seekerId: user.id,
      seekerName: user.name,
      employerId: job.employerId,
      status: "applied",
      appliedAt: new Date().toISOString()
    };

    await appService.applyToJob(applicationData);
    setApplied(true);
    alert("Application Submitted Successfully!");
  };

  if (!job) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow mt-10 rounded">
      <h2 className="text-4xl font-bold">{job.title}</h2>
      <p className="text-xl text-gray-600 mb-4">{job.location} · {job.salaryRange}</p>
      
      <div className="border-t pt-4">
        <h3 className="font-bold text-lg">Job Description</h3>
        <p className="text-gray-700 mt-2">{job.description}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg">Requirements</h3>
        <ul className="list-disc ml-5 mt-2">
          {job.requiredSkills.map(skill => <li key={skill}>{skill}</li>)}
        </ul>
      </div>

      {applied ? (
        <button disabled className="mt-8 bg-gray-400 text-white px-10 py-3 rounded">Applied</button>
      ) : (
        <button onClick={handleApply} className="mt-8 bg-green-600 text-white px-10 py-3 rounded hover:bg-green-700">
          Apply Now
        </button>
      )}
    </div>
  );
}*/

/*"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function JobDetails({ params }) {
  const { id } = params; // Get job ID from URL
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJobAndUserStatus = async () => {
      try {
        // 1. Fetch Job Details
        const jobRes = await fetch(`http://localhost:5000/jobs/${id}`);
        const jobData = await jobRes.json();
        setJob(jobData);

        if (isAuthenticated && user) {
          // 2. Check if already applied
          const appRes = await fetch(`http://localhost:5000/applications?jobId=${id}&seekerId=${user.id}`);
          const appData = await appRes.json();
          if (appData.length > 0) setApplied(true);

          // 3. Check if already saved
          if (user.savedJobs?.includes(id)) setIsSaved(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndUserStatus();
  }, [id, isAuthenticated, user]);

  const handleApply = async () => {
    if (!isAuthenticated) return router.push('/login');

    const applicationData = {
      jobId: job.id,
      jobTitle: job.title,
      seekerId: user.id,
      seekerName: user.name,
      employerId: job.employerId,
      status: "applied",
      appliedAt: new Date().toISOString()
    };

    const res = await fetch('http://localhost:5000/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });

    if (res.ok) {
      setApplied(true);
      alert("Application submitted successfully!");
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return router.push('/login');

    const updatedSavedJobs = isSaved 
      ? user.savedJobs.filter(jobId => jobId !== id) // Remove if already saved
      : [...(user.savedJobs || []), id]; // Add if not saved

    const res = await fetch(`http://localhost:5000/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedJobs: updatedSavedJobs })
    });

    if (res.ok) {
      setIsSaved(!isSaved);
      alert(isSaved ? "Job removed from saved list" : "Job saved successfully!");
    }
  };

  if (loading) return <div className="text-center mt-20 text-black">Loading job details...</div>;
  if (!job) return <div className="text-center mt-20 text-black">Job not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl mt-10 rounded-2xl border border-gray-100 mb-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-blue-900">{job.title}</h1>
          <p className="text-xl text-gray-600 mt-2">{job.location} • {job.jobType}</p>
        </div>
        <button 
          onClick={handleSave}
          className={`px-6 py-2 rounded-lg font-semibold border transition ${
            isSaved ? "bg-yellow-100 border-yellow-500 text-yellow-700" : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
          }`}
        >
          {isSaved ? "★ Saved" : "☆ Save Job"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Salary</p><p className="font-bold text-black">{job.salaryRange}</p></div>
        <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Experience</p><p className="font-bold text-black">{job.experienceLevel}</p></div>
        <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Industry</p><p className="font-bold text-black">{job.industry}</p></div>
        <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Deadline</p><p className="font-bold text-black">{job.deadline}</p></div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Description</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
      </div>

      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Required Skills</h3>
        <div className="flex flex-wrap gap-2">
          {job.requiredSkills.map(skill => (
            <span key={skill} className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full font-medium border border-blue-100">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t pt-8">
        {applied ? (
          <button disabled className="w-full bg-green-100 text-green-700 py-4 rounded-xl font-bold text-xl cursor-not-allowed">
            ✓ You have applied for this job
          </button>
        ) : (
          <button 
            onClick={handleApply}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-blue-700 transition shadow-lg"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
}*/

/*"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function JobDetails({ params }) {
  const { id } = params; // Get job ID from URL
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Job Info
        const jobRes = await fetch(`http://localhost:5000/jobs/${id}`);
        const jobData = await jobRes.json();
        setJob(jobData);

        if (isAuthenticated && user) {
          // 2. Check if user already applied
          const appRes = await fetch(`http://localhost:5000/applications?jobId=${id}&seekerId=${user.id}`);
          const appData = await appRes.json();
          if (appData.length > 0) setIsApplied(true);

          // 3. Check if user already saved this job
          const userRes = await fetch(`http://localhost:5000/users/${user.id}`);
          const userData = await userRes.json();
          if (userData.savedJobs?.includes(id)) setIsSaved(true);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthenticated, user]);

  // --- LOGIC FOR APPLY BUTTON ---
  const handleApply = async () => {
    if (!isAuthenticated) return router.push('/login');

    const application = {
      jobId: job.id,
      jobTitle: job.title,
      seekerId: user.id,
      seekerName: user.name,
      employerId: job.employerId,
      status: "applied",
      appliedAt: new Date().toISOString()
    };

    const res = await fetch('http://localhost:5000/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application)
    });

    if (res.ok) {
      setIsApplied(true);
      alert("Application sent successfully!");
    }
  };

  // --- LOGIC FOR SAVE BUTTON ---
  const handleSave = async () => {
    if (!isAuthenticated) return router.push('/login');

    // Get current saved list or empty array
    const currentSaved = user.savedJobs || [];
    let updatedSaved;

    if (isSaved) {
      updatedSaved = currentSaved.filter(jobId => jobId !== id); // Remove
    } else {
      updatedSaved = [...currentSaved, id]; // Add
    }

    const res = await fetch(`http://localhost:5000/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedJobs: updatedSaved })
    });

    if (res.ok) {
      setIsSaved(!isSaved);
      alert(isSaved ? "Job unsaved" : "Job saved for later!");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white shadow-2xl mt-10 rounded-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{job?.title}</h1>
          <p className="text-blue-600 font-semibold">{job?.location} • {job?.jobType}</p>
        </div>
        
       
        <button 
          onClick={handleSave}
          className={`px-6 py-2 rounded-full border transition-all ${
            isSaved ? "bg-yellow-500 text-white border-yellow-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {isSaved ? "★ Saved" : "☆ Save Job"}
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl mb-8 flex gap-10">
        <div><p className="text-sm text-gray-400">Salary</p><p className="font-bold">{job?.salaryRange}</p></div>
        <div><p className="text-sm text-gray-400">Experience</p><p className="font-bold">{job?.experienceLevel}</p></div>
        <div><p className="text-sm text-gray-400">Industry</p><p className="font-bold">{job?.industry}</p></div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-bold mb-3">Job Description</h3>
        <p className="text-gray-700 leading-relaxed">{job?.description}</p>
      </div>

    
      {isApplied ? (
        <button disabled className="w-full bg-green-100 text-green-700 py-4 rounded-xl font-bold text-lg cursor-not-allowed">
          ✓ Application Submitted
        </button>
      ) : (
        <button 
          onClick={handleApply}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg"
        >
          Apply Now
        </button>
      )}
    </div>
  );
}*/

/*"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function JobDetails({ params }) {
  const { id } = params;
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [showForm, setShowForm] = useState(false); // Toggle the form
  
  // Form State
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/jobs/${id}`);
        const data = await res.json();
        setJob(data);

        // Check if user already applied
        if (isAuthenticated && user) {
          const appRes = await fetch(`http://localhost:5000/applications?jobId=${id}&seekerId=${user.id}`);
          const appData = await appRes.json();
          if (appData.length > 0) setApplied(true);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [id, isAuthenticated, user]);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return router.push('/login');

    const applicationData = {
      jobId: job.id,
      jobTitle: job.title,
      employerId: job.employerId,
      seekerId: user.id,
      seekerName: user.name,
      seekerEmail: user.email,
      coverLetter: coverLetter,
      resume: resumeLink,
      status: "applied",
      appliedAt: new Date().toISOString()
    };

    const res = await fetch('http://localhost:5000/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });

    if (res.ok) {
      setApplied(true);
      setShowForm(false);
      alert("Application submitted successfully!");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-8">
        <h1 className="text-4xl font-bold text-blue-900">{job?.title}</h1>
        <p className="text-gray-600 text-xl mt-2">{job?.location} • {job?.jobType}</p>
        
        <div className="mt-6 text-gray-700">
          <h3 className="font-bold text-lg">Description:</h3>
          <p>{job?.description}</p>
        </div>

        {!applied && !showForm && (
          <button 
            onClick={() => isAuthenticated ? setShowForm(true) : router.push('/login')}
            className="mt-8 bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full"
          >
            Apply for this Job
          </button>
        )}

        {applied && (
          <div className="mt-8 bg-green-100 text-green-700 p-4 rounded-xl text-center font-bold">
            ✓ You have already applied for this position.
          </div>
        )}
      </div>

    
      {showForm && (
        <div className="bg-blue-50 p-8 rounded-2xl shadow-inner border border-blue-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Application Form</h2>
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Full Name</label>
              <input type="text" disabled value={user?.name} className="w-full p-3 bg-gray-100 border rounded-lg cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Email Address</label>
              <input type="email" disabled value={user?.email} className="w-full p-3 bg-gray-100 border rounded-lg cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Resume Link (URL)</label>
              <input 
                type="url" 
                required 
                placeholder="https://drive.google.com/your-resume"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Cover Letter</label>
              <textarea 
                required
                placeholder="Tell us why you're a great fit for this role..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button 
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
              >
                Submit Application
              </button>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}*/

"use client";
import React, { useState, useEffect } from 'react'; // 1. Import React
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function JobDetails({ params }) {
  // 2. Unwrap params using React.use()
  const { id } = React.use(params); 
  
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch Job
        const res = await fetch(`http://localhost:5000/jobs/${id}`);
        const data = await res.json();
        setJob(data);

        // Check application status
        if (isAuthenticated && user) {
          const appRes = await fetch(`http://localhost:5000/applications?jobId=${id}&seekerId=${user.id}`);
          const appData = await appRes.json();
          if (appData.length > 0) {
            setApplied(true);
            setApplicationId(appData[0].id);
          }
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, isAuthenticated, user]);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    const applicationData = {
      jobId: job.id,
      jobTitle: job.title,
      employerId: job.employerId,
      seekerId: user.id,
      seekerName: user.name,
      coverLetter,
      resume: resumeLink,
      status: "applied",
      appliedAt: new Date().toISOString()
    };

    const res = await fetch('http://localhost:5000/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });

    if (res.ok) {
      const saved = await res.json();
      setApplied(true);
      setApplicationId(saved.id);
      setShowForm(false);
      alert("Application Submitted!");
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm("Withdraw your application?")) {
      await fetch(`http://localhost:5000/applications/${applicationId}`, { method: 'DELETE' });
      setApplied(false);
      setApplicationId(null);
      alert("Withdrawn.");
    }
  };

  if (loading) return <div className="p-20 text-center text-black">Loading...</div>;
  if (!job) return <div className="p-20 text-center text-black">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl mt-10 rounded-2xl border">
      <h1 className="text-3xl font-bold text-blue-900">{job.title}</h1>
      <p className="text-gray-500 mb-6">{job.location} | {job.jobType}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
        <p><strong>Salary:</strong> {job.salaryRange}</p>
        <p><strong>Experience:</strong> {job.experienceLevel}</p>
        <p><strong>Industry:</strong> {job.industry}</p>
        <p><strong>Deadline:</strong> {job.deadline}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Description</h3>
        <p className="text-gray-700 leading-relaxed">{job.description}</p>
      </div>

      {!applied && !showForm && (
        <button 
          onClick={() => isAuthenticated ? setShowForm(true) : router.push('/login')}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
        >
          Apply Now
        </button>
      )}

      {applied && (
        <div className="space-y-3">
          <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center font-bold border border-green-200">
            ✓ You have applied
          </div>
          <button onClick={handleWithdraw} className="w-full text-red-500 font-bold">
            Withdraw Application
          </button>
        </div>
      )}

      {showForm && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h2 className="text-xl font-bold mb-4">Submit Application</h2>
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            <input 
              type="url" required placeholder="Resume Link" 
              className="w-full p-3 border rounded-lg text-black"
              onChange={e => setResumeLink(e.target.value)} 
            />
            <textarea 
              required placeholder="Cover Letter" rows="4"
              className="w-full p-3 border rounded-lg text-black"
              onChange={e => setCoverLetter(e.target.value)}
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Submit</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      // Add this near your other buttons in app/jobs/[id]/page.js
{!showForm && (
  <button 
    onClick={() => router.push(`/seeker/messages?targetId=${job.employerId}&targetName=${job.companyName || 'Employer'}`)}
    className="mt-4 w-full bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-black transition"
  >
    💬 Message Employer
  </button>
)}
    </div>
  );
}