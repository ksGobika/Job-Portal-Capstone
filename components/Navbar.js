"use client";

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  if (!mounted) return <nav className="bg-slate-900 h-16 w-full"></nav>;

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-extrabold text-blue-400 tracking-tighter">
            JobPortal
          </Link>
          
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            {(!isAuthenticated || user?.role === 'seeker') && (
              <Link href="/jobs" className="hover:text-blue-400 transition">Find Jobs</Link>
            )}
            
            {isAuthenticated && user?.role === 'seeker' && (
              <>
                <Link href="/seeker/profile" className="hover:text-blue-400 transition">Profile</Link>
                <Link href="/seeker/messages" className="hover:text-blue-400 transition">Messages</Link>
                <Link href="/seeker/saved-jobs" className="hover:text-blue-400 transition">Saved</Link>
                <Link href="/seeker/applications" className="hover:text-blue-400 transition">My Apps</Link>
              </>
            )}

            {isAuthenticated && user?.role === 'employer' && (
              <>
                <Link href="/employer/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
                <Link href="/employer/post-job" className="hover:text-blue-400 transition">Post Job</Link>
                <Link href="/seeker/messages" className="hover:text-blue-400 transition">Inbox</Link>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
               <Link href="/admin/dashboard" className="hover:text-blue-400 transition">Analytics</Link>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-blue-100 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                {user?.name} ({user?.role})
              </span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login" className="text-sm font-medium hover:text-blue-400 transition">Login</Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}