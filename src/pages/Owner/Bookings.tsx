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
    MessageCircle,
    FileText,
    Filter,
    ChevronDown,
    ChevronUp,
    Star,
    Award,
    Activity,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Edit,
    Trash2,
    Save,
    Plus,
    Minus,
    Settings,
    Bell,
    BellRing,
    BellOff,
    Bookmark,
    BookmarkCheck,
    BookmarkX,
    Folder,
    FolderOpen,
    FolderPlus,
    FolderSync,
    FolderTree,
    FolderInput,
    FolderOutput,
    FolderSearch,
    FolderUp,
    FolderDown,
    FolderMinus,
    FolderHeart,
    FolderKey,
    FolderLock,
    FolderCog,
    FolderKanban,
    FolderGit,
    FolderGit2,
    FolderCode,
    FolderDot,
    FolderClock,
    FolderCheck,
    FolderX as FolderXIcon,
    FolderWarning,
    FolderQuestion,
    LayoutDashboard,
    TrendingUp as TrendingUpIcon,
    Wallet,
    Calendar as CalendarIcon,
    Building,
    Ticket as TicketIcon,
    FileText as FileTextIcon,
    Settings as SettingsIcon,
    User as UserIcon,
    LogOut,
    HelpCircle,
    Crown,
    Shield,
    Lock,
    Unlock,
    EyeOff,
    Eye as EyeIcon,
    Maximize2,
    Minimize2,
    ExternalLink,
    Copy,
    Share2,
    Printer as PrinterIcon
} from 'lucide-react';
import ReusableButton from '../../components/Reusable/ReusableButton';
import ReusableTable from '../../components/Reusable/ReusableTable';
import ReusableForm from '../../components/Reusable/ReusableForm';
import SuccessPopup from '../../components/Reusable/SuccessPopup';
import * as Yup from 'yup';

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

// Validation Schema for Cancel Booking
const CancelSchema = Yup.object({
    reason: Yup.string().required('Cancellation reason is required').min(5, 'Reason must be at least 5 characters')
});

// Validation Schema for Send Message
const MessageSchema = Yup.object({
    subject: Yup.string().required('Subject is required').min(3, 'Subject must be at least 3 characters'),
    message: Yup.string().required('Message is required').min(10, 'Message must be at least 10 characters')
});

