// src/pages/Owner/Booking/OwnerBookingInfo.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    Search, 
    LayoutGrid, 
    Eye, 
    Ticket,
    Building,
    X,
    Loader2,
    CreditCard,
    Smartphone,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types
interface TicketType {
    seatType: string;
    quantity: number;
    price: number;
}

interface BookingInfoType {
    id: string;
    eventId: string;
    eventName: string;
    eventDate: string;
    hallName: string;
    bookingDate: string;
    totalTickets: number;
    totalAmount: number;
    bookedBy: string;
    bookingSource: 'online' | 'cash';
    ticketTypes: TicketType[];
    ticketAccessLink?: string;
}

// Mock Data - Bookings by Manager (Online) and Salesperson (Cash) for different halls
const mockBookings: BookingInfoType[] = [
    // Manager (Online) Bookings
    {
        id: 'BK-001',
        eventId: 'evt-001',
        eventName: 'Summer Music Festival',
        eventDate: '2024-06-15T18:00:00',
        hallName: 'Grand Hall',
        bookingDate: '2024-05-01T10:00:00',
        totalTickets: 250,
        totalAmount: 12500,
        bookedBy: 'John Manager',
        bookingSource: 'online',
        ticketTypes: [
            { seatType: 'VIP', quantity: 50, price: 150 },
            { seatType: 'Regular', quantity: 200, price: 50 }
        ]
    },
    {
        id: 'BK-002',
        eventId: 'evt-003',
        eventName: 'Rock Concert',
        eventDate: '2024-08-10T20:00:00',
        hallName: 'Grand Hall',
        bookingDate: '2024-04-28T11:00:00',
        totalTickets: 500,
        totalAmount: 30000,
        bookedBy: 'John Manager',
        bookingSource: 'online',
        ticketTypes: [
            { seatType: 'VIP', quantity: 100, price: 200 },
            { seatType: 'Regular', quantity: 400, price: 80 }
        ]
    },
    {
        id: 'BK-003',
        eventId: 'evt-007',
        eventName: 'Theater Play',
        eventDate: '2024-10-01T19:00:00',
        hallName: 'Main Hall',
        bookingDate: '2024-05-15T11:00:00',
        totalTickets: 300,
        totalAmount: 15000,
        bookedBy: 'Lisa Wong',
        bookingSource: 'online',
        ticketTypes: [
            { seatType: 'Standard', quantity: 300, price: 50 }
        ]
    },
    // Salesperson (Cash) Bookings
    {
        id: 'BK-004',
        eventId: 'evt-002',
        eventName: 'Jazz Night',
        eventDate: '2024-07-20T19:00:00',
        hallName: 'Blue Hall',
        bookingDate: '2024-05-05T14:30:00',
        totalTickets: 180,
        totalAmount: 7200,
        bookedBy: 'Sarah Sales',
        bookingSource: 'cash',
        ticketTypes: [
            { seatType: 'VIP', quantity: 30, price: 100 },
            { seatType: 'Regular', quantity: 150, price: 40 }
        ]
    },
    {
        id: 'BK-005',
        eventId: 'evt-005',
        eventName: 'IMAX Special Screening',
        eventDate: '2024-06-01T15:00:00',
        hallName: 'IMAX Hall',
        bookingDate: '2024-05-10T09:15:00',
        totalTickets: 800,
        totalAmount: 48000,
        bookedBy: 'Mike Johnson',
        bookingSource: 'cash',
        ticketTypes: [
            { seatType: 'IMAX Standard', quantity: 650, price: 50 },
            { seatType: 'IMAX VIP', quantity: 150, price: 80 }
        ]
    },
    {
        id: 'BK-006',
        eventId: 'evt-006',
        eventName: 'Comedy Night',
        eventDate: '2024-09-15T20:00:00',
        hallName: 'West Hall',
        bookingDate: '2024-05-12T13:00:00',
        totalTickets: 120,
        totalAmount: 4800,
        bookedBy: 'Sarah Sales',
        bookingSource: 'cash',
        ticketTypes: [
            { seatType: 'VIP', quantity: 20, price: 110 },
            { seatType: 'Regular', quantity: 100, price: 40 }
        ]
    }
];

// Save/Load from localStorage
const saveBookings = (bookings: BookingInfoType[]) => {
    localStorage.setItem(`theater_bookings`, JSON.stringify(bookings));
};

