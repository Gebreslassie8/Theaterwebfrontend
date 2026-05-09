// frontend/src/components/auth/Booking/BookingModal.tsx
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
  Printer,
  Wallet,
} from "lucide-react";

// Types
interface Schedule {
  id: string;
  date: string;
  time: string;
  day: string;
  availableSeats?: number;
}

interface Show {
  id: string;
  title: string;
  venue: string;
  schedules?: Schedule[];
}

interface Seat {
  id: string;
  row: string;
  number: number;
  section: string;
  price: number;
  isReserved: boolean;
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
}

interface BookingInfo {
  bookingId: string;
  show: string;
  venue: string;
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

// Seat Sections
const SEAT_SECTIONS = {
  VIP: { rows: ["A", "B"], multiplier: 2.5, name: "VIP" },
  PREMIUM: { rows: ["C", "D"], multiplier: 1.8, name: "PREMIUM" },
  STANDARD: { rows: ["E", "F", "G", "H"], multiplier: 1, name: "STANDARD" },
};

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
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
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
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  // Generate seats
  useEffect(() => {
    const basePrice = 500;
    const seatsArray: Seat[] = [];
    Object.entries(SEAT_SECTIONS).forEach(([section, config]) => {
      config.rows.forEach((row) => {
        for (let i = 1; i <= 12; i++) {
          seatsArray.push({
            id: `${row}${i}`,
            row,
            number: i,
            section: section,
            price: Math.round(basePrice * config.multiplier),
            isReserved: Math.random() < 0.2,
          });
        }
      });
    });
    setSeats(seatsArray);
  }, []);

