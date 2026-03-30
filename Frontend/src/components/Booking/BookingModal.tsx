// src/components/Booking/BookingModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    X, User, Mail, Phone, MapPin, Ticket,
    Crown, Star, Heart, Shield, ChevronRight, AlertCircle, Lock,
    CreditCard, CheckCircle, Sparkles, Gift, Armchair,
    Building2, Clock3, CalendarDays, UserCircle,
    ChevronLeft, PhoneCall, Mail as MailIcon, Plus, Minus,
    Info, DollarSign, Gem, Award, Coffee, Wine, Cake,
    Users, Wallet, Smartphone, Landmark
} from 'lucide-react';

// VIP Levels Configuration with seat categories
const VIP_LEVELS = {
    STANDARD: {
        id: 'standard',
        name: 'Standard',
        icon: '🎫',
        multiplier: 1,
        description: 'Comfortable seating with excellent view',
        benefits: ['Standard seating', 'Regular service', 'Digital ticket'],
        allowedSeatCategories: ['Standard'],
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-600'
    },
    VIP: {
        id: 'vip',
        name: 'VIP',
        icon: '⭐',
        multiplier: 1.5,
        description: 'Premium experience with exclusive perks',
        benefits: ['Premium seating', 'Priority entrance', 'Welcome drink', 'Program booklet'],
        allowedSeatCategories: ['Standard', 'Premium'],
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        borderColor: 'border-purple-200 dark:border-purple-800',
        textColor: 'text-purple-600'
    },
    PLATINUM: {
        id: 'platinum',
        name: 'Platinum',
        icon: '👑',
        multiplier: 2.5,
        description: 'Ultimate luxury theater experience',
        benefits: ['Best seats', 'Platinum Lounge', 'Drinks package', 'Meet & Greet', 'Signed memorabilia'],
        allowedSeatCategories: ['Standard', 'Premium', 'VIP'],
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-800',
        textColor: 'text-amber-600'
    },
    ROYAL: {
        id: 'royal',
        name: 'Royal Suite',
        icon: '💎',
        multiplier: 4,
        description: 'The epitome of luxury and exclusivity',
        benefits: ['Private box', 'Personal butler', 'Champagne', 'Backstage tour', 'Luxury gifts'],
        allowedSeatCategories: ['Standard', 'Premium', 'VIP'],
        color: 'from-rose-500 to-red-500',
        bgColor: 'bg-rose-50 dark:bg-rose-900/20',
        borderColor: 'border-rose-200 dark:border-rose-800',
        textColor: 'text-rose-600'
    }
};

