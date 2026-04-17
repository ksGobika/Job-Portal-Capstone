"use client";
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
}