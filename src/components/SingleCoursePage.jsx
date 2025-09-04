import { useState, useEffect } from "react";
import { useCourseData } from "../hooks/useCourseData";

const SingleCoursePage = ({ courseId }) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const { courses, loading } = useCourseData();
  
  const course = courses.find(c => c.id === parseInt(courseId));

  // Mock chapters data - in real app this would come from course data
  const chapters = [
    "Introduction to AI",
    "Machine Learning Basics", 
    "Neural Networks",
    "Deep Learning",
    "Computer Vision",
    "Natural Language Processing"
  ];

  useEffect(() => {
    // Reset active chapter when course changes
    setActiveChapter(0);
  }, [courseId]);

  const handlePrevious = () => {
    if (activeChapter > 0) setActiveChapter(activeChapter - 1);
  };

  const handleNext = () => {
    if (activeChapter < chapters.length - 1) setActiveChapter(activeChapter + 1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center text-white">
          <div className="mb-4 size-8 animate-spin rounded-full border-2 border-violet-300 border-t-transparent"></div>
          <p>Loading course...</p>
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
    <div className="flex min-h-screen bg-black">
      {/* Fixed Left Sidebar */}
      <div className="fixed h-full w-80 overflow-y-auto border-r border-white/10 bg-black backdrop-blur-xl">
        <div className="p-6 pt-8">
          {/* Back Button */}
          <button
            onClick={() => window.location.hash = 'courses'}
            className="mb-6 flex w-full items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-left text-sm text-gray-300 transition-all duration-300 hover:border-white/30 hover:bg-white/20 hover:text-white"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </button>
          
          <h2 className="mb-8 font-zentry text-xl font-black uppercase tracking-wide text-white">
            {course.title}
          </h2>
          
          <div className="space-y-3">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => setActiveChapter(index)}
                className={`w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                  activeChapter === index
                    ? "border-blue-300/50 bg-blue-300/20 text-white shadow-lg shadow-blue-300/10"
                    : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                    activeChapter === index 
                      ? "bg-blue-300 text-black" 
                      : "bg-white/10 text-gray-400"
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-general text-sm font-medium">{chapter}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Quiz Section */}
          <div className="mt-8 rounded-xl border border-violet-300/20 bg-violet-300/10 p-4">
            <div className="mb-3">
              <h4 className="font-general text-sm font-bold text-white">Course Quiz</h4>
              <p className="text-xs text-gray-400">Test your knowledge</p>
            </div>
            <button
              onClick={() => window.location.hash = `quizzes/${courseId}`}
              className="w-full rounded-lg bg-yellow-300 px-3 py-2 font-general text-sm font-medium text-black transition-all duration-300 hover:bg-yellow-300/90"
            >
              Take Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-80 flex-1">
        <div className="space-y-8 p-8 pt-12">
          
          {/* Video Section */}
          <div className="w-full">
            <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl">
              <iframe
                className="size-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Course Video"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/30 to-black/50 p-8 backdrop-blur-xl">
            <h1 className="mb-6 font-zentry text-3xl font-black uppercase tracking-wide text-white">
              {chapters[activeChapter]}
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="mb-6 font-robert-regular text-lg leading-relaxed text-gray-300">
                This is Chapter {activeChapter + 1}: {chapters[activeChapter]}. Here you&apos;ll find detailed course materials, explanations, 
                and supplementary information for this specific topic.
              </p>
              
              <p className="font-robert-regular leading-relaxed text-gray-400">
                Interactive elements, code examples, exercises, and multimedia content 
                are seamlessly integrated into this flexible content space to enhance your learning experience.
              </p>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <button
              onClick={handlePrevious}
              disabled={activeChapter === 0}
              className={`flex items-center gap-2 rounded-full px-6 py-3 font-general text-sm font-medium transition-all duration-300 ${
                activeChapter === 0
                  ? "cursor-not-allowed bg-gray-800/50 text-gray-500"
                  : "border border-white/20 bg-white/10 text-white hover:border-white/30 hover:bg-white/20"
              }`}
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-2">
              {chapters.map((_, index) => (
                <div
                  key={index}
                  className={`size-2 rounded-full transition-all duration-300 ${
                    index === activeChapter 
                      ? "scale-125 bg-violet-300" 
                      : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={activeChapter === chapters.length - 1}
              className={`flex items-center gap-2 rounded-full px-6 py-3 font-general text-sm font-medium transition-all duration-300 ${
                activeChapter === chapters.length - 1
                  ? "cursor-not-allowed bg-gray-800/50 text-gray-500"
                  : "bg-blue-300 text-black shadow-lg shadow-blue-300/20 hover:bg-blue-300/90"
              }`}
            >
              Next
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCoursePage;
