import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

import Button from "./Button";
import AnimatedTitle from "./AnimatedTitle";
import { usePageContent } from "../hooks/usePageContent";
import { useTeamData } from "../hooks/useTeamData";

gsap.registerPlugin(ScrollTrigger);

//  Image Gallery Component
const ElegantImageGallery = ({ galleryImages, galleryContent }) => {
  const galleryRef = useRef(null);
  const imageRefs = useRef([]);

  useGSAP(() => {
    // entrance animation
    gsap.fromTo(
      imageRefs.current,
      { 
        opacity: 0, 
        y: 60,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  return (
    <div ref={galleryRef} className="relative">
      {/* Header */}
      <div className="mb-20 text-center">
        <p className="mb-8 font-general text-sm uppercase tracking-wider md:text-[10px]">
          {galleryContent?.tagline || "Default content"}
        </p>
        
        <AnimatedTitle
          title={galleryContent?.title || "Our Creative <br /> J<b>o</b>urney"}
          containerClass="mb-8 !text-black text-center"
        />

        <p className="mx-auto max-w-2xl font-robert-regular text-gray-500">
          {galleryContent?.description || "Default content."}
        </p>
      </div>

      {/* image grid - 2 per row */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {galleryImages.map((image, index) => (
          <div
            key={image.id}
            ref={(el) => (imageRefs.current[index] = el)}
            className="group relative overflow-hidden rounded-3xl border border-gray-200/60 bg-white/80 backdrop-blur-xl shadow-xl transition-all duration-700 hover:border-violet-300/50 hover:shadow-2xl hover:scale-[1.02]"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="size-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
            
            {/*  hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
            
            {/*  corner accent */}
            <div className="absolute right-4 top-4 size-3 bg-gradient-to-br from-violet-400 to-blue-400 opacity-0 transition-all duration-500 group-hover:opacity-100" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Team Member Profile Card
const TeamMemberProfile = ({ member, index }) => {
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  const handleCardClick = () => {
    if (member.profileRoute) {
      // For Yeab, use React component route
      if (member.name === "Yeab") {
        window.location.hash = member.profileRoute;
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        // For other team members, redirect to their HTML file in a new tab
        const profileUrl = `/${member.profileRoute}`;
        window.open(profileUrl, '_blank');
      }
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-8 backdrop-blur-xl transition-all duration-500 hover:border-violet-300/30 hover:bg-black/30 ${
        member.profileRoute ? 'cursor-pointer hover:scale-105' : ''
      }`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-blue-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      
      {/* Profile indicator for clickable cards */}
      {member.profileRoute && (
        <div className="absolute right-4 top-4 size-3 rounded-full bg-gradient-to-br from-violet-400 to-blue-400 opacity-0 transition-all duration-300 group-hover:opacity-100"></div>
      )}
      
      <div className="relative z-10 text-center">
        <div className="mx-auto mb-6 size-32 overflow-hidden rounded-full border-2 border-violet-300/30 p-1 transition-all duration-300 group-hover:border-violet-300/60">
          <img
            src={member.image}
            alt={member.name}
            className="size-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <h3 className="mb-2 font-zentry text-2xl font-bold uppercase text-white transition-colors duration-300 group-hover:text-violet-300">
          {member.name}
        </h3>
        <p className="mb-6 font-robert-regular text-blue-50/70 transition-colors duration-300 group-hover:text-blue-50">
          {member.title}
        </p>
        
        <div className="flex justify-center space-x-4">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-violet-600/20 hover:text-violet-300 hover:scale-110"
            >
              <FaLinkedin size={18} />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-blue-600/20 hover:text-blue-300 hover:scale-110"
            >
              <FaGithub size={18} />
            </a>
          )}
          {member.twitter && (
            <a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex size-10 items-center justify-center rounded-full bg-white/5 text-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-yellow-600/20 hover:text-yellow-300 hover:scale-110"
            >
              <FaTwitter size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const AboutUsTeam = () => {
  const { content } = usePageContent('about');
  const { teamData } = useTeamData();

  const teamMembers = teamData?.teamMembers || [];
  const galleryImages = teamData?.galleryImages || [];

  return (
    <div className="bg-black">
      {/* About Our Team Section */}
      <section className="relative pb-8 pt-32">
        <div className="container mx-auto px-6 md:px-10">
          <div className="relative mb-20 text-center">
            <p className="mb-8 font-general text-sm uppercase tracking-wider text-blue-50/60 md:text-xs">
              {content?.aboutTeam?.tagline || "Default content"}
            </p>
            
            <AnimatedTitle
              title={content?.aboutTeam?.title || "About Our <br /> T<b>e</b>am"}
              containerClass="mb-16"
            />

            <div className="mx-auto max-w-4xl space-y-6">
              {content?.aboutTeam?.descriptions?.map((description, index) => (
                <p key={index} className="font-robert-regular text-lg leading-relaxed text-blue-50/80">
                  {description}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* stat */}
      <section className="relative py-16">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {(content?.stats || []).map((stat, index) => {
              const getStatCardClasses = (color) => {
                switch(color) {
                  case 'violet':
                    return "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-300/10 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:border-violet-300/30";
                  case 'blue':
                    return "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-300/10 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:border-blue-300/30";
                  case 'yellow':
                    return "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-yellow-300/10 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:border-yellow-300/30";
                  default:
                    return "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-300/10 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:border-violet-300/30";
                }
              };

              const getOverlayClasses = (color) => {
                switch(color) {
                  case 'violet':
                    return "absolute inset-0 bg-gradient-to-br from-violet-300/5 to-blue-300/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100";
                  case 'blue':
                    return "absolute inset-0 bg-gradient-to-br from-blue-300/5 to-violet-300/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100";
                  case 'yellow':
                    return "absolute inset-0 bg-gradient-to-br from-yellow-300/5 to-violet-300/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100";
                  default:
                    return "absolute inset-0 bg-gradient-to-br from-violet-300/5 to-blue-300/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100";
                }
              };

              const getTextClasses = (color) => {
                switch(color) {
                  case 'violet':
                    return "mb-4 text-5xl font-black text-violet-300";
                  case 'blue':
                    return "mb-4 text-5xl font-black text-blue-300";
                  case 'yellow':
                    return "mb-4 text-5xl font-black text-yellow-300";
                  default:
                    return "mb-4 text-5xl font-black text-violet-300";
                }
              };

              return (
                <div key={index} className={getStatCardClasses(stat.color)}>
                  <div className={getOverlayClasses(stat.color)}></div>
                  <div className="relative z-10 text-center">
                    <div className={getTextClasses(stat.color)}>{stat.number}</div>
                    <h3 className="mb-2 font-general text-xl font-bold uppercase text-white">{stat.title}</h3>
                    <p className="font-robert-regular text-sm text-blue-50/70">{stat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6 md:px-10">
          <div className="mb-20 text-center">
            <p className="mb-8 font-general text-sm uppercase tracking-wider text-blue-50/60 md:text-xs">
              {content?.journey?.tagline || "Default content"}
            </p>
            
            <AnimatedTitle
              title={content?.journey?.title || "Default content"}
              containerClass="mb-8"
            />
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-violet-300 via-blue-300 to-yellow-300 md:block"></div>
            
            {/* Journey Steps */}
            <div className="space-y-16">
              {(content?.journey?.steps || []).map((step, index) => {
                const getStepCardClasses = (color) => {
                  switch(color) {
                    case 'violet':
                      return "group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/30 to-blue-900/30 p-8 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:border-violet-300/30";
                    case 'blue':
                      return "group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/30 to-violet-900/30 p-8 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:border-blue-300/30";
                    case 'yellow':
                      return "group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-900/30 to-violet-900/30 p-8 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:border-yellow-300/30";
                    default:
                      return "group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/30 to-blue-900/30 p-8 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:border-violet-300/30";
                  }
                };

                const getStepOverlayClasses = (color) => {
                  switch(color) {
                    case 'violet':
                      return "absolute inset-0 bg-gradient-to-br from-violet-600/10 to-blue-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100";
                    case 'blue':
                      return "absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100";
                    case 'yellow':
                      return "absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-violet-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100";
                    default:
                      return "absolute inset-0 bg-gradient-to-br from-violet-600/10 to-blue-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100";
                  }
                };

                const getStepTextClasses = (color) => {
                  switch(color) {
                    case 'violet':
                      return "text-sm font-general uppercase tracking-wider text-violet-300";
                    case 'blue':
                      return "text-sm font-general uppercase tracking-wider text-blue-300";
                    case 'yellow':
                      return "text-sm font-general uppercase tracking-wider text-yellow-300";
                    default:
                      return "text-sm font-general uppercase tracking-wider text-violet-300";
                  }
                };

                const getStepCircleClasses = (color) => {
                  switch(color) {
                    case 'violet':
                      return "absolute left-1/2 -translate-x-1/2 size-4 rounded-full bg-violet-300 border-4 border-black hidden md:block";
                    case 'blue':
                      return "absolute left-1/2 -translate-x-1/2 size-4 rounded-full bg-blue-300 border-4 border-black hidden md:block";
                    case 'yellow':
                      return "absolute left-1/2 -translate-x-1/2 size-4 rounded-full bg-yellow-300 border-4 border-black hidden md:block";
                    default:
                      return "absolute left-1/2 -translate-x-1/2 size-4 rounded-full bg-violet-300 border-4 border-black hidden md:block";
                  }
                };

                const isLeft = step.position === 'left';

                return (
                  <div key={index} className="relative flex flex-col md:flex-row items-center">
                    <div className={`md:w-1/2 md:pr-12 mb-8 md:mb-0 ${isLeft ? '' : 'order-2 md:order-1'}`}>
                      {isLeft ? (
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/30 to-violet-900/30 p-8 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:border-blue-300/30">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                          <div className="relative z-10">
                            <div className="mb-4 text-4xl">{step.icon}</div>
                            <div className={getStepTextClasses(step.color)}>{step.phase}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-right">
                          <h3 className="mb-4 font-zentry text-2xl font-bold uppercase text-white">{step.title}</h3>
                          <p className="font-circular-web text-lg text-blue-50/80 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className={getStepCircleClasses(step.color)}></div>
                    <div className={`md:w-1/2 md:pl-12 ${isLeft ? '' : 'order-1 md:order-2'}`}>
                      {isLeft ? (
                        <div>
                          <h3 className="mb-4 font-zentry text-2xl font-bold uppercase text-white">{step.title}</h3>
                          <p className="font-circular-web text-lg text-blue-50/80 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      ) : (
                        <div className={getStepCardClasses(step.color)}>
                          <div className={getStepOverlayClasses(step.color)}></div>
                          <div className="relative z-10">
                            <div className="mb-4 text-4xl">{step.icon}</div>
                            <div className={getStepTextClasses(step.color)}>{step.phase}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section*/}
      <section className="relative py-40">
        {/* Visual transition - top gradient */}
        <div className="absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black via-black/80 to-transparent"></div>
        
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-violet-50 py-32">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.03)_1px,transparent_0)] bg-[length:40px_40px] opacity-50"></div>
          
          <div className="container relative z-10 mx-auto px-6 md:px-10">
            <ElegantImageGallery galleryImages={galleryImages} galleryContent={content?.gallery} />
          </div>
        </div>
        
        <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </section>

      {/* Team Members Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6 md:px-10">
          <div className="mb-20 text-center">
            <p className="mb-8 font-general text-sm uppercase tracking-wider text-blue-50/60 md:text-xs">
              {content?.team?.tagline || "Default content"}
            </p>
            
            <AnimatedTitle
              title={content?.team?.title || "Default content"}
              containerClass="mb-8"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <TeamMemberProfile key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6 md:px-10">
          <div className="text-center">
            <p className="mb-8 font-general text-sm uppercase tracking-wider text-blue-50/60 md:text-xs">
              {content?.cta?.tagline || "Default content"}
            </p>

            <AnimatedTitle
              title={content?.cta?.title || "Start Your AI <br /> L<b>e</b>arning Journey"}
              containerClass="mb-16"
            />

            <div className="flex justify-center">
              <Button
                id={content?.cta?.ctaButton?.id || "start-journey-cta"}
                title={content?.cta?.ctaButton?.text || "Default content"}
                leftIcon={<TiLocationArrow />}
                containerClass="bg-yellow-300 flex-center gap-1"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsTeam;
