import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiX, FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi";
import { FaGoogle, FaApple, FaGithub } from "react-icons/fa";

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const contentRef = useRef(null);

  // Sync internal mode state with initialMode prop
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useGSAP(() => {
    if (isOpen) {
      // Set initial states
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { 
        scale: 0.7, 
        opacity: 0, 
        y: 100,
        rotationX: -15
      });

      // Backdrop animation
      gsap.to(backdropRef.current, { 
        opacity: 1, 
        duration: 0.4, 
        ease: "power2.out" 
      });

      // Modal content animation with more sophisticated easing
      gsap.to(contentRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.6,
        ease: "back.out(1.4)",
        delay: 0.1
      });

      // Stagger animation for form elements
      gsap.fromTo(
        contentRef.current.querySelectorAll('.auth-form-element'),
        { 
          opacity: 0, 
          y: 30,
          scale: 0.9
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3
        }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    // Exit animations
    gsap.to(contentRef.current, {
      scale: 0.7,
      opacity: 0,
      y: -50,
      rotationX: 15,
      duration: 0.4,
      ease: "power2.in",
    });
    
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      delay: 0.1,
      onComplete: () => {
        onClose();
        // Reset form data on close
        setFormData({
          email: "",
          password: "",
          name: "",
          confirmPassword: "",
        });
        setShowPassword(false);
      },
    });
  };

  const switchMode = (newMode) => {
    gsap.to(contentRef.current, {
      x: -20,
      opacity: 0.7,
      duration: 0.2,
      ease: "power2.inOut",
      onComplete: () => {
        setMode(newMode);
        gsap.to(contentRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.2,
          ease: "power2.inOut",
        });
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log(`${mode} submitted:`, formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center p-0 sm:p-6 md:p-8"
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative w-full h-full sm:h-auto sm:max-w-md sm:m-auto sm:max-h-[90vh] overflow-y-auto sm:rounded-2xl border-0 sm:border border-white/20 bg-black/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
        style={{
          background: "linear-gradient(135deg, rgba(139, 69, 255, 0.15) 0%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/30 p-3 text-white/80 transition-all duration-200 hover:bg-black/50 hover:text-white hover:scale-110 sm:bg-transparent sm:p-2"
        >
          <FiX size={24} className="sm:hidden" />
          <FiX size={20} className="hidden sm:block" />
        </button>

        {/* Header */}
        <div className="auth-form-element mb-8 mt-12 sm:mt-0 text-center">
          <h2 className="special-font mb-2 text-3xl sm:text-3xl font-black font-zentry text-white">
            <b>{mode === "login" ? "Welcome Back" : "Join Zentry"}</b>
          </h2>
          <p className="text-sm font-general text-white/70">
            {mode === "login"
              ? "Enter your credentials to access your account"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Social Login */}
        <div className="auth-form-element mb-6">
          <div className="mb-4 grid grid-cols-3 gap-3">
            {[
              { icon: FaGoogle, label: "Google" },
              { icon: FaApple, label: "Apple" },
              { icon: FaGithub, label: "GitHub" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="group flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/10"
              >
                <Icon className="text-white/80 transition-colors duration-200 group-hover:text-white" size={20} />
              </button>
            ))}
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black/20 px-4 font-general text-white/60">or continue with email</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form-element space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full border border-white/10 bg-white/5 rounded-xl py-4 pl-12 pr-4 text-white font-general transition-all duration-300 placeholder:text-white/50 focus:border-violet-400/50 focus:bg-white/10 focus:outline-none"
                required={mode === "signup"}
              />
            </div>
          )}

          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full border border-white/10 bg-white/5 rounded-xl py-4 pl-12 pr-4 text-white font-general transition-all duration-300 placeholder:text-white/50 focus:border-violet-400/50 focus:bg-white/10 focus:outline-none"
              required
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full border border-white/10 bg-white/5 rounded-xl py-4 px-12 text-white font-general placeholder:text-white/50 transition-all duration-300 focus:border-violet-400/50 focus:bg-white/10 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition-colors duration-200 hover:text-white"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {mode === "signup" && (
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="w-full border border-white/10 bg-white/5 rounded-xl py-4 pl-12 pr-4 text-white font-general transition-all duration-300 placeholder:text-white/50 focus:border-violet-400/50 focus:bg-white/10 focus:outline-none"
                required={mode === "signup"}
              />
            </div>
          )}

          {mode === "login" && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-general text-violet-400 transition-colors duration-200 hover:text-violet-300"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-form-element group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 font-medium font-general text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/25"
          >
            <span className="relative inline-flex overflow-hidden">
              <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                {mode === "login" ? "Sign In" : "Create Account"}
              </div>
              <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                {mode === "login" ? "Sign In" : "Create Account"}
              </div>
            </span>
          </button>
        </form>

        {/* Mode Switch */}
        <div className="auth-form-element mt-6 text-center">
          <p className="text-sm font-general text-white/60">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="ml-2 font-medium text-violet-400 transition-colors duration-200 hover:text-violet-300"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
