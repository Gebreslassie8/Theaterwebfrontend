// frontend/src/components/ManageHallForm/types.ts

// ============================================
// DATABASE SCHEMA TYPES
// ============================================

// Hall table (matches public.halls)
export interface Hall {
  id: string;
  theater_id: string;
  num_of_col: number;
  name: string | null;
  capacity: number;
  created_at: string;
  num_of_row: number | null;
  description: string | null;
  is_active: boolean;
  updated_by: boolean | null;
  created_by: string | null;
  updated_at: string | null;
  // Joined fields (not in database)
  theater_name?: string;
  seat_levels?: SeatLevel[];
  seat_stats?: SeatStats;
}

// Seat levels table (matches public.seat_levels)
export interface SeatLevel {
  id: string;
  hall_id: string;
  name: string;
  display_name: string;
  price: number;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Seats table (matches public.seats)
export interface Seat {
  id: string;
  hall_id: string;
  seat_level_id: string | null;
  seat_row: string;
  seat_number: number;
  seat_label: string;
  is_reserved: boolean;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  seat_level?: SeatLevel;
}

// Seat statistics (calculated, not stored)
export interface SeatStats {
  total: number;
  available: number;
  reserved: number;
  byLevel: Record<string, number>;
}

// ============================================
// EVENT & SHOW SCHEDULE TYPES
// ============================================

// Hall reference for events
export interface EventHall {
  id: string;
  theater_id: string;
  num_of_col: number;
  name: string | null;
  capacity: number;
  num_of_row: number | null;
  description: string | null;
  is_active: boolean;
}

// Show schedule (links events to halls)
export interface ShowSchedule {
  id: string;
  event_id: string;
  hall_id: string;
  show_date: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  hall?: EventHall;
}

// Event data from database
export interface EventData {
  id: string;
  theater_id: string;
  title: string;
  description: string | null;
  genre: string | null;
  category: string | null;
  duration_minutes: number | null;
  director: string | null;
  cast: string[] | null;
  poster_url: string | null;
  status: "coming-soon" | "now-showing" | "ended";
  is_featured: boolean;
  rating: number | null;
  review_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_by: string | null;
}

// Event with schedules
export interface EventWithSchedules extends EventData {
  schedules?: ShowSchedule[];
}

// ============================================
// FORM AND UI TYPES
// ============================================

// For creating a new hall (Step 1)
export interface CreateHallBasicInfo {
  name: string;
  num_of_rows: number;
  num_of_cols: number;
  description?: string;
}

// For creating seat levels (Step 2)
export interface CreateSeatLevelInput {
  id?: string;
  name: string;
  display_name: string;
  price: number;
  color: string;
  // For UI range selection
  start_row?: string;
  end_row?: string;
  start_col?: number;
  end_col?: number;
}

// Complete hall creation data
export interface CreateHallData {
  hallInfo: CreateHallBasicInfo;
  seatLevels: CreateSeatLevelInput[];
}

// For updating a hall
export interface UpdateHallData {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
}

// For updating a seat
export interface UpdateSeatData {
  id: string;
  seat_level_id: string | null;
  is_reserved: boolean;
  notes?: string;
}

// For updating seat level
export interface UpdateSeatLevelData {
  id: string;
  display_name: string;
  price: number;
  color: string;
  is_active: boolean;
}

// ============================================
// UI DISPLAY TYPES
// ============================================

export type HallStatus = "Active" | "Inactive";

export interface HallListItem {
  id: string;
  name: string | null;
  capacity: number;
  num_of_row: number | null;
  num_of_col: number;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
  seat_stats?: SeatStats;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convert number to Excel-style column letters (A, B, C, ..., Z, AA, AB, etc.)
 */
export const numberToRowLetter = (num: number): string => {
  let result = "";
  let n = num;
  while (n > 0) {
    n--;
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26);
  }
  return result;
};

/**
 * Generate row letters for given number of rows
 */
export const generateRowLetters = (numOfRows: number): string[] => {
  const letters: string[] = [];
  for (let i = 1; i <= numOfRows; i++) {
    letters.push(numberToRowLetter(i));
  }
  return letters;
};

/**
 * Generate column numbers for given number of columns
 */
export const generateColumnNumbers = (numOfCols: number): number[] => {
  return Array.from({ length: numOfCols }, (_, i) => i + 1);
};

/**
 * Calculate total capacity from rows and columns
 */
export const calculateTotalCapacity = (
  numOfRows: number,
  numOfCols: number,
): number => {
  return numOfRows * numOfCols;
};

/**
 * Get status display from isActive boolean
 */
export const getStatusFromIsActive = (isActive: boolean): HallStatus => {
  return isActive ? "Active" : "Inactive";
};

/**
 * Generate unique ID for UI components
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return `ETB ${price.toLocaleString()}`;
};

/**
 * Get seat status color for UI
 */
export const getSeatStatusColor = (isReserved: boolean): string => {
  return isReserved ? "bg-red-500" : "bg-green-500 hover:bg-green-600";
};

/**
 * Get seat status label
 */
export const getSeatStatusLabel = (isReserved: boolean): string => {
  return isReserved ? "Reserved" : "Available";
};

/**
 * Get user display name from user object
 */
export const getUserDisplayName = (user: any): string => {
  return user?.full_name || user?.name || user?.email || "Unknown User";
};

/**
 * Get role display name from role string
 */
export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    super_admin: "Super Admin",
    theater_owner: "Theater Owner",
    theater_manager: "Theater Manager",
    sales_person: "Sales Person",
    sales: "Sales Person",
    qr_scanner: "QR Scanner",
    customer: "Customer",
  };
  return (
    roleMap[role] ||
    role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

/**
 * Calculate seat statistics for a hall
 */
export const calculateSeatStats = (
  seats: Seat[],
  seatLevels: SeatLevel[],
): SeatStats => {
  const stats: SeatStats = {
    total: seats.length,
    available: 0,
    reserved: 0,
    byLevel: {},
  };

  // Initialize byLevel counts
  seatLevels.forEach((level) => {
    stats.byLevel[level.id] = 0;
  });

  seats.forEach((seat) => {
    if (seat.is_reserved) {
      stats.reserved++;
    } else {
      stats.available++;
    }
    if (seat.seat_level_id && stats.byLevel[seat.seat_level_id] !== undefined) {
      stats.byLevel[seat.seat_level_id]++;
    }
  });

  return stats;
};

/**
 * Default seat level colors
 */
export const DEFAULT_SEAT_LEVEL_COLORS = [
  { name: "Standard", color: "#6B7280" },
  { name: "VIP", color: "#EF4444" },
  { name: "Premium", color: "#F59E0B" },
  { name: "Gold", color: "#FBBF24" },
  { name: "Platinum", color: "#3B82F6" },
  { name: "Royal", color: "#8B5CF6" },
  { name: "Diamond", color: "#EC4899" },
];

/**
 * Default seat levels for new hall
 */
export const getDefaultSeatLevels = (): CreateSeatLevelInput[] => {
  return [
    {
      name: "standard",
      display_name: "Standard",
      price: 50,
      color: "#6B7280",
    },
    {
      name: "vip",
      display_name: "VIP",
      price: 120,
      color: "#EF4444",
    },
  ];
};

/**
 * Generate seat layout for a new hall
 */
export interface GeneratedSeat {
  hall_id: string;
  seat_level_id: string | null;
  seat_row: string;
  seat_number: number;
  is_reserved: boolean;
  is_active: boolean;
  notes: string | null;
}

export const generateSeatLayout = (
  hallId: string,
  numOfRows: number,
  numOfCols: number,
  defaultLevelId: string,
): GeneratedSeat[] => {
  const rows = generateRowLetters(numOfRows);
  const seats: GeneratedSeat[] = [];

  for (const row of rows) {
    for (let col = 1; col <= numOfCols; col++) {
      seats.push({
        hall_id: hallId,
        seat_level_id: defaultLevelId,
        seat_row: row,
        seat_number: col,
        is_reserved: false,
        is_active: true,
        notes: null,
      });
    }
  }

  return seats;
};

/**
 * Seat level range for validation
 */
export interface SeatLevelRange {
  display_name: string;
  start_row: string;
  end_row: string;
  start_col: number;
  end_col: number;
  price: number;
}

/**
 * Validate seat level ranges for premium levels
 */
export const validateSeatLevelRanges = (
  levels: SeatLevelRange[],
  totalRows: number,
  totalCols: number,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const rowLetters = generateRowLetters(totalRows);

  for (const level of levels) {
    // Skip if it's standard level (no range needed)
    if (level.display_name === "Standard") continue;

    // Validate row range
    const startRowIndex = rowLetters.indexOf(level.start_row);
    const endRowIndex = rowLetters.indexOf(level.end_row);

    if (startRowIndex === -1) {
      errors.push(
        `"${level.display_name}": Invalid start row "${level.start_row}"`,
      );
    }
    if (endRowIndex === -1) {
      errors.push(
        `"${level.display_name}": Invalid end row "${level.end_row}"`,
      );
    }
    if (
      startRowIndex !== -1 &&
      endRowIndex !== -1 &&
      startRowIndex > endRowIndex
    ) {
      errors.push(`"${level.display_name}": Start row must be before end row`);
    }

    // Validate column range
    if (level.start_col < 1 || level.start_col > totalCols) {
      errors.push(
        `"${level.display_name}": Start column must be between 1 and ${totalCols}`,
      );
    }
    if (level.end_col < 1 || level.end_col > totalCols) {
      errors.push(
        `"${level.display_name}": End column must be between 1 and ${totalCols}`,
      );
    }
    if (level.start_col > level.end_col) {
      errors.push(
        `"${level.display_name}": Start column must be before end column`,
      );
    }

    // Validate price
    if (level.price <= 0) {
      errors.push(`"${level.display_name}": Price must be greater than 0`);
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Booking related types
 */
export interface BookingSeatDetail {
  seatId: string;
  row: string;
  number: number;
  section: string;
  price: number;
  levelId: string;
}

export interface BookingCustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface BookingTicket {
  ticketId: string;
  bookingId: string;
  tx_ref: string;
  ticketNumber: number;
  totalTickets: number;
  show: string;
  seat: string;
  row: string;
  number: number;
  section: string;
  price: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  venue: string;
  qrData: any;
}

export interface BookingInfo {
  bookingId: string;
  tx_ref: string;
  show: string;
  show_id: string;
  schedule_id: string;
  hall_id: string;
  seats: string[];
  seatDetails: Record<string, BookingSeatDetail>;
  totalSeats: number;
  totalAmount: number;
  totalAmountBirr: string;
  customerInfo: BookingCustomerInfo;
  paymentMethod: string;
  paymentDetails: {
    transactionReference: string;
    paymentStatus: string;
    paymentDate: string;
  };
  bookingDate: string;
  status: string;
  venue: string;
  tickets: BookingTicket[];
}