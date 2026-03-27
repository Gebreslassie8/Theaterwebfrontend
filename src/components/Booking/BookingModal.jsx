import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    X, User, Mail, Phone, Calendar, Clock, MapPin, Ticket,
    Crown, Star, Heart, Shield, ChevronRight, AlertCircle, Lock
} from 'lucide-react';
import theaterBookingService from '../../services/theaterBookingService';

// VIP Levels Configuration
const VIP_LEVELS = {
    STANDARD: {
        id: 'standard',
        name: 'Standard',
        icon: '🎫',
        multiplier: 1,
        benefits: ['Standard seating', 'Regular view', 'Basic service'],
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800'
    },
    VIP: {
        id: 'vip',
        name: 'VIP',
        icon: '⭐',
        multiplier: 1.5,
        benefits: ['Premium seating', 'Priority entrance', 'Welcome drink', 'Program booklet'],
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        borderColor: 'border-purple-200 dark:border-purple-800'
    },
    PLATINUM: {
        id: 'platinum',
        name: 'Platinum',
        icon: '👑',
        multiplier: 2.5,
        benefits: ['Best seats in house', 'VIP lounge access', 'Meet & greet', 'Complimentary drinks', 'Exclusive merchandise'],
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-800'
    },
    ROYAL: {
        id: 'royal',
        name: 'Royal Suite',
        icon: '💎',
        multiplier: 4,
        benefits: ['Private box', 'Personal butler', 'Champagne service', 'Backstage tour', 'Signed memorabilia', 'Luxury gift pack'],
        color: 'from-rose-500 to-red-500',
        bgColor: 'bg-rose-50 dark:bg-rose-900/20',
        borderColor: 'border-rose-200 dark:border-rose-800'
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
    specialRequests: yup.string()
        .max(500, 'Special requests cannot exceed 500 characters')
});

