import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CoursesPage from "./components/CoursesPage";
import AboutUsPage from "./components/AboutUsPage";
import UserDashboard from "./components/dashboard/UserDashboard";
import SingleCoursePage from "./components/SingleCoursePage";
import QuizListingPage from "./components/QuizListingPage";
import QuizTakingPage from "./components/QuizTakingPage";
import Yeab from "./components/profiles/yeab/Yeab";
import AuthModal from "./components/AuthModal";
import { useRouter } from "./hooks/useRouter";
import { useAuth } from "./contexts/AuthContext";
import { AuthModalProvider, useAuthModal } from "./contexts/AuthModalContext";

function AppContent() {
  const { currentPage, profileName, courseId, quizId } = useRouter();
  const { isAuthenticated } = useAuth();
  const { isOpen, mode, closeModal, handleSuccess } = useAuthModal();

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      {currentPage !== 'course' && currentPage !== 'quizzes' && currentPage !== 'quiz' && <NavBar />}
      {currentPage === 'home' ? (
        <>
          <Hero />
          <About />
          <Features />
          <Story />
          <Contact />
          <Footer />
        </>
      ) : currentPage === 'courses' ? (
        <>
          <CoursesPage />
          <Footer />
        </>
      ) : currentPage === 'about' ? (
        <>
          <AboutUsPage />
        </>
      ) : currentPage === 'dashboard' ? (
        <>
          {isAuthenticated ? (
            <UserDashboard />
          ) : (
            <>
              <NavBar />
              <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <div className="text-center">
                  <h1 className="mb-4 text-4xl font-bold">Authentication Required</h1>
                  <p className="mb-6 text-blue-300">You need to be logged in to access the dashboard.</p>
                  <button 
                    onClick={() => window.location.hash = 'home'}
                    className="rounded-lg bg-violet-300 px-6 py-2 text-black hover:bg-violet-400"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      ) : currentPage === 'course' ? (
        <>
          <SingleCoursePage courseId={courseId} />
        </>
      ) : currentPage === 'quizzes' ? (
        <>
          <QuizListingPage courseId={courseId} />
        </>
      ) : currentPage === 'quiz' ? (
        <>
          <QuizTakingPage courseId={courseId} quizId={quizId} />
        </>
      ) : currentPage === 'profile' ? (
        <>
          {profileName === 'yeab' ? (
            <Yeab />
          ) : (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
              <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold">Profile Not Found</h1>
                <p className="text-blue-300">The requested profile does not exist.</p>
              </div>
            </div>
          )}
          <Footer />
        </>
      ) : (
        <>
          <Hero />
          <About />
          <Features />
          <Story />
          <Contact />
          <Footer />
        </>
      )}

      {/* Centralized Auth Modal */}
      <AuthModal
        isOpen={isOpen}
        onClose={closeModal}
        initialMode={mode}
        onSuccess={handleSuccess}
      />
    </main>
  );
}

function App() {
  return (
    <AuthModalProvider>
      <AppContent />
    </AuthModalProvider>
  );
}

export default App;
