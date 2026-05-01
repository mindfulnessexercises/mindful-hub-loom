import { Navbar } from "@/components/homepage/Navbar";
import { HeroSection } from "@/components/homepage/HeroSection";
import { IntentRouterStrip } from "@/components/homepage/IntentRouterStrip";
import { TrustRibbon } from "@/components/homepage/TrustRibbon";
import { BrowseByFormat } from "@/components/homepage/BrowseByFormat";
import { CertificationSpotlight } from "@/components/homepage/CertificationSpotlight";
import { TopEndorsements } from "@/components/homepage/TopEndorsements";
import { MoreWaysToGrow } from "@/components/homepage/MoreWaysToGrow";
import { ProductCallouts } from "@/components/homepage/ProductCallouts";
import { AuthoritySection } from "@/components/homepage/AuthoritySection";
import { FreeResourcesPreview } from "@/components/homepage/FreeResourcesPreview";
import { LatestPosts } from "@/components/homepage/LatestPosts";
import { LiveEvents } from "@/components/homepage/LiveEvents";
import { EbookCapture } from "@/components/homepage/EbookCapture";
import { FounderBlock } from "@/components/homepage/FounderBlock";
import { FinalCTA } from "@/components/homepage/FinalCTA";
import { Footer } from "@/components/homepage/Footer";
import { HomepageEngagementTracker } from "@/components/homepage/HomepageEngagementTracker";
import { HomepageSeo } from "@/components/homepage/HomepageSeo";
import { KeywordSeoSection } from "@/components/homepage/KeywordSeoSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HomepageSeo />
      <HomepageEngagementTracker />
      <Navbar />
      <main>
        <HeroSection />
        <IntentRouterStrip />
        <TrustRibbon />
        <BrowseByFormat />
        <TopEndorsements />
        <CertificationSpotlight />
        <MoreWaysToGrow />
        <AuthoritySection />
        <FreeResourcesPreview />
        {/* Keyword-rich, internal-linking SEO block — placed mid-page so it
            sits inside the engagement window without competing with the hero
            or the email capture. See HomepageSeo for the meta strategy. */}
        <KeywordSeoSection />
        <LatestPosts />
        <LiveEvents />
        <EbookCapture />
        <ProductCallouts />
        <FounderBlock />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
