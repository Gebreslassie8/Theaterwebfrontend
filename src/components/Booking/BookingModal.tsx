// BookingModal.jsx - Complete with Ethiopian-themed tickets with your color scheme
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
    Check
} from 'lucide-react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';

// Ethiopian Banks for payment
const ETHIOPIAN_BANKS = [
    { id: 'cbe', name: 'Commercial Bank of Ethiopia (CBE)', icon: Landmark, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'awash', name: 'Awash Bank', icon: Landmark, color: 'bg-green-50 text-green-700 border-green-200' },
    { id: 'dashen', name: 'Dashen Bank', icon: Landmark, color: 'bg-red-50 text-red-700 border-red-200' },
    { id: 'hibret', name: 'Hibret Bank', icon: Landmark, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'nib', name: 'NIB International Bank', icon: Landmark, color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 'wegagen', name: 'Wegagen Bank', icon: Landmark, color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { id: 'zemen', name: 'Zemen Bank', icon: Landmark, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
];

// Ethiopian Mobile Money Services
const MOBILE_MONEY_SERVICES = [
    { id: 'telebirr', name: 'TeleBirr', icon: Smartphone, color: 'bg-green-600', textColor: 'text-green-600', borderColor: 'border-green-200', bgLight: 'bg-green-50', code: '*127#' },
    { id: 'cbebirr', name: 'CBE Birr', icon: Smartphone, color: 'bg-blue-600', textColor: 'text-blue-600', borderColor: 'border-blue-200', bgLight: 'bg-blue-50', code: '*894#' },
    { id: 'amole', name: 'Amole', icon: Smartphone, color: 'bg-purple-600', textColor: 'text-purple-600', borderColor: 'border-purple-200', bgLight: 'bg-purple-50', code: '*127*01#' }
];

// Ethiopian Payment Methods
const PAYMENT_METHODS = [
    { id: 'mobile-money', name: 'Mobile Money', icon: Smartphone, description: 'TeleBirr, CBE Birr, Amole', color: 'from-green-500 to-emerald-500' },
    { id: 'bank-transfer', name: 'Bank Transfer', icon: Landmark, description: 'Direct bank transfer to our account', color: 'from-blue-500 to-indigo-500' },
    { id: 'card', name: 'Card Payment', icon: CreditCard, description: 'Visa, Mastercard, Amex', color: 'from-purple-500 to-pink-500' }
];

// Seat Sections with pricing tiers - Updated with your color scheme
const SEAT_SECTIONS = {
    VIP: { rows: ['A', 'B'], multiplier: 2.5, name: 'VIP', color: 'from-amber-400 to-orange-500', icon: Crown, priceSuffix: 'Premium Experience' },
    PREMIUM: { rows: ['C', 'D'], multiplier: 1.8, name: 'Premium', color: 'from-purple-400 to-pink-500', icon: Award, priceSuffix: 'Best View' },
    STANDARD: { rows: ['E', 'F'], multiplier: 1.2, name: 'Standard', color: 'from-deepTeal to-deepBlue', icon: Users, priceSuffix: 'Comfortable' },
    ECONOMY: { rows: ['G', 'H'], multiplier: 1, name: 'Economy', color: 'from-green-400 to-emerald-500', icon: Ticket, priceSuffix: 'Great Value' }
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

// Function to generate unique QR data for each ticket
const generateUniqueQRData = (ticket, index) => {
    return JSON.stringify({
        ticketId: ticket.ticketId,
        ticketNumber: index + 1,
        totalTickets: ticket.totalTickets,
        bookingId: ticket.bookingId,
        show: ticket.show,
        date: ticket.date,
        time: ticket.time,
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
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatDetails, setSeatDetails] = useState({});
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedMobileMoney, setSelectedMobileMoney] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [copiedStates, setCopiedStates] = useState({});
    const [sharedStates, setSharedStates] = useState({});

    // Validation states
    const [validation, setValidation] = useState({
        name: { isValid: true, message: '', touched: false },
        email: { isValid: true, message: '', touched: false },
        phone: { isValid: true, message: '', touched: false }
    });

    // Generate seat layout with sections and pricing
    const generateSeats = () => {
        const seats = [];
        const basePrice = selectedDate?.price || 500;

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
                        icon: config.icon
                    });
                }
            });
        });
        return seats;
    };

    const [seats, setSeats] = useState(generateSeats());

    useEffect(() => {
        if (selectedDate) {
            const basePrice = selectedDate.price;
            const updatedSeats = seats.map(seat => {
                const sectionConfig = SEAT_SECTIONS[seat.section];
                return {
                    ...seat,
                    price: Math.round(basePrice * sectionConfig.multiplier)
                };
            });
            setSeats(updatedSeats);
        }
    }, [selectedDate]);

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

    const calculateSubtotal = () => {
        return selectedSeats.reduce((total, seatId) => {
            const seat = seats.find(s => s.id === seatId);
            return total + (seat?.price || 0);
        }, 0);
    };

    const calculateDiscount = () => {
        return (calculateSubtotal() * discount) / 100;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    const handlePromoCode = () => {
        if (promoCode.toUpperCase() === 'THEATRE10') {
            setDiscount(10);
            setError('');
        } else if (promoCode.toUpperCase() === 'WELCOME20') {
            setDiscount(20);
            setError('');
        } else if (promoCode.toUpperCase() === 'ETHIOPIA15') {
            setDiscount(15);
            setError('');
        } else if (promoCode) {
            setError('Invalid promo code');
            setTimeout(() => setError(''), 3000);
        }
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
        if (step === 1 && !selectedDate) {
            setError('Please select a show date and time');
            return;
        }
        if (step === 2 && selectedSeats.length === 0) {
            setError('Please select at least one seat');
            return;
        }
        if (step === 3) {
            if (!customerInfo.name || !validation.name.isValid ||
                !customerInfo.email || !validation.email.isValid ||
                !customerInfo.phone || !validation.phone.isValid) {
                setError('Please fill in all customer information correctly');
                return;
            }
        }
        if (step === 4 && !paymentMethod) {
            setError('Please select a payment method');
            return;
        }
        if (step === 4 && paymentMethod === 'bank-transfer' && !selectedBank) {
            setError('Please select a bank');
            return;
        }
        if (step === 4 && paymentMethod === 'mobile-money' && !selectedMobileMoney) {
            setError('Please select a mobile money service');
            return;
        }

        setError('');
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
        setError('');
    };

    // Generate tickets with Ethiopian-themed data and unique QR codes for each seat
    const generateTickets = () => {
        const bookingId = `TKT${Date.now()}${Math.random().toString(36).substring(2, 10)}`;
        const totalSeatsCount = selectedSeats.length;

        return selectedSeats.map((seatId, index) => {
            const seat = seats.find(s => s.id === seatId);
            const ticketId = `${bookingId}${Math.random().toString(36).substring(2, 8)}`;

            // Format date nicely
            const showDate = selectedDate?.date ? new Date(selectedDate.date) : new Date();
            const formattedDate = showDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const ticketData = {
                ticketId: ticketId,
                bookingId: bookingId,
                ticketNumber: index + 1,
                totalTickets: totalSeatsCount,
                show: show.title,
                date: formattedDate,
                time: selectedDate?.time || '7:30 PM',
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

            // Generate unique QR data for this specific ticket
            ticketData.qrData = generateUniqueQRData(ticketData, index);

            return ticketData;
        });
    };

    const handleConfirm = async () => {
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const tickets = generateTickets();
        const bookingId = tickets[0]?.bookingId || `TKT${Date.now()}`;

        const bookingInfo = {
            bookingId: bookingId,
            show: show.title,
            date: selectedDate?.date,
            time: selectedDate?.time,
            seats: selectedSeats,
            seatDetails: seatDetails,
            totalSeats: selectedSeats.length,
            subtotal: calculateSubtotal(),
            discount: calculateDiscount(),
            totalAmount: calculateTotal(),
            totalAmountBirr: formatEthiopianBirr(calculateTotal()),
            customerInfo,
            paymentMethod,
            paymentDetails: {
                bank: selectedBank ? ETHIOPIAN_BANKS.find(b => b.id === selectedBank)?.name : null,
                mobileMoney: selectedMobileMoney ? MOBILE_MONEY_SERVICES.find(m => m.id === selectedMobileMoney)?.name : null
            },
            bookingDate: new Date().toISOString(),
            status: 'confirmed',
            venue: show.venue,
            tickets: tickets
        };

        setBookingData(bookingInfo);
        setShowTicketModal(true);
        setIsProcessing(false);

        // Save to localStorage
        const bookings = JSON.parse(localStorage.getItem('theater_bookings') || '[]');
        bookings.push(bookingInfo);
        localStorage.setItem('theater_bookings', JSON.stringify(bookings));

        onConfirm(bookingInfo);
    };

    // Copy QR code data to clipboard
    const copyQRCodeData = (ticket, index) => {
        const qrDataString = JSON.stringify(ticket.qrData, null, 2);
        navigator.clipboard.writeText(qrDataString).then(() => {
            setCopiedStates(prev => ({ ...prev, [index]: true }));
            setTimeout(() => {
                setCopiedStates(prev => ({ ...prev, [index]: false }));
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy QR code data');
        });
    };

    // Share QR code
    const shareQRCode = async (ticket, index) => {
        const shareData = {
            title: `Theatre Hub Ethiopia - Ticket for ${ticket.seat}`,
            text: `🎭 Theatre Hub Ethiopia Ticket\n\nShow: ${ticket.show}\nDate: ${ticket.date}\nTime: ${ticket.time}\nSeat: ${ticket.seat} (Row ${ticket.row}, Seat ${ticket.number})\nTicket Holder: ${ticket.customerName}\nTicket ID: ${ticket.ticketId}\n\nScan this QR code at the venue entrance.\n\nBooking ID: ${ticket.bookingId}`,
            url: `https://theatrehubethiopia.com/verify/${ticket.ticketId}`
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                setSharedStates(prev => ({ ...prev, [index]: true }));
                setTimeout(() => {
                    setSharedStates(prev => ({ ...prev, [index]: false }));
                }, 2000);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                    // Fallback to copying text
                    const textToShare = `${shareData.title}\n\n${shareData.text}`;
                    navigator.clipboard.writeText(textToShare);
                    alert('Share info copied to clipboard!');
                }
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            const textToShare = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
            navigator.clipboard.writeText(textToShare);
            setCopiedStates(prev => ({ ...prev, [index]: true }));
            setTimeout(() => {
                setCopiedStates(prev => ({ ...prev, [index]: false }));
            }, 2000);
            alert('Ticket details copied to clipboard! You can now share it via any app.');
        }
    };

    // Download individual ticket as HTML
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
            .ticket-container { max-width: 500px; width: 100%; }
            .ticket {
              background: white;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              animation: fadeIn 0.5s ease-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .ticket-header {
              background: linear-gradient(135deg, #007590, #17304F);
              color: white;
              padding: 20px;
              position: relative;
              overflow: hidden;
              text-align: center;
            }
            .ticket-header::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 8px);
              pointer-events: none;
            }
            .ticket-content { padding: 24px; }
            .qr-code {
              text-align: center;
              margin: 20px 0;
              padding: 10px;
              background: white;
              border-radius: 16px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              margin: 20px 0;
            }
            .detail-card {
              background: #f0f9ff;
              padding: 12px;
              border-radius: 12px;
              border-left: 3px solid #007590;
            }
            .detail-label { font-size: 11px; color: #007590; margin-bottom: 4px; }
            .detail-value { font-size: 16px; font-weight: 600; color: #111827; }
            .ethiopian-message {
              background: linear-gradient(135deg, #e6f7ff, #b3e0ff);
              padding: 12px;
              border-radius: 12px;
              text-align: center;
              margin: 20px 0;
            }
            .footer {
              background: #f0f9ff;
              padding: 12px;
              text-align: center;
              font-size: 10px;
              color: #007590;
              border-top: 1px solid #b3e0ff;
            }
            .ticket-badge {
              display: inline-block;
              background: rgba(255,255,255,0.2);
              padding: 4px 8px;
              border-radius: 20px;
              font-size: 10px;
              margin-top: 8px;
            }
            @media print {
              body { background: white; padding: 0; }
              .ticket { box-shadow: none; border: 1px solid #e5e7eb; }
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="ticket">
              <div class="ticket-header">
                <div style="font-size: 32px; margin-bottom: 8px;">🇪🇹</div>
                <h2 style="margin: 0; font-size: 20px;">Theatre Hub Ethiopia</h2>
                <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Traditional Ethiopian Music Night</p>
                <div class="ticket-badge">
                  Ticket ${ticket.ticketNumber} of ${ticket.totalTickets}
                </div>
              </div>
              <div class="ticket-content">
                <div style="text-align: center; margin-bottom: 16px;">
                  <h1 style="font-size: 20px; color: #007590;">${ticket.show}</h1>
                  <p style="font-size: 12px; color: #17304F;">መዝናኛ ምሽት | Entertainment Night</p>
                </div>
                <div class="qr-code">
                  <div id="qr-code-${index}" style="display: flex; justify-content: center;"></div>
                  <p style="font-size: 10px; color: #007590; margin-top: 8px;">Scan this unique QR code at venue entrance</p>
                  <p style="font-size: 8px; color: #6c757d; margin-top: 4px;">This QR code is valid only for ${ticket.seat}</p>
                </div>
                <div class="details-grid">
                  <div class="detail-card">
                    <div class="detail-label">Ticket ID</div>
                    <div class="detail-value" style="font-size: 12px; font-family: monospace;">${ticket.ticketId}</div>
                  </div>
                  <div class="detail-card">
                    <div class="detail-label">Ticket Holder</div>
                    <div class="detail-value">${ticket.customerName}</div>
                  </div>
                  <div class="detail-card">
                    <div class="detail-label">Seat</div>
                    <div class="detail-value" style="font-size: 24px;">${ticket.seat}</div>
                    <div style="font-size: 10px; color: #6c757d;">Row ${ticket.row}, Seat ${ticket.number}</div>
                  </div>
                  <div class="detail-card">
                    <div class="detail-label">Seat Type</div>
                    <div class="detail-value">${ticket.section || 'REGULAR'}</div>
                  </div>
                  <div class="detail-card">
                    <div class="detail-label">Price</div>
                    <div class="detail-value">${formatEthiopianBirr(ticket.price)}</div>
                  </div>
                  <div class="detail-card">
                    <div class="detail-label">Date & Time</div>
                    <div class="detail-value" style="font-size: 12px;">${ticket.date}<br>${ticket.time}</div>
                  </div>
                </div>
                <div class="ethiopian-message">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 4px;">
                    <span>☕</span>
                    <span style="font-weight: 600; color: #17304F;">ቡና ይጠጡ | Enjoy Ethiopian Coffee</span>
                  </div>
                  <p style="font-size: 10px; color: #17304F;">እንኳን ደህና መጡ! | Welcome! | Please present this QR code at the entrance</p>
                </div>
                <div style="text-align: center; margin-top: 16px;">
                  <p style="font-size: 10px; color: #6c757d;">Venue: ${ticket.venue}</p>
                </div>
              </div>
              <div class="footer">
                This ticket is valid for one-time entry only • Scan unique QR code at venue
              </div>
            </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs2-fix/qrcode.min.js"></script>
          <script>
            new QRCode(document.getElementById("qr-code-${index}"), {
              text: ${JSON.stringify(JSON.stringify(ticket.qrData))},
              width: 150,
              height: 150,
              colorDark: "#007590",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H
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
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Print all tickets
    const printAllTickets = () => {
        const printWindow = window.open('', '_blank');
        let allTicketsHtml = '';

        bookingData.tickets.forEach((ticket, index) => {
            allTicketsHtml += `
        <div style="margin-bottom: 30px; page-break-after: avoid; break-inside: avoid;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #007590, #17304F); color: white; padding: 20px; text-align: center;">
              <div style="font-size: 32px;">🇪🇹</div>
              <h2 style="margin: 0; font-size: 20px;">Theatre Hub Ethiopia</h2>
              <p style="margin: 4px 0 0 0; font-size: 12px;">Traditional Ethiopian Music Night</p>
              <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 20px; font-size: 10px; margin-top: 8px;">
                Ticket ${ticket.ticketNumber} of ${ticket.totalTickets}
              </div>
            </div>
            <div style="padding: 24px;">
              <div style="text-align: center; margin-bottom: 16px;">
                <h1 style="font-size: 20px; color: #007590;">${ticket.show}</h1>
                <p style="font-size: 12px; color: #17304F;">መዝናኛ ምሽት | Entertainment Night</p>
              </div>
              <div style="text-align: center; margin: 20px 0; padding: 10px; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <div id="qr-print-${index}" style="display: flex; justify-content: center;"></div>
                <p style="font-size: 10px; color: #007590; margin-top: 8px;">Scan this unique QR code at venue entrance</p>
                <p style="font-size: 8px; color: #6c757d; margin-top: 4px;">This QR code is valid only for ${ticket.seat}</p>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0;">
                <div style="background: #f0f9ff; padding: 12px; border-radius: 12px; border-left: 3px solid #007590;">
                  <div style="font-size: 11px; color: #007590;">Ticket ID</div>
                  <div style="font-size: 12px; font-family: monospace;">${ticket.ticketId}</div>
                </div>
                <div style="background: #f0f9ff; padding: 12px; border-radius: 12px; border-left: 3px solid #007590;">
                  <div style="font-size: 11px; color: #007590;">Ticket Holder</div>
                  <div style="font-size: 16px; font-weight: 600;">${ticket.customerName}</div>
                </div>
                <div style="background: #f0f9ff; padding: 12px; border-radius: 12px; border-left: 3px solid #007590;">
                  <div style="font-size: 11px; color: #007590;">Seat</div>
                  <div style="font-size: 24px; font-weight: bold; color: #007590;">${ticket.seat}</div>
                  <div style="font-size: 10px;">Row ${ticket.row}, Seat ${ticket.number}</div>
                </div>
                <div style="background: #f0f9ff; padding: 12px; border-radius: 12px; border-left: 3px solid #007590;">
                  <div style="font-size: 11px; color: #007590;">Seat Type</div>
                  <div style="font-size: 16px; font-weight: 600;">${ticket.section || 'REGULAR'}</div>
                </div>
                <div style="background: #f0f9ff; padding: 12px; border-radius: 12px; border-left: 3px solid #007590;">
                  <div style="font-size: 11px; color: #007590;">Price</div>
                  <div style="font-size: 16px; font-weight: 600;">${formatEthiopianBirr(ticket.price)}</div>
                </div>
                <div style="background: #f0f9ff; padding: 12px; border-radius: 12px; border-left: 3px solid #007590;">
                  <div style="font-size: 11px; color: #007590;">Date & Time</div>
                  <div style="font-size: 12px;">${ticket.date}<br>${ticket.time}</div>
                </div>
              </div>
              <div style="background: linear-gradient(135deg, #e6f7ff, #b3e0ff); padding: 12px; border-radius: 12px; text-align: center; margin: 20px 0;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 4px;">
                  <span>☕</span>
                  <span style="font-weight: 600; color: #17304F;">ቡና ይጠጡ | Enjoy Ethiopian Coffee</span>
                </div>
                <p style="font-size: 10px; color: #17304F;">እንኳን ደህና መጡ! | Welcome! | Please present this QR code at the entrance</p>
              </div>
              <div style="text-align: center; margin-top: 16px;">
                <p style="font-size: 10px; color: #6c757d;">Venue: ${ticket.venue}</p>
              </div>
            </div>
            <div style="background: #f0f9ff; padding: 12px; text-align: center; font-size: 10px; color: #007590; border-top: 1px solid #b3e0ff;">
              This ticket is valid for one-time entry only • Scan unique QR code at venue
            </div>
          </div>
        </div>
      `;
        });

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Theatre Hub Ethiopia - All Tickets (${bookingData.totalSeats} Tickets)</title>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
            @media print {
              body { background: white; padding: 0; }
              .ticket { break-inside: avoid; page-break-inside: avoid; margin-bottom: 20px; }
            }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/qrcodejs2-fix/qrcode.min.js"></script>
        </head>
        <body>
          <div style="max-width: 600px; margin: 0 auto;">
            ${allTicketsHtml}
          </div>
          <script>
            // Generate QR codes for each ticket when printing
            ${bookingData.tickets.map((ticket, index) => `
              new QRCode(document.getElementById("qr-print-${index}"), {
                text: ${JSON.stringify(JSON.stringify(ticket.qrData))},
                width: 150,
                height: 150,
                colorDark: "#007590",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
              });
            `).join('\n')}
          </script>
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    const getSeatColor = (seat) => {
        if (seat.isReserved) return 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50';
        if (selectedSeats.includes(seat.id)) return 'bg-deepTeal text-white ring-2 ring-deepTeal ring-offset-2 shadow-lg';

        const sectionColors = {
            VIP: 'border-amber-400 hover:bg-amber-50',
            PREMIUM: 'border-purple-400 hover:bg-purple-50',
            STANDARD: 'border-deepTeal hover:bg-deepTeal/10',
            ECONOMY: 'border-green-400 hover:bg-green-50'
        };

        return `bg-white dark:bg-dark-700 ${sectionColors[seat.section]} border-2 hover:scale-105 transition-all`;
    };

    const closeTicketModal = () => {
        setShowTicketModal(false);
        setBookingData(null);
        onClose();

        setStep(1);
        setSelectedDate(null);
        setSelectedSeats([]);
        setSeatDetails({});
        setCustomerInfo({ name: '', email: '', phone: '' });
        setPaymentMethod('');
        setSelectedBank('');
        setSelectedMobileMoney('');
        setPromoCode('');
        setDiscount(0);
        setValidation({
            name: { isValid: true, message: '', touched: false },
            email: { isValid: true, message: '', touched: false },
            phone: { isValid: true, message: '', touched: false }
        });
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
                        className="relative max-w-5xl mx-auto mt-16 mb-16"
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
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Progress Steps */}
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900">
                                <div className="flex items-center justify-between max-w-3xl mx-auto">
                                    {[
                                        { step: 1, label: 'Date & Time', icon: Calendar },
                                        { step: 2, label: 'Select Seats', icon: Ticket },
                                        { step: 3, label: 'Your Info', icon: User },
                                        { step: 4, label: 'Payment', icon: CreditCard },
                                        { step: 5, label: 'Confirm', icon: CheckCircle }
                                    ].map((item) => (
                                        <div key={item.step} className="flex items-center flex-1">
                                            <div className="flex flex-col items-center flex-1">
                                                <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                          ${step >= item.step
                                                        ? 'bg-deepTeal text-white shadow-lg'
                                                        : 'bg-gray-200 dark:bg-dark-700 text-gray-500'
                                                    }
                        `}>
                                                    {step > item.step ? <CheckCircle className="h-5 w-5" /> : <item.icon className="h-5 w-5" />}
                                                </div>
                                                <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 hidden sm:block font-medium">
                                                    {item.label}
                                                </span>
                                            </div>
                                            {item.step < 5 && (
                                                <div className="flex-1 h-0.5 bg-gray-200 dark:bg-dark-700">
                                                    <div className={`
                            h-full bg-deepTeal transition-all duration-500
                            ${step > item.step ? 'w-full' : 'w-0'}
                          `} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 max-h-[65vh] overflow-y-auto">
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                {/* Step 1: Select Date & Time */}
                                {step === 1 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Select Show Date & Time
                                        </h3>
                                        <div className="grid gap-3">
                                            {show.dates && show.dates.length > 0 ? (
                                                show.dates.map((dateObj, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedDate(dateObj)}
                                                        className={`
                              p-4 rounded-lg border-2 transition-all text-left hover:shadow-lg
                              ${selectedDate === dateObj
                                                                ? 'border-deepTeal bg-deepTeal/10 shadow-lg ring-2 ring-deepTeal/20'
                                                                : 'border-gray-200 dark:border-dark-700 hover:border-deepTeal/50 hover:bg-gray-50 dark:hover:bg-dark-700'
                                                            }
                            `}
                                                    >
                                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                                            <div className="flex items-center gap-4">
                                                                <Calendar className="h-5 w-5 text-deepTeal" />
                                                                <div>
                                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                                        {new Date(dateObj.date).toLocaleDateString('en-US', {
                                                                            weekday: 'long',
                                                                            month: 'long',
                                                                            day: 'numeric'
                                                                        })}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Clock className="h-3 w-3 text-deepTeal" />
                                                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                                            {dateObj.time || '7:30 PM'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-deepTeal text-lg">
                                                                    {formatEthiopianBirr(dateObj.price || show.priceRange.min)}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {dateObj.availableSeats || 50} seats left
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                                    <p>No show times available</p>
                                                    <p className="text-sm mt-1">Please check back later for updates</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Seat Selection */}
                                {step === 2 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Select Your Seats
                                        </h3>

                                        {/* Price Summary */}
                                        <div className="mb-4 p-4 bg-gradient-to-r from-deepTeal/10 to-deepBlue/5 rounded-lg border border-deepTeal/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">Selected Seats:</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{selectedSeats.length} seats</span>
                                            </div>
                                            {selectedSeats.length > 0 && (
                                                <>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                                        <span>{formatEthiopianBirr(calculateSubtotal())}</span>
                                                    </div>
                                                    {discount > 0 && (
                                                        <div className="flex items-center justify-between text-sm text-green-600">
                                                            <span>Discount ({discount}%):</span>
                                                            <span>-{formatEthiopianBirr(calculateDiscount())}</span>
                                                        </div>
                                                    )}
                                                    <div className="border-t border-deepTeal/20 mt-2 pt-2">
                                                        <div className="flex items-center justify-between font-bold">
                                                            <span>Total:</span>
                                                            <span className="text-deepTeal text-xl">{formatEthiopianBirr(calculateTotal())}</span>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Seat Legend */}
                                        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs">
                                            {Object.entries(SEAT_SECTIONS).map(([key, section]) => (
                                                <div key={key} className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded border-2 border-${section.color.split('-')[1]}-400 bg-white`} />
                                                    <span className="text-gray-600">{section.name}</span>
                                                </div>
                                            ))}
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-deepTeal rounded" />
                                                <span className="text-gray-600">Selected</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-gray-300 rounded" />
                                                <span className="text-gray-600">Reserved</span>
                                            </div>
                                        </div>

                                        {/* Screen */}
                                        <div className="mb-8">
                                            <div className="w-full h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full" />
                                            <p className="text-center text-xs text-gray-500 mt-2 font-medium">SCREEN</p>
                                        </div>

                                        {/* Seats Grid */}
                                        <div className="overflow-x-auto">
                                            <div className="min-w-[700px]">
                                                {Object.entries(SEAT_SECTIONS).map(([section, config]) => (
                                                    <div key={section} className="mb-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {React.createElement(config.icon, { className: `h-4 w-4 text-${config.color.split('-')[1]}-500` })}
                                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{config.name} Section</span>
                                                            <span className="text-xs text-gray-500">({config.priceSuffix})</span>
                                                        </div>
                                                        {config.rows.map(row => (
                                                            <div key={row} className="flex items-center mb-2">
                                                                <div className="w-8 text-center font-bold text-gray-500">{row}</div>
                                                                <div className="flex gap-2 flex-1 justify-center">
                                                                    {seats
                                                                        .filter(seat => seat.row === row)
                                                                        .map(seat => (
                                                                            <button
                                                                                key={seat.id}
                                                                                onClick={() => handleSeatSelect(seat.id)}
                                                                                disabled={seat.isReserved}
                                                                                className={`
                                          w-10 h-10 rounded-lg transition-all duration-200 text-sm font-medium
                                          ${getSeatColor(seat)}
                                        `}
                                                                                title={`${seat.sectionName} Seat ${seat.id} - ${formatEthiopianBirr(seat.price)}`}
                                                                            >
                                                                                {seat.number}
                                                                            </button>
                                                                        ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Selected Seats List */}
                                        {selectedSeats.length > 0 && (
                                            <div className="mt-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                    <Ticket className="h-4 w-4 text-deepTeal" />
                                                    Selected Seats ({selectedSeats.length})
                                                </h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                    {selectedSeats.map(seatId => {
                                                        const seat = seats.find(s => s.id === seatId);
                                                        return (
                                                            <div key={seatId} className="flex items-center justify-between p-2 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600">
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

                                        {/* Promo Code */}
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Promo Code
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                    placeholder="Enter promo code (THEATRE10, WELCOME20, ETHIOPIA15)"
                                                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-deepTeal focus:border-deepTeal dark:bg-dark-700 dark:text-white"
                                                />
                                                <button
                                                    onClick={handlePromoCode}
                                                    className="px-4 py-2 bg-deepTeal text-white rounded-lg hover:bg-deepTeal/90 transition-colors"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Customer Information */}
                                {step === 3 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Your Information
                                        </h3>
                                        <div className="space-y-5 max-w-2xl mx-auto">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <div className={`relative transition-all duration-200 ${focusedField === 'name' ? 'transform scale-[1.02]' : ''}`}>
                                                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${validation.name.touched && !validation.name.isValid ? 'text-red-400' :
                                                            validation.name.touched && validation.name.isValid ? 'text-green-500' : 'text-gray-400'
                                                        }`} />
                                                    <input
                                                        type="text"
                                                        value={customerInfo.name}
                                                        onChange={(e) => handleFieldChange('name', e.target.value)}
                                                        onFocus={() => setFocusedField('name')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className={`
                              w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepTeal transition-all
                              ${validation.name.touched && !validation.name.isValid
                                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                                : validation.name.touched && validation.name.isValid
                                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                                    : 'border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700'
                                                            }
                            `}
                                                        placeholder="Enter your full name"
                                                    />
                                                    {validation.name.touched && validation.name.isValid && (
                                                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                                                    )}
                                                </div>
                                                {validation.name.touched && !validation.name.isValid && (
                                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {validation.name.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                                                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${validation.email.touched && !validation.email.isValid ? 'text-red-400' :
                                                            validation.email.touched && validation.email.isValid ? 'text-green-500' : 'text-gray-400'
                                                        }`} />
                                                    <input
                                                        type="email"
                                                        value={customerInfo.email}
                                                        onChange={(e) => handleFieldChange('email', e.target.value)}
                                                        onFocus={() => setFocusedField('email')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className={`
                              w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepTeal transition-all
                              ${validation.email.touched && !validation.email.isValid
                                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                                : validation.email.touched && validation.email.isValid
                                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                                    : 'border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700'
                                                            }
                            `}
                                                        placeholder="Enter your email"
                                                    />
                                                    {validation.email.touched && validation.email.isValid && (
                                                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                                                    )}
                                                </div>
                                                {validation.email.touched && !validation.email.isValid && (
                                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {validation.email.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Ethiopian Phone Number <span className="text-red-500">*</span>
                                                </label>
                                                <div className={`relative transition-all duration-200 ${focusedField === 'phone' ? 'transform scale-[1.02]' : ''}`}>
                                                    <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${validation.phone.touched && !validation.phone.isValid ? 'text-red-400' :
                                                            validation.phone.touched && validation.phone.isValid ? 'text-green-500' : 'text-gray-400'
                                                        }`} />
                                                    <input
                                                        type="tel"
                                                        value={customerInfo.phone}
                                                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                                                        onFocus={() => setFocusedField('phone')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className={`
                              w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepTeal transition-all
                              ${validation.phone.touched && !validation.phone.isValid
                                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                                : validation.phone.touched && validation.phone.isValid
                                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                                    : 'border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700'
                                                            }
                            `}
                                                        placeholder="09XXXXXXXX or 07XXXXXXXX"
                                                    />
                                                    {validation.phone.touched && validation.phone.isValid && (
                                                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                                                    )}
                                                </div>
                                                {validation.phone.touched && !validation.phone.isValid && (
                                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {validation.phone.message}
                                                    </p>
                                                )}
                                                {validation.phone.touched && validation.phone.isValid && (
                                                    <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                                                        <CheckCircle className="h-3 w-3" />
                                                        ✓ Valid Ethiopian phone number
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Payment Method */}
                                {step === 4 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Select Payment Method
                                        </h3>

                                        <div className="mb-4 p-4 bg-gradient-to-r from-deepTeal/10 to-deepBlue/5 rounded-lg border border-deepTeal/20">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Total Amount to Pay:</span>
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-deepTeal">
                                                        {formatEthiopianBirr(calculateTotal())}
                                                    </span>
                                                    {selectedSeats.length > 1 && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            for {selectedSeats.length} tickets
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            {PAYMENT_METHODS.map(method => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => {
                                                        setPaymentMethod(method.id);
                                                        setSelectedBank('');
                                                        setSelectedMobileMoney('');
                                                    }}
                                                    className={`
                            w-full p-4 rounded-lg border-2 transition-all text-left hover:shadow-lg
                            ${paymentMethod === method.id
                                                            ? `border-deepTeal bg-gradient-to-r ${method.color} bg-opacity-10 shadow-lg ring-2 ring-deepTeal/20`
                                                            : 'border-gray-200 dark:border-dark-700 hover:border-deepTeal/50 hover:bg-gray-50 dark:hover:bg-dark-700'
                                                        }
                          `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${paymentMethod === method.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-dark-600'}`}>
                                                            {React.createElement(method.icon, { className: `h-6 w-6 ${paymentMethod === method.id ? 'text-deepTeal' : 'text-gray-500'}` })}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900 dark:text-white">{method.name}</p>
                                                            <p className="text-sm text-gray-500">{method.description}</p>
                                                        </div>
                                                        {paymentMethod === method.id && (
                                                            <CheckCircle className="h-5 w-5 text-deepTeal" />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Mobile Money Options */}
                                        {paymentMethod === 'mobile-money' && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                    Select Mobile Money Service
                                                </label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {MOBILE_MONEY_SERVICES.map(service => (
                                                        <button
                                                            key={service.id}
                                                            onClick={() => setSelectedMobileMoney(service.id)}
                                                            className={`
                                p-4 rounded-xl border-2 text-center transition-all hover:scale-105
                                ${selectedMobileMoney === service.id
                                                                    ? `${service.bgLight} border-${service.textColor} shadow-lg`
                                                                    : 'border-gray-200 dark:border-dark-700 hover:border-gray-300'
                                                                }
                              `}
                                                        >
                                                            {React.createElement(service.icon, {
                                                                className: `h-10 w-10 mx-auto mb-2 ${selectedMobileMoney === service.id ? service.textColor : 'text-gray-500'}`
                                                            })}
                                                            <p className={`text-sm font-semibold ${selectedMobileMoney === service.id ? service.textColor : 'text-gray-700 dark:text-gray-300'}`}>
                                                                {service.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">{service.code}</p>
                                                        </button>
                                                    ))}
                                                </div>
                                                {selectedMobileMoney && (
                                                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                                                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                                            📱 Payment Instructions:
                                                        </p>
                                                        <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                                                            <li>Dial {MOBILE_MONEY_SERVICES.find(s => s.id === selectedMobileMoney)?.code}</li>
                                                            <li>Enter amount: <strong className="text-deepTeal">{formatEthiopianBirr(calculateTotal())}</strong></li>
                                                            <li>Enter merchant code: <strong className="text-deepTeal">123456</strong></li>
                                                            <li>Enter reference: <strong className="text-deepTeal">{show.title.replace(/\s/g, '')}_{Date.now()}</strong></li>
                                                            <li>Confirm payment with your PIN</li>
                                                        </ol>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Bank Transfer Options */}
                                        {paymentMethod === 'bank-transfer' && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                    Select Your Bank
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {ETHIOPIAN_BANKS.map(bank => (
                                                        <button
                                                            key={bank.id}
                                                            onClick={() => setSelectedBank(bank.id)}
                                                            className={`
                                p-3 rounded-xl border-2 text-left transition-all hover:scale-105
                                ${selectedBank === bank.id
                                                                    ? `${bank.color} shadow-lg`
                                                                    : 'border-gray-200 dark:border-dark-700 hover:border-gray-300'
                                                                }
                              `}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {React.createElement(bank.icon, { className: "h-5 w-5" })}
                                                                <span className="text-sm font-medium">{bank.name}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                                {selectedBank && (
                                                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                                                        <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                                                            💰 Bank Transfer Details:
                                                        </p>
                                                        <div className="text-sm space-y-2">
                                                            <p><strong>Bank:</strong> Commercial Bank of Ethiopia</p>
                                                            <p><strong>Account Name:</strong> Theatre Hub Ethiopia</p>
                                                            <p><strong>Account Number:</strong> <span className="font-mono">1000134567890</span></p>
                                                            <p><strong>Amount:</strong> <span className="font-bold text-deepTeal">{formatEthiopianBirr(calculateTotal())}</span></p>
                                                            <p><strong>Reference:</strong> <span className="font-mono text-xs">{show.title.replace(/\s/g, '')}_{Date.now()}</span></p>
                                                        </div>
                                                        <p className="mt-3 text-xs text-yellow-600 bg-yellow-100 p-2 rounded">
                                                            ⚡ After transfer, your booking will be confirmed automatically within 10 minutes.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Card Payment */}
                                        {paymentMethod === 'card' && (
                                            <div className="mt-4 space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Card Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="XXXX XXXX XXXX XXXX"
                                                        className="w-full p-3 border-2 border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-deepTeal focus:border-deepTeal dark:bg-dark-700 dark:text-white transition-all"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Expiry Date
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="MM/YY"
                                                            className="w-full p-3 border-2 border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-deepTeal focus:border-deepTeal dark:bg-dark-700 dark:text-white transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            CVV
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="123"
                                                                className="w-full p-3 border-2 border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-deepTeal focus:border-deepTeal dark:bg-dark-700 dark:text-white transition-all pr-10"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                            >
                                                                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 5: Confirmation */}
                                {step === 5 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Confirm Your Booking
                                        </h3>

                                        <div className="space-y-4 max-w-3xl mx-auto">
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-600 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-900 dark:text-black mb-3 flex items-center gap-2">
                                                    <Ticket className="h-5 w-5 text-deepTeal" />
                                                    Booking Summary
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between py-1">
                                                        <span className="text-gray-600 dark:text-black">Show:</span>
                                                        <span className="font-medium text-gray-900 dark:text-black">{show.title}</span>
                                                    </div>
                                                    <div className="flex justify-between py-1">
                                                        <span className="text-gray-600 dark:text-black">Date & Time:</span>
                                                        <span className="text-gray-900 dark:text-black">
                                                            {selectedDate && new Date(selectedDate.date).toLocaleDateString()} at {selectedDate?.time || '7:30 PM'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between py-1">
                                                        <span className="text-gray-600 dark:text-black">Number of Tickets:</span>
                                                        <span className="font-semibold text-deepTeal">{selectedSeats.length} tickets</span>
                                                    </div>
                                                    <div className="flex justify-between py-1">
                                                        <span className="text-gray-600 dark:text-black">Seats:</span>
                                                        <span className="font-mono text-sm">{selectedSeats.join(', ')}</span>
                                                    </div>
                                                    <div className="flex justify-between py-1">
                                                        <span className="text-gray-600 dark:text-black">Venue:</span>
                                                        <span className="text-gray-900 dark:text-black">{show.venue}</span>
                                                    </div>
                                                    <div className="border-t border-gray-200 dark:border-dark-600 pt-2 mt-2">
                                                        <div className="flex justify-between py-1">
                                                            <span>Subtotal:</span>
                                                            <span>{formatEthiopianBirr(calculateSubtotal())}</span>
                                                        </div>
                                                        {discount > 0 && (
                                                            <div className="flex justify-between py-1 text-green-600">
                                                                <span>Discount ({discount}%):</span>
                                                                <span>-{formatEthiopianBirr(calculateDiscount())}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between items-center pt-2">
                                                            <span className="font-bold text-gray-900 dark:text-black">Total Amount:</span>
                                                            <span className="text-2xl font-bold text-deepTeal">{formatEthiopianBirr(calculateTotal())}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-600 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-900 dark:text-black mb-3 flex items-center gap-2">
                                                    <User className="h-5 w-5 text-deepTeal" />
                                                    Customer Information
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-100 dark:text-black">Name:</span>
                                                        <span className="text-gray-900 dark:text-black">{customerInfo.name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-black">Email:</span>
                                                        <span className="text-gray-900 dark:text-black">{customerInfo.email}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-black">Phone:</span>
                                                        <span className="text-gray-900 dark:text-black">{customerInfo.phone}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                                    You will receive {selectedSeats.length} separate ticket(s) with unique QR codes for each seat.
                                                    Each ticket can be scanned individually at the venue entrance.
                                                </p>
                                            </div>

                                            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                                <Shield className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                                    By confirming this booking, you agree to our terms and conditions. Tickets are non-refundable
                                                    but can be exchanged up to 24 hours before the show.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 flex justify-between">
                                {step > 1 && (
                                    <button
                                        onClick={handleBack}
                                        className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-lg transition-all flex items-center gap-2 font-medium"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Back
                                    </button>
                                )}

                                {step < 5 ? (
                                    <button
                                        onClick={handleNext}
                                        className="ml-auto px-6 py-2.5 bg-gradient-to-r from-deepTeal to-deepBlue text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isProcessing}
                                        className="ml-auto px-6 py-2.5 bg-gradient-to-r from-deepTeal to-deepBlue text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4" />
                                                Confirm & Pay {formatEthiopianBirr(calculateTotal())}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>

            {/* Ticket Modal with Ethiopian-themed tickets - Updated with your color scheme */}
            {showTicketModal && bookingData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={closeTicketModal} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <QrCode className="h-6 w-6 text-deepTeal" />
                                    Your Tickets - Ethiopian Music Night
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {bookingData.totalSeats} ticket(s) for {bookingData.show}
                                </p>
                            </div>
                            <button
                                onClick={closeTicketModal}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-success">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-success" />
                                    <p className="text-green-700 dark:text-green-400 font-medium">
                                        ✅ Payment Successful! Your Ethiopian-themed tickets have been generated.
                                    </p>
                                </div>
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                    Booking ID: {bookingData.bookingId} | Total Paid: {bookingData.totalAmountBirr}
                                </p>
                            </div>

                            {/* Ethiopian-themed Tickets - Each with unique QR code and share/copy buttons */}
                            <div className="space-y-6">
                                {bookingData.tickets.map((ticket, index) => (
                                    <div
                                        key={ticket.ticketId}
                                        id={`ticket-${index}`}
                                        className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden border-2 border-deepTeal/30 hover:shadow-2xl transition-all duration-300"
                                    >
                                        {/* Ethiopian Traditional Header with your color scheme */}
                                        <div className="relative bg-gradient-to-r from-deepTeal to-deepBlue text-white">
                                            <div className="absolute inset-0 opacity-10">
                                                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                                    <pattern id={`pattern-${index}`} patternUnits="userSpaceOnUse" width="30" height="30">
                                                        <path d="M15,5 L15,25 M5,15 L25,15" stroke="white" strokeWidth="1" />
                                                        <circle cx="15" cy="15" r="4" fill="none" stroke="white" strokeWidth="1" />
                                                    </pattern>
                                                    <rect width="100%" height="100%" fill={`url(#pattern-${index})`} />
                                                </svg>
                                            </div>
                                            <div className="relative px-5 py-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Music className="h-4 w-4" />
                                                            <h3 className="text-lg font-bold">Theatre Hub Ethiopia</h3>
                                                        </div>
                                                        <p className="text-xs opacity-90">Traditional Ethiopian Music Night</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs opacity-80">Ticket {index + 1} of {bookingData.totalSeats}</p>
                                                        <p className="text-[10px] font-mono opacity-75">{ticket.ticketId}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ticket Content */}
                                        <div className="p-5">
                                            {/* Show Title */}
                                            <div className="text-center mb-4 pb-3 border-b-2 border-dashed border-deepTeal/30 dark:border-deepTeal/30">
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                                                    <span>🎵</span>
                                                    {ticket.show}
                                                    <span>🎶</span>
                                                </h2>
                                                <p className="text-xs text-deepTeal dark:text-deepTeal mt-1">መዝናኛ ምሽት | Entertainment Night</p>
                                            </div>

                                            {/* Unique QR Code for this specific seat */}
                                            <div className="flex justify-center mb-5">
                                                <div className="relative">
                                                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-deepTeal/20 dark:bg-deepTeal/30 rounded-full"></div>
                                                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-deepTeal/20 dark:bg-deepTeal/30 rounded-full"></div>
                                                    <div className="bg-white p-3 rounded-xl shadow-lg border-2 border-deepTeal/50 dark:border-deepTeal/50">
                                                        <QRCodeSVG
                                                            value={ticket.qrData}
                                                            size={130}
                                                            level="H"
                                                            includeMargin={true}
                                                            className="rounded-lg"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* QR Code Actions - Share and Copy */}
                                            <div className="flex justify-center gap-3 mb-4">
                                                <button
                                                    onClick={() => shareQRCode(ticket, index)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-deepTeal to-deepBlue text-white rounded-lg hover:shadow-lg transition-all text-sm"
                                                >
                                                    {sharedStates[index] ? (
                                                        <Check className="h-4 w-4" />
                                                    ) : (
                                                        <Share2 className="h-4 w-4" />
                                                    )}
                                                    {sharedStates[index] ? 'Shared!' : 'Share QR'}
                                                </button>
                                                <button
                                                    onClick={() => copyQRCodeData(ticket, index)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:shadow-lg transition-all text-sm"
                                                >
                                                    {copiedStates[index] ? (
                                                        <Check className="h-4 w-4" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                    {copiedStates[index] ? 'Copied!' : 'Copy QR Data'}
                                                </button>
                                            </div>

                                            {/* Seat-specific QR code note */}
                                            <div className="text-center mb-3">
                                                <p className="text-xs font-medium text-deepTeal dark:text-deepTeal flex items-center justify-center gap-1">
                                                    <QrCode className="h-3 w-3" />
                                                    Unique QR code for Seat {ticket.seat}
                                                </p>
                                            </div>

                                            {/* Ticket Details */}
                                            <div className="grid grid-cols-2 gap-3 mb-5">
                                                <div className="bg-deepTeal/5 dark:bg-deepTeal/10 p-3 rounded-xl border-l-2 border-deepTeal">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User className="h-4 w-4 text-deepTeal" />
                                                        <span className="text-xs font-medium text-gray-500">Ticket Holder</span>
                                                    </div>
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{ticket.customerName}</p>
                                                </div>

                                                <div className="bg-deepTeal/5 dark:bg-deepTeal/10 p-3 rounded-xl border-l-2 border-deepTeal">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Ticket className="h-4 w-4 text-deepTeal" />
                                                        <span className="text-xs font-medium text-gray-500">Seat</span>
                                                    </div>
                                                    <p className="font-bold text-2xl text-deepTeal">{ticket.seat}</p>
                                                    <p className="text-xs text-gray-500">Row {ticket.row}, Seat {ticket.number}</p>
                                                </div>

                                                <div className="bg-deepTeal/5 dark:bg-deepTeal/10 p-3 rounded-xl border-l-2 border-deepTeal">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Star className="h-4 w-4 text-deepTeal" />
                                                        <span className="text-xs font-medium text-gray-500">Seat Type</span>
                                                    </div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{ticket.section || 'REGULAR'}</p>
                                                </div>

                                                <div className="bg-deepTeal/5 dark:bg-deepTeal/10 p-3 rounded-xl border-l-2 border-deepTeal">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-lg">💰</span>
                                                        <span className="text-xs font-medium text-gray-500">Price</span>
                                                    </div>
                                                    <p className="font-bold text-lg text-deepTeal">{formatEthiopianBirr(ticket.price)}</p>
                                                </div>
                                            </div>

                                            {/* Date, Time and Venue */}
                                            <div className="space-y-2 mb-5 pt-3 border-t border-deepTeal/20 dark:border-deepTeal/20">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="h-4 w-4 text-deepTeal" />
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-500">Date</p>
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{ticket.date}</p>
                                                    </div>
                                                    <Clock className="h-4 w-4 text-deepTeal" />
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-500">Time</p>
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{ticket.time}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <MapPin className="h-4 w-4 text-deepTeal" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Venue</p>
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{ticket.venue}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ethiopian Coffee Ceremony Message */}
                                            <div className="bg-gradient-to-r from-deepTeal/10 to-deepBlue/10 dark:from-deepTeal/20 dark:to-deepBlue/20 rounded-xl p-3 text-center mb-4">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <Coffee className="h-3 w-3 text-deepTeal" />
                                                    <p className="text-xs font-medium text-deepTeal dark:text-deepTeal">
                                                        ቡና ይጠጡ | Enjoy Ethiopian Coffee
                                                    </p>
                                                </div>
                                                <p className="text-[10px] text-deepTeal/80 dark:text-deepTeal/80">
                                                    እንኳን ደህና መጡ! | Welcome! | Please present this unique QR code at the entrance
                                                </p>
                                            </div>

                                            {/* Footer */}
                                            <div className="text-center pt-2 border-t border-deepTeal/20 dark:border-deepTeal/20">
                                                <p className="text-[10px] text-gray-400">
                                                    This ticket is valid for one-time entry only • Scan unique QR code for Seat {ticket.seat}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="bg-deepTeal/5 dark:bg-deepTeal/10 px-5 py-3 flex justify-between items-center flex-wrap gap-2">
                                            <p className="text-xs text-deepTeal dark:text-deepTeal flex items-center gap-1">
                                                <QrCode className="h-3 w-3" />
                                                Unique QR for Seat {ticket.seat}
                                            </p>
                                            <div className="flex gap-2 flex-wrap">
                                                <button
                                                    onClick={() => downloadTicket(ticket, index)}
                                                    className="px-3 py-1.5 text-sm bg-gradient-to-r from-deepTeal to-deepBlue text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                    Download
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const printWindow = window.open('', '_blank');
                                                        const ticketElement = document.getElementById(`ticket-${index}`);
                                                        printWindow.document.write(`
                              <html>
                                <head>
                                  <title>Ticket ${ticket.seat} - ${ticket.ticketId}</title>
                                  <style>
                                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background: #f5f5f5; }
                                    @media print { body { background: white; padding: 0; } }
                                  </style>
                                </head>
                                <body>
                                  ${ticketElement.outerHTML}
                                </body>
                              </html>
                            `);
                                                        printWindow.document.close();
                                                        printWindow.print();
                                                    }}
                                                    className="px-3 py-1.5 text-sm border border-deepTeal/50 text-deepTeal rounded-lg hover:bg-deepTeal/10 transition-all flex items-center gap-2"
                                                >
                                                    <Printer className="h-3.5 w-3.5" />
                                                    Print
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex gap-3 sticky bottom-0 bg-white dark:bg-dark-800 pt-4 border-t border-gray-200 dark:border-dark-700">
                                <button
                                    onClick={printAllTickets}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-deepTeal to-deepBlue text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
                                >
                                    <Printer className="h-4 w-4" />
                                    Print All Tickets ({bookingData.totalSeats})
                                </button>
                                <button
                                    onClick={closeTicketModal}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-all flex items-center justify-center gap-2 font-medium"
                                >
                                    <CheckCircle className="h-4 w-4" />
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

BookingModal.propTypes = {
    show: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        venue: PropTypes.string,
        images: PropTypes.shape({
            poster: PropTypes.string
        }),
        dates: PropTypes.arrayOf(
            PropTypes.shape({
                date: PropTypes.string,
                time: PropTypes.string,
                price: PropTypes.number,
                availableSeats: PropTypes.number
            })
        ),
        priceRange: PropTypes.shape({
            min: PropTypes.number,
            max: PropTypes.number
        })
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
};

export default BookingModal;