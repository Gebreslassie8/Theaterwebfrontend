// src/pages/Owner/Booking/OwnerBookingInfo.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    LayoutGrid, 
    Eye, 
    Ticket,
    Building,
    X,
    CreditCard,
    TrendingUp,
    Filter
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';

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

// Mock Data
const mockBookings: BookingInfoType[] = [
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
    },
    {
        id: 'BK-007',
        eventId: 'evt-008',
        eventName: 'New Year Concert',
        eventDate: '2025-01-01T20:00:00',
        hallName: 'Grand Hall',
        bookingDate: '2024-12-20T10:00:00',
        totalTickets: 450,
        totalAmount: 35000,
        bookedBy: 'John Manager',
        bookingSource: 'online',
        ticketTypes: [
            { seatType: 'VIP', quantity: 100, price: 150 },
            { seatType: 'Regular', quantity: 350, price: 80 }
        ]
    },
    {
        id: 'BK-008',
        eventId: 'evt-009',
        eventName: 'Spring Festival',
        eventDate: '2025-03-15T18:00:00',
        hallName: 'Main Hall',
        bookingDate: '2025-02-10T14:00:00',
        totalTickets: 600,
        totalAmount: 42000,
        bookedBy: 'Lisa Wong',
        bookingSource: 'online',
        ticketTypes: [
            { seatType: 'VIP', quantity: 150, price: 120 },
            { seatType: 'Regular', quantity: 450, price: 60 }
        ]
    }
];

// Helper functions
const formatDateSafe = (dateStr: string | undefined): string => {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'Invalid date';
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch {
        return 'Invalid date';
    }
};

const formatETB = (amount: number | undefined): string => {
    if (amount === undefined || amount === null || isNaN(amount)) return 'ETB 0';
    return `ETB ${amount.toLocaleString()}`;
};

const formatNumber = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) return '0';
    return value.toLocaleString();
};

