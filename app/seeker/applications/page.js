/*"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/applications?seekerId=${user.id}`)
        .then(res => res.json())
        .then(data => setApps(data));
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      <table className="w-full border-collapse bg-white shadow">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-4 text-left">Job Title</th>
            <th className="p-4 text-left">Date Applied</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(app => (
            <tr key={app.id} className="border-b">
              <td className="p-4">{app.jobTitle}</td>
              <td className="p-4">{new Date(app.appliedAt).toLocaleDateString()}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-sm ${
                  app.status === 'shortlisted' ? 'bg-green-100 text-green-700' : 
                  app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {app.status.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}*/

/*"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/applications?seekerId=${user.id}`)
        .then(res => res.json())
        .then(data => setApps(data));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">
          My Applications
        </h1>

        <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4 text-left font-semibold uppercase text-sm tracking-wider">Job Title</th>
                <th className="p-4 text-left font-semibold uppercase text-sm tracking-wider">Date Applied</th>
                <th className="p-4 text-left font-semibold uppercase text-sm tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {apps.length > 0 ? (
                apps.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 transition">
              
                    <td className="p-4 text-gray-900 font-medium">{app.jobTitle}</td>
   
                    <td className="p-4 text-gray-700">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                        app.status === 'shortlisted' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                        app.status === 'rejected' ? 'bg-red-50 text-red-700 ring-red-600/20' : 
                        'bg-blue-50 text-blue-700 ring-blue-600/20'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-gray-500 italic">
                    You haven't applied for any jobs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}*/

"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const { user } = useSelector(state => state.auth || {});

  // Fetch applications on load
  const fetchApps = () => {
    if (user) {
      fetch(`http://localhost:5000/applications?seekerId=${user.id}`)
        .then(res => res.json())
        .then(data => setApps(data));
    }
  };

  useEffect(() => {
    fetchApps();
  }, [user]);

  // Handle Withdrawal
  const handleWithdraw = async (appId) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      try {
        const res = await fetch(`http://localhost:5000/applications/${appId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          // Update the UI by filtering out the deleted application
          setApps(apps.filter(app => app.id !== appId));
          alert("Application withdrawn successfully.");
        }
      } catch (error) {
        alert("Failed to withdraw application.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">
          My Applications
        </h1>

        <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="p-4 text-left font-semibold uppercase text-sm">Job Title</th>
                <th className="p-4 text-left font-semibold uppercase text-sm">Date Applied</th>
                <th className="p-4 text-left font-semibold uppercase text-sm">Status</th>
                <th className="p-4 text-center font-semibold uppercase text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {apps.length > 0 ? (
                apps.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-900 font-medium">{app.jobTitle}</td>
                    <td className="p-4 text-gray-700">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                        app.status === 'shortlisted' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                        app.status === 'rejected' ? 'bg-red-50 text-red-700 ring-red-600/20' : 
                        'bg-blue-50 text-blue-700 ring-blue-600/20'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleWithdraw(app.id)}
                        className="bg-red-50 text-red-600 px-4 py-1 rounded-md text-xs font-bold border border-red-200 hover:bg-red-600 hover:text-white transition"
                      >
                        WITHDRAW
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-500 italic">
                    You haven't applied for any jobs yet.
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