import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import StatsBar from '@/components/landing/StatsBar';
import CalorieEngine from '@/components/landing/CalorieEngine';
import MuscleMapSection from '@/components/landing/MuscleMapSection';
import CalorieLoggingSection from '@/components/landing/CalorieLoggingSection';
import RyznTagSection from '@/components/landing/RyznTagSection';
import ShareCards from '@/components/landing/ShareCards';
import WildcatsBanner from '@/components/landing/WildcatsBanner';
import { useIsWildcats } from '@/hooks/useIsWildcats';

import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

const Index = () => {
  const isWildcats = useIsWildcats();
  return (
    <div className={`min-h-screen bg-bg-primary text-foreground ${isWildcats ? 'pt-11' : ''}`}>
      {isWildcats && <WildcatsBanner />}
      <Navbar />
      <Hero />
      <StatsBar />
      <CalorieEngine />
      <MuscleMapSection />
      <CalorieLoggingSection />
      <RyznTagSection />
      <ShareCards />

      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
