// src/pages/Owner/Booking/OwnerBookingInfo.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    Search, 
    LayoutGrid, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Eye, 
    Ticket,
    DollarSign,
    TrendingUp,
    Building,
    X
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import { OwnerBookingInfo as BookingInfoType, OwnerBookingStats } from './ownerBooking.types';

// Mock Data - Current Owner's Bookings
const currentOwnerId = 'owner-1';
const currentOwnerName = 'Grand Theater';

const mockOwnerBookings: BookingInfoType[] = [
    {
        id: 'BK-001',
        eventId: 'evt-001',
        eventName: 'Summer Music Festival',
        eventDate: '2024-06-15T18:00:00',
        hallName: 'Grand Hall',
        bookingDate: '2024-05-01T10:00:00',
        totalTickets: 250,
        totalAmount: 12500,
        status: 'approved',
        paymentStatus: 'paid',
        ticketTypes: [
            { seatType: 'VIP', quantity: 50, price: 150 },
            { seatType: 'Regular', quantity: 200, price: 50 }
        ],
        approvedAt: '2024-05-02T09:00:00',
        ticketAccessLink: '/owner/tickets/event/evt-001'
    },
    {
        id: 'BK-002',
        eventId: 'evt-002',
        eventName: 'Jazz Night',
        eventDate: '2024-07-20T19:00:00',
        hallName: 'Blue Hall',
        bookingDate: '2024-05-05T14:30:00',
        totalTickets: 180,
        totalAmount: 7200,
        status: 'approved',
        paymentStatus: 'paid',
        ticketTypes: [
            { seatType: 'VIP', quantity: 30, price: 100 },
            { seatType: 'Regular', quantity: 150, price: 40 }
        ],
        approvedAt: '2024-05-06T10:30:00',
        ticketAccessLink: '/owner/tickets/event/evt-002'
    },
    {
        id: 'BK-003',
        eventId: 'evt-003',
        eventName: 'Rock Concert',
        eventDate: '2024-08-10T20:00:00',
        hallName: 'Grand Hall',
        bookingDate: '2024-04-28T11:00:00',
        totalTickets: 500,
        totalAmount: 30000,
        status: 'pending',
        paymentStatus: 'unpaid',
        ticketTypes: [
            { seatType: 'VIP', quantity: 100, price: 200 },
            { seatType: 'Regular', quantity: 400, price: 80 }
        ]
    },
    {
        id: 'BK-004',
        eventId: 'evt-005',
        eventName: 'IMAX Special Screening',
        eventDate: '2024-06-01T15:00:00',
        hallName: 'IMAX Hall',
        bookingDate: '2024-05-10T09:15:00',
        totalTickets: 800,
        totalAmount: 48000,
        status: 'approved',
        paymentStatus: 'paid',
        ticketTypes: [
            { seatType: 'IMAX Standard', quantity: 650, price: 50 },
            { seatType: 'IMAX VIP', quantity: 150, price: 80 }
        ],
        approvedAt: '2024-05-11T14:00:00',
        ticketAccessLink: '/owner/tickets/event/evt-005'
    },
    {
        id: 'BK-005',
        eventId: 'evt-006',
        eventName: 'Comedy Night',
        eventDate: '2024-09-15T20:00:00',
        hallName: 'West Hall',
        bookingDate: '2024-05-12T13:00:00',
        totalTickets: 120,
        totalAmount: 4800,
        status: 'rejected',
        paymentStatus: 'unpaid',
        ticketTypes: [
            { seatType: 'VIP', quantity: 20, price: 110 },
            { seatType: 'Regular', quantity: 100, price: 40 }
        ],
        rejectedReason: 'Hall conflict on requested date'
    }
];

// Save/Load from localStorage
const saveBookings = (bookings: BookingInfoType[]) => localStorage.setItem(`owner_bookings_${currentOwnerId}`, JSON.stringify(bookings));
const loadBookings = (): BookingInfoType[] => {
    const stored = localStorage.getItem(`owner_bookings_${currentOwnerId}`);
    if (stored) return JSON.parse(stored);
    saveBookings(mockOwnerBookings);
    return mockOwnerBookings;
};

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
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string; delay: number }> = ({ title, value, icon: Icon, color, delay }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </motion.div>
    );
};

