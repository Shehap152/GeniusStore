import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

const faqCollection = collection(db, "faqs");

// Fetches all FAQs once
export async function getFaqs() {
    const snapshot = await getDocs(faqCollection);
    const faqs = [];
    snapshot.forEach(doc => {
        faqs.push({ id: doc.id, ...doc.data() });
    });
    // Simple ordering by question, can be made more sophisticated
    return faqs.sort((a, b) => a.question.localeCompare(b.question));
}

// Sets up a real-time listener for FAQs
export function subscribeToFaqs(callback) {
  const unsubscribe = onSnapshot(faqCollection, (snapshot) => {
    const faqs = [];
    snapshot.forEach((doc) => {
      faqs.push({ id: doc.id, ...doc.data() });
    });
    callback(faqs.sort((a, b) => a.question.localeCompare(b.question)));
  });
  return unsubscribe;
}

// Adds a new FAQ
export async function addFaq(faq) {
    try {
        const docRef = await addDoc(faqCollection, faq);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding FAQ: ", error);
        return { success: false, error };
    }
}

// Updates an existing FAQ
export async function updateFaq(id, updatedFaq) {
    const faqDoc = doc(db, "faqs", id);
    try {
        await updateDoc(faqDoc, updatedFaq);
        return { success: true };
    } catch (error) {
        console.error("Error updating FAQ: ", error);
        return { success: false, error };
    }
}

// Deletes an FAQ
export async function deleteFaq(id) {
    const faqDoc = doc(db, "faqs", id);
    try {
        await deleteDoc(faqDoc);
        return { success: true };
    } catch (error) {
        console.error("Error deleting FAQ: ", error);
        return { success: false, error };
    }
} 