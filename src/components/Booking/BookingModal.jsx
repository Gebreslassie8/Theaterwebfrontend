// BookingModal.jsx - Professional seat arrangement with Chapa payment only
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CreditCard,
  Phone,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Shield,
  Smartphone,
  Banknote,
  Landmark,
  Download,
  Printer,
  Eye,
  EyeOff,
  Star,
  Award,
  Gift,
  Crown,
  TrendingUp,
  Users,
  Info,
  Sparkles,
  QrCode,
  Coffee,
  Music,
  Share2,
  Copy,
  Check,
  Wallet
} from 'lucide-react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';

// Seat Sections with pricing tiers
const SEAT_SECTIONS = {
  VIP: { rows: ['A', 'B'], multiplier: 2.5, name: 'VIP', color: 'from-amber-400 to-orange-500', icon: Crown, bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  PREMIUM: { rows: ['C', 'D'], multiplier: 1.8, name: 'Premium', color: 'from-purple-400 to-pink-500', icon: Award, bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  STANDARD: { rows: ['E', 'F', 'G', 'H'], multiplier: 1, name: 'Standard', color: 'from-deepTeal to-deepBlue', icon: Users, bgColor: 'bg-deepTeal/5', borderColor: 'border-deepTeal/20' }
};

// Ethiopian phone number validation
const validateEthiopianPhone = (phone) => {
  const ethiopianPhoneRegex = /^(?:\+251|0)?[97]\d{8}$/;
  return ethiopianPhoneRegex.test(phone);
};

// Format Ethiopian Birr
const formatEthiopianBirr = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Generate unique transaction reference for Chapa
const generateTransactionRef = () => {
  return `TXT-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
};

// Function to generate unique QR data for each ticket
const generateUniqueQRData = (ticket, index) => {
  return JSON.stringify({
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
    verificationCode: `${ticket.ticketId}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    verificationUrl: `https://theatrehubethiopia.com/verify/${ticket.ticketId}`
  });
};

