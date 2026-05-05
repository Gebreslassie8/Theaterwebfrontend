// src/pages/Owner/events/types.ts
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
  name: string;
  description: string;
  timeSlots: TimeSlot[];
  hall: string;
  seatCategories: SeatCategory[];
  category: string;
  ageRestriction: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  organizer: string;
  imageUrl?: string;
  createdAt: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  totalBookedSeats: number;
  totalRevenue: number;
  contractDate?: string;
  contractReference?: string;
}

export interface FormData {
  name: string;
  description: string;
  timeSlots: TimeSlot[];
  hall: string;
  seatCategories: SeatCategory[];
  category: string;
  ageRestriction: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  organizer: string;
  contractDate: string;
  contractReference: string;
}

export const halls = [
  { id: 'hall-a', name: 'Grand Hall', capacity: 1500, seatTypes: [{ name: 'VIP', capacity: 200 }, { name: 'Regular', capacity: 1000 }, { name: 'Balcony', capacity: 300 }] },
  { id: 'hall-b', name: 'Blue Hall', capacity: 800, seatTypes: [{ name: 'VIP', capacity: 100 }, { name: 'Regular', capacity: 600 }, { name: 'Balcony', capacity: 100 }] },
  { id: 'hall-c', name: 'Red Hall', capacity: 500, seatTypes: [{ name: 'VIP', capacity: 50 }, { name: 'Regular', capacity: 400 }, { name: 'Balcony', capacity: 50 }] },
  { id: 'vip-hall', name: 'Royal Hall', capacity: 300, seatTypes: [{ name: 'Royal VIP', capacity: 50 }, { name: 'Premium', capacity: 150 }, { name: 'Standard', capacity: 100 }] },
];

export const categories = [
  { value: 'concert', label: 'Concert', color: 'from-purple-500 to-pink-500' },
  { value: 'theater', label: 'Theater', color: 'from-blue-500 to-cyan-500' },
  { value: 'movie', label: 'Movie', color: 'from-red-500 to-orange-500' },
  { value: 'comedy', label: 'Comedy', color: 'from-yellow-500 to-orange-500' },
  { value: 'sports', label: 'Sports', color: 'from-green-500 to-emerald-500' },
  { value: 'family', label: 'Family', color: 'from-indigo-500 to-purple-500' },
];

export const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;