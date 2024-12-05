import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { ClothingItem } from '../navigationTypes';
import { FIREBASE_FIRESTORE } from '../firebase/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

interface ClothesContextProps {
  clothes: ClothingItem[];
  setClothes: React.Dispatch<React.SetStateAction<ClothingItem[]>>;
  favorites: ClothingItem[][];
  setFavorites: React.Dispatch<React.SetStateAction<ClothingItem[][]>>;
  addClothingItem: (item: ClothingItem) => Promise<void>;
  updateClothingItem: (id: string, updatedItem: Partial<ClothingItem>) => Promise<void>;
}

const ClothesContext = createContext<ClothesContextProps | undefined>(undefined);

export const useClothes = () => {
  const context = useContext(ClothesContext);
  if (!context) {
    throw new Error('useClothes must be used within a ClothesProvider');
  }
  return context;
};

export const ClothesProvider = ({ children }: { children: ReactNode }) => {
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [favorites, setFavorites] = useState<ClothingItem[][]>([]);

  const clothesCollection = collection(FIREBASE_FIRESTORE, 'clothes');

  // Fetch clothes from Firestore when the component mounts
  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const snapshot = await getDocs(clothesCollection);
        const clothesList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            uri: data.uri || '', // Default value if missing
            category: data.category || '',
            name: data.name || '',
            color: data.color || '',
            brand: data.brand || 'Unknown', // Default value if missing
            price: data.price || 0, // Default value if missing
          } as ClothingItem;
        });
        setClothes(clothesList);
      } catch (error) {
        console.error('Error fetching clothes from Firestore:', error);
      }
    };
  
    fetchClothes();
  }, []);
  
  

  // Add a new clothing item to Firestore
  const addClothingItem = useCallback(async (item: ClothingItem) => {
    try {
      const docRef = await addDoc(clothesCollection, item);
      setClothes(prevClothes => [...prevClothes, { ...item, id: docRef.id }]);
    } catch (error) {
      console.error('Error adding clothing item to Firestore:', error);
    }
  }, []);

  // Update an existing clothing item in Firestore
  const updateClothingItem = useCallback(async (id: string, updatedItem: Partial<ClothingItem>) => {
    try {
      const docRef = doc(FIREBASE_FIRESTORE, 'clothes', id);
      await updateDoc(docRef, updatedItem);
      setClothes(prevClothes =>
        prevClothes.map(item => (item.id === id ? { ...item, ...updatedItem } : item))
      );
    } catch (error) {
      console.error('Error updating clothing item in Firestore:', error);
    }
  }, []);

  return (
    <ClothesContext.Provider
      value={{ clothes, setClothes, favorites, setFavorites, addClothingItem, updateClothingItem }}
    >
      {children}
    </ClothesContext.Provider>
  );
};