import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import { useRouter } from "../hooks/useRouter";
import { useAuth } from "../contexts/AuthContext";
import { useAuthModal } from "../contexts/AuthModalContext";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Courses", href: "#courses" },
  { name: "About Us", href: "#about-us" },
  { name: "Contact", href: "#contact" }
];

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  // Auth context and modal
  const { user, logout, isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { currentPage, navigateTo } = useRouter();

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Handle navigation
  const handleNavigation = (item) => {
    if (item.name === "Home") {
      navigateTo("home");
    } else if (item.name === "Courses") {
      navigateTo("courses");
    } else if (item.name === "About Us") {
      navigateTo("about");
    } else {
      // For other items, navigate to home and then scroll to section
      if (currentPage !== "home") {
        navigateTo("home");
        setTimeout(() => {
          const element = document.getElementById(item.name.toLowerCase());
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        const element = document.getElementById(item.name.toLowerCase());
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center gap-7">
            <button onClick={() => navigateTo("home")}>
              <img src="/img/logo.png" alt="logo" className="w-10" />
            </button>
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item)}
                  className="nav-hover-btn"
                >
                  {item.name}
                </button>
              ))}
            </div>

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/videos/music.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>

            {/* Auth Buttons */}
            <div className="ml-6 flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-white/80">
                    Welcome, {user.name}
                  </span>
                  <button
                    onClick={() => navigateTo("dashboard")}
                    className="nav-hover-btn text-xs uppercase"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={logout}
                    className="nav-hover-btn text-xs uppercase"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openModal('login')}
                    className="nav-hover-btn text-xs uppercase"
                  >
                    Login
                  </button>
                  <Button
                    title="Sign Up"
                    containerClass="!px-5 !py-2 !text-xs"
                    onClick={() => openModal('signup')}
                  />
                </>
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
