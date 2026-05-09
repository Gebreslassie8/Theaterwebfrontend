// frontend/src/components/Booking/BookingModal.tsx
import React, { useState, useEffect } from "react";
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
  Download,
  Printer,
  Award,
  Crown,
  Users,
  QrCode,
  Share2,
  Copy,
  Check,
  Wallet,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import supabase from "@/config/supabaseClient";

// Types
interface Schedule {
  id: string;
  event_id: string;
  hall_id: string;
  show_date: string;
  start_time: string;
  end_time: string;
  hall?: {
    id: string;
    name: string;
    num_of_row: number;
    num_of_col: number;
  };
}

interface Show {
  id: string;
  title: string;
  venue?: string;
  poster_url?: string;
  duration_minutes?: number;
}

interface SeatLevel {
  id: string;
  name: string;
  display_name: string;
  price: number;
  color: string;
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
  seat_level?: SeatLevel;
}

interface SeatDetail {
  seatId: string;
  row: string;
  number: number;
  section: string;
  price: number;
  levelId: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface ValidationField {
  isValid: boolean;
  message: string;
  touched: boolean;
}

interface Validation {
  name: ValidationField;
  email: ValidationField;
  phone: ValidationField;
}

interface Ticket {
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
  schedule: Schedule;
}

interface BookingInfo {
  bookingId: string;
  tx_ref: string;
  show: string;
  show_id: string;
  schedule_id: string;
  hall_id: string;
  seats: string[];
  seatDetails: Record<string, SeatDetail>;
  totalSeats: number;
  totalAmount: number;
  totalAmountBirr: string;
  customerInfo: CustomerInfo;
  paymentMethod: string;
  paymentDetails: {
    transactionReference: string;
    paymentStatus: string;
    paymentDate: string;
  };
  bookingDate: string;
  status: string;
  venue: string;
  tickets: Ticket[];
  selectedSchedule: Schedule;
}

interface BookingModalProps {
  show: Show;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (booking: BookingInfo) => void;
}

// Utility functions
const formatEthiopianBirr = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const generateTransactionRef = (): string => {
  return `TXT-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
};

const generateUniqueQRData = (ticket: Ticket, index: number): any => {
  return {
    ticketId: ticket.ticketId,
    ticketNumber: index + 1,
    totalTickets: ticket.totalTickets,
    bookingId: ticket.bookingId,
    show: ticket.show,
    seat: ticket.seat,
    row: ticket.row,
    number: ticket.number,
    section: ticket.section,
    customerName: ticket.customerName,
    customerPhone: ticket.customerPhone,
    venue: ticket.venue,
    price: ticket.price,
    schedule: {
      date: ticket.schedule.show_date,
      time: ticket.schedule.start_time,
    },
    verificationCode: `${ticket.ticketId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    verificationUrl: `${window.location.origin}/verify/${ticket.ticketId}`,
  };
};

const validateEthiopianPhone = (phone: string): boolean => {
  const ethiopianPhoneRegex = /^(?:\+251|0)?[97]\d{8}$/;
  return ethiopianPhoneRegex.test(phone);
};

const BookingModal: React.FC<BookingModalProps> = ({
  show,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  const [step, setStep] = useState<number>(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatDetails, setSeatDetails] = useState<Record<string, SeatDetail>>(
    {},
  );
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<BookingInfo | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<number, boolean>>({});
  const [sharedStates, setSharedStates] = useState<Record<number, boolean>>({});
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Real data states
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );
  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatLevels, setSeatLevels] = useState<SeatLevel[]>([]);
  const [hallInfo, setHallInfo] = useState<any>(null);

  // Validation states
  const [validation, setValidation] = useState<Validation>({
    name: { isValid: true, message: "", touched: false },
    email: { isValid: true, message: "", touched: false },
    phone: { isValid: true, message: "", touched: false },
  });

  // Load schedules when modal opens
  useEffect(() => {
    if (isOpen && show.id) {
      loadSchedules();
    }
  }, [isOpen, show.id]);

