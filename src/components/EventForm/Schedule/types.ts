// src/components/EventForm/Schedule/types.ts
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

export interface Show {
    id: string;
    name: string;
    description?: string;
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
    sales: number;
    capacity: number;
    revenue: number;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'selling' | 'almost full' | 'sold out';
}