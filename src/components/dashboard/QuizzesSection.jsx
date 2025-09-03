const QuizzesSection = () => {
  const activeQuizzes = [
    { id: 1, title: "React Hooks Quiz", progress: 60, questionsAnswered: 6, totalQuestions: 10, attempts: 2 },
    { id: 2, title: "JavaScript ES6+ Quiz", progress: 80, questionsAnswered: 8, totalQuestions: 10, attempts: 1 },
    { id: 3, title: "CSS Flexbox Quiz", progress: 40, questionsAnswered: 4, totalQuestions: 10, attempts: 1 },
  ];

  const completedQuizzes = [
    { id: 4, title: "HTML Basics Quiz", score: 95, completedDate: "2025-08-20", attempts: 1 },
    { id: 5, title: "Git Commands Quiz", score: 87, completedDate: "2025-08-18", attempts: 2 },
    { id: 6, title: "API Design Quiz", score: 92, completedDate: "2025-08-15", attempts: 1 },
    { id: 7, title: "Database SQL Quiz", score: 78, completedDate: "2025-08-10", attempts: 3 },
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
      <h2 className="mb-6 text-xl font-bold text-white">My Quizzes</h2>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Quizzes */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-200">In Progress ({activeQuizzes.length})</h3>
          <div className="space-y-4">
            {activeQuizzes.map((quiz) => (
              <div key={quiz.id} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-shadow hover:shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium text-white">{quiz.title}</h4>
                  <span className="text-sm text-gray-300">{quiz.progress}%</span>
                </div>
                <div className="mb-2 h-2 w-full rounded-full bg-white/20">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
                    style={{ width: `${quiz.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>{quiz.questionsAnswered} of {quiz.totalQuestions} questions</span>
                  <span>{quiz.attempts} attempt{quiz.attempts !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Quizzes */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-200">Completed ({completedQuizzes.length})</h3>
          <div className="space-y-4">
            {completedQuizzes.map((quiz) => (
              <div key={quiz.id} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-shadow hover:shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium text-white">{quiz.title}</h4>
                  <span className={`text-lg font-bold ${getScoreColor(quiz.score)}`}>
                    {quiz.score}%
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Completed {new Date(quiz.completedDate).toLocaleDateString()}</span>
                  <span>{quiz.attempts} attempt{quiz.attempts !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzesSection;
