// src/pages/Owner/events/EventSchedule.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Building,
    DollarSign,
    Clock,
    Ticket,
    Calendar,
    MapPin,
    Activity,
    ArrowRight,
    TrendingUp,
    Users,
    Star,
    Eye,
    Edit,
    Crown,
    CheckCircle,
    RotateCcw,
    Film,
    Download,
    RefreshCw,
    Filter,
    UserCheck,
    Percent,
    Wallet,
    Banknote,
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    AlertCircle,
    Plus,
    Trash2,
    XCircle,
    LayoutGrid
} from 'lucide-react';
import {
    PieChart as RePieChart, Pie,
    Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// Types
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    delay: number;
    link?: string;
    notification?: boolean;
    notificationCount?: number;
}

interface TimeSlot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
}

interface SeatCategory {
    id: string;
    name: string;
    price: number;
    capacity: number;
    booked?: number;
    commissionPercent: number;
}

interface Show {
    id: string;
    name: string;
    description?: string;
    timeSlots: TimeSlot[];
    hall: string;
    seatCategories: SeatCategory[];
    category: string;
    ageRestriction: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    organizer: string;
    imageUrl?: string;
    sales: number;
    capacity: number;
    revenue: number;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'selling' | 'almost full' | 'sold out';
}

// Mock Data
const hallData = [
    { name: 'Hall A', occupancy: 85, capacity: 200, color: '#14b8a6' },
    { name: 'Hall B', occupancy: 92, capacity: 150, color: '#f59e0b' },
    { name: 'Hall C', occupancy: 68, capacity: 180, color: '#3b82f6' },
    { name: 'Hall D', occupancy: 45, capacity: 120, color: '#ef4444' },
    { name: 'Hall E', occupancy: 78, capacity: 160, color: '#8b5cf6' },
];

const mockShows: Show[] = [
    {
        id: '1',
        name: 'The Lion King',
        description: 'Experience the magic of Disney\'s The Lion King on stage.',
        timeSlots: [{ id: 'ts1', date: '2024-05-15', startTime: '19:00', endTime: '21:30' }],
        hall: 'Grand Hall',
        seatCategories: [
            { id: 'sc1', name: 'VIP', price: 1250, capacity: 50, commissionPercent: 10 },
            { id: 'sc2', name: 'Premium', price: 900, capacity: 100, commissionPercent: 10 },
            { id: 'sc3', name: 'Regular', price: 500, capacity: 150, commissionPercent: 10 }
        ],
        category: 'theater',
        ageRestriction: 'All Ages',
        contactEmail: 'events@theaterhub.com',
        contactPhone: '+251 911 234 567',
        website: 'https://theaterhub.com',
        organizer: 'Disney Theatrical',
        sales: 89,
        capacity: 300,
        revenue: 4005,
        status: 'selling'
    },
    {
        id: '2',
        name: 'Hamilton',
        description: 'The story of America then, told by America now.',
        timeSlots: [{ id: 'ts2', date: '2024-05-20', startTime: '20:00', endTime: '22:30' }],
        hall: 'Main Hall',
        seatCategories: [
            { id: 'sc4', name: 'VIP', price: 1500, capacity: 40, commissionPercent: 10 },
            { id: 'sc5', name: 'Premium', price: 1000, capacity: 80, commissionPercent: 10 },
            { id: 'sc6', name: 'Regular', price: 600, capacity: 120, commissionPercent: 10 }
        ],
        category: 'theater',
        ageRestriction: '12+',
        contactEmail: 'events@theaterhub.com',
        contactPhone: '+251 911 234 567',
        website: 'https://theaterhub.com',
        organizer: 'Lin-Manuel Miranda',
        sales: 95,
        capacity: 240,
        revenue: 6175,
        status: 'almost full'
    },
    {
        id: '3',
        name: 'Wicked',
        description: 'The untold story of the witches of Oz.',
        timeSlots: [{ id: 'ts3', date: '2024-05-25', startTime: '18:30', endTime: '21:00' }],
        hall: 'West Hall',
        seatCategories: [
            { id: 'sc7', name: 'VIP', price: 1100, capacity: 30, commissionPercent: 10 },
            { id: 'sc8', name: 'Premium', price: 800, capacity: 70, commissionPercent: 10 },
            { id: 'sc9', name: 'Regular', price: 400, capacity: 100, commissionPercent: 10 }
        ],
        category: 'theater',
        ageRestriction: 'All Ages',
        contactEmail: 'events@theaterhub.com',
        contactPhone: '+251 911 234 567',
        website: 'https://theaterhub.com',
        organizer: 'Universal Theatrical',
        sales: 110,
        capacity: 200,
        revenue: 6050,
        status: 'sold out'
    },
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
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    }
};

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, notification, notificationCount }) => {
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
            <Link to={link || '#'} className="block">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500">{title}</p>
                            {notification && notificationCount && notificationCount > 0 && (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold animate-pulse bg-teal-500 text-white rounded-full">
                                    {notificationCount}
                                </span>
                            )}
                        </div>
                        <p className="text-xl font-bold text-gray-900">{value}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                </div>
            </Link>
        </motion.div>
    );
};

