// frontend/src/components/auth/Booking/BookingSuccess.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Ticket,
  Download,
  Home,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  Share2,
  Mail,
  Printer,
  AlertCircle,
  RefreshCw,
  User,
  Phone,
  Mail as MailIcon,
} from "lucide-react";

const BookingSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [allBookings, setAllBookings] = useState<any[]>([]);

  useEffect(() => {
    const txRef = searchParams.get("tx_ref");
    const status = searchParams.get("status");

    console.log("=== Booking Success Page Debug ===");
    console.log("URL Transaction Reference:", txRef);
    console.log("Payment Status:", status);

    findCorrectBooking(txRef);
  }, [searchParams]);

  const findCorrectBooking = (txRef: string | null) => {
    try {
      // Get all bookings from localStorage
      const bookingsRaw = localStorage.getItem("theater_bookings");
      console.log("Raw localStorage data:", bookingsRaw);

      if (!bookingsRaw) {
        setError("No booking data found");
        setLoading(false);
        return;
      }

      const bookings = JSON.parse(bookingsRaw);
      console.log("All bookings:", bookings);
      setAllBookings(bookings);

      if (bookings.length === 0) {
        setError("No bookings found");
        setLoading(false);
        return;
      }

      // Method 1: Find by Chapa transaction reference (most accurate)
      let foundBooking = null;

      if (txRef) {
        foundBooking = bookings.find(
          (b: any) =>
            b.chapaTxRef === txRef ||
            b.transactionReference === txRef ||
            b.tx_ref === txRef ||
            b.paymentReference === txRef,
        );

        if (foundBooking) {
          console.log(
            "✅ Found booking by transaction reference:",
            foundBooking,
          );
        }
      }

      // Method 2: If not found by tx_ref, find the most recent booking that doesn't match the demo data
      if (!foundBooking) {
        // Filter out demo/default bookings
        const realBookings = bookings.filter((b: any) => {
          // Skip demo bookings with default values
          const isDemo =
            b.eventName === "Summer Music Festival" ||
            b.show === "The Lion" || // Skip the wrong booking you're seeing
            b.id === "BK-001" ||
            (b.venue === "Alem Cinima" && b.show === "The Lion"); // Skip this specific wrong booking

          return !isDemo;
        });

        console.log("Real bookings after filtering:", realBookings);

        if (realBookings.length > 0) {
          // Get the most recent booking
          realBookings.sort((a: any, b: any) => {
            const dateA = new Date(
              a.bookingDate || a.createdAt || a.timestamp || 0,
            );
            const dateB = new Date(
              b.bookingDate || b.createdAt || b.timestamp || 0,
            );
            return dateB.getTime() - dateA.getTime();
          });
          foundBooking = realBookings[0];
          console.log("📌 Using most recent real booking:", foundBooking);
        }
      }

      // Method 3: If still not found, check sessionStorage for pending booking
      if (!foundBooking) {
        const pendingBooking = sessionStorage.getItem("pending_booking");
        if (pendingBooking) {
          foundBooking = JSON.parse(pendingBooking);
          console.log(
            "📌 Found pending booking in sessionStorage:",
            foundBooking,
          );
        }
      }

      if (foundBooking) {
        setBookingData(foundBooking);
        setError(null);

        // Store as current booking
        localStorage.setItem("current_booking", JSON.stringify(foundBooking));

        // Also store the transaction reference mapping for future lookups
        if (txRef && !foundBooking.chapaTxRef) {
          foundBooking.chapaTxRef = txRef;
          // Update the booking in localStorage
          const updatedBookings = bookings.map((b: any) =>
            b.id === foundBooking.id ? foundBooking : b,
          );
          localStorage.setItem(
            "theater_bookings",
            JSON.stringify(updatedBookings),
          );
        }
      } else {
        setError(
          "Could not find your booking. Please check your booking ID below.",
        );
      }
    } catch (err) {
      console.error("Error finding booking:", err);
      setError("Error retrieving booking information");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const handleManualBookingSelect = (booking: any) => {
    setBookingData(booking);
    setError(null);
    localStorage.setItem("current_booking", JSON.stringify(booking));
  };

  const handleClearWrongBookings = () => {
    if (
      confirm(
        "This will remove all demo/theater bookings that don't belong to you. Continue?",
      )
    ) {
      const bookingsRaw = localStorage.getItem("theater_bookings");
      if (bookingsRaw) {
        const bookings = JSON.parse(bookingsRaw);
        // Keep only bookings that have a Chapa transaction reference (real payments)
        const realBookings = bookings.filter(
          (b: any) => b.chapaTxRef && b.chapaTxRef.startsWith("TH-"),
        );
        localStorage.setItem("theater_bookings", JSON.stringify(realBookings));
        alert(
          `Cleared ${bookings.length - realBookings.length} demo bookings. ${realBookings.length} real bookings remain.`,
        );
        window.location.reload();
      }
    }
  };

  const handleDownloadTicket = () => {
    if (!bookingData) return;

    const ticketHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ticket - ${bookingData.id || bookingData.bookingId}</title>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .ticket {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
          }
          .ticket-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .ticket-header h1 { margin: 0 0 10px 0; font-size: 28px; }
          .ticket-content { padding: 30px; }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-label { font-weight: 600; color: #6b7280; }
          .detail-value { font-weight: 500; color: #1f2937; }
          .qr-code {
            text-align: center;
            padding: 20px;
            background: #f9fafb;
            margin-top: 20px;
            border-radius: 10px;
          }
          .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
          @media print {
            body { background: white; padding: 0; }
            .ticket { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="ticket-header">
            <h1>🎭 EVENT TICKET</h1>
            <p>Booking ID: ${bookingData.id || bookingData.bookingId}</p>
            <p>Transaction: ${bookingData.chapaTxRef || bookingData.transactionReference || "N/A"}</p>
          </div>
          <div class="ticket-content">
            <div class="detail-row">
              <span class="detail-label">Event:</span>
              <span class="detail-value">${bookingData.eventName || bookingData.show || "Theater Event"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${bookingData.eventDate ? new Date(bookingData.eventDate).toLocaleDateString() : bookingData.date || "To be confirmed"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${bookingData.selectedSchedule?.time || bookingData.time || "7:00 PM"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Venue:</span>
              <span class="detail-value">${bookingData.venue || bookingData.hallName || "Main Hall"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Seats:</span>
              <span class="detail-value">${bookingData.tickets?.map((t: any) => t.seat).join(", ") || "Assigned at venue"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Paid:</span>
              <span class="detail-value">ETB ${bookingData.totalAmount}</span>
            </div>
            ${
              bookingData.customerName
                ? `
            <div class="detail-row">
              <span class="detail-label">Customer:</span>
              <span class="detail-value">${bookingData.customerName}</span>
            </div>
            `
                : ""
            }
            <div class="qr-code">
              <p style="font-size: 12px; color: #6b7280;">Scan for verification</p>
              <div style="font-size: 48px; margin-top: 10px;">🎟️</div>
              <p style="font-size: 10px; margin-top: 10px;">${bookingData.id || bookingData.bookingId}</p>
            </div>
          </div>
          <div class="footer">
            <p>Please present this ticket at the entrance • Valid for one-time use</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Secured by Chapa Payment Gateway</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(ticketHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
          </motion.div>
          <motion.p className="text-lg text-gray-300">
            Looking for your booking...
          </motion.p>
        </div>
      </div>
    );
  }

  // Show all bookings selector if multiple exist or wrong booking is shown
  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-8 text-white text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                <AlertCircle className="h-12 w-12 text-amber-500" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Find Your Booking</h1>
              <p className="text-amber-100">
                Select your booking from the list below
              </p>
            </div>

            <div className="p-8">
              {allBookings.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Your Bookings
                    </h2>
                    <button
                      onClick={handleClearWrongBookings}
                      className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Clear Demo Data
                    </button>
                  </div>

                  <div className="space-y-3">
                    {allBookings.map((booking, idx) => {
                      // Skip clearly wrong/demo bookings
                      const isWrong =
                        booking.show === "The Lion" ||
                        booking.eventName === "Summer Music Festival";

                      if (isWrong) return null;

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition cursor-pointer"
                          onClick={() => handleManualBookingSelect(booking)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-mono text-sm text-indigo-600 mb-1">
                                {booking.id || booking.bookingId}
                              </p>
                              <p className="font-semibold text-gray-800">
                                {booking.eventName || booking.show}
                              </p>
                              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {booking.eventDate
                                    ? new Date(
                                        booking.eventDate,
                                      ).toLocaleDateString()
                                    : booking.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {booking.selectedSchedule?.time ||
                                    booking.time}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-indigo-600">
                                ETB {booking.totalAmount}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {booking.tickets?.length ||
                                  booking.totalTickets}{" "}
                                tickets
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {allBookings.filter(
                    (b) =>
                      b.show !== "The Lion" &&
                      b.eventName !== "Summer Music Festival",
                  ).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        No real bookings found. Your payment might not have been
                        saved correctly.
                      </p>
                      <button
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl"
                      >
                        <Home className="h-4 w-4" />
                        Browse Events
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success display with the correct booking
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-emerald-100">Your booking has been confirmed</p>
          </div>

          {/* Booking Details */}
          <div className="p-8">
            {/* Transaction Reference */}
            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600 mb-1">
                    Booking ID / Transaction
                  </p>
                  <p className="text-sm font-mono font-bold text-gray-800">
                    {bookingData.id || bookingData.bookingId}
                  </p>
                  {bookingData.chapaTxRef && (
                    <p className="text-xs font-mono text-gray-500 mt-1">
                      Ref: {bookingData.chapaTxRef}
                    </p>
                  )}
                </div>
                <CreditCard className="h-8 w-8 text-indigo-400" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                <Ticket className="h-5 w-5 text-indigo-600" />
                Booking Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-indigo-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Event Date
                    </p>
                    <p className="font-medium text-gray-800">
                      {bookingData.eventDate
                        ? new Date(bookingData.eventDate).toLocaleDateString()
                        : bookingData.date || "To be confirmed"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-indigo-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Time</p>
                    <p className="font-medium text-gray-800">
                      {bookingData.selectedSchedule?.time ||
                        bookingData.time ||
                        "To be confirmed"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-indigo-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Venue</p>
                    <p className="font-medium text-gray-800">
                      {bookingData.venue ||
                        bookingData.hallName ||
                        "Main Theater"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="h-5 w-5 text-indigo-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Event</p>
                    <p className="font-medium text-gray-800">
                      {bookingData.eventName ||
                        bookingData.show ||
                        "Theater Event"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info if available */}
              {(bookingData.customerName || bookingData.customerEmail) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    Customer Information
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {bookingData.customerName && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{bookingData.customerName}</span>
                      </div>
                    )}
                    {bookingData.customerEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <MailIcon className="h-4 w-4 text-gray-400" />
                        <span>{bookingData.customerEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Seats Section */}
              {bookingData.tickets && bookingData.tickets.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Selected Seats</p>
                  <div className="flex flex-wrap gap-2">
                    {bookingData.tickets.map((t: any, idx: number) => (
                      <motion.span
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-mono font-bold"
                      >
                        {t.seat || t.seatNumber || `Seat ${idx + 1}`}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Amount */}
              <div className="mt-6 pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    Total Paid
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ETB {bookingData.totalAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>Total Tickets</span>
                  <span>
                    {bookingData.tickets?.length ||
                      bookingData.totalTickets ||
                      1}{" "}
                    tickets
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={handleDownloadTicket}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="h-4 w-4" />
                Download Tickets
              </button>

              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full mt-3 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </button>

            <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-start gap-3">
              <Mail className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800">Confirmation Sent</p>
                <p className="text-green-600 text-xs">
                  A confirmation email has been sent to your registered email
                  address.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Secured by{" "}
            <span className="text-indigo-400 font-semibold">Chapa</span> Payment
            Gateway
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;