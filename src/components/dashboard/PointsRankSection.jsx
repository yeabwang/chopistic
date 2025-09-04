import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../contexts/AuthContext';

const PointsRankSection = () => {
  const { stats, leaderboardData, loading } = useDashboardData();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse rounded-xl border border-white/20 bg-white/10 p-6">
          <div className="mb-4 h-6 w-3/4 rounded bg-gray-600"></div>
          <div className="space-y-4">
            <div className="h-8 w-16 rounded bg-gray-600"></div>
            <div className="h-6 w-20 rounded bg-gray-600"></div>
            <div className="h-2 w-full rounded bg-gray-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalPoints = stats.totalPoints;
  const nextRankThreshold = Math.ceil(totalPoints / 500) * 500 + 500; // Next 500-point milestone
  const progressToNext = totalPoints > 0 ? ((totalPoints % 500) / 500) * 100 : 0;

  // Use real leaderboard data if available, otherwise show current user only
  const getLeaderboard = () => {
    if (leaderboardData.length === 0) {
      // No other users, show only current user
      return [{
        rank: 1,
        name: user?.name || "You",
        points: totalPoints,
        avatar: "/img/team/yeab.jpg",
        isUser: true
      }];
    }

    // Find current user's position in real leaderboard
    const currentUserIndex = leaderboardData.findIndex(player => player.id === user?.id);
    let leaderboard = [...leaderboardData];

    // Add current user if not in leaderboard yet
    if (currentUserIndex === -1 && user) {
      leaderboard.push({
        id: user.id,
        name: user.name,
        points: totalPoints,
        avatar: "/img/team/yeab.jpg",
        isUser: true
      });
      // Re-sort
      leaderboard.sort((a, b) => b.points - a.points);
    } else if (currentUserIndex !== -1) {
      // Mark current user
      leaderboard[currentUserIndex].isUser = true;
      leaderboard[currentUserIndex].avatar = "/img/team/yeab.jpg";
    }

    // Assign ranks and limit to top 10
    return leaderboard
      .slice(0, 10)
      .map((player, index) => ({
        ...player,
        rank: index + 1,
        avatar: player.avatar || "/img/team/yeab.jpg"
      }));
  };

  const leaderboard = getLeaderboard();
  const currentUserInLeaderboard = leaderboard.find(player => player.isUser);
  const currentRank = currentUserInLeaderboard ? currentUserInLeaderboard.rank : leaderboard.length + 1;

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
            <span>Progress to next milestone</span>
            <span>{nextRankThreshold - totalPoints} points to go</span>
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
          {leaderboard.map((player) => (
            <div 
              key={player.rank} 
              className={`flex items-center justify-between rounded-lg p-3 transition-all ${
                player.isUser 
                  ? 'bg-blue-500/20 ring-2 ring-blue-400/50' 
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-lg font-bold text-white">
                  {getRankBadge(player.rank)}
                </div>
                <img 
                  src={player.avatar} 
                  alt={player.name}
                  className="size-8 rounded-full object-cover"
                />
                <span className={`font-medium ${player.isUser ? 'text-blue-300' : 'text-white'}`}>
                  {player.name}
                </span>
              </div>
              <span className={`font-bold ${player.isUser ? 'text-blue-300' : 'text-gray-300'}`}>
                {player.points.toLocaleString()}
              </span>
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
