import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import VideoPreview from "./VideoPreview";
import { usePageContent } from "../hooks/usePageContent";

gsap.registerPlugin(ScrollTrigger);

const CoursesHero = () => {
  const { content } = usePageContent('courses');
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = content?.hero?.videos?.total || 3;
  const nextVdRef = useRef(null);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setLoading(false);
    }
  }, [loadedVideos, totalVideos]);

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#courses-next-video", { visibility: "visible" });
        gsap.to("#courses-next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVdRef.current.play(),
        });
        gsap.from("#courses-current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    gsap.set("#courses-video-frame", {
      clipPath: "polygon(20% 0, 80% 0, 85% 85%, 15% 90%)",
      borderRadius: "0% 0% 35% 15%",
    });
    gsap.from("#courses-video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#courses-video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (index) => {
    if (!content?.hero?.videos) return `videos/feature-${index}.mp4`;
    const { basePath, format } = content.hero.videos;
    return `${basePath}${index}${format}`;
  };

  const handleExploreCoursesClick = () => {
    const coursesSection = document.getElementById('courses-grid');
    if (coursesSection) {
      coursesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div
        id="courses-video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-violet-300"
      >
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <VideoPreview>
              <div
                onClick={handleMiniVdClick}
                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
              >
                <video
                  ref={nextVdRef}
                  src={getVideoSrc((currentIndex % totalVideos) + 1)}
                  loop
                  muted
                  id="courses-current-video"
                  className="size-64 origin-center scale-150 object-cover object-center"
                  onLoadedData={handleVideoLoad}
                />
              </div>
            </VideoPreview>
          </div>

          <video
            ref={nextVdRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="courses-next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>

        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <div className="text-center">
            <h1 className="special-font hero-heading mb-5 text-blue-100">
              <span dangerouslySetInnerHTML={{ __html: content?.hero?.title || "Master <b>A</b>I" }} />
            </h1>

            <p className="mx-auto mb-8 max-w-md font-robert-regular text-blue-100">
              {content?.hero?.description || "Unlock your potential with our comprehensive AI courses designed for every skill level."}
            </p>

            <div className="flex justify-center">
              <Button
                id={content?.hero?.ctaButton?.id || "explore-courses"}
                title={content?.hero?.ctaButton?.text || "Explore Courses"}
                leftIcon={<TiLocationArrow />}
                containerClass="bg-yellow-300 flex-center gap-1"
                onClick={handleExploreCoursesClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesHero;
