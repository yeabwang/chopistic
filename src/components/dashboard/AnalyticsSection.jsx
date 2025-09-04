import { useDashboardData } from '../../hooks/useDashboardData';

const AnalyticsSection = () => {
  const { stats, weeklyActivityData, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
        <h2 className="mb-6 text-xl font-bold text-white">Analytics Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="mb-3 size-8 rounded bg-gray-600"></div>
              <div className="mb-2 h-6 w-16 rounded bg-gray-600"></div>
              <div className="mb-1 h-4 w-20 rounded bg-gray-600"></div>
              <div className="h-3 w-24 rounded bg-gray-600"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const analyticsData = [
    {
      title: "Total Quizzes Taken",
      value: stats.completedQuizzes.toString(),
      change: `${stats.completedQuizzes > 0 ? '+' : ''}${stats.completedQuizzes} completed`,
      changeType: stats.completedQuizzes > 0 ? "positive" : "neutral",
      icon: "📝"
    },
    {
      title: "Average Score",
      value: `${stats.averageQuizScore}%`,
      change: stats.averageQuizScore >= 80 ? "Great performance!" : stats.averageQuizScore >= 60 ? "Good progress" : "Keep improving",
      changeType: stats.averageQuizScore >= 80 ? "positive" : stats.averageQuizScore >= 60 ? "neutral" : "negative",
      icon: "📊"
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`,
      change: stats.currentStreak > 0 ? "Keep it up!" : "Start your streak",
      changeType: stats.currentStreak > 0 ? "positive" : "neutral",
      icon: "🔥"
    },
    {
      title: "Study Time",
      value: `${stats.studyTimeHours}h`,
      change: `${stats.completedCourses} courses completed`,
      changeType: stats.studyTimeHours > 0 ? "positive" : "neutral",
      icon: "⏱️"
    }
  ];

  const getChangeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-emerald-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
      <h2 className="mb-6 text-xl font-bold text-white">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsData.map((stat, index) => (
          <div 
            key={index} 
            className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-200 hover:border-blue-400/50 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-300">{stat.title}</p>
                <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                <p className={`mt-1 text-sm ${getChangeColor(stat.changeType)}`}>
                  {stat.change}
                </p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Activity Chart */}
      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Weekly Activity</h3>
        <div className="flex items-end justify-between space-x-2">
          {weeklyActivityData.length > 0 ? (
            weeklyActivityData.map((day) => {
              const maxQuizzes = Math.max(...weeklyActivityData.map(d => d.quizzes)) || 1;
              const height = Math.max(20, (day.quizzes / maxQuizzes) * 80);
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
              
              return (
                <div key={day.date} className="flex flex-col items-center">
                  <div 
                    className="w-8 rounded-t bg-gradient-to-t from-blue-500 to-purple-500 transition-all duration-300 hover:from-blue-400 hover:to-purple-400"
                    style={{ height: `${height}px` }}
                    title={`${day.quizzes} quizzes completed by ${day.activeUsers} user${day.activeUsers !== 1 ? 's' : ''}`}
                  ></div>
                  <span className="mt-2 text-xs text-gray-300">{dayName}</span>
                  <span className="text-xs text-gray-400">{day.quizzes}</span>
                </div>
              );
            })
          ) : (
            // Fallback when no data available
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="flex flex-col items-center">
                <div 
                  className="w-8 rounded-t bg-gradient-to-t from-gray-600 to-gray-500"
                  style={{ height: '20px' }}
                ></div>
                <span className="mt-2 text-xs text-gray-300">{day}</span>
                <span className="text-xs text-gray-400">0</span>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            {weeklyActivityData.length > 0 ? (
              <>
                Total: {weeklyActivityData.reduce((sum, day) => sum + day.quizzes, 0)} quizzes this week
              </>
            ) : (
              'No activity data available'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