  const calculateTotal = (): number => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find((s) => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const handleSeatSelect = (seatId: string): void => {
    const seat = seats.find((s) => s.id === seatId);
    if (seat?.isReserved) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleNext = (): void => {
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
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = (): void => setStep((prev) => prev - 1);

  const handleConfirm = async (): Promise<void> => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const bookingInfo: BookingInfo = {
      bookingId: `BKG-${Date.now()}`,
      show: show.title,
      venue: show.venue,
      totalSeats: selectedSeats.length,
      totalAmount: calculateTotal(),
      totalAmountBirr: formatCurrency(calculateTotal()),
      customerInfo,
      paymentMethod: "chapa",
      paymentDetails: { transactionReference: generateTransactionRef() },
      bookingDate: new Date().toISOString(),
      status: "confirmed",
      tickets: selectedSeats.map((seatId) => {
        const seat = seats.find((s) => s.id === seatId);
        return {
          ticketId: `TKT-${Date.now()}-${seatId}`,
          seat: seatId,
          row: seat?.row || "",
          number: seat?.number || 0,
          section: seat?.section || "",
          price: seat?.price || 0,
          customerName: customerInfo.name,
        };
      }),
      selectedSchedule: selectedSchedule!,
    };

    setBookingData(bookingInfo);
    setShowSuccess(true);
    setIsProcessing(false);
    onConfirm(bookingInfo);
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
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
            h1 { color: #0f766e; text-align: center; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 15px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <h1>🎭 Theatre Hub</h1>
          <div class="section">
            <div class="row"><strong>Booking ID:</strong> ${bookingData.bookingId}</div>
            <div class="row"><strong>Show:</strong> ${bookingData.show}</div>
            <div class="row"><strong>Venue:</strong> ${bookingData.venue}</div>
            <div class="row"><strong>Date:</strong> ${bookingData.selectedSchedule?.day}, ${bookingData.selectedSchedule?.date} at ${bookingData.selectedSchedule?.time}</div>
          </div>
          <div class="section">
            <div class="row"><strong>Name:</strong> ${bookingData.customerInfo.name}</div>
            <div class="row"><strong>Email:</strong> ${bookingData.customerInfo.email}</div>
            <div class="row"><strong>Phone:</strong> ${bookingData.customerInfo.phone}</div>
          </div>
          <div class="section">
            <strong>Seats:</strong>
            ${bookingData.tickets.map(t => `<div class="row">${t.seat} - ${formatCurrency(t.price)}</div>`).join('')}
            <div class="total">Total: ${bookingData.totalAmountBirr}</div>
          </div>
          <div class="footer">Thank you for booking with Theatre Hub!</div>
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
    setStep(1);
    setSelectedSeats([]);
    setCustomerInfo({ name: "", email: "", phone: "" });
    setSelectedSchedule(null);
  };

  if (!isOpen) return null;

  const schedules = show.schedules || [
    { id: "1", day: "Friday", date: "May 8, 2026", time: "7:30 PM" },
    { id: "2", day: "Saturday", date: "May 9, 2026", time: "7:30 PM" },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl mx-auto mt-16 mb-16"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-white flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Ticket className="h-5 w-5" />
                      {show.title}
                    </h2>
                    <p className="text-white/80 text-sm">{show.venue}</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Steps */}
                <div className="flex border-b">
                  {["Select Seats", "Your Info", "Payment"].map((label, i) => (
                    <div
                      key={label}
                      className={`flex-1 text-center py-3 text-sm font-medium ${
                        step === i + 1
                          ? "text-teal-600 border-b-2 border-teal-600"
                          : step > i + 1
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step > i + 1 ? "✓ " : ""}
                      {label}
                    </div>
                  ))}
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Step 1: Seat Selection */}
                  {step === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Seat Map */}
                      <div>
                        <div className="text-center mb-4">
                          <div className="w-48 h-1 bg-gray-300 mx-auto rounded" />
                          <p className="text-xs text-gray-400 mt-1">STAGE</p>
                        </div>
                        <div className="space-y-2">
                          {["A", "B", "C", "D", "E", "F", "G", "H"].map((row) => {
                            const rowSeats = seats.filter((s) => s.row === row);
                            if (rowSeats.length === 0) return null;
                            return (
                              <div key={row} className="flex items-center gap-2">
                                <span className="w-6 text-sm font-mono text-gray-400">
                                  {row}
                                </span>
                                <div className="flex gap-1 flex-wrap">
                                  {rowSeats.map((seat) => (
                                    <button
                                      key={seat.id}
                                      onClick={() => handleSeatSelect(seat.id)}
                                      disabled={seat.isReserved}
                                      className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
                                        seat.isReserved
                                          ? "bg-gray-200 cursor-not-allowed opacity-50"
                                          : selectedSeats.includes(seat.id)
                                          ? "bg-teal-600 text-white"
                                          : seat.section === "VIP"
                                          ? "bg-amber-100 hover:bg-amber-200"
                                          : seat.section === "PREMIUM"
                                          ? "bg-purple-100 hover:bg-purple-200"
                                          : "bg-gray-100 hover:bg-gray-200"
                                      }`}
                                    >
                                      {seat.number}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-center gap-4 mt-4 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-amber-100 border rounded"></div>
                            <span>VIP</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-purple-100 border rounded"></div>
                            <span>Premium</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-100 border rounded"></div>
                            <span>Standard</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-teal-600 rounded"></div>
                            <span>Selected</span>
                          </div>
                        </div>
                      </div>

                      {/* Schedule & Summary */}
                      <div>
                        <h3 className="font-semibold mb-3">Select Show Time</h3>
                        <div className="space-y-2 mb-6">
                          {schedules.map((s) => (
                            <div
                              key={s.id}
                              onClick={() => setSelectedSchedule(s)}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                                selectedSchedule?.id === s.id
                                  ? "border-teal-500 bg-teal-50"
                                  : "border-gray-200 hover:border-teal-300"
                              }`}
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">{s.day}</span>
                                <span>{s.time}</span>
                              </div>
                              <div className="text-sm text-gray-500">{s.date}</div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <span>Selected Seats:</span>
                            <span className="font-medium">
                              {selectedSeats.length > 0
                                ? selectedSeats.join(", ")
                                : "None"}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span className="text-teal-600">
                              {formatCurrency(calculateTotal())}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Customer Info */}
                  {step === 2 && (
                    <div className="max-w-md mx-auto space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={customerInfo.name}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, name: e.target.value })
                            }
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, email: e.target.value })
                            }
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Phone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            value={customerInfo.phone}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, phone: e.target.value })
                            }
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                            placeholder="09XXXXXXXX"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 3 && (
                    <div className="max-w-md mx-auto">
                      <div className="bg-teal-50 rounded-lg p-6 text-center mb-6">
                        <div className="text-3xl font-bold text-teal-600 mb-2">
                          {formatCurrency(calculateTotal())}
                        </div>
                        <p className="text-gray-600">
                          {selectedSeats.length} ticket(s) for {selectedSchedule?.day},{" "}
                          {selectedSchedule?.time}
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-green-800">Pay with Chapa</h4>
                            <p className="text-xs text-green-600">Secure payment via Card or Mobile Money</p>
                          </div>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" /> Credit/Debit Card
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" /> Telebirr
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" /> CBE Birr
                          </li>
                        </ul>
                      </div>

                      <button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto" />
                        ) : (
                          `Pay ${formatCurrency(calculateTotal())}`
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
                  {step > 1 && step < 3 && (
                    <button
                      onClick={handleBack}
                      className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                    >
                      <ChevronLeft className="h-4 w-4 inline" /> Back
                    </button>
                  )}
                  {step < 3 && (
                    <button
                      onClick={handleNext}
                      className="ml-auto px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                      Next <ChevronRight className="h-4 w-4 inline" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      {showSuccess && bookingData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70" onClick={closeModal} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full"
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-gray-500 mb-4">
                Your booking has been successfully confirmed.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Booking ID:</span>
                  <span className="font-mono text-sm">{bookingData.bookingId}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Show:</span>
                  <span>{bookingData.show}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Date & Time:</span>
                  <span>
                    {bookingData.selectedSchedule?.day},{" "}
                    {bookingData.selectedSchedule?.date} at{" "}
                    {bookingData.selectedSchedule?.time}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Seats:</span>
                  <span>{bookingData.tickets.map((t) => t.seat).join(", ")}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total Paid:</span>
                  <span className="text-teal-600">{bookingData.totalAmountBirr}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={printBooking}
                  className="flex-1 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50"
                >
                  <Printer className="h-4 w-4 inline mr-1" /> Print
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Done
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