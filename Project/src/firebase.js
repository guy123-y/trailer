import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    
    
  apiKey: "AIzaSyAKud4It6K_Q_HuHD6M5RcNxw9WseFok1Q",
  authDomain: "project-ab89b.firebaseapp.com",
  projectId: "project-ab89b",
  storageBucket: "project-ab89b.firebasestorage.app",
  messagingSenderId: "538979529518",
  appId: "1:538979529518:web:fdd4bbb5125839ddc200bf",
  measurementId: "G-RFEWM3DNJG"



};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);