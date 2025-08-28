import CoursesHero from "./CoursesHero";
import CoursesContent from "./CoursesContent";
import CoursesCallToAction from "./CoursesCallToAction";

const CoursesPage = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <CoursesHero />
      <CoursesContent />
      <CoursesCallToAction />
    </main>
  );
};

export default CoursesPage;
