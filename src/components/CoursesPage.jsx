import CoursesHero from "./CoursesHero";
import CoursesContent from "./CoursesContent";

const CoursesPage = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <CoursesHero />
      <CoursesContent />
    </main>
  );
};

export default CoursesPage;
