import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV_IOu7s0Z0ANJethYj6RBHJGOIsdnqLQ",
  authDomain: "flashcard-saas-b748d.firebaseapp.com",
  projectId: "flashcard-saas-b748d",
  storageBucket: "flashcard-saas-b748d.appspot.com",
  messagingSenderId: "207478386765",
  appId: "1:207478386765:web:92e9c4a959968832ceec04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };