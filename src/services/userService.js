class UserService {
  constructor() {
    this.storagePrefix = 'chopistic_';
    this.allUsersKey = this.storagePrefix + 'all_users';
    this.userDataPrefix = this.storagePrefix + 'user_';
  }

  initializeMockData() {
    if (!localStorage.getItem(this.allUsersKey)) {
      const initialData = {
        users: [],
        nextId: 1
      };
      localStorage.setItem(this.allUsersKey, JSON.stringify(initialData));
    }
  }

  async loadAllUsers() {
    this.initializeMockData();
    try {
      const data = localStorage.getItem(this.allUsersKey);
      return data ? JSON.parse(data) : { users: [], nextId: 1 };
    } catch {
      return { users: [], nextId: 1 };
    }
  }

  async saveAllUsers(userData) {
    localStorage.setItem(this.allUsersKey, JSON.stringify(userData));
    return userData;
  }

  async registerUser(email, password, name) {
    const allUsersData = await this.loadAllUsers();
    
    const existingUser = allUsersData.users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: allUsersData.nextId,
      email,
      password,
      name,
      createdAt: new Date().toISOString()
    };

    allUsersData.users.push(newUser);
    allUsersData.nextId++;

    // Create sample progress data for demonstration
    const userProgress = {
      userId: newUser.id,
      progress: {},
      achievements: [],
      quizzes: [
        {
          courseId: 1,
          chapter: "Introduction",
          title: "Basic AI Concepts Quiz",
          score: 85,
          totalQuestions: 10,
          timeSpent: 8,
          completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
        },
        {
          courseId: 1,
          chapter: "Neural Networks",
          title: "Neural Network Fundamentals Quiz",
          score: 92,
          totalQuestions: 15,
          timeSpent: 12,
          completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
        },
        {
          courseId: 2,
          chapter: "Introduction",
          title: "Machine Learning Basics Quiz",
          score: 78,
          totalQuestions: 12,
          timeSpent: 10,
          completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
        },
        {
          courseId: 3,
          chapter: "Computer Vision",
          title: "Image Processing Quiz",
          score: 95,
          totalQuestions: 8,
          timeSpent: 6,
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        }
      ],
      coursesCompleted: [1],
      lastLogin: new Date().toISOString()
    };

    await this.saveAllUsers(allUsersData);
    await this.saveUserProgress(newUser.id, userProgress);

    return { success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } };
  }

  async loginUser(email, password) {
    const allUsersData = await this.loadAllUsers();
    
    const user = allUsersData.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const userProgress = await this.loadUserProgress(user.id);
    userProgress.lastLogin = new Date().toISOString();
    await this.saveUserProgress(user.id, userProgress);

    return { 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name },
      progress: userProgress
    };
  }

  async loadUserProgress(userId) {
    try {
      const data = localStorage.getItem(this.userDataPrefix + userId);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore parsing errors
    }
    
    return {
      userId,
      progress: {},
      achievements: [],
      quizzes: [],
      coursesCompleted: [],
      lastLogin: new Date().toISOString()
    };
  }

  async saveUserProgress(userId, progressData) {
    localStorage.setItem(this.userDataPrefix + userId, JSON.stringify(progressData));
    return progressData;
  }

  async updateUserProgress(userId, progressUpdate) {
    const currentProgress = await this.loadUserProgress(userId);
    
    const updatedProgress = {
      ...currentProgress,
      ...progressUpdate,
      lastUpdated: new Date().toISOString()
    };

    await this.saveUserProgress(userId, updatedProgress);
    return updatedProgress;
  }

  async addAchievement(userId, achievement) {
    const progress = await this.loadUserProgress(userId);
    progress.achievements.push({
      ...achievement,
      earnedAt: new Date().toISOString()
    });
    await this.saveUserProgress(userId, progress);
    return progress;
  }

  async addQuizResult(userId, quizResult) {
    const progress = await this.loadUserProgress(userId);
    progress.quizzes.push({
      ...quizResult,
      completedAt: new Date().toISOString()
    });
    await this.saveUserProgress(userId, progress);
    return progress;
  }

  async completeCourse(userId, courseId) {
    const progress = await this.loadUserProgress(userId);
    if (!progress.coursesCompleted.includes(courseId)) {
      progress.coursesCompleted.push(courseId);
      await this.saveUserProgress(userId, progress);
    }
    return progress;
  }

  async getLeaderboardData() {
    try {
      const allUsersData = await this.loadAllUsers();
      const leaderboard = [];

      for (const user of allUsersData.users) {
        const progress = await this.loadUserProgress(user.id);
        const totalPoints = progress.quizzes?.reduce((total, quiz) => total + (quiz.score || 0), 0) || 0;
        const completedQuizzes = progress.quizzes?.length || 0;
        const completedCourses = progress.coursesCompleted?.length || 0;

        leaderboard.push({
          id: user.id,
          name: user.name,
          email: user.email,
          points: totalPoints,
          quizzesCompleted: completedQuizzes,
          coursesCompleted: completedCourses,
          lastActive: progress.lastLogin || user.createdAt
        });
      }

      // Sort by points (descending)
      return leaderboard.sort((a, b) => b.points - a.points);
    } catch (error) {
      console.error('Error getting leaderboard data:', error);
      return [];
    }
  }

  async getWeeklyActivityData() {
    try {
      const allUsersData = await this.loadAllUsers();
      const weeklyData = {};
      const now = new Date();
      
      // Initialize 7 days of data
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        weeklyData[dateKey] = {
          date: dateKey,
          quizzes: 0,
          users: new Set(),
          totalScore: 0,
          quizCount: 0
        };
      }

      // Aggregate data from all users
      for (const user of allUsersData.users) {
        const progress = await this.loadUserProgress(user.id);
        
        progress.quizzes?.forEach(quiz => {
          const quizDate = new Date(quiz.completedAt).toISOString().split('T')[0];
          if (weeklyData[quizDate]) {
            weeklyData[quizDate].quizzes++;
            weeklyData[quizDate].users.add(user.id);
            weeklyData[quizDate].totalScore += quiz.score;
            weeklyData[quizDate].quizCount++;
          }
        });
      }

      // Convert sets to counts and calculate averages
      return Object.values(weeklyData).map(day => ({
        date: day.date,
        quizzes: day.quizzes,
        activeUsers: day.users.size,
        averageScore: day.quizCount > 0 ? Math.round(day.totalScore / day.quizCount) : 0
      }));
    } catch (error) {
      console.error('Error getting weekly activity data:', error);
      return [];
    }
  }
}

export default new UserService();