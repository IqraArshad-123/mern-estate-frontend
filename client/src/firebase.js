// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-44eed.firebaseapp.com",
  projectId: "mern-estate-44eed",
  storageBucket: "mern-estate-44eed.firebasestorage.app",
  messagingSenderId: "692717841212",
  appId: "1:692717841212:web:5480306bd8a45db793cc39"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);