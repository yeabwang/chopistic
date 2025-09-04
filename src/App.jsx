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
import Yeab from "./components/profiles/yeab/Yeab";
import { useRouter } from "./hooks/useRouter";

function App() {
  const { currentPage, profileName, courseId } = useRouter();

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      {currentPage !== 'course' && <NavBar />}
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
          <UserDashboard />
        </>
      ) : currentPage === 'course' ? (
        <>
          <SingleCoursePage courseId={courseId} />
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
    </main>
  );
}

export default App;
