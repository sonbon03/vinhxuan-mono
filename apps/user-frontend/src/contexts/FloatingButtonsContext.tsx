import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FloatingButtonsContextType {
  chatIsOpen: boolean;
  applicationIsOpen: boolean;
  serviceButtonIsOpen: boolean;
  setChatIsOpen: (isOpen: boolean) => void;
  setApplicationIsOpen: (isOpen: boolean) => void;
  setServiceButtonIsOpen: (isOpen: boolean) => void;
}

const FloatingButtonsContext = createContext<FloatingButtonsContextType | undefined>(undefined);

export const useFloatingButtons = () => {
  const context = useContext(FloatingButtonsContext);
  if (context === undefined) {
    throw new Error('useFloatingButtons must be used within a FloatingButtonsProvider');
  }
  return context;
};

interface FloatingButtonsProviderProps {
  children: ReactNode;
}

export const FloatingButtonsProvider: React.FC<FloatingButtonsProviderProps> = ({ children }) => {
  const [chatIsOpen, setChatIsOpen] = useState(false);
  const [applicationIsOpen, setApplicationIsOpen] = useState(false);
  const [serviceButtonIsOpen, setServiceButtonIsOpen] = useState(false);

  const value = {
    chatIsOpen,
    applicationIsOpen,
    serviceButtonIsOpen,
    setChatIsOpen,
    setApplicationIsOpen,
    setServiceButtonIsOpen,
  };

  return (
    <FloatingButtonsContext.Provider value={value}>
      {children}
    </FloatingButtonsContext.Provider>
  );
};
