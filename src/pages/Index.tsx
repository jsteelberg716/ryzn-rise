import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import StatsBar from '@/components/landing/StatsBar';
import ProblemSection from '@/components/landing/ProblemSection';
import MuscleMapSection from '@/components/landing/MuscleMapSection';
import ProgressionSection from '@/components/landing/ProgressionSection';
import WorkoutPrograms from '@/components/landing/WorkoutPrograms';
import ShareCards from '@/components/landing/ShareCards';
import FeatureGrid from '@/components/landing/FeatureGrid';
import Gamification from '@/components/landing/Gamification';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-foreground">
      <Navbar />
      <Hero />
      <StatsBar />
      <ProblemSection />
      <MuscleMapSection />
      <ProgressionSection />
      <WorkoutPrograms />
      <ShareCards />
      <FeatureGrid />
      <Gamification />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
