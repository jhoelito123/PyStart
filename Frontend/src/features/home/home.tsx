import Footer from '../../components/ui/footer';
import SearchBar from '../../components/ui/search';
import Blog from '../landing/components/Blog';
import Hero from '../landing/components/hero';
import EducationLevelButtons from '../landing/components/institucionals';
import Pricing from '../landing/components/Pricing';

export const Home = () => {
  return (
    <main className="w-full flex flex-col items-center justify-center">
      <div className="bg-[#FCFCFC] w-full flex flex-col items-center justify-center">
        <Hero />
        <EducationLevelButtons />
        <Pricing />
        <Blog />
        <Footer />
      </div>
    </main>
  );
};
