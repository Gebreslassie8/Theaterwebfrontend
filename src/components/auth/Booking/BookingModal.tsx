// frontend/src/components/auth/Booking/BookingModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Ticket,
  CreditCard,
  Phone,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Printer,
  Wallet,
  Calendar,
  Clock,
  MapPin,
  Star,
  Crown,
  Armchair,
  Info,
  Sparkles,
  Shield,
  Loader2,
  Check,
} from "lucide-react";
import supabase from "@/config/supabaseClient";
import {
  registerBooking,
  type BookingRegistrationData,
  type SeatInfo,
} from "./register_booking";

// Types
interface EventSchedule {
  id: string;
  event_id: string;
  hall_id: string;
  show_date: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  available_seats: number | null;
  total_seats: number | null;
  price_multiplier: number;
}

interface Schedule {
  id: string;
  date: string;
  time: string;
  day: string;
  availableSeats: number;
  hallId: string;
  startTime: string;
  endTime: string;
}

interface Show {
  id: string;
  title: string;
  venue: string;
  theater_id?: string;
  poster_url?: string;
  duration?: number;
  genre?: string;
}

interface SeatLevel {
  id: string;
  hall_id: string;
  display_name: string;
  price: number;
  color: string;
  is_active: boolean;
  name: string;
  display_order: number;
  description: string;
}

interface Seat {
  id: string;
  hall_id: string;
  seat_level_id: string;
  seat_row: string;
  seat_number: number;
  seat_label: string;
  is_reserved: boolean;
  is_active: boolean;
  status: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface Ticket {
  ticketId: string;
  seat: string;
  row: string;
  number: number;
  section: string;
  price: number;
  customerName: string;
  seatLevelId: string;
  seatLevelName: string;
  seatColor: string;
}

interface BookingInfo {
  bookingId: string;
  showId: string;
  show: string;
  venue: string;
  theaterId: string;
  hallId: string;
  totalSeats: number;
  totalAmount: number;
  totalAmountBirr: string;
  customerInfo: CustomerInfo;
  paymentMethod: string;
  paymentDetails: { transactionReference: string };
  bookingDate: string;
  status: string;
  tickets: Ticket[];
  selectedSchedule: Schedule;
}

interface BookingModalProps {
  show: Show;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (booking: BookingInfo) => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
  }).format(amount);
};

