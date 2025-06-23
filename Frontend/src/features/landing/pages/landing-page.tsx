import Footer from '../../../components/ui/footer';
import Blog from '../components/Blog';
import Hero from '../components/hero';
import EducationLevelButtons from '../components/institucionals';
import Pricing from '../components/Pricing';

const MainLayout = () => {
  return (
    <div className="bg-[#FCFCFC] w-full flex flex-col items-center justify-center">
      <Hero />
      <EducationLevelButtons />
      <Pricing />
      <Blog />
      <Footer />
    </div>
  );
};

export default MainLayout;
