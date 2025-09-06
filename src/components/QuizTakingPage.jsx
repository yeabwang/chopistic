import { useState, useEffect, useCallback } from 'react';
import { useQuizTracking } from '../hooks/useQuizTracking';
import { useQuizData } from '../hooks/useQuizData';

const QuizTakingPage = ({ courseId, quizId }) => {
  // Core quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  
  // Enhanced UX state
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const { recordQuizCompletion, trackingError, clearTrackingError } = useQuizTracking();
  const { quizzes, loading, error } = useQuizData(courseId);

  // Find the quiz - this needs to be done before any conditional returns
  const quiz = quizzes?.find(q => q.id === parseInt(quizId));


  // Timer effect with cleanup
  useEffect(() => {
    if (!quizStarted || isSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, quizStarted, isSubmitted]);

  // Enhanced answer handling with immediate feedback
  const handleAnswerChange = useCallback((questionIndex, answerId) => {
    // Don't allow changing answers once selected
    if (answers[questionIndex] !== undefined) return;
    
    setSelectedAnswer(answerId);
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerId
    }));
    
    // Show immediate feedback and keep it visible
    setShowFeedback(true);
  }, [answers]);

  // Enhanced score calculation with detailed breakdown
  const calculateScore = useCallback(() => {
    if (!quiz || !quiz.questionData) return { score: 0, correct: 0, total: 0, results: [] };
    
    let correct = 0;
    const questionResults = quiz.questionData.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correct++;
      
      return {
        questionIndex: index,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });
    
    return {
      score: Math.round((correct / quiz.questionData.length) * 100),
      correct,
      total: quiz.questionData.length,
      results: questionResults
    };
  }, [answers, quiz]);

  // Enhanced quiz submission with better UX and error handling
  const handleSubmit = useCallback(async () => {
    setIsTransitioning(true);
    
    // Add a small delay for smooth transition
    setTimeout(async () => {
      const scoreData = calculateScore();
      setScore(scoreData);
      setIsSubmitted(true);

      try {
        // Clear any previous tracking errors
        clearTrackingError();
        
        await recordQuizCompletion({
          courseId: parseInt(courseId),
          chapter: quiz?.chapterName,
          title: quiz?.title,
          score: scoreData.score,
          totalQuestions: quiz?.questionData?.length || 0,
          timeSpent: Math.floor(timeSpent / 60),
          answers: answers
        });
        
      } catch (error) {
        console.error('Failed to record quiz completion:', error);
        // The error is already handled by the tracking hook and stored in trackingError state
        // We don't need to show an additional error message here as it will be displayed in the UI
      }
    }, 500);
  }, [calculateScore, recordQuizCompletion, clearTrackingError, courseId, quiz, timeSpent, answers]);

  // Enhanced time formatting
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Start quiz function
  const startQuiz = useCallback(() => {
    setQuizStarted(true);
    setShowInstructions(false);
    setStartTime(Date.now());
  }, []);

  // Enhanced navigation with smooth transitions
  const navigateToQuestion = useCallback((direction) => {
    if (!quiz || !quiz.questionData) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentQuestion(prev => Math.min(quiz.questionData.length - 1, prev + 1));
      } else {
        setCurrentQuestion(prev => Math.max(0, prev - 1));
      }
      // Keep feedback visible and don't reset selected answer
      setShowFeedback(true);
      setSelectedAnswer(answers[currentQuestion]);
      setIsTransitioning(false);
    }, 300);
  }, [quiz, answers, currentQuestion]);

  // Enhanced loading state with better UX
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <div className="mb-6">
            <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-violet-300/30 border-t-violet-300"></div>
            <div className="text-lg font-medium">Loading Quiz</div>
            <div className="text-sm text-gray-400">Preparing your learning experience...</div>
            <div className="mt-4 text-xs text-gray-500">
              Course ID: {courseId} | Quiz ID: {quizId}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error handling
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white max-w-md mx-auto px-6">
          <div className="mb-6 text-6xl">⚠️</div>
          <h1 className="mb-4 text-2xl font-bold">Unable to Load Quiz</h1>
          <p className="mb-6 text-gray-400">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full rounded-lg bg-violet-300 px-6 py-3 text-black hover:bg-violet-400 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.hash = `quizzes/${courseId}`}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-white hover:bg-white/20 transition-colors"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white max-w-md mx-auto px-6">
          <div className="mb-6 text-6xl">🔍</div>
          <h1 className="mb-4 text-2xl font-bold">Quiz Not Found</h1>
          <p className="mb-6 text-gray-400">The requested quiz does not exist or may have been moved.</p>
          <div className="mb-6 rounded-lg bg-white/5 p-4 text-left text-sm">
            <div className="mb-2 font-semibold">Debug Info:</div>
            <div>Course ID: {courseId}</div>
            <div>Quiz ID: {quizId}</div>
            <div>Available Quizzes: {quizzes?.length || 0}</div>
            <div>Quiz IDs: {quizzes?.map(q => q.id).join(', ') || 'None'}</div>
          </div>
          <button 
            onClick={() => window.location.hash = `quizzes/${courseId}`}
            className="rounded-lg bg-violet-300 px-6 py-3 text-black hover:bg-violet-400 transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Quiz Instructions Screen
  if (showInstructions && quiz) {
    return (
      <div className="min-h-screen bg-black">
        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => window.location.hash = `quizzes/${courseId}`}
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-gray-300 transition-all duration-300 hover:border-white/30 hover:bg-white/20 hover:text-white"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Quizzes
            </button>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-4 font-zentry text-4xl font-bold uppercase tracking-wide text-white">
                {quiz.title}
              </h1>
              <p className="text-lg text-gray-300">{quiz.description}</p>
            </div>

            {/* Quiz Info Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-white">{quiz.questionData.length}</div>
                <div className="text-sm text-gray-400">Questions</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-white">{quiz.estimatedTime}</div>
                <div className="text-sm text-gray-400">Estimated Time</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-white">{quiz.difficulty}</div>
                <div className="text-sm text-gray-400">Difficulty</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-white">{quiz.passingScore}%</div>
                <div className="text-sm text-gray-400">Passing Score</div>
              </div>
            </div>

            {/* Topics Covered */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-white">Topics Covered</h3>
              <div className="flex flex-wrap gap-2">
                {quiz.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-violet-300/20 px-3 py-1 text-sm text-violet-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Instructions</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-violet-300">•</span>
                  <span>Read each question carefully before selecting your answer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-violet-300">•</span>
                  <span>You can navigate between questions using Previous/Next buttons</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-violet-300">•</span>
                  <span>Take your time - there's no time limit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-violet-300">•</span>
                  <span>Review your answers before submitting</span>
                </li>
              </ul>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={startQuiz}
                className="rounded-xl bg-gradient-to-r from-violet-300 to-purple-400 px-8 py-4 text-lg font-semibold text-black shadow-lg shadow-violet-300/25 transition-all hover:from-violet-400 hover:to-purple-500 hover:shadow-violet-300/40"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Results Screen
  if (isSubmitted) {
    const getScoreEmoji = (score) => {
      if (score >= 90) return '🎉';
      if (score >= 80) return '🌟';
      if (score >= 70) return '👏';
      if (score >= 60) return '👍';
      return '💪';
    };

    const getScoreMessage = (score) => {
      if (score >= 90) return 'Outstanding! You mastered this topic!';
      if (score >= 80) return 'Excellent work! You have a strong understanding.';
      if (score >= 70) return 'Good job! You passed with a solid score.';
      if (score >= 60) return 'Not bad! Consider reviewing the material.';
      return 'Keep studying! You can do better next time.';
    };

    return (
      <div className="min-h-screen bg-black">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg">
            {/* Results Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 text-6xl">{getScoreEmoji(score.score)}</div>
              <h1 className="mb-2 font-zentry text-4xl font-bold uppercase tracking-wide text-white">
                Quiz Completed!
              </h1>
              <p className="text-lg text-gray-300">{getScoreMessage(score.score)}</p>
            </div>

            {/* Score Display */}
            <div className="mb-8 text-center">
              <div className="mb-2 text-6xl font-bold text-violet-300">{score.score}%</div>
              <div className="text-lg text-gray-300">Your Score</div>
            </div>

            {/* Detailed Stats */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="text-3xl font-bold text-white">{score.total}</div>
                <div className="text-gray-400">Total Questions</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="text-3xl font-bold text-green-400">{score.correct}</div>
                <div className="text-gray-400">Correct Answers</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="text-3xl font-bold text-blue-400">{formatTime(timeSpent)}</div>
                <div className="text-gray-400">Time Spent</div>
              </div>
            </div>

            {/* Tracking Error Display */}
            {trackingError && (
              <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="text-red-400 text-lg">⚠️</div>
                  <div>
                    <div className="font-medium text-red-400 mb-1">Progress Tracking Error</div>
                    <div className="text-sm text-red-300 mb-3">
                      Your quiz results couldn't be saved to your progress. Your score is still valid, but it may not appear in your dashboard.
                    </div>
                    <button
                      onClick={() => {
                        clearTrackingError();
                        // Retry saving the quiz result
                        handleSubmit();
                      }}
                      className="rounded-lg bg-red-400/20 border border-red-400/30 px-4 py-2 text-sm text-red-300 hover:bg-red-400/30 transition-colors"
                    >
                      Retry Saving Progress
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => window.location.hash = `quizzes/${courseId}`}
                className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-white transition-all hover:bg-white/20"
              >
                Back to Quizzes
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-gradient-to-r from-violet-300 to-purple-400 px-8 py-4 text-black transition-all hover:from-violet-400 hover:to-purple-500"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Safety check - ensure quiz and questionData exist
  if (!quiz || !quiz.questionData || quiz.questionData.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white max-w-md mx-auto px-6">
          <div className="mb-6 text-6xl">⚠️</div>
          <h1 className="mb-4 text-2xl font-bold">Quiz Data Error</h1>
          <p className="mb-6 text-gray-400">The quiz data is not available or incomplete.</p>
          <button 
            onClick={() => window.location.hash = `quizzes/${courseId}`}
            className="rounded-lg bg-violet-300 px-6 py-3 text-black hover:bg-violet-400 transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = quiz.questionData[currentQuestion];
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / quiz.questionData.length) * 100;
  const isLastQuestion = currentQuestion === quiz.questionData.length - 1;

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Enhanced Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-zentry text-2xl font-bold uppercase tracking-wide text-white">
              {quiz.title}
            </h1>
            <p className="text-gray-400">{quiz.chapterName}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{formatTime(timeSpent)}</div>
              <p className="text-xs text-gray-400">Time Elapsed</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-violet-300">{answeredQuestions}/{quiz.questionData.length}</div>
              <p className="text-xs text-gray-400">Answered</p>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-gray-300">Question {currentQuestion + 1} of {quiz.questionData.length}</span>
            <span className="text-violet-300 font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-violet-300 to-purple-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="mb-8 flex justify-center">
          <div className="flex gap-2">
            {quiz.questionData.map((question, index) => {
              const isAnswered = answers[index] !== undefined;
              const isCorrect = isAnswered && answers[index] === question.correctAnswer;
              const isIncorrect = isAnswered && answers[index] !== question.correctAnswer;
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentQuestion(index);
                      setShowFeedback(true);
                      setSelectedAnswer(answers[index]);
                      setIsTransitioning(false);
                    }, 300);
                  }}
                  className={`size-3 rounded-full transition-all ${
                    index === currentQuestion
                      ? 'bg-violet-300 scale-125'
                      : isCorrect
                      ? 'bg-green-400'
                      : isIncorrect
                      ? 'bg-red-400'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to question ${index + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* Enhanced Question Card */}
        <div className={`rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg transition-all duration-300 ${
          isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}>
          <div className="mb-6">
            <div className="mb-2 text-sm font-medium text-violet-300">Question {currentQuestion + 1}</div>
            <h2 className="text-xl font-bold text-white leading-relaxed">
              {currentQuestionData.question}
            </h2>
          </div>

          {/* Enhanced Options */}
          <div className="space-y-3">
            {currentQuestionData.options.map((option, optionIndex) => {
              const isSelected = answers[currentQuestion] === optionIndex;
              const isCorrect = optionIndex === currentQuestionData.correctAnswer;
              const isAnswered = answers[currentQuestion] !== undefined;
              const showCorrectness = isAnswered && (isSelected || isCorrect);
              
              // Determine the styling based on answer state
              let optionClasses = '';
              let radioClasses = '';
              
              if (isAnswered) {
                if (isCorrect) {
                  // Correct answer - always green
                  optionClasses = 'border-green-400 bg-green-400/20 text-white shadow-lg shadow-green-400/20';
                  radioClasses = 'border-green-400 bg-green-400';
                } else if (isSelected && !isCorrect) {
                  // Selected incorrect answer - red
                  optionClasses = 'border-red-400 bg-red-400/20 text-white shadow-lg shadow-red-400/20';
                  radioClasses = 'border-red-400 bg-red-400';
                } else {
                  // Unselected options - muted
                  optionClasses = 'border-white/10 bg-white/5 text-gray-500';
                  radioClasses = 'border-gray-500';
                }
              } else {
                // Not answered yet
                if (isSelected) {
                  optionClasses = 'border-violet-300 bg-violet-300/20 text-white shadow-lg shadow-violet-300/20';
                  radioClasses = 'border-violet-300 bg-violet-300';
                } else {
                  optionClasses = 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40 hover:bg-white/10';
                  radioClasses = 'border-gray-400';
                }
              }
              
              return (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswerChange(currentQuestion, optionIndex)}
                  disabled={isAnswered}
                  className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${optionClasses} ${
                    isAnswered ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`mr-4 flex size-6 items-center justify-center rounded-full border-2 transition-all ${radioClasses}`}>
                      {isSelected && (
                        <div className="size-2 rounded-full bg-black"></div>
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showCorrectness && (
                      <div className="ml-2">
                        {isCorrect ? (
                          <span className="text-green-400 text-lg">✓</span>
                        ) : (
                          <span className="text-red-400 text-lg">✗</span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Immediate Feedback */}
          {showFeedback && answers[currentQuestion] !== undefined && (
            <div className={`mt-6 rounded-xl border p-4 ${
              answers[currentQuestion] === currentQuestionData.correctAnswer
                ? 'border-green-400/30 bg-green-400/10'
                : 'border-red-400/30 bg-red-400/10'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`text-lg ${
                  answers[currentQuestion] === currentQuestionData.correctAnswer
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {answers[currentQuestion] === currentQuestionData.correctAnswer ? '✓' : '✗'}
                </div>
                <div>
                  <div className="font-medium text-white">
                    {answers[currentQuestion] === currentQuestionData.correctAnswer ? 'Correct!' : 'Incorrect'}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    {currentQuestionData.explanation}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigateToQuestion('prev')}
            disabled={currentQuestion === 0 || isTransitioning}
            className={`rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-white transition-all ${
              currentQuestion === 0 || isTransitioning
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-white/20 hover:border-white/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </div>
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={answeredQuestions !== quiz.questionData.length || isTransitioning}
              className={`rounded-xl px-8 py-3 font-semibold transition-all ${
                answeredQuestions !== quiz.questionData.length || isTransitioning
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-300 to-purple-400 text-black hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-300/25'
              }`}
            >
              {isTransitioning ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={() => navigateToQuestion('next')}
              disabled={!(currentQuestion in answers) || isTransitioning}
              className={`rounded-xl px-6 py-3 font-semibold transition-all ${
                !(currentQuestion in answers) || isTransitioning
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-300 to-purple-400 text-black hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-300/25'
              }`}
            >
              <div className="flex items-center gap-2">
                Next
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTakingPage;
