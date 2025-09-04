import { useDashboardData } from '../../hooks/useDashboardData';

const AchievementsSection = () => {
  const { stats, userProgress, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
        <h3 className="mb-4 text-lg font-semibold text-white">Achievements</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="size-10 rounded-full bg-gray-600"></div>
              <div className="flex-1">
                <div className="mb-1 h-4 w-3/4 rounded bg-gray-600"></div>
                <div className="h-3 w-1/2 rounded bg-gray-600"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Generate achievements based on user progress
  const generateAchievements = () => {
    const achievements = [];

    // First Steps Achievement
    achievements.push({
      id: 1,
      title: "First Steps",
      description: "Complete your first quiz",
      icon: "🎯",
      earned: stats.completedQuizzes > 0,
      earnedDate: stats.completedQuizzes > 0 ? userProgress?.quizzes?.[0]?.completedAt : null
    });

    // Quiz Master Achievement
    const highScoreQuizzes = userProgress?.quizzes?.filter(quiz => quiz.score >= 90).length || 0;
    achievements.push({
      id: 2,
      title: "Quiz Master",
      description: "Score 90+ on 5 quizzes",
      icon: "🏆",
      earned: highScoreQuizzes >= 5,
      progress: Math.min(100, (highScoreQuizzes / 5) * 100),
      earnedDate: highScoreQuizzes >= 5 ? userProgress?.quizzes?.find(quiz => quiz.score >= 90)?.completedAt : null
    });

    // Streak Champion Achievement
    achievements.push({
      id: 3,
      title: "Streak Champion",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      earned: stats.currentStreak >= 7,
      progress: Math.min(100, (stats.currentStreak / 7) * 100),
      earnedDate: stats.currentStreak >= 7 ? new Date().toISOString() : null
    });

    // Course Crusher Achievement
    achievements.push({
      id: 4,
      title: "Course Crusher",
      description: "Complete 3 courses",
      icon: "📚",
      earned: stats.completedCourses >= 3,
      progress: Math.min(100, (stats.completedCourses / 3) * 100),
      earnedDate: stats.completedCourses >= 3 ? new Date().toISOString() : null
    });

    // Perfect Score Achievement
    const perfectScores = userProgress?.quizzes?.filter(quiz => quiz.score === 100).length || 0;
    achievements.push({
      id: 5,
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: "💯",
      earned: perfectScores > 0,
      progress: perfectScores > 0 ? 100 : Math.min(95, stats.averageQuizScore),
      earnedDate: perfectScores > 0 ? userProgress?.quizzes?.find(quiz => quiz.score === 100)?.completedAt : null
    });

    // Learning Enthusiast Achievement
    achievements.push({
      id: 6,
      title: "Learning Enthusiast",
      description: "Complete 10 quizzes",
      icon: "📖",
      earned: stats.completedQuizzes >= 10,
      progress: Math.min(100, (stats.completedQuizzes / 10) * 100),
      earnedDate: stats.completedQuizzes >= 10 ? userProgress?.quizzes?.[9]?.completedAt : null
    });

    return achievements;
  };

  const achievements = generateAchievements();
  const earnedAchievements = achievements.filter(a => a.earned);
  const unlockedAchievements = achievements.filter(a => !a.earned);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Achievements ({earnedAchievements.length}/{achievements.length})
      </h3>
      
      <div className="space-y-3">
        {/* Show earned achievements first */}
        {earnedAchievements.slice(0, 3).map((achievement) => (
          <div 
            key={achievement.id} 
            className="flex items-center space-x-3 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20 p-3 ring-1 ring-emerald-400/30"
          >
            <div className="text-2xl">{achievement.icon}</div>
            <div className="flex-1">
              <h4 className="font-medium text-white">{achievement.title}</h4>
              <p className="text-xs text-gray-300">{achievement.description}</p>
              {achievement.earnedDate && (
                <p className="text-xs text-emerald-400">
                  Earned {formatDate(achievement.earnedDate)}
                </p>
              )}
            </div>
            <div className="text-emerald-400">✓</div>
          </div>
        ))}

        {/* Show progress on unearned achievements */}
        {unlockedAchievements.slice(0, 2).map((achievement) => (
          <div 
            key={achievement.id} 
            className="flex items-center space-x-3 rounded-lg bg-white/5 p-3 transition-all hover:bg-white/10"
          >
            <div className="text-2xl opacity-50">{achievement.icon}</div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-300">{achievement.title}</h4>
              <p className="text-xs text-gray-400">{achievement.description}</p>
              {achievement.progress !== undefined && (
                <div className="mt-1">
                  <div className="h-1 w-full rounded-full bg-gray-600">
                    <div 
                      className="h-1 rounded-full bg-blue-400 transition-all duration-300"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{Math.round(achievement.progress)}% complete</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-400 transition-colors hover:text-blue-300">
          View All Achievements
        </button>
      </div>
    </div>
  );
};

export default AchievementsSection;
