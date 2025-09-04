import { createContext, useContext, useState } from 'react';

const AuthModalContext = createContext();

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [onSuccessCallback, setOnSuccessCallback] = useState(null);

  const openModal = (authMode = 'login', onSuccess = null) => {
    setMode(authMode);
    setOnSuccessCallback(() => onSuccess);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setOnSuccessCallback(null);
  };

  const handleSuccess = (user) => {
    if (onSuccessCallback) {
      onSuccessCallback(user);
    }
    closeModal();
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        openModal,
        closeModal,
        handleSuccess,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};
