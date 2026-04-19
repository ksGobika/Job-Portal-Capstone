/*"use client";
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
}*/

/*"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation'; // Add useRouter
import ChatBox from '@/components/ChatBox';

function MessagesContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const targetId = searchParams.get('targetId');
  const targetName = searchParams.get('targetName');

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [mounted, setMounted] = useState(false); // Add mounted state

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // FIX: Only run this if the component is mounted AND the user exists
    if (!mounted || !user) return;

    const fetchContacts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/messages`);
        const allMsgs = await res.json();
        
        const involvedIds = new Set();
        allMsgs.forEach(m => {
          // SAFE CHECK: Use user?.id with optional chaining
          if (m.senderId === user?.id) involvedIds.add(m.receiverId);
          if (m.receiverId === user?.id) involvedIds.add(m.senderId);
        });

        const userRes = await fetch(`http://localhost:5000/users`);
        const allUsers = await userRes.json();
        let contactList = allUsers.filter(u => involvedIds.has(u.id));

        if (targetId && !involvedIds.has(targetId)) {
          contactList.push({ id: targetId, name: targetName, role: 'employer' });
        }

        setContacts(contactList);

        if (targetId) {
          setSelectedContact({ id: targetId, name: targetName });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchContacts();
  }, [user, targetId, mounted]);

  // FIX: If user is not logged in, don't try to render the chat
  if (!mounted || !user) {
    return <div className="p-20 text-center text-black">Loading chat session...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] p-4 lg:p-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 h-[80vh]">
        
  
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
}*/

/*
"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import ChatBox from '../../../components/ChatBox';

function MessagesContent() {
  // 1. Safe access to Redux state
  const auth = useSelector((state) => state.auth);
  const user = auth?.user || null;
  
  const searchParams = useSearchParams();
  const targetId = searchParams.get('targetId');
  const targetName = searchParams.get('targetName');

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [mounted, setMounted] = useState(false);

  // 2. Ensure we only run logic in the browser
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // 3. IMPORTANT: If not mounted or no user, DO NOT run the fetch
    if (!mounted || !user || !user.id) return;

    const fetchContacts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/messages`);
        const allMsgs = await res.json();
        
        const involvedIds = new Set();
        allMsgs.forEach(m => {
          // Use optional chaining for extra safety
          if (m.senderId === user?.id) involvedIds.add(m.receiverId);
          if (m.receiverId === user?.id) involvedIds.add(m.senderId);
        });

        const userRes = await fetch(`http://localhost:5000/users`);
        const allUsers = await userRes.json();
        let contactList = allUsers.filter(u => involvedIds.has(u.id));

        if (targetId && !involvedIds.has(targetId)) {
          contactList.push({ id: targetId, name: targetName, role: 'employer' });
        }

        setContacts(contactList);

        if (targetId) {
          setSelectedContact({ id: targetId, name: targetName });
        }
      } catch (err) {
        console.error("Messaging fetch error:", err);
      }
    };

    fetchContacts();
  }, [user, targetId, mounted, targetName]);

  // 4. PREVENT PRERENDER CRASH: 
  // If we are in the 'build' phase (not mounted) or not logged in, 
  // we show a simple loading message instead of the chat UI.
  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500 font-bold">Verifying Session...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] p-4 lg:p-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 h-[80vh]">
    
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
                  selectedContact?.id === c.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 uppercase">
                  {c.name ? c.name[0] : '?'}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="font-bold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-tighter">{c.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

   
        <div className="flex-1 h-full">
          {selectedContact ? (
            <ChatBox currentUser={user} targetUser={selectedContact} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-2xl text-gray-400">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg font-medium">Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. Wrap everything in Suspense (Required by Next.js for useSearchParams)
export default function SeekerMessages() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Initializing...</div>}>
      <MessagesContent />
    </Suspense>
  );
}*/



