// src/components/ManageHallForm/types.ts
export interface SeatType {
    id: string;
    name: string;
    count: number;
}

export interface Hall {
    id: number;
    name: string;
    seatTypes: SeatType[];
    features: string[];
    status: 'Active' | 'Maintenance';
    seatingLayout: string;
    rows: number;
    columns: number;
    priceMultiplier: number;
}