// orderService.js
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, onSnapshot, deleteDoc, increment } from "firebase/firestore";
import emailjs from '@emailjs/browser';
import { serviceID, templateID, publicKey } from './emailjs-config';

// Handles order submission, ID generation, and email confirmation

export function generateOrderID() {
  // Simple unique ID (timestamp + random)
  return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
}

export async function submitOrder(orderData) {
  try {
    const orderId = generateOrderID();
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      id: orderId, // Add the human-readable ID
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true, orderId: orderId, firestoreId: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e };
  }
}

// Fetches all orders once
export async function getOrders() {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const orders = [];
    querySnapshot.forEach((doc) => {
        orders.push({ ...doc.data(), firestoreId: doc.id });
    });
    return orders;
}

// Sets up a real-time listener for orders
export function subscribeToOrders(callback) {
  const q = collection(db, "orders");
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ ...doc.data(), firestoreId: doc.id });
    });
    callback(orders);
  });
  return unsubscribe; // Return the function to unsubscribe
}


export async function updateOrderStatus(firestoreId, status) {
  const orderRef = doc(db, "orders", firestoreId);
  try {
    await updateDoc(orderRef, {
      status: status
    });
    return { success: true };
  } catch (e) {
    console.error("Error updating status: ", e);
    return { success: false, error: e };
  }
}

export async function deleteOrder(firestoreId) {
  const orderRef = doc(db, "orders", firestoreId);
  try {
    await deleteDoc(orderRef);
    return { success: true };
  } catch (e) {
    console.error("Error deleting document: ", e);
    return { success: false, error: e };
  }
}

export async function sendEmailConfirmation(orderData) {
  // TODO: Integrate with EmailJS or backend email service
  return Promise.resolve({ success: true });
}

export async function sendOrderCompletionEmail(order) {
  if (!serviceID || serviceID === 'YOUR_SERVICE_ID' || !templateID || templateID === 'YOUR_TEMPLATE_ID' || !publicKey || publicKey === 'YOUR_PUBLIC_KEY') {
    console.error('EmailJS config is missing or incomplete. Please check your src/emailjs-config.js file.');
    alert('Email could not be sent. EmailJS is not configured.');
    return { success: false, error: 'EmailJS not configured' };
  }

  if (!order.email) {
    console.error('Order is missing an email address. Cannot send email for order:', order.id);
    alert(`Could not send email for order ${order.id} because no email address is associated with it.`);
    return { success: false, error: 'Recipient email address is missing' };
  }

  const templateParams = {
    to_email: order.email,
    name: order.name,
    order_id: order.id,
    game_name: order.game,
    package_name: order.package,
    player_id: order.playerId,
    price: order.price.toFixed(2),
  };

  try {
    await emailjs.send(serviceID, templateID, templateParams, publicKey);
    console.log('SUCCESS! Email sent for order:', order.id);
    return { success: true };
  } catch (err) {
    console.error('FAILED to send email...', err);
    alert(`Failed to send completion email for order ${order.id}. Error: ${err.text}`);
    return { success: false, error: err };
  }
} 