const BookingModal = ({ show, isOpen, onClose, onConfirm }) => {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedVIPLevel, setSelectedVIPLevel] = useState(VIP_LEVELS.STANDARD);
    const [tickets, setTickets] = useState(1);
    const [isLocking, setIsLocking] = useState(false);
    const [lockError, setLockError] = useState(null);
    const [availableSeats, setAvailableSeats] = useState(0);
    const [lockKey, setLockKey] = useState(null);
    const [userId, setUserId] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
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

    // Initialize or get persistent user ID
    useEffect(() => {
        let storedUserId = localStorage.getItem('theater_user_id');
        if (!storedUserId) {
            storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('theater_user_id', storedUserId);
        }
        setUserId(storedUserId);
    }, []);

    // Update available seats when date changes
    useEffect(() => {
        if (selectedDate && show) {
            const available = theaterBookingService.getAvailableSeats(
                show,
                show.id,
                selectedDate.date,
                selectedDate.time
            );
            setAvailableSeats(available);

            // Adjust tickets if needed
            if (tickets > available && available > 0) {
                setTickets(Math.max(1, available));
            } else if (available === 0) {
                setTickets(0);
            }
        }
    }, [selectedDate, show, tickets]);

    // Lock seats when date is selected and we're on step 2
    useEffect(() => {
        const lockSeats = async () => {
            if (step === 2 && selectedDate && !lockKey && !isLocking && userId && tickets > 0) {
                setIsLocking(true);

                const result = theaterBookingService.lockSeats(
                    show.id,
                    selectedDate.date,
                    selectedDate.time,
                    tickets,
                    userId
                );

                if (result.success) {
                    setLockKey(result.lockKey);
                    setLockError(null);
                } else {
                    setLockError(result.error);
                    // Go back to date selection if lock fails
                    setStep(1);
                    setSelectedDate(null);
                }
                setIsLocking(false);
            }
        };

        lockSeats();
    }, [step, selectedDate, tickets, show.id, lockKey, isLocking, userId]);

    // Release lock when modal closes or component unmounts
    useEffect(() => {
        return () => {
            if (lockKey && selectedDate && userId) {
                theaterBookingService.releaseLock(show.id, selectedDate.date, selectedDate.time, userId);
            }
        };
    }, [lockKey, selectedDate, show.id, userId]);

    // Calculate prices
    const basePrice = selectedDate ? selectedDate.price : show?.priceRange?.min || 0;
    const ticketPrice = basePrice * selectedVIPLevel.multiplier;
    const totalPrice = ticketPrice * tickets;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleNext = () => {
        if (step === 1 && !selectedDate) {
            alert('Please select a date and time');
            return;
        }

        if (step === 1 && selectedDate) {
            // Check availability before proceeding
            const available = theaterBookingService.getAvailableSeats(
                show,
                show.id,
                selectedDate.date,
                selectedDate.time
            );

            if (available <= 0) {
                alert('Sorry, this show time is sold out. Please select another date or time.');
                return;
            }

            setAvailableSeats(available);
            setStep(2);
            return;
        }

        if (step === 2 && tickets < 1) {
            alert('Please select number of tickets');
            return;
        }

        if (step === 2 && tickets > availableSeats) {
            alert(`Only ${availableSeats} seats available. Please reduce the number of tickets.`);
            return;
        }

        if (step === 3) {
            // Trigger form validation
            handleSubmit(() => setStep(step + 1))();
            return;
        }

        setStep(step + 1);
    };

    const handleBack = () => {
        if (step === 2 && lockKey && userId && selectedDate) {
            // Release lock when going back
            theaterBookingService.releaseLock(show.id, selectedDate.date, selectedDate.time, userId);
            setLockKey(null);
        }
        setStep(step - 1);
    };

    const onSubmitForm = async (data) => {
        // Check if user already booked this specific show
        const existingBooking = theaterBookingService.hasUserBooked(show.id, data.email, data.phone);
        if (existingBooking) {
            alert('You have already booked this show. Each person can only book one ticket per show.');
            return;
        }

        const bookingData = {
            showId: show.id,
            title: show.title,
            theater: show.venue,
            date: selectedDate.date,
            time: selectedDate.time,
            vipLevel: selectedVIPLevel,
            tickets,
            ticketPrice,
            totalPrice,
            customer: data,
            bookingId: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            userId: userId
        };

        const result = await theaterBookingService.createBooking(bookingData, show);

        if (result.success) {
            onConfirm(result.booking);
            // Release lock after successful booking
            theaterBookingService.releaseLock(show.id, selectedDate.date, selectedDate.time, userId);
        } else {
            alert(result.error);
        }
    };

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
                        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Book Tickets
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Step {step} of 4
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Lock Warning */}
                        {lockError && (
                            <div className="mx-6 mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span className="text-sm text-red-700 dark:text-red-300">{lockError}</span>
                            </div>
                        )}

                        {step === 2 && lockKey && !lockError && (
                            <div className="mx-6 mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg flex items-center gap-2">
                                <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                <span className="text-sm text-amber-700 dark:text-amber-300">
                                    Your seats are reserved for 15 minutes. Complete your booking to confirm.
                                </span>
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                            {/* Show Info */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-deepTeal/10 to-deepTeal/5 dark:from-deepTeal/20 dark:to-deepTeal/10 rounded-xl border border-deepTeal/20">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                                    {show.title}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-deepTeal" />
                                        {show.venue}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-deepTeal" />
                                        {show.duration} min
                                    </span>
                                </div>
                            </div>

                            {/* Step 1: Select Date & Time */}
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-deepTeal" />
                                        Select Date & Time
                                    </h4>
                                    <div className="grid gap-3">
                                        {show.dates.map((date) => {
                                            const remainingSeats = theaterBookingService.getAvailableSeats(
                                                show,
                                                show.id,
                                                date.date,
                                                date.time
                                            );
                                            const isSoldOut = remainingSeats <= 0;
                                            const lockInfo = theaterBookingService.getLockInfo(show.id, date.date, date.time);
                                            const isLockedByOther = lockInfo.isLocked && lockInfo.tickets >= remainingSeats;

                                            return (
                                                <button
                                                    key={date.date}
                                                    onClick={() => !isSoldOut && !isLockedByOther && setSelectedDate(date)}
                                                    disabled={isSoldOut || isLockedByOther}
                                                    className={`p-4 border-2 rounded-xl text-left transition-all ${selectedDate?.date === date.date
                                                        ? 'border-deepTeal bg-deepTeal/10 shadow-md'
                                                        : isSoldOut || isLockedByOther
                                                            ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-deepTeal/50'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Calendar className="w-4 h-4 text-deepTeal" />
                                                                <span className="font-medium">
                                                                    {new Date(date.date).toLocaleDateString('en-US', {
                                                                        weekday: 'long',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                                <Clock className="w-4 h-4" />
                                                                <span>{date.time}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-bold text-deepTeal text-lg">
                                                                {formatPrice(date.price)}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {isSoldOut
                                                                    ? 'Sold Out'
                                                                    : isLockedByOther
                                                                        ? 'Processing...'
                                                                        : `${remainingSeats} seats left`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Select VIP Level */}
                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Crown className="w-5 h-5 text-deepTeal" />
                                        Select Experience Level
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {Object.values(VIP_LEVELS).map((level) => (
                                            <button
                                                key={level.id}
                                                onClick={() => setSelectedVIPLevel(level)}
                                                className={`p-4 rounded-xl border-2 transition-all text-left ${selectedVIPLevel.id === level.id
                                                    ? `border-deepTeal bg-gradient-to-r ${level.bgColor} shadow-md`
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-deepTeal/50'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl">{level.icon}</span>
                                                        <span className="font-bold text-gray-900 dark:text-white">
                                                            {level.name}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-500">Price per ticket</div>
                                                        <div className="font-bold text-deepTeal">
                                                            {formatPrice(basePrice * level.multiplier)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ul className="space-y-1 mt-2">
                                                    {level.benefits.slice(0, 3).map((benefit, idx) => (
                                                        <li key={idx} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                                                            <Star className="w-3 h-3 text-amber-500 fill-current" />
                                                            {benefit}
                                                        </li>
                                                    ))}
                                                    {level.benefits.length > 3 && (
                                                        <li className="text-xs text-deepTeal mt-1">
                                                            +{level.benefits.length - 3} more benefits
                                                        </li>
                                                    )}
                                                </ul>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Number of Tickets</h5>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setTickets(Math.max(1, tickets - 1))}
                                                disabled={tickets <= 1}
                                                className="w-10 h-10 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center text-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                -
                                            </button>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-deepTeal">{tickets}</div>
                                                <div className="text-xs text-gray-500">Tickets</div>
                                            </div>
                                            <button
                                                onClick={() => setTickets(Math.min(availableSeats, tickets + 1))}
                                                disabled={tickets >= availableSeats}
                                                className="w-10 h-10 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center text-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                +
                                            </button>
                                            <div className="ml-auto text-right">
                                                <div className="text-sm text-gray-500">Subtotal</div>
                                                <div className="text-xl font-bold text-deepTeal">{formatPrice(totalPrice)}</div>
                                            </div>
                                        </div>
                                        {availableSeats < 20 && availableSeats > 0 && (
                                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                                                ⚠️ Only {availableSeats} seats remaining!
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Contact Information */}
                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-deepTeal" />
                                        Contact Information
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus-within:border-deepTeal transition-all">
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
                                            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus-within:border-deepTeal transition-all">
                                                <Mail className="w-5 h-5 text-gray-400" />
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
                                            <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus-within:border-deepTeal transition-all">
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

                                        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl">
                                            <textarea
                                                {...register('specialRequests')}
                                                placeholder="Special Requests (Optional)"
                                                className="w-full bg-transparent outline-none resize-none text-gray-900 dark:text-white"
                                                rows="3"
                                            />
                                        </div>
                                        {errors.specialRequests && (
                                            <p className="text-xs text-red-500 mt-1">{errors.specialRequests.message}</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Order Summary */}
                            {step === 4 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Ticket className="w-5 h-5 text-deepTeal" />
                                        Order Summary
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-300">Show</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{show.title}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-300">Date & Time</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {selectedDate && new Date(selectedDate.date).toLocaleDateString()} at {selectedDate?.time}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-300">VIP Level</span>
                                            <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                                {selectedVIPLevel.icon} {selectedVIPLevel.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-300">Tickets</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{tickets} tickets</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-300">Ticket Price</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{formatPrice(ticketPrice)} each</span>
                                        </div>
                                        <div className="flex justify-between py-3 bg-gradient-to-r from-deepTeal/10 to-deepTeal/5 rounded-lg px-3">
                                            <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
                                            <span className="text-2xl font-bold text-deepTeal">{formatPrice(totalPrice)}</span>
                                        </div>
                                    </div>

                                    {/* VIP Benefits Reminder */}
                                    <div className={`mt-4 p-3 rounded-lg ${selectedVIPLevel.bgColor} border ${selectedVIPLevel.borderColor}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Shield className="w-4 h-4 text-deepTeal" />
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedVIPLevel.name} Benefits:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedVIPLevel.benefits.map((benefit, idx) => (
                                                <span key={idx} className="text-xs bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full">
                                                    {benefit}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between gap-3">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Back
                                </button>
                            )}
                            {step < 4 ? (
                                <button
                                    onClick={handleNext}
                                    disabled={isLocking}
                                    className="flex-1 bg-gradient-to-r from-deepTeal to-deepTeal/90 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLocking ? 'Processing...' : 'Continue'}
                                    {!isLocking && <ChevronRight className="w-4 h-4" />}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit(onSubmitForm)}
                                    className="flex-1 bg-gradient-to-r from-deepTeal to-deepTeal/90 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    Confirm Booking
                                    <Ticket className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BookingModal;