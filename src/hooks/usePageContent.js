import { useState, useEffect } from 'react';

export const usePageContent = (pageName) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/data/pages/${pageName}.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch page content: ${response.status}`);
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error(`Error loading content for ${pageName}:`, error);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [pageName]);

  return { content, loading };
};