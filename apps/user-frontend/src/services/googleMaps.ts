// Google Maps API integration for geocoding and distance calculation

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId?: string;
}

export interface DistanceResult {
  distance: number; // in kilometers
  duration: number; // in minutes
  status: 'OK' | 'ERROR';
}

// Configuration
const GOOGLE_MAPS_CONFIG = {
  // API key should be set from environment variable
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  // Base URLs for different services
  geocodingUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
  distanceMatrixUrl: 'https://maps.googleapis.com/maps/api/distancematrix/json',
};

// Helper function to check if API key is available
export const isGoogleMapsAvailable = (): boolean => {
  return !!GOOGLE_MAPS_CONFIG.apiKey;
};

// Geocode an address to get coordinates
export const geocodeAddress = async (address: string): Promise<GeocodeResult | null> => {
  if (!GOOGLE_MAPS_CONFIG.apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `${GOOGLE_MAPS_CONFIG.geocodingUrl}?address=${encodedAddress}&key=${GOOGLE_MAPS_CONFIG.apiKey}&region=vn&language=vi`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id
      };
    } else {
      console.warn('Geocoding failed:', data.status, data.error_message);
      return null;
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Calculate distance between two points using Google Distance Matrix API
export const calculateDistance = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<DistanceResult> => {
  if (!GOOGLE_MAPS_CONFIG.apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  try {
    const originStr = `${origin.lat},${origin.lng}`;
    const destinationStr = `${destination.lat},${destination.lng}`;
    const url = `${GOOGLE_MAPS_CONFIG.distanceMatrixUrl}?origins=${originStr}&destinations=${destinationStr}&units=metric&key=${GOOGLE_MAPS_CONFIG.apiKey}&language=vi`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.rows.length > 0) {
      const element = data.rows[0].elements[0];
      
      if (element.status === 'OK') {
        return {
          distance: element.distance.value / 1000, // Convert meters to kilometers
          duration: element.duration.value / 60, // Convert seconds to minutes
          status: 'OK'
        };
      }
    }
    
    // Fallback to Haversine calculation if Distance Matrix fails
    const distance = calculateHaversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    return {
      distance,
      duration: distance * 2, // Rough estimate: 30km/h average speed
      status: 'OK'
    };
  } catch (error) {
    console.error('Error calculating distance:', error);
    // Fallback to Haversine calculation
    const distance = calculateHaversineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    return {
      distance,
      duration: distance * 2,
      status: 'ERROR'
    };
  }
};

// Fallback Haversine formula for distance calculation
const calculateHaversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Comprehensive address resolution (try Google Maps first, fallback to local database)
export const resolveAddress = async (address: string): Promise<GeocodeResult | null> => {
  if (!address || address.trim().length === 0) {
    return null;
  }

  // If API key is available, try Google Maps
  if (isGoogleMapsAvailable()) {
    try {
      const result = await geocodeAddress(address);
      if (result) {
        return result;
      }
    } catch (error) {
      console.warn('Google Maps geocoding failed:', error);
    }
  }

  return null;
};