// Day Card Component
interface DayCardProps {
    day: string;
    events: number;
    isActive?: boolean;
    onClick?: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, events, isActive, onClick }) => (
    <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
            isActive 
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
    >
        <span className="text-sm font-medium">{day.substring(0, 3)}</span>
        <span className={`text-xl font-bold mt-1 ${isActive ? 'text-white' : 'text-teal-600'}`}>{events}</span>
        <span className="text-xs opacity-75">events</span>
    </motion.button>
);

// Event Item Component
interface EventItemProps {
    event: Show;
    onView?: (event: Show) => void;
    onEdit?: (event: Show) => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onView, onEdit }) => {
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'selling': return 'bg-green-100 text-green-700';
            case 'almost full': return 'bg-yellow-100 text-yellow-700';
            case 'sold out': return 'bg-red-100 text-red-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch(status) {
            case 'selling': return 'Selling';
            case 'almost full': return 'Almost Full';
            case 'sold out': return 'Sold Out';
            default: return status || 'Upcoming';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
            onClick={() => onView?.(event)}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {event.timeSlots?.[0]?.date || 'TBD'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.timeSlots?.[0]?.startTime || 'TBD'}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.hall}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-1.5">
                                <div 
                                    className="bg-teal-500 h-1.5 rounded-full" 
                                    style={{ width: `${((event.sales || 0) / (event.capacity || 1)) * 100}%` }} 
                                />
                            </div>
                            <span className="text-xs text-gray-600">{event.sales || 0}/{event.capacity || 0}</span>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {getStatusLabel(event.status)}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">{formatCurrency(event.revenue || 0)}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onView?.(event); }}
                            className="text-teal-600 hover:text-teal-700 text-xs font-medium flex items-center gap-1"
                        >
                            View <ArrowRight className="h-3 w-3" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit?.(event); }}
                            className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                        >
                            Edit <Edit className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Event Details Modal
