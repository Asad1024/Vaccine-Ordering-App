import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPB4WWKcqwaTVn38j2FqpSn0i9nWH1iGk",
  authDomain: "vaccine-store.firebaseapp.com",
  projectId: "vaccine-store",
  storageBucket: "vaccine-store.appspot.com",
  messagingSenderId: "908978298476",
  appId: "1:908978298476:web:8b812ae3aa62f72b2b0249",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
