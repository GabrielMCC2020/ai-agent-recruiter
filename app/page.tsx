import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Testimonials from "@/components/landing/Testimonials";
import PricingSection from "@/components/landing/PricingSection";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-[#0a0f1e]">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <FeaturesSection />
      <Testimonials />
      <PricingSection />
      <CtaBanner />
      <Footer />
    </main>
  );
}
