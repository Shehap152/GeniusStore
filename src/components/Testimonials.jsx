import React, { useState, useEffect } from 'react';
import { subscribeToTestimonialsByStatus, likeTestimonial, dislikeTestimonial } from '../logic/testimonialService';
import LoadingIndicator from './LoadingIndicator';
import ReactStars from 'react-rating-stars-component';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const TestimonialCard = ({ id, quote, name, title, avatar, rating, likes, dislikes }) => {
  const [hasVoted, setHasVoted] = useState(false);

  const handleLike = () => {
    if (!hasVoted) {
      likeTestimonial(id);
      setHasVoted(true);
    }
  };

  const handleDislike = () => {
    if (!hasVoted) {
      dislikeTestimonial(id);
      setHasVoted(true);
    }
  };

  return (
    <div className="bg-white/30 dark:bg-gray-900/50 p-8 rounded-2xl shadow-xl backdrop-blur-lg transform hover:scale-105 transition-transform duration-300 border border-gray-300 dark:border-gray-600 flex flex-col justify-between">
      <div>
        {rating > 0 && (
            <ReactStars
              count={5}
              value={rating}
              size={24}
              isHalf={true}
              edit={false}
              activeColor="#ffd700"
            />
        )}
        <p className="text-gray-700 dark:text-gray-300 text-lg my-4 font-light">"{quote}"</p>
      </div>
      <div>
        <div className="flex items-center mt-4">
          <img
            className="w-12 h-12 rounded-full mr-4 border-2 border-blue-400"
            src={avatar || `https://i.pravatar.cc/150?u=${name}`}
            alt={name}
          />
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          </div>
        </div>
        <div className="flex items-center justify-end mt-4 text-gray-500 dark:text-gray-400">
            <button onClick={handleLike} disabled={hasVoted} className="flex items-center space-x-1 mr-4 disabled:opacity-50">
                <FaThumbsUp />
                <span>{likes || 0}</span>
            </button>
            <button onClick={handleDislike} disabled={hasVoted} className="flex items-center space-x-1 disabled:opacity-50">
                <FaThumbsDown />
                <span>{dislikes || 0}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToTestimonialsByStatus('approved', (approvedTestimonials) => {
      setTestimonials(approvedTestimonials);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center py-24"><LoadingIndicator /></div>;
  }
  
  if (testimonials.length === 0) {
    return null; // Don't render if no approved testimonials
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-24 px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          What Our Players Are Saying
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
    </div>
  );
};

export default Testimonials; 