import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc, deleteDoc, increment } from 'firebase/firestore';

// Add a new testimonial
export const addTestimonial = async (testimonialData) => {
  try {
    await addDoc(collection(db, 'testimonials'), {
      ...testimonialData,
      status: 'pending', // 'pending', 'approved'
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
    });
  } catch (error) {
    console.error("Error adding testimonial: ", error);
  }
};

// Get testimonials by status
export const subscribeToTestimonialsByStatus = (status, callback) => {
  const q = query(collection(db, 'testimonials'), where('status', '==', status));
  return onSnapshot(q, (querySnapshot) => {
    const testimonials = [];
    querySnapshot.forEach((doc) => {
      testimonials.push({ id: doc.id, ...doc.data() });
    });
    callback(testimonials);
  });
};

// Approve a testimonial
export const approveTestimonial = async (id) => {
  try {
    const testimonialRef = doc(db, 'testimonials', id);
    await updateDoc(testimonialRef, {
      status: 'approved',
    });
  } catch (error) {
    console.error("Error approving testimonial: ", error);
  }
};

// Delete/Decline a testimonial
export const deleteTestimonial = async (id) => {
  try {
    await deleteDoc(doc(db, 'testimonials', id));
  } catch (error) {
    console.error("Error deleting testimonial: ", error);
  }
};

// Like a testimonial
export const likeTestimonial = async (id) => {
    try {
        const testimonialRef = doc(db, 'testimonials', id);
        await updateDoc(testimonialRef, {
            likes: increment(1)
        });
    } catch (error) {
        console.error("Error liking testimonial: ", error);
    }
};

// Dislike a testimonial
export const dislikeTestimonial = async (id) => {
    try {
        const testimonialRef = doc(db, 'testimonials', id);
        await updateDoc(testimonialRef, {
            dislikes: increment(1)
        });
    } catch (error) {
        console.error("Error disliking testimonial: ", error);
    }
}; 