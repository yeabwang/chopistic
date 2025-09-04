import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

export const useQuizTracking = () => {
  const { user } = useAuth();

  const recordQuizCompletion = async (quizData) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const quizResult = {
        courseId: quizData.courseId,
        chapter: quizData.chapter,
        title: quizData.title,
        score: quizData.score,
        totalQuestions: quizData.totalQuestions,
        timeSpent: quizData.timeSpent || 0,
        answers: quizData.answers || []
      };

      await userService.addQuizResult(user.id, quizResult);
      
      // Update localStorage for immediate UI updates
      const currentProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
      if (!currentProgress.quizzes) currentProgress.quizzes = [];
      
      currentProgress.quizzes.push({
        ...quizResult,
        completedAt: new Date().toISOString()
      });
      
      localStorage.setItem('userProgress', JSON.stringify(currentProgress));
      
      return quizResult;
    } catch (error) {
      console.error('Error recording quiz completion:', error);
      throw error;
    }
  };

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

  return {
    recordQuizCompletion,
    recordCourseCompletion,
    recordAchievement
  };
};
