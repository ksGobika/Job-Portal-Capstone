"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ReviewSection({ employerId }) {
  const { user } = useSelector(state => state.auth);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5001/reviews?employerId=${employerId}`)
      .then(res => res.json())
      .then(data => setReviews(data));
  }, [employerId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to review");

    const newReview = {
      employerId,
      seekerId: user.id,
      seekerName: user.name,
      rating: parseInt(rating),
      comment,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const res = await fetch('http://localhost:5001/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    });

    if (res.ok) {
      setReviews([...reviews, await res.json()]);
      setComment("");
      alert("Review submitted!");
    }
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h3 className="text-2xl font-bold mb-4">Employer Reviews</h3>
      
      {/* Review List */}
      <div className="space-y-4 mb-8">
        {reviews.length > 0 ? reviews.map(r => (
          <div key={r.id} className="p-4 bg-gray-50 rounded">
            <div className="flex justify-between">
              <span className="font-bold">{r.seekerName}</span>
              <span className="text-yellow-500">{"★".repeat(r.rating)}</span>
            </div>
            <p className="text-gray-600 mt-1">{r.comment}</p>
          </div>
        )) : <p>No reviews yet.</p>}
      </div>

      {/* Add Review Form (Only for Seekers) */}
      {user?.role === 'seeker' && (
        <form onSubmit={handleSubmitReview} className="bg-white p-4 border rounded shadow-sm">
          <h4 className="font-bold mb-2">Leave a Review</h4>
          <div className="flex gap-4 mb-2">
            <select value={rating} onChange={(e) => setRating(e.target.value)} className="border p-1">
              {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
            </select>
          </div>
          <textarea 
            className="w-full border p-2 mb-2" 
            placeholder="Write your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Review</button>
        </form>
      )}
    </div>
  );
}