const generateTransactionRef = (): string => {
  return `TXT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

const BookingModal: React.FC<BookingModalProps> = ({
  show,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<BookingInfo | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatLevels, setSeatLevels] = useState<SeatLevel[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [hallData, setHallData] = useState<{ id: string; name: string } | null>(
    null,
  );

  const modalRef = useRef<HTMLDivElement>(null);

  // CRITICAL FIX: Prevent ALL form submissions and navigation events
  useEffect(() => {
    const preventAllFormSubmissions = (e: KeyboardEvent | Event) => {
      // Prevent Enter key from submitting anything
      if (e instanceof KeyboardEvent && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      // Prevent any submit events
      if (e.type === "submit") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const preventGlobalNavigation = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    if (isOpen) {
      // Block Enter key globally when modal is open
      document.addEventListener("keydown", preventAllFormSubmissions);
      document.addEventListener("submit", preventAllFormSubmissions, true);

      // Block all click events that might cause navigation
      const allLinks = document.querySelectorAll("a");
      const modalElement = modalRef.current;

      const handleLinkClick = (e: Event) => {
        const target = e.target as HTMLElement;
        if (modalElement?.contains(target)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      allLinks.forEach((link) => {
        link.addEventListener("click", handleLinkClick);
      });

      return () => {
        document.removeEventListener("keydown", preventAllFormSubmissions);
        document.removeEventListener("submit", preventAllFormSubmissions, true);
        allLinks.forEach((link) => {
          link.removeEventListener("click", handleLinkClick);
        });
      };
    }
  }, [isOpen]);

  // Fetch schedules for this event
  useEffect(() => {
    const fetchSchedules = async () => {
      if (!show.id) {
        setLoadingSchedules(false);
        return;
      }

      try {
        setLoadingSchedules(true);

        const { data: schedulesData, error: schedulesError } = await supabase
          .from("event_schedules")
          .select("*")
          .eq("event_id", show.id)
          .eq("is_active", true)
          .gte("show_date", new Date().toISOString().split("T")[0])
          .order("show_date", { ascending: true })
          .order("start_time", { ascending: true });

        if (schedulesError) throw schedulesError;

        if (schedulesData && schedulesData.length > 0) {
          const formattedSchedules: Schedule[] = schedulesData.map(
            (schedule: EventSchedule) => {
              const showDate = new Date(schedule.show_date);
              return {
                id: schedule.id,
                date: showDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }),
                time: schedule.start_time.substring(0, 5),
                day: showDate.toLocaleDateString("en-US", { weekday: "long" }),
                availableSeats: schedule.available_seats || 0,
                hallId: schedule.hall_id,
                startTime: schedule.start_time,
                endTime: schedule.end_time,
              };
            },
          );
          setSchedules(formattedSchedules);
        } else {
          setSchedules([]);
        }
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setSchedules([]);
      } finally {
        setLoadingSchedules(false);
      }
    };

    if (isOpen && show.id) {
      fetchSchedules();
    }
  }, [isOpen, show.id]);

  // Fetch seat data based on selected schedule's hall
  useEffect(() => {
    const fetchSeatData = async () => {
      if (!selectedSchedule?.hallId) {
        setLoadingSeats(false);
        return;
      }

      try {
        setLoadingSeats(true);
        setError("");

        const { data: hall, error: hallError } = await supabase
          .from("halls")
          .select("id, name")
          .eq("id", selectedSchedule.hallId)
          .single();

        if (hallError) throw hallError;
        setHallData(hall);

        const { data: levelsData, error: levelsError } = await supabase
          .from("seat_levels")
          .select("*")
          .eq("hall_id", selectedSchedule.hallId)
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (levelsError) throw levelsError;
        setSeatLevels(levelsData || []);

        const { data: seatsData, error: seatsError } = await supabase
          .from("seats")
          .select("*")
          .eq("hall_id", selectedSchedule.hallId)
          .eq("is_active", true)
          .order("seat_row", { ascending: true })
          .order("seat_number", { ascending: true });

        if (seatsError) throw seatsError;

        setSeats(seatsData || []);
        setSelectedSeats([]);
      } catch (err) {
        console.error("Error fetching seat data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load seat map. Please try again.",
        );
      } finally {
        setLoadingSeats(false);
      }
    };

    if (isOpen && selectedSchedule?.hallId) {
      fetchSeatData();
    }
  }, [isOpen, selectedSchedule]);

  const seatsByRow = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.seat_row]) {
        acc[seat.seat_row] = [];
      }
      acc[seat.seat_row].push(seat);
      return acc;
    },
    {} as Record<string, Seat[]>,
  );

  const sortedRows = Object.keys(seatsByRow).sort();

  const getSeatLevel = (seatLevelId: string): SeatLevel | undefined => {
    return seatLevels.find((level) => level.id === seatLevelId);
  };

  const getSeatColor = (seatLevelId: string): string => {
    const level = getSeatLevel(seatLevelId);
    return level?.color || "#6B7280";
  };

  const getSeatPrice = (seatLevelId: string): number => {
    const level = getSeatLevel(seatLevelId);
    return level?.price || 0;
  };

  const getSeatLevelDisplayName = (seatLevelId: string): string => {
    const level = getSeatLevel(seatLevelId);
    return level?.display_name || "Standard";
  };

  const getSeatLevelSystemName = (seatLevelId: string): string => {
    const level = getSeatLevel(seatLevelId);
    return level?.name || "standard";
  };

  const getSeatIcon = (seatLevelId: string) => {
    const level = getSeatLevel(seatLevelId);
    if (!level) return <Armchair className="w-4 h-4" />;
    switch (level.name?.toLowerCase()) {
      case "vip":
      case "vvip":
        return <Crown className="w-4 h-4" />;
      case "premium":
        return <Star className="w-4 h-4" />;
      default:
        return <Armchair className="w-4 h-4" />;
    }
  };

  const isSeatReserved = (seat: Seat): boolean => {
    return seat.is_reserved || seat.status === "reserved";
  };

  const isSeatSelected = (seatId: string): boolean => {
    return selectedSeats.some((seat) => seat.id === seatId);
  };

  const calculateTotal = (): number => {
    return selectedSeats.reduce((total, seat) => {
      return total + getSeatPrice(seat.seat_level_id);
    }, 0);
  };

  const handleSeatSelect = (seat: Seat): void => {
    if (isSeatReserved(seat)) return;
    setSelectedSeats((prev) =>
      prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat],
    );
  };

  const handleNext = (e?: React.MouseEvent | React.KeyboardEvent): void => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (step === 1) {
      if (!selectedSchedule) {
        setError("Please select a show time");
        return;
      }
      if (selectedSeats.length === 0) {
        setError("Please select at least one seat");
        return;
      }
    }
    if (step === 2) {
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        setError("Please fill all customer information");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerInfo.email)) {
        setError("Please enter a valid email address");
        return;
      }
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(customerInfo.phone.replace(/\D/g, ""))) {
        setError("Please enter a valid phone number (10 digits)");
        return;
      }
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = (e?: React.MouseEvent): void => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setStep((prev) => prev - 1);
  };

  const handleConfirm = async (e?: React.MouseEvent): Promise<void> => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setIsProcessing(true);
    setError("");

    try {
      const seatsForRegistration: SeatInfo[] = selectedSeats.map((seat) => {
        const seatLevel = getSeatLevel(seat.seat_level_id);
        return {
          id: seat.id,
          seat_label: seat.seat_label,
          seat_row: seat.seat_row,
          seat_number: seat.seat_number,
          seat_level_id: seat.seat_level_id,
          seat_level_name: getSeatLevelSystemName(seat.seat_level_id),
          seat_level_display_name: getSeatLevelDisplayName(seat.seat_level_id),
          price: getSeatPrice(seat.seat_level_id),
        };
      });

      const scheduleInfo = {
        id: selectedSchedule!.id,
        hall_id: selectedSchedule!.hallId,
        show_date: selectedSchedule!.date,
        start_time: selectedSchedule!.startTime,
        end_time: selectedSchedule!.endTime,
        availableSeats: selectedSchedule!.availableSeats,
      };

      const registrationData: BookingRegistrationData = {
        eventId: show.id,
        eventTitle: show.title,
        venue: show.venue,
        theaterId: show.theater_id || "",
        schedule: scheduleInfo,
        selectedSeats: seatsForRegistration,
        customerInfo: customerInfo,
        totalAmount: calculateTotal(),
        paymentMethod: "chapa",
        transactionReference: generateTransactionRef(),
      };

      const result = await registerBooking(registrationData);

      if (!result.success) {
        throw new Error(result.error || "Failed to register booking");
      }

      const bookingInfo: BookingInfo = {
        bookingId: result.bookingId!,
        showId: show.id,
        show: show.title,
        venue: show.venue,
        theaterId: show.theater_id || "",
        hallId: selectedSchedule?.hallId || seats[0]?.hall_id || "",
        totalSeats: selectedSeats.length,
        totalAmount: calculateTotal(),
        totalAmountBirr: formatCurrency(calculateTotal()),
        customerInfo,
        paymentMethod: "chapa",
        paymentDetails: { transactionReference: generateTransactionRef() },
        bookingDate: new Date().toISOString(),
        status: "confirmed",
        tickets: selectedSeats.map((seat) => {
          const seatLevel = getSeatLevel(seat.seat_level_id);
          return {
            ticketId: `TKT-${Date.now()}-${seat.seat_label}`,
            seat: seat.seat_label,
            row: seat.seat_row,
            number: seat.seat_number,
            section: seatLevel?.display_name || "Standard",
            price: getSeatPrice(seat.seat_level_id),
            customerName: customerInfo.name,
            seatLevelId: seat.seat_level_id,
            seatLevelName: seatLevel?.display_name || "Standard",
            seatColor: seatLevel?.color || "#6B7280",
          };
        }),
        selectedSchedule: selectedSchedule!,
      };

      const bookings = JSON.parse(
        localStorage.getItem("theater_bookings") || "[]",
      );
      bookings.push(bookingInfo);
      localStorage.setItem("theater_bookings", JSON.stringify(bookings));

      setBookingData(bookingInfo);
      setShowSuccess(true);
      onConfirm(bookingInfo);
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to complete booking. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const printBooking = (): void => {
    if (!bookingData) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Booking Confirmation - ${bookingData.bookingId}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; background: #f9fafb; }
            .ticket { background: white; border-radius: 24px; box-shadow: 0 20px 25px -12px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #0f766e, #0d9488); color: white; padding: 32px; text-align: center; }
            .content { padding: 32px; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #0f766e; font-weight: 600; margin-bottom: 12px; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .total { font-size: 20px; font-weight: bold; color: #0f766e; text-align: right; margin-top: 16px; padding-top: 16px; border-top: 2px solid #0f766e; }
            .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h1>🎭 Theatre Hub</h1>
              <p>Booking Confirmation</p>
            </div>
            <div class="content">
              <div class="section">
                <div class="section-title">Booking Details</div>
                <div class="row"><strong>Booking ID:</strong> ${bookingData.bookingId}</div>
                <div class="row"><strong>Date:</strong> ${new Date(bookingData.bookingDate).toLocaleString()}</div>
                <div class="row"><strong>Status:</strong> ✓ Confirmed</div>
              </div>
              <div class="section">
                <div class="section-title">Event Details</div>
                <div class="row"><strong>Show:</strong> ${bookingData.show}</div>
                <div class="row"><strong>Venue:</strong> ${bookingData.venue}</div>
                <div class="row"><strong>When:</strong> ${bookingData.selectedSchedule?.day}, ${bookingData.selectedSchedule?.date} at ${bookingData.selectedSchedule?.time}</div>
              </div>
              <div class="section">
                <div class="section-title">Tickets</div>
                ${bookingData.tickets
                  .map(
                    (t) => `
                  <div class="row">
                    <div><strong>${t.seat}</strong> (${t.section})</div>
                    <span>${formatCurrency(t.price)}</span>
                  </div>
                `,
                  )
                  .join("")}
                <div class="total">Total Paid: ${bookingData.totalAmountBirr}</div>
              </div>
              <div class="footer">
                <p>Thank you for choosing Theatre Hub!</p>
                <p>Please arrive 30 minutes before show time.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const closeModal = (): void => {
    setShowSuccess(false);
    setBookingData(null);
    onClose();
    setTimeout(() => {
      setStep(1);
      setSelectedSeats([]);
      setCustomerInfo({ name: "", email: "", phone: "" });
      setSelectedSchedule(null);
      setError("");
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-6xl mx-auto mt-16 mb-16"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 text-white relative overflow-hidden">
                  <div className="relative flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Ticket className="h-6 w-6" />
                        {show.title}
                      </h2>
                      <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {show.venue}
                        </span>
                        {show.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {show.duration} min
                          </span>
                        )}
                        {show.genre && (
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {show.genre}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-white/20 rounded-lg transition"
                      type="button"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="px-6 pt-6">
                  <div className="flex items-center justify-between">
                    {[
                      { step: 1, label: "Select Seats", icon: Armchair },
                      { step: 2, label: "Your Info", icon: User },
                      { step: 3, label: "Payment", icon: CreditCard },
                    ].map((item, i) => (
                      <div key={item.step} className="flex-1 relative">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                              step >= item.step
                                ? "bg-teal-600 text-white shadow-lg"
                                : "bg-gray-200 dark:bg-dark-700 text-gray-500"
                            }`}
                          >
                            {step > item.step ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <item.icon className="h-5 w-5" />
                            )}
                          </div>
                          <div className="text-xs mt-2 font-medium hidden sm:block">
                            {item.label}
                          </div>
                        </div>
                        {i < 2 && (
                          <div
                            className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 transition-all duration-300 ${
                              step > item.step
                                ? "bg-teal-600"
                                : "bg-gray-200 dark:bg-dark-700"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-600 dark:text-red-400 text-sm rounded flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </motion.div>
                  )}

                  {/* Step 1: Seat Selection */}
                  {step === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column - Seat Map */}
                      <div>
                        {!selectedSchedule ? (
                          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-800 rounded-2xl h-full flex flex-col items-center justify-center">
                            <Calendar className="w-16 h-16 text-teal-500 mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                              Select a show time first
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              Choose from the available times on the right
                            </p>
                          </div>
                        ) : loadingSeats ? (
                          <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin h-8 w-8 text-teal-600" />
                          </div>
                        ) : seats.length === 0 ? (
                          <div className="text-center py-20">
                            <Armchair className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No seats available</p>
                          </div>
                        ) : (
                          <>
                            <div className="text-center mb-6">
                              <div className="w-64 h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full mx-auto relative">
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-semibold">
                                  SCREEN
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 mt-4">
                                {hallData?.name || "Hall"} • {seats.length}{" "}
                                seats • {selectedSchedule.time}
                              </p>
                            </div>

                            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                              {sortedRows.map((row) => {
                                const rowSeats = seatsByRow[row];
                                if (!rowSeats || rowSeats.length === 0)
                                  return null;

                                return (
                                  <div
                                    key={row}
                                    className="flex items-center gap-3"
                                  >
                                    <span className="w-8 text-sm font-mono font-semibold text-gray-500">
                                      {row}
                                    </span>
                                    <div className="flex gap-1.5 flex-wrap">
                                      {rowSeats.map((seat) => {
                                        const isSelected = isSeatSelected(
                                          seat.id,
                                        );
                                        const isReserved = isSeatReserved(seat);
                                        const seatColor = getSeatColor(
                                          seat.seat_level_id,
                                        );
                                        const seatLevel = getSeatLevel(
                                          seat.seat_level_id,
                                        );

                                        return (
                                          <motion.button
                                            key={seat.id}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                              handleSeatSelect(seat)
                                            }
                                            disabled={isReserved}
                                            type="button"
                                            className={`
                                              relative w-9 h-9 rounded-lg transition-all duration-200
                                              flex items-center justify-center text-xs font-medium
                                              ${
                                                isReserved
                                                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50 line-through"
                                                  : isSelected
                                                    ? "bg-teal-600 text-white shadow-lg scale-105 ring-2 ring-teal-400"
                                                    : "hover:shadow-lg cursor-pointer border-2 border-transparent hover:border-teal-400"
                                              }
                                            `}
                                            style={{
                                              backgroundColor:
                                                !isReserved && !isSelected
                                                  ? seatColor
                                                  : undefined,
                                            }}
                                          >
                                            {getSeatIcon(seat.seat_level_id)}
                                          </motion.button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Legend */}
                            {seatLevels.length > 0 && (
                              <div className="flex flex-wrap justify-center gap-3 mt-6 pt-4 border-t">
                                {seatLevels.map((level) => (
                                  <div
                                    key={level.id}
                                    className="flex items-center gap-1.5"
                                  >
                                    <div
                                      className="w-3 h-3 rounded"
                                      style={{ backgroundColor: level.color }}
                                    />
                                    <span className="text-xs text-gray-600">
                                      {level.display_name}
                                    </span>
                                  </div>
                                ))}
                                <div className="flex items-center gap-1.5">
                                  <div className="w-3 h-3 rounded bg-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    Reserved
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-3 h-3 rounded bg-teal-600" />
                                  <span className="text-xs text-gray-600">
                                    Selected
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Right Column - Schedule & Summary */}
                      <div>
                        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-xl p-4 mb-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-teal-600" />
                            Select Show Time
                          </h3>

                          {loadingSchedules ? (
                            <div className="flex justify-center py-4">
                              <Loader2 className="animate-spin h-6 w-6 text-teal-600" />
                            </div>
                          ) : schedules.length === 0 ? (
                            <div className="text-center py-6">
                              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                              <p className="text-yellow-700 font-medium">
                                No show times available
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-[280px] overflow-y-auto">
                              {schedules.map((s) => (
                                <div
                                  key={s.id}
                                  onClick={() => {
                                    setSelectedSchedule(s);
                                    setSelectedSeats([]);
                                  }}
                                  className={`
                                    p-3 rounded-xl border-2 cursor-pointer transition-all
                                    ${
                                      selectedSchedule?.id === s.id
                                        ? "border-teal-500 bg-teal-100 dark:bg-teal-900/30 shadow-md"
                                        : "border-gray-200 dark:border-dark-700 hover:border-teal-300"
                                    }
                                  `}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <span className="font-semibold">
                                        {s.day}
                                      </span>
                                      <p className="text-xs text-gray-500">
                                        {s.date}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <div className="flex items-center gap-1 text-teal-600 font-medium text-sm">
                                        <Clock className="h-3 w-3" />
                                        {s.time}
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        {s.availableSeats} seats left
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Booking Summary */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-800 rounded-xl p-5">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Ticket className="h-4 w-4 text-teal-600" />
                            Booking Summary
                          </h4>

                          {selectedSeats.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 text-sm">
                              <Armchair className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              No seats selected
                            </div>
                          ) : (
                            <>
                              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {selectedSeats.map((seat) => {
                                  const seatLevel = getSeatLevel(
                                    seat.seat_level_id,
                                  );
                                  return (
                                    <div
                                      key={seat.id}
                                      className="flex justify-between items-center text-sm"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-2.5 h-2.5 rounded"
                                          style={{
                                            backgroundColor: seatLevel?.color,
                                          }}
                                        />
                                        <span>
                                          {seat.seat_label} (
                                          {seatLevel?.display_name})
                                        </span>
                                      </div>
                                      <span className="font-medium">
                                        {formatCurrency(
                                          getSeatPrice(seat.seat_level_id),
                                        )}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="mt-3 pt-3 border-t">
                                <div className="flex justify-between items-center font-bold">
                                  <span>Total</span>
                                  <span className="text-xl text-teal-600">
                                    {formatCurrency(calculateTotal())}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Customer Info */}
                  {step === 2 && (
                    <div className="max-w-lg mx-auto">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6 text-center">
                        <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                        <h3 className="text-xl font-bold mb-2">
                          Almost there!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Please provide your contact details to receive the
                          tickets
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={customerInfo.name}
                              onChange={(e) =>
                                setCustomerInfo({
                                  ...customerInfo,
                                  name: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                              }}
                              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 transition"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="email"
                              value={customerInfo.email}
                              onChange={(e) =>
                                setCustomerInfo({
                                  ...customerInfo,
                                  email: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                              }}
                              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 transition"
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="tel"
                              value={customerInfo.phone}
                              onChange={(e) =>
                                setCustomerInfo({
                                  ...customerInfo,
                                  phone: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                              }}
                              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 transition"
                              placeholder="09XXXXXXXX"
                            />
                          </div>
                        </div>

                        {/* Booking Summary Card */}
                        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-5">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Show:</span>
                            <span className="font-medium">
                              {selectedSchedule?.day}, {selectedSchedule?.date}{" "}
                              at {selectedSchedule?.time}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Seats:</span>
                            <span className="font-medium">
                              {selectedSeats
                                .map((s) => s.seat_label)
                                .join(", ")}
                            </span>
                          </div>
                          <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total:</span>
                            <span className="text-teal-600">
                              {formatCurrency(calculateTotal())}
                            </span>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-800 dark:text-blue-300">
                              <p className="font-medium mb-1">Secure Booking</p>
                              <p>
                                Your information is encrypted and secure. A
                                confirmation will be sent to your email.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 3 && (
                    <div className="max-w-lg mx-auto">
                      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 text-center mb-6">
                        <div className="text-5xl font-bold text-teal-600 mb-2">
                          {formatCurrency(calculateTotal())}
                        </div>
                        <p className="text-gray-600">
                          for {selectedSeats.length} ticket(s)
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1 bg-white/50 rounded-full px-3 py-1 text-xs">
                          <Ticket className="h-3 w-3" />
                          {selectedSeats.map((s) => s.seat_label).join(", ")}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                            <Wallet className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-green-800 text-lg">
                              Secure Payment
                            </h4>
                            <p className="text-xs text-green-600">
                              Powered by Chapa Payment Gateway
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {[
                            { icon: CreditCard, name: "Credit/Debit Card" },
                            { icon: Phone, name: "Telebirr" },
                            { icon: Wallet, name: "CBE Birr" },
                          ].map((method) => (
                            <div
                              key={method.name}
                              className="flex items-center gap-3 p-3 bg-white dark:bg-dark-800 rounded-xl hover:shadow-md transition cursor-pointer border border-transparent hover:border-green-300"
                            >
                              <method.icon className="h-5 w-5 text-green-600" />
                              <span className="text-sm">{method.name}</span>
                              <div className="ml-auto">
                                <div className="w-4 h-4 rounded-full border-2 border-green-600" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-lg flex items-center justify-center gap-2"
                        type="button"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" />
                            Pay {formatCurrency(calculateTotal())}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer Navigation */}
                {(step === 1 || step === 2) && (
                  <div className="px-6 py-4 border-t bg-gray-50 dark:bg-dark-800/50 flex justify-between">
                    {step > 1 && (
                      <button
                        onClick={handleBack}
                        type="button"
                        className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition"
                      >
                        <ChevronLeft className="h-4 w-4 inline mr-1" /> Back
                      </button>
                    )}
                    <button
                      onClick={handleNext}
                      type="button"
                      className={`px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-md transition ${
                        step === 1 ? "ml-auto" : ""
                      }`}
                    >
                      Continue{" "}
                      {step === 1 ? (
                        <ChevronRight className="h-4 w-4 inline ml-1" />
                      ) : (
                        <Sparkles className="h-4 w-4 inline ml-1" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && bookingData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/70" onClick={closeModal} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="h-10 w-10 text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-gray-500 mb-6">
                  Your tickets have been booked successfully
                </p>

                <div className="bg-gray-50 dark:bg-dark-700 rounded-xl p-4 text-left mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Booking ID:</span>
                      <span className="font-mono font-semibold">
                        {bookingData.bookingId.substring(0, 12)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Show:</span>
                      <span className="font-medium">{bookingData.show}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">When:</span>
                      <span>
                        {bookingData.selectedSchedule?.day},{" "}
                        {bookingData.selectedSchedule?.date} at{" "}
                        {bookingData.selectedSchedule?.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Seats:</span>
                      <span>
                        {bookingData.tickets.map((t) => t.seat).join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold">
                      <span>Total Paid:</span>
                      <span className="text-teal-600">
                        {bookingData.totalAmountBirr}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={printBooking}
                    className="flex-1 py-3 border-2 border-teal-600 text-teal-600 rounded-xl font-medium hover:bg-teal-50 transition"
                    type="button"
                  >
                    <Printer className="h-4 w-4 inline mr-2" /> Print
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-md transition"
                    type="button"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookingModal;