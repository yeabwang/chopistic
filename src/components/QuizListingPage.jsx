import { useState, useEffect } from "react";
import { useCourseData } from "../hooks/useCourseData";

const QuizListingPage = ({ courseId }) => {
  const { courses, loading } = useCourseData();
  const [quizzes, setQuizzes] = useState([]);
  
  const course = courses.find(c => c.id === parseInt(courseId));

  // Mock quiz data - in real app this would come from API
  useEffect(() => {
    if (courseId) {
      const mockQuizzes = [
        {
          id: 1,
          title: "Introduction to AI Fundamentals",
          description: "Test your understanding of basic AI concepts and terminology covered in the first chapter.",
          questions: 10,
          estimatedTime: "15 mins",
          difficulty: "Beginner",
          completed: true,
          score: 85
        },
        {
          id: 2,
          title: "Machine Learning Basics Assessment",
          description: "Evaluate your knowledge of ML algorithms, supervised and unsupervised learning methods.",
          questions: 15,
          estimatedTime: "20 mins",
          difficulty: "Intermediate",
          completed: false,
          score: null
        },
        {
          id: 3,
          title: "Neural Networks Deep Dive",
          description: "Challenge yourself with advanced neural network architectures and deep learning concepts.",
          questions: 12,
          estimatedTime: "18 mins",
          difficulty: "Advanced",
          completed: false,
          score: null
        },
        {
          id: 4,
          title: "Practical AI Applications",
          description: "Apply your knowledge to real-world scenarios and case studies in artificial intelligence.",
          questions: 8,
          estimatedTime: "12 mins",
          difficulty: "Intermediate",
          completed: true,
          score: 92
        },
        {
          id: 5,
          title: "Final Assessment",
          description: "Comprehensive evaluation covering all course topics and advanced problem-solving scenarios.",
          questions: 25,
          estimatedTime: "35 mins",
          difficulty: "Advanced",
          completed: false,
          score: null
        }
      ];
      setQuizzes(mockQuizzes);
    }
  }, [courseId]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Intermediate':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Advanced':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <div className="mb-4 size-8 animate-spin rounded-full border-2 border-violet-300 border-t-transparent"></div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">Course Not Found</h1>
          <p className="text-gray-400">The requested course does not exist.</p>
          <button 
            onClick={() => window.location.hash = 'courses'}
            className="mt-4 rounded-lg bg-violet-300 px-6 py-2 text-black hover:bg-violet-400"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        
        {/* Page Header */}
        <div className="mb-12">
          {/* Back Button */}
          <button
            onClick={() => window.location.hash = `course/${courseId}`}
            className="mb-6 flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-gray-300 transition-all duration-300 hover:border-white/30 hover:bg-white/20 hover:text-white"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </button>

          {/* Header Content */}
          <div className="space-y-4 text-center">
            <h1 className="font-zentry text-4xl font-black uppercase tracking-wide text-white md:text-5xl">
              Quizzes for <span className="text-white">{course.title}</span>
            </h1>
            <p className="mx-auto max-w-2xl font-robert-regular text-lg text-gray-400">
              Test your knowledge and track your progress with interactive quizzes designed to reinforce key concepts.
            </p>
          </div>

          {/* Progress Overview */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{quizzes.length}</div>
              <div className="text-sm text-gray-400">Total Quizzes</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">{quizzes.filter(q => q.completed).length}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">
                {quizzes.filter(q => q.completed).length > 0 
                  ? Math.round(quizzes.filter(q => q.completed).reduce((acc, q) => acc + q.score, 0) / quizzes.filter(q => q.completed).length)
                  : 0}%
              </div>
              <div className="text-sm text-gray-400">Average Score</div>
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/30 to-black/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-300/30 hover:shadow-lg hover:shadow-violet-300/10"
            >
              {/* Completion Badge */}
              {quiz.completed && (
                <div className="absolute right-4 top-4">
                  <div className="flex items-center gap-1 rounded-full bg-green-400/20 px-2 py-1 text-xs text-green-400">
                    <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {quiz.score}%
                  </div>
                </div>
              )}

              {/* Quiz Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-zentry text-lg font-bold uppercase text-white transition-colors group-hover:text-white">
                    {quiz.title}
                  </h3>
                  <p className="font-robert-regular text-sm leading-relaxed text-gray-400">
                    {quiz.description}
                  </p>
                </div>

                {/* Quiz Metadata */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.questions} questions
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.estimatedTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                      <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {quiz.difficulty}
                    </div>
                  </div>
                </div>

                {/* Start Quiz Button */}
                <button
                  onClick={() => window.location.hash = `quiz/${courseId}/${quiz.id}`}
                  className={`w-full rounded-xl px-4 py-3 font-general text-sm font-medium transition-all duration-300 ${
                    quiz.completed
                      ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                      : "bg-yellow-300 text-black shadow-lg shadow-yellow-300/20 hover:bg-yellow-300/90"
                  }`}
                >
                  {quiz.completed ? "Retake Quiz" : "Start Quiz"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {quizzes.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-6xl">📝</div>
              <h3 className="mb-2 font-zentry text-xl font-bold text-white">No Quizzes Available</h3>
              <p className="text-gray-400">Quizzes for this course will be available soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizListingPage;
