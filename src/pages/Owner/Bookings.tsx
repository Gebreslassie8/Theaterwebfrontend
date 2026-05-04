// src/pages/TheaterOwner/Bookings.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ticket,
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    DollarSign,
    Search,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock as ClockIcon,
    Printer,
    Send,
    X,
    CreditCard,
    Smartphone,
    Landmark,
    Wallet as WalletIcon,
    TrendingUp,
    AlertCircle,
    RefreshCw,
    Ban,
    Filter,
    ChevronDown,
    ChevronUp,
    Users,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableTable from '../../components/Reusable/ReusableTable';
import SuccessPopup from '../../components/Reusable/SuccessPopup';

// Types
interface Booking {
    id: string;
    bookingReference: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    hallName: string;
    seats: string[];
    ticketCount: number;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: 'paid' | 'pending' | 'failed';
    bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    bookingDate: string;
    specialRequests?: string;
    transactionId?: string;
    confirmedBy?: string;
    confirmedAt?: string;
    cancelledBy?: string;
    cancelledAt?: string;
    cancellationReason?: string;
}

// Mock Data
const mockBookings: Booking[] = [
    {
        id: '1',
        bookingReference: 'BK-001-2024',
        customerName: 'John Smith',
        customerEmail: 'john.smith@example.com',
        customerPhone: '+251 911 234 567',
        eventName: 'The Lion King',
        eventDate: '2024-04-20',
        eventTime: '19:00',
        hallName: 'Main Hall',
        seats: ['A12', 'A13', 'A14', 'B5'],
        ticketCount: 4,
        totalAmount: 2400,
        paymentMethod: 'Chapa',
        paymentStatus: 'paid',
        bookingStatus: 'pending',
        bookingDate: '2024-04-15T10:30:00',
        specialRequests: 'Wheelchair accessible seating preferred',
        transactionId: 'CH-20240415-001'
    },
    {
        id: '2',
        bookingReference: 'BK-002-2024',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@example.com',
        customerPhone: '+251 912 345 678',
        eventName: 'Hamilton',
        eventDate: '2024-04-18',
        eventTime: '20:00',
        hallName: 'Main Hall',
        seats: ['C10', 'C11'],
        ticketCount: 2,
        totalAmount: 1200,
        paymentMethod: 'Telebirr',
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        bookingDate: '2024-04-14T14:20:00',
        confirmedBy: 'Theater Owner',
        confirmedAt: '2024-04-14T15:00:00'
    },
    {
        id: '3',
        bookingReference: 'BK-003-2024',
        customerName: 'Michael Chen',
        customerEmail: 'michael.chen@example.com',
        customerPhone: '+251 913 456 789',
        eventName: 'Wicked',
        eventDate: '2024-04-22',
        eventTime: '15:00',
        hallName: 'Studio Hall',
        seats: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'],
        ticketCount: 6,
        totalAmount: 3600,
        paymentMethod: 'CBE Birr',
        paymentStatus: 'paid',
        bookingStatus: 'pending',
        bookingDate: '2024-04-16T09:15:00',
        specialRequests: 'Near exit door',
        transactionId: 'CB-20240416-001'
    },
    {
        id: '4',
        bookingReference: 'BK-004-2024',
        customerName: 'Emily Davis',
        customerEmail: 'emily.d@example.com',
        customerPhone: '+251 914 567 890',
        eventName: 'Dear Evan Hansen',
        eventDate: '2024-04-25',
        eventTime: '19:30',
        hallName: 'VIP Hall',
        seats: ['VIP1', 'VIP2', 'VIP3'],
        ticketCount: 3,
        totalAmount: 3000,
        paymentMethod: 'Bank Transfer',
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        bookingDate: '2024-04-10T11:45:00',
        confirmedBy: 'Theater Owner',
        confirmedAt: '2024-04-10T12:30:00'
    },
    {
        id: '5',
        bookingReference: 'BK-005-2024',
        customerName: 'David Wilson',
        customerEmail: 'david.w@example.com',
        customerPhone: '+251 915 678 901',
        eventName: 'The Lion King',
        eventDate: '2024-04-20',
        eventTime: '19:00',
        hallName: 'Main Hall',
        seats: ['A1', 'A2'],
        ticketCount: 2,
        totalAmount: 1200,
        paymentMethod: 'Chapa',
        paymentStatus: 'paid',
        bookingStatus: 'pending',
        bookingDate: '2024-04-16T08:30:00',
        transactionId: 'CH-20240416-001'
    }
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 12
        }
    }
};

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    delay: number;
    link?: string;
    trend?: string;
    trendDirection?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, trend, trendDirection }) => {
    const [isHovered, setIsHovered] = useState(false);

    const CardContent = () => (
        <div
            className="relative overflow-hidden cursor-pointer transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-gray-500">{title}</p>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs mt-0.5 ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trendDirection === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            <span>{trend}</span>
                        </div>
                    )}
                </div>
                {link && (
                    <div className={`transform transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'}`}>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
            {link ? (
                <Link to={link} className="block">
                    <CardContent />
                </Link>
            ) : (
                <CardContent />
            )}
        </motion.div>
    );
};

