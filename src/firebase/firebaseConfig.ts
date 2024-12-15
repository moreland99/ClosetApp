import { initializeApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { getFirestore, Firestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
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

// Add Favorite Outfit Function
export const addFavoriteOutfit = async (outfit: any[]) => {
  try {
    const favoritesCollection = collection(FIREBASE_FIRESTORE, "favorites");

    await addDoc(favoritesCollection, {
      id: Date.now().toString(),
      outfit: outfit.map((item) => ({
        id: item.id,
        uri: item.uri,
        category: item.category,
        name: item.name,
        color: item.color,
        brand: item.brand,
        price: item.price,
      })),
      createdAt: serverTimestamp(),
    });
    console.log("Favorite outfit successfully saved to Firestore!");
  } catch (error) {
    console.error("Error saving favorite outfit to Firestore:", error);
    throw error;
  }
};

// Export modules
export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_FIRESTORE };

