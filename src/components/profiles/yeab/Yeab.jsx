import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef, useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

import Button from "../../Button";
import AnimatedTitle from "../../AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const FloatingCard = ({ children, className = "", delay = 0 }) => {
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.set(cardRef.current, { y: 0 });
    
    gsap.to(cardRef.current, {
      y: -10,
      duration: 2 + delay,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, [delay]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const element = cardRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((yPos - centerY) / centerY) * -8;
    const rotateY = ((xPos - centerX) / centerX) * 8;

    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      duration: 0.5,
      rotateX: 0,
      rotateY: 0,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

const SkillCard = ({ icon, title, description, technologies, delay = 0 }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const cardRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  useGSAP(() => {
    gsap.fromTo(cardRef.current, 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.8 
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: delay * 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          end: "bottom 20%",
        },
      }
    );
  }, [delay]);

  return (
    <FloatingCard delay={delay * 0.1} className="group relative">
      <div
        ref={cardRef}
        className="relative h-full overflow-hidden rounded-2xl border border-violet-300/20 bg-black/40 p-6 backdrop-blur-sm transition-all duration-500 hover:border-violet-300/40 hover:bg-black/60"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300"
          style={{
            opacity: hoverOpacity,
            background: `radial-gradient(200px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #5724ff22, transparent)`,
          }}
        />
        
        <div className="relative z-10">
          <div className="mb-4 text-4xl text-violet-300 transition-colors duration-300 group-hover:text-yellow-300">
            {icon}
          </div>
          
          <h3 className="special-font mb-3 text-xl text-white">
            {title}
          </h3>
          
          <p className="mb-4 font-general text-sm leading-relaxed text-blue-300/80">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs text-violet-300 transition-colors duration-300 hover:border-violet-300/40"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </FloatingCard>
  );
};

const StatCard = ({ value, label, delay = 0 }) => {
  const statRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);

  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      trigger: statRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.to({ value: 0 }, {
          value: parseInt(value),
          duration: 2,
          delay: delay * 0.1,
          ease: "power2.out",
          onUpdate: function() {
            setDisplayValue(Math.floor(this.targets()[0].value));
          }
        });
      }
    });

    return () => trigger.kill();
  }, [value, delay]);

  return (
    <div ref={statRef} className="group text-center">
      <div className="special-font mb-2 text-3xl text-yellow-300 transition-colors duration-300 group-hover:text-violet-300 md:text-4xl">
        {displayValue}{value.includes('+') ? '+' : ''}
      </div>
      <div className="font-general text-sm uppercase tracking-wider text-blue-300/60">
        {label}
      </div>
    </div>
  );
};

