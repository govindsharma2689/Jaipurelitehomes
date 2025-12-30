// Data loader for static JSON files (Hostinger shared hosting compatible)

let cachedProperties = null;

export const loadProperties = async () => {
  if (cachedProperties) return cachedProperties;
  
  try {
    const response = await fetch('/data/properties.json');
    cachedProperties = await response.json();
    return cachedProperties;
  } catch (error) {
    console.error('Error loading properties:', error);
    return [];
  }
};

export const getPropertyById = async (id) => {
  const properties = await loadProperties();
  return properties.find(p => p.id === id || p.id === String(id));
};

export const getPropertiesByType = async (type) => {
  const properties = await loadProperties();
  return properties.filter(p => p.type === type);
};
