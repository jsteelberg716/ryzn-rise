import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import StatsBar from '@/components/landing/StatsBar';
import CalorieEngine from '@/components/landing/CalorieEngine';
import MuscleMapSection from '@/components/landing/MuscleMapSection';
import CalorieLoggingSection from '@/components/landing/CalorieLoggingSection';
import WorkoutPrograms from '@/components/landing/WorkoutPrograms';
import ShareCards from '@/components/landing/ShareCards';
import Gamification from '@/components/landing/Gamification';
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
      <WorkoutPrograms />
      <ShareCards />
      <Gamification />

      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
