// Server-side data loading utilities for Next.js SSR
// Fetches data from the backend API

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaipurelitehomes.com';

// Helper to generate SEO-friendly slugs (must match backend)
export function generateSlug(title, location, type, id) {
  const text = `${type}-${title}-${location}`.toLowerCase();
  let slug = text.replace(/[^\w\s-]/g, '');
  slug = slug.replace(/[\s_]+/g, '-');
  slug = slug.replace(/-+/g, '-');
  slug = slug.replace(/^-+|-+$/g, '');
  return `${slug}-${id}`;
}

// Load all properties from API (server-side)
export async function getProperties() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/properties`, {
      cache: 'no-store', // Always fetch fresh data
    });
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    const properties = await response.json();
    // Ensure each property has a slug
    return properties.map(prop => ({
      ...prop,
      slug: prop.slug || generateSlug(prop.title, prop.location, prop.type, prop.id)
    }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    // Fallback to static data if API fails
    const { properties: staticProperties } = await import('./mockData');
    return staticProperties.map(prop => ({
      ...prop,
      slug: prop.slug || generateSlug(prop.title, prop.location, prop.type, prop.id)
    }));
  }
}

// Get single property by ID or slug from API (server-side)
export async function getPropertyById(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/properties/${id}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      // Try fetching all and finding by numeric id or slug
      const allProps = await getProperties();
      const numId = parseInt(id, 10);
      return allProps.find(p => 
        p.id === numId || 
        p.id === String(numId) || 
        p.slug === id ||
        id.endsWith(`-${p.id}`)
      ) || null;
    }
    const property = await response.json();
    // Ensure property has a slug
    return {
      ...property,
      slug: property.slug || generateSlug(property.title, property.location, property.type, property.id)
    };
  } catch (error) {
    console.error('Error fetching property:', error);
    // Fallback to static data
    const { properties: staticProperties } = await import('./mockData');
    const numId = parseInt(id, 10);
    const found = staticProperties.find(p => p.id === numId || p.id === String(numId)) || null;
    if (found) {
      return {
        ...found,
        slug: generateSlug(found.title, found.location, found.type, found.id)
      };
    }
    return null;
  }
}

// Get properties by type from API (server-side)
export async function getPropertiesByType(type) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/properties?type=${type}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch properties by type');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching properties by type:', error);
    const allProps = await getProperties();
    return allProps.filter(p => p.type === type);
  }
}

// Get featured properties from API (server-side)
export async function getFeaturedProperties() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/properties?featured=true`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch featured properties');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    const allProps = await getProperties();
    return allProps.filter(p => p.featured);
  }
}

// Get similar properties (server-side)
export async function getSimilarProperties(property, limit = 3) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/properties?type=${property.type}&limit=${limit + 1}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch similar properties');
    }
    const properties = await response.json();
    return properties.filter(p => p.id !== property.id).slice(0, limit);
  } catch (error) {
    console.error('Error fetching similar properties:', error);
    const allProps = await getProperties();
    return allProps
      .filter(p => p.type === property.type && p.id !== property.id)
      .slice(0, limit);
  }
}

// Submit contact inquiry
export async function submitInquiry(inquiryData) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryData),
    });
    if (!response.ok) {
      throw new Error('Failed to submit inquiry');
    }
    return await response.json();
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    throw error;
  }
}
