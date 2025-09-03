import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";
import { usePageContent } from "../hooks/usePageContent";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { content } = usePageContent('home');

  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          {content?.about?.tagline || "Welcome to Chopistic Learning"}
        </p>

        <AnimatedTitle
          title={content?.about?.title || "Disc<b>o</b>ver the world's <br /> largest shared <b>l</b>earning"}
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p>{content?.about?.subtitle || "The Learning of Intelligence begins—your life, now an epic MMORPG"}</p>
          <p className="text-gray-500">
            {content?.about?.description || "Chopistic Learning unites every learner from countless courses and platforms, both digital and physical, into a unified Learning Economy"}
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src={content?.about?.backgroundImage || "img/about.webp"}
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
