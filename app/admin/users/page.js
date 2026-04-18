"use client";
import { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const deleteUser = async (id) => {
    if (window.confirm("Delete this user permanently?")) {
      await fetch(`http://localhost:5001/users/${id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-6">User Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map(u => (
          <div key={u.id} className="p-6 bg-white border rounded-2xl shadow-sm flex justify-between items-center">
            <div>
              <p className="font-bold text-lg text-gray-900">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email} • <span className="uppercase font-black text-blue-600">{u.role}</span></p>
            </div>
            {u.role !== 'admin' && (
              <button onClick={() => deleteUser(u.id)} className="text-red-600 font-bold hover:bg-red-50 p-2 rounded-lg transition">Remove User</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}