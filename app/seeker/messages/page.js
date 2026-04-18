"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import ChatBox from '@/components/ChatBox';

function MessagesContent() {
  const { user } = useSelector((state) => state.auth || {});
  const searchParams = useSearchParams();
  const targetId = searchParams.get('targetId');
  const targetName = searchParams.get('targetName');

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;
      const res = await fetch(`http://localhost:5001/messages`);
      const allMsgs = await res.json();
      const involvedIds = new Set();
      allMsgs.forEach(m => {
        if (m.senderId === user.id) involvedIds.add(m.receiverId);
        if (m.receiverId === user.id) involvedIds.add(m.senderId);
      });

      const userRes = await fetch(`http://localhost:5001/users`);
      const allUsers = await userRes.json();
      let contactList = allUsers.filter(u => involvedIds.has(u.id));

      if (targetId && !involvedIds.has(targetId)) {
        contactList.push({ id: targetId, name: targetName, role: 'employer' });
      }
      setContacts(contactList);
      if (targetId) setSelectedContact({ id: targetId, name: targetName });
    };
    fetchContacts();
  }, [user, targetId]);

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] p-4 lg:p-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 h-[80vh]">
        
        {/* SIDEBAR: CONTACTS */}
        <div className="w-full md:w-80 bg-white rounded-2xl shadow-md flex flex-col overflow-hidden border">
          <div className="p-5 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map(c => (
              <button 
                key={c.id} 
                onClick={() => setSelectedContact(c)} 
                className={`w-full flex items-center gap-3 p-4 border-b transition ${
                  selectedContact?.id === c.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                  {c.name[0]}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="font-bold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-tighter">{c.role}</p>
                </div>
              </button>
            ))}
            {contacts.length === 0 && (
              <p className="p-10 text-center text-gray-400 text-sm">No conversations yet.</p>
            )}
          </div>
        </div>

        {/* MAIN: CHAT WINDOW */}
        <div className="flex-1 h-full">
          {selectedContact ? (
            <ChatBox currentUser={user} targetUser={selectedContact} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-2xl text-gray-400">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg font-medium">Select a contact to start messaging</p>
              <p className="text-sm">Talk to employers about your applications</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function SeekerMessages() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading Messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}