const PointsRankSection = () => {
  const currentRank = 247;
  const totalPoints = 1247;
  const nextRankPoints = 1500;
  const progressToNext = ((totalPoints) / nextRankPoints) * 100;

  const leaderboard = [
    { rank: 1, name: "Sarah Chen", points: 2840, avatar: "/img/team/sarah/profile.jpg" },
    { rank: 2, name: "Daniel Kim", points: 2715, avatar: "/img/team/daniel/profile.jpg" },
    { rank: 3, name: "Eric Johnson", points: 2680, avatar: "/img/team/eric/profile.jpg" },
    { rank: 4, name: "You", points: 1247, avatar: "/img/team/yeab.jpg", isUser: true },
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="space-y-6">
      {/* Current Rank & Points */}
      <div className="rounded-xl border border-white/20 bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white shadow-xl backdrop-blur-lg">
        <h3 className="mb-4 text-lg font-semibold">Your Rank & Points</h3>
        
        <div className="mb-4 text-center">
          <div className="text-3xl font-bold">#{currentRank}</div>
          <div className="text-blue-100">Global Rank</div>
        </div>
        
        <div className="mb-4 text-center">
          <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
          <div className="text-blue-100">Total Points</div>
        </div>
        
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>Progress to next rank</span>
            <span>{nextRankPoints - totalPoints} points to go</span>
          </div>
          <div className="h-2 rounded-full bg-blue-400/30">
            <div 
              className="h-2 rounded-full bg-white transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Mini Leaderboard */}
      <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
        <h3 className="mb-4 text-lg font-semibold text-white">Leaderboard</h3>
        
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div 
              key={user.rank} 
              className={`flex items-center justify-between rounded-lg p-3 transition-all ${
                user.isUser 
                  ? 'bg-blue-500/20 ring-2 ring-blue-400/50' 
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex size-8 items-center justify-center text-sm font-bold text-yellow-400">
                  {getRankBadge(user.rank)}
                </div>
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="size-8 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <div className="font-medium text-white">
                    {user.name}
                  </div>
                </div>
              </div>
              <div className="font-semibold text-blue-300">
                {user.points.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-4 w-full rounded-lg bg-white/10 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
          View Full Leaderboard
        </button>
      </div>
    </div>
  );
};

export default PointsRankSection;
