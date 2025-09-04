import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

export const useEnrollment = () => {
  const { user } = useAuth();

  const enrollInCourse = async (courseId) => {
    if (!user) {
      throw new Error('User must be authenticated to enroll');
    }

    try {
      // Enroll the user in the course
      await userService.enrollInCourse(user.id, courseId);
      
      // Update localStorage for immediate UI updates
      const currentProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      if (!currentProgress.coursesEnrolled) currentProgress.coursesEnrolled = [];
      
      if (!currentProgress.coursesEnrolled.includes(courseId)) {
        currentProgress.coursesEnrolled.push(courseId);
        localStorage.setItem('userProgress', JSON.stringify(currentProgress));
      }
      
      return { success: true, courseId };
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  };

  const isEnrolledInCourse = (courseId) => {
    if (!user) return false;
    
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    return progress.coursesEnrolled?.includes(courseId) || false;
  };

  return {
    enrollInCourse,
    isEnrolledInCourse
  };
};
