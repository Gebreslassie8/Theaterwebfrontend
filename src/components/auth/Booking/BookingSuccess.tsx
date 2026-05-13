// frontend/src/components/auth/Booking/BookingSuccess.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Ticket, Download, Home, Loader2 } from "lucide-react";

const BookingSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const txRef = searchParams.get("tx_ref");

    // Get booking data from localStorage
    const bookings = JSON.parse(
      localStorage.getItem("theater_bookings") || "[]",
    );
    const booking = bookings.find(
      (b: any) => b.paymentDetails?.transactionReference === txRef,
    );

    if (booking) {
      setBookingData(booking);
    }

    setTimeout(() => setLoading(false), 2000);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Your payment was successful and your tickets are confirmed.
            </p>
          </div>

          {bookingData && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Ticket className="h-5 w-5 text-teal-600" />
                Booking Details
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-mono font-semibold">
                    {bookingData.bookingId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Show:</span>
                  <span className="font-medium">{bookingData.show}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>
                    {bookingData.selectedSchedule?.date} at{" "}
                    {bookingData.selectedSchedule?.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Venue:</span>
                  <span>{bookingData.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span>
                    {bookingData.tickets.map((t: any) => t.seat).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t font-bold">
                  <span>Total Paid:</span>
                  <span className="text-teal-600">
                    {bookingData.totalAmountBirr}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Tickets
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;