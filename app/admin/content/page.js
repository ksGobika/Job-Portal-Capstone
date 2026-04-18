"use client";
import { useState, useEffect } from 'react';

export default function ContentManagement() {
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  useEffect(() => {
    fetch('http://localhost:5001/faqs').then(res => res.json()).then(data => setFaqs(data));
  }, []);

  const addFaq = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5001/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFaq)
    });
    if (res.ok) {
      const saved = await res.json();
      setFaqs([...faqs, saved]);
      setNewFaq({ question: '', answer: '' });
    }
  };

  const deleteFaq = async (id) => {
    await fetch(`http://localhost:5001/faqs/${id}`, { method: 'DELETE' });
    setFaqs(faqs.filter(f => f.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Manage FAQs & Content</h1>
      
      {/* Add FAQ Form */}
      <form onSubmit={addFaq} className="bg-white p-6 rounded-2xl shadow-md border mb-10 space-y-4">
        <h3 className="font-bold text-gray-700">Add New FAQ</h3>
        <input type="text" placeholder="Question" required className="w-full p-3 border rounded-xl text-black"
          value={newFaq.question} onChange={e => setNewFaq({...newFaq, question: e.target.value})} />
        <textarea placeholder="Answer" required className="w-full p-3 border rounded-xl text-black"
          value={newFaq.answer} onChange={e => setNewFaq({...newFaq, answer: e.target.value})} />
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Post FAQ</button>
      </form>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map(f => (
          <div key={f.id} className="p-5 bg-gray-50 rounded-xl flex justify-between items-start border">
            <div>
              <p className="font-bold text-gray-900">Q: {f.question}</p>
              <p className="text-gray-600 mt-1">A: {f.answer}</p>
            </div>
            <button onClick={() => deleteFaq(f.id)} className="text-red-500 font-bold hover:underline ml-4">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}