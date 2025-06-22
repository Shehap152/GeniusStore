import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKF7qF1bq47GPlueo8VLTiUN494MZkzn0",
  authDomain: "topupstore-510c8.firebaseapp.com",
  projectId: "topupstore-510c8",
  storageBucket: "topupstore-510c8.firebasestorage.app",
  messagingSenderId: "1032699230069",
  appId: "1:1032699230069:web:d9efa38903c479eaf9053c",
  measurementId: "G-JVL7CR5P7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db }; 