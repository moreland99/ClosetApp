import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, indexedDBLocalPersistence } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
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

// Initialize Auth with AsyncStorage persistence
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: indexedDBLocalPersistence
});

// Initialize Firestore
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);

let FIREBASE_ANALYTICS: any;

isSupported().then((supported) => {
  if (supported) {
    FIREBASE_ANALYTICS = getAnalytics(FIREBASE_APP);
  } else {
    console.log("Analytics is not supported in this environment");
  }
});

export { FIREBASE_AUTH, FIREBASE_ANALYTICS };