const Yeab = () => {
  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const threeDRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.log("Play failed:", e);
        });
      }
    }
  };

  useGSAP(() => {
    gsap.set(".hero-text", { opacity: 0, y: 50 });
    gsap.set(".hero-cta", { opacity: 0, y: 30 });

    const tl = gsap.timeline();
    
    tl.to(".hero-text", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out",
    })
    .to(".hero-cta", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    }, "-=0.6");

    gsap.fromTo(".about-paragraph", 
      { 
        opacity: 0, 
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-paragraph",
          start: "top 80%",
          end: "bottom 20%",
        },
      }
    );

    gsap.fromTo(".threejs-container", 
      { 
        opacity: 0, 
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: threeDRef.current,
          start: "top 90%",
          end: "bottom 10%",
          onEnter: () => {
            console.log("Entering Let's Dance section - starting music");
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.volume = 0.7;
              audioRef.current.play().then(() => {
                console.log("Music started successfully on scroll");
                setIsPlaying(true);
              }).catch(e => {
                console.log("Auto-play blocked by browser - setting up user interaction:", e);
                const enableAudio = () => {
                  console.log("User interaction detected - enabling audio");
                  audioRef.current.play().then(() => {
                    setIsPlaying(true);
                    console.log("Music enabled via user interaction");
                  });
                  document.removeEventListener('click', enableAudio);
                  document.removeEventListener('touchstart', enableAudio);
                  document.removeEventListener('scroll', enableAudio);
                };
                document.addEventListener('click', enableAudio, { once: true });
                document.addEventListener('touchstart', enableAudio, { once: true });
                document.addEventListener('scroll', enableAudio, { once: true });
              });
            }
          },
          onLeave: () => {
            console.log("Leaving Let's Dance section - pausing music");
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
            }
          },
          onEnterBack: () => {
            console.log("Re-entering Let's Dance section - resuming music");
            if (audioRef.current) {
              audioRef.current.play().then(() => {
                console.log("Music resumed successfully");
                setIsPlaying(true);
              }).catch(e => {
                console.log("Resume blocked by browser:", e);
              });
            }
          },
          onLeaveBack: () => {
            console.log("Leaving Let's Dance section upward - pausing music");
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
            }
          }
        },
      }
    );
  });

  const skills = [
    {
      icon: "🚀",
      title: "Frontend Development",
      description: "Building responsive and interactive user interfaces with modern frameworks and cutting-edge technologies.",
      technologies: ["React.js", "TypeScript", "Tailwind CSS", "Vite"]
    },
    {
      icon: "⚡",
      title: "Backend Architecture",
      description: "Developing scalable server-side solutions with robust APIs and database management.",
      technologies: ["Node.js", "Python", "Express.js", "REST APIs", "MongoDB"]
    },
    {
      icon: "🎨",
      title: "UI/UX Design",
      description: "Creating intuitive user experiences with attention to detail and modern design principles.",
      technologies: ["Figma", "Milnote", "Prototyping", "User Research", "Design Systems"]
    },
    {
      icon: "🤖",
      title: "AI & Machine Learning",
      description: "Implementing intelligent features using LLMs, generative AI, and modern ML frameworks.",
      technologies: ["TensorFlow", "LLM Integration", "MCP", "Langchain", "OpenAI"]
    }
  ];

  const stats = [
    { value: "30+", label: "Projects Completed" },
    { value: "3+", label: "Years Experience" },
    { value: "2", label: "Startups Founded" },
    { value: "∞", label: "Cups of Coffee" }
  ];

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-black text-blue-50">
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center px-5 md:px-10">
        <div className="max-w-4xl text-center">
          <div className="mb-16">
            <h1 className="special-font font-zentry text-7xl font-black text-blue-50 md:text-9xl">
              Hey there, I&apos;m{" "}
              <span className="text-violet-300">
                Yeab
              </span>
            </h1>
          </div>
          
          <div className="flex flex-row items-center justify-center gap-6">
            <Button
              title="View My Website"
              containerClass="min-w-[180px] bg-violet-300/10 backdrop-blur-sm border border-violet-300/30 text-violet-300 hover:bg-violet-300/20 hover:border-violet-300/50 transition-all duration-300"
              onClick={() => window.open('https://yeab.io/', '_blank')}
            />
          </div>
        </div>
      </section>

      <section ref={skillsRef} className="px-5 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-20 max-w-4xl text-center">
            <AnimatedTitle
              title="About <b>M</b>e"
              containerClass="mb-12"
            />
            <p className="mx-auto max-w-3xl font-general text-lg leading-relaxed text-blue-300/80">
              Hey there! I&apos;m Yeabsira Tesfaye (王夏雨), but let&apos;s keep it simple – call me Ye&apos;ab.
              I&apos;m the kind of person who gets genuinely excited about turning messy ideas into code and beautiful interfaces – I get crazy into new tech. Over the past four years, I&apos;ve been designing and building websites, webapps, and sometimes apps for clients around the world, occasionally wearing fancy titles like CTO and Product Development Manager (which basically means I get to boss around developers while pretending I know what I&apos;m doing).
              <br /><br />
              I&apos;ve co-founded a couple of companies – a software development and a travel booking platform – and turns out, persistence and loads and loads of caffeine can work wonders.
              These days, I&apos;m grinding through my Computer Science degree at BIT while diving deep into the rabbit hole of LLMs, Gen AI, MCP and so on. I love the feeling of &quot;I don&apos;t know shit&quot; every time I see amazing works of others.
              <br /><br />
              When I&apos;m not staring at screens or debugging code that worked perfectly fine five minutes ago, you&apos;ll find me with a good book, a thought-provoking podcast, or just vibing to some slow jazz and blues – my secret weapon for staying sane in this beautifully chaotic world of tech.
              I&apos;m all about crafting digital solutions that don&apos;t just work, but actually make people&apos;s lives a little bit easier. After all, what&apos;s the point of building something if it doesn&apos;t solve a real problem, right?
            </p>
          </div>

          <AnimatedTitle
            title="Skills <b>A</b>rsenal"
            containerClass="mb-16 text-center"
          />
          
          <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {skills.map((skill, index) => (
              <SkillCard
                key={index}
                icon={skill.icon}
                title={skill.title}
                description={skill.description}
                technologies={skill.technologies}
                delay={index}
              />
            ))}
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
                delay={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section ref={threeDRef} className="px-5 py-20 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <AnimatedTitle
            title="Let&apos;s <b>D</b>ance!"
            containerClass="mb-12"
          />
          
          <div className="relative mb-12 aspect-video overflow-hidden rounded-3xl p-4">
            <audio
              ref={audioRef}
              src="/videos/music.mp3"
              loop
              preload="auto"
              className="hidden"
            />
            
            <button
              onClick={toggleMusic}
              className="absolute right-4 top-4 z-10 flex size-12 items-center justify-center rounded-full border border-violet-300/30 bg-violet-300/20 text-lg text-violet-300 backdrop-blur-sm transition-all duration-300 hover:bg-violet-300/30 hover:text-yellow-300"
              title={isPlaying ? "Pause Music" : "Play Music"}
            >
              {isPlaying ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            
            <div className="flex h-full items-center justify-center">
              <div className="group relative">
                <img 
                  src="/videos/giphy.gif" 
                  alt="Dancing Character" 
                  className="size-full rounded-2xl object-contain shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          <div className="mb-12 flex justify-center gap-6">
            {[
              { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/yeabsira-tesfaye/", label: "LinkedIn" },
              { icon: <FaGithub />, href: "https://github.com/yeabwang", label: "GitHub" },
              { icon: <FaTwitter />, href: "https://x.com/wangyeab", label: "Twitter" },
              { icon: <FaInstagram />, href: "https://www.instagram.com/yeabwang/", label: "Instagram" },
            ].map((social, index) => (
              <FloatingCard key={index} delay={index * 0.1}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-12 items-center justify-center rounded-full border border-violet-300/30 text-violet-300 transition-all duration-300 hover:scale-110 hover:border-violet-300 hover:text-yellow-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              </FloatingCard>
            ))}
          </div>

          <div className="text-center">
            <Button
              title="Let&apos;s Connect"
              containerClass="bg-gradient-to-r from-violet-300 to-blue-300 hover:from-violet-400 hover:to-blue-400 text-black"
              onClick={() => window.open('https://yeab.io/', '_blank')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Yeab;
