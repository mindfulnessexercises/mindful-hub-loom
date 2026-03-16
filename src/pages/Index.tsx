import { Navbar } from "@/components/homepage/Navbar";
import { HeroSection } from "@/components/homepage/HeroSection";
import { TrustRibbon } from "@/components/homepage/TrustRibbon";
import { ChooseYourPath } from "@/components/homepage/ChooseYourPath";
import { CertificationSpotlight } from "@/components/homepage/CertificationSpotlight";
import { AuthoritySection } from "@/components/homepage/AuthoritySection";
import { FreeResourcesPreview } from "@/components/homepage/FreeResourcesPreview";
import { LiveEvents } from "@/components/homepage/LiveEvents";
import { EbookCapture } from "@/components/homepage/EbookCapture";
import { Footer } from "@/components/homepage/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <TrustRibbon />
        <ChooseYourPath />
        <CertificationSpotlight />
        <AuthoritySection />
        <FreeResourcesPreview />
        <LiveEvents />
        <EbookCapture />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
