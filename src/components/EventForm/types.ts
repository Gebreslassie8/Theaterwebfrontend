// frontend/src/components/EventForm/types.ts

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface SeatCategory {
  id: string;
  name: string;
  price: number;
  capacity: number;
  booked?: number;
  commissionPercent: number;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  genre: string;
  category: string;
  duration_minutes: number;
  director: string;
  cast: string[];
  poster_url: string;
  price_min: number;
  price_max: number;
  status: "coming-soon" | "now-showing" | "ended" | "cancelled";
  is_featured: boolean;
  rating: number;
  review_count: number;
  view_count: number;
  theater_id: string;
  created_at: string;
  updated_at: string;
  published_by?: string;
  theater_name?: string;
  publisher_name?: string;
  publisher_role?: string;
  // UI-specific fields
  timeSlots?: TimeSlot[];
  hall?: string;
  seatCategories?: SeatCategory[];
  ageRestriction?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  organizer?: string;
  contractDate?: string;
  contractReference?: string;
  totalBookedSeats?: number;
  totalRevenue?: number;
}

export interface FormData {
  title: string;
  description: string;
  genre: string;
  category: string;
  duration_minutes: number;
  director: string;
  cast: string[];
  poster_url: string;
  price_min: number;
  price_max: number;
  status: "coming-soon" | "now-showing" | "ended" | "cancelled";
  is_featured: boolean;
  theater_id?: string;
  published_by?: string;
  // Extended fields
  timeSlots?: TimeSlot[];
  hall?: string;
  seatCategories?: SeatCategory[];
  ageRestriction?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  organizer?: string;
  contractDate?: string;
  contractReference?: string;
}

export interface Theater {
  id: string;
  legal_business_name: string;
  trade_name: string;
  city: string;
}

// Halls configuration
export const halls = [
  {
    id: "hall-a",
    name: "Grand Hall",
    capacity: 1500,
    seatTypes: [
      { name: "VIP", capacity: 200 },
      { name: "Regular", capacity: 1000 },
      { name: "Balcony", capacity: 300 },
    ],
  },
  {
    id: "hall-b",
    name: "Blue Hall",
    capacity: 800,
    seatTypes: [
      { name: "VIP", capacity: 100 },
      { name: "Regular", capacity: 600 },
      { name: "Balcony", capacity: 100 },
    ],
  },
  {
    id: "hall-c",
    name: "Red Hall",
    capacity: 500,
    seatTypes: [
      { name: "VIP", capacity: 50 },
      { name: "Regular", capacity: 400 },
      { name: "Balcony", capacity: 50 },
    ],
  },
  {
    id: "vip-hall",
    name: "Royal Hall",
    capacity: 300,
    seatTypes: [
      { name: "Royal VIP", capacity: 50 },
      { name: "Premium", capacity: 150 },
      { name: "Standard", capacity: 100 },
    ],
  },
];

// Categories configuration
export const categories = [
  { value: "Action", label: "Action", color: "from-red-500 to-orange-500" },
  { value: "Comedy", label: "Comedy", color: "from-yellow-500 to-orange-500" },
  { value: "Drama", label: "Drama", color: "from-purple-500 to-pink-500" },
  {
    value: "Science Fiction",
    label: "Sci-Fi",
    color: "from-blue-500 to-cyan-500",
  },
  { value: "Horror", label: "Horror", color: "from-gray-700 to-gray-900" },
  { value: "Romance", label: "Romance", color: "from-pink-500 to-rose-500" },
  {
    value: "Documentary",
    label: "Documentary",
    color: "from-green-500 to-emerald-500",
  },
  {
    value: "Thriller",
    label: "Thriller",
    color: "from-indigo-500 to-purple-500",
  },
  {
    value: "Animation",
    label: "Animation",
    color: "from-cyan-500 to-blue-500",
  },
  {
    value: "Fantasy",
    label: "Fantasy",
    color: "from-purple-500 to-indigo-500",
  },
  { value: "Musical", label: "Musical", color: "from-pink-500 to-red-500" },
  { value: "Mystery", label: "Mystery", color: "from-gray-600 to-gray-800" },
];

// Genres configuration
export const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Documentary",
  "Animation",
  "Fantasy",
  "Mystery",
  "Musical",
  "Western",
  "Crime",
  "War",
];

// Generate unique ID
export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