// Validation Schema
const bookingSchema = yup.object({
    name: yup.string()
        .required('Full name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be at most 50 characters'),
    email: yup.string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    phone: yup.string()
        .required('Phone number is required')
        .matches(/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number'),
    specialRequests: yup.string().max(500)
});

// Professional Seat Selection Component with VIP-based filtering
const SeatSelection = ({ selectedSeats, onSeatSelect, maxSelectable, selectedVIPLevel, bookedSeats = [] }) => {
    const [selectedSeatsLocal, setSelectedSeatsLocal] = useState(selectedSeats);
    const [hoveredSeat, setHoveredSeat] = useState(null);

    // Generate seat layout (10 rows, 14 columns)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const cols = 14;

    const getSeatPrice = (row, col) => {
        const rowIndex = rows.indexOf(row);
        // VIP seats (rows A-B, center columns 6-9)
        if ((rowIndex === 0 || rowIndex === 1) && (col >= 6 && col <= 9)) return 120;
        // Premium seats (rows C-F, center columns 5-10)
        if ((rowIndex >= 2 && rowIndex <= 5) && (col >= 5 && col <= 10)) return 85;
        // Standard seats
        return 45;
    };

    const getSeatCategory = (row, col) => {
        const rowIndex = rows.indexOf(row);
        if ((rowIndex === 0 || rowIndex === 1) && (col >= 6 && col <= 9)) return 'VIP';
        if ((rowIndex >= 2 && rowIndex <= 5) && (col >= 5 && col <= 10)) return 'Premium';
        return 'Standard';
    };

    const isSeatAllowedForVIP = (seatCategory) => {
        return selectedVIPLevel.allowedSeatCategories.includes(seatCategory);
    };

    const getSeatDescription = (row, col) => {
        const category = getSeatCategory(row, col);
        const price = getSeatPrice(row, col);
        const finalPrice = price * selectedVIPLevel.multiplier;

        switch (category) {
            case 'VIP':
                return `VIP Seat - Best view in house, extra legroom, priority service`;
            case 'Premium':
                return `Premium Seat - Excellent center view, comfortable seating`;
            default:
                return `Standard Seat - Good view, comfortable seating`;
        }
    };

    const isSeatBooked = (seatId) => {
        return bookedSeats.includes(seatId);
    };

    const isSeatSelected = (seatId) => {
        return selectedSeatsLocal.includes(seatId);
    };

    const toggleSeat = (seatId) => {
        if (isSeatBooked(seatId)) return;

        const row = seatId.charAt(0);
        const col = parseInt(seatId.substring(1));
        const seatCategory = getSeatCategory(row, col);

        // Check if seat category is allowed for selected VIP level
        if (!isSeatAllowedForVIP(seatCategory)) {
            alert(`${selectedVIPLevel.name} members can only select ${selectedVIPLevel.allowedSeatCategories.join(', ')} seats. ${seatCategory} seats are not available for this package.`);
            return;
        }

        if (isSeatSelected(seatId)) {
            const newSeats = selectedSeatsLocal.filter(s => s !== seatId);
            setSelectedSeatsLocal(newSeats);
            onSeatSelect(newSeats);
        } else {
            if (selectedSeatsLocal.length < maxSelectable) {
                const newSeats = [...selectedSeatsLocal, seatId];
                setSelectedSeatsLocal(newSeats);
                onSeatSelect(newSeats);
            } else {
                alert(`You can only select up to ${maxSelectable} seats`);
            }
        }
    };

    const getSeatColor = (row, col) => {
        const seatId = `${row}${col}`;
        const category = getSeatCategory(row, col);
        const isAllowed = isSeatAllowedForVIP(category);

        if (isSeatBooked(seatId)) return 'bg-red-400 cursor-not-allowed opacity-60 dark:bg-red-500/50';
        if (isSeatSelected(seatId)) return 'bg-teal-500 text-white shadow-lg ring-2 ring-teal-300 dark:bg-teal-600';

        if (!isAllowed) return 'bg-gray-200 cursor-not-allowed opacity-50 dark:bg-gray-700';

        switch (category) {
            case 'VIP':
                return 'bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 dark:from-amber-500 dark:to-amber-600';
            case 'Premium':
                return 'bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 dark:from-purple-500 dark:to-purple-600';
            default:
                return 'bg-gradient-to-br from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 dark:from-gray-600 dark:to-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* VIP Level Info Banner */}
            <div className={`p-4 rounded-xl ${selectedVIPLevel.bgColor} border ${selectedVIPLevel.borderColor}`}>
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedVIPLevel.icon}</span>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {selectedVIPLevel.name} Package Benefits
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Available seats: {selectedVIPLevel.allowedSeatCategories.join(', ')} seats
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedVIPLevel.benefits.slice(0, 3).map((benefit, idx) => (
                        <span key={idx} className="text-xs bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full">
                            {benefit}
                        </span>
                    ))}
                </div>
            </div>

            {/* Screen Display */}
            <div className="relative">
                <div className="w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-t-3xl h-14 flex items-center justify-center">
                    <span className="text-white/80 text-sm tracking-wider font-medium">🎭 STAGE & SCREEN</span>
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></div>
            </div>

            {/* Seat Layout */}
            <div className="overflow-x-auto pb-4">
                <div className="min-w-[900px]">
                    {rows.map((row) => (
                        <div key={row} className="flex mb-2 items-center group">
                            <div className="w-12 text-sm font-bold text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-gray-800 z-10">
                                {row}
                            </div>
                            <div className="flex gap-1.5 flex-1 justify-center">
                                {Array.from({ length: cols }, (_, colIndex) => {
                                    const col = colIndex + 1;
                                    const seatId = `${row}${col}`;
                                    const category = getSeatCategory(row, col);
                                    const price = getSeatPrice(row, col);
                                    const finalPrice = price * selectedVIPLevel.multiplier;
                                    const isAllowed = isSeatAllowedForVIP(category);

                                    let seatClass = '';
                                    if (category === 'VIP') seatClass = 'ring-2 ring-amber-400';
                                    if (category === 'Premium') seatClass = 'ring-2 ring-purple-400';

                                    return (
                                        <button
                                            key={col}
                                            onClick={() => toggleSeat(seatId)}
                                            disabled={isSeatBooked(seatId) || !isAllowed}
                                            onMouseEnter={() => setHoveredSeat({
                                                row, col, price: finalPrice, seatId, category,
                                                description: getSeatDescription(row, col),
                                                originalPrice: price,
                                                isAllowed
                                            })}
                                            onMouseLeave={() => setHoveredSeat(null)}
                                            className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg transition-all duration-200 flex items-center justify-center text-xs font-semibold ${getSeatColor(row, col)} ${seatClass} shadow-sm hover:shadow-lg ${!isAllowed ? 'cursor-not-allowed' : ''}`}
                                            title={!isAllowed ? `Not available for ${selectedVIPLevel.name} package` : `${seatId} - ${category} - ${finalPrice} ETB`}
                                        >
                                            {col}
                                            {isSeatSelected(seatId) && (
                                                <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500 bg-white rounded-full dark:bg-gray-800" />
                                            )}
                                            {!isAllowed && !isSeatSelected(seatId) && !isSeatBooked(seatId) && (
                                                <div className="absolute inset-0 bg-gray-500/30 rounded-t-lg flex items-center justify-center">
                                                    <Lock className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-gray-300 to-gray-400 rounded-t-md"></div>
                    <span className="text-xs font-medium">Standard</span>
                    <span className="text-xs text-gray-500">45 ETB</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-purple-500 rounded-t-md"></div>
                    <span className="text-xs font-medium">Premium</span>
                    <span className="text-xs text-gray-500">85 ETB</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-500 rounded-t-md"></div>
                    <span className="text-xs font-medium">VIP</span>
                    <span className="text-xs text-gray-500">120 ETB</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-teal-500 rounded-t-md"></div>
                    <span className="text-xs font-medium">Selected</span>
                </div>
            </div>

            {/* Hover Info Card */}
            {hoveredSeat && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border-2 shadow-lg ${hoveredSeat.isAllowed
                            ? 'bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/20 border-teal-200 dark:border-teal-800'
                            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                        }`}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${hoveredSeat.category === 'VIP' ? 'bg-amber-100 dark:bg-amber-900/30' :
                                    hoveredSeat.category === 'Premium' ? 'bg-purple-100 dark:bg-purple-900/30' :
                                        'bg-blue-100 dark:bg-blue-900/30'
                                }`}>
                                <Armchair className={`w-6 h-6 ${hoveredSeat.category === 'VIP' ? 'text-amber-600' :
                                        hoveredSeat.category === 'Premium' ? 'text-purple-600' :
                                            'text-teal-600'
                                    }`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{hoveredSeat.seatId}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${hoveredSeat.category === 'VIP' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                                            hoveredSeat.category === 'Premium' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' :
                                                'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                        }`}>
                                        {hoveredSeat.category}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md">
                                    {hoveredSeat.description}
                                </p>
                                {!hoveredSeat.isAllowed && (
                                    <p className="text-xs text-red-500 mt-1">
                                        ⚠️ Not available for {selectedVIPLevel.name} package. Upgrade to {hoveredSeat.category === 'Premium' ? 'Platinum or Royal' : 'Platinum, VIP, or Royal'} to select this seat.
                                    </p>
                                )}
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-xs text-gray-500">Base Price: {hoveredSeat.originalPrice} ETB</span>
                                    <span className="text-xs text-gray-500">× {selectedVIPLevel.multiplier}x VIP Multiplier</span>
                                </div>
                            </div>
                        </div>
                        {hoveredSeat.isAllowed && (
                            <div className="text-right">
                                <div className="text-2xl font-bold text-teal-600">{hoveredSeat.price} ETB</div>
                                <div className="text-xs text-gray-500">per seat after VIP</div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// Chapa Payment Component with all payment methods
const ChapaPayment = ({ amount, email, name, onSuccess, onError, onClose, selectedSeats, vipLevel, tickets }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('chapa');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const paymentMethods = [
        {
            id: 'chapa',
            name: 'Chapa',
            icon: CreditCard,
            description: 'Card / Bank Transfer',
            color: 'from-teal-500 to-teal-600',
            bgColor: 'bg-teal-50 dark:bg-teal-900/20'
        },
        {
            id: 'telebirr',
            name: 'TeleBirr',
            icon: Smartphone,
            description: 'Mobile Money',
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            id: 'cbebirr',
            name: 'CBE Birr',
            icon: Landmark,
            description: 'CBE Mobile Banking',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            id: 'hellocash',
            name: 'HelloCash',
            icon: Wallet,
            description: 'HelloCash Mobile',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20'
        }
    ];

    const initializePayment = async () => {
        setIsProcessing(true);

        const paymentData = {
            amount: amount,
            currency: 'ETB',
            email: email,
            first_name: name.split(' ')[0] || name,
            last_name: name.split(' ')[1] || '',
            phone: '',
            tx_ref: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            callback_url: window.location.origin + '/payment-callback',
            return_url: window.location.origin + '/payment-success',
            customization: {
                title: 'Theater Ticket Booking',
                description: `${tickets} ticket(s) | Seats: ${selectedSeats.join(', ')} | ${vipLevel.name}`,
                logo: '/logo.png'
            },
            payment_method: selectedMethod
        };

        await new Promise(resolve => setTimeout(resolve, 2000));

        onSuccess({
            tx_ref: paymentData.tx_ref,
            amount: amount,
            status: 'success',
            method: selectedMethod,
            payment_id: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        });

        setIsProcessing(false);
    };

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;
                    return (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${isSelected
                                    ? `border-teal-600 ${method.bgColor} shadow-md`
                                    : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Icon className={`w-8 h-8 ${isSelected ? 'text-teal-600' : 'text-gray-500'}`} />
                                <span className={`font-semibold ${isSelected ? 'text-teal-600' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {method.name}
                                </span>
                                <p className="text-xs text-gray-500">{method.description}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="p-5 bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-900/20 rounded-xl">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Seats Selected</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{selectedSeats.join(', ')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">VIP Level</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{vipLevel.icon} {vipLevel.name} (x{vipLevel.multiplier})</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Number of Tickets</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{tickets} tickets</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-teal-200 dark:border-teal-800">
                        <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                        <span className="text-2xl font-bold text-teal-600">{formatPrice(amount)}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">Includes VAT and service charge</p>
                </div>
            </div>

            <button
                onClick={initializePayment}
                disabled={isProcessing}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg text-base"
            >
                {isProcessing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <Lock className="w-5 h-5" />
                        Pay {formatPrice(amount)} via {paymentMethods.find(m => m.id === selectedMethod)?.name}
                    </>
                )}
            </button>

            <p className="text-xs text-center text-gray-500">
                🔒 Secure payment powered by Chapa. Your payment information is encrypted and secure.
            </p>
        </div>
    );
};

// Helper function for formatting price
const formatPriceETB = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

const BookingModal = ({ show, isOpen, onClose, onConfirm }) => {
    const [step, setStep] = useState(1);
    const [selectedVIPLevel, setSelectedVIPLevel] = useState(VIP_LEVELS.STANDARD);
    const [tickets, setTickets] = useState(1);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [completedBooking, setCompletedBooking] = useState(null);
    const [showPayment, setShowPayment] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm({
        resolver: yupResolver(bookingSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            specialRequests: ''
        }
    });

    const formData = watch();

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep(1);
                setSelectedVIPLevel(VIP_LEVELS.STANDARD);
                setTickets(1);
                setSelectedSeats([]);
                setBookingComplete(false);
                setCompletedBooking(null);
                setShowPayment(false);
                reset();
            }, 300);
        }
    }, [isOpen, reset]);

    // Reset selected seats when VIP level changes
    useEffect(() => {
        // Filter out seats that are not allowed for the new VIP level
        const getSeatCategory = (seat) => {
            const row = seat.charAt(0);
            const col = parseInt(seat.substring(1));
            const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
            const rowIndex = rows.indexOf(row);

            if ((rowIndex === 0 || rowIndex === 1) && (col >= 6 && col <= 9)) return 'VIP';
            if ((rowIndex >= 2 && rowIndex <= 5) && (col >= 5 && col <= 10)) return 'Premium';
            return 'Standard';
        };

        const validSeats = selectedSeats.filter(seat => {
            const category = getSeatCategory(seat);
            return selectedVIPLevel.allowedSeatCategories.includes(category);
        });

        if (validSeats.length !== selectedSeats.length) {
            setSelectedSeats(validSeats);
            alert(`Some seats were removed because they are not available for ${selectedVIPLevel.name} package. ${selectedVIPLevel.name} members can only select ${selectedVIPLevel.allowedSeatCategories.join(', ')} seats.`);
        }
    }, [selectedVIPLevel, selectedSeats]);

    // Calculate total price based on selected seats
    const calculateTotalPrice = () => {
        let total = 0;
        selectedSeats.forEach(seat => {
            const row = seat.charAt(0);
            const col = parseInt(seat.substring(1));
            const rowIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].indexOf(row);

            if ((rowIndex === 0 || rowIndex === 1) && (col >= 6 && col <= 9)) {
                total += 120;
            } else if ((rowIndex >= 2 && rowIndex <= 5) && (col >= 5 && col <= 10)) {
                total += 85;
            } else {
                total += 45;
            }
        });
        return total * selectedVIPLevel.multiplier;
    };

    const totalPrice = calculateTotalPrice();

    const handleNext = () => {
        if (step === 1 && selectedSeats.length !== tickets) {
            alert(`Please select ${tickets} seat(s) for your booking. Selected: ${selectedSeats.length}`);
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handlePaymentSuccess = (paymentData) => {
        processBooking(paymentData);
    };

    const handlePaymentError = (error) => {
        alert(error);
        setIsProcessing(false);
    };

    const processBooking = async (paymentData) => {
        setIsProcessing(true);

        const bookingData = {
            showId: show?.id || 'show_001',
            title: show?.title || 'The Lion King',
            theater: show?.venue || 'Minskoff Theatre',
            date: new Date().toISOString().split('T')[0],
            time: '19:30',
            vipLevel: selectedVIPLevel,
            tickets,
            totalPrice,
            selectedSeats,
            customer: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                specialRequests: formData.specialRequests || ''
            },
            bookingId: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            bookingDate: new Date().toISOString(),
            payment: {
                ...paymentData,
                method: paymentData.method || 'chapa'
            }
        };

        setCompletedBooking(bookingData);
        setBookingComplete(true);

        setTimeout(() => {
            if (onConfirm) onConfirm(bookingData);
            setIsProcessing(false);
            onClose();
        }, 2000);
    };

    const onSubmitForm = (data) => {
        if (selectedSeats.length !== tickets) {
            alert(`Please select ${tickets} seat(s) for your booking. Selected: ${selectedSeats.length}`);
            return;
        }
        setShowPayment(true);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Payment Modal */}
                        {showPayment && !bookingComplete && (
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Payment</h3>
                                        <p className="text-sm text-gray-500">Choose your preferred payment method</p>
                                    </div>
                                    <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <ChapaPayment
                                    amount={totalPrice}
                                    email={formData.email}
                                    name={formData.name}
                                    selectedSeats={selectedSeats}
                                    vipLevel={selectedVIPLevel}
                                    tickets={tickets}
                                    onSuccess={handlePaymentSuccess}
                                    onError={handlePaymentError}
                                    onClose={() => setShowPayment(false)}
                                />
                            </div>
                        )}

                        {/* Success State */}
                        {bookingComplete && completedBooking ? (
                            <div className="p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                                >
                                    <CheckCircle className="w-12 h-12 text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Booking Confirmed! 🎉
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Your tickets have been reserved. A confirmation email has been sent to {completedBooking.customer.email}
                                </p>
                                <div className="bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-900/20 rounded-xl p-6 mb-6">
                                    <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                                    <p className="text-xl font-mono font-bold text-teal-600 mb-3">{completedBooking.bookingId}</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Show</p>
                                            <p className="font-medium">{completedBooking.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Seats</p>
                                            <p className="font-medium">{completedBooking.selectedSeats.join(', ')}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">VIP Level</p>
                                            <p className="font-medium">{completedBooking.vipLevel.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Total Paid</p>
                                            <p className="font-bold text-teal-600">{formatPriceETB(completedBooking.totalPrice)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Payment Method</p>
                                            <p className="font-medium capitalize">{completedBooking.payment.method}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Payment ID</p>
                                            <p className="font-mono text-xs">{completedBooking.payment.payment_id}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        ) : !showPayment && (
                            <>
                                {/* Header */}
                                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-5 flex justify-between items-center z-10">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Ticket className="w-6 h-6 text-teal-600" />
                                            Book Tickets
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Step {step} of 2
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Show Info */}
                                    <div className="mb-6 p-5 bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-800/10 rounded-xl border border-teal-200 dark:border-teal-800">
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                                                <Building2 className="w-8 h-8 text-teal-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                    {show?.title || 'The Lion King'}
                                                </h4>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4 text-teal-600" />
                                                        {show?.venue || 'Minskoff Theatre'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock3 className="w-4 h-4 text-teal-600" />
                                                        {show?.duration || 150} min
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <CalendarDays className="w-4 h-4 text-teal-600" />
                                                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 1: Select Seats with VIP Level */}
                                    {step === 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            {/* Number of Tickets Selector */}
                                            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <Users className="w-5 h-5 text-teal-600" />
                                                    Number of Tickets
                                                </h4>
                                                <div className="flex items-center justify-center gap-6">
                                                    <button
                                                        onClick={() => {
                                                            const newTickets = Math.max(1, tickets - 1);
                                                            setTickets(newTickets);
                                                            if (selectedSeats.length > newTickets) {
                                                                setSelectedSeats(selectedSeats.slice(0, newTickets));
                                                            }
                                                        }}
                                                        disabled={tickets <= 1}
                                                        className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        <Minus className="w-5 h-5" />
                                                    </button>
                                                    <div className="text-center">
                                                        <div className="text-5xl font-bold text-teal-600">{tickets}</div>
                                                        <div className="text-sm text-gray-500 mt-1">Tickets</div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const newTickets = Math.min(10, tickets + 1);
                                                            setTickets(newTickets);
                                                        }}
                                                        disabled={tickets >= 10}
                                                        className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <p className="text-center text-xs text-gray-500 mt-4">
                                                    Maximum 10 tickets per booking
                                                </p>
                                            </div>

                                            {/* VIP Level Selection */}
                                            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <Crown className="w-5 h-5 text-teal-600" />
                                                    Select Experience Level
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    {Object.values(VIP_LEVELS).map((level) => {
                                                        const isSelected = selectedVIPLevel.id === level.id;
                                                        return (
                                                            <button
                                                                key={level.id}
                                                                onClick={() => setSelectedVIPLevel(level)}
                                                                className={`p-4 rounded-xl border-2 transition-all text-center ${isSelected
                                                                        ? `border-teal-600 ${level.bgColor} shadow-md`
                                                                        : 'border-gray-200 dark:border-gray-700 hover:border-teal-400'
                                                                    }`}
                                                            >
                                                                <span className="text-3xl mb-2 block">{level.icon}</span>
                                                                <span className={`font-bold ${isSelected ? level.textColor : 'text-gray-900 dark:text-white'}`}>
                                                                    {level.name}
                                                                </span>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {level.multiplier}x multiplier
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-2">
                                                                    {level.description}
                                                                </p>
                                                                <div className="mt-2 flex flex-wrap gap-1 justify-center">
                                                                    {level.allowedSeatCategories.map((cat, idx) => (
                                                                        <span key={idx} className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                                                                            {cat}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Seat Selection */}
                                            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                        <Armchair className="w-5 h-5 text-teal-600" />
                                                        Select Your Seats
                                                    </h4>
                                                    <div className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                                                        <span className="text-sm font-medium text-teal-600">
                                                            {selectedSeats.length} / {tickets} seats selected
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                                    Select {tickets} seat(s) for your booking. Click on any seat to select. Hover over a seat to see details.
                                                    {selectedVIPLevel.id !== 'standard' && (
                                                        <span className="block mt-1 text-teal-600">
                                                            ✨ {selectedVIPLevel.name} members can select {selectedVIPLevel.allowedSeatCategories.join(', ')} seats
                                                        </span>
                                                    )}
                                                </p>
                                                <SeatSelection
                                                    selectedSeats={selectedSeats}
                                                    onSeatSelect={setSelectedSeats}
                                                    maxSelectable={tickets}
                                                    selectedVIPLevel={selectedVIPLevel}
                                                    bookedSeats={[]}
                                                />

                                                {/* Selected Seats Summary */}
                                                <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-900/20 rounded-xl">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">Selected Seats</p>
                                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {selectedVIPLevel.icon} {selectedVIPLevel.name} (x{selectedVIPLevel.multiplier} multiplier)
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                                                            <p className="text-2xl font-bold text-teal-600">{formatPriceETB(totalPrice)}</p>
                                                            <p className="text-xs text-gray-500 mt-1">Includes VAT & service</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Contact Information */}
                                    {step === 2 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6">
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <UserCircle className="w-5 h-5 text-teal-600" />
                                                    Contact Information
                                                </h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus-within:border-teal-600 transition-all">
                                                            <User className="w-5 h-5 text-gray-400" />
                                                            <input
                                                                {...register('name')}
                                                                type="text"
                                                                placeholder="Full Name"
                                                                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white"
                                                            />
                                                        </div>
                                                        {errors.name && (
                                                            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-3 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus-within:border-teal-600 transition-all">
                                                            <MailIcon className="w-5 h-5 text-gray-400" />
                                                            <input
                                                                {...register('email')}
                                                                type="email"
                                                                placeholder="Email Address"
                                                                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white"
                                                            />
                                                        </div>
                                                        {errors.email && (
                                                            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-3 p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus-within:border-teal-600 transition-all">
                                                            <Phone className="w-5 h-5 text-gray-400" />
                                                            <input
                                                                {...register('phone')}
                                                                type="tel"
                                                                placeholder="Phone Number"
                                                                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white"
                                                            />
                                                        </div>
                                                        {errors.phone && (
                                                            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                                                        )}
                                                    </div>

                                                    <div className="p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
                                                        <textarea
                                                            {...register('specialRequests')}
                                                            placeholder="Special Requests (Optional) - e.g., dietary restrictions, accessibility needs, etc."
                                                            className="w-full bg-transparent outline-none resize-none text-gray-900 dark:text-white"
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Order Summary */}
                                                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h5>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Show:</span>
                                                            <span className="font-medium">{show?.title || 'The Lion King'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">VIP Level:</span>
                                                            <span>{selectedVIPLevel.icon} {selectedVIPLevel.name} (x{selectedVIPLevel.multiplier})</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Tickets:</span>
                                                            <span>{tickets} tickets</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Seats:</span>
                                                            <span className="font-mono">{selectedSeats.join(', ')}</span>
                                                        </div>
                                                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                                                            <span className="font-bold">Total Amount:</span>
                                                            <span className="text-xl font-bold text-teal-600">{formatPriceETB(totalPrice)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Footer Navigation */}
                                <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between gap-3">
                                    {step > 1 && (
                                        <button
                                            onClick={handleBack}
                                            className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 font-medium"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Back
                                        </button>
                                    )}
                                    {step < 2 ? (
                                        <button
                                            onClick={handleNext}
                                            disabled={selectedSeats.length !== tickets}
                                            className={`flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${selectedSeats.length === tickets
                                                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:shadow-lg'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            Continue
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSubmit(onSubmitForm)}
                                            disabled={isProcessing}
                                            className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="w-4 h-4" />
                                                    Proceed to Payment
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BookingModal;