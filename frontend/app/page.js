import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import LatestPropertiesSection from '@/components/LatestPropertiesSection';
import PropertiesCarousel from '@/components/PropertiesCarousel';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { getProperties } from '@/data/properties';

// This is a Server Component - data is fetched on the server
export default async function HomePage() {
  // Server-side data fetching - TRUE SSR
  const properties = await getProperties();

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <LatestPropertiesSection properties={properties} />
      <PropertiesCarousel properties={properties} />
      <ContactSection />
      <Footer />
    </div>
  );
}

// Metadata for SEO - server-rendered
export const metadata = {
  title: 'Jaipur Elite Homes - Premium Real Estate in Jaipur | Villas & Plots',
  description: 'Discover premium villas, plots, and properties in Jaipur, Rajasthan. 15+ years of experience in real estate. Your trusted partner for luxury homes.',
  keywords: 'Jaipur real estate, villas in Jaipur, plots in Jaipur, luxury homes, property for sale',
};
