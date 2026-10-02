export interface WorldCapital {
  countryCode: string;
  city: string;
  latitude: number;
  longitude: number;
}

export const worldCapitals: WorldCapital[] = [
  // North America
  { countryCode: "CA", city: "Ottawa", latitude: 45.4215, longitude: -75.6972 },
  { countryCode: "US", city: "Washington D.C.", latitude: 38.9072, longitude: -77.0369 },
  { countryCode: "MX", city: "Ciudad de México", latitude: 19.4326, longitude: -99.1332 },
  { countryCode: "GT", city: "Ciudad de Guatemala", latitude: 14.6349, longitude: -90.5069 },
  { countryCode: "CU", city: "La Habana", latitude: 23.1136, longitude: -82.3666 },

  // South America
  { countryCode: "CO", city: "Bogotá", latitude: 4.711, longitude: -74.0721 },
  { countryCode: "VE", city: "Caracas", latitude: 10.4806, longitude: -66.9036 },
  { countryCode: "EC", city: "Quito", latitude: -0.1807, longitude: -78.4678 },
  { countryCode: "PE", city: "Lima", latitude: -12.0464, longitude: -77.0428 },
  { countryCode: "BR", city: "Brasilia", latitude: -15.7939, longitude: -47.8828 },
  { countryCode: "CL", city: "Santiago", latitude: -33.4489, longitude: -70.6693 },
  { countryCode: "AR", city: "Buenos Aires", latitude: -34.6037, longitude: -58.3816 },

  // Europe
  { countryCode: "GB", city: "Londres", latitude: 51.5074, longitude: -0.1278 },
  { countryCode: "FR", city: "París", latitude: 48.8566, longitude: 2.3522 },
  { countryCode: "ES", city: "Madrid", latitude: 40.4168, longitude: -3.7038 },
  { countryCode: "PT", city: "Lisboa", latitude: 38.7223, longitude: -9.1393 },
  { countryCode: "DE", city: "Berlín", latitude: 52.52, longitude: 13.405 },
  { countryCode: "IT", city: "Roma", latitude: 41.9028, longitude: 12.4964 },
  { countryCode: "PL", city: "Varsovia", latitude: 52.2297, longitude: 21.0122 },
  { countryCode: "GR", city: "Atenas", latitude: 37.9838, longitude: 23.7275 },
  { countryCode: "UA", city: "Kyiv", latitude: 50.4501, longitude: 30.5234 },
  { countryCode: "NO", city: "Oslo", latitude: 59.9139, longitude: 10.7522 },
  { countryCode: "SE", city: "Estocolmo", latitude: 59.3293, longitude: 18.0686 },
  { countryCode: "FI", city: "Helsinki", latitude: 60.1699, longitude: 24.9384 },

  // Africa
  { countryCode: "MA", city: "Rabat", latitude: 34.0209, longitude: -6.8416 },
  { countryCode: "DZ", city: "Argel", latitude: 36.7538, longitude: 3.0588 },
  { countryCode: "EG", city: "El Cairo", latitude: 30.0444, longitude: 31.2357 },
  { countryCode: "NG", city: "Abuja", latitude: 9.0765, longitude: 7.3986 },
  { countryCode: "ET", city: "Addis Abeba", latitude: 8.9806, longitude: 38.7578 },
  { countryCode: "KE", city: "Nairobi", latitude: -1.2921, longitude: 36.8219 },
  { countryCode: "CD", city: "Kinshasa", latitude: -4.4419, longitude: 15.2663 },
  { countryCode: "AO", city: "Luanda", latitude: -8.839, longitude: 13.2894 },
  { countryCode: "ZA", city: "Pretoria", latitude: -25.7479, longitude: 28.2293 },

  // Middle East
  { countryCode: "TR", city: "Ankara", latitude: 39.9334, longitude: 32.8597 },
  { countryCode: "IR", city: "Teherán", latitude: 35.6892, longitude: 51.389 },
  { countryCode: "IQ", city: "Bagdad", latitude: 33.3152, longitude: 44.3661 },
  { countryCode: "SA", city: "Riad", latitude: 24.7136, longitude: 46.6753 },
  { countryCode: "AE", city: "Abu Dabi", latitude: 24.4539, longitude: 54.3773 },

  // Asia
  { countryCode: "RU", city: "Moscú", latitude: 55.7558, longitude: 37.6173 },
  { countryCode: "KZ", city: "Astana", latitude: 51.1694, longitude: 71.4491 },
  { countryCode: "PK", city: "Islamabad", latitude: 33.6844, longitude: 73.0479 },
  { countryCode: "IN", city: "Nueva Delhi", latitude: 28.6139, longitude: 77.209 },
  { countryCode: "CN", city: "Beijing", latitude: 39.9042, longitude: 116.4074 },
  { countryCode: "KR", city: "Seúl", latitude: 37.5665, longitude: 126.978 },
  { countryCode: "JP", city: "Tokio", latitude: 35.6762, longitude: 139.6503 },
  { countryCode: "TH", city: "Bangkok", latitude: 13.7563, longitude: 100.5018 },
  { countryCode: "VN", city: "Hanói", latitude: 21.0278, longitude: 105.8342 },
  { countryCode: "ID", city: "Yakarta", latitude: -6.2088, longitude: 106.8456 },

  // Oceania
  { countryCode: "AU", city: "Canberra", latitude: -35.2809, longitude: 149.13 },
  { countryCode: "NZ", city: "Wellington", latitude: -41.2866, longitude: 174.7756 },
];