// src/types/ownerBooking.types.ts
export interface OwnerBookingInfo {
    id: string;
    eventId: string;
    eventName: string;
    eventDate: string;
    hallName: string;
    bookingDate: string;
    totalTickets: number;
    totalAmount: number;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    paymentStatus: 'unpaid' | 'paid' | 'refunded';
    ticketTypes: {
        seatType: string;
        quantity: number;
        price: number;
    }[];
    approvedAt?: string;
    rejectedReason?: string;
    ticketAccessLink?: string;
}

export interface OwnerBookingStats {
    totalBookings: number;
    approvedBookings: number;
    pendingBookings: number;
    totalTickets: number;
    totalSpent: number;
    upcomingEvents: number;
}