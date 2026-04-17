"use client";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';
import { authService } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // In real app, verify this
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login(email);
      const user = res.data[0];

      if (user && user.password === password) {
        dispatch(setUser(user));
        
        // Redirect based on role
        if (user.role === 'admin') router.push('/admin/dashboard');
        else if (user.role === 'employer') router.push('/employer/dashboard');
        else router.push('/jobs');
      } else {
        alert("Invalid Credentials");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="p-8 border rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 font-bold">Login</h2>
        <input 
          type="email" placeholder="Email" className="w-full p-2 mb-4 border"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Password" className="w-full p-2 mb-4 border"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}