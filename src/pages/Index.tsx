import { Navbar } from "@/components/homepage/Navbar";
import { HeroSection } from "@/components/homepage/HeroSection";
import { TrustRibbon } from "@/components/homepage/TrustRibbon";
import { ChooseYourPath } from "@/components/homepage/ChooseYourPath";
import { CertificationSpotlight } from "@/components/homepage/CertificationSpotlight";
import { TopEndorsements } from "@/components/homepage/TopEndorsements";
import { TopEndorsements } from "@/components/homepage/TopEndorsements";
import { MoreWaysToGrow } from "@/components/homepage/MoreWaysToGrow";
import { ProductCallouts } from "@/components/homepage/ProductCallouts";
import { AuthoritySection } from "@/components/homepage/AuthoritySection";
import { FreeResourcesPreview } from "@/components/homepage/FreeResourcesPreview";
import { LatestPosts } from "@/components/homepage/LatestPosts";
import { BrowseByCategory } from "@/components/homepage/BrowseByCategory";
import { LiveEvents } from "@/components/homepage/LiveEvents";
import { EbookCapture } from "@/components/homepage/EbookCapture";
import { SocialProof } from "@/components/homepage/SocialProof";
import { FounderBlock } from "@/components/homepage/FounderBlock";
import { FinalCTA } from "@/components/homepage/FinalCTA";
import { Footer } from "@/components/homepage/Footer";
import { HomepageEngagementTracker } from "@/components/homepage/HomepageEngagementTracker";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HomepageEngagementTracker />
      <Navbar />
      <main>
        <HeroSection />
        <TrustRibbon />
        <ChooseYourPath />
        <TopEndorsements />
        <CertificationSpotlight />
        <MoreWaysToGrow />
        <AuthoritySection />
        <FreeResourcesPreview />
        <LatestPosts />
        <BrowseByCategory />
        <LiveEvents />
        <EbookCapture />
        <SocialProof />
        <ProductCallouts />
        <FounderBlock />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
