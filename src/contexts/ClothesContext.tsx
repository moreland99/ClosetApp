// src/contexts/ClothesContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ClothingItem } from '../navigationTypes';

interface ClothesContextProps {
  clothes: ClothingItem[];
  setClothes: React.Dispatch<React.SetStateAction<ClothingItem[]>>;
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

  return (
    <ClothesContext.Provider value={{ clothes, setClothes }}>
      {children}
    </ClothesContext.Provider>
  );
};

