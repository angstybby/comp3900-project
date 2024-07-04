import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DeleteModalContextType {
  isModalOpen: boolean;
  currentZid: string;
  openCloseModal: () => void;
  updateTargetZid: (target: string) => void;
}

const ModalContext = createContext<DeleteModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentZid, setCurrentZid] = useState('');

  const openCloseModal = () => setIsModalOpen(!isModalOpen);
  const updateTargetZid = (target: string) => setCurrentZid(target)

  return (
    <ModalContext.Provider value={{ isModalOpen, currentZid, openCloseModal, updateTargetZid }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useDeleteModal = (): DeleteModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useDeleteModal must be used within a ModalProvider');
  }
  return context;
};
