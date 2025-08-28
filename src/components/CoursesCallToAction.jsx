import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";

import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const CoursesCallToAction = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#courses-cta-clip",
        start: "center center",
        end: "+=600 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".courses-cta-mask", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div className="min-h-screen w-screen bg-blue-75">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5 px-5">
        <p className="font-general text-sm uppercase text-black/70 md:text-[10px]">
          Ready to Transform Your Career?
        </p>

        <AnimatedTitle
          title="Join th<b>o</b>usands of learners <br /> building the <b>f</b>uture with AI"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="max-w-md text-center">
          <p className="mb-4 font-circular-web text-lg text-black/80">
            Start your AI journey today and unlock limitless possibilities in the world of artificial intelligence.
          </p>
          <p className="text-gray-600">
            Get lifetime access to all courses, exclusive community, and personalized mentorship.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button
            id="start-learning-cta"
            title="Start Learning Now"
            leftIcon={<TiLocationArrow />}
            containerClass="bg-violet-300 text-white flex-center gap-2"
          />
          <Button
            id="view-curriculum"
            title="View Curriculum"
            containerClass="bg-yellow-300 text-black flex-center gap-2"
          />
        </div>
      </div>

      <div className="h-dvh w-screen" id="courses-cta-clip">
        <div className="courses-cta-mask absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl">
          <img
            src="img/contact-1.webp"
            alt="AI Learning Community"
            className="absolute left-0 top-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="mb-2 font-zentry text-2xl font-bold">Join Our Community</h3>
            <p className="text-sm opacity-90">Connect with fellow AI enthusiasts</p>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="bg-black py-24">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-violet-300">
                <span className="text-2xl font-bold text-white">∞</span>
              </div>
              <h3 className="mb-2 font-zentry text-xl font-bold text-white">Lifetime Access</h3>
              <p className="text-sm text-blue-50/80">Learn at your own pace with permanent access to all content</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-yellow-300">
                <span className="text-2xl font-bold text-black">★</span>
              </div>
              <h3 className="mb-2 font-zentry text-xl font-bold text-white">Expert Mentorship</h3>
              <p className="text-sm text-blue-50/80">Get guidance from industry professionals and AI researchers</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-300">
                <span className="text-2xl font-bold text-white">◆</span>
              </div>
              <h3 className="mb-2 font-zentry text-xl font-bold text-white">Real Projects</h3>
              <p className="text-sm text-blue-50/80">Build portfolio-worthy projects that demonstrate your skills</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesCallToAction;
