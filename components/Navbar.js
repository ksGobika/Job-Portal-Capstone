/*"use client";
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <Link href="/" className="font-bold text-xl">JobPortal</Link>
      
      <div className="space-x-4">
        {!isAuthenticated ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        ) : (
          <>
            
            {user.role === 'seeker' && (
              <>
                <Link href="/jobs">Find Jobs</Link>
                <Link href="/seeker/applications">My Apps</Link>
              </>
            )}

          
            {user.role === 'employer' && (
              <>
                <Link href="/employer/post-job">Post a Job</Link>
                <Link href="/employer/dashboard">Dashboard</Link>
              </>
            )}

         
            {user.role === 'admin' && (
              <Link href="/admin/dashboard">Admin Panel</Link>
            )}

            <button onClick={() => dispatch(logout())} className="bg-red-500 px-3 py-1 rounded">
              Logout ({user.name})
            </button>
          </>
        )}
      </div>
    </nav>
  );
}*/

/*"use client";

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  
  // 1. Add a 'mounted' state
  const [mounted, setMounted] = useState(false);

  // 2. Set mounted to true once the component runs in the browser
  useEffect(() => {
    setMounted(true);
  }, []);

  // 3. If not mounted yet, render a simple version (prevents mismatch)
  if (!mounted) {
    return (
      <nav className="flex justify-between items-center p-4 bg-slate-900 text-white shadow-lg">
        <Link href="/" className="text-xl font-bold">JobPortal</Link>
        <div className="space-x-6">
          <Link href="/jobs">Find Jobs</Link>
          <Link href="/login">Login</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-slate-900 text-white shadow-lg">
      <Link href="/" className="text-xl font-bold">JobPortal</Link>
      
      <div className="space-x-6 flex items-center">
        <Link href="/jobs" className="hover:text-blue-300">Find Jobs</Link>
        
        {isAuthenticated ? (
          <>
            <Link href="/seeker/applications" className="hover:text-blue-300">My Apps</Link>
            <div className="flex items-center gap-4">
              <span className="text-sm bg-slate-700 px-3 py-1 rounded-full text-blue-300">
                {user?.name}
              </span>
              <button 
                onClick={() => dispatch(logout())}
                className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition text-sm font-bold"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-blue-300">Login</Link>
            <Link href="/register" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>

    
  );
}*/

/*"use client";

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="flex justify-between items-center p-4 bg-slate-900 text-white shadow-lg">
        <Link href="/" className="text-xl font-bold">JobPortal</Link>
        <div className="space-x-6">
          <Link href="/jobs">Find Jobs</Link>
          <Link href="/login">Login</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-slate-900 text-white shadow-lg">
      <Link href="/" className="text-xl font-bold">JobPortal</Link>
      
      <div className="space-x-6 flex items-center">
   
        <Link href="/jobs" className="hover:text-blue-300 transition">Find Jobs</Link>
        
        {isAuthenticated ? (
          <>
        
            {user?.role === 'seeker' && (
              <>
                <Link href="/seeker/profile" className="hover:text-blue-300 transition">Profile</Link>
                <Link href="/seeker/applications" className="hover:text-blue-300 transition">My Apps</Link>
              </>
            )}

        
            {user?.role === 'employer' && (
              <>
                <Link href="/employer/dashboard" className="hover:text-blue-300 transition">Dashboard</Link>
                <Link href="/employer/post-job" className="hover:text-blue-300 transition">Post Job</Link>
              </>
            )}

      
            {user?.role === 'admin' && (
              <Link href="/admin/dashboard" className="hover:text-blue-300 transition">Admin Panel</Link>
            )}

     
            <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
              <Link href={user?.role === 'seeker' ? "/seeker/profile" : "#"}>
                <span className="text-sm bg-slate-700 px-3 py-1 rounded-full text-blue-300 hover:bg-slate-600 transition cursor-pointer">
                  {user?.name}
                </span>
              </Link>
              <button 
                onClick={() => dispatch(logout())}
                className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition text-sm font-bold"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-blue-300 transition">Login</Link>
            <Link href="/register" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition font-bold">
              Register
            </Link>
          </>
        )}
      </div>
      // Inside your Navbar.js Link section:

{user?.role === 'seeker' && (
  <>
    <Link href="/seeker/profile" className="hover:text-blue-300 transition">Profile</Link>
    
  
    <Link href="/seeker/saved-jobs" className="hover:text-blue-300 transition">Saved Jobs</Link>
    
    <Link href="/seeker/applications" className="hover:text-blue-300 transition">My Apps</Link>
  </>
)}
    </nav>

    
  );
}*/

"use client";

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple loading state for the navbar to prevent flickering
  if (!mounted) {
    return (
      <nav className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">JobPortal</Link>
          <div className="flex space-x-6 text-sm font-medium">
            <Link href="/jobs">Find Jobs</Link>
            <Link href="/login">Login</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT SIDE: Logo and Main Nav */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-extrabold text-blue-400 tracking-tighter">
            JobPortal
          </Link>
          
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            <Link href="/jobs" className="hover:text-blue-400 transition">Find Jobs</Link>
            
            {/* SEEKER LINKS */}
            {isAuthenticated && user?.role === 'seeker' && (
              <>
                <Link href="/seeker/profile" className="hover:text-blue-400 transition">Profile</Link>
                <Link href="/seeker/saved-jobs" className="hover:text-blue-400 transition">Saved Jobs</Link>
                <Link href="/seeker/applications" className="hover:text-blue-400 transition">My Apps</Link>
              </>
            )}

            {/* EMPLOYER LINKS */}
            {isAuthenticated && user?.role === 'employer' && (
              <>
                <Link href="/employer/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
                <Link href="/employer/post-job" className="hover:text-blue-400 transition">Post Job</Link>
              </>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: User Actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {/* User Identity Pill */}
              <Link 
                href={user?.role === 'seeker' ? "/seeker/profile" : "/employer/dashboard"}
                className="flex items-center bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-full px-4 py-1.5 transition"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                <span className="text-sm font-semibold text-blue-100">{user?.name}</span>
              </Link>
              
              {/* Logout Button */}
              <button 
                onClick={() => dispatch(logout())}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login" className="text-sm font-medium hover:text-blue-400 px-3 py-2 transition">
                Login
              </Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition">
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
      <Link href="/seeker/messages" className="hover:text-blue-300 transition">Messages</Link>
    </nav>
  );
}