// View Booking Modal
interface ViewBookingModalProps {
    booking: Booking | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
    onSendMessage?: () => void;
}

const ViewBookingModal: React.FC<ViewBookingModalProps> = ({ booking, isOpen, onClose, onConfirm, onCancel, onSendMessage }) => {
    if (!isOpen || !booking) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Confirmed</span>;
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700"><ClockIcon className="h-3 w-3" /> Pending</span>;
            case 'cancelled':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Cancelled</span>;
            default:
                return null;
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'Chapa': return <CreditCard className="h-4 w-4 text-teal-500" />;
            case 'Telebirr': return <Smartphone className="h-4 w-4 text-green-500" />;
            case 'CBE Birr': return <Landmark className="h-4 w-4 text-blue-500" />;
            default: return <WalletIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="relative h-32 overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-6">
                        <h2 className="text-xl font-bold text-white">Booking Details</h2>
                        <p className="text-sm text-white/80">{booking.bookingReference}</p>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition">✕</button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="flex justify-end">
                        {getStatusBadge(booking.bookingStatus)}
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 border-l-3 border-emerald-500 pl-3">Customer Information</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Name</p><p className="font-medium">{booking.customerName}</p></div>
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Email</p><p className="font-medium">{booking.customerEmail}</p></div>
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{booking.customerPhone}</p></div>
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Booking Date</p><p className="font-medium">{formatDate(booking.bookingDate)}</p></div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 border-l-3 border-emerald-500 pl-3">Event Details</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Event</p><p className="font-medium">{booking.eventName}</p></div>
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Date & Time</p><p className="font-medium">{booking.eventDate} at {booking.eventTime}</p></div>
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Hall</p><p className="font-medium">{booking.hallName}</p></div>
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Seats</p><p className="font-medium">{booking.seats.join(', ')}</p></div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 border-l-3 border-emerald-500 pl-3">Payment Information</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Tickets</p><p className="font-medium">{booking.ticketCount}</p></div>
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Total Amount</p><p className="font-bold text-emerald-600">{formatCurrency(booking.totalAmount)}</p></div>
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Payment Method</p><div className="flex items-center gap-1 mt-1">{getPaymentMethodIcon(booking.paymentMethod)}<span>{booking.paymentMethod}</span></div></div>
                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Payment Status</p><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 mt-1"><CheckCircle className="h-3 w-3" /> {booking.paymentStatus}</span></div>
                        </div>
                    </div>

                    {booking.specialRequests && (
                        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                            <p className="text-xs text-gray-500">Special Requests</p>
                            <p className="text-sm text-yellow-800 mt-1">{booking.specialRequests}</p>
                        </div>
                    )}

                    {booking.confirmedBy && (
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                            <p className="text-xs text-gray-500">Confirmed by {booking.confirmedBy} on {formatDate(booking.confirmedAt || '')}</p>
                        </div>
                    )}
                    {booking.cancelledBy && (
                        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                            <p className="text-xs text-gray-500">Cancelled by {booking.cancelledBy} on {formatDate(booking.cancelledAt || '')}</p>
                            <p className="text-sm text-red-800 mt-1">Reason: {booking.cancellationReason}</p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        {booking.bookingStatus === 'pending' && (
                            <>
                                <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Confirm Booking</button>
                                <button onClick={onCancel} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Cancel Booking</button>
                            </>
                        )}
                        {booking.bookingStatus === 'confirmed' && (
                            <button onClick={onSendMessage} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Send Message</button>
                        )}
                        <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Close</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Confirm Modal
interface ConfirmModalProps {
    booking: Booking | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ booking, isOpen, onClose, onConfirm }) => {
    if (!isOpen || !booking) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="h-6 w-6 text-green-600" /></div>
                    <h3 className="text-xl font-bold text-gray-900">Confirm Booking</h3>
                </div>
                <p className="text-gray-600 mb-4">Confirm booking for <strong>{booking.customerName}</strong>?</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Confirm</button>
                </div>
            </motion.div>
        </div>
    );
};

// Cancel Modal
interface CancelModalProps {
    booking: Booking | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ booking, isOpen, onClose, onConfirm }) => {
    const [cancellationReason, setCancellationReason] = useState('');
    
    if (!isOpen || !booking) return null;

    const handleConfirm = () => {
        if (cancellationReason.trim()) {
            onConfirm(cancellationReason);
            setCancellationReason('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg"><XCircle className="h-6 w-6 text-red-600" /></div>
                    <h3 className="text-xl font-bold text-gray-900">Cancel Booking</h3>
                </div>
                <p className="text-gray-600 mb-4">Cancel booking for <strong>{booking.customerName}</strong>?</p>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for cancellation <span className="text-red-500">*</span></label>
                    <textarea 
                        value={cancellationReason} 
                        onChange={(e) => setCancellationReason(e.target.value)} 
                        rows={3} 
                        placeholder="Enter reason for cancellation..." 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    />
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Back</button>
                    <button onClick={handleConfirm} disabled={!cancellationReason.trim()} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50">Cancel Booking</button>
                </div>
            </motion.div>
        </div>
    );
};

// Send Message Modal
interface MessageModalProps {
    booking: Booking | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (subject: string, message: string) => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ booking, isOpen, onClose, onConfirm }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    
    if (!isOpen || !booking) return null;

    const handleConfirm = () => {
        if (subject.trim() && message.trim()) {
            onConfirm(subject, message);
            setSubject('');
            setMessage('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg"><Send className="h-6 w-6 text-purple-600" /></div>
                    <h3 className="text-xl font-bold text-gray-900">Send Message</h3>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter subject..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Type your message..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                    <button onClick={handleConfirm} disabled={!subject.trim() || !message.trim()} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50">Send Message</button>
                </div>
            </motion.div>
        </div>
    );
};

// Main Component
const Bookings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal states
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Confirmed</span>;
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700"><ClockIcon className="h-3 w-3" /> Pending</span>;
            case 'cancelled':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Cancelled</span>;
            default:
                return null;
        }
    };

    // Filter bookings based on active tab
    const getFilteredBookings = () => {
        let filtered = bookings;

        if (activeTab === 'pending') {
            filtered = filtered.filter(b => b.bookingStatus === 'pending');
        } else if (activeTab === 'confirmed') {
            filtered = filtered.filter(b => b.bookingStatus === 'confirmed');
        } else if (activeTab === 'cancelled') {
            filtered = filtered.filter(b => b.bookingStatus === 'cancelled');
        }

        if (searchTerm) {
            filtered = filtered.filter(b =>
                b.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredBookings = getFilteredBookings();

    // Stats
    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.bookingStatus === 'pending').length,
        confirmed: bookings.filter(b => b.bookingStatus === 'confirmed').length,
        cancelled: bookings.filter(b => b.bookingStatus === 'cancelled').length,
        totalRevenue: bookings.reduce((sum, b) => sum + b.totalAmount, 0)
    };

    // Action Handlers
    const handleConfirmBooking = () => {
        if (selectedBooking) {
            setBookings(bookings.map(b =>
                b.id === selectedBooking.id
                    ? { ...b, bookingStatus: 'confirmed', confirmedBy: 'Theater Owner', confirmedAt: new Date().toISOString() }
                    : b
            ));
            setShowConfirmModal(false);
            setShowDetailsModal(false);
            setPopupMessage({ title: 'Booking Confirmed', message: `Booking ${selectedBooking.bookingReference} has been confirmed.`, type: 'success' });
            setShowSuccessPopup(true);
            setSelectedBooking(null);
        }
    };

    const handleCancelBooking = (reason: string) => {
        if (selectedBooking && reason) {
            setBookings(bookings.map(b =>
                b.id === selectedBooking.id
                    ? { ...b, bookingStatus: 'cancelled', cancelledBy: 'Theater Owner', cancelledAt: new Date().toISOString(), cancellationReason: reason }
                    : b
            ));
            setShowCancelModal(false);
            setShowDetailsModal(false);
            setPopupMessage({ title: 'Booking Cancelled', message: `Booking ${selectedBooking.bookingReference} has been cancelled.`, type: 'warning' });
            setShowSuccessPopup(true);
            setSelectedBooking(null);
        }
    };

    const handleSendMessage = (subject: string, message: string) => {
        if (selectedBooking && subject && message) {
            setPopupMessage({ title: 'Message Sent', message: `Your message has been sent to ${selectedBooking.customerEmail}`, type: 'success' });
            setShowMessageModal(false);
            setShowDetailsModal(false);
            setShowSuccessPopup(true);
            setSelectedBooking(null);
        }
    };

    const handleExport = () => {
        const csvContent = [
            ['Reference', 'Customer', 'Email', 'Phone', 'Event', 'Date', 'Seats', 'Tickets', 'Amount', 'Status'],
            ...filteredBookings.map(b => [b.bookingReference, b.customerName, b.customerEmail, b.customerPhone, b.eventName, `${b.eventDate} ${b.eventTime}`, b.seats.join('|'), b.ticketCount, b.totalAmount, b.bookingStatus])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setPopupMessage({ title: 'Export Successful', message: 'Bookings exported to CSV successfully', type: 'success' });
        setShowSuccessPopup(true);
    };

    // Tabs
    const tabs = [
        { id: 'all', label: 'All Bookings', icon: Ticket, count: stats.total, color: 'emerald' },
        { id: 'pending', label: 'Pending', icon: ClockIcon, count: stats.pending, color: 'yellow' },
        { id: 'confirmed', label: 'Confirmed', icon: CheckCircle, count: stats.confirmed, color: 'green' },
        { id: 'cancelled', label: 'Cancelled', icon: XCircle, count: stats.cancelled, color: 'red' }
    ];

    // Table columns with ACTIONS as a dedicated column
    const columns = [
        {
            Header: 'Reference',
            accessor: 'bookingReference',
            sortable: true,
            Cell: (row: Booking) => (
                <div><p className="font-medium text-gray-900">{row.bookingReference}</p><p className="text-xs text-gray-500">{formatDate(row.bookingDate)}</p></div>
            )
        },
        {
            Header: 'Customer',
            accessor: 'customerName',
            sortable: true,
            Cell: (row: Booking) => (
                <div><p className="font-medium text-gray-900">{row.customerName}</p><p className="text-xs text-gray-500">{row.customerEmail}</p></div>
            )
        },
        {
            Header: 'Event',
            accessor: 'eventName',
            sortable: true,
            Cell: (row: Booking) => (
                <div><p className="text-sm text-gray-900">{row.eventName}</p><p className="text-xs text-gray-500">{row.eventDate} at {row.eventTime}</p></div>
            )
        },
        {
            Header: 'Seats',
            accessor: 'seats',
            sortable: true,
            Cell: (row: Booking) => (
                <div className="flex flex-wrap gap-1">
                    {row.seats.slice(0, 3).map(seat => (<span key={seat} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{seat}</span>))}
                    {row.seats.length > 3 && <span className="text-xs text-gray-400">+{row.seats.length - 3}</span>}
                </div>
            )
        },
        {
            Header: 'Amount',
            accessor: 'totalAmount',
            sortable: true,
            Cell: (row: Booking) => (<p className="font-semibold text-emerald-600">{formatCurrency(row.totalAmount)}</p>)
        },
        {
            Header: 'Status',
            accessor: 'bookingStatus',
            sortable: true,
            Cell: (row: Booking) => getStatusBadge(row.bookingStatus)
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            sortable: false,
            width: '180px',
            Cell: (row: Booking) => (
                <div className="flex items-center gap-1 flex-wrap">
                    <button onClick={() => { setSelectedBooking(row); setShowDetailsModal(true); }} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition" title="View Details"><Eye className="h-4 w-4 text-blue-600" /></button>
                    {row.bookingStatus === 'pending' && (<button onClick={() => { setSelectedBooking(row); setShowConfirmModal(true); }} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition" title="Confirm Booking"><CheckCircle className="h-4 w-4 text-green-600" /></button>)}
                    {row.bookingStatus === 'pending' && (<button onClick={() => { setSelectedBooking(row); setShowCancelModal(true); }} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition" title="Cancel Booking"><XCircle className="h-4 w-4 text-red-600" /></button>)}
                    {row.bookingStatus === 'confirmed' && (<button onClick={() => { setSelectedBooking(row); setShowMessageModal(true); }} className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition" title="Send Message"><Send className="h-4 w-4 text-purple-600" /></button>)}
                </div>
            )
        }
    ];

    const dashboardCards = [
        { title: 'Total Bookings', value: stats.total, icon: Ticket, color: 'from-emerald-500 to-teal-600', delay: 0.1, trend: '+12%', trendDirection: 'up' as const },
        { title: 'Pending', value: stats.pending, icon: ClockIcon, color: 'from-yellow-500 to-amber-600', delay: 0.15, trend: '-3%', trendDirection: 'down' as const },
        { title: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'from-green-500 to-emerald-600', delay: 0.2, trend: '+8%', trendDirection: 'up' as const },
        { title: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'from-red-500 to-rose-600', delay: 0.25, trend: '+2%', trendDirection: 'up' as const },
        { title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'from-purple-500 to-pink-600', delay: 0.3, trend: '+15%', trendDirection: 'up' as const }
    ];

    return (
        <>
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8 p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                                <Ticket className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
                                <p className="text-sm text-gray-500">Manage customer bookings - Confirm or Cancel pending bookings</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                        {dashboardCards.map((card, index) => (
                            <StatCard key={index} title={card.title} value={card.value} icon={card.icon} color={card.color} delay={card.delay} trend={card.trend} trendDirection={card.trendDirection} />
                        ))}
                    </motion.div>

                    {/* Tab Navigation */}
                    <div className="mb-6 overflow-x-auto">
                        <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-sm border border-gray-100 inline-flex">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${isActive ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-md` : 'text-gray-600 hover:bg-gray-100'}`}>
                                        <Icon className="h-4 w-4" />
                                        {tab.label}
                                        <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>{tab.count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                        <div className="flex flex-wrap gap-3">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input type="text" placeholder="Search by reference, customer name, email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                            <ReusableButton onClick={handleExport} icon={Download} variant="secondary" size="sm">Export</ReusableButton>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <ReusableTable columns={columns} data={filteredBookings} icon={Ticket} showSearch={false} showExport={false} showPrint={false} />
                </div>
            </motion.div>

            {/* Modals - Controlled with proper isOpen props */}
            <AnimatePresence>
                <ViewBookingModal 
                    booking={selectedBooking} 
                    isOpen={showDetailsModal} 
                    onClose={() => { setShowDetailsModal(false); setSelectedBooking(null); }} 
                    onConfirm={() => { setShowDetailsModal(false); setShowConfirmModal(true); }} 
                    onCancel={() => { setShowDetailsModal(false); setShowCancelModal(true); }} 
                    onSendMessage={() => { setShowDetailsModal(false); setShowMessageModal(true); }} 
                />

                <ConfirmModal 
                    booking={selectedBooking} 
                    isOpen={showConfirmModal} 
                    onClose={() => { setShowConfirmModal(false); setSelectedBooking(null); }} 
                    onConfirm={handleConfirmBooking} 
                />

                <CancelModal 
                    booking={selectedBooking} 
                    isOpen={showCancelModal} 
                    onClose={() => { setShowCancelModal(false); setSelectedBooking(null); }} 
                    onConfirm={handleCancelBooking} 
                />

                <MessageModal 
                    booking={selectedBooking} 
                    isOpen={showMessageModal} 
                    onClose={() => { setShowMessageModal(false); setSelectedBooking(null); }} 
                    onConfirm={handleSendMessage} 
                />
            </AnimatePresence>

            {/* Success Popup */}
            <SuccessPopup 
                isOpen={showSuccessPopup} 
                onClose={() => setShowSuccessPopup(false)} 
                type={popupMessage.type} 
                title={popupMessage.title} 
                message={popupMessage.message} 
                duration={3000} 
                position="top-right" 
            />
        </>
    );
};

export default Bookings;