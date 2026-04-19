"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setUser } from '../../store/slices/authSlice';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seeker' // Default role
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    // Prepare the user object based on role
    const newUser = {
      ...formData,
      profile: formData.role === 'seeker' ? { title: '', skills: [], bio: '' } : null,
      company: formData.role === 'employer' ? { name: formData.name, description: '' } : null,
      savedJobs: []
    };

    try {
      const res = await fetch('https://job-portal-api-zi92.onrender.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        alert("Registration Successful! Please Login.");
        router.push('/login');
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Create Account</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700">Full Name / Company Name</label>
          <input type="text" required className="w-full p-2 border rounded mt-1"
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email Address</label>
          <input type="email" required className="w-full p-2 border rounded mt-1"
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input type="password" required className="w-full p-2 border rounded mt-1"
            onChange={(e) => setFormData({...formData, password: e.target.value})} />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Register As</label>
          <select className="w-full p-2 border rounded mt-1"
            onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
          Sign Up
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}