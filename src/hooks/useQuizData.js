import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

export const useQuizData = (courseId) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  // Load user progress
  const loadUserProgress = useCallback(async () => {
    if (!user) return null;
    
    try {
      const progress = await userService.loadUserProgress(user.id);
      setUserProgress(progress);
      return progress;
    } catch (err) {
      console.error('Error loading user progress:', err);
      return null;
    }
  }, [user]);

  // Update quiz status based on user progress
  const updateQuizStatus = useCallback((quizzes, progress) => {
    if (!progress?.quizzes) return quizzes;
    
    return quizzes.map(quiz => {
      const userQuizResult = progress.quizzes.find(
        userQuiz => userQuiz.courseId === parseInt(courseId) && 
                   userQuiz.title === quiz.title
      );
      
      return {
        ...quiz,
        userProgress: userQuizResult ? {
          completed: true,
          score: userQuizResult.score,
          completedAt: userQuizResult.completedAt,
          timeSpent: userQuizResult.timeSpent
        } : null
      };
    });
  }, [courseId]);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch quiz data and user progress in parallel
        const [quizResponse, progress] = await Promise.all([
          fetch(`/data/quizzes/course-${courseId}-quizzes.json`),
          loadUserProgress()
        ]);
        
        if (!quizResponse.ok) {
          throw new Error(`Failed to fetch quiz data: ${quizResponse.status}`);
        }
        
        const data = await quizResponse.json();
        const quizzesData = data.quizzes || [];
        
        // Update quiz status with user progress
        const quizzesWithStatus = updateQuizStatus(quizzesData, progress);
        setQuizzes(quizzesWithStatus);
        setError(null);
      } catch (err) {
        console.error('Error fetching quiz data:', err);
        setError(err.message);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [courseId, loadUserProgress, updateQuizStatus]);

  // Listen for quiz completion events to update status in real-time
  useEffect(() => {
    const handleQuizCompleted = (event) => {
      const { quizResult, userId } = event.detail;
      
      // Only update if it's for the current user and course
      if (userId === user?.id && quizResult.courseId === parseInt(courseId)) {
        setQuizzes(prevQuizzes => 
          prevQuizzes.map(quiz => {
            if (quiz.title === quizResult.title) {
              return {
                ...quiz,
                userProgress: {
                  completed: true,
                  score: quizResult.score,
                  completedAt: quizResult.completedAt,
                  timeSpent: quizResult.timeSpent
                }
              };
            }
            return quiz;
          })
        );
      }
    };

    window.addEventListener('quizCompleted', handleQuizCompleted);
    return () => window.removeEventListener('quizCompleted', handleQuizCompleted);
  }, [user, courseId]);

  // Get quiz by ID
  const getQuizById = (quizId) => {
    return quizzes.find(quiz => quiz.id === parseInt(quizId));
  };

  // Get quizzes by chapter
  const getQuizzesByChapter = (chapterId) => {
    return quizzes.filter(quiz => quiz.chapterId === parseInt(chapterId));
  };

  // Get quiz statistics
  const getQuizStats = () => {
    const totalQuizzes = quizzes.length;
    const completedQuizzes = quizzes.filter(quiz => quiz.userProgress?.completed).length;
    const averageScore = quizzes
      .filter(quiz => quiz.userProgress?.completed && quiz.userProgress?.score !== null)
      .reduce((acc, quiz, _, arr) => acc + quiz.userProgress.score / arr.length, 0);

    return {
      total: totalQuizzes,
      completed: completedQuizzes,
      averageScore: Math.round(averageScore) || 0
    };
  };

  return { 
    quizzes, 
    loading, 
    error, 
    userProgress,
    getQuizById, 
    getQuizzesByChapter, 
    getQuizStats 
  };
};
