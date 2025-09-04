import { useState, useEffect } from 'react';

export const useQuizData = (courseId) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/data/quizzes/course-${courseId}-quizzes.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch quiz data: ${response.status}`);
        }
        
        const data = await response.json();
        setQuizzes(data.quizzes || []);
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
  }, [courseId]);

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
    getQuizById, 
    getQuizzesByChapter, 
    getQuizStats 
  };
};