const Bookings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');
    const [messageSubject, setMessageSubject] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Confirmed</span>;
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700"><ClockIcon className="h-3 w-3" /> Pending</span>;
            case 'cancelled':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Cancelled</span>;
            case 'completed':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"><CheckCircle className="h-3 w-3" /> Completed</span>;
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

    const handleConfirmBooking = () => {
        if (selectedBooking) {
            setBookings(bookings.map(b =>
                b.id === selectedBooking.id
                    ? {
                        ...b,
                        bookingStatus: 'confirmed',
                        confirmedBy: 'Theater Owner',
                        confirmedAt: new Date().toISOString()
                    }
                    : b
            ));
            setShowConfirmModal(false);
            setPopupMessage({
                title: 'Booking Confirmed',
                message: `Booking ${selectedBooking.bookingReference} has been confirmed.`,
                type: 'success'
            });
            setShowSuccessPopup(true);
            setSelectedBooking(null);
        }
    };

    const handleCancelBooking = () => {
        if (selectedBooking && cancellationReason) {
            setBookings(bookings.map(b =>
                b.id === selectedBooking.id
                    ? {
                        ...b,
                        bookingStatus: 'cancelled',
                        cancelledBy: 'Theater Owner',
                        cancelledAt: new Date().toISOString(),
                        cancellationReason: cancellationReason
                    }
                    : b
            ));
            setShowCancelModal(false);
            setCancellationReason('');
            setPopupMessage({
                title: 'Booking Cancelled',
                message: `Booking ${selectedBooking.bookingReference} has been cancelled. Reason: ${cancellationReason}`,
                type: 'warning'
            });
            setShowSuccessPopup(true);
            setSelectedBooking(null);
        }
    };

    const handleSendMessage = () => {
        if (selectedBooking && messageSubject && messageContent) {
            setPopupMessage({
                title: 'Message Sent',
                message: `Your message has been sent to ${selectedBooking.customerEmail}`,
                type: 'success'
            });
            setShowMessageModal(false);
            setMessageSubject('');
            setMessageContent('');
            setShowSuccessPopup(true);
        }
    };

    const handleExport = () => {
        const csvContent = [
            ['Reference', 'Customer', 'Email', 'Phone', 'Event', 'Date', 'Seats', 'Tickets', 'Amount', 'Payment Method', 'Payment Status', 'Booking Status'],
            ...filteredBookings.map(b => [
                b.bookingReference, b.customerName, b.customerEmail, b.customerPhone,
                b.eventName, `${b.eventDate} ${b.eventTime}`, b.seats.join('|'), b.ticketCount,
                b.totalAmount, b.paymentMethod, b.paymentStatus, b.bookingStatus
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        setPopupMessage({
            title: 'Export Successful',
            message: 'Bookings exported to CSV successfully',
            type: 'success'
        });
        setShowSuccessPopup(true);
    };

    // Stats
    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.bookingStatus === 'pending').length,
        confirmed: bookings.filter(b => b.bookingStatus === 'confirmed').length,
        cancelled: bookings.filter(b => b.bookingStatus === 'cancelled').length,
        totalRevenue: bookings.reduce((sum, b) => sum + b.totalAmount, 0)
    };

    // Tabs
    const tabs = [
        { id: 'all', label: 'All Bookings', icon: Ticket, count: stats.total, color: 'emerald' },
        { id: 'pending', label: 'Pending', icon: ClockIcon, count: stats.pending, color: 'yellow' },
        { id: 'confirmed', label: 'Confirmed', icon: CheckCircle, count: stats.confirmed, color: 'green' },
        { id: 'cancelled', label: 'Cancelled', icon: XCircle, count: stats.cancelled, color: 'red' }
    ];

    // Table Columns with ACTIONS as a dedicated column
    const columns = [
        {
            Header: 'Reference',
            accessor: 'bookingReference',
            sortable: true,
            Cell: (row: Booking) => (
                <div>
                    <p className="font-medium text-gray-900">{row.bookingReference}</p>
                    <p className="text-xs text-gray-500">{formatDate(row.bookingDate)}</p>
                </div>
            )
        },
        {
            Header: 'Customer',
            accessor: 'customerName',
            sortable: true,
            Cell: (row: Booking) => (
                <div>
                    <p className="font-medium text-gray-900">{row.customerName}</p>
                    <p className="text-xs text-gray-500">{row.customerEmail}</p>
                </div>
            )
        },
        {
            Header: 'Event',
            accessor: 'eventName',
            sortable: true,
            Cell: (row: Booking) => (
                <div>
                    <p className="text-sm text-gray-900">{row.eventName}</p>
                    <p className="text-xs text-gray-500">{row.eventDate} at {row.eventTime}</p>
                </div>
            )
        },
        {
            Header: 'Seats',
            accessor: 'seats',
            sortable: true,
            Cell: (row: Booking) => (
                <div className="flex flex-wrap gap-1">
                    {row.seats.slice(0, 3).map(seat => (
                        <span key={seat} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{seat}</span>
                    ))}
                    {row.seats.length > 3 && <span className="text-xs text-gray-400">+{row.seats.length - 3}</span>}
                </div>
            )
        },
        {
            Header: 'Amount',
            accessor: 'totalAmount',
            sortable: true,
            Cell: (row: Booking) => (
                <p className="font-semibold text-emerald-600">{formatCurrency(row.totalAmount)}</p>
            )
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
            width: '200px',
            Cell: (row: Booking) => (
                <div className="flex items-center gap-1 flex-wrap">
                    {/* View Details Button */}
                    <button
                        onClick={() => { setSelectedBooking(row); setShowDetailsModal(true); }}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="View Details"
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </button>

                    {/* Confirm Button - Only for pending bookings */}
                    {row.bookingStatus === 'pending' && (
                        <button
                            onClick={() => { setSelectedBooking(row); setShowConfirmModal(true); }}
                            className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                            title="Confirm Booking"
                        >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </button>
                    )}

                    {/* Cancel Button - Only for pending bookings */}
                    {row.bookingStatus === 'pending' && (
                        <button
                            onClick={() => { setSelectedBooking(row); setShowCancelModal(true); }}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                            title="Cancel Booking"
                        >
                            <XCircle className="h-4 w-4 text-red-600" />
                        </button>
                    )}

                    {/* Print Ticket Button - Only for confirmed bookings */}
                    {row.bookingStatus === 'confirmed' && (
                        <button
                            onClick={() => {
                                setPopupMessage({
                                    title: 'Print Ticket',
                                    message: `Ticket for ${row.bookingReference} is being prepared.`,
                                    type: 'success'
                                });
                                setShowSuccessPopup(true);
                            }}
                            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                            title="Print Ticket"
                        >
                            <Printer className="h-4 w-4 text-gray-600" />
                        </button>
                    )}

                    {/* Send Message Button */}
                    <button
                        onClick={() => { setSelectedBooking(row); setShowMessageModal(true); }}
                        className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                        title="Send Message"
                    >
                        <Send className="h-4 w-4 text-purple-600" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                            <Ticket className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bookings</h1>
                            <p className="text-sm text-gray-500">Manage customer bookings - Confirm or Cancel pending bookings</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {[
                        { label: 'Total Bookings', value: stats.total, icon: Ticket, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600' },
                        { label: 'Pending', value: stats.pending, icon: ClockIcon, color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-600' },
                        { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'green', bg: 'bg-green-50', text: 'text-green-600' },
                        { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'red', bg: 'bg-red-50', text: 'text-red-600' },
                        { label: 'Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'purple', bg: 'bg-purple-50', text: 'text-purple-600', isCurrency: true }
                    ].map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">{stat.label}</span>
                                    <div className={`p-2 ${stat.bg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`h-4 w-4 ${stat.text}`} />
                                    </div>
                                </div>
                                <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
                                <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-full transition-all duration-500 group-hover:w-full`} style={{ width: `${Math.min((stat.value / (stats.total || 1)) * 100, 100)}%` }}></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 overflow-x-auto">
                    <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-sm border border-gray-100 inline-flex">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${isActive
                                            ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-md`
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                    <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>
                                        {tab.count}
                                    </span>
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
                            <input
                                type="text"
                                placeholder="Search by reference, customer name, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <ReusableButton onClick={handleExport} icon={Download} variant="secondary" size="sm">
                            Export
                        </ReusableButton>
                    </div>
                </div>

                {/* Bookings Table with Actions Column */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Seats</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{booking.bookingReference}</p>
                                            <p className="text-xs text-gray-500">{formatDate(booking.bookingDate)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{booking.customerName}</p>
                                            <p className="text-xs text-gray-500">{booking.customerEmail}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{booking.eventName}</p>
                                            <p className="text-xs text-gray-500">{booking.eventDate} at {booking.eventTime}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {booking.seats.slice(0, 3).map(seat => (
                                                    <span key={seat} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{seat}</span>
                                                ))}
                                                {booking.seats.length > 3 && <span className="text-xs text-gray-400">+{booking.seats.length - 3}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-emerald-600">{formatCurrency(booking.totalAmount)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(booking.bookingStatus)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 flex-wrap">
                                                {/* View Details Button */}
                                                <button
                                                    onClick={() => { setSelectedBooking(booking); setShowDetailsModal(true); }}
                                                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4 text-blue-600" />
                                                </button>

                                                {/* Confirm Button - Only for pending bookings */}
                                                {booking.bookingStatus === 'pending' && (
                                                    <button
                                                        onClick={() => { setSelectedBooking(booking); setShowConfirmModal(true); }}
                                                        className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                                                        title="Confirm Booking"
                                                    >
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    </button>
                                                )}

                                                {/* Cancel Button - Only for pending bookings */}
                                                {booking.bookingStatus === 'pending' && (
                                                    <button
                                                        onClick={() => { setSelectedBooking(booking); setShowCancelModal(true); }}
                                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                                                        title="Cancel Booking"
                                                    >
                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                    </button>
                                                )}

                                                {/* Print Ticket Button - Only for confirmed bookings */}
                                                {booking.bookingStatus === 'confirmed' && (
                                                    <button
                                                        onClick={() => {
                                                            setPopupMessage({
                                                                title: 'Print Ticket',
                                                                message: `Ticket for ${booking.bookingReference} is being prepared.`,
                                                                type: 'success'
                                                            });
                                                            setShowSuccessPopup(true);
                                                        }}
                                                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                                        title="Print Ticket"
                                                    >
                                                        <Printer className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                )}

                                                {/* Send Message Button */}
                                                <button
                                                    onClick={() => { setSelectedBooking(booking); setShowMessageModal(true); }}
                                                    className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                                                    title="Send Message"
                                                >
                                                    <Send className="h-4 w-4 text-purple-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredBookings.length === 0 && (
                        <div className="text-center py-12">
                            <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No bookings found</p>
                        </div>
                    )}
                </div>

                {/* Booking Details Modal */}
                <AnimatePresence>
                    {showDetailsModal && selectedBooking && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            >
                                <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white">Booking Details</h2>
                                    <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-white/20 rounded-lg"><X className="h-5 w-5 text-white" /></button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex justify-between items-start">
                                            <div><p className="text-xs text-gray-500">Booking Reference</p><p className="font-bold text-gray-900 text-lg">{selectedBooking.bookingReference}</p></div>
                                            {getStatusBadge(selectedBooking.bookingStatus)}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><User className="h-4 w-4" /> Customer</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Name</p><p className="font-medium">{selectedBooking.customerName}</p></div>
                                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Email</p><p className="font-medium">{selectedBooking.customerEmail}</p></div>
                                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{selectedBooking.customerPhone}</p></div>
                                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Booking Date</p><p className="font-medium">{formatDate(selectedBooking.bookingDate)}</p></div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Calendar className="h-4 w-4" /> Event</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Event</p><p className="font-medium">{selectedBooking.eventName}</p></div>
                                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Date & Time</p><p className="font-medium">{selectedBooking.eventDate} at {selectedBooking.eventTime}</p></div>
                                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Hall</p><p className="font-medium">{selectedBooking.hallName}</p></div>
                                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Seats</p><p className="font-medium">{selectedBooking.seats.join(', ')}</p></div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><DollarSign className="h-4 w-4" /> Payment</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Tickets</p><p className="font-medium">{selectedBooking.ticketCount}</p></div>
                                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Total</p><p className="font-bold text-emerald-600">{formatCurrency(selectedBooking.totalAmount)}</p></div>
                                            <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Method</p><div className="flex items-center gap-1 mt-1">{getPaymentMethodIcon(selectedBooking.paymentMethod)}<span>{selectedBooking.paymentMethod}</span></div></div>
                                        </div>
                                    </div>

                                    {selectedBooking.specialRequests && (
                                        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                            <p className="text-xs text-gray-500">Special Requests</p>
                                            <p className="text-sm text-yellow-800 mt-1">{selectedBooking.specialRequests}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Confirm Modal */}
                <AnimatePresence>
                    {showConfirmModal && selectedBooking && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-md p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="h-6 w-6 text-green-600" /></div>
                                    <h3 className="text-xl font-bold text-gray-900">Confirm Booking</h3>
                                </div>
                                <p className="text-gray-600 mb-4">Confirm booking for <strong>{selectedBooking.customerName}</strong>?</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                                    <button onClick={handleConfirmBooking} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg">Confirm</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Cancel Modal */}
                <AnimatePresence>
                    {showCancelModal && selectedBooking && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-md p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 rounded-lg"><XCircle className="h-6 w-6 text-red-600" /></div>
                                    <h3 className="text-xl font-bold text-gray-900">Cancel Booking</h3>
                                </div>
                                <p className="text-gray-600 mb-4">Cancel booking for <strong>{selectedBooking.customerName}</strong>?</p>
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
                                    <button onClick={() => setShowCancelModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Back</button>
                                    <button onClick={handleCancelBooking} disabled={!cancellationReason} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50">Cancel</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Send Message Modal */}
                <AnimatePresence>
                    {showMessageModal && selectedBooking && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-md p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-100 rounded-lg"><Send className="h-6 w-6 text-purple-600" /></div>
                                    <h3 className="text-xl font-bold text-gray-900">Send Message</h3>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={messageSubject}
                                        onChange={(e) => setMessageSubject(e.target.value)}
                                        placeholder="Enter subject..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        rows={4}
                                        placeholder="Type your message..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowMessageModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                                    <button onClick={handleSendMessage} disabled={!messageSubject || !messageContent} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50">Send</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Success Popup */}
                <SuccessPopup isOpen={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} type={popupMessage.type} title={popupMessage.title} message={popupMessage.message} duration={3000} position="top-right" />
            </div>
        </div>
    );
};

export default Bookings;