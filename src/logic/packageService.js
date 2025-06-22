// packageService.js
// Handles fetching package lists for each game

import { db } from '../firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const packages = {
  PUBG: [
    { name: '60 UC', price: 25 },
    { name: '325 UC', price: 120 },
    { name: '660 UC', price: 220 },
    { name: '1800 UC', price: 600 },
  ],
  'Free Fire': [
    { name: '100 Diamonds', price: 20 },
    { name: '310 Diamonds', price: 60 },
    { name: '520 Diamonds', price: 100 },
    { name: '1060 Diamonds', price: 200 },
  ],
  PES: [
    { name: '100 Coins', price: 30 },
    { name: '550 Coins', price: 150 },
    { name: '1200 Coins', price: 300 },
    { name: '2500 Coins', price: 600 },
  ],
};

export function getPackages(game) {
  return packages[game] || [];
}

// Subscribe to all packages
export const subscribeToPackages = (callback) => {
  const q = collection(db, 'packages');
  return onSnapshot(q, (querySnapshot) => {
    const packages = [];
    querySnapshot.forEach((doc) => {
      packages.push({ id: doc.id, ...doc.data() });
    });
    // Sort by price for consistent order
    packages.sort((a, b) => a.price - b.price);
    callback(packages);
  });
};

// Add or update a package
export const savePackage = async (pkg) => {
  try {
    if (pkg.id) {
      // Update existing package
      const packageRef = doc(db, 'packages', pkg.id);
      const { id, ...pkgData } = pkg;
      await updateDoc(packageRef, pkgData);
    } else {
      // Add new package - ensure no 'id' field is sent for new docs
      const { id, ...pkgData } = pkg;
      await addDoc(collection(db, 'packages'), pkgData);
    }
  } catch (error) {
    console.error("Error saving package:", error);
    // You could add user-facing error feedback here
  }
};

// Delete a package
export const deletePackage = async (id) => {
  await deleteDoc(doc(db, 'packages', id));
}; 