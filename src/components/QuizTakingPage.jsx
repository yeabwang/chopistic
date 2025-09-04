import { useState, useEffect } from 'react';
import { useQuizTracking } from '../hooks/useQuizTracking';
import { useQuizData } from '../hooks/useQuizData';

const QuizTakingPage = ({ courseId, quizId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const { recordQuizCompletion } = useQuizTracking();
  const { quizzes, loading } = useQuizData(courseId);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <div className="mb-4 size-8 animate-spin rounded-full border-b-2 border-white"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  const quiz = quizzes?.find(q => q.id === quizId);

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">Quiz Not Found</h1>
          <p className="text-gray-400">The requested quiz does not exist.</p>
          <button 
            onClick={() => window.location.hash = `quizzes/${courseId}`}
            className="mt-4 rounded-lg bg-violet-300 px-6 py-2 text-black hover:bg-violet-400"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionIndex, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerId
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.options.find(opt => opt.isCorrect)?.id;
      if (userAnswer === correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);

    try {
      await recordQuizCompletion({
        courseId: parseInt(courseId),
        chapter: quiz.chapter,
        title: quiz.title,
        score: finalScore,
        totalQuestions: quiz.questions.length,
        timeSpent: Math.floor(timeSpent / 60), // Convert to minutes
        answers: answers
      });
    } catch (error) {
      console.error('Failed to record quiz completion:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-lg">
            <div className="mb-6">
              {score >= 90 ? '🎉' : score >= 70 ? '👏' : score >= 50 ? '👍' : '💪'}
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white">Quiz Completed!</h1>
            <div className="mb-6">
              <div className="text-6xl font-bold text-violet-300">{score}%</div>
              <p className="text-gray-300">Your Score</p>
            </div>
            <div className="mb-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{quiz.questions.length}</div>
                <p className="text-gray-400">Total Questions</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {Math.round((score / 100) * quiz.questions.length)}
                </div>
                <p className="text-gray-400">Correct</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{formatTime(timeSpent)}</div>
                <p className="text-gray-400">Time Spent</p>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.hash = `quizzes/${courseId}`}
                className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-white transition-all hover:bg-white/20"
              >
                Back to Quizzes
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-violet-300 px-6 py-3 text-black transition-all hover:bg-violet-400"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
            <p className="text-gray-400">Chapter: {quiz.chapter}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">{formatTime(timeSpent)}</div>
            <p className="text-gray-400">Time Elapsed</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-gray-400">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 rounded-full bg-white/20">
            <div 
              className="h-2 rounded-full bg-violet-300 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg">
          <h2 className="mb-6 text-xl font-bold text-white">
            {currentQuestionData.question}
          </h2>

          <div className="space-y-3">
            {currentQuestionData.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerChange(currentQuestion, option.id)}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  answers[currentQuestion] === option.id
                    ? 'border-violet-300 bg-violet-300/20 text-white'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center">
                  <div className={`mr-3 flex size-6 items-center justify-center rounded-full border-2 ${
                    answers[currentQuestion] === option.id
                      ? 'border-violet-300 bg-violet-300'
                      : 'border-gray-400'
                  }`}>
                    {answers[currentQuestion] === option.id && (
                      <div className="size-2 rounded-full bg-black"></div>
                    )}
                  </div>
                  <span>{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="cursor-not-allowed rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-white opacity-50 transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== quiz.questions.length}
              className="cursor-not-allowed rounded-lg bg-violet-300 px-8 py-3 text-black opacity-50 transition-all hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
              disabled={!answers[currentQuestion]}
              className="cursor-not-allowed rounded-lg bg-violet-300 px-6 py-3 text-black opacity-50 transition-all hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTakingPage;
