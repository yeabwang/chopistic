import { useState, useEffect } from 'react';

export const useRouter = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [profileName, setProfileName] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'courses') {
        setCurrentPage('courses');
        setProfileName(null);
      } else if (hash === 'about') {
        setCurrentPage('about');
        setProfileName(null);
      } else if (hash === 'dashboard') {
        setCurrentPage('dashboard');
        setProfileName(null);
      } else if (hash.startsWith('profile/')) {
        const name = hash.split('/')[1];
        setCurrentPage('profile');
        setProfileName(name);
        // Scroll to top when navigating to any profile
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      } else {
        setCurrentPage('home');
        setProfileName(null);
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page) => {
    window.location.hash = page;
  };

  return { currentPage, profileName, navigateTo };
};
