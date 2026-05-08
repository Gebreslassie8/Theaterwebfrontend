// frontend/src/components/ManageHallForm/types.ts

// Seat type configuration (for UI display and form handling)
export interface SeatType {
  id: string;
  name: string;
  count: number;
  price?: number; // Optional price override per seat type
}

// Seat configuration for database JSON storage
export interface SeatLevel {
  name: string;
  price: number;
  capacity?: number;
}

export interface SeatConfiguration {
  levels: string[];
  default_pricing: {
    standard: number;
    vip: number;
    vvip: number;
    [key: string]: number;
  };
  custom_pricing?: Record<string, number>;
  seat_types?: SeatType[]; // For backward compatibility
}

// Hall interface matching database schema
export interface Hall {
  // Primary identifiers
  id: string; // UUID from database (changed from number)
  theater_id: string; // Foreign key to theaters table

  // Basic Info
  hall_number: number; // Unique hall number within theater (required)
  name: string | null; // Optional display name (e.g., "Grand Hall")
  capacity: number; // Total seat capacity (required)

  // Layout Configuration
  rows: string | null; // Row configuration (e.g., "A-Z" for 26 rows)
  columns_per_row: any | null; // JSON for columns per row (e.g., {"A": 20, "B": 22})
  seat_layout: any | null; // JSON for complete seat layout

  // Pricing & Configuration
  seating_layout: string; // Standard, Compact, Premium, VIP, Balcony
  price_multiplier: number; // Price multiplier for this hall (default: 1.0)
  has_dynamic_seating: boolean; // Enable dynamic pricing based on demand
  seat_configuration: SeatConfiguration | null; // JSON for seat types and pricing

  // Status & Description
  is_active: boolean; // Active status (true = Active, false = Inactive)
  description: string | null; // Additional description

  // Audit fields
  created_at: string; // Timestamp
  updated_at?: string; // Optional updated timestamp
  published_by: string | null; // User ID who created the hall

  // Optional: joined from users table
  publisher_name?: string; // For display purposes
  publisher_role?: string; // For display purposes

  // Optional: joined from theaters table
  theater_name?: string; // For display purposes
}

// For form data when creating/updating a hall
export interface HallFormData {
  hall_number: number;
  name?: string;
  capacity: number;
  rows?: string;
  seating_layout: string;
  price_multiplier: number;
  has_dynamic_seating: boolean;
  description?: string;
  seat_configuration?: SeatConfiguration;
  published_by?: string; // User ID who is creating the hall
}

// For API response when fetching halls with theater info
export interface HallWithTheater extends Hall {
  theater_legal_business_name: string;
  theater_city: string;
  theater_address: string;
}

// For list/table display (simplified version)
export interface HallListItem {
  id: string;
  hall_number: number;
  name: string | null;
  capacity: number;
  seating_layout: string;
  price_multiplier: number;
  is_active: boolean;
  theater_id: string;
  created_at: string;
  published_by: string | null;
}

// Helper types for UI components
export type HallStatus = "Active" | "Inactive" | "Maintenance";

// Constants
export const SEATING_LAYOUT_OPTIONS = [
  { value: "Standard", label: "Standard" },
  { value: "Compact", label: "Compact" },
  { value: "Premium", label: "Premium" },
  { value: "VIP", label: "VIP" },
  { value: "Balcony", label: "Balcony" },
];

export const DEFAULT_SEAT_CONFIGURATION: SeatConfiguration = {
  levels: ["standard", "vip", "vvip"],
  default_pricing: {
    standard: 50,
    vip: 120,
    vvip: 250,
  },
};

// Helper functions
export const getStatusFromIsActive = (isActive: boolean): HallStatus => {
  return isActive ? "Active" : "Inactive";
};

export const getIsActiveFromStatus = (status: HallStatus): boolean => {
  return status === "Active";
};

export const calculateTotalCapacity = (seatTypes: SeatType[]): number => {
  return seatTypes.reduce((sum, st) => sum + (st.count || 0), 0);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Convert database hall to UI-friendly format (if needed for older components)
export const convertHallToOldFormat = (hall: Hall): any => {
  // Extract seat types from seat_configuration if available
  let seatTypes: SeatType[] = [];

  if (hall.seat_configuration?.seat_types) {
    seatTypes = hall.seat_configuration.seat_types;
  } else if (hall.seat_configuration?.levels) {
    // Convert levels to seat types
    const pricing = hall.seat_configuration.default_pricing;
    seatTypes = hall.seat_configuration.levels.map((level, index) => ({
      id: generateId(),
      name: level.charAt(0).toUpperCase() + level.slice(1),
      count: Math.floor(hall.capacity / hall.seat_configuration!.levels.length),
      price: pricing[level] || 50,
    }));
  }

  return {
    id: hall.id,
    name: hall.name || `Hall ${hall.hall_number}`,
    seatTypes: seatTypes,
    features: hall.description ? [hall.description] : [],
    status: getStatusFromIsActive(hall.is_active),
    seatingLayout: hall.seating_layout,
    rows: parseInt(hall.rows?.split("-")[1] || "0") || 10,
    columns: 20, // Default, since columns_per_row is complex
    published_by: hall.published_by,
  };
};

// Convert old format to database format
export const convertOldFormatToHall = (
  oldHall: any,
  theaterId: string,
  userId: string,
): Partial<Hall> => {
  const totalCapacity = calculateTotalCapacity(oldHall.seatTypes);

  // Create seat configuration from seat types
  const seatConfiguration: SeatConfiguration = {
    levels: oldHall.seatTypes.map((st: SeatType) => st.name.toLowerCase()),
    default_pricing: {
      standard: 50,
      vip: 120,
      vvip: 250,
    },
    seat_types: oldHall.seatTypes,
  };

  // Override pricing if available
  oldHall.seatTypes.forEach((st: SeatType) => {
    if (st.price) {
      seatConfiguration.default_pricing[st.name.toLowerCase()] = st.price;
    }
  });

  return {
    theater_id: theaterId,
    hall_number: oldHall.hallNumber || 1,
    name: oldHall.name,
    capacity: totalCapacity,
    rows: `${String.fromCharCode(64 + (oldHall.rows || 10))}-${String.fromCharCode(64 + (oldHall.rows || 10))}`,
    seating_layout: oldHall.seatingLayout || "Standard",
    price_multiplier: oldHall.priceMultiplier || 1.0,
    has_dynamic_seating: true,
    description: oldHall.features?.join(", "),
    is_active: oldHall.status === "Active",
    seat_configuration: seatConfiguration,
    published_by: userId,
  };
};

// Get user display name from user object
export const getUserDisplayName = (user: any): string => {
  return user?.full_name || user?.name || user?.email || "Unknown User";
};

// Get role display name
export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    super_admin: "Super Admin",
    theater_owner: "Theater Owner",
    theater_manager: "Theater Manager",
    sales_person: "Sales Person",
    qr_scanner: "QR Scanner",
    customer: "Customer",
  };
  return roleMap[role] || role;
};