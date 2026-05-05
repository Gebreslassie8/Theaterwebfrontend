// src/components/EventForm/Schedule/EventSchedule.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Calendar, 
    Plus, 
    Eye, 
    Edit, 
    Clock, 
    MapPin,
    XCircle,
    Ticket,
    DollarSign,
    AlertCircle,
    Ban,
    LayoutGrid,
    Trash2,
    Search
} from 'lucide-react';
import ReusableButton from '../../Reusable/ReusableButton';
import ReusableTable from '../../Reusable/ReusableTable';
import SuccessPopup from '../../Reusable/SuccessPopup';
import ReusableshowFilterforall from '../../Reusable/EventScheduleFilter';
import { DeleteConfirmModal } from '../../EventForm/DeleteConfirmModal';
import { Show } from './types';
import ViewEventDetailsModal from './ViewEventSchedule';
import CancelReasonModal from './CancelReasonSchedule';
import AddSchedule from './AddSchedule';
import UpdateSchedule from './UpdateSchedule';

// Mock Data
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

// Get unique years from events
const getAvailableYears = (events: Show[]) => {
    const years = events.map(event => {
        if (event.timeSlots && event.timeSlots.length > 0) {
            return new Date(event.timeSlots[0].date).getFullYear().toString();
        }
        return null;
    }).filter(year => year !== null);
    return ['all', ...Array.from(new Set(years))];
};

