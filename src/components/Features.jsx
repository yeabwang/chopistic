import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { usePageContent } from "../hooks/usePageContent";
import { useCourseData } from "../hooks/useCourseData";
import { useRouter } from "../hooks/useRouter";

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({ src, title, description, course }) => {
  const { navigateTo } = useRouter();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div className="relative size-full">
      <video
        src={src}
        loop
        muted
        autoPlay
        className="absolute left-0 top-0 size-full object-cover object-center"
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        <div className="flex items-end justify-between">
          {/* Enroll Now Button */}
          {course && (
            <button 
              onClick={() => navigateTo(`course/${course.id}`)}
              className="block w-fit"
            >
              <div
                ref={hoverButtonRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/90 transition-colors hover:text-white"
              >
                {/* Radial gradient hover effect */}
                <div
                  className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                  style={{
                    opacity: hoverOpacity,
                    background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
                  }}
                />
                <TiLocationArrow className="relative z-20" />
                <p className="relative z-20">Enroll Now</p>
              </div>
            </button>
          )}

          {/* Course Level and Duration */}
          {course && (
            <div className="text-right text-sm text-blue-100">
              Level - {course.level} | Duration - {course.duration}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const { content } = usePageContent('home');
  const { courses } = useCourseData();

  // Get first 4 courses for display
  const displayCourses = courses.slice(0, 4);

  return (
  <section className="bg-black pb-52">
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-5 py-32">
        <h1 className="special-font text-7xl uppercase leading-[.8] text-blue-50 sm:text-8xl md:text-[6rem]">
          <span dangerouslySetInnerHTML={{ __html: content?.features?.title || "<b> Learn AI with us</b>" }} />
        </h1>
        <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
          {content?.features?.description || "Immerse yourself in a rich and ever-expanding learning."}
        </p>
      </div>

      <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
        <BentoCard
          src={displayCourses[0]?.media || "videos/feature-1.mp4"}
          title={
            <span>{displayCourses[0]?.title || "Course 1"}</span>
          }
          description={displayCourses[0]?.description || "A cross-platform machine learning app, turning your activities across Web2 and Web3 worlds into a rewarding adventure."}
          course={displayCourses[0]}
        />
      </BentoTilt>

      <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
          <BentoCard
            src={displayCourses[1]?.media || "videos/feature-2.mp4"}
            title={
              <span>{displayCourses[1]?.title || "Course 2"}</span>
            }
            description={displayCourses[1]?.description || "An advanced and learning-inspired NFT collection - the AI primed for expansion."}
            course={displayCourses[1]}
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
          <BentoCard
            src={displayCourses[2]?.media || "videos/feature-3.mp4"}
            title={
              <span>{displayCourses[2]?.title || "Course 3"}</span>
            }
            description={displayCourses[2]?.description || "A intelligent social hub, adding a new dimension of learning to social interaction for Web3 communities."}
            course={displayCourses[2]}
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
          <BentoCard
            src={displayCourses[3]?.media || "videos/feature-4.mp4"}
            title={
              <span>{displayCourses[3]?.title || "Course 4"}</span>
            }
            description={displayCourses[3]?.description || "A cross-world AI Agent - elevating your learning to be more fun and productive."}
            course={displayCourses[3]}
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_2">
          <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
            <h1 className="bento-title special-font max-w-64 text-black">
              <span dangerouslySetInnerHTML={{ __html: content?.features?.comingSoon?.title || "M<b>o</b>re co<b>m</b>ing s<b>o</b>on." }} />
            </h1>

            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>

        <BentoTilt className="bento-tilt_2">
          <video
            src={content?.features?.additionalVideo || "videos/feature-5.mp4"}
            loop
            muted
            autoPlay
            className="size-full object-cover object-center"
          />
        </BentoTilt>
      </div>
    </div>
  </section>
);
};

export default Features;