  // Load seats when schedule is selected
  useEffect(() => {
    if (selectedSchedule) {
      loadSeatsAndLevels(selectedSchedule.hall_id);
    }
  }, [selectedSchedule]);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("show_schedules")
        .select(
          `
          *,
          hall:halls(*)
        `,
        )
        .eq("event_id", show.id)
        .eq("is_active", true)
        .gte("show_date", new Date().toISOString().split("T")[0])
        .order("show_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error("Error loading schedules:", error);
      setError("Failed to load show schedules");
    } finally {
      setLoading(false);
    }
  };

  const loadSeatsAndLevels = async (hallId: string) => {
    setLoading(true);
    try {
      // Load seat levels
      const { data: levelsData, error: levelsError } = await supabase
        .from("seat_levels")
        .select("*")
        .eq("hall_id", hallId)
        .eq("is_active", true);

      if (levelsError) throw levelsError;
      setSeatLevels(levelsData || []);

      // Load seats with their levels
      const { data: seatsData, error: seatsError } = await supabase
        .from("seats")
        .select(
          `
          *,
          seat_level:seat_level_id(*)
        `,
        )
        .eq("hall_id", hallId)
        .eq("is_active", true)
        .order("seat_row", { ascending: true })
        .order("seat_number", { ascending: true });

      if (seatsError) throw seatsError;
      setSeats(seatsData || []);

      // Get hall info
      const { data: hallData } = await supabase
        .from("halls")
        .select("*")
        .eq("id", hallId)
        .single();

      setHallInfo(hallData);
    } catch (error) {
      console.error("Error loading seats:", error);
      setError("Failed to load seating data");
    } finally {
      setLoading(false);
    }
  };

  const getSeatLevel = (levelId: string | null): SeatLevel | undefined => {
    return seatLevels.find((level) => level.id === levelId);
  };

  const getSeatsByRow = () => {
    const grouped: Record<string, Seat[]> = {};
    seats.forEach((seat) => {
      if (!grouped[seat.seat_row]) {
        grouped[seat.seat_row] = [];
      }
      grouped[seat.seat_row].push(seat);
    });
    Object.keys(grouped).forEach((row) => {
      grouped[row].sort((a, b) => a.seat_number - b.seat_number);
    });
    return grouped;
  };

  const getSortedRows = (): string[] => {
    const rows = [...new Set(seats.map((seat) => seat.seat_row))];
    return rows.sort((a, b) => {
      const aNum = rowLetterToNumber(a);
      const bNum = rowLetterToNumber(b);
      return aNum - bNum;
    });
  };

  const rowLetterToNumber = (letter: string): number => {
    let result = 0;
    for (let i = 0; i < letter.length; i++) {
      result = result * 26 + (letter.charCodeAt(i) - 64);
    }
    return result;
  };

  const handleSeatSelect = (seatId: string): void => {
    const seat = seats.find((s) => s.id === seatId);
    if (seat?.is_reserved) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        const newSeats = prev.filter((id) => id !== seatId);
        setSeatDetails((prevDetails) => {
          const newDetails = { ...prevDetails };
          delete newDetails[seatId];
          return newDetails;
        });
        return newSeats;
      } else {
        if (seat) {
          const level = getSeatLevel(seat.seat_level_id);
          setSeatDetails((prev) => ({
            ...prev,
            [seatId]: {
              seatId,
              row: seat.seat_row,
              number: seat.seat_number,
              section: level?.display_name || "Standard",
              price: level?.price || 0,
              levelId: seat.seat_level_id || "",
            },
          }));
        }
        return [...prev, seatId];
      }
    });
  };

  const calculateTotal = (): number => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find((s) => s.id === seatId);
      const level = getSeatLevel(seat?.seat_level_id || null);
      return total + (level?.price || 0);
    }, 0);
  };

  const handleFieldChange = (
    field: keyof CustomerInfo,
    value: string,
  ): void => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    setValidation((prev) => ({
      ...prev,
      [field]: { ...prev[field], touched: true },
    }));

    if (field === "name") {
      const isValid = value.trim().length >= 2;
      setValidation((prev) => ({
        ...prev,
        name: {
          ...prev.name,
          isValid,
          message: isValid ? "" : t("bookingModal.validation.nameTooShort"),
        },
      }));
    }

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(value);
      setValidation((prev) => ({
        ...prev,
        email: {
          ...prev.email,
          isValid,
          message: isValid ? "" : t("bookingModal.validation.invalidEmail"),
        },
      }));
    }

    if (field === "phone") {
      const isValid = validateEthiopianPhone(value);
      setValidation((prev) => ({
        ...prev,
        phone: {
          ...prev.phone,
          isValid,
          message: isValid ? "" : t("bookingModal.validation.invalidPhone"),
        },
      }));
    }
  };

  const handleNext = (): void => {
    if (step === 1) {
      if (!selectedSchedule) {
        setError(t("bookingModal.errors.noSchedule"));
        return;
      }
      if (selectedSeats.length === 0) {
        setError(t("bookingModal.errors.noSeats"));
        return;
      }
    }
    if (step === 2) {
      if (
        !customerInfo.name ||
        !validation.name.isValid ||
        !customerInfo.email ||
        !validation.email.isValid ||
        !customerInfo.phone ||
        !validation.phone.isValid
      ) {
        setError(t("bookingModal.errors.incompleteInfo"));
        return;
      }
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = (): void => {
    setStep((prev) => prev - 1);
    setError("");
  };

  const generateTickets = (tx_ref: string, schedule: Schedule): Ticket[] => {
    const bookingId = `TKT${Date.now()}${Math.random().toString(36).substring(2, 10)}`;
    const totalSeatsCount = selectedSeats.length;

    return selectedSeats.map((seatId, index) => {
      const seat = seats.find((s) => s.id === seatId);
      const level = getSeatLevel(seat?.seat_level_id || null);
      const ticketId = `${bookingId}${Math.random().toString(36).substring(2, 8)}`;

      const ticketData: Ticket = {
        ticketId: ticketId,
        bookingId: bookingId,
        tx_ref: tx_ref,
        ticketNumber: index + 1,
        totalTickets: totalSeatsCount,
        show: show.title,
        seat: seat?.seat_label || seatId,
        row: seat?.seat_row || "",
        number: seat?.seat_number || 0,
        section: level?.display_name || "Standard",
        price: level?.price || 0,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        venue: show.venue || hallInfo?.name || "Theatre Hub",
        qrData: null,
        schedule: schedule,
      };
      ticketData.qrData = generateUniqueQRData(ticketData, index);
      return ticketData;
    });
  };

  const createBooking = async (
    tx_ref: string,
    schedule: Schedule,
  ): Promise<void> => {
    const tickets = generateTickets(tx_ref, schedule);
    const bookingId = tickets[0]?.bookingId || `TKT${Date.now()}`;

    // Create booking record
    const bookingRecord = {
      booking_code: bookingId,
      show_schedule_id: schedule.id,
      booking_status: "confirmed",
      number_of_seats: selectedSeats.length,
      final_amount: calculateTotal(),
    };

    const { data: newBooking, error: bookingError } = await supabase
      .from("bookings")
      .insert([bookingRecord])
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Create payment record
    const paymentRecord = {
      booking_id: newBooking.id,
      payment_code: `PAY-${tx_ref}`,
      amount: calculateTotal(),
      payment_method: "card",
      payment_status: "completed",
      transaction_id: tx_ref,
      payment_date: new Date().toISOString(),
    };

    const { error: paymentError } = await supabase
      .from("payments")
      .insert([paymentRecord]);

    if (paymentError) console.error("Error creating payment:", paymentError);

    // Update seats as reserved
    for (const seatId of selectedSeats) {
      await supabase
        .from("seats")
        .update({ is_reserved: true })
        .eq("id", seatId);
    }

    const bookingInfo: BookingInfo = {
      bookingId: bookingId,
      tx_ref: tx_ref,
      show: show.title,
      show_id: show.id,
      schedule_id: schedule.id,
      hall_id: schedule.hall_id,
      seats: selectedSeats,
      seatDetails: seatDetails,
      totalSeats: selectedSeats.length,
      totalAmount: calculateTotal(),
      totalAmountBirr: formatEthiopianBirr(calculateTotal()),
      customerInfo,
      paymentMethod: "chapa",
      paymentDetails: {
        transactionReference: tx_ref,
        paymentStatus: "completed",
        paymentDate: new Date().toISOString(),
      },
      bookingDate: new Date().toISOString(),
      status: "confirmed",
      venue: show.venue || hallInfo?.name || "Theatre Hub",
      tickets: tickets,
      selectedSchedule: schedule,
    };

    setBookingData(bookingInfo);
    setShowTicketModal(true);
    setIsProcessing(false);
    onConfirm(bookingInfo);
  };

  const initializePayment = async (): Promise<void> => {
    if (!selectedSchedule) {
      setError(t("bookingModal.errors.noSchedule"));
      return;
    }

    setIsProcessing(true);
    setError("");

    const tx_ref = generateTransactionRef();

    try {
      await createBooking(tx_ref, selectedSchedule);
    } catch (err) {
      console.error("Booking error:", err);
      setError(t("bookingModal.errors.paymentFailed"));
      setIsProcessing(false);
    }
  };

  const handleConfirm = async (): Promise<void> => {
    await initializePayment();
  };

  const copyQRCodeData = (ticket: Ticket, index: number): void => {
    const qrDataString = JSON.stringify(ticket.qrData, null, 2);
    navigator.clipboard.writeText(qrDataString).then(() => {
      setCopiedStates((prev) => ({ ...prev, [index]: true }));
      setTimeout(
        () => setCopiedStates((prev) => ({ ...prev, [index]: false })),
        2000,
      );
    });
  };

  const shareQRCode = async (ticket: Ticket, index: number): Promise<void> => {
    const shareData = {
      title: t("bookingModal.share.title", { seat: ticket.seat }),
      text: t("bookingModal.share.text", {
        show: ticket.show,
        seat: ticket.seat,
        row: ticket.row,
        number: ticket.number,
        customerName: ticket.customerName,
        ticketId: ticket.ticketId,
      }),
      url: ticket.qrData.verificationUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setSharedStates((prev) => ({ ...prev, [index]: true }));
        setTimeout(
          () => setSharedStates((prev) => ({ ...prev, [index]: false })),
          2000,
        );
      } catch (err) {
        navigator.clipboard.writeText(shareData.text);
        alert(t("bookingModal.share.copiedFallback"));
      }
    } else {
      navigator.clipboard.writeText(
        `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`,
      );
      setCopiedStates((prev) => ({ ...prev, [index]: true }));
      setTimeout(
        () => setCopiedStates((prev) => ({ ...prev, [index]: false })),
        2000,
      );
    }
  };

  const downloadTicket = (ticket: Ticket, index: number): void => {
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"><title>${t("bookingModal.ticketHtml.title")}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
          .ticket { max-width: 400px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .ticket-header { background: linear-gradient(135deg, #0f766e, #1e3a8a); color: white; padding: 20px; text-align: center; }
          .ticket-content { padding: 20px; }
          .qr-code { text-align: center; margin: 20px 0; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .detail { background: #f8f8f8; padding: 10px; border-radius: 8px; }
          .detail-label { font-size: 10px; color: #666; margin-bottom: 4px; }
          .detail-value { font-weight: bold; color: #333; }
        </style>
        </head>
        <body>
          <div class="ticket">
            <div class="ticket-header"><h2>${t("bookingModal.brand")}</h2></div>
            <div class="ticket-content">
              <h3>${ticket.show}</h3>
              <div class="qr-code" id="qr-code-${index}"></div>
              <div class="details">
                <div class="detail"><div class="detail-label">${t("bookingModal.ticketModal.seat")}</div><div class="detail-value">${ticket.seat}</div></div>
                <div class="detail"><div class="detail-label">${t("bookingModal.ticketModal.ticketHolder")}</div><div class="detail-value">${ticket.customerName}</div></div>
                <div class="detail"><div class="detail-label">${t("bookingModal.ticketModal.seatType")}</div><div class="detail-value">${ticket.section}</div></div>
                <div class="detail"><div class="detail-label">${t("bookingModal.ticketModal.price")}</div><div class="detail-value">${formatEthiopianBirr(ticket.price)}</div></div>
                <div class="detail"><div class="detail-label">${t("bookingModal.schedule.showtime")}</div><div class="detail-value">${new Date(ticket.schedule.show_date).toLocaleDateString()} at ${ticket.schedule.start_time.substring(0, 5)}</div></div>
              </div>
            </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs2-fix/qrcode.min.js"></script>
          <script>new QRCode(document.getElementById("qr-code-${index}"), { text: ${JSON.stringify(JSON.stringify(ticket.qrData))}, width: 150, height: 150 });<\/script>
        </body>
      </html>
    `;
    const blob = new Blob([ticketHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${t("bookingModal.ticketHtml.filenamePrefix")}_${ticket.seat}_${ticket.ticketId}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printAllTickets = (): void => {
    if (!bookingData) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${t("bookingModal.printAll.title")}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .ticket { border: 1px solid #ddd; border-radius: 12px; margin-bottom: 20px; padding: 16px; max-width: 400px; margin: 0 auto 20px; }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs2-fix/qrcode.min.js"><\/script>
        </head>
        <body>
    `);

    bookingData.tickets.forEach((ticket, idx) => {
      printWindow.document.write(`
        <div class="ticket">
          <h3>${ticket.show}</h3>
          <div id="qr-print-${idx}"></div>
          <p><strong>${t("bookingModal.ticketModal.seat")}:</strong> ${ticket.seat}</p>
          <p><strong>${t("bookingModal.ticketModal.ticketHolder")}:</strong> ${ticket.customerName}</p>
          <p><strong>${t("bookingModal.schedule.showtime")}:</strong> ${new Date(ticket.schedule.show_date).toLocaleDateString()} at ${ticket.schedule.start_time.substring(0, 5)}</p>
        </div>
      `);
    });

    printWindow.document.write(`</body></html>`);
    printWindow.document.close();

    bookingData.tickets.forEach((_, i) => {
      const qrDiv = printWindow.document.getElementById(`qr-print-${i}`);
      if (qrDiv) {
        new (printWindow as any).QRCode(qrDiv, {
          text: JSON.stringify(bookingData.tickets[i].qrData),
          width: 150,
          height: 150,
        });
      }
    });
    printWindow.print();
  };

  const getSeatColor = (seat: Seat): string => {
    const level = getSeatLevel(seat.seat_level_id);

    if (seat.is_reserved) return "bg-gray-300 cursor-not-allowed opacity-50";
    if (selectedSeats.includes(seat.id))
      return "bg-teal-600 text-white ring-2 ring-teal-500 ring-offset-2 shadow-lg transform scale-105";

    return `bg-${level?.color || "gray"}-100 hover:bg-${level?.color || "gray"}-200 border-2 border-${level?.color || "gray"}-300 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer`;
  };

  const closeTicketModal = (): void => {
    setShowTicketModal(false);
    setBookingData(null);
    onClose();
    setStep(1);
    setSelectedSeats([]);
    setSeatDetails({});
    setCustomerInfo({ name: "", email: "", phone: "" });
    setSelectedSchedule(null);
  };

  if (!isOpen) return null;

  const seatsByRow = getSeatsByRow();
  const sortedRows = getSortedRows();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-6xl mx-auto mt-16 mb-16"
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Ticket className="h-6 w-6" />
                        {t("bookingModal.brand")}
                      </h2>
                      <p className="text-white/80 text-sm mt-1">{show.title}</p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900">
                  <div className="flex items-center justify-between max-w-2xl mx-auto">
                    {[
                      {
                        step: 1,
                        labelKey: "bookingModal.progress.selectSeats",
                        icon: Ticket,
                      },
                      {
                        step: 2,
                        labelKey: "bookingModal.progress.yourInfo",
                        icon: User,
                      },
                      {
                        step: 3,
                        labelKey: "bookingModal.progress.payment",
                        icon: CreditCard,
                      },
                    ].map((item) => (
                      <div key={item.step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step >= item.step ? "bg-teal-600 text-white shadow-lg" : "bg-gray-200 dark:bg-dark-700 text-gray-500"}`}
                          >
                            {step > item.step ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <item.icon className="h-5 w-5" />
                            )}
                          </div>
                          <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 hidden sm:block font-medium">
                            {t(item.labelKey)}
                          </span>
                        </div>
                        {item.step < 3 && (
                          <div className="flex-1 h-0.5 bg-gray-200 dark:bg-dark-700">
                            <div
                              className={`h-full bg-teal-600 transition-all duration-500 ${step > item.step ? "w-full" : "w-0"}`}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {/* Step 1: Schedule + Seat Selection */}
                  {step === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* LEFT COLUMN: Seat Map */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                          {t("bookingModal.seatSelection.title")}
                        </h3>

                        {!selectedSchedule ? (
                          <div className="text-center py-12 text-gray-500">
                            <p>
                              Please select a show time on the right to view
                              available seats
                            </p>
                          </div>
                        ) : loading ? (
                          <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
                          </div>
                        ) : (
                          <>
                            <div className="p-4 bg-gradient-to-r from-teal-600/10 to-emerald-600/5 rounded-xl border border-teal-600/20">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  {t(
                                    "bookingModal.seatSelection.selectedSeats",
                                  )}
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {selectedSeats.length}{" "}
                                  {t("bookingModal.seatSelection.seatsCount")}
                                </span>
                              </div>
                              {selectedSeats.length > 0 && (
                                <div className="flex items-center justify-between font-bold border-t border-teal-600/20 pt-2 mt-2">
                                  <span>
                                    {t("bookingModal.seatSelection.total")}
                                  </span>
                                  <span className="text-teal-600 text-xl">
                                    {formatEthiopianBirr(calculateTotal())}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Seat Legend */}
                            <div className="flex flex-wrap items-center justify-center gap-4">
                              {seatLevels.map((level) => (
                                <div
                                  key={level.id}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className="w-5 h-5 rounded"
                                    style={{
                                      backgroundColor: level.color,
                                      opacity: 0.7,
                                    }}
                                  />
                                  <span className="text-xs text-gray-600">
                                    {level.display_name}
                                  </span>
                                </div>
                              ))}
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-teal-600" />
                                <span className="text-xs text-gray-600">
                                  {t("bookingModal.seatLegend.selected")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-gray-300" />
                                <span className="text-xs text-gray-600">
                                  {t("bookingModal.seatLegend.reserved")}
                                </span>
                              </div>
                            </div>

                            {/* Stage */}
                            <div className="text-center">
                              <div className="relative">
                                <div className="w-64 h-1.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full mx-auto"></div>
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 uppercase tracking-wider">
                                  {t("bookingModal.seatSelection.stage")}
                                </div>
                              </div>
                            </div>

                            {/* Seat Grid */}
                            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                              <div className="inline-block min-w-[500px]">
                                {sortedRows.map((row) => {
                                  const rowSeats = seatsByRow[row] || [];
                                  if (rowSeats.length === 0) return null;

                                  return (
                                    <div
                                      key={row}
                                      className="flex items-center mb-2"
                                    >
                                      <div className="w-8 text-center font-mono font-bold text-gray-400 text-sm">
                                        {row}
                                      </div>
                                      <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
                                        {rowSeats.map((seat) => {
                                          const level = getSeatLevel(
                                            seat.seat_level_id,
                                          );
                                          return (
                                            <button
                                              key={seat.id}
                                              onClick={() =>
                                                handleSeatSelect(seat.id)
                                              }
                                              disabled={seat.is_reserved}
                                              onMouseEnter={() =>
                                                setHoveredSeat(seat.id)
                                              }
                                              onMouseLeave={() =>
                                                setHoveredSeat(null)
                                              }
                                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                              style={{
                                                backgroundColor:
                                                  seat.is_reserved
                                                    ? "#D1D5DB"
                                                    : selectedSeats.includes(
                                                          seat.id,
                                                        )
                                                      ? "#0D9488"
                                                      : level?.color ||
                                                        "#E5E7EB",
                                                color: selectedSeats.includes(
                                                  seat.id,
                                                )
                                                  ? "white"
                                                  : "#1F2937",
                                                transform:
                                                  hoveredSeat === seat.id &&
                                                  !seat.is_reserved &&
                                                  !selectedSeats.includes(
                                                    seat.id,
                                                  )
                                                    ? "scale(1.05)"
                                                    : "scale(1)",
                                              }}
                                              title={`${level?.display_name || "Standard"} - ${formatEthiopianBirr(level?.price || 0)}`}
                                            >
                                              {seat.seat_number}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {selectedSeats.length > 0 && (
                              <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                  <Ticket className="h-4 w-4 text-teal-600" />
                                  {t(
                                    "bookingModal.seatSelection.selectedSeatsList",
                                    { count: selectedSeats.length },
                                  )}
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {selectedSeats.map((seatId) => {
                                    const seat = seats.find(
                                      (s) => s.id === seatId,
                                    );
                                    const level = getSeatLevel(
                                      seat?.seat_level_id || null,
                                    );
                                    return (
                                      <div
                                        key={seatId}
                                        className="flex items-center justify-between p-2 bg-white dark:bg-dark-800 rounded-lg border border-gray-200"
                                      >
                                        <div>
                                          <p className="font-medium text-gray-900 dark:text-white">
                                            {seat?.seat_label}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {level?.display_name || "Standard"}
                                          </p>
                                        </div>
                                        <p className="text-sm font-semibold text-teal-600">
                                          {formatEthiopianBirr(
                                            level?.price || 0,
                                          )}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* RIGHT COLUMN: Schedule Cards */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
                          {t("bookingModal.schedule.selectSchedule")}
                        </h3>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                          {schedules.map((schedule) => (
                            <div
                              key={schedule.id}
                              onClick={() => {
                                setSelectedSchedule(schedule);
                                setSelectedSeats([]);
                                setSeatDetails({});
                              }}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                selectedSchedule?.id === schedule.id
                                  ? "border-teal-600 bg-teal-50 dark:bg-teal-900/20 shadow-md ring-2 ring-teal-600/20"
                                  : "border-gray-200 dark:border-dark-600 hover:border-teal-600/50 hover:shadow"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-full ${selectedSchedule?.id === schedule.id ? "bg-teal-600 text-white" : "bg-gray-100 dark:bg-dark-700"}`}
                                  >
                                    <Calendar className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                      {new Date(
                                        schedule.show_date,
                                      ).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {schedule.hall?.name || "Main Hall"}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-medium">
                                      {schedule.start_time.substring(0, 5)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {schedules.length === 0 && !loading && (
                            <div className="text-center py-8 text-gray-500">
                              <p>No upcoming shows available</p>
                            </div>
                          )}
                          {loading && schedules.length === 0 && (
                            <div className="flex justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
                            </div>
                          )}
                        </div>
                        {selectedSchedule && (
                          <div className="mt-5 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              {t("bookingModal.schedule.selected", {
                                date: new Date(
                                  selectedSchedule.show_date,
                                ).toLocaleDateString(),
                                time: selectedSchedule.start_time.substring(
                                  0,
                                  5,
                                ),
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Customer Information */}
                  {step === 2 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                        {t("bookingModal.customerInfo.title")}
                      </h3>
                      <div className="space-y-5 max-w-2xl mx-auto">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("bookingModal.customerInfo.fullName")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={customerInfo.name}
                              onChange={(e) =>
                                handleFieldChange("name", e.target.value)
                              }
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                              placeholder={t(
                                "bookingModal.customerInfo.namePlaceholder",
                              )}
                            />
                          </div>
                          {validation.name.touched &&
                            !validation.name.isValid && (
                              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />{" "}
                                {validation.name.message}
                              </p>
                            )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("bookingModal.customerInfo.email")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="email"
                              value={customerInfo.email}
                              onChange={(e) =>
                                handleFieldChange("email", e.target.value)
                              }
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                              placeholder={t(
                                "bookingModal.customerInfo.emailPlaceholder",
                              )}
                            />
                          </div>
                          {validation.email.touched &&
                            !validation.email.isValid && (
                              <p className="mt-1 text-xs text-red-500">
                                {validation.email.message}
                              </p>
                            )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("bookingModal.customerInfo.phone")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="tel"
                              value={customerInfo.phone}
                              onChange={(e) =>
                                handleFieldChange("phone", e.target.value)
                              }
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                              placeholder={t(
                                "bookingModal.customerInfo.phonePlaceholder",
                              )}
                            />
                          </div>
                          {validation.phone.touched &&
                            !validation.phone.isValid && (
                              <p className="mt-1 text-xs text-red-500">
                                {validation.phone.message}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 3 && selectedSchedule && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                        {t("bookingModal.payment.title")}
                      </h3>
                      <div className="max-w-md mx-auto">
                        <div className="mb-6 p-6 bg-gradient-to-r from-teal-600/10 to-emerald-600/5 rounded-xl border border-teal-600/20">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 font-medium">
                              {t("bookingModal.payment.totalAmount")}
                            </span>
                            <span className="text-3xl font-bold text-teal-600">
                              {formatEthiopianBirr(calculateTotal())}
                            </span>
                          </div>
                          <div className="border-t border-teal-600/20 pt-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                {t("bookingModal.payment.tickets")}
                              </span>
                              <span className="font-medium">
                                {selectedSeats.length}{" "}
                                {t("bookingModal.seatSelection.seatsCount")}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-gray-500">
                                {t("bookingModal.payment.seats")}
                              </span>
                              <span className="font-mono text-sm">
                                {selectedSeats
                                  .map(
                                    (s) =>
                                      seats.find((seat) => seat.id === s)
                                        ?.seat_label,
                                  )
                                  .join(", ")}
                              </span>
                            </div>
                            {selectedSchedule && (
                              <div className="flex justify-between text-sm mt-2">
                                <span className="text-gray-500">
                                  {t("bookingModal.schedule.showtime")}
                                </span>
                                <span className="text-sm">
                                  {new Date(
                                    selectedSchedule.show_date,
                                  ).toLocaleDateString()}{" "}
                                  at{" "}
                                  {selectedSchedule.start_time.substring(0, 5)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                              <Wallet className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-green-800">
                                {t("bookingModal.payment.chapaTitle")}
                              </h4>
                              <p className="text-sm text-green-600">
                                {t("bookingModal.payment.chapaSubtitle")}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />{" "}
                              {t("bookingModal.payment.chapaFeature1")}
                            </p>
                            <p className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />{" "}
                              {t("bookingModal.payment.chapaFeature2")}
                            </p>
                            <p className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />{" "}
                              {t("bookingModal.payment.chapaFeature3")}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handleConfirm}
                          disabled={isProcessing}
                          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                              {t("bookingModal.payment.processing")}
                            </>
                          ) : (
                            <>
                              <Wallet className="h-5 w-5" />
                              {t("bookingModal.payment.payButton", {
                                amount: formatEthiopianBirr(calculateTotal()),
                              })}
                            </>
                          )}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">
                          {t("bookingModal.payment.terms")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
                  {step > 1 && step < 3 && (
                    <button
                      onClick={handleBack}
                      className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />{" "}
                      {t("bookingModal.buttons.back")}
                    </button>
                  )}
                  {step < 3 && (
                    <button
                      onClick={handleNext}
                      className="ml-auto px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      {t("bookingModal.buttons.next")}{" "}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ticket Modal */}
      {showTicketModal && bookingData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeTicketModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <QrCode className="h-6 w-6 text-teal-600" />{" "}
                  {t("bookingModal.ticketModal.title")}
                </h2>
                <p className="text-sm text-gray-500">
                  {bookingData.totalSeats}{" "}
                  {t("bookingModal.ticketModal.ticketCount", {
                    count: bookingData.totalSeats,
                  })}
                </p>
              </div>
              <button
                onClick={closeTicketModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-green-700 font-medium">
                  ✅{" "}
                  {t("bookingModal.ticketModal.paymentSuccess", {
                    bookingId: bookingData.bookingId,
                    total: bookingData.totalAmountBirr,
                  })}
                </p>
              </div>
              <div className="space-y-6">
                {bookingData.tickets.map((ticket, index) => (
                  <div
                    key={ticket.ticketId}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-teal-600/30"
                  >
                    <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold">
                            {t("bookingModal.brand")}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-xs">
                            {t("bookingModal.ticketModal.ticketOf", {
                              current: index + 1,
                              total: bookingData.totalSeats,
                            })}
                          </p>
                          <p className="text-[10px] font-mono">
                            {ticket.ticketId}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-center mb-5">
                        <div className="bg-white p-3 rounded-xl shadow-lg">
                          <QRCodeSVG
                            value={JSON.stringify(ticket.qrData)}
                            size={130}
                            level="H"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center gap-3 mb-4">
                        <button
                          onClick={() => shareQRCode(ticket, index)}
                          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg"
                        >
                          {sharedStates[index] ? (
                            <>
                              <Check className="h-4 w-4" />{" "}
                              {t("bookingModal.ticketModal.shared")}
                            </>
                          ) : (
                            <>
                              <Share2 className="h-4 w-4" />{" "}
                              {t("bookingModal.ticketModal.share")}
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => copyQRCodeData(ticket, index)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
                        >
                          {copiedStates[index] ? (
                            <>
                              <Check className="h-4 w-4" />{" "}
                              {t("bookingModal.ticketModal.copied")}
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />{" "}
                              {t("bookingModal.ticketModal.copyQR")}
                            </>
                          )}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-teal-600/5 p-3 rounded-xl">
                          <div className="text-xs text-gray-500">
                            {t("bookingModal.ticketModal.seat")}
                          </div>
                          <p className="font-bold text-2xl text-teal-600">
                            {ticket.seat}
                          </p>
                          <p className="text-xs">
                            {t("bookingModal.ticketModal.rowSeat", {
                              row: ticket.row,
                              number: ticket.number,
                            })}
                          </p>
                        </div>
                        <div className="bg-teal-600/5 p-3 rounded-xl">
                          <div className="text-xs text-gray-500">
                            {t("bookingModal.ticketModal.ticketHolder")}
                          </div>
                          <p className="font-semibold">{ticket.customerName}</p>
                        </div>
                        <div className="bg-teal-600/5 p-3 rounded-xl">
                          <div className="text-xs text-gray-500">
                            {t("bookingModal.ticketModal.seatType")}
                          </div>
                          <p className="font-semibold">{ticket.section}</p>
                        </div>
                        <div className="bg-teal-600/5 p-3 rounded-xl">
                          <div className="text-xs text-gray-500">
                            {t("bookingModal.ticketModal.price")}
                          </div>
                          <p className="font-bold text-teal-600">
                            {formatEthiopianBirr(ticket.price)}
                          </p>
                        </div>
                        <div className="bg-teal-600/5 p-3 rounded-xl col-span-2">
                          <div className="text-xs text-gray-500">
                            {t("bookingModal.schedule.showtime")}
                          </div>
                          <p className="font-medium">
                            {new Date(
                              ticket.schedule.show_date,
                            ).toLocaleDateString()}{" "}
                            at {ticket.schedule.start_time.substring(0, 5)}
                          </p>
                        </div>
                      </div>
                      <div className="text-center pt-2 border-t">
                        <p className="text-[10px] text-gray-400">
                          {t("bookingModal.ticketModal.scanMessage")}
                        </p>
                      </div>
                    </div>
                    <div className="bg-teal-600/5 px-5 py-3 flex justify-between">
                      <button
                        onClick={() => downloadTicket(ticket, index)}
                        className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded-lg"
                      >
                        <Download className="h-3.5 w-3.5 inline mr-1" />{" "}
                        {t("bookingModal.ticketModal.download")}
                      </button>
                      <button
                        onClick={() => {
                          const w = window.open("", "_blank");
                          if (w) {
                            w.document.write(`
                            <html>
                              <head><title>${t("bookingModal.ticketModal.printTitle")}</title></head>
                              <body>${document.getElementById(`ticket-${index}`)?.outerHTML || ""}</body>
                            </html>
                          `);
                            w.print();
                          }
                        }}
                        className="px-3 py-1.5 text-sm border border-teal-600/50 text-teal-600 rounded-lg"
                      >
                        <Printer className="h-3.5 w-3.5 inline mr-1" />{" "}
                        {t("bookingModal.ticketModal.print")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={printAllTickets}
                  className="flex-1 py-3 bg-teal-600 text-white rounded-lg"
                >
                  <Printer className="h-4 w-4 inline mr-2" />{" "}
                  {t("bookingModal.ticketModal.printAll", {
                    count: bookingData.totalSeats,
                  })}
                </button>
                <button
                  onClick={closeTicketModal}
                  className="flex-1 py-3 border-2 rounded-lg"
                >
                  {t("bookingModal.buttons.done")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default BookingModal;
