import { useAuth } from '../../contexts/AuthContext';
import { useDashboardData } from '../../hooks/useDashboardData';

const DashboardHeader = () => {
  const { user } = useAuth();
  const { stats, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="size-16 rounded-full bg-gray-600"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 rounded bg-gray-600"></div>
              <div className="h-4 w-64 rounded bg-gray-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
      <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
        {/* User Info */}
        <div className="flex items-center space-x-4">
          <div className="size-16 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 ring-2 ring-white/30">
            <img
              src="/img/team/yeab.jpg"
              alt="User Avatar"
              className="size-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-gray-300">Ready to continue your learning journey?</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-4 flex space-x-6 sm:mt-0">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">{stats.totalPoints}</p>
            <p className="text-sm text-gray-300">Total Points</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">{stats.completedCourses}</p>
            <p className="text-sm text-gray-300">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">{stats.currentStreak}</p>
            <p className="text-sm text-gray-300">Current Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
