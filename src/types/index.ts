
export type AuthStatus = 'guest' | 'signedin' | 'loggedin' | null;
export type Language = 'en' | 'es';
export type Theme = 'light' | 'dark';
export type Disaster = 'LA Fires' | 'Maui Fire' | 'Asheville Flood' | 'Hurricane Milton' | null;
export type TabName = 'Home' | 'Map' | 'News' | 'Settings';


export interface DisasterData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  resourceCount: number;
}

export interface MapPin {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  hours?: string;
  description?: string;
  website?: string;
  rating?: number;
}

export interface CategoryStyle {
  color: string;
  icon: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface WebMapRegion {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export interface FacilityRatingProps {
  rating: number;
  size?: number;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

export interface EnvironmentVariables {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
  REACT_APP_GOOGLE_MAPS_API_KEY?: string;
}

export interface TranslationKeys {
  disasters: string;
  map: string;
  updates: string;
  settings: string;
  active: string;
  resourceLocations: string;
  viewMap: string;
  activeDisasters: string;
  selectDisaster: string;
  language: string;
  english: string;
  spanish: string;
  offlineMode: string;
  notifications: string;
  locationServices: string;
  replayOnboarding: string;
  clearCachedData: string;
  aboutTitle: string;
  aboutSubtitle: string;
  footer: string;
}
