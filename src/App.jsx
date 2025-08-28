import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CoursesPage from "./components/CoursesPage";
import { useRouter } from "./hooks/useRouter";

function App() {
  const { currentPage } = useRouter();

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
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
