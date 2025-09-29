import { createContext, useContext, useState, ReactNode } from 'react';

export type ModalType = 'gift-details' | 'offer' | 'accept-offer' | 'accept-offer-confirm' | 'cancel-offer' | 'add-channel' | 'purchase-confirm' | null;

interface ModalContextType {
  modalType: ModalType;
  modalData: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (type: ModalType, data?: any) => {
    setModalType(type);
    setModalData(data);
  };

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  return (
    <ModalContext.Provider value={{ modalType, modalData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
