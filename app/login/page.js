"use client";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice'; // Adjust path if needed
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Fetch user by email from json-server
      const res = await fetch(`http://localhost:5000/users?email=${email}`);
      const data = await res.json();
      const user = data[0];

      if (user && user.password === password) {
        // Save to Redux and LocalStorage
        dispatch(setUser(user));
        
        // Role-based redirection
        if (user.role === 'admin') router.push('/admin/dashboard');
        else if (user.role === 'employer') router.push('/employer/dashboard');
        else router.push('/jobs');
      } else {
        alert("Invalid email or password");
      }
    } catch (err) {
      alert("Server error. Is json-server running?");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Welcome Back</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700">Email Address</label>
          <input type="email" required className="w-full p-2 border rounded mt-1"
            onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input type="password" required className="w-full p-2 border rounded mt-1"
            onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
          Login
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}