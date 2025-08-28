import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

// Glassmorphic Filter Component
const FilterSection = ({ selectedCategory, onCategoryChange, selectedLevel, onLevelChange }) => {
  const categories = ["All", "Machine Learning", "Deep Learning", "NLP", "Computer Vision"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="courses-filter-glass sticky top-24 h-fit overflow-hidden rounded-3xl border border-white/10 p-8 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-gradient-to-r from-violet-300 to-blue-300"></div>
        <h3 className="font-zentry text-2xl font-black uppercase text-white">
          Explore
        </h3>
        <p className="font-general text-xs uppercase tracking-wider text-blue-50/60">
          Find Your Path
        </p>
      </div>
      
      {/* Category Filter */}
      <div className="mb-8">
        <h4 className="mb-4 font-general text-xs uppercase tracking-wider text-blue-50/80">Category</h4>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`group relative w-full overflow-hidden rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-violet-300/20 to-blue-300/20 text-white shadow-lg"
                  : "text-blue-50/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-violet-300 to-blue-300 opacity-0 transition-opacity duration-300 ${
                selectedCategory === category ? "opacity-20" : "group-hover:opacity-10"
              }`}></div>
              <span className="relative z-10">{category}</span>
              {selectedCategory === category && (
                <div className="absolute right-4 top-1/2 size-2 -translate-y-1/2 rounded-full bg-violet-300"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      {/* Level Filter */}
      <div>
        <h4 className="mb-4 font-general text-xs uppercase tracking-wider text-blue-50/80">Skill Level</h4>
        <div className="grid grid-cols-2 gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => onLevelChange(level)}
              className={`group relative overflow-hidden rounded-lg px-3 py-2 text-center text-xs font-medium transition-all duration-300 ${
                selectedLevel === level
                  ? "bg-gradient-to-br from-yellow-300/20 to-yellow-300/10 text-yellow-300 shadow-md"
                  : "bg-white/5 text-blue-50/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className={`absolute inset-0 bg-yellow-300 opacity-0 transition-opacity duration-300 ${
                selectedLevel === level ? "opacity-10" : "group-hover:opacity-5"
              }`}></div>
              <span className="relative z-10">{level}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="mt-8 pt-6">
        <div className="h-px bg-gradient-to-r from-violet-300/50 via-blue-300/50 to-transparent"></div>
        <div className="mt-4 flex items-center justify-center space-x-1">
          <div className="size-1 rounded-full bg-violet-300/60"></div>
          <div className="size-1 rounded-full bg-blue-300/60"></div>
          <div className="size-1 rounded-full bg-yellow-300/60"></div>
        </div>
      </div>
    </div>
  );
};

// Course Card Component with unique course-focused design
const CourseCard = ({ course, index }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const itemRef = useRef(null);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 4;
    const tiltY = (relativeX - 0.5) * -4;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.96, .96, .96)`;
    setTransformStyle(newTransform);

    // Button hover effect
    if (hoverButtonRef.current) {
      const rect = hoverButtonRef.current.getBoundingClientRect();
      setCursorPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
    setHoverOpacity(0);
  };

  const handleMouseEnter = () => setHoverOpacity(1);

  useGSAP(() => {
    gsap.fromTo(
      itemRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: itemRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [index]);

  return (
    <div
      ref={itemRef}
      className="group relative h-96 overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 ease-out hover:border-violet-300/30 md:h-[50vh]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {/* Background Video */}
      <video
        src={`videos/feature-${((index % 5) + 1)}.mp4`}
        loop
        muted
        autoPlay
        className="absolute left-0 top-0 size-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30 transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/80 group-hover:to-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 flex size-full flex-col p-6">
        {/* Header Section */}
        <div className="mb-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-400 to-blue-400 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
              {course.category}
            </span>
            <div className="flex items-center space-x-2 rounded-md bg-black/50 px-2 py-1 text-xs text-blue-50 backdrop-blur-sm">
              <span>⏱</span>
              <span>{course.duration}</span>
            </div>
          </div>

          <h3 className="font-zentry text-xl font-bold uppercase leading-tight text-white drop-shadow-lg md:text-2xl">
            {course.title}
          </h3>
        </div>

        {/* Description */}
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-white drop-shadow-md md:text-base">
            {course.description}
          </p>
        </div>

        {/* Footer Section */}
        <div className="mt-6 space-y-4">
          {/* Price and Level */}
          <div className="flex items-end justify-between">
            <div className="rounded-lg bg-black/40 px-3 py-2 backdrop-blur-sm">
              <span className="text-2xl font-bold text-yellow-300 drop-shadow-md">{course.price}</span>
              <span className="ml-2 text-sm text-blue-100">USD</span>
            </div>
            <div className="rounded-lg bg-black/40 px-3 py-2 text-right backdrop-blur-sm">
              <div className="text-xs text-blue-100">Skill Level</div>
              <div className="text-sm font-medium text-white">{course.level}</div>
            </div>
          </div>

          {/* Enrollment Button */}
          <button
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-300/20 to-blue-300/20 p-[1px] transition-all duration-300 hover:from-violet-300/40 hover:to-blue-300/40"
          >
            <div className="relative flex items-center justify-center gap-2 rounded-xl bg-black/60 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-black/40">
              {/* Radial gradient hover effect */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 rounded-xl"
                style={{
                  opacity: hoverOpacity * 0.3,
                  background: `radial-gradient(200px circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(139, 92, 246, 0.3), transparent 70%)`,
                }}
              />
              <TiLocationArrow className="relative z-20 text-violet-300" />
              <span className="relative z-20 font-medium text-white">Enroll Now</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const CoursesContent = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const courses = [
    {
      id: 1,
      title: "AI Fundamentals",
      category: "Machine Learning",
      level: "Beginner",
      duration: "8 weeks",
      price: "$299",
      description: "Master the core concepts of artificial intelligence and machine learning with hands-on projects."
    },
    {
      id: 2,
      title: "Deep Neural Networks",
      category: "Deep Learning",
      level: "Intermediate",
      duration: "12 weeks",
      price: "$499",
      description: "Dive deep into neural network architectures and build sophisticated AI models."
    },
    {
      id: 3,
      title: "Computer Vision Mastery",
      category: "Computer Vision",
      level: "Advanced",
      duration: "10 weeks",
      price: "$599",
      description: "Learn to build AI systems that can see and interpret visual information."
    },
    {
      id: 4,
      title: "Natural Language Processing",
      category: "NLP",
      level: "Intermediate",
      duration: "9 weeks",
      price: "$449",
      description: "Build AI systems that understand and generate human language."
    },
    {
      id: 5,
      title: "Reinforcement Learning",
      category: "Machine Learning",
      level: "Advanced",
      duration: "11 weeks",
      price: "$549",
      description: "Train AI agents to make decisions and learn from their environment."
    },
    {
      id: 6,
      title: "AI Ethics & Governance",
      category: "Machine Learning",
      level: "Beginner",
      duration: "6 weeks",
      price: "$199",
      description: "Understand the ethical implications and governance of AI systems."
    }
  ];

  const filteredCourses = courses.filter(course => {
    const categoryMatch = selectedCategory === "All" || course.category === selectedCategory;
    const levelMatch = selectedLevel === "All" || course.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  return (
    <section className="min-h-screen bg-black py-24">
      <div className="container mx-auto px-6 md:px-10">
        <div className="mb-16 text-center">
          <h2 className="special-font mb-6 text-6xl font-black uppercase text-white md:text-7xl">
            Our <b className="text-violet-300">Courses</b>
          </h2>
          <p className="mx-auto max-w-2xl font-circular-web text-lg text-blue-50/80">
            Discover cutting-edge AI courses designed to transform your understanding and skills in artificial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filter Section */}
          <div className="lg:col-span-1">
            <FilterSection
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedLevel={selectedLevel}
              onLevelChange={setSelectedLevel}
            />
          </div>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesContent;
