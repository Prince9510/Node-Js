// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIE2ZZuI0qHNdSSxHK6tFeyfjvGaOrZAU",
  authDomain: "portfolio-83070.firebaseapp.com",
  projectId: "portfolio-83070",
  storageBucket: "portfolio-83070.firebasestorage.app",
  messagingSenderId: "957949802536",
  appId: "1:957949802536:web:c6f09c56b4d253edda9d1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 