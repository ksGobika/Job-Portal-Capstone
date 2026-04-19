/*"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function MessagingPage() {
  const { user } = useSelector(state => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch messages where user is sender OR receiver
    fetch(`http://localhost:5001/messages`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(m => m.senderId === user.id || m.receiverId === user.id);
        setMessages(filtered);
      });
  }, [user.id]);

  const handleSend = async () => {
    const msgData = {
      senderId: user.id,
      receiverId: "u2", // In a real app, this is the ID of the person you are chatting with
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    const res = await fetch('http://localhost:5001/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData)
    });
    const savedMsg = await res.json();
    setMessages([...messages, savedMsg]);
    setNewMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white h-[500px] overflow-y-auto p-4 mb-4 rounded shadow">
        {messages.map(m => (
          <div key={m.id} className={`mb-2 p-2 rounded max-w-[70%] ${m.senderId === user.id ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-200'}`}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} 
          className="flex-1 p-2 border rounded" placeholder="Type a message..." />
        <button onClick={handleSend} className="bg-blue-600 text-white px-6 py-2 rounded">Send</button>
      </div>
    </div>
  );
}*/


/*"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// 1. FORCE DYNAMIC: This tells Next.js "Do not try to build this page into a static file"
export const dynamic = "force-dynamic";

// 2. DISABLE SSR for ChatBox: This prevents the ID check on the server
const ChatBox = dynamic(() => import('../../../components/ChatBox'), { 
  ssr: false,
  loading: () => <div className="p-10 text-center text-black font-bold">Loading Chat...</div>
});

function MessagesContent() {
  // Use a fallback empty object to prevent "state is undefined" errors
  const auth = useSelector((state) => state.auth || {});
  const user = auth.user; // This will be null during build
  
  const searchParams = useSearchParams();
  const targetId = searchParams.get('targetId');
  const targetName = searchParams.get('targetName');

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    // 3. THE "BUILD GUARD": If user is null (Build time), exit immediately
    if (!user || !user.id) return;

    const fetchContacts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/messages`);
        if (!res.ok) return;
        const allMsgs = await res.json();
        
        const involvedIds = new Set();
        allMsgs.forEach(m => {
          if (m.senderId === user.id) involvedIds.add(m.receiverId);
          if (m.receiverId === user.id) involvedIds.add(m.senderId);
        });

        const userRes = await fetch(`http://localhost:5000/users`);
        const allUsers = await userRes.json();
        let contactList = allUsers.filter(u => involvedIds.has(u.id));

        if (targetId && !involvedIds.has(targetId)) {
          contactList.push({ id: targetId, name: targetName, role: 'employer' });
        }
        setContacts(contactList);
        if (targetId) setSelectedContact({ id: targetId, name: targetName });
      } catch (err) {
        console.error("Fetch skipped during build");
      }
    };

    fetchContacts();
  }, [user, targetId, targetName]);

  // 4. THE RENDER GUARD: If user is null, return a simple div.
  // Next.js will use this simple div for the build, and it won't crash!
  if (!user || !user.id) {
    return (
      <div className="flex items-center justify-center min-h-screen text-black font-bold">
        Authenticating...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] p-4 lg:p-8 text-black">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 h-[80vh]">
        <div className="w-full md:w-80 bg-white rounded-2xl shadow-md flex flex-col overflow-hidden border">
          <div className="p-5 border-b bg-gray-50 font-bold text-gray-800 uppercase text-xs tracking-widest">Inboxes</div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map(c => (
              <button 
                key={c.id} 
                onClick={() => setSelectedContact(c)} 
                className={`w-full flex items-center gap-3 p-4 border-b transition ${selectedContact?.id === c.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">{c.name?.[0]}</div>
                <div className="text-left overflow-hidden">
                  <p className="font-bold text-gray-900 truncate">{c.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black">{c.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 h-full">
          {selectedContact ? (
            <ChatBox currentUser={user} targetUser={selectedContact} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white border-2 border-dashed rounded-2xl text-gray-400">
              <p className="font-bold text-lg">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SeekerMessages() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold text-black">Connecting...</div>}>
      <MessagesContent />
    </Suspense>
  );
}*/



"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
// 1. Rename this import to 'nextDynamic' to avoid the collision error
import nextDynamic from 'next/dynamic';

// 2. This is the Next.js Segment Config (The error "defined multiple times" is now fixed)
export const dynamic = "force-dynamic";

// 3. Fixed Path: use '../../' to get to the components folder from 'app/messages/'
const ChatBox = nextDynamic(() => import('../../components/ChatBox'), { 
  ssr: false,
  loading: () => <div className="p-10 text-center text-black font-bold">Loading Chat...</div>
});

function MessagesContent() {
  // Safe access to Redux
  const auth = useSelector((state) => state.auth || {});
  const user = auth.user; 
  
  const searchParams = useSearchParams();
  const targetId = searchParams.get('targetId');
  const targetName = searchParams.get('targetName');

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    // Build Guard
    if (!user || !user.id) return;

    const fetchContacts = async () => {
      try {
        const res = await fetch(`https://job-portal-api-zi92.onrender.com/messages`);
        if (!res.ok) return;
        const allMsgs = await res.json();
        
        const involvedIds = new Set();
        allMsgs.forEach(m => {
          if (m.senderId === user.id) involvedIds.add(m.receiverId);
          if (m.receiverId === user.id) involvedIds.add(m.senderId);
        });

        const userRes = await fetch(`https://job-portal-api-zi92.onrender.com/users`);
        const allUsers = await userRes.json();
        let contactList = allUsers.filter(u => involvedIds.has(u.id));

        if (targetId && !involvedIds.has(targetId)) {
          contactList.push({ id: targetId, name: targetName, role: 'employer' });
        }
        setContacts(contactList);
        if (targetId) setSelectedContact({ id: targetId, name: targetName });
      } catch (err) {
        console.error("Fetch skipped");
      }
    };

    fetchContacts();
  }, [user, targetId, targetName]);

  // Build Guard for Prerendering
  if (!user || !user.id) {
    return (
      <div className="flex items-center justify-center min-h-screen text-black font-bold">
        Authenticating session...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] p-4 lg:p-8 text-black">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 h-[80vh]">
        <div className="w-full md:w-80 bg-white rounded-2xl shadow-md flex flex-col overflow-hidden border border-gray-200">
          <div className="p-5 border-b bg-gray-50 font-bold text-gray-800 uppercase text-xs tracking-widest">Inboxes</div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map(c => (
              <button 
                key={c.id} 
                onClick={() => setSelectedContact(c)} 
                className={`w-full flex items-center gap-3 p-4 border-b transition ${selectedContact?.id === c.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">{c.name?.[0]}</div>
                <div className="text-left overflow-hidden">
                  <p className="font-bold text-gray-900 truncate">{c.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black">{c.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md">
          {selectedContact ? (
            <ChatBox currentUser={user} targetUser={selectedContact} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <span className="text-5xl mb-4">💬</span>
               <p className="font-bold">Select a conversation to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SeekerMessages() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold text-black">Loading...</div>}>
      <MessagesContent />
    </Suspense>
  );
}