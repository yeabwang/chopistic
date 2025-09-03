import DashboardHeader from './DashboardHeader';
import CoursesSection from './CoursesSection';
import QuizzesSection from './QuizzesSection';
import AnalyticsSection from './AnalyticsSection';
import PointsRankSection from './PointsRankSection';
import AchievementsSection from './AchievementsSection';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pb-8 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <DashboardHeader />
        
        {/* Main Dashboard Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <AnalyticsSection />
            <CoursesSection />
            <QuizzesSection />
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <PointsRankSection />
            <AchievementsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
