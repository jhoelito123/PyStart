import { useState } from 'react';
import Footer from '../../../components/ui/footer';
import Blog from '../components/Blog';
import Hero from '../components/hero';
import EducationLevelButtons from '../components/institucionals';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import SearchBar from '../../../components/ui/search';

const MainLayout = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="bg-[#FCFCFC] w-full flex flex-col items-center justify-center">
      <div className="mt-20 fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <SearchBar query={query} onChangeQuery={setQuery} />
      </div>
      <Hero />
      <EducationLevelButtons />
      <Testimonials />
      <Pricing />
      <Blog />
      <Footer />
    </div>
  );
};

export default MainLayout;
