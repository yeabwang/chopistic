import { useState, useEffect } from 'react';

export const useCourseData = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch('/data/courses/all_courses.json');
        const data = await response.json();
        setCourses(data.courses);
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
