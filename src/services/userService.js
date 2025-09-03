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

    const userProgress = {
      userId: newUser.id,
      progress: {},
      achievements: [],
      quizzes: [],
      coursesCompleted: [],
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
}

export default new UserService();