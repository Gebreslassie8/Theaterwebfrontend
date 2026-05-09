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
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";

// Types
interface Schedule {
  id: string;
  date: string;
  time: string;
  day: string;
  year: number;
  availableSeats?: number;
}

interface Show {
  id: string;
  title: string;
  venue: string;
  images?: { poster?: string };
  priceRange?: { min: number; max: number };
  schedules?: Schedule[];
}

interface Seat {
  id: string;
  row: string;
  number: number;
  section: keyof typeof SEAT_SECTIONS;
  sectionName: string;
  price: number;
  isReserved: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

interface SeatDetail {
  seatId: string;
  row: string;
  number: number;
  section: string;
  price: number;
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
  schedule?: Schedule;
}

interface BookingInfo {
  bookingId: string;
  tx_ref: string;
  show: string;
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

// Seat Sections
const SEAT_SECTIONS = {
  VIP: {
    rows: ["A", "B"],
    multiplier: 2.5,
    nameKey: "bookingModal.seatSections.vip",
    color: "from-amber-400 to-orange-500",
    icon: Crown,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  PREMIUM: {
    rows: ["C", "D"],
    multiplier: 1.8,
    nameKey: "bookingModal.seatSections.premium",
    color: "from-purple-400 to-pink-500",
    icon: Award,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  STANDARD: {
    rows: ["E", "F", "G", "H"],
    multiplier: 1,
    nameKey: "bookingModal.seatSections.standard",
    color: "from-deepTeal to-deepBlue",
    icon: Users,
    bgColor: "bg-deepTeal/5",
    borderColor: "border-deepTeal/20",
  },
} as const;

type SeatSectionKey = keyof typeof SEAT_SECTIONS;

const validateEthiopianPhone = (phone: string): boolean => {
  const ethiopianPhoneRegex = /^(?:\+251|0)?[97]\d{8}$/;
  return ethiopianPhoneRegex.test(phone);
};

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
    schedule: ticket.schedule,
    verificationCode: `${ticket.ticketId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    verificationUrl: `https://theatrehubethiopia.com/verify/${ticket.ticketId}`,
  };
};

const generateMockSchedules = (showTitle: string): Schedule[] => {
  return [
    {
      id: "sched-1",
      day: "Friday",
      date: "May 8, 2026",
      time: "3:00 PM",
      year: 2026,
      availableSeats: 80,
    },
    {
      id: "sched-2",
      day: "Friday",
      date: "May 8, 2026",
      time: "7:30 PM",
      year: 2026,
      availableSeats: 120,
    },
    {
      id: "sched-3",
      day: "Saturday",
      date: "May 9, 2026",
      time: "2:00 PM",
      year: 2026,
      availableSeats: 95,
    },
    {
      id: "sched-4",
      day: "Saturday",
      date: "May 9, 2026",
      time: "8:00 PM",
      year: 2026,
      availableSeats: 110,
    },
  ];
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
  const [seatDetails, setSeatDetails] = useState<Record<string, SeatDetail>>({});
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
  const [seats, setSeats] = useState<Seat[]>([]);
  const [availableSchedules, setAvailableSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const [validation, setValidation] = useState<Validation>({
    name: { isValid: true, message: "", touched: false },
    email: { isValid: true, message: "", touched: false },
    phone: { isValid: true, message: "", touched: false },
  });

  const generateSeats = (): Seat[] => {
    const seatsArray: Seat[] = [];
    const basePrice = 500;

    Object.entries(SEAT_SECTIONS).forEach(([section, config]) => {
      config.rows.forEach((row) => {
        for (let i = 1; i <= 12; i++) {
          const seatPrice = Math.round(basePrice * config.multiplier);
          const isReserved = Math.random() < 0.2;
          seatsArray.push({
            id: `${row}${i}`,
            row,
            number: i,
            section: section as SeatSectionKey,
            sectionName: t(config.nameKey),
            price: seatPrice,
            isReserved,
            icon: config.icon,
            color: config.color,
          });
        }
      });
    });
    return seatsArray;
  };

  useEffect(() => {
    setSeats(generateSeats());
    if (show.schedules && show.schedules.length > 0) {
      setAvailableSchedules(show.schedules);
    } else {
      setAvailableSchedules(generateMockSchedules(show.title));
    }
    setSelectedSchedule(null);
  }, [t, show]);

  useEffect(() => {
    setSelectedSeats([]);
    setSeatDetails({});
  }, [selectedSchedule]);

  const handleSeatSelect = (seatId: string): void => {
    const seat = seats.find((s) => s.id === seatId);
    if (seat?.isReserved) return;

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
          setSeatDetails((prev) => ({
            ...prev,
            [seatId]: {
              seatId,
              row: seat.row,
              number: seat.number,
              section: seat.sectionName,
              price: seat.price,
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
      return total + (seat?.price || 0);
    }, 0);
  };

  const handleFieldChange = (field: keyof CustomerInfo, value: string): void => {
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
      const ticketId = `${bookingId}${Math.random().toString(36).substring(2, 8)}`;

      const ticketData: Ticket = {
        ticketId: ticketId,
        bookingId: bookingId,
        tx_ref: tx_ref,
        ticketNumber: index + 1,
        totalTickets: totalSeatsCount,
        show: show.title,
        seat: seatId,
        row: seat?.row || "",
        number: seat?.number || 0,
        section: seat?.sectionName || t("bookingModal.seatSections.standard"),
        price: seat?.price || 0,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        venue: show.venue,
        qrData: null,
        schedule: schedule,
      };
      ticketData.qrData = generateUniqueQRData(ticketData, index);
      return ticketData;
    });
  };

  const initializeChapaPayment = async (): Promise<void> => {
    if (!selectedSchedule) {
      setError(t("bookingModal.errors.noSchedule"));
      return;
    }
    setIsProcessing(true);
    setError("");

    const totalAmount = calculateTotal();
    const tx_ref = generateTransactionRef();

    const paymentData = {
      amount: totalAmount,
      currency: "ETB",
      email: customerInfo.email,
      first_name: customerInfo.name.split(" ")[0] || customerInfo.name,
      last_name: customerInfo.name.split(" ").slice(1).join(" ") || "Customer",
      phone_number: customerInfo.phone,
      tx_ref: tx_ref,
      callback_url: `${window.location.origin}/payment-success`,
      return_url: `${window.location.origin}/payment-success`,
      customization: {
        title: `Theatre Hub - ${show.title}`,
        description: `${selectedSeats.length} ticket(s) for ${show.title} on ${selectedSchedule.day}, ${selectedSchedule.date} at ${selectedSchedule.time}`,
      },
      meta: {
        booking_seats: selectedSeats.join(","),
        show_title: show.title,
        show_venue: show.venue,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        total_tickets: selectedSeats.length,
        seat_details: JSON.stringify(seatDetails),
        schedule_id: selectedSchedule.id,
      },
    };

    try {
      const tempBookingData = { ...paymentData.meta, tx_ref, status: "pending", timestamp: new Date().toISOString() };
      localStorage.setItem(`temp_booking_${tx_ref}`, JSON.stringify(tempBookingData));
      await simulateChapaPayment(paymentData);
    } catch (err) {
      console.error("Payment initialization error:", err);
      setError(t("bookingModal.errors.paymentFailed"));
      setIsProcessing(false);
    }
  };

  const simulateChapaPayment = async (paymentData: any): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const isSuccessful = true;

    if (isSuccessful && selectedSchedule) {
      const tickets = generateTickets(paymentData.tx_ref, selectedSchedule);
      const bookingId = tickets[0]?.bookingId || `TKT${Date.now()}`;

      const bookingInfo: BookingInfo = {
        bookingId: bookingId,
        tx_ref: paymentData.tx_ref,
        show: show.title,
        seats: selectedSeats,
        seatDetails: seatDetails,
        totalSeats: selectedSeats.length,
        totalAmount: calculateTotal(),
        totalAmountBirr: formatEthiopianBirr(calculateTotal()),
        customerInfo,
        paymentMethod: "chapa",
        paymentDetails: {
          transactionReference: paymentData.tx_ref,
          paymentStatus: "completed",
          paymentDate: new Date().toISOString(),
        },
        bookingDate: new Date().toISOString(),
        status: "confirmed",
        venue: show.venue,
        tickets: tickets,
        selectedSchedule: selectedSchedule,
      };

      setBookingData(bookingInfo);
      setShowTicketModal(true);
      setIsProcessing(false);

      const bookings = JSON.parse(localStorage.getItem("theater_bookings") || "[]");
      bookings.push(bookingInfo);
      localStorage.setItem("theater_bookings", JSON.stringify(bookings));
      localStorage.removeItem(`temp_booking_${paymentData.tx_ref}`);
      onConfirm(bookingInfo);
    } else {
      throw new Error("Payment failed");
    }
  };

  const handleConfirm = async (): Promise<void> => {
    await initializeChapaPayment();
  };

  const copyQRCodeData = (ticket: Ticket, index: number): void => {
    const qrDataString = JSON.stringify(ticket.qrData, null, 2);
    navigator.clipboard.writeText(qrDataString).then(() => {
      setCopiedStates((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => setCopiedStates((prev) => ({ ...prev, [index]: false })), 2000);
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
      url: `https://theatrehubethiopia.com/verify/${ticket.ticketId}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setSharedStates((prev) => ({ ...prev, [index]: true }));
        setTimeout(() => setSharedStates((prev) => ({ ...prev, [index]: false })), 2000);
      } catch (err) {
        navigator.clipboard.writeText(shareData.text);
        alert(t("bookingModal.share.copiedFallback"));
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
      setCopiedStates((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => setCopiedStates((prev) => ({ ...prev, [index]: false })), 2000);
    }
  };

  const downloadTicket = (ticket: Ticket, index: number): void => {
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"><title>${t("bookingModal.ticketHtml.title")}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .ticket { max-width: 400px; margin: 0 auto; border: 1px solid #ccc; border-radius: 16px; overflow: hidden; }
          .ticket-header { background: linear-gradient(135deg, #0f766e, #1e3a8a); color: white; padding: 16px; text-align: center; }
          .ticket-content { padding: 16px; text-align: center; }
          .qr-code { margin: 16px auto; }
          .details { text-align: left; margin-top: 16px; }
          .detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        </style>
        </head>
        <body>
          <div class="ticket">
            <div class="ticket-header"><h2>${t("bookingModal.brand")}</h2></div>
            <div class="ticket-content">
              <h3>${ticket.show}</h3>
              <div class="qr-code"><div id="qr-code-${index}"></div></div>
              <div class="details">
                <div class="detail"><div class="detail-label">${t("bookingModal.ticketModal.seat")}</div><div class="detail-value">${ticket.seat}</div></div>
                <div class="detail"><div class="detail-label">${t("bookingModal.ticketModal.ticketHolder")}</div><div class="detail-value">${ticket.customerName}</div></div>
                <div class="detail"><div class="detail-label">${t("bookingModal.ticketModal.price")}</div><div class="detail-value">${formatEthiopianBirr(ticket.price)}</div></div>
                <div class="detail"><div class="detail-label">${t("bookingModal.schedule.showtime")}</div><div class="detail-value">${ticket.schedule?.day}, ${ticket.schedule?.date} at ${ticket.schedule?.time}</div></div>
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
      <html><head><title>${t("bookingModal.printAll.title")}</title>
      <script src="https://cdn.jsdelivr.net/npm/qrcodejs2-fix/qrcode.min.js"><\/script>
      <style>body{font-family:sans-serif;padding:20px;} .ticket{margin-bottom:30px;border:1px solid #ddd;border-radius:12px;padding:16px;max-width:400px;margin:0 auto 20px;}</style>
      </head><body>
    `);
    bookingData.tickets.forEach((ticket, idx) => {
      printWindow.document.write(`
        <div class="ticket">
          <h3>${ticket.show}</h3>
          <div id="qr-print-${idx}"></div>
          <p><strong>${t("bookingModal.ticketModal.seat")}:</strong> ${ticket.seat}</p>
          <p><strong>${t("bookingModal.ticketModal.ticketHolder")}:</strong> ${ticket.customerName}</p>
          <p><strong>${t("bookingModal.schedule.showtime")}:</strong> ${ticket.schedule?.day}, ${ticket.schedule?.date} at ${ticket.schedule?.time}</p>
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
    if (seat.isReserved) return "bg-gray-200 dark:bg-gray-600 cursor-not-allowed opacity-50 border-gray-300";
    if (selectedSeats.includes(seat.id)) return "bg-deepTeal text-white ring-2 ring-deepTeal ring-offset-2 shadow-lg transform scale-105";

    const sectionColors: Record<SeatSectionKey, string> = {
      VIP: "bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900",
      PREMIUM: "bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-900",
      STANDARD: "bg-deepTeal/10 hover:bg-deepTeal/20 border-deepTeal/30 text-deepTeal",
    };
    return `${sectionColors[seat.section]} border-2 transition-all duration-200 hover:scale-105 hover:shadow-md`;
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
                <div className="bg-gradient-to-r from-deepTeal to-deepBlue text-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Ticket className="h-6 w-6" />
                        {t("bookingModal.brand")}
                      </h2>
                      <p className="text-white/80 text-sm mt-1">{show.title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg"><X className="h-5 w-5" /></button>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900">
                  <div className="flex items-center justify-between max-w-2xl mx-auto">
                    {[
                      { step: 1, labelKey: "bookingModal.progress.selectSeats", icon: Ticket },
                      { step: 2, labelKey: "bookingModal.progress.yourInfo", icon: User },
                      { step: 3, labelKey: "bookingModal.progress.payment", icon: CreditCard },
                    ].map((item) => (
                      <div key={item.step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step >= item.step ? "bg-deepTeal text-white shadow-lg" : "bg-gray-200 dark:bg-dark-700 text-gray-500"}`}>
                            {step > item.step ? <CheckCircle className="h-5 w-5" /> : <item.icon className="h-5 w-5" />}
                          </div>
                          <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 hidden sm:block font-medium">{t(item.labelKey)}</span>
                        </div>
                        {item.step < 3 && (
                          <div className="flex-1 h-0.5 bg-gray-200 dark:bg-dark-700">
                            <div className={`h-full bg-deepTeal transition-all duration-500 ${step > item.step ? "w-full" : "w-0"}`} />
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
                      <AlertCircle className="h-4 w-4" /><span className="text-sm">{error}</span>
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
                        <div className="p-4 bg-gradient-to-r from-deepTeal/10 to-deepBlue/5 rounded-xl border border-deepTeal/20">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">{t("bookingModal.seatSelection.selectedSeats")}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{selectedSeats.length} {t("bookingModal.seatSelection.seatsCount")}</span>
                          </div>
                          {selectedSeats.length > 0 && (
                            <div className="flex items-center justify-between font-bold border-t border-deepTeal/20 pt-2 mt-2">
                              <span>{t("bookingModal.seatSelection.total")}</span>
                              <span className="text-deepTeal text-xl">{formatEthiopianBirr(calculateTotal())}</span>
                            </div>
                          )}
                        </div>

                        {/* Seat Legend */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                          {Object.entries(SEAT_SECTIONS).map(([key, config]) => (
                            <div key={key} className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded ${key === "VIP" ? "bg-amber-100 border-2 border-amber-300" : key === "PREMIUM" ? "bg-purple-100 border-2 border-purple-300" : "bg-deepTeal/10 border-2 border-deepTeal/30"}`}></div>
                              <span className="text-xs text-gray-600">{t(config.nameKey)}</span>
                            </div>
                          ))}
                          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-deepTeal ring-2 ring-deepTeal ring-offset-1"></div><span className="text-xs text-gray-600">{t("bookingModal.seatLegend.selected")}</span></div>
                          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-gray-200 border-2 border-gray-300"></div><span className="text-xs text-gray-600">{t("bookingModal.seatLegend.reserved")}</span></div>
                        </div>

                        {/* Stage */}
                        <div className="text-center">
                          <div className="relative">
                            <div className="w-64 h-1.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full mx-auto"></div>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 uppercase tracking-wider">{t("bookingModal.seatSelection.stage")}</div>
                          </div>
                        </div>

                        {/* Seat Grid - FIXED: removed invalid 'seat' reference */}
                        <div className="overflow-x-auto">
                          <div className="inline-block min-w-[500px]">
                            {["A","B","C","D","E","F","G","H"].map((row) => {
                              const rowSeats = seats.filter(seat => seat.row === row).sort((a,b)=>a.number-b.number);
                              if(rowSeats.length===0) return null;
                              // Determine section based on row letter
                              const sectionKey: SeatSectionKey = row === 'A' || row === 'B' ? 'VIP' : row === 'C' || row === 'D' ? 'PREMIUM' : 'STANDARD';
                              const sectionName = t(SEAT_SECTIONS[sectionKey].nameKey);
                              return (
                                <div key={row} className="flex items-center mb-2">
                                  <div className="w-8 text-center font-mono font-bold text-gray-400 text-sm">{row}</div>
                                  <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
                                    {rowSeats.map(seat => (
                                      <button
                                        key={seat.id}
                                        onClick={()=>handleSeatSelect(seat.id)}
                                        disabled={seat.isReserved}
                                        onMouseEnter={()=>setHoveredSeat(seat.id)}
                                        onMouseLeave={()=>setHoveredSeat(null)}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${getSeatColor(seat)} ${hoveredSeat===seat.id && !seat.isReserved && !selectedSeats.includes(seat.id) ? "shadow-lg transform scale-105" : ""} ${seat.isReserved ? "cursor-not-allowed" : "cursor-pointer"}`}
                                        title={t("bookingModal.seatSelection.seatTooltip", { section: seat.sectionName, id: seat.id, price: formatEthiopianBirr(seat.price) })}>
                                        {seat.number}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="w-20 text-right hidden sm:block">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                      sectionKey === 'VIP' ? "bg-amber-100 text-amber-700" :
                                      sectionKey === 'PREMIUM' ? "bg-purple-100 text-purple-700" :
                                      "bg-deepTeal/10 text-deepTeal"
                                    }`}>
                                      {sectionName}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {selectedSeats.length > 0 && (
                          <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Ticket className="h-4 w-4 text-deepTeal" />{t("bookingModal.seatSelection.selectedSeatsList", { count: selectedSeats.length })}</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {selectedSeats.map(seatId => {
                                const seat = seats.find(s=>s.id===seatId);
                                return (
                                  <div key={seatId} className="flex items-center justify-between p-2 bg-white dark:bg-dark-800 rounded-lg border border-gray-200">
                                    <div><p className="font-medium text-gray-900 dark:text-white">{seatId}</p><p className="text-xs text-gray-500">{seat?.sectionName}</p></div>
                                    <p className="text-sm font-semibold text-deepTeal">{formatEthiopianBirr(seat?.price || 0)}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* RIGHT COLUMN: Schedule Cards */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
                          {t("bookingModal.schedule.selectSchedule")}
                        </h3>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                          {availableSchedules.map((schedule) => (
                            <div
                              key={schedule.id}
                              onClick={() => setSelectedSchedule(schedule)}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                selectedSchedule?.id === schedule.id
                                  ? "border-deepTeal bg-deepTeal/5 shadow-md ring-2 ring-deepTeal/20"
                                  : "border-gray-200 dark:border-dark-600 hover:border-deepTeal/50 hover:shadow"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full ${selectedSchedule?.id === schedule.id ? "bg-deepTeal text-white" : "bg-gray-100 dark:bg-dark-700"}`}>
                                    <Calendar className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{schedule.day}</p>
                                    <p className="text-sm text-gray-500">{schedule.date}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-medium">{schedule.time}</span>
                                  </div>
                                  {schedule.availableSeats !== undefined && (
                                    <p className="text-xs text-gray-400 mt-1">{schedule.availableSeats} {t("bookingModal.schedule.seatsAvailable")}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {selectedSchedule && (
                          <div className="mt-5 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              {t("bookingModal.schedule.selected", {
                                day: selectedSchedule.day,
                                date: selectedSchedule.date,
                                time: selectedSchedule.time,
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">{t("bookingModal.customerInfo.title")}</h3>
                      <div className="space-y-5 max-w-2xl mx-auto">
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("bookingModal.customerInfo.fullName")} <span className="text-red-500">*</span></label>
                          <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" value={customerInfo.name} onChange={(e)=>handleFieldChange("name", e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-deepTeal focus:ring-2 focus:ring-deepTeal/20 transition-all dark:bg-dark-700 dark:border-dark-600 dark:text-white" placeholder={t("bookingModal.customerInfo.namePlaceholder")} />
                          </div>
                          {validation.name.touched && !validation.name.isValid && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {validation.name.message}</p>}
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("bookingModal.customerInfo.email")} <span className="text-red-500">*</span></label>
                          <div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="email" value={customerInfo.email} onChange={(e)=>handleFieldChange("email", e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-deepTeal focus:ring-2 focus:ring-deepTeal/20 transition-all dark:bg-dark-700 dark:border-dark-600 dark:text-white" placeholder={t("bookingModal.customerInfo.emailPlaceholder")} />
                          </div>
                          {validation.email.touched && !validation.email.isValid && <p className="mt-1 text-xs text-red-500">{validation.email.message}</p>}
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("bookingModal.customerInfo.phone")} <span className="text-red-500">*</span></label>
                          <div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="tel" value={customerInfo.phone} onChange={(e)=>handleFieldChange("phone", e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-deepTeal focus:ring-2 focus:ring-deepTeal/20 transition-all dark:bg-dark-700 dark:border-dark-600 dark:text-white" placeholder={t("bookingModal.customerInfo.phonePlaceholder")} />
                          </div>
                          {validation.phone.touched && !validation.phone.isValid && <p className="mt-1 text-xs text-red-500">{validation.phone.message}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 3 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">{t("bookingModal.payment.title")}</h3>
                      <div className="max-w-md mx-auto">
                        <div className="mb-6 p-6 bg-gradient-to-r from-deepTeal/10 to-deepBlue/5 rounded-xl border border-deepTeal/20">
                          <div className="flex justify-between items-center mb-4"><span className="text-gray-600 font-medium">{t("bookingModal.payment.totalAmount")}</span><span className="text-3xl font-bold text-deepTeal">{formatEthiopianBirr(calculateTotal())}</span></div>
                          <div className="border-t border-deepTeal/20 pt-4"><div className="flex justify-between text-sm"><span className="text-gray-500">{t("bookingModal.payment.tickets")}</span><span className="font-medium">{selectedSeats.length} {t("bookingModal.seatSelection.seatsCount")}</span></div>
                          <div className="flex justify-between text-sm mt-1"><span className="text-gray-500">{t("bookingModal.payment.seats")}</span><span className="font-mono text-sm">{selectedSeats.join(", ")}</span></div>
                          {selectedSchedule && (
                            <div className="flex justify-between text-sm mt-2"><span className="text-gray-500">{t("bookingModal.schedule.showtime")}</span><span className="text-sm">{selectedSchedule.day}, {selectedSchedule.date} at {selectedSchedule.time}</span></div>
                          )}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
                          <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center"><Wallet className="h-6 w-6 text-white" /></div><div><h4 className="font-bold text-green-800">{t("bookingModal.payment.chapaTitle")}</h4><p className="text-sm text-green-600">{t("bookingModal.payment.chapaSubtitle")}</p></div></div>
                          <div className="space-y-3 text-sm text-gray-600">
                            <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> {t("bookingModal.payment.chapaFeature1")}</p>
                            <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> {t("bookingModal.payment.chapaFeature2")}</p>
                            <p className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> {t("bookingModal.payment.chapaFeature3")}</p>
                          </div>
                        </div>
                        <button onClick={handleConfirm} disabled={isProcessing} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                          {isProcessing ? (<><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> {t("bookingModal.payment.processing")}</>) : (<><Wallet className="h-5 w-5" /> {t("bookingModal.payment.payButton", { amount: formatEthiopianBirr(calculateTotal()) })}</>)}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">{t("bookingModal.payment.terms")}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
                  {step > 1 && step < 3 && <button onClick={handleBack} className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-2"><ChevronLeft className="h-4 w-4" /> {t("bookingModal.buttons.back")}</button>}
                  {step < 3 && <button onClick={handleNext} className="ml-auto px-6 py-2.5 bg-gradient-to-r from-deepTeal to-deepBlue text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">{t("bookingModal.buttons.next")} <ChevronRight className="h-4 w-4" /></button>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ticket Modal */}
      {showTicketModal && bookingData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={closeTicketModal} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div><h2 className="text-2xl font-bold flex items-center gap-2"><QrCode className="h-6 w-6 text-deepTeal" /> {t("bookingModal.ticketModal.title")}</h2><p className="text-sm text-gray-500">{bookingData.totalSeats} {t("bookingModal.ticketModal.ticketCount", { count: bookingData.totalSeats })}</p></div>
              <button onClick={closeTicketModal} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-green-700 font-medium">✅ {t("bookingModal.ticketModal.paymentSuccess", { bookingId: bookingData.bookingId, total: bookingData.totalAmountBirr })}</p>
              </div>
              <div className="space-y-6">
                {bookingData.tickets.map((ticket, index) => (
                  <div key={ticket.ticketId} className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-deepTeal/30">
                    <div className="bg-gradient-to-r from-deepTeal to-deepBlue text-white px-5 py-4">
                      <div className="flex justify-between"><div><h3 className="font-bold">{t("bookingModal.brand")}</h3></div><div className="text-right"><p className="text-xs">{t("bookingModal.ticketModal.ticketOf", { current: index+1, total: bookingData.totalSeats })}</p><p className="text-[10px] font-mono">{ticket.ticketId}</p></div></div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-center mb-5"><div className="bg-white p-3 rounded-xl shadow-lg"><QRCodeSVG value={JSON.stringify(ticket.qrData)} size={130} level="H" /></div></div>
                      <div className="flex justify-center gap-3 mb-4">
                        <button onClick={()=>shareQRCode(ticket, index)} className="flex items-center gap-2 px-4 py-2 bg-deepTeal text-white rounded-lg">{sharedStates[index]?<><Check className="h-4 w-4"/> {t("bookingModal.ticketModal.shared")}</>:<><Share2 className="h-4 w-4"/> {t("bookingModal.ticketModal.share")}</>}</button>
                        <button onClick={()=>copyQRCodeData(ticket, index)} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg">{copiedStates[index]?<><Check className="h-4 w-4"/> {t("bookingModal.ticketModal.copied")}</>:<><Copy className="h-4 w-4"/> {t("bookingModal.ticketModal.copyQR")}</>}</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-deepTeal/5 p-3 rounded-xl"><div className="text-xs text-gray-500">{t("bookingModal.ticketModal.seat")}</div><p className="font-bold text-2xl text-deepTeal">{ticket.seat}</p><p className="text-xs">{t("bookingModal.ticketModal.rowSeat", { row: ticket.row, number: ticket.number })}</p></div>
                        <div className="bg-deepTeal/5 p-3 rounded-xl"><div className="text-xs text-gray-500">{t("bookingModal.ticketModal.ticketHolder")}</div><p className="font-semibold">{ticket.customerName}</p></div>
                        <div className="bg-deepTeal/5 p-3 rounded-xl"><div className="text-xs text-gray-500">{t("bookingModal.ticketModal.seatType")}</div><p className="font-semibold">{ticket.section}</p></div>
                        <div className="bg-deepTeal/5 p-3 rounded-xl"><div className="text-xs text-gray-500">{t("bookingModal.ticketModal.price")}</div><p className="font-bold text-deepTeal">{formatEthiopianBirr(ticket.price)}</p></div>
                        <div className="bg-deepTeal/5 p-3 rounded-xl col-span-2"><div className="text-xs text-gray-500">{t("bookingModal.schedule.showtime")}</div><p className="font-medium">{ticket.schedule?.day}, {ticket.schedule?.date} at {ticket.schedule?.time}</p></div>
                      </div>
                      <div className="text-center pt-2 border-t"><p className="text-[10px] text-gray-400">{t("bookingModal.ticketModal.scanMessage")}</p></div>
                    </div>
                    <div className="bg-deepTeal/5 px-5 py-3 flex justify-between">
                      <button onClick={()=>downloadTicket(ticket, index)} className="px-3 py-1.5 text-sm bg-deepTeal text-white rounded-lg"><Download className="h-3.5 w-3.5 inline mr-1"/> {t("bookingModal.ticketModal.download")}</button>
                      <button onClick={()=>{const w=window.open("","_blank"); if(w){w.document.write(`<html><head><title>${t("bookingModal.ticketModal.printTitle")}</title></head><body>${document.getElementById(`ticket-${index}`)?.outerHTML||""}</body></html>`); w.print();}}} className="px-3 py-1.5 text-sm border border-deepTeal/50 text-deepTeal rounded-lg"><Printer className="h-3.5 w-3.5 inline mr-1"/> {t("bookingModal.ticketModal.print")}</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={printAllTickets} className="flex-1 py-3 bg-deepTeal text-white rounded-lg"><Printer className="h-4 w-4 inline mr-2"/> {t("bookingModal.ticketModal.printAll", { count: bookingData.totalSeats })}</button>
                <button onClick={closeTicketModal} className="flex-1 py-3 border-2 rounded-lg">{t("bookingModal.buttons.done")}</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default BookingModal;