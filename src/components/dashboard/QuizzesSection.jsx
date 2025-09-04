import { useDashboardData } from '../../hooks/useDashboardData';
import { useRouter } from '../../hooks/useRouter';

const QuizzesSection = () => {
  const { recentQuizzes, loading } = useDashboardData();
  const { navigateTo } = useRouter();

  if (loading) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
        <h2 className="mb-6 text-xl font-bold text-white">Recent Quiz Activity</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="mb-2 h-5 w-3/4 rounded bg-gray-600"></div>
              <div className="mb-2 h-4 w-1/2 rounded bg-gray-600"></div>
              <div className="h-3 w-full rounded bg-gray-600"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleQuizClick = (courseId) => {
    navigateTo(`quizzes/${courseId}`);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
      <h2 className="mb-6 text-xl font-bold text-white">Recent Quiz Activity</h2>
      
      <div className="space-y-4">
        {recentQuizzes.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-gray-400">No quizzes completed yet</p>
            <button
              onClick={() => navigateTo('courses')}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Start Learning
            </button>
          </div>
        ) : (
          recentQuizzes.map((quiz, index) => (
            <div 
              key={index} 
              className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-200 hover:border-purple-400/50 hover:shadow-lg"
              onClick={() => handleQuizClick(quiz.courseId)}
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium text-white">{quiz.title}</h4>
                <span className={`text-lg font-bold ${getScoreColor(quiz.score)}`}>
                  {quiz.score}%
                </span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-300">{quiz.courseName}</span>
                <span className="text-xs text-gray-400">{quiz.timeAgo}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Chapter: {quiz.chapter}</span>
                <span>{quiz.totalQuestions} questions</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Browse More Quizzes */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigateTo('courses')}
          className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white transition-all hover:border-blue-400/50 hover:bg-white/10"
        >
          Browse All Courses
        </button>
      </div>
    </div>
  );
};

export default QuizzesSection;
