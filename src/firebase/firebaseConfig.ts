// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDletpsPeF8ZKACyo_mT7c2tzOZ-wozuHQ",
  authDomain: "closetapp-f5003.firebaseapp.com",
  projectId: "closetapp-f5003",
  storageBucket: "closetapp-f5003.appspot.com",
  messagingSenderId: "808760517151",
  appId: "1:808760517151:web:eb175b19e1f2f03e632b2a",
  measurementId: "G-5J71MCT4QK"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_ANALYTICS = getAnalytics(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);