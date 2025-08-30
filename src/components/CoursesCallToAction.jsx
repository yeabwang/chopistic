import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useRef } from "react";

import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const CoursesCallToAction = () => {
  const floatingElementsRef = useRef([]);
  const mainContentRef = useRef(null);
  const statsRef = useRef([]);

  useGSAP(() => {
    // Elegant entrance animation for main content
    gsap.fromTo(
      mainContentRef.current,
      { 
        opacity: 0,
        y: 60,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: mainContentRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Floating background elements animation
    floatingElementsRef.current.forEach((el, index) => {
      if (el) {
        gsap.to(el, {
          y: "random(-30, 30)",
          x: "random(-20, 20)",
          rotation: "random(-15, 15)",
          duration: "random(4, 8)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.5,
        });
      }
    });

    // Stats counter animation
    statsRef.current.forEach((stat, index) => {
      if (stat) {
        gsap.fromTo(
          stat,
          { 
            opacity: 0,
            y: 40,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: stat,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });
  });

  const stats = [
    { number: "10K+", label: "Active Learners", color: "violet" },
    { number: "95%", label: "Success Rate", color: "blue" },
    { number: "24/7", label: "Support", color: "yellow" },
    { number: "50+", label: "Expert Mentors", color: "violet" }
  ];

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-50">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (floatingElementsRef.current[i] = el)}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
            }}
          >
            <div className="size-full rounded-full bg-gradient-to-br from-violet-300 to-blue-300"></div>
          </div>
        ))}
      </div>

      {/* Main Content Container */}
      <div 
        ref={mainContentRef}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-32 md:px-10"
      >
        {/* Header Section */}
        <div className="mb-20 text-center">
          <p className="mb-8 font-general text-sm uppercase tracking-wider md:text-[10px]">
            transform your future
          </p>
          
          <AnimatedTitle
            title="Ready to L<b>e</b>ad the <br /> AI Rev<b>o</b>lution?"
            containerClass="mb-12 !text-black text-center"
          />

          <div className="mx-auto max-w-3xl">
            <p className="mb-6 font-robert-regular text-xl leading-relaxed text-gray-800">
              Join thousands of professionals who are already shaping the future with AI. 
              Start your transformative learning journey today.
            </p>
            <p className="font-robert-regular text-lg text-gray-600">
              Comprehensive curriculum • Expert mentorship • Lifetime access • Real-world projects
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-20 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              ref={(el) => (statsRef.current[index] = el)}
              className={`group relative overflow-hidden rounded-2xl border bg-white p-6 text-center shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                stat.color === 'violet' ? 'border-violet-300/30 hover:border-violet-300' :
                stat.color === 'blue' ? 'border-blue-300/30 hover:border-blue-300' :
                'border-yellow-300/30 hover:border-yellow-300'
              }`}
            >
              <div className={`mb-2 text-3xl font-black ${
                stat.color === 'violet' ? 'text-violet-300' :
                stat.color === 'blue' ? 'text-blue-300' :
                'text-yellow-300'
              }`}>
                {stat.number}
              </div>
              <p className="font-general text-sm font-medium uppercase tracking-wider text-gray-700">
                {stat.label}
              </p>
              
              {/* Subtle glow effect */}
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10 ${
                stat.color === 'violet' ? 'bg-gradient-to-br from-violet-300 to-transparent' :
                stat.color === 'blue' ? 'bg-gradient-to-br from-blue-300 to-transparent' :
                'bg-gradient-to-br from-yellow-300 to-transparent'
              }`}></div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Button
            id="start-learning-primary"
            title="Start Learning Today"
            leftIcon={<TiLocationArrow />}
            containerClass="bg-violet-300 flex-center gap-1"
          />
          <Button
            id="explore-curriculum"
            title="Explore Curriculum"
            containerClass="bg-yellow-300 flex-center gap-1"
          />
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          <div className="group text-center">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border-2 border-violet-300 bg-violet-50 transition-all duration-500 group-hover:scale-110 group-hover:bg-violet-100">
              <div className="text-3xl font-black text-violet-300">∞</div>
            </div>
            <h3 className="mb-3 font-general text-lg font-bold uppercase text-gray-800">
              Lifetime Access
            </h3>
            <p className="font-robert-regular text-gray-600">
              Learn at your pace with permanent access to all courses, updates, and new content
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border-2 border-blue-300 bg-blue-50 transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-100">
              <div className="text-3xl font-black text-blue-300">◆</div>
            </div>
            <h3 className="mb-3 font-general text-lg font-bold uppercase text-gray-800">
              Expert Mentorship
            </h3>
            <p className="font-robert-regular text-gray-600">
              Get personalized guidance from industry professionals and AI research leaders
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border-2 border-yellow-300 bg-yellow-50 transition-all duration-500 group-hover:scale-110 group-hover:bg-yellow-100">
              <div className="text-3xl font-black text-yellow-300">★</div>
            </div>
            <h3 className="mb-3 font-general text-lg font-bold uppercase text-gray-800">
              Real Projects
            </h3>
            <p className="font-robert-regular text-gray-600">
              Build impressive portfolio projects that demonstrate your AI expertise to employers
            </p>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-100/50 to-transparent"></div>
    </div>
  );
};

export default CoursesCallToAction;
