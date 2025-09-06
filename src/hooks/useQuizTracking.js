import { useAuth } from '../contexts/AuthContext';
import { useState, useCallback } from 'react';
import userService from '../services/userService';

export const useQuizTracking = () => {
  const { user } = useAuth();
  const [trackingError, setTrackingError] = useState(null);

  const recordQuizCompletion = useCallback(async (quizData) => {
    if (!user) {
      const error = new Error('No user logged in');
      setTrackingError(error);
      console.error('No user logged in');
      throw error;
    }

    try {
      setTrackingError(null);
      
      const quizResult = {
        courseId: quizData.courseId,
        chapter: quizData.chapter,
        title: quizData.title,
        score: quizData.score,
        totalQuestions: quizData.totalQuestions,
        timeSpent: quizData.timeSpent || 0,
        answers: quizData.answers || [],
        completedAt: new Date().toISOString()
      };

      // Save to user service (persistent storage)
      await userService.addQuizResult(user.id, quizResult);
      
      // Update localStorage for immediate UI updates and cross-tab synchronization
      const currentProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      if (!currentProgress.quizzes) currentProgress.quizzes = [];
      
      // Check if quiz already exists and update it, otherwise add new
      const existingQuizIndex = currentProgress.quizzes.findIndex(
        q => q.courseId === quizResult.courseId && q.title === quizResult.title
      );
      
      if (existingQuizIndex >= 0) {
        // Update existing quiz result
        currentProgress.quizzes[existingQuizIndex] = quizResult;
      } else {
        // Add new quiz result
        currentProgress.quizzes.push(quizResult);
      }
      
      localStorage.setItem('userProgress', JSON.stringify(currentProgress));
      
      // Dispatch custom event for real-time updates across components
      window.dispatchEvent(new CustomEvent('quizCompleted', { 
        detail: { quizResult, userId: user.id } 
      }));
      
      return quizResult;
    } catch (error) {
      console.error('Error recording quiz completion:', error);
      setTrackingError(error);
      throw error;
    }
  }, [user]);

  const recordCourseCompletion = async (courseId) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      await userService.completeCourse(user.id, courseId);
      
      // Update localStorage for immediate UI updates
      const currentProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      if (!currentProgress.coursesCompleted) currentProgress.coursesCompleted = [];
      
      if (!currentProgress.coursesCompleted.includes(courseId)) {
        currentProgress.coursesCompleted.push(courseId);
        localStorage.setItem('userProgress', JSON.stringify(currentProgress));
      }
      
      return courseId;
    } catch (error) {
      console.error('Error recording course completion:', error);
      throw error;
    }
  };

  const recordAchievement = async (achievement) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      await userService.addAchievement(user.id, achievement);
      
      // Update localStorage for immediate UI updates
      const currentProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      if (!currentProgress.achievements) currentProgress.achievements = [];
      
      currentProgress.achievements.push({
        ...achievement,
        earnedAt: new Date().toISOString()
      });
      
      localStorage.setItem('userProgress', JSON.stringify(currentProgress));
      
      return achievement;
    } catch (error) {
      console.error('Error recording achievement:', error);
      throw error;
    }
  };

  // Clear tracking errors
  const clearTrackingError = useCallback(() => {
    setTrackingError(null);
  }, []);

  return {
    recordQuizCompletion,
    recordCourseCompletion,
    recordAchievement,
    trackingError,
    clearTrackingError
  };
};
