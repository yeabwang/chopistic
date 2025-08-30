import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

import Button from "./Button";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

// Elegant Image Gallery Component
const ElegantImageGallery = () => {
  const galleryRef = useRef(null);
  const imageRefs = useRef([]);
  
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop",
      alt: "Team collaboration"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop",
      alt: "Team workshop"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=800&fit=crop",
      alt: "Modern workspace"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=800&fit=crop",
      alt: "Strategic planning"
    }
  ];

  useGSAP(() => {
    // Simple, elegant entrance animation
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
      {/* Header matching home page style */}
      <div className="mb-20 text-center">
        <p className="mb-8 font-general text-sm uppercase tracking-wider md:text-[10px]">
          behind the scenes
        </p>
        
        <AnimatedTitle
          title="Our Creative <br /> J<b>o</b>urney"
          containerClass="mb-8 !text-black text-center"
        />

        <p className="mx-auto max-w-2xl font-robert-regular text-gray-500">
          Moments of innovation, collaboration, and growth as we build the future of AI education.
        </p>
      </div>

      {/* Large image grid - 2 per row */}
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
            
            {/* Elegant hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
            
            {/* Subtle corner accent */}
            <div className="absolute right-4 top-4 h-3 w-3 bg-gradient-to-br from-violet-400 to-blue-400 opacity-0 transition-all duration-500 group-hover:opacity-100" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
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
        // Scroll to top when navigating to profile
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
        <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-br from-violet-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
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
  const teamMembers = [
    {
      id: 1,
      name: "Yeab",
      title: "Founder & Full-Stack Developer",
      image: "/img/team/yeab.jpg",
      linkedin: "https://www.linkedin.com/in/yeabsira-tesfaye/",
      github: "https://github.com/yeabwang",
      twitter: "https://x.com/wangyeab",
      profileRoute: "profile/yeab"
    },
    {
      id: 2,
      name: "Eric Bilyk",
      title: "Programmer & Problem Solver",
      image: "/img/team/eric/profile.jpg",
      linkedin: "https://linkedin.com/in/yourusername",
      github: "https://github.com/TheGrayColour",
      twitter: "https://twitter.com/ericbilyk",
      profileRoute: "profiles/eric/index.html"
    },
    {
      id: 3,
      name: "Hamza",
      title: "Team Leader & Designer",
      image: "/img/team/hamza/profile.jpg",
      linkedin: "https://linkedin.com/in/hamza-profile",
      github: "https://github.com/hamza-username",
      twitter: "https://twitter.com/hamza-handle",
      profileRoute: "profiles/hamza/index.html"
    },
    {
      id: 4,
      name: "Daniel Reinhart Gunawan",
      title: "Designer & Critical Thinker",
      image: "/img/team/daniel/profile.jpg",
      linkedin: "https://linkedin.com/in/daniel-gunawan",
      github: "https://github.com/daniel-gunawan",
      twitter: "https://twitter.com/daniel-gunawan",
      profileRoute: "profiles/daniel/index.html"
    },
    {
      id: 5,
      name: "Gutsi",
      title: "Student & Problem Solver",
      image: "/img/team/gutsi/profile.jpg",
      linkedin: "https://linkedin.com/in/gutsi",
      github: "https://github.com/gutsi",
      twitter: "https://twitter.com/gutsi",
      profileRoute: "profiles/gutsi/index.html"
    },
    {
      id: 6,
      name: "Sarah Khalfi",
      title: "UI/UX Designer & Project Lead",
      image: "/img/team/sarah/profile.jpg",
      linkedin: "https://linkedin.com/in/sarah-khalfi",
      github: "https://github.com/sarah-khalfi",
      twitter: "https://twitter.com/sarah-khalfi",
      profileRoute: "profiles/sarah/index.html"
    }
  ];

  return (
    <div className="bg-black">
      {/* About Our Team Section */}
      <section className="relative pb-8 pt-32">
        <div className="container mx-auto px-6 md:px-10">
          <div className="relative mb-20 text-center">
            <p className="mb-8 font-general text-sm uppercase tracking-wider text-blue-50/60 md:text-xs">
              the minds behind innovation
            </p>
            
            <AnimatedTitle
              title="About Our <br /> T<b>e</b>am"
              containerClass="mb-16"
            />

            <div className="mx-auto max-w-4xl space-y-6">
              <p className="font-robert-regular text-lg leading-relaxed text-blue-50/80">
                At Chopistic Learning, we believe that the future of education lies at the intersection of human creativity and artificial intelligence. Our diverse team of educators, technologists, and visionaries work tirelessly to create transformative learning experiences that bridge the gap between complex AI concepts and practical, real-world applications.
              </p>
              <p className="font-robert-regular text-lg leading-relaxed text-blue-50/80">
                From AI researchers pushing the boundaries of machine learning to designers crafting intuitive user experiences, every member of our team contributes to our mission of democratizing AI education and empowering learners worldwide. Our collaborative approach combines decades of industry experience with cutting-edge research, ensuring that our educational content remains both academically rigorous and practically relevant.
              </p>
              <p className="font-robert-regular text-lg leading-relaxed text-blue-50/80">
                What sets us apart is our commitment to making artificial intelligence accessible to learners at every level. Whether you&apos;re a complete beginner taking your first steps into the world of AI, or an experienced professional looking to expand your expertise, our team creates personalized learning paths that adapt to your unique goals and learning style. We believe that everyone deserves the opportunity to understand and harness the power of AI to transform their careers and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Stats & Values Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Stat Card 1 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-300/10 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:border-violet-300/30">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-300/5 to-blue-300/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10 text-center">
                <div className="mb-4 text-5xl font-black text-violet-300">50+</div>
                <h3 className="mb-2 font-general text-xl font-bold uppercase text-white">Years Combined</h3>
                <p className="font-robert-regular text-sm text-blue-50/70">Experience in AI and Education</p>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-300/10 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:border-blue-300/30">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300/5 to-violet-300/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10 text-center">
                <div className="mb-4 text-5xl font-black text-blue-300">10K+</div>
                <h3 className="mb-2 font-general text-xl font-bold uppercase text-white">Students Taught</h3>
                <p className="font-robert-regular text-sm text-blue-50/70">Across Global Platforms</p>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-yellow-300/10 to-transparent p-8 backdrop-blur-sm transition-all duration-500 hover:border-yellow-300/30">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/5 to-violet-300/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10 text-center">
                <div className="mb-4 text-5xl font-black text-yellow-300">15+</div>
                <h3 className="mb-2 font-general text-xl font-bold uppercase text-white">Countries</h3>
                <p className="font-robert-regular text-sm text-blue-50/70">Where Our Team Resides</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Timeline Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6 md:px-10">
          <div className="mb-20 text-center">
            <p className="mb-8 font-general text-sm uppercase tracking-wider text-blue-50/60 md:text-xs">
              our journey
            </p>
            
            <AnimatedTitle
              title="How We <br /> W<b>o</b>rk Together"
              containerClass="mb-8"
            />
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-violet-300 via-blue-300 to-yellow-300 transform -translate-x-1/2 hidden md:block"></div>
            
            {/* Journey Steps */}
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 order-2 md:order-1">
                  <div className="text-right">
                    <h3 className="mb-4 font-zentry text-2xl font-bold uppercase text-white">Research & Innovation</h3>
                    <p className="font-circular-web text-lg text-blue-50/80 leading-relaxed">
                      Our AI researchers explore cutting-edge technologies and methodologies to identify the most effective learning approaches for complex AI concepts.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 size-4 rounded-full bg-violet-300 border-4 border-black hidden md:block"></div>
                <div className="md:w-1/2 md:pl-12 order-1 md:order-2">
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/30 to-blue-900/30 p-8 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:border-violet-300/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-blue-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                      <div className="mb-4 text-4xl">🔬</div>
                      <div className="text-sm font-general uppercase tracking-wider text-violet-300">Phase 01</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/30 to-violet-900/30 p-8 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:border-blue-300/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                      <div className="mb-4 text-4xl">🎨</div>
                      <div className="text-sm font-general uppercase tracking-wider text-blue-300">Phase 02</div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 size-4 rounded-full bg-blue-300 border-4 border-black hidden md:block"></div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="mb-4 font-zentry text-2xl font-bold uppercase text-white">Design & Experience</h3>
                  <p className="font-circular-web text-lg text-blue-50/80 leading-relaxed">
                    Our design team crafts intuitive and engaging user experiences, ensuring that complex AI concepts are accessible and enjoyable to learn.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 order-2 md:order-1">
                  <div className="text-right">
                    <h3 className="mb-4 font-zentry text-2xl font-bold uppercase text-white">Development & Testing</h3>
                    <p className="font-circular-web text-lg text-blue-50/80 leading-relaxed">
                      Our engineering team builds robust, scalable platforms while our educators test and refine content to ensure maximum learning impact.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 size-4 rounded-full bg-yellow-300 border-4 border-black hidden md:block"></div>
                <div className="md:w-1/2 md:pl-12 order-1 md:order-2">
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-900/30 to-violet-900/30 p-8 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:border-yellow-300/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-violet-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                      <div className="mb-4 text-4xl">⚡</div>
                      <div className="text-sm font-general uppercase tracking-wider text-yellow-300">Phase 03</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section - Full Width with White Background */}
      <section className="relative py-40">
        {/* Visual transition - top gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/80 to-transparent z-10"></div>
        
        {/* White background container */}
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-violet-50 py-32">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.03)_1px,transparent_0)] bg-[length:40px_40px] opacity-50"></div>
          
          <div className="container relative z-10 mx-auto px-6 md:px-10">
            <ElegantImageGallery />
          </div>
        </div>
        
        {/* Visual transition - bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
      </section>

      {/* Team Members Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6 md:px-10">
          <div className="mb-20 text-center">
            <p className="mb-8 font-general text-sm uppercase tracking-wider text-blue-50/60 md:text-xs">
              meet the experts
            </p>
            
            <AnimatedTitle
              title="Our L<b>e</b>ading <br /> Experts"
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
              Ready to transform your career?
            </p>

            <AnimatedTitle
              title="Start Your AI <br /> L<b>e</b>arning Journey"
              containerClass="mb-16"
            />

            <div className="flex justify-center">
              <Button
                id="start-journey-cta"
                title="Explore Courses"
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