const BookingModal = ({ show, isOpen, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatDetails, setSeatDetails] = useState({});
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});
  const [sharedStates, setSharedStates] = useState({});
  const [hoveredSeat, setHoveredSeat] = useState(null);

  // Validation states
  const [validation, setValidation] = useState({
    name: { isValid: true, message: '', touched: false },
    email: { isValid: true, message: '', touched: false },
    phone: { isValid: true, message: '', touched: false }
  });

  // Generate seat layout with sections and pricing
  const generateSeats = () => {
    const seats = [];
    const basePrice = 500;

    Object.entries(SEAT_SECTIONS).forEach(([section, config]) => {
      config.rows.forEach(row => {
        for (let i = 1; i <= 12; i++) {
          const seatPrice = Math.round(basePrice * config.multiplier);
          const isReserved = Math.random() < 0.2;
          seats.push({
            id: `${row}${i}`,
            row,
            number: i,
            section,
            sectionName: config.name,
            price: seatPrice,
            isReserved,
            icon: config.icon,
            color: config.color
          });
        }
      });
    });
    return seats;
  };

  const [seats, setSeats] = useState(generateSeats());

  const handleSeatSelect = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (seat?.isReserved) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        const newSeats = prev.filter(id => id !== seatId);
        const newDetails = { ...seatDetails };
        delete newDetails[seatId];
        setSeatDetails(newDetails);
        return newSeats;
      } else {
        setSeatDetails(prev => ({
          ...prev,
          [seatId]: {
            seatId,
            row: seat.row,
            number: seat.number,
            section: seat.sectionName,
            price: seat.price
          }
        }));
        return [...prev, seatId];
      }
    });
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const handleFieldChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    setValidation(prev => ({ ...prev, [field]: { ...prev[field], touched: true } }));

    if (field === 'name') {
      const isValid = value.trim().length >= 2;
      setValidation(prev => ({
        ...prev,
        name: {
          ...prev.name,
          isValid,
          message: isValid ? '' : 'Name must be at least 2 characters'
        }
      }));
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(value);
      setValidation(prev => ({
        ...prev,
        email: {
          ...prev.email,
          isValid,
          message: isValid ? '' : 'Please enter a valid email address'
        }
      }));
    }

    if (field === 'phone') {
      const isValid = validateEthiopianPhone(value);
      setValidation(prev => ({
        ...prev,
        phone: {
          ...prev.phone,
          isValid,
          message: isValid ? '' : 'Please enter a valid Ethiopian phone number (09XXXXXXXX or 07XXXXXXXX)'
        }
      }));
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }
    if (step === 2) {
      if (!customerInfo.name || !validation.name.isValid ||
        !customerInfo.email || !validation.email.isValid ||
        !customerInfo.phone || !validation.phone.isValid) {
        setError('Please fill in all customer information correctly');
        return;
      }
    }

    setError('');
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  // Generate tickets
  const generateTickets = (tx_ref) => {
    const bookingId = `TKT${Date.now()}${Math.random().toString(36).substring(2, 10)}`;
    const totalSeatsCount = selectedSeats.length;

    return selectedSeats.map((seatId, index) => {
      const seat = seats.find(s => s.id === seatId);
      const ticketId = `${bookingId}${Math.random().toString(36).substring(2, 8)}`;

      const ticketData = {
        ticketId: ticketId,
        bookingId: bookingId,
        tx_ref: tx_ref,
        ticketNumber: index + 1,
        totalTickets: totalSeatsCount,
        show: show.title,
        seat: seatId,
        row: seat.row,
        number: seat.number,
        section: seat.sectionName || 'REGULAR',
        price: seat.price,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        venue: show.venue,
      };

      ticketData.qrData = generateUniqueQRData(ticketData, index);
      return ticketData;
    });
  };

  // Initialize Chapa Payment
  const initializeChapaPayment = async () => {
    setIsProcessing(true);
    setError('');

    const totalAmount = calculateTotal();
    const tx_ref = generateTransactionRef();

    // Prepare payment data for Chapa
    const paymentData = {
      amount: totalAmount,
      currency: 'ETB',
      email: customerInfo.email,
      first_name: customerInfo.name.split(' ')[0] || customerInfo.name,
      last_name: customerInfo.name.split(' ').slice(1).join(' ') || 'Customer',
      phone_number: customerInfo.phone,
      tx_ref: tx_ref,
      callback_url: `${window.location.origin}/payment-success`,
      return_url: `${window.location.origin}/payment-success`,
      customization: {
        title: `Theatre Hub - ${show.title}`,
        description: `${selectedSeats.length} ticket(s) for ${show.title}`
      },
      meta: {
        booking_seats: selectedSeats.join(','),
        show_title: show.title,
        show_venue: show.venue,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        total_tickets: selectedSeats.length,
        seat_details: JSON.stringify(seatDetails)
      }
    };

    try {
      // Store temporary booking data
      const tempBookingData = {
        ...paymentData.meta,
        tx_ref,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`temp_booking_${tx_ref}`, JSON.stringify(tempBookingData));

      // Simulate Chapa payment (replace with actual Chapa integration)
      await simulateChapaPayment(paymentData);

    } catch (err) {
      console.error('Payment initialization error:', err);
      setError('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  // Simulate Chapa payment (for demo - replace with actual Chapa API call)
  const simulateChapaPayment = async (paymentData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demo, simulate successful payment
    const isSuccessful = true;

    if (isSuccessful) {
      // Generate tickets after successful payment
      const tickets = generateTickets(paymentData.tx_ref);
      const bookingId = tickets[0]?.bookingId || `TKT${Date.now()}`;

      const bookingInfo = {
        bookingId: bookingId,
        tx_ref: paymentData.tx_ref,
        show: show.title,
        seats: selectedSeats,
        seatDetails: seatDetails,
        totalSeats: selectedSeats.length,
        totalAmount: calculateTotal(),
        totalAmountBirr: formatEthiopianBirr(calculateTotal()),
        customerInfo,
        paymentMethod: 'chapa',
        paymentDetails: {
          transactionReference: paymentData.tx_ref,
          paymentStatus: 'completed',
          paymentDate: new Date().toISOString()
        },
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        venue: show.venue,
        tickets: tickets
      };

      setBookingData(bookingInfo);
      setShowTicketModal(true);
      setIsProcessing(false);

      // Store booking in localStorage
      const bookings = JSON.parse(localStorage.getItem('theater_bookings') || '[]');
      bookings.push(bookingInfo);
      localStorage.setItem('theater_bookings', JSON.stringify(bookings));

      // Remove temporary booking
      localStorage.removeItem(`temp_booking_${paymentData.tx_ref}`);

      onConfirm(bookingInfo);
    } else {
      throw new Error('Payment failed');
    }
  };

  const handleConfirm = async () => {
    await initializeChapaPayment();
  };

  const copyQRCodeData = (ticket, index) => {
    const qrDataString = JSON.stringify(ticket.qrData, null, 2);
    navigator.clipboard.writeText(qrDataString).then(() => {
      setCopiedStates(prev => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [index]: false }));
      }, 2000);
    });
  };

  const shareQRCode = async (ticket, index) => {
    const shareData = {
      title: `Theatre Hub Ethiopia - Ticket for ${ticket.seat}`,
      text: `🎭 Theatre Hub Ethiopia Ticket\n\nShow: ${ticket.show}\nSeat: ${ticket.seat} (Row ${ticket.row}, Seat ${ticket.number})\nTicket Holder: ${ticket.customerName}\nTicket ID: ${ticket.ticketId}`,
      url: `https://theatrehubethiopia.com/verify/${ticket.ticketId}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setSharedStates(prev => ({ ...prev, [index]: true }));
        setTimeout(() => setSharedStates(prev => ({ ...prev, [index]: false })), 2000);
      } catch (err) {
        navigator.clipboard.writeText(shareData.text);
        alert('Share info copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
      setCopiedStates(prev => ({ ...prev, [index]: true }));
      setTimeout(() => setCopiedStates(prev => ({ ...prev, [index]: false })), 2000);
    }
  };

  const downloadTicket = (ticket, index) => {
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Theatre Hub Ethiopia - Ticket ${ticket.ticketId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #007590 0%, #17304F 100%);
              min-height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 20px;
            }
            .ticket { max-width: 450px; width: 100%; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
            .ticket-header { background: linear-gradient(135deg, #007590, #17304F); color: white; padding: 20px; text-align: center; }
            .ticket-content { padding: 24px; }
            .qr-code { text-align: center; margin: 20px 0; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
            .detail { background: #f0f9ff; padding: 12px; border-radius: 12px; border-left: 3px solid #007590; }
            .detail-label { font-size: 11px; color: #007590; margin-bottom: 4px; }
            .detail-value { font-size: 16px; font-weight: 600; }
            .footer { background: #f0f9ff; padding: 12px; text-align: center; font-size: 10px; color: #007590; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="ticket-header">
              <div style="font-size: 32px;">🇪🇹</div>
              <h2>Theatre Hub Ethiopia</h2>
            </div>
            <div class="ticket-content">
              <h3 style="text-align: center; color: #007590;">${ticket.show}</h3>
              <div class="qr-code"><div id="qr-code-${index}"></div></div>
              <div class="details">
                <div class="detail"><div class="detail-label">Ticket ID</div><div class="detail-value">${ticket.ticketId}</div></div>
                <div class="detail"><div class="detail-label">Ticket Holder</div><div class="detail-value">${ticket.customerName}</div></div>
                <div class="detail"><div class="detail-label">Seat</div><div class="detail-value" style="font-size: 24px;">${ticket.seat}</div></div>
                <div class="detail"><div class="detail-label">Price</div><div class="detail-value">${formatEthiopianBirr(ticket.price)}</div></div>
              </div>
              <p style="text-align: center; font-size: 12px;">Venue: ${ticket.venue}</p>
            </div>
            <div class="footer">Scan this QR code at venue entrance</div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs2-fix/qrcode.min.js"></script>
          <script>
            new QRCode(document.getElementById("qr-code-${index}"), {
              text: ${JSON.stringify(JSON.stringify(ticket.qrData))},
              width: 150, height: 150, colorDark: "#007590", colorLight: "#ffffff"
            });
          </script>
        </body>
      </html>
    `;
    const blob = new Blob([ticketHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ticket_${ticket.seat}_${ticket.ticketId}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printAllTickets = () => {
    const printWindow = window.open('', '_blank');
    let allTicketsHtml = '';
    bookingData.tickets.forEach((ticket, index) => {
      allTicketsHtml += `
        <div style="margin-bottom: 20px;">
          <div style="max-width: 450px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #007590, #17304F); color: white; padding: 20px; text-align: center;">
              <h2>Theatre Hub Ethiopia</h2>
            </div>
            <div style="padding: 20px;">
              <h3 style="text-align: center; color: #007590;">${ticket.show}</h3>
              <div id="qr-print-${index}" style="text-align: center; margin: 20px 0;"></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="background: #f0f9ff; padding: 10px;"><div style="font-size: 11px;">Seat</div><div style="font-size: 20px; font-weight: bold;">${ticket.seat}</div></div>
                <div style="background: #f0f9ff; padding: 10px;"><div style="font-size: 11px;">Ticket Holder</div><div>${ticket.customerName}</div></div>
                <div style="background: #f0f9ff; padding: 10px;"><div style="font-size: 11px;">Price</div><div>${formatEthiopianBirr(ticket.price)}</div></div>
                <div style="background: #f0f9ff; padding: 10px;"><div style="font-size: 11px;">Venue</div><div>${ticket.venue}</div></div>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    printWindow.document.write(`
      <html><head><title>Theatre Hub Ethiopia - Tickets</title><style>body{font-family:Arial;padding:20px;}</style>
      <script src="https://cdn.jsdelivr.net/npm/qrcodejs2-fix/qrcode.min.js"><\/script></head>
      <body>${allTicketsHtml}
      <script>${bookingData.tickets.map((ticket, index) => `
        new QRCode(document.getElementById("qr-print-${index}"), {
          text: ${JSON.stringify(JSON.stringify(ticket.qrData))},
          width: 150, height: 150, colorDark: "#007590", colorLight: "#ffffff"
        });
      `).join('')}<\/script>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getSeatColor = (seat) => {
    if (seat.isReserved) return 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed opacity-50 border-gray-300';
    if (selectedSeats.includes(seat.id)) return 'bg-deepTeal text-white ring-2 ring-deepTeal ring-offset-2 shadow-lg transform scale-105';

    const sectionColors = {
      VIP: 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900',
      PREMIUM: 'bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-900',
      STANDARD: 'bg-deepTeal/10 hover:bg-deepTeal/20 border-deepTeal/30 text-deepTeal'
    };
    return `${sectionColors[seat.section]} border-2 transition-all duration-200 hover:scale-105 hover:shadow-md`;
  };

  const closeTicketModal = () => {
    setShowTicketModal(false);
    setBookingData(null);
    onClose();
    setStep(1);
    setSelectedSeats([]);
    setSeatDetails({});
    setCustomerInfo({ name: '', email: '', phone: '' });
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
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
              {/* Header */}
              <div className="bg-gradient-to-r from-deepTeal to-deepBlue text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Ticket className="h-6 w-6" />
                      Theatre Hub Ethiopia
                    </h2>
                    <p className="text-white/80 text-sm mt-1">{show.title}</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Progress Steps - Only 3 steps now */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {[
                    { step: 1, label: 'Select Seats', icon: Ticket },
                    { step: 2, label: 'Your Info', icon: User },
                    { step: 3, label: 'Payment', icon: CreditCard }
                  ].map((item) => (
                    <div key={item.step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step >= item.step ? 'bg-deepTeal text-white shadow-lg' : 'bg-gray-200 dark:bg-dark-700 text-gray-500'}`}>
                          {step > item.step ? <CheckCircle className="h-5 w-5" /> : <item.icon className="h-5 w-5" />}
                        </div>
                        <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 hidden sm:block font-medium">{item.label}</span>
                      </div>
                      {item.step < 3 && (<div className="flex-1 h-0.5 bg-gray-200 dark:bg-dark-700"><div className={`h-full bg-deepTeal transition-all duration-500 ${step > item.step ? 'w-full' : 'w-0'}`} /></div>)}
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

                {/* Step 1: Seat Selection */}
                {step === 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                      Select Your Seats
                    </h3>

                    {/* Price Summary */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-deepTeal/10 to-deepBlue/5 rounded-xl border border-deepTeal/20 max-w-md mx-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Selected Seats:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{selectedSeats.length} seats</span>
                      </div>
                      {selectedSeats.length > 0 && (
                        <div className="flex items-center justify-between font-bold border-t border-deepTeal/20 pt-2 mt-2">
                          <span>Total:</span>
                          <span className="text-deepTeal text-xl">{formatEthiopianBirr(calculateTotal())}</span>
                        </div>
                      )}
                    </div>

                    {/* Seat Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-amber-100 border-2 border-amber-300"></div>
                        <span className="text-xs text-gray-600">VIP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-purple-100 border-2 border-purple-300"></div>
                        <span className="text-xs text-gray-600">Premium</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-deepTeal/10 border-2 border-deepTeal/30"></div>
                        <span className="text-xs text-gray-600">Standard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-deepTeal ring-2 ring-deepTeal ring-offset-1"></div>
                        <span className="text-xs text-gray-600">Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-gray-200 border-2 border-gray-300"></div>
                        <span className="text-xs text-gray-600">Reserved</span>
                      </div>
                    </div>

                    {/* Stage/Screen */}
                    <div className="mb-8 text-center">
                      <div className="relative">
                        <div className="w-64 h-1.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full mx-auto"></div>
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 uppercase tracking-wider">STAGE</div>
                      </div>
                    </div>

                    {/* Seat Grid */}
                    <div className="flex justify-center">
                      <div className="inline-block">
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => {
                          const rowSeats = seats.filter(seat => seat.row === row).sort((a, b) => a.number - b.number);
                          if (rowSeats.length === 0) return null;

                          const section = rowSeats[0]?.section;
                          const sectionConfig = SEAT_SECTIONS[section];

                          return (
                            <div key={row} className="flex items-center mb-2">
                              <div className="w-8 text-center font-mono font-bold text-gray-400 text-sm">{row}</div>
                              <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
                                {rowSeats.map(seat => (
                                  <button
                                    key={seat.id}
                                    onClick={() => handleSeatSelect(seat.id)}
                                    disabled={seat.isReserved}
                                    onMouseEnter={() => setHoveredSeat(seat.id)}
                                    onMouseLeave={() => setHoveredSeat(null)}
                                    className={`
                                      w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
                                      ${getSeatColor(seat)}
                                      ${hoveredSeat === seat.id && !seat.isReserved && !selectedSeats.includes(seat.id) ? 'shadow-lg transform scale-105' : ''}
                                      ${seat.isReserved ? 'cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                    title={`${seat.sectionName} Seat ${seat.id} - ${formatEthiopianBirr(seat.price)}`}
                                  >
                                    {seat.number}
                                  </button>
                                ))}
                              </div>
                              <div className="w-20 text-right">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${section === 'VIP' ? 'bg-amber-100 text-amber-700' :
                                  section === 'PREMIUM' ? 'bg-purple-100 text-purple-700' :
                                    'bg-deepTeal/10 text-deepTeal'
                                  }`}>
                                  {sectionConfig?.name}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected Seats List */}
                    {selectedSeats.length > 0 && (
                      <div className="mt-8 p-5 bg-gray-50 dark:bg-dark-700 rounded-xl">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-deepTeal" />
                          Selected Seats ({selectedSeats.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {selectedSeats.map(seatId => {
                            const seat = seats.find(s => s.id === seatId);
                            return (
                              <div key={seatId} className="flex items-center justify-between p-2 bg-white dark:bg-dark-800 rounded-lg border border-gray-200">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{seatId}</p>
                                  <p className="text-xs text-gray-500">{seat?.sectionName}</p>
                                </div>
                                <p className="text-sm font-semibold text-deepTeal">{formatEthiopianBirr(seat?.price)}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Customer Information */}
                {step === 2 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                      Your Information
                    </h3>
                    <div className="space-y-5 max-w-2xl mx-auto">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={customerInfo.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-deepTeal focus:ring-2 focus:ring-deepTeal/20 transition-all"
                            placeholder="Enter your full name"
                          />
                        </div>
                        {validation.name.touched && !validation.name.isValid && (
                          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {validation.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-deepTeal focus:ring-2 focus:ring-deepTeal/20 transition-all"
                            placeholder="Enter your email"
                          />
                        </div>
                        {validation.email.touched && !validation.email.isValid && (
                          <p className="mt-1 text-xs text-red-500">{validation.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Ethiopian Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            value={customerInfo.phone}
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-deepTeal focus:ring-2 focus:ring-deepTeal/20 transition-all"
                            placeholder="09XXXXXXXX or 07XXXXXXXX"
                          />
                        </div>
                        {validation.phone.touched && !validation.phone.isValid && (
                          <p className="mt-1 text-xs text-red-500">{validation.phone.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Chapa Payment */}
                {step === 3 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                      Complete Payment
                    </h3>
                    <div className="max-w-md mx-auto">
                      <div className="mb-6 p-6 bg-gradient-to-r from-deepTeal/10 to-deepBlue/5 rounded-xl border border-deepTeal/20">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-600 font-medium">Total Amount:</span>
                          <span className="text-3xl font-bold text-deepTeal">{formatEthiopianBirr(calculateTotal())}</span>
                        </div>
                        <div className="border-t border-deepTeal/20 pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tickets:</span>
                            <span className="font-medium">{selectedSeats.length} tickets</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-500">Seats:</span>
                            <span className="font-mono text-sm">{selectedSeats.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <Wallet className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-green-800">Pay with Chapa</h4>
                            <p className="text-sm text-green-600">Secure payment gateway</p>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Accepts Telebirr, CBE Birr, and all cards
                          </p>
                          <p className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Secure SSL encrypted payment
                          </p>
                          <p className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Instant ticket delivery after payment
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
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <Wallet className="h-5 w-5" />
                            Pay {formatEthiopianBirr(calculateTotal())} with Chapa
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-gray-400 mt-4">
                        By completing this payment, you agree to our terms and conditions
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
                {step > 1 && step < 3 && (
                  <button onClick={handleBack} className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                )}
                {step < 3 ? (
                  <button onClick={handleNext} className="ml-auto px-6 py-2.5 bg-gradient-to-r from-deepTeal to-deepBlue text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Ticket Modal */}
      {showTicketModal && bookingData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={closeTicketModal} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div><h2 className="text-2xl font-bold flex items-center gap-2"><QrCode className="h-6 w-6 text-deepTeal" /> Your Tickets</h2><p className="text-sm text-gray-500">{bookingData.totalSeats} ticket(s) for {bookingData.show}</p></div>
              <button onClick={closeTicketModal} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-green-700 font-medium">✅ Payment Successful! Booking ID: {bookingData.bookingId} | Total: {bookingData.totalAmountBirr}</p>
              </div>
              <div className="space-y-6">
                {bookingData.tickets.map((ticket, index) => (
                  <div key={ticket.ticketId} className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-deepTeal/30">
                    <div className="bg-gradient-to-r from-deepTeal to-deepBlue text-white px-5 py-4">
                      <div className="flex justify-between"><div><h3 className="font-bold">Theatre Hub Ethiopia</h3></div><div className="text-right"><p className="text-xs">Ticket {index + 1} of {bookingData.totalSeats}</p><p className="text-[10px] font-mono">{ticket.ticketId}</p></div></div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-center mb-5"><div className="bg-white p-3 rounded-xl shadow-lg"><QRCodeSVG value={ticket.qrData} size={130} level="H" /></div></div>
                      <div className="flex justify-center gap-3 mb-4">
                        <button onClick={() => shareQRCode(ticket, index)} className="flex items-center gap-2 px-4 py-2 bg-deepTeal text-white rounded-lg">{sharedStates[index] ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />} {sharedStates[index] ? 'Shared!' : 'Share'}</button>
                        <button onClick={() => copyQRCodeData(ticket, index)} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg">{copiedStates[index] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copiedStates[index] ? 'Copied!' : 'Copy QR'}</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-deepTeal/5 p-3 rounded-xl"><div className="text-xs text-gray-500">Seat</div><p className="font-bold text-2xl text-deepTeal">{ticket.seat}</p><p className="text-xs">Row {ticket.row}, Seat {ticket.number}</p></div>
                        <div className="bg-deepTeal/5 p-3 rounded-xl"><div className="text-xs text-gray-500">Ticket Holder</div><p className="font-semibold">{ticket.customerName}</p></div>
                        <div className="bg-deepTeal/5 p-3 rounded-xl"><div className="text-xs text-gray-500">Seat Type</div><p className="font-semibold">{ticket.section}</p></div>
                        <div className="bg-deepTeal/5 p-3 rounded-xl"><div className="text-xs text-gray-500">Price</div><p className="font-bold text-deepTeal">{formatEthiopianBirr(ticket.price)}</p></div>
                      </div>
                      <div className="text-center pt-2 border-t"><p className="text-[10px] text-gray-400">Scan this unique QR code at venue entrance</p></div>
                    </div>
                    <div className="bg-deepTeal/5 px-5 py-3 flex justify-between">
                      <button onClick={() => downloadTicket(ticket, index)} className="px-3 py-1.5 text-sm bg-deepTeal text-white rounded-lg"><Download className="h-3.5 w-3.5 inline mr-1" /> Download</button>
                      <button onClick={() => { const w = window.open('', '_blank'); w.document.write(`<html><head><title>Ticket</title></head><body>${document.getElementById(`ticket-${index}`).outerHTML}</body></html>`); w.print(); }} className="px-3 py-1.5 text-sm border border-deepTeal/50 text-deepTeal rounded-lg"><Printer className="h-3.5 w-3.5 inline mr-1" /> Print</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={printAllTickets} className="flex-1 py-3 bg-deepTeal text-white rounded-lg"><Printer className="h-4 w-4 inline mr-2" /> Print All ({bookingData.totalSeats})</button>
                <button onClick={closeTicketModal} className="flex-1 py-3 border-2 rounded-lg">Done</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

BookingModal.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    venue: PropTypes.string,
    images: PropTypes.shape({ poster: PropTypes.string }),
    priceRange: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number })
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default BookingModal;