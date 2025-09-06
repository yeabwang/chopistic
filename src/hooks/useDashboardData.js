import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

export const useDashboardData = () => {
  const { user } = useAuth();
  const [coursesData, setCoursesData] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [weeklyActivityData, setWeeklyActivityData] = useState([]);
  const [courseQuizCounts, setCourseQuizCounts] = useState({});
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
        
        // Fetch quiz counts for each course
        const quizCounts = await fetchCourseQuizCounts(courses);
        
        setCoursesData(courses);
        setUserProgress(progress);
        setLeaderboardData(leaderboard);
        setWeeklyActivityData(weeklyActivity);
        setCourseQuizCounts(quizCounts);
        
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

  // Fetch quiz counts for each course
  const fetchCourseQuizCounts = async (courses) => {
    const quizCounts = {};
    
    for (const course of courses) {
      try {
        const response = await fetch(`/data/quizzes/course-${course.id}-quizzes.json`);
        if (response.ok) {
          const data = await response.json();
          quizCounts[course.id] = data.quizzes?.length || 0;
        } else {
          quizCounts[course.id] = 0;
        }
      } catch (error) {
        console.error(`Error fetching quiz count for course ${course.id}:`, error);
        quizCounts[course.id] = 0;
      }
    }
    
    return quizCounts;
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
      
      // Ensure proper type comparison for courseId
      const quizzesForCourse = userProgress.quizzes?.filter(quiz => 
        parseInt(quiz.courseId) === parseInt(course.id)
      ) || [];
      
      // Calculate average quiz score for this course (only latest attempts)
      const latestQuizScores = getLatestQuizScores(quizzesForCourse);
      const averageQuizScore = latestQuizScores.length > 0
        ? Math.round(latestQuizScores.reduce((sum, score) => sum + score, 0) / latestQuizScores.length)
        : 0;
      

      return {
        ...course,
        isCompleted,
        quizzesCompleted: quizzesForCourse.length, // This is the number of completed quizzes
        totalQuizzes: courseQuizCounts[course.id] || 0, // This is the total number of quizzes available
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
    const courseQuizzes = progress.quizzes?.filter(quiz => parseInt(quiz.courseId) === parseInt(courseId)) || [];
    if (courseQuizzes.length === 0) return null;
    
    const lastQuiz = courseQuizzes.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
    return lastQuiz.completedAt;
  };

  // Helper function to get latest quiz scores (removes duplicates from retakes)
  const getLatestQuizScores = (quizzes) => {
    if (!quizzes || quizzes.length === 0) return [];
    
    // Group quizzes by title to handle retakes
    const quizGroups = {};
    quizzes.forEach(quiz => {
      if (!quizGroups[quiz.title]) {
        quizGroups[quiz.title] = [];
      }
      quizGroups[quiz.title].push(quiz);
    });
    
    // Get the latest attempt for each quiz
    const latestScores = [];
    Object.values(quizGroups).forEach(quizGroup => {
      // Sort by completion date (newest first) and take the first one
      const latestQuiz = quizGroup.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
      latestScores.push(latestQuiz.score || 0);
    });
    
    return latestScores;
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