const loadBookings = (): BookingInfoType[] => {
    const stored = localStorage.getItem(`theater_bookings`);
    if (stored) {
        return JSON.parse(stored);
    }
    saveBookings(mockBookings);
    return mockBookings;
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

// View Tickets Modal - No title
const ViewTicketsModal: React.FC<{ booking: BookingInfoType | null; isOpen: boolean; onClose: () => void }> = ({ booking, isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    if (!isOpen || !booking) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const handleDownloadTickets = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert('Tickets downloaded successfully!');
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header without title */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white/80 text-sm">{booking.eventName}</p>
                            <p className="text-xs text-white/60 mt-0.5">{booking.hallName} • {formatDate(booking.eventDate)}</p>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-xl transition">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div><p className="text-xs text-gray-500">Booking ID</p><p className="font-semibold">{booking.id}</p></div>
                            <div><p className="text-xs text-gray-500">Booked By</p><p className="font-semibold">{booking.bookedBy}</p></div>
                            <div><p className="text-xs text-gray-500">Total Tickets</p><p className="font-semibold">{booking.totalTickets}</p></div>
                            <div><p className="text-xs text-gray-500">Total Amount</p><p className="font-semibold text-teal-600">{formatCurrency(booking.totalAmount)}</p></div>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-teal-600" />
                        Ticket Details
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                        {booking.ticketTypes.map((ticket, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-900">{ticket.seatType}</p>
                                        <p className="text-sm text-gray-500">Quantity: {ticket.quantity} tickets</p>
                                        <p className="text-sm text-gray-500">Price: {formatCurrency(ticket.price)} each</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-teal-600">{formatCurrency(ticket.price * ticket.quantity)}</p>
                                        <p className="text-xs text-gray-400">Subtotal</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 text-center border border-teal-200">
                        <div className="inline-block p-4 bg-white rounded-xl shadow-md mb-3">
                            <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center mx-auto">
                                <Ticket className="h-12 w-12 text-teal-400" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-800">Scan QR Code at Venue Entry</p>
                        <p className="text-xs text-gray-500 mt-1">Present this QR code at the {booking.hallName} for entry</p>
                    </div>
                </div>

                <div className="border-t p-5 bg-gray-50 flex justify-end gap-3">
                    <ReusableButton onClick={onClose} variant="secondary">Close</ReusableButton>
                    <ReusableButton onClick={handleDownloadTickets} variant="primary" icon={Ticket} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Download Tickets
                    </ReusableButton>
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
    const [filterSource, setFilterSource] = useState('all');
    const [filterHall, setFilterHall] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [loading, setLoading] = useState(true);
    
    const [showTicketsModal, setShowTicketsModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingInfoType | null>(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    // Get unique halls for filter
    const uniqueHalls = [...new Set(bookings.map(b => b.hallName))];

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
                b.hallName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.bookedBy.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterSource !== 'all') {
            filtered = filtered.filter(b => b.bookingSource === filterSource);
        }
        if (filterHall !== 'all') {
            filtered = filtered.filter(b => b.hallName === filterHall);
        }
        setFilteredBookings(filtered);
        setCurrentPage(1);
    }, [searchTerm, bookings, filterSource, filterHall]);

    // Pagination
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatCurrency = (amount: number) => {
        return `ETB ${amount.toLocaleString()}`;
    };

    // Stats by source
    const stats = {
        totalBookings: bookings.length,
        totalTickets: bookings.reduce((sum, b) => sum + b.totalTickets, 0),
        totalRevenue: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
        onlineBookings: bookings.filter(b => b.bookingSource === 'online').length,
        cashBookings: bookings.filter(b => b.bookingSource === 'cash').length,
        onlineRevenue: bookings.filter(b => b.bookingSource === 'online').reduce((sum, b) => sum + b.totalAmount, 0),
        cashRevenue: bookings.filter(b => b.bookingSource === 'cash').reduce((sum, b) => sum + b.totalAmount, 0),
    };

    const handleViewTickets = (booking: BookingInfoType) => {
        setSelectedBooking(booking);
        setShowTicketsModal(true);
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
                    <p className="text-xs text-gray-500">{new Date(row.eventDate).toLocaleDateString()}</p>
                </div>
            ) 
        },
        { 
            Header: 'Hall', 
            accessor: 'hallName', 
            sortable: true, 
            Cell: (row: BookingInfoType) => (
                <div className="flex items-center gap-2">
                    <Building className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-medium">{row.hallName}</span>
                </div>
            ) 
        },
        { 
            Header: 'Booked By', 
            accessor: 'bookedBy', 
            sortable: true, 
            Cell: (row: BookingInfoType) => (
                <div className="flex items-center gap-2">
                    {row.bookingSource === 'online' ? 
                        <Smartphone className="h-3 w-3 text-teal-600" /> : 
                        <CreditCard className="h-3 w-3 text-orange-600" />
                    }
                    <div>
                        <p className="font-medium text-gray-900">{row.bookedBy}</p>
                        <p className="text-xs text-gray-500">{row.bookingSource === 'online' ? 'Manager' : 'Salesperson'}</p>
                    </div>
                </div>
            ) 
        },
        { 
            Header: 'Tickets', 
            accessor: 'totalTickets', 
            sortable: true, 
            Cell: (row: BookingInfoType) => (
                <span className="font-semibold">{row.totalTickets.toLocaleString()}</span>
            ) 
        },
        { 
            Header: 'Amount', 
            accessor: 'totalAmount', 
            sortable: true, 
            Cell: (row: BookingInfoType) => (
                <span className="text-green-600 font-semibold">{formatCurrency(row.totalAmount)}</span>
            ) 
        },
        { 
            Header: '', 
            accessor: 'actions', 
            sortable: false,
            width: '60px',
            Cell: (row: BookingInfoType) => (
                <button 
                    onClick={() => handleViewTickets(row)} 
                    className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition"
                    title="View Tickets"
                >
                    <Eye className="h-4 w-4 text-teal-600" />
                </button>
            ) 
        }
    ];

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header - No Schedule Button */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                        <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Theater Bookings</h1>
                        <p className="text-sm text-gray-500">Bookings by Manager (Online) and Salesperson (Cash) per hall</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Total Booking events" value={stats.totalBookings} icon={Calendar} color="from-teal-500 to-teal-600" delay={0.1} />
                    <StatCard title="Total Tickets" value={stats.totalTickets.toLocaleString()} icon={Ticket} color="from-purple-500 to-pink-600" delay={0.15} />
                    <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={Building} color="from-emerald-500 to-green-600" delay={0.2} />
                    <StatCard title="Active Halls" value={uniqueHalls.length} icon={LayoutGrid} color="from-blue-500 to-cyan-600" delay={0.25} />
                </div>

                {/* Revenue Stats - Manager vs Salesperson */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-blue-600">Manager (Online) Revenue</p>
                                <p className="text-2xl font-bold text-blue-700">{formatCurrency(stats.onlineRevenue)}</p>
                                <p className="text-xs text-blue-500 mt-1">{stats.onlineBookings} online bookings</p>
                            </div>
                            <Smartphone className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-orange-600">Salesperson (Cash) Revenue</p>
                                <p className="text-2xl font-bold text-orange-700">{formatCurrency(stats.cashRevenue)}</p>
                                <p className="text-xs text-orange-500 mt-1">{stats.cashBookings} cash bookings</p>
                            </div>
                            <CreditCard className="h-8 w-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="relative min-w-[250px] flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by event, hall or staff..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white"
                        />
                    </div>
                    <select 
                        value={filterSource} 
                        onChange={(e) => setFilterSource(e.target.value)} 
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[160px]"
                    >
                        <option value="all">All Sources</option>
                        <option value="online">Manager (Online)</option>
                        <option value="cash">Salesperson (Cash)</option>
                    </select>
                    <select 
                        value={filterHall} 
                        onChange={(e) => setFilterHall(e.target.value)} 
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white min-w-[160px]"
                    >
                        <option value="all">All Halls</option>
                        {uniqueHalls.map(hall => (
                            <option key={hall} value={hall}>{hall}</option>
                        ))}
                    </select>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            {col.Header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{booking.id}</p>
                                                <p className="text-xs text-gray-500">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{booking.eventName}</p>
                                                <p className="text-xs text-gray-500">{new Date(booking.eventDate).toLocaleDateString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Building className="h-3 w-3 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-700">{booking.hallName}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                {booking.bookingSource === 'online' ? 
                                                    <Smartphone className="h-3 w-3 text-teal-600" /> : 
                                                    <CreditCard className="h-3 w-3 text-orange-600" />
                                                }
                                                <div>
                                                    <p className="font-medium text-gray-900">{booking.bookedBy}</p>
                                                    <p className="text-xs text-gray-500">{booking.bookingSource === 'online' ? 'Manager' : 'Salesperson'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-gray-900">{booking.totalTickets.toLocaleString()}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-green-600 font-semibold">{formatCurrency(booking.totalAmount)}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button 
                                                onClick={() => handleViewTickets(booking)} 
                                                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition"
                                                title="View Tickets"
                                            >
                                                <Eye className="h-4 w-4 text-teal-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* View Tickets Modal */}
                <ViewTicketsModal 
                    booking={selectedBooking} 
                    isOpen={showTicketsModal} 
                    onClose={() => { setShowTicketsModal(false); setSelectedBooking(null); }} 
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
        </div>
    );
};

export default OwnerBookingInfo;