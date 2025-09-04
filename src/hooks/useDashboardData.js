import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

export const useDashboardData = () => {
  const { user } = useAuth();
  const [coursesData, setCoursesData] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [weeklyActivityData, setWeeklyActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch all courses
        const coursesResponse = await fetch('/data/courses/all_courses.json');
        if (!coursesResponse.ok) {
          throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
        }
        const coursesData = await coursesResponse.json();
        const courses = coursesData.courses || [];
        
        // Fetch user progress
        const progress = await userService.loadUserProgress(user.id);
        
        // Fetch leaderboard data
        const leaderboard = await userService.getLeaderboardData();
        
        // Fetch weekly activity data
        const weeklyActivity = await userService.getWeeklyActivityData();
        
        setCoursesData(courses);
        setUserProgress(progress);
        setLeaderboardData(leaderboard);
        setWeeklyActivityData(weeklyActivity);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Calculate dashboard statistics
  const getDashboardStats = () => {
    if (!userProgress || !coursesData.length) {
      return {
        totalPoints: 0,
        completedCourses: 0,
        completedQuizzes: 0,
        currentStreak: 0,
        totalCoursesEnrolled: 0,
        averageQuizScore: 0,
        achievementsEarned: 0,
        studyTimeHours: 0
      };
    }

    const completedQuizzes = userProgress.quizzes?.length || 0;
    const completedCourses = userProgress.coursesCompleted?.length || 0;
    const achievementsEarned = userProgress.achievements?.length || 0;
    
    // Calculate total points from quiz scores
    const totalPoints = userProgress.quizzes?.reduce((total, quiz) => {
      return total + (quiz.score || 0);
    }, 0) || 0;

    // Calculate average quiz score
    const averageQuizScore = completedQuizzes > 0 
      ? Math.round(totalPoints / completedQuizzes) 
      : 0;

    // Calculate current streak (simplified - based on recent quiz activity)
    const currentStreak = calculateStreak(userProgress.quizzes || []);

    // Calculate study time (mock calculation based on completed content)
    const studyTimeHours = Math.round((completedCourses * 2) + (completedQuizzes * 0.5));

    return {
      totalPoints,
      completedCourses,
      completedQuizzes,
      currentStreak,
      totalCoursesEnrolled: coursesData.length,
      averageQuizScore,
      achievementsEarned,
      studyTimeHours
    };
  };

  // Calculate streak based on quiz completion dates
  const calculateStreak = (quizzes) => {
    if (!quizzes.length) return 0;

    const sortedQuizzes = quizzes
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    let streak = 1;
    let currentDate = new Date(sortedQuizzes[0].completedAt);

    for (let i = 1; i < sortedQuizzes.length; i++) {
      const quizDate = new Date(sortedQuizzes[i].completedAt);
      const dayDifference = Math.floor((currentDate - quizDate) / (1000 * 60 * 60 * 24));

      if (dayDifference === 1) {
        streak++;
        currentDate = quizDate;
      } else {
        break;
      }
    }

    return streak;
  };

  // Get courses with progress information
  const getCoursesWithProgress = () => {
    if (!coursesData.length || !userProgress) return [];

    return coursesData.map(course => {
      const isCompleted = userProgress.coursesCompleted?.includes(course.id) || false;
      const quizzesForCourse = userProgress.quizzes?.filter(quiz => 
        quiz.courseId === course.id
      ) || [];
      
      const averageQuizScore = quizzesForCourse.length > 0
        ? Math.round(quizzesForCourse.reduce((sum, quiz) => sum + quiz.score, 0) / quizzesForCourse.length)
        : 0;

      return {
        ...course,
        isCompleted,
        quizzesCompleted: quizzesForCourse.length,
        averageScore: averageQuizScore,
        lastAccessed: getLastAccessDate(course.id, userProgress)
      };
    });
  };

  // Get recent quiz activity
  const getRecentQuizzes = (limit = 5) => {
    if (!userProgress?.quizzes) return [];

    return userProgress.quizzes
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, limit)
      .map(quiz => ({
        ...quiz,
        courseName: getCourseName(quiz.courseId),
        timeAgo: getTimeAgo(quiz.completedAt)
      }));
  };

  // Helper function to get course name by ID
  const getCourseName = (courseId) => {
    const course = coursesData.find(c => c.id === courseId);
    return course?.title || 'Unknown Course';
  };

  // Helper function to get time ago string
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  // Helper function to get last access date for a course
  const getLastAccessDate = (courseId, progress) => {
    const courseQuizzes = progress.quizzes?.filter(quiz => quiz.courseId === courseId) || [];
    if (courseQuizzes.length === 0) return null;
    
    const lastQuiz = courseQuizzes.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
    return lastQuiz.completedAt;
  };

  // Update user progress (wrapper function)
  const updateProgress = async (progressUpdate) => {
    if (!user) return;

    try {
      const updatedProgress = await userService.updateUserProgress(user.id, progressUpdate);
      setUserProgress(updatedProgress);
      return updatedProgress;
    } catch (err) {
      console.error('Error updating progress:', err);
      throw err;
    }
  };

  return {
    coursesData,
    userProgress,
    leaderboardData,
    weeklyActivityData,
    loading,
    error,
    stats: getDashboardStats(),
    coursesWithProgress: getCoursesWithProgress(),
    recentQuizzes: getRecentQuizzes(),
    updateProgress
  };
};
