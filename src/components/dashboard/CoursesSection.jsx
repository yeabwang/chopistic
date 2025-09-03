const CoursesSection = () => {
  const coursesInProgress = [
    { id: 1, title: "Advanced React Patterns", progress: 75, totalLessons: 24, completedLessons: 18 },
    { id: 2, title: "Node.js Fundamentals", progress: 45, totalLessons: 16, completedLessons: 7 },
    { id: 3, title: "Database Design", progress: 30, totalLessons: 20, completedLessons: 6 },
  ];

  const completedCourses = [
    { id: 4, title: "JavaScript Basics", completedDate: "2025-08-15", rating: 5 },
    { id: 5, title: "HTML & CSS", completedDate: "2025-07-22", rating: 4 },
    { id: 6, title: "Git Version Control", completedDate: "2025-06-10", rating: 5 },
  ];

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-lg">
      <h2 className="mb-6 text-xl font-bold text-white">My Courses</h2>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Courses in Progress */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-200">Currently Taking ({coursesInProgress.length})</h3>
          <div className="space-y-4">
            {coursesInProgress.map((course) => (
              <div key={course.id} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-shadow hover:shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium text-white">{course.title}</h4>
                  <span className="text-sm text-gray-300">{course.progress}%</span>
                </div>
                <div className="mb-2 h-2 w-full rounded-full bg-white/20">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-300">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Courses */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-200">Completed ({completedCourses.length})</h3>
          <div className="space-y-4">
            {completedCourses.map((course) => (
              <div key={course.id} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-shadow hover:shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium text-white">{course.title}</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`size-4 ${i < course.rating ? 'text-amber-400' : 'text-gray-500'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  Completed on {new Date(course.completedDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesSection;