interface EventDetailsModalProps {
    event: Show | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (event: Show) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, isOpen, onClose, onEdit }) => {
    if (!isOpen || !event) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white sticky top-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">{event.name}</h2>
                            <p className="text-white/80 text-sm mt-1">{event.hall}</p>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
                            <XCircle className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Organizer</p>
                            <p className="font-semibold">{event.organizer}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Category</p>
                            <p className="font-semibold capitalize">{event.category || 'General'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Age Restriction</p>
                            <p className="font-semibold">{event.ageRestriction || 'All Ages'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Status</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                event.status === 'selling' ? 'bg-green-100 text-green-700' :
                                event.status === 'almost full' ? 'bg-yellow-100 text-yellow-700' :
                                event.status === 'sold out' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                                {typeof event.status === 'string' ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Upcoming'}
                            </span>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-teal-500" />
                            Schedule
                        </h3>
                        <div className="space-y-2">
                            {event.timeSlots?.map((slot, idx) => (
                                <div key={slot.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium">{slot.date}</p>
                                        <p className="text-xs text-gray-500">{slot.startTime} - {slot.endTime}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">Slot {idx + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seat Categories */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Ticket className="h-4 w-4 text-teal-500" />
                            Seat Categories & Pricing
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-2 text-left">Type</th>
                                        <th className="p-2 text-left">Price</th>
                                        <th className="p-2 text-left">Capacity</th>
                                        <th className="p-2 text-left">Commission</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {event.seatCategories?.map((cat) => (
                                        <tr key={cat.id} className="border-t">
                                            <td className="p-2">{cat.name}</td>
                                            <td className="p-2">{formatCurrency(cat.price)}</td>
                                            <td className="p-2">{cat.capacity}</td>
                                            <td className="p-2">{cat.commissionPercent}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Contact Info */}
                    {(event.contactEmail || event.contactPhone) && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Mail className="h-4 w-4 text-teal-500" />
                                Contact Information
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                                {event.contactEmail && <p className="text-sm">📧 {event.contactEmail}</p>}
                                {event.contactPhone && <p className="text-sm">📞 {event.contactPhone}</p>}
                                {event.website && <p className="text-sm">🌐 {event.website}</p>}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {event.description && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{event.description}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                            Close
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                onEdit?.(event);
                            }}
                            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Event
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Delete Confirmation Modal
interface DeleteConfirmModalProps {
    event: Show | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ event, isOpen, onClose, onConfirm }) => {
    if (!isOpen || !event) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-md w-full p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Delete Event</h3>
                </div>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "<strong>{event.name}</strong>"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        Delete Event
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// Main Component
const EventSchedule: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Show[]>(mockShows);
    const [selectedDay, setSelectedDay] = useState<string>('Saturday');
    const [selectedEvent, setSelectedEvent] = useState<Show | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get events per day
    const getEventsPerDay = (day: string) => {
        return events.filter(event => {
            if (!event.timeSlots?.length) return false;
            const eventDate = new Date(event.timeSlots[0].date);
            const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
            return dayName === day;
        }).length;
    };

    const dailyData = [
        { day: 'Monday', events: getEventsPerDay('Monday') },
        { day: 'Tuesday', events: getEventsPerDay('Tuesday') },
        { day: 'Wednesday', events: getEventsPerDay('Wednesday') },
        { day: 'Thursday', events: getEventsPerDay('Thursday') },
        { day: 'Friday', events: getEventsPerDay('Friday') },
        { day: 'Saturday', events: getEventsPerDay('Saturday') },
        { day: 'Sunday', events: getEventsPerDay('Sunday') },
    ];

    const eventsForSelectedDay = events.filter(event => {
        if (!event.timeSlots?.length) return false;
        const eventDate = new Date(event.timeSlots[0].date);
        const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
        return dayName === selectedDay;
    });

    const totalPages = Math.ceil(eventsForSelectedDay.length / itemsPerPage);
    const paginatedEvents = eventsForSelectedDay.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDayClick = (day: string) => {
        setSelectedDay(day);
        setCurrentPage(1);
    };

    const handleViewEvent = (event: Show) => {
        setSelectedEvent(event);
        setShowDetailsModal(true);
    };

    const handleEditEvent = (event: Show) => {
        navigate(`/owner/events/edit/${event.id}`);
    };

    const handleDeleteEvent = () => {
        if (selectedEvent) {
            setEvents(events.filter(e => e.id !== selectedEvent.id));
            setShowDeleteModal(false);
            setShowDetailsModal(false);
            setPopupMessage({
                title: 'Event Deleted!',
                message: `${selectedEvent.name} has been deleted successfully.`,
                type: 'success'
            });
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 3000);
        }
    };

    const handleCreateEvent = () => {
        navigate('/owner/events/create');
    };

    const handleExportData = () => {
        const headers = ['Event Name', 'Date', 'Hall', 'Organizer', 'Category', 'Tickets Sold', 'Capacity', 'Revenue', 'Status'];
        const rows = events.map(event => [
            `"${event.name}"`,
            event.timeSlots?.[0]?.date || '',
            event.hall,
            event.organizer,
            event.category || '',
            event.sales || 0,
            event.capacity || 0,
            event.revenue || 0,
            event.status
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `events_report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        
        setPopupMessage({
            title: 'Export Successful!',
            message: 'Events report has been exported to CSV successfully.',
            type: 'success'
        });
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
    };

    // Stats
    const stats = {
        totalEvents: events.length,
        upcomingEvents: events.filter(e => e.status === 'upcoming').length,
        totalRevenue: events.reduce((sum, e) => sum + (e.revenue || 0), 0),
        totalTicketsSold: events.reduce((sum, e) => sum + (e.sales || 0), 0),
        activeShows: events.filter(e => e.status === 'selling' || e.status === 'almost full').length,
    };

    const dashboardCards = [
        { title: "Total Events", value: stats.totalEvents, icon: Calendar, color: "from-teal-500 to-emerald-600", delay: 0.1, link: "/owner/events" },
        { title: "Upcoming", value: stats.upcomingEvents, icon: TrendingUp, color: "from-blue-500 to-cyan-600", delay: 0.15, notification: true, notificationCount: stats.upcomingEvents },
        { title: "Active Shows", value: stats.activeShows, icon: Activity, color: "from-green-500 to-emerald-600", delay: 0.2, notification: true, notificationCount: stats.activeShows },
        { title: "Tickets Sold", value: stats.totalTicketsSold.toLocaleString(), icon: Ticket, color: "from-purple-500 to-pink-600", delay: 0.25 },
        { title: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: "from-orange-500 to-red-600", delay: 0.3 },
        { title: "Create Event", value: "+", icon: Plus, color: "from-teal-500 to-emerald-600", delay: 0.35, onClick: handleCreateEvent }
    ];

    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-8 p-6 bg-gray-50 min-h-screen"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Event Schedule</h1>
                                    <p className="text-sm text-gray-500">Manage and track all events across your theaters</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <ReusableButton 
                                    onClick={handleExportData} 
                                    icon={Download} 
                                    label="Export Report" 
                                    variant="secondary" 
                                    size="sm"
                                />
                                <ReusableButton 
                                    onClick={handleCreateEvent} 
                                    icon={Plus} 
                                    label="Create Event" 
                                    className="bg-teal-600 hover:bg-teal-700"
                                    size="sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
                        {dashboardCards.map((card, index) => (
                            <StatCard
                                key={index}
                                title={card.title}
                                value={card.value}
                                icon={card.icon}
                                color={card.color}
                                delay={card.delay}
                                link={card.link}
                                notification={card.notification}
                                notificationCount={card.notificationCount}
                            />
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Weekly Events Calendar */}
                        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Weekly Events Calendar</h3>
                                    <p className="text-sm text-gray-500">Events scheduled for this week</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-teal-500" />
                                    <span className="text-sm text-gray-600">Week of {new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            {/* Day Cards */}
                            <div className="grid grid-cols-7 gap-2 mb-6">
                                {dailyData.map((day) => (
                                    <DayCard
                                        key={day.day}
                                        day={day.day}
                                        events={day.events}
                                        isActive={selectedDay === day.day}
                                        onClick={() => handleDayClick(day.day)}
                                    />
                                ))}
                            </div>

                            {/* Events List for Selected Day */}
                            <div className="space-y-3 min-h-[300px]">
                                {paginatedEvents.length > 0 ? (
                                    <>
                                        {paginatedEvents.map((event) => (
                                            <EventItem 
                                                key={event.id} 
                                                event={event} 
                                                onView={handleViewEvent}
                                                onEdit={handleEditEvent}
                                            />
                                        ))}
                                        
                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex justify-center items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </button>
                                                <div className="flex gap-1">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                                                                currentPage === page
                                                                    ? 'bg-teal-600 text-white shadow-md'
                                                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No events scheduled for {selectedDay}</p>
                                        <button 
                                            onClick={handleCreateEvent}
                                            className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 mx-auto"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Create Event
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Hall Occupancy */}
                        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Hall Occupancy</h3>
                                <Link to="/owner/halls" className="text-sm text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1">
                                    Manage Halls <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <RePieChart>
                                    <Pie
                                        data={hallData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="occupancy"
                                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {hallData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => `${value}% occupancy`} />
                                </RePieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {hallData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-sm text-gray-600">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{item.occupancy}%</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Event Details Modal */}
            <EventDetailsModal
                event={selectedEvent}
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                onEdit={handleEditEvent}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                event={selectedEvent}
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteEvent}
            />

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

export default EventSchedule;