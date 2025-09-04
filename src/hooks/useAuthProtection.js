import { useAuth } from '../contexts/AuthContext';
import { useAuthModal } from '../contexts/AuthModalContext';

export const useAuthProtection = () => {
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  
  const requireAuth = (callback, options = {}) => {
    if (isAuthenticated) {
      // User is authenticated, execute callback immediately
      callback();
    } else {
      // User is not authenticated, open auth modal
      const authMode = options.preferSignup ? 'signup' : 'login';
      openModal(authMode, callback);
    }
  };

  return {
    requireAuth,
    isAuthenticated
  };
};
