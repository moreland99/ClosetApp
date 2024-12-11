import React, { createContext, useContext, useState } from 'react';

interface ModalContextValue {
  visible: boolean;
  loading: boolean;
  selectedImageUri: string | null;
  showModal: (uri: string) => void;
  hideModal: () => void;
  setLoading: (loading: boolean) => void;
  onCategorySelect: ((category: string) => Promise<void>) | null;
  setOnCategorySelect: (fn: (category: string) => Promise<void>) => void;
}

const ModalContext = createContext<ModalContextValue>({} as ModalContextValue);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoadingState] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [onCategorySelectFn, setOnCategorySelectFn] = useState<((category: string) => Promise<void>) | null>(null);

  const showModal = (uri: string) => {
    setSelectedImageUri(uri);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedImageUri(null);
    setLoadingState(false);
    setOnCategorySelectFn(null);
  };

  const setLoading = (l: boolean) => {
    setLoadingState(l);
  };

  const setOnCategorySelect = (fn: (category: string) => Promise<void>) => {
    setOnCategorySelectFn(() => fn);
  };

  return (
    <ModalContext.Provider value={{ visible, loading, selectedImageUri, showModal, hideModal, setLoading, onCategorySelect: onCategorySelectFn, setOnCategorySelect }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
