const AchievementsSection = () => {
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first quiz",
      icon: "🎯",
      earned: true,
      earnedDate: "2025-06-15"
    },
    {
      id: 2,
      title: "Quiz Master",
      description: "Score 90+ on 5 quizzes",
      icon: "🏆",
      earned: true,
      earnedDate: "2025-07-20"
    },
    {
      id: 3,
      title: "Streak Champion",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      earned: true,
      earnedDate: "2025-08-01"
    },
    {
      id: 4,
      title: "Course Crusher",
      description: "Complete 3 courses",
      icon: "📚",
      earned: true,
      earnedDate: "2025-08-10"
    },
    {
      id: 5,
      title: "Speed Demon",
      description: "Complete a quiz in under 5 minutes",
      icon: "⚡",
      earned: true,
      earnedDate: "2025-08-18"
    },
    {
      id: 6,
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: "💯",
      earned: false,
      progress: 95
    },
    {
      id: 7,
      title: "Study Marathon",
      description: "Study for 50+ hours total",
      icon: "🎓",
      earned: false,
      progress: 72
    },
    {
      id: 8,
      title: "Social Learner",
      description: "Join a study group",
      icon: "👥",
      earned: false,
      progress: 0
    }
  ];

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Achievements</h3>
        <span className="text-sm text-gray-300">
          {achievements.filter(a => a.earned).length} of {achievements.length}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`group relative rounded-lg p-4 text-center transition-all duration-200 ${
              achievement.earned
                ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20 ring-2 ring-amber-400/50 hover:ring-amber-300/70'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {/* Achievement Icon */}
            <div className={`mb-2 text-2xl transition-transform group-hover:scale-110 ${
              achievement.earned ? '' : 'opacity-40 grayscale'
            }`}>
              {achievement.icon}
            </div>
            
            {/* Achievement Title */}
            <h4 className={`text-sm font-semibold ${
              achievement.earned ? 'text-white' : 'text-gray-400'
            }`}>
              {achievement.title}
            </h4>
            
            {/* Progress for unearned achievements */}
            {!achievement.earned && achievement.progress && (
              <div className="mt-2">
                <div className="h-1 w-full rounded-full bg-white/20">
                  <div 
                    className="h-1 rounded-full bg-blue-400 transition-all duration-300"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">{achievement.progress}%</span>
              </div>
            )}
            
            {/* Tooltip */}
            <div className="invisible absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-lg border border-white/10 bg-gray-900/95 p-2 text-xs text-white opacity-0 backdrop-blur-sm transition-all group-hover:visible group-hover:opacity-100">
              <p>{achievement.description}</p>
              {achievement.earned && (
                <p className="mt-1 text-gray-300">
                  Earned: {new Date(achievement.earnedDate).toLocaleDateString()}
                </p>
              )}
              <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full rounded-lg bg-white/10 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
        View All Achievements
      </button>
    </div>
  );
};

export default AchievementsSection;
