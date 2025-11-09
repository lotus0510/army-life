// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnBy_07yoc3aTWyfVQmGYZtG6Wu9GXS9E",
  authDomain: "army-life-web.firebaseapp.com",
  projectId: "army-life-web",
  storageBucket: "army-life-web.firebasestorage.app",
  messagingSenderId: "565006567003",
  appId: "1:565006567003:web:28e5f359a05bb5bde9617e",
  measurementId: "G-5NVZZB87MB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export default app