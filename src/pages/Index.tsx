import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceCategories from "@/components/ServiceCategories";
import CleanerOfTheWeek from "@/components/CleanerOfTheWeek";
import SponsoredSpotlight from "@/components/SponsoredSpotlight";
import FeaturedCleaners from "@/components/FeaturedCleaners";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import NearbyCleanersMap from "@/components/maps/NearbyCleanersMap";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ServiceCategories />
        <NearbyCleanersMap />
        <CleanerOfTheWeek />
        <SponsoredSpotlight variant="homepage" limit={8} />
        <FeaturedCleaners />
        <HowItWorks />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
