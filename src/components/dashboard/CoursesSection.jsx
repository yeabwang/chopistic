import { useDashboardData } from '../../hooks/useDashboardData';
import { useRouter } from '../../hooks/useRouter';

const CoursesSection = () => {
  const { coursesWithProgress, loading } = useDashboardData();
  const { navigateTo } = useRouter();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
        <h2 className="mb-6 text-xl font-bold text-white">My Courses</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="mb-2 h-5 w-3/4 rounded bg-gray-600"></div>
              <div className="mb-2 h-2 w-full rounded bg-gray-600"></div>
              <div className="h-4 w-1/2 rounded bg-gray-600"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const coursesInProgress = coursesWithProgress.filter(course => !course.isCompleted);
  const completedCourses = coursesWithProgress.filter(course => course.isCompleted);

  const handleCourseClick = (courseId) => {
    navigateTo(`course/${courseId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
      <h2 className="mb-6 text-xl font-bold text-white">My Courses</h2>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Courses in Progress */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-200">
            Currently Taking ({coursesInProgress.length})
          </h3>
          <div className="space-y-4">
            {coursesInProgress.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-gray-400">No courses in progress</p>
                <button
                  onClick={() => navigateTo('courses')}
                  className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              coursesInProgress.map((course) => (
                <div 
                  key={course.id} 
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-200 hover:border-blue-400/50 hover:shadow-lg"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium text-white">{course.title}</h4>
                    <span className="text-sm text-gray-300">
                      {course.quizzesCompleted} quiz{course.quizzesCompleted !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-300">Progress</span>
                    <span className="text-sm text-blue-400">
                      {course.averageScore > 0 ? `Avg: ${course.averageScore}%` : 'Not started'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {course.lastAccessed ? `Last accessed: ${formatDate(course.lastAccessed)}` : 'Start learning'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Courses */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-200">
            Completed ({completedCourses.length})
          </h3>
          <div className="space-y-4">
            {completedCourses.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-gray-400">No courses completed yet</p>
              </div>
            ) : (
              completedCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-200 hover:border-green-400/50 hover:shadow-lg"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium text-white">{course.title}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(course.averageScore / 20) ? 'opacity-100' : 'opacity-30'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-400">✓ Completed</span>
                    <span className="text-sm text-gray-300">
                      {course.quizzesCompleted} quiz{course.quizzesCompleted !== 1 ? 'es' : ''} • Avg: {course.averageScore}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {course.lastAccessed && `Completed: ${formatDate(course.lastAccessed)}`}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesSection;