// Stat Card Component
const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ElementType; 
    color: string; 
    delay: number 
}> = ({ title, value, icon: Icon, color, delay }) => {
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

// View Details Modal
const ViewDetailsModal: React.FC<{ 
    booking: BookingInfoType | null; 
    isOpen: boolean; 
    onClose: () => void 
}> = ({ booking, isOpen, onClose }) => {
    if (!isOpen || !booking) return null;

    const formatTicketCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'ETB', 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0 
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            >
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white/80 text-sm">{booking.eventName}</p>
                            <p className="text-xs text-white/60 mt-0.5">{booking.hallName} • {formatDateSafe(booking.eventDate)}</p>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-xl transition">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Booking ID</p>
                                <p className="font-semibold">{booking.id || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Booked By</p>
                                <p className="font-semibold">{booking.bookedBy || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total Tickets</p>
                                <p className="font-semibold">{formatNumber(booking.totalTickets)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total Amount</p>
                                <p className="font-semibold text-teal-600">{formatTicketCurrency(booking.totalAmount)}</p>
                            </div>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-teal-600" />
                        Ticket Details
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                        {booking.ticketTypes?.map((ticket, idx) => (
                            <div key={`${booking.id}-ticket-${idx}`} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-900">{ticket.seatType || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">Quantity: {formatNumber(ticket.quantity)} tickets</p>
                                        <p className="text-sm text-gray-500">Price: {formatTicketCurrency(ticket.price)} each</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-teal-600">{formatTicketCurrency((ticket.price || 0) * (ticket.quantity || 0))}</p>
                                        <p className="text-xs text-gray-400">Subtotal</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-5 text-center border border-teal-200">
                        <div className="inline-block p-3 bg-white rounded-xl shadow-md mb-2">
                            <Calendar className="h-8 w-8 text-teal-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-800">Event Date: {formatDateSafe(booking.eventDate)}</p>
                        <p className="text-xs text-gray-500 mt-1">Booking Date: {formatDateSafe(booking.bookingDate)}</p>
                    </div>
                </div>

                <div className="border-t p-5 bg-gray-50 flex justify-end">
                    <ReusableButton onClick={onClose} variant="secondary">Close</ReusableButton>
                </div>
            </motion.div>
        </div>
    );
};

// Main Component
const OwnerBookingInfo: React.FC = () => {
    const [bookings, setBookings] = useState<BookingInfoType[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingInfoType[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterHall, setFilterHall] = useState('all');
    const [dateRange, setDateRange] = useState<'daily' | 'monthly' | 'yearly' | 'custom'>('monthly');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingInfoType | null>(null);

    // Get unique halls for filter
    const uniqueHalls = [...new Map(bookings.map(b => [b.hallName, b.hallName])).values()];

    // Filter by date range
    const filterByDateRange = (bookingsList: BookingInfoType[]) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return bookingsList.filter(booking => {
            const bookingDate = new Date(booking.eventDate);
            
            switch (dateRange) {
                case 'daily':
                    const bookingDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
                    return bookingDay.getTime() === today.getTime();
                case 'monthly':
                    return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
                case 'yearly':
                    return bookingDate.getFullYear() === currentYear;
                case 'custom':
                    if (customStartDate && customEndDate) {
                        const start = new Date(customStartDate);
                        const end = new Date(customEndDate);
                        end.setHours(23, 59, 59);
                        return bookingDate >= start && bookingDate <= end;
                    }
                    return true;
                default:
                    return true;
            }
        });
    };

    // Apply search, hall filter, and date range filter
    useEffect(() => {
        let filtered = [...bookings];
        
        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(booking => 
                booking.id.toLowerCase().includes(query) ||
                booking.eventName.toLowerCase().includes(query) ||
                booking.hallName.toLowerCase().includes(query) ||
                booking.bookedBy.toLowerCase().includes(query)
            );
        }
        
        // Hall filter
        if (filterHall !== 'all') {
            filtered = filtered.filter(b => b.hallName === filterHall);
        }
        
        // Date range filter
        filtered = filterByDateRange(filtered);
        
        setFilteredBookings(filtered);
    }, [bookings, searchQuery, filterHall, dateRange, customStartDate, customEndDate]);

    // Load initial data
    useEffect(() => {
        const stored = localStorage.getItem('theater_bookings');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setBookings(parsed);
                setFilteredBookings(parsed);
            } catch (e) {
                console.error('Failed to parse stored bookings', e);
                setBookings(mockBookings);
                setFilteredBookings(mockBookings);
            }
        } else {
            localStorage.setItem('theater_bookings', JSON.stringify(mockBookings));
            setBookings(mockBookings);
            setFilteredBookings(mockBookings);
        }
        setLoading(false);
    }, []);

    // Stats calculations based on filtered bookings
    const stats = {
        totalBookings: filteredBookings.length,
        totalTickets: filteredBookings.reduce((sum, b) => sum + (b.totalTickets || 0), 0),
        totalRevenue: filteredBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        onlineBookings: filteredBookings.filter(b => b.bookingSource === 'online').length,
        cashBookings: filteredBookings.filter(b => b.bookingSource === 'cash').length,
        onlineRevenue: filteredBookings.filter(b => b.bookingSource === 'online').reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        cashRevenue: filteredBookings.filter(b => b.bookingSource === 'cash').reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    };

    const handleViewDetails = (booking: BookingInfoType) => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
    };

    const handleExport = () => {
        const headers = ['Booking ID', 'Event Name', 'Event Date', 'Hall', 'Booked By', 'Source', 'Total Tickets', 'Total Amount'];
        const csvData = filteredBookings.map(b => [
            b.id,
            b.eventName,
            formatDateSafe(b.eventDate),
            b.hallName,
            b.bookedBy,
            b.bookingSource,
            b.totalTickets,
            b.totalAmount
        ]);
        
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Bookings Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #0f766e; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .summary { margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #0f766e; color: white; }
                        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Theatre Hub - Bookings Report</h1>
                        <p>Generated on: ${new Date().toLocaleString()}</p>
                    </div>
                    <div class="summary">
                        <h3>Summary</h3>
                        <p><strong>Total Bookings:</strong> ${stats.totalBookings}</p>
                        <p><strong>Total Tickets Sold:</strong> ${stats.totalTickets}</p>
                        <p><strong>Total Revenue:</strong> ${formatETB(stats.totalRevenue)}</p>
                        <p><strong>Online Revenue:</strong> ${formatETB(stats.onlineRevenue)} (${stats.onlineBookings} bookings)</p>
                        <p><strong>Cash Revenue:</strong> ${formatETB(stats.cashRevenue)} (${stats.cashBookings} bookings)</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Event</th>
                                <th>Event Date</th>
                                <th>Hall</th>
                                <th>Booked By</th>
                                <th>Source</th>
                                <th>Tickets</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredBookings.map(b => `
                                <tr>
                                    <td>${b.id}</td>
                                    <td>${b.eventName}</td>
                                    <td>${formatDateSafe(b.eventDate)}</td>
                                    <td>${b.hallName}</td>
                                    <td>${b.bookedBy}</td>
                                    <td>${b.bookingSource === 'online' ? 'Online' : 'Cash'}</td>
                                    <td>${b.totalTickets}</td>
                                    <td>${formatETB(b.totalAmount)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="footer">
                        <p>This is a system-generated report. Please retain for your records.</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    // Table data for ReusableTable
    const tableData = filteredBookings.map(booking => ({
        id: booking.id,
        eventName: (
            <div>
                <p className="font-medium text-gray-900">{booking.eventName}</p>
                <p className="text-xs text-gray-500">{formatDateSafe(booking.eventDate)}</p>
            </div>
        ),
        hallName: (
            <div className="flex items-center gap-2">
                <Building className="h-3 w-3 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{booking.hallName}</span>
            </div>
        ),
        bookedBy: (
            <div className="flex items-center gap-2">
                {booking.bookingSource === 'online' ? 
                    <CreditCard className="h-3 w-3 text-teal-600" /> : 
                    <CreditCard className="h-3 w-3 text-orange-600" />
                }
                <div>
                    <p className="font-medium text-gray-900">{booking.bookedBy}</p>
                    <p className="text-xs text-gray-500">{booking.bookingSource === 'online' ? 'Online' : 'Cash'}</p>
                </div>
            </div>
        ),
        totalTickets: (
            <span className="font-semibold text-gray-900">{formatNumber(booking.totalTickets)}</span>
        ),
        totalAmount: (
            <span className="text-green-600 font-semibold">{formatETB(booking.totalAmount)}</span>
        ),
        bookingDate: formatDateSafe(booking.bookingDate),
        actions: (
            <button 
                onClick={() => handleViewDetails(booking)} 
                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition"
                title="View Details"
            >
                <Eye className="h-4 w-4 text-teal-600" />
            </button>
        ),
    }));

    const tableColumns = [
        { Header: 'Booking ID', accessor: 'id', sortable: true },
        { Header: 'Event', accessor: 'eventName', sortable: true },
        { Header: 'Hall', accessor: 'hallName', sortable: true },
        { Header: 'Booked By', accessor: 'bookedBy', sortable: true },
        { Header: 'Tickets', accessor: 'totalTickets', sortable: true },
        { Header: 'Amount (ETB)', accessor: 'totalAmount', sortable: true },
        { Header: '', accessor: 'actions', sortable: false },
    ];

    // Handle search from ReusableTable
    const handleTableSearch = (query: string) => {
        setSearchQuery(query);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                            <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Theater Bookings</h1>
                            <p className="text-sm text-gray-500">Manage and track all booking records</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Total Bookings" value={stats.totalBookings} icon={Calendar} color="from-teal-500 to-teal-600" delay={0.1} />
                    <StatCard title="Total Tickets" value={formatNumber(stats.totalTickets)} icon={Ticket} color="from-purple-500 to-pink-600" delay={0.15} />
                    <StatCard title="Total Revenue" value={formatETB(stats.totalRevenue)} icon={TrendingUp} color="from-emerald-500 to-green-600" delay={0.2} />
                    <StatCard title="Active Halls" value={uniqueHalls.length} icon={LayoutGrid} color="from-blue-500 to-cyan-600" delay={0.25} />
                </div>

                {/* Revenue Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-teal-600">Online Payments</p>
                                <p className="text-2xl font-bold text-teal-700">{formatETB(stats.onlineRevenue)}</p>
                                <p className="text-xs text-teal-500 mt-1">{stats.onlineBookings} bookings</p>
                            </div>
                            <CreditCard className="h-8 w-8 text-teal-500" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-orange-600">Cash Payments</p>
                                <p className="text-2xl font-bold text-orange-700">{formatETB(stats.cashRevenue)}</p>
                                <p className="text-xs text-orange-500 mt-1">{stats.cashBookings} bookings</p>
                            </div>
                            <CreditCard className="h-8 w-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Hall Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <select 
                                value={filterHall} 
                                onChange={(e) => setFilterHall(e.target.value)} 
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white min-w-[150px]"
                            >
                                <option value="all">All Halls</option>
                                {uniqueHalls.map((hall) => (
                                    <option key={hall} value={hall}>{hall}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range Tabs */}
                        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                            {[
                                { value: 'daily', label: 'Daily' },
                                { value: 'monthly', label: 'Monthly' },
                                { value: 'yearly', label: 'Yearly' },
                                { value: 'custom', label: 'Custom' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setDateRange(option.value as any)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                                        dateRange === option.value
                                            ? 'bg-white text-teal-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {/* Custom Date Range Picker */}
                        {dateRange === 'custom' && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                                <span className="text-gray-400">to</span>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Bookings Table */}
                <ReusableTable
                    columns={tableColumns}
                    data={tableData}
                    title="Bookings List"
                    icon={Ticket}
                    showSearch={true}
                    showExport={true}
                    showPrint={true}
                    onSearch={handleTableSearch}
                    onExport={handleExport}
                    onPrint={handlePrint}
                    itemsPerPage={10}
                    itemsPerPageOptions={[10, 25, 50, 100]}
                />

                {/* View Details Modal */}
                <ViewDetailsModal 
                    booking={selectedBooking} 
                    isOpen={showDetailsModal} 
                    onClose={() => { 
                        setShowDetailsModal(false); 
                        setSelectedBooking(null); 
                    }} 
                />
            </div>
        </div>
    );
};

export default OwnerBookingInfo;