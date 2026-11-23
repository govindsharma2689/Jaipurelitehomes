import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyDetailClient from './PropertyDetailClient';
import { getPropertyById, getSimilarProperties, getProperties, generateSlug } from '@/data/properties';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaipurelitehomes.com';

// Generate static params for all properties (for SSG) - using SEO-friendly slugs
export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((property) => ({
    id: property.slug || generateSlug(property.title, property.location, property.type, property.id),
  }));
}

// Generate metadata for SEO - server-side with full SEO optimization
export async function generateMetadata({ params }) {
  const property = await getPropertyById(params.id);
  
  if (!property) {
    return {
      title: 'Property Not Found - Jaipur Elite Homes',
    };
  }

  const slug = property.slug || generateSlug(property.title, property.location, property.type, property.id);
  const canonicalUrl = `${SITE_URL}/property/${slug}`;
  const ogImage = property.images?.[0] || property.image || '/images/properties/default.jpg';
  
  // Ensure image URL is absolute
  const absoluteImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  return {
    title: `${property.title} - ${property.price} | Jaipur Elite Homes`,
    description: property.description || `${property.type} for ${property.status} in ${property.location}, ${property.area}, Jaipur. ${property.price}. Contact Jaipur Elite Homes for premium real estate.`,
    keywords: `${property.title}, ${property.type}, ${property.location}, ${property.area}, Jaipur, real estate, property for sale, ${property.status === 'Sales' ? 'buy' : 'rent'} property, plots in jaipur, villas in jaipur`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${property.title} - ${property.price}`,
      description: property.description || `${property.type} in ${property.location}, Jaipur`,
      url: canonicalUrl,
      siteName: 'Jaipur Elite Homes',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${property.title} - ${property.price}`,
      description: property.description || `${property.type} in ${property.location}, Jaipur`,
      images: [absoluteImageUrl],
      site: '@jaipurelitehomes',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Server Component - TRUE SSR with JSON-LD structured data
export default async function PropertyDetailPage({ params }) {
  // Server-side data fetching
  const property = await getPropertyById(params.id);
  
  if (!property) {
    notFound();
  }

  const similarProperties = await getSimilarProperties(property, 3);
  
  const slug = property.slug || generateSlug(property.title, property.location, property.type, property.id);
  const canonicalUrl = `${SITE_URL}/property/${slug}`;
  const ogImage = property.images?.[0] || property.image || '/images/properties/default.jpg';
  const absoluteImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  // JSON-LD Structured Data for Real Estate Listing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description || property.full_description,
    url: canonicalUrl,
    image: absoluteImageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.location,
      addressLocality: property.area,
      addressRegion: 'Rajasthan',
      addressCountry: 'IN',
    },
    offers: {
      '@type': 'Offer',
      price: property.price.replace(/[^\d]/g, '') || '0',
      priceCurrency: 'INR',
      availability: property.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
    seller: {
      '@type': 'RealEstateAgent',
      name: 'Jaipur Elite Homes',
      telephone: '+91-9928444666',
      email: 'info@jaipurelitehomes.com',
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jaipur',
        addressRegion: 'Rajasthan',
        addressCountry: 'IN',
      },
    },
  };

  // Organization JSON-LD for breadcrumb and site info
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Jaipur Elite Homes',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9928444666',
      contactType: 'sales',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.facebook.com/jaipurelitehomes',
      'https://www.instagram.com/jaipurelitehomes',
      'https://www.youtube.com/@jaipurelitehomes',
    ],
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Properties',
        item: `${SITE_URL}/properties`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: property.type,
        item: `${SITE_URL}/properties?type=${property.type}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: property.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <Header />
      
      {/* Pass server-fetched data to client component for interactivity */}
      <PropertyDetailClient 
        property={{
          ...property,
          slug,
        }} 
        similarProperties={similarProperties} 
      />
      
      <Footer />
    </div>
  );
}
