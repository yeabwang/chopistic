import { useState, useEffect } from 'react';

export const useCourseData = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch('/data/courses/all_courses.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }
        const data = await response.json();
        // Handle both data.courses and direct array format
        setCourses(data.courses || data || []);
      } catch (error) {
        console.error('Error loading courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return { courses, loading };
};
