import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertiesClient from './PropertiesClient';
import { getProperties } from '@/data/properties';

// Server Component - fetches data on server for TRUE SSR
export default async function PropertiesPage({ searchParams }) {
  const properties = await getProperties();
  const initialFilters = {
    type: searchParams?.type || '',
    status: searchParams?.status || '',
    area: searchParams?.area || '',
    price: searchParams?.price || '',
    category: searchParams?.category || '',
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header - Server Rendered */}
      <div className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">All Properties</h1>
          <p className="text-white/80 text-lg">Discover your perfect property from our exclusive listings</p>
        </div>
      </div>

      {/* Client Component for interactive filters */}
      <PropertiesClient properties={properties} initialFilters={initialFilters} />

      <Footer />
    </div>
  );
}

// Metadata for SEO
export const metadata = {
  title: 'All Properties - Jaipur Elite Homes | Villas & Plots for Sale',
  description: 'Browse all properties for sale in Jaipur. Premium villas, plots, and residential properties in prime locations.',
  keywords: 'properties for sale Jaipur, villas Jaipur, plots Jaipur, real estate listings',
};
