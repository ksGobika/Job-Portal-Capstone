"use client";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice'; // Adjust path if needed
import { useRouter } from 'next/navigation';

export default function SeekerProfile() {
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const router = useRouter();

  // 1. Initialize local state with current user data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    bio: '',
    skills: '', // We'll handle this as a string and convert to array on save
    education: '',
    experience: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 2. Load existing user data into the form
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        title: user.profile?.title || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills?.join(', ') || '',
        education: user.profile?.education || '',
        experience: user.profile?.experience || ''
      });
    } else if (!isAuthenticated) {
      router.push('/login');
    }
  }, [user, isAuthenticated, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 3. Construct the updated user object
    const updatedData = {
      name: formData.name,
      profile: {
        title: formData.title,
        bio: formData.bio,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== ""),
        education: formData.education,
        experience: formData.experience
      }
    };

    try {
      // 4. Update the database (JSON Server)
      const res = await fetch(`http://localhost:5001/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        const fullUpdatedUser = await res.json();
        
        // 5. Update Redux store so Navbar and other pages reflect changes
        dispatch(setUser(fullUpdatedUser));
        
        setMessage("Profile updated successfully! ✅");
      }
    } catch (error) {
      setMessage("Error updating profile. ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="bg-blue-900 p-8 text-white">
          <h1 className="text-3xl font-bold">Manage Profile</h1>
          <p className="text-blue-200 mt-2">Keep your professional information up to date.</p>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          {message && (
            <div className={`p-4 rounded-lg text-center font-bold ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full p-3 border rounded-xl text-black" value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email (Read Only)</label>
              <input type="email" disabled className="w-full p-3 bg-gray-50 border rounded-xl text-gray-500 cursor-not-allowed" value={formData.email} />
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Professional Title</label>
            <input type="text" placeholder="e.g. Senior Frontend Developer" className="w-full p-3 border rounded-xl text-black" value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Skills (Comma separated)</label>
            <input type="text" placeholder="React, Node.js, CSS" className="w-full p-3 border rounded-xl text-black" value={formData.skills} 
              onChange={(e) => setFormData({...formData, skills: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Education</label>
              <input type="text" placeholder="Degree, University" className="w-full p-3 border rounded-xl text-black" value={formData.education} 
                onChange={(e) => setFormData({...formData, education: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Total Experience</label>
              <input type="text" placeholder="e.g. 3 years" className="w-full p-3 border rounded-xl text-black" value={formData.experience} 
                onChange={(e) => setFormData({...formData, experience: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Professional Bio</label>
            <textarea rows="4" className="w-full p-3 border rounded-xl text-black" value={formData.bio} 
              onChange={(e) => setFormData({...formData, bio: e.target.value})} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
            {loading ? "Saving Changes..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}