"use client";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';

export default function JobDetails({ params }) {
  const { id } = React.use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  useEffect(() => {
    const shouldOpenForm = searchParams.get('apply');
    if (shouldOpenForm === 'true' && isAuthenticated) {
      setShowForm(true);
    }

    const fetchDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5001/jobs/${id}`);
        const data = await res.json();
        setJob(data);

        if (isAuthenticated && user) {
          const appRes = await fetch(`http://localhost:5001/applications?jobId=${id}&seekerId=${user.id}`);
          const appData = await appRes.json();
          if (appData.length > 0) {
            setApplied(true);
            setApplicationId(appData[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, isAuthenticated, user, searchParams]);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    const applicationData = {
      jobId: String(job.id),
      jobTitle: job.title,
      employerId: job.employerId,
      seekerId: user.id,
      seekerName: user.name,
      coverLetter,
      resume: resumeLink,
      status: "applied",
      appliedAt: new Date().toISOString()
    };

    const res = await fetch('http://localhost:5001/applications', {
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
    if (window.confirm("Are you sure?")) {
      await fetch(`http://localhost:5001/applications/${applicationId}`, { method: 'DELETE' });
      setApplied(false);
      setApplicationId(null);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading...</div>;
  if (!job) return <div className="p-20 text-center">Job not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white p-10 rounded-3xl shadow-xl border">
        <h1 className="text-4xl font-black text-blue-900">{job.title}</h1>
        <p className="text-xl text-gray-700 mt-2 font-bold">{job.location} | {job.jobType}</p>
        <div className="mt-8 text-lg text-gray-700">{job.description}</div>

        {!applied && !showForm && (
          <button onClick={() => isAuthenticated ? setShowForm(true) : router.push('/login')} className="mt-10 w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xl hover:bg-blue-700">Apply Now</button>
        )}

        {applied && (
          <div className="mt-10 space-y-4 text-center">
            <div className="bg-green-100 text-green-800 p-5 rounded-2xl font-black text-xl border">✓ Applied Successfully</div>
            <button onClick={handleWithdraw} className="text-red-600 font-bold hover:underline">Withdraw Application</button>
          </div>
        )}

        <button onClick={() => router.push(`/seeker/messages?targetId=${job.employerId}&targetName=${job.companyName || 'Employer'}`)} className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black transition">💬 Message Employer</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl">
            <h2 className="text-3xl font-black mb-6 text-gray-900">Application Form</h2>
            <form onSubmit={handleSubmitApplication} className="space-y-5">
               <input type="url" required placeholder="Resume Link" className="w-full p-4 border rounded-2xl text-black" onChange={e => setResumeLink(e.target.value)} />
               <textarea required placeholder="Cover Letter" rows="5" className="w-full p-4 border rounded-2xl text-black" onChange={e => setCoverLetter(e.target.value)} />
               <div className="flex gap-4">
                 <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black">Submit</button>
                 <button type="button" onClick={() => setShowForm(false)} className="px-6 font-bold">Cancel</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}