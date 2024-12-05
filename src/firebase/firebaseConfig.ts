import { initializeApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDletpsPeF8ZKACyo_mT7c2tzOZ-wozuHQ",
  authDomain: "closetapp-f5003.firebaseapp.com",
  projectId: "closetapp-f5003",
  storageBucket: "closetapp-f5003.appspot.com",
  messagingSenderId: "808760517151",
  appId: "1:808760517151:web:eb175b19e1f2f03e632b2a",
  measurementId: "G-5J71MCT4QK",
};

// Initialize Firebase App
const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: browserLocalPersistence,
});

// Initialize Firestore
const FIREBASE_FIRESTORE: Firestore = getFirestore(FIREBASE_APP);

// Export modules
export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_FIRESTORE };