// Booking Details Modal
const BookingDetailsModal: React.FC<{ booking: BookingInfoType | null; isOpen: boolean; onClose: () => void }> = ({ booking, isOpen, onClose }) => {
    if (!isOpen || !booking) return null;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB' }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const config: any = {
            pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending Approval' },
            approved: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Approved' },
            rejected: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Rejected' },
            cancelled: { icon: XCircle, color: 'bg-gray-100 text-gray-700', label: 'Cancelled' }
        };
        const c = config[status];
        const Icon = c.icon;
        return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.color}`}><Icon className="h-3 w-3" /> {c.label}</span>;
    };

    const handleViewTickets = () => {
        if (booking.ticketAccessLink) {
            window.open(booking.ticketAccessLink, '_blank');
        } else {
            alert('Ticket link not available for this booking');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">Booking Information</h2>
                            <p className="text-white/80 text-sm mt-1">ID: {booking.id}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition"><X className="h-5 w-5" /></button>
                    </div>
                    <div className="mt-3">{getStatusBadge(booking.status)}</div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Event & Booking Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Event Name</p><p className="font-semibold text-lg">{booking.eventName}</p></div>
                        <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Venue / Hall</p><p className="font-semibold">{booking.hallName}</p></div>
                        <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Event Date</p><p className="font-semibold">{formatDate(booking.eventDate)}</p></div>
                        <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Booking Date</p><p className="font-semibold">{formatDate(booking.bookingDate)}</p></div>
                    </div>

                    {/* Ticket Details */}
                    <div><h3 className="font-semibold mb-3 flex items-center gap-2"><Ticket className="h-4 w-4 text-teal-600" />Ticket Breakdown</h3>
                        <div className="space-y-2">{booking.ticketTypes.map((t, idx) => (<div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><div><p className="font-medium">{t.seatType}</p><p className="text-xs text-gray-500">Quantity: {t.quantity}</p></div><div><p className="font-semibold text-teal-600">{formatCurrency(t.price)} each</p><p className="text-xs text-gray-500">Total: {formatCurrency(t.price * t.quantity)}</p></div></div>))}</div></div>

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200">
                        <div className="flex justify-between items-center mb-2"><span className="text-gray-600">Total Tickets</span><span className="font-bold text-xl">{booking.totalTickets.toLocaleString()}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-600">Total Amount</span><span className="font-bold text-2xl text-teal-600">{formatCurrency(booking.totalAmount)}</span></div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-teal-200"><span className="text-gray-600">Payment Status</span><span className={`font-semibold ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>{booking.paymentStatus}</span></div>
                    </div>

                    {/* Approval Info */}
                    {booking.approvedAt && <div className="bg-green-50 rounded-lg p-3"><p className="text-xs text-green-600">Approved on {formatDate(booking.approvedAt)}</p></div>}
                    {booking.rejectedReason && <div className="bg-red-50 rounded-lg p-3"><p className="text-xs text-red-600">Rejection Reason</p><p className="text-red-700">{booking.rejectedReason}</p></div>}
                </div>

                {/* Footer Actions */}
                <div className="border-t p-5 bg-gray-50 flex justify-end gap-3">
                    <ReusableButton onClick={onClose} variant="secondary">Close</ReusableButton>
                    {booking.status === 'approved' && (
                        <ReusableButton onClick={handleViewTickets} variant="primary" icon={Ticket}>View Tickets</ReusableButton>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// Main Component
const OwnerBookingInfo: React.FC = () => {
    const [bookings, setBookings] = useState<BookingInfoType[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingInfoType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingInfoType | null>(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    useEffect(() => {
        const data = loadBookings();
        setBookings(data);
        setFilteredBookings(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        let filtered = bookings;
        if (searchTerm) {
            filtered = filtered.filter(b => 
                b.eventName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                b.hallName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterStatus !== 'all') {
            filtered = filtered.filter(b => b.status === filterStatus);
        }
        setFilteredBookings(filtered);
    }, [searchTerm, bookings, filterStatus]);

    // Stats - Only 3 cards
    const stats = {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        totalTickets: bookings.reduce((sum, b) => sum + b.totalTickets, 0),
    };

    const handleViewTickets = (booking: BookingInfoType) => {
        if (booking.ticketAccessLink) {
            window.open(booking.ticketAccessLink, '_blank');
        } else {
            setPopupMessage({ title: 'Info', message: 'Ticket link not available for this booking.', type: 'info' });
            setShowSuccessPopup(true);
        }
    };

    const columns = [
        { 
            Header: 'Booking ID', 
            accessor: 'id', 
            sortable: true, 
            Cell: (row: BookingInfoType) => (
                <div>
                    <p className="font-medium">{row.id}</p>
                    <p className="text-xs text-gray-500">{new Date(row.bookingDate).toLocaleDateString()}</p>
                </div>
            ) 
        },
        { 
            Header: 'Event', 
            accessor: 'eventName', 
            sortable: true, 
            Cell: (row: BookingInfoType) => (
                <div>
                    <p className="font-medium">{row.eventName}</p>
                    <p className="text-xs text-gray-500">{row.hallName}</p>
                </div>
            ) 
        },
        { 
            Header: 'Event Date', 
            accessor: 'eventDate', 
            sortable: true, 
            Cell: (row: BookingInfoType) => new Date(row.eventDate).toLocaleDateString() 
        },
        { 
            Header: 'Tickets', 
            accessor: 'totalTickets', 
            sortable: true, 
            Cell: (row: BookingInfoType) => <span className="font-semibold">{row.totalTickets.toLocaleString()}</span> 
        },
        { 
            Header: 'Amount', 
            accessor: 'totalAmount', 
            sortable: true, 
            Cell: (row: BookingInfoType) => <span className="text-green-600 font-semibold">ETB {row.totalAmount.toLocaleString()}</span> 
        },
        { 
            Header: 'Payment', 
            accessor: 'paymentStatus', 
            sortable: true, 
            Cell: (row: BookingInfoType) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {row.paymentStatus}
                </span>
            ) 
        },
        { 
            Header: 'Status', 
            accessor: 'status', 
            sortable: true, 
            Cell: (row: BookingInfoType) => {
                const config: any = { 
                    pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700' }, 
                    approved: { icon: CheckCircle, color: 'bg-green-100 text-green-700' }, 
                    rejected: { icon: XCircle, color: 'bg-red-100 text-red-700' }, 
                    cancelled: { icon: XCircle, color: 'bg-gray-100 text-gray-700' } 
                };
                const c = config[row.status];
                const Icon = c.icon;
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.color}`}>
                        <Icon className="h-3 w-3" /> {row.status}
                    </span>
                );
            } 
        }
    ];

    const Actions = (row: BookingInfoType) => (
        <div className="flex gap-2">
            <button 
                onClick={() => { setSelectedBooking(row); setShowDetailsModal(true); }} 
                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                title="View Details"
            >
                <Eye className="h-4 w-4 text-blue-600" />
            </button>
            {row.status === 'approved' && (
                <button 
                    onClick={() => handleViewTickets(row)} 
                    className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition"
                    title="View Tickets"
                >
                    <Ticket className="h-4 w-4 text-teal-600" />
                </button>
            )}
        </div>
    );

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" /></div>;
    }

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                            <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                            <p className="text-sm text-gray-500">View and manage your event ticket bookings</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Only 3 cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <StatCard title="Total Bookings" value={stats.totalBookings} icon={Calendar} color="from-teal-500 to-teal-600" delay={0.1} />
                    <StatCard title="Pending Approval" value={stats.pendingBookings} icon={Clock} color="from-yellow-500 to-orange-600" delay={0.15} />
                    <StatCard title="Total Tickets" value={stats.totalTickets.toLocaleString()} icon={Ticket} color="from-purple-500 to-pink-600" delay={0.2} />
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search by event or venue..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Bookings Table */}
                <ReusableTable 
                    columns={[...columns, { Header: 'Actions', accessor: 'actions', Cell: Actions, width: '120px' }]} 
                    data={filteredBookings} 
                    icon={LayoutGrid} 
                    showSearch={false} 
                    showExport={false} 
                    itemsPerPage={10} 
                />

                {/* Booking Details Modal */}
                <BookingDetailsModal 
                    booking={selectedBooking} 
                    isOpen={showDetailsModal} 
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedBooking(null);
                    }} 
                />
                
                <SuccessPopup 
                    isOpen={showSuccessPopup} 
                    onClose={() => setShowSuccessPopup(false)} 
                    type={popupMessage.type} 
                    title={popupMessage.title} 
                    message={popupMessage.message} 
                    duration={3000} 
                    position="top-right" 
                />
            </div>
        </motion.div>
    );
};

export default OwnerBookingInfo;