import HeroSection from "@/components/HeroSection";
import BenefitsCarousel from "@/components/BenefitsCarousel";
import EligibilityCriteria from "@/components/EligibilityCriteria";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BenefitsCarousel />
      <EligibilityCriteria />
    </div>
  );
};

export default Index;
