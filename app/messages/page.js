"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function MessagingPage() {
  const { user } = useSelector(state => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch messages where user is sender OR receiver
    fetch(`http://localhost:5000/messages`)
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

    const res = await fetch('http://localhost:5000/messages', {
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
}