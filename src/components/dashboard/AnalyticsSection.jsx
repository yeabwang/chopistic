const AnalyticsSection = () => {
  const stats = [
    {
      title: "Total Quizzes Taken",
      value: "47",
      change: "+5 this week",
      changeType: "positive",
      icon: "📝"
    },
    {
      title: "Average Score",
      value: "87%",
      change: "+3% from last month",
      changeType: "positive",
      icon: "📊"
    },
    {
      title: "Current Streak",
      value: "12 days",
      change: "Best: 18 days",
      changeType: "neutral",
      icon: "🔥"
    },
    {
      title: "Study Time",
      value: "24.5h",
      change: "+2.3h this week",
      changeType: "positive",
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
        {stats.map((stat, index) => (
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

      {/* Weekly Activity Chart Placeholder */}
      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-200">Weekly Activity</h3>
        <div className="flex items-end justify-between space-x-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const heights = [60, 80, 45, 90, 70, 30, 85];
            return (
              <div key={day} className="flex flex-col items-center">
                <div 
                  className="w-8 rounded-t bg-gradient-to-t from-blue-500 to-purple-500 transition-all duration-300 hover:from-blue-400 hover:to-purple-400"
                  style={{ height: `${heights[index]}px` }}
                ></div>
                <span className="mt-2 text-xs text-gray-300">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
