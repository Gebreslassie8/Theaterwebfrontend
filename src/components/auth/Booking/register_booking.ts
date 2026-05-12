// frontend/src/components/auth/Booking/register_booking.ts
import supabase from "@/config/supabaseClient";

// Types
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface SeatInfo {
  id: string;
  seat_label: string;
  seat_row: string;
  seat_number: number;
  seat_level_id: string;
  seat_level_name: string;
  seat_level_display_name: string;
  price: number;
}

export interface ScheduleInfo {
  id: string;
  hall_id: string;
  show_date: string;
  start_time: string;
  end_time: string;
  availableSeats?: number;
}

export interface BookingRegistrationData {
  eventId: string;
  eventTitle: string;
  venue: string;
  theaterId: string;
  schedule: ScheduleInfo;
  selectedSeats: SeatInfo[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  paymentMethod: string;
  transactionReference?: string;
  isGuest?: boolean; // Add flag for guest checkout
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  reservation?: any;
  tickets?: any[];
  error?: string;
  details?: any;
}

/**
 * Generate a unique transaction reference
 */
function generateTransactionReference(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

/**
 * Generate a unique ticket number
 */
function generateTicketNumber(seatLabel: string): string {
  return `TKT-${Date.now()}-${seatLabel}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

/**
 * Generate QR code data (simplified - you can integrate a proper QR library)
 */
function generateQRCodeData(reservationId: string, seatLabel: string): string {
  return JSON.stringify({
    reservationId,
    seatLabel,
    timestamp: Date.now(),
    venue: "Theatre Hub",
  });
}

/**
 * Generate ticket objects
 */
function generateTickets(
  reservationId: string,
  data: BookingRegistrationData,
): any[] {
  return data.selectedSeats.map((seat) => ({
    ticketId: `TKT-${reservationId.substring(0, 8)}-${seat.seat_label}`,
    seat: seat.seat_label,
    row: seat.seat_row,
    number: seat.seat_number,
    section: seat.seat_level_display_name,
    price: seat.price,
    customerName: data.customerInfo.name,
    qrCode: generateQRCodeData(reservationId, seat.seat_label),
  }));
}

/**
 * Register a booking in the database (supports both logged-in users and guests)
 */
export async function registerBooking(
  data: BookingRegistrationData,
): Promise<BookingResult> {
  try {
    console.log("📝 Starting booking registration...", data);

    let userId = null;

    // Try to get authenticated user, but don't require it
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        console.log("✅ User authenticated:", userId);
      } else {
        console.log("👤 Guest checkout - no login required");
      }
    } catch (authError) {
      console.log("👤 Guest checkout - continuing without authentication");
    }

    // Create a guest ID for tracking if not logged in
    const guestId = !userId
      ? `guest_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
      : null;

    // Start a transaction by creating the reservation first
    const reservationData = {
      user_id: userId, // Can be null for guests
      guest_id: guestId,
      event_id: data.eventId,
      schedule_id: data.schedule.id,
      total_amount: data.totalAmount,
      status: "confirmed",
      payment_status: "paid",
      payment_method: data.paymentMethod,
      transaction_reference:
        data.transactionReference || generateTransactionReference(),
      customer_name: data.customerInfo.name,
      customer_email: data.customerInfo.email,
      customer_phone: data.customerInfo.phone,
      booking_date: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes expiry
      is_guest: !userId, // Flag to indicate guest booking
    };

    console.log("📝 Creating reservation:", reservationData);

    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .insert([reservationData])
      .select()
      .single();

    if (reservationError) {
      console.error("❌ Error creating reservation:", reservationError);
      return {
        success: false,
        error: `Failed to create reservation: ${reservationError.message}`,
        details: reservationError,
      };
    }

    console.log("✅ Reservation created:", reservation.id);

    // Create reserved seats entries
    const reservedSeatsData = data.selectedSeats.map((seat) => ({
      reservation_id: reservation.id,
      seat_id: seat.id,
      seat_row: seat.seat_row,
      seat_number: seat.seat_number,
      seat_label: seat.seat_label,
      seat_level_id: seat.seat_level_id,
      seat_level_name: seat.seat_level_name,
      seat_level_display_name: seat.seat_level_display_name,
      price_at_time: seat.price,
      ticket_number: generateTicketNumber(seat.seat_label),
      ticket_type: "regular",
      is_checked_in: false,
      created_at: new Date().toISOString(),
    }));

    console.log(`🎫 Creating ${reservedSeatsData.length} reserved seats...`);

    const { error: reservedSeatsError } = await supabase
      .from("reserved_seats")
      .insert(reservedSeatsData);

    if (reservedSeatsError) {
      console.error("❌ Error creating reserved seats:", reservedSeatsError);
      // Rollback: delete the reservation
      await supabase.from("reservations").delete().eq("id", reservation.id);
      return {
        success: false,
        error: `Failed to reserve seats: ${reservedSeatsError.message}`,
        details: reservedSeatsError,
      };
    }

    console.log("✅ Reserved seats created");

    // Update seat statuses to 'reserved'
    const seatIds = data.selectedSeats.map((seat) => seat.id);
    const { error: updateSeatsError } = await supabase
      .from("seats")
      .update({
        is_reserved: true,
        status: "reserved",
        last_reserved_at: new Date().toISOString(),
        last_reserved_by: userId || guestId,
      })
      .in("id", seatIds);

    if (updateSeatsError) {
      console.error(
        "⚠️ Error updating seats (non-critical):",
        updateSeatsError,
      );
      // Don't fail the booking, just log the error
    } else {
      console.log("✅ Seats updated to reserved");
    }

    // Update schedule available seats
    if (data.schedule.availableSeats !== undefined) {
      const newAvailableSeats = Math.max(
        0,
        (data.schedule.availableSeats || 0) - data.selectedSeats.length,
      );

      const { error: updateScheduleError } = await supabase
        .from("event_schedules")
        .update({ available_seats: newAvailableSeats })
        .eq("id", data.schedule.id);

      if (updateScheduleError) {
        console.error(
          "⚠️ Error updating schedule seats (non-critical):",
          updateScheduleError,
        );
      } else {
        console.log(
          `✅ Schedule available seats updated: ${newAvailableSeats}`,
        );
      }
    }

    // Generate tickets
    const tickets = generateTickets(reservation.id, data);

    console.log("🎉 Booking registration completed successfully!");

    return {
      success: true,
      bookingId: reservation.id,
      reservation: reservation,
      tickets: tickets,
    };
  } catch (error) {
    console.error("❌ Unexpected error during booking registration:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
      details: error,
    };
  }
}

/**
 * Get booking by ID (works for both user and guest)
 */
export async function getBookingById(
  bookingId: string,
  email?: string,
  phone?: string,
): Promise<BookingResult> {
  try {
    let query = supabase
      .from("reservations")
      .select(
        `
        *,
        reserved_seats (*),
        events (id, title, poster_url),
        event_schedules (show_date, start_time, end_time)
      `,
      )
      .eq("id", bookingId);

    // If email and phone provided, verify they match (for guest lookup)
    if (email && phone) {
      query = query.eq("customer_email", email).eq("customer_phone", phone);
    }

    const { data: reservation, error: reservationError } = await query.single();

    if (reservationError) {
      return {
        success: false,
        error: `Failed to fetch booking: ${reservationError.message}`,
        details: reservationError,
      };
    }

    return {
      success: true,
      bookingId: reservation.id,
      reservation: reservation,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch booking",
    };
  }
}

/**
 * Get bookings by email (for guests to view their bookings)
 */
export async function getBookingsByEmail(
  email: string,
): Promise<BookingResult> {
  try {
    const { data: reservations, error: reservationsError } = await supabase
      .from("reservations")
      .select(
        `
        *,
        reserved_seats (*),
        events (id, title, poster_url, genre, duration_minutes),
        event_schedules (show_date, start_time, end_time)
      `,
      )
      .eq("customer_email", email)
      .order("created_at", { ascending: false });

    if (reservationsError) {
      return {
        success: false,
        error: `Failed to fetch bookings: ${reservationsError.message}`,
      };
    }

    return {
      success: true,
      reservation: reservations,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch bookings",
    };
  }
}

/**
 * Cancel a booking (works for both user and guest)
 */
export async function cancelBooking(
  bookingId: string,
  email?: string,
  phone?: string,
): Promise<BookingResult> {
  try {
    // Build query to find the reservation
    let query = supabase
      .from("reservations")
      .select("*, reserved_seats(*)")
      .eq("id", bookingId);

    // If email and phone provided, verify ownership
    if (email && phone) {
      query = query.eq("customer_email", email).eq("customer_phone", phone);
    }

    const { data: reservation, error: fetchError } = await query.single();

    if (fetchError) {
      return {
        success: false,
        error: `Failed to find booking: ${fetchError.message}`,
      };
    }

    // Update reservation status to cancelled
    const { error: updateError } = await supabase
      .from("reservations")
      .update({
        status: "cancelled",
        payment_status: "refunded",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (updateError) {
      return {
        success: false,
        error: `Failed to cancel booking: ${updateError.message}`,
      };
    }

    // Free up the seats
    if (reservation.reserved_seats && reservation.reserved_seats.length > 0) {
      const seatIds = reservation.reserved_seats.map((rs: any) => rs.seat_id);

      const { error: updateSeatsError } = await supabase
        .from("seats")
        .update({
          is_reserved: false,
          status: "available",
          last_reserved_at: null,
          last_reserved_by: null,
        })
        .in("id", seatIds);

      if (updateSeatsError) {
        console.error("⚠️ Error freeing seats:", updateSeatsError);
      }

      // Update reserved_seats status
      await supabase
        .from("reserved_seats")
        .update({
          cancelled_at: new Date().toISOString(),
          is_checked_in: false,
        })
        .eq("reservation_id", bookingId);
    }

    // Update schedule available seats
    if (reservation.schedule_id) {
      const { data: schedule } = await supabase
        .from("event_schedules")
        .select("available_seats, total_seats")
        .eq("id", reservation.schedule_id)
        .single();

      if (schedule) {
        const newAvailableSeats =
          (schedule.available_seats || 0) +
          (reservation.reserved_seats?.length || 0);
        await supabase
          .from("event_schedules")
          .update({
            available_seats: Math.min(
              newAvailableSeats,
              schedule.total_seats || 0,
            ),
          })
          .eq("id", reservation.schedule_id);
      }
    }

    return {
      success: true,
      bookingId: bookingId,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to cancel booking",
    };
  }
}

/**
 * Get all bookings for current user or guest
 */
export async function getUserBookings(
  email?: string,
  phone?: string,
): Promise<BookingResult> {
  try {
    // Try to get authenticated user first
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase
      .from("reservations")
      .select(
        `
        *,
        reserved_seats (*),
        events (id, title, poster_url, genre, duration_minutes),
        event_schedules (show_date, start_time, end_time)
      `,
      )
      .order("created_at", { ascending: false });

    if (user) {
      // Logged in user
      query = query.eq("user_id", user.id);
    } else if (email && phone) {
      // Guest with email/phone
      query = query.eq("customer_email", email).eq("customer_phone", phone);
    } else {
      return {
        success: false,
        error: "No identification provided for fetching bookings",
      };
    }

    const { data: reservations, error: reservationsError } = await query;

    if (reservationsError) {
      return {
        success: false,
        error: `Failed to fetch bookings: ${reservationsError.message}`,
      };
    }

    return {
      success: true,
      reservation: reservations,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch bookings",
    };
  }
}