/*"use client";
import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic'; // 1. Import dynamic
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';

// 2. Import ChatBox dynamically with SSR disabled
const ChatBox = dynamic(() => import('../../../components/ChatBox'), { 
  ssr: false,
  loading: () => <p className="p-10 text-center text-black">Loading Chat...</p>
});

function MessagesContent() {
  const auth = useSelector((state) => state.auth);
  const user = auth?.user;
  
  const searchParams = useSearchParams();
  const targetId = searchParams.get('targetId');
  const targetName = searchParams.get('targetName');

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    // 3. This block will now ONLY run in the browser
    if (!user || !user.id) return;

    const fetchContacts = async () => {
      try {
        const res = await fetch(`http://localhost:5001/messages`);
        if (!res.ok) return;
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

        if (targetId) {
          setSelectedContact({ id: targetId, name: targetName });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchContacts();
  }, [user, targetId, targetName]);

  // 4. Strongest Guard: If user is null, stop everything immediately.
  if (!user || !user.id) {
    return <div className="p-20 text-center text-black font-bold">Checking authentication...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] p-4 lg:p-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 h-[80vh]">
        <div className="w-full md:w-80 bg-white rounded-2xl shadow-md flex flex-col overflow-hidden border">
          <div className="p-5 border-b bg-gray-50 font-bold text-gray-800">Messages</div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map(c => (
              <button 
                key={c.id} 
                onClick={() => setSelectedContact(c)} 
                className={`w-full flex items-center gap-3 p-4 border-b transition ${selectedContact?.id === c.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">{c.name?.[0] || 'U'}</div>
                <div className="text-left overflow-hidden">
                  <p className="font-bold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-500 uppercase">{c.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 h-full">
          {selectedContact && user ? (
            <ChatBox currentUser={user} targetUser={selectedContact} />
          ) : (
            <div className="h-full flex items-center justify-center bg-white border-2 border-dashed rounded-2xl text-gray-400">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 5. Export with Suspense
export default function SeekerMessages() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-black">Loading...</div>}>
      <MessagesContent />
    </Suspense>
  );
}*/




"use client";
import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';

// 1. Tell Vercel NOT to prerender this page during build
export const dynamicPage = 'force-dynamic'; 

// 2. Import ChatBox with absolute zero Server Side Rendering
const ChatBox = dynamic(() => import('../../../components/ChatBox'), { 
  ssr: false,
  loading: () => <div className="p-10 text-center">Loading Chat...</div>
});

function MessagesContent() {
  // 3. Use optional chaining everywhere to prevent "null" crashes
  const auth = useSelector((state) => state.auth);
  const user = auth?.user;
  
  const searchParams = useSearchParams();
  const targetId = searchParams.get('targetId');
  const targetName = searchParams.get('targetName');

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    // 4. Double guard: If there's no user or no ID, exit the effect immediately
    if (!user || !user.id) return;

    const fetchContacts = async () => {
      try {
        const res = await fetch(`https://job-portal-api-zi92.onrender.com/messages`);
        if (!res.ok) return;
        const allMsgs = await res.json();
        
        const involvedIds = new Set();
        allMsgs.forEach(m => {
          // Extra safety with optional chaining user?.id
          if (m.senderId === user?.id) involvedIds.add(m.receiverId);
          if (m.receiverId === user?.id) involvedIds.add(m.senderId);
        });

        const userRes = await fetch(`https://job-portal-api-zi92.onrender.com/users`);
        const allUsers = await userRes.json();
        let contactList = allUsers.filter(u => involvedIds.has(u.id));

        if (targetId && !involvedIds.has(targetId)) {
          contactList.push({ id: targetId, name: targetName, role: 'employer' });
        }
        setContacts(contactList);

        if (targetId) {
          setSelectedContact({ id: targetId, name: targetName });
        }
      } catch (err) {
        console.error("Build-time fetch ignored");
      }
    };

    fetchContacts();
  }, [user, targetId, targetName]);

  // 5. Final guard: If user is null, return a simple div. 
  // This prevents the code below from ever running during Vercel build.
  if (!user || !user.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 font-bold">Waiting for session...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-64px)] p-4 lg:p-8 text-black">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 h-[80vh]">
        
        {/* SIDEBAR */}
        <div className="w-full md:w-80 bg-white rounded-2xl shadow-md flex flex-col overflow-hidden border">
          <div className="p-5 border-b bg-gray-50 font-bold text-gray-800">Messages</div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map(c => (
              <button 
                key={c.id} 
                onClick={() => setSelectedContact(c)} 
                className={`w-full flex items-center gap-3 p-4 border-b transition ${selectedContact?.id === c.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                  {c.name?.[0] || 'U'}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="font-bold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-500 uppercase">{c.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 h-full">
          {selectedContact && user?.id ? (
            <ChatBox currentUser={user} targetUser={selectedContact} />
          ) : (
            <div className="h-full flex items-center justify-center bg-white border-2 border-dashed rounded-2xl text-gray-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function SeekerMessages() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-black">Loading...</div>}>
      <MessagesContent />
    </Suspense>
  );
}