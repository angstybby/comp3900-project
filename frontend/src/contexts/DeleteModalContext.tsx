import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  openCloseModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCloseModal = () => setIsModalOpen(!isModalOpen);

  return (
    <ModalContext.Provider value={{ isModalOpen, openCloseModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
