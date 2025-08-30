import AboutUsHero from "./AboutUsHero";
import AboutUsTeam from "./AboutUsTeam";
import Footer from "./Footer";

const AboutUsPage = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <AboutUsHero />
      <AboutUsTeam />
      <Footer />
    </main>
  );
};

export default AboutUsPage;
