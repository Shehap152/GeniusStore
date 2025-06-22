import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { addTestimonial } from '../logic/testimonialService';
import { motion } from 'framer-motion';
import ReactStars from 'react-rating-stars-component';

const SuccessPage = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && feedback) {
      await addTestimonial({ name, quote: feedback, rating, title: 'Valued Customer' });
      setSubmitted(true);
    }
  };

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full"
      >
        <motion.div variants={itemVariants}>
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Successful!</motion.h1>
        <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300 mb-6">Thank you for your purchase.</motion.p>
        {orderId && (
          <motion.p variants={itemVariants} className="text-sm text-gray-500 dark:text-gray-400">
            Your Order ID is: <span className="font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 p-1 rounded">{orderId}</span>
          </motion.p>
        )}

        {!submitted ? (
          <motion.div variants={itemVariants} className="mt-8 border-t pt-6 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Share Your Feedback!</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={32}
                isHalf={true}
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#ffd700"
              />
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
                required
              />
              <textarea
                placeholder="Your feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 h-28 focus:ring-2 focus:ring-blue-500 transition"
                required
              />
              <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105">
                Submit Feedback
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="mt-8 text-lg text-green-600 dark:text-green-400 font-semibold">
            Thank you for your valuable feedback!
          </motion.div>
        )}
         <motion.div variants={itemVariants} className="mt-8">
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Continue Shopping
            </Link>
          </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage; 