// Months list
const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Main Component
const EventSchedule: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Show[]>(mockShows);
    const [filteredEvents, setFilteredEvents] = useState<Show[]>(mockShows);
    const [selectedEvent, setSelectedEvent] = useState<Show | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' as any });
    const [eventToEdit, setEventToEdit] = useState<Show | null>(null);
    const [eventToDelete, setEventToDelete] = useState<Show | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter states
    const [filterValues, setFilterValues] = useState({
        useDateRange: false,
        startDate: '',
        endDate: '',
        selectedYear: 'all',
        selectedMonth: 'all',
        selectedDay: 'all',
        selectedSalesperson: 'all',
        selectedStatus: 'all'
    });

    const availableYears = getAvailableYears(events);
    const salespersonOptions = ['all', ...Array.from(new Set(events.map(e => e.organizer)))];
    const statusOptions = ['all', 'selling', 'almost full', 'sold out', 'upcoming', 'cancelled'];

    // Filter events based on selected filters and search term
    useEffect(() => {
        let filtered = [...events];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(event => 
                event.name.toLowerCase().includes(term) ||
                event.organizer.toLowerCase().includes(term) ||
                event.hall.toLowerCase().includes(term)
            );
        }

        const { useDateRange, startDate, endDate, selectedYear, selectedMonth, selectedDay, selectedSalesperson, selectedStatus } = filterValues;

        if (useDateRange && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.timeSlots[0].date);
                return eventDate >= start && eventDate <= end;
            });
        } else if (!useDateRange) {
            if (selectedYear !== 'all') {
                filtered = filtered.filter(event => {
                    const eventDate = new Date(event.timeSlots[0].date);
                    return eventDate.getFullYear().toString() === selectedYear;
                });
            }
            if (selectedMonth !== 'all') {
                filtered = filtered.filter(event => {
                    const eventDate = new Date(event.timeSlots[0].date);
                    return monthsList[eventDate.getMonth()] === selectedMonth;
                });
            }
            if (selectedDay !== 'all') {
                filtered = filtered.filter(event => {
                    const eventDate = new Date(event.timeSlots[0].date);
                    return eventDate.getDate().toString() === selectedDay;
                });
            }
        }

        if (selectedSalesperson !== 'all') {
            filtered = filtered.filter(event => event.organizer === selectedSalesperson);
        }

        if (selectedStatus !== 'all') {
            filtered = filtered.filter(event => event.status === selectedStatus);
        }

        setFilteredEvents(filtered);
    }, [filterValues, events, searchTerm]);

    const handleViewEvent = (event: Show) => {
        setSelectedEvent(event);
        setShowDetailsModal(true);
    };

    const handleEditEvent = (event: Show) => {
        setEventToEdit(event);
        setShowEditModal(true);
    };

    const handleDeleteEvent = () => {
        if (eventToDelete) {
            setEvents(events.filter(e => e.id !== eventToDelete.id));
            setShowDeleteModal(false);
            setEventToDelete(null);
            setPopupMessage({
                title: 'Event Deleted!',
                message: `🗑️ Event "${eventToDelete.name}" has been deleted successfully!`,
                type: 'success'
            });
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 3000);
        }
    };

    const handleCancelEvent = (reason: string) => {
        if (selectedEvent) {
            setEvents(events.map(e => 
                e.id === selectedEvent.id ? { ...e, status: 'cancelled' as const } : e
            ));
            setPopupMessage({
                title: 'Event Cancelled!',
                message: `${selectedEvent.name} has been cancelled. Reason: ${reason}`,
                type: 'warning'
            });
            setShowSuccessPopup(true);
            setShowCancelModal(false);
            setSelectedEvent(null);
            setTimeout(() => setShowSuccessPopup(false), 3000);
        }
    };

    const openCancelModal = (event: Show) => {
        setSelectedEvent(event);
        setShowCancelModal(true);
    };

    const openDeleteModal = (event: Show) => {
        setEventToDelete(event);
        setShowDeleteModal(true);
    };

    const handleAddEvent = (newEvent: Show) => {
        setEvents([newEvent, ...events]);
        setShowAddModal(false);
        setPopupMessage({
            title: 'Event Created!',
            message: `✨ Event "${newEvent.name}" created successfully!`,
            type: 'success'
        });
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
    };

    const handleUpdateEvent = (updatedEvent: Show) => {
        setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        setShowEditModal(false);
        setEventToEdit(null);
        setPopupMessage({
            title: 'Event Updated!',
            message: `✏️ Event "${updatedEvent.name}" updated successfully!`,
            type: 'success'
        });
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
    };

    const handleCreateEvent = () => {
        setShowAddModal(true);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'selling': return 'bg-green-100 text-green-700';
            case 'almost full': return 'bg-yellow-100 text-yellow-700';
            case 'sold out': return 'bg-red-100 text-red-700';
            case 'cancelled': return 'bg-gray-100 text-gray-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'selling': return <Ticket className="h-3 w-3" />;
            case 'almost full': return <AlertCircle className="h-3 w-3" />;
            case 'sold out': return <XCircle className="h-3 w-3" />;
            case 'cancelled': return <Ban className="h-3 w-3" />;
            default: return <Calendar className="h-3 w-3" />;
        }
    };

    // Table columns
    const columns = [
        {
            Header: 'Event Name',
            accessor: 'name',
            Cell: (row: Show) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-xs text-gray-500">{row.organizer}</p>
                    </div>
                </div>
            )
        },
        {
            Header: 'Date & Time',
            accessor: 'timeSlots',
            Cell: (row: Show) => (
                <div>
                    <p className="text-sm font-medium">{row.timeSlots[0]?.date}</p>
                    <p className="text-xs text-gray-500">{row.timeSlots[0]?.startTime} - {row.timeSlots[0]?.endTime}</p>
                </div>
            )
        },
        {
            Header: 'Venue',
            accessor: 'hall',
            Cell: (row: Show) => (
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{row.hall}</span>
                </div>
            )
        },
        {
            Header: 'Sales',
            accessor: 'sales',
            Cell: (row: Show) => (
                <div>
                    <p className="text-sm font-semibold">{row.sales}/{row.capacity}</p>
                    <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${(row.sales / row.capacity) * 100}%` }} />
                    </div>
                </div>
            )
        },
        {
            Header: 'Revenue',
            accessor: 'revenue',
            Cell: (row: Show) => <span className="text-green-600 font-semibold">{formatCurrency(row.revenue)}</span>
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: (row: Show) => (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                    {getStatusIcon(row.status)} {row.status}
                </span>
            )
        }
    ];

    const Actions = (row: Show) => (
        <div className="flex gap-2">
            <button onClick={() => handleViewEvent(row)} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition" title="View Details">
                <Eye className="h-4 w-4 text-blue-600" />
            </button>
            <button onClick={() => handleEditEvent(row)} className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition" title="Edit Event">
                <Edit className="h-4 w-4 text-teal-600" />
            </button>
            {row.status !== 'cancelled' && row.status !== 'completed' && (
                <button onClick={() => openCancelModal(row)} className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition" title="Cancel Event">
                    <Ban className="h-4 w-4 text-orange-600" />
                </button>
            )}
            <button onClick={() => openDeleteModal(row)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition" title="Delete Event">
                <Trash2 className="h-4 w-4 text-red-600" />
            </button>
        </div>
    );

    const columnsWithActions = [...columns, { Header: 'Actions', accessor: 'actions', Cell: Actions, width: '260px' }];

    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="min-h-screen bg-gray-50"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Event Schedule</h1>
                                <p className="text-sm text-gray-500">Manage and track all events</p>
                            </div>
                        </div>
                        <ReusableButton 
                            onClick={handleCreateEvent} 
                            icon={Plus} 
                            label="Create Event" 
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                        />
                    </div>

                    {/* Filters - Search Bar and Filter Component in same row */}
                    <div className="mb-6">
                        <div className="flex gap-4 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events by name, organizer or venue..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white"
                                />
                            </div>
                        </div>
                        <ReusableshowFilterforall
                            filterValues={filterValues}
                            onUseDateRangeChange={(value) => setFilterValues(prev => ({ ...prev, useDateRange: value }))}
                            onStartDateChange={(date) => setFilterValues(prev => ({ ...prev, startDate: date }))}
                            onEndDateChange={(date) => setFilterValues(prev => ({ ...prev, endDate: date }))}
                            onSelectedYearChange={(year) => setFilterValues(prev => ({ ...prev, selectedYear: year }))}
                            onSelectedMonthChange={(month) => setFilterValues(prev => ({ ...prev, selectedMonth: month }))}
                            onSelectedDayChange={(day) => setFilterValues(prev => ({ ...prev, selectedDay: day }))}
                            onSelectedSalespersonChange={(person) => setFilterValues(prev => ({ ...prev, selectedSalesperson: person }))}
                            onSelectedStatusChange={(status) => setFilterValues(prev => ({ ...prev, selectedStatus: status }))}
                            salespersonOptions={salespersonOptions}
                            statusOptions={statusOptions}
                            availableYears={availableYears}
                            monthsList={monthsList}
                            daysRange={31}
                            showSalesperson={true}
                            showStatus={true}
                            showDateRangeToggle={true}
                            showYearMonthDay={true}
                        />
                    </div>

                    {/* Events Table */}
                    <ReusableTable 
                        columns={columnsWithActions} 
                        data={filteredEvents} 
                        icon={LayoutGrid} 
                        showSearch={false}
                        showExport={true}
                        showPrint={false}
                        itemsPerPage={10}
                    />
                </div>
            </motion.div>

            {/* Modals */}
            {showAddModal && (
                <AddSchedule 
                    onAdd={handleAddEvent}
                    onCancel={() => setShowAddModal(false)}
                />
            )}
            
            {showEditModal && eventToEdit && (
                <UpdateSchedule 
                    eventId={eventToEdit.id}
                    onUpdate={handleUpdateEvent}
                    onCancel={() => {
                        setShowEditModal(false);
                        setEventToEdit(null);
                    }}
                />
            )}
            
            <ViewEventDetailsModal
                event={selectedEvent}
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                onEdit={handleEditEvent}
            />

            <CancelReasonModal
                event={selectedEvent}
                isOpen={showCancelModal}
                onConfirm={handleCancelEvent}
                onClose={() => setShowCancelModal(false)}
            />

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                employee={eventToDelete ? { id: eventToDelete.id, name: eventToDelete.name } : null}
                onConfirm={handleDeleteEvent}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setEventToDelete(null);
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
        </>
    );
};

export default EventSchedule;