import { useState, useEffect } from 'react';

export const useSingleCourseData = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/data/courses/course-${courseId}.json`);
        
        if (!response.ok) {
          throw new Error(`Course not found: ${response.status}`);
        }
        
        const courseData = await response.json();
        setCourse(courseData);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError(err.message);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  return { course, loading, error };
};
