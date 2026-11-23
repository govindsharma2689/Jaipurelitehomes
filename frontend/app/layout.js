import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaipurelitehomes.com';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Jaipur Elite Homes - Premium Real Estate in Jaipur | Villas & Plots',
    template: '%s | Jaipur Elite Homes',
  },
  description: 'We have 15+ years of experience in real estate. Discover premium villas, plots, and properties in Jaipur, Rajasthan. Your trusted partner for luxury homes and plots.',
  keywords: 'Jaipur real estate, villas in Jaipur, plots in Jaipur, luxury homes, property for sale, Rajasthan properties, buy property jaipur, real estate agent jaipur, premium plots, residential plots',
  authors: [{ name: 'Jaipur Elite Homes', url: SITE_URL }],
  creator: 'Jaipur Elite Homes',
  publisher: 'Jaipur Elite Homes',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Jaipur Elite Homes - Premium Real Estate in Jaipur',
    description: 'Discover premium villas, plots, and properties in Jaipur, Rajasthan. 15+ years of trusted real estate experience.',
    url: SITE_URL,
    type: 'website',
    locale: 'en_IN',
    siteName: 'Jaipur Elite Homes',
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Jaipur Elite Homes - Premium Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaipur Elite Homes - Premium Real Estate in Jaipur',
    description: 'Discover premium villas, plots, and properties in Jaipur, Rajasthan.',
    site: '@jaipurelitehomes',
    creator: '@jaipurelitehomes',
    images: [`${SITE_URL}/images/og-image.jpg`],
  },
  verification: {
    // Add these when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  category: 'real estate',
};

// Organization JSON-LD for the entire site
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Jaipur Elite Homes',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description: 'Premium real estate agency in Jaipur with 15+ years of experience. Specializing in villas, plots, and luxury properties.',
  telephone: '+91-9928444666',
  email: 'info@jaipurelitehomes.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '302001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '26.9124',
    longitude: '75.7873',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '19:00',
  },
  sameAs: [
    'https://www.facebook.com/jaipurelitehomes',
    'https://www.instagram.com/jaipurelitehomes',
    'https://www.youtube.com/@jaipurelitehomes',
  ],
  priceRange: '₹₹₹',
  areaServed: {
    '@type': 'City',
    name: 'Jaipur',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Jaipur Elite Homes',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/properties?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1e88e5" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* JSON-LD Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
