// src/pages/Manager/events/EventManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Users, DollarSign, Eye, Edit, Trash2, 
  Ban, RefreshCw, Search, Filter, Download, Plus, X, 
  AlertCircle, CheckCircle, XCircle, Activity, Shield, MapPin, Ticket
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import { useNavigate } from 'react-router-dom';

// --- Types (must match CreateEvent.tsx) ---
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
}

interface EventData {
  id: string;
  name: string;
  description: string;
  timeSlots: TimeSlot[];
  hall: string;
  seatCategories: SeatCategory[];
  category: string;
  ageRestriction: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  features: string[];
  organizer: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  totalBookedSeats: number;
  totalRevenue: number;
  contractDate?: string;
  contractTerms?: string;
  contractAgreed?: boolean;
  contractReference?: string;
}

// --- Helper Functions ---
const getStatusColor = (status: string): string => {
  switch(status) {
    case 'upcoming': return 'bg-blue-100 text-blue-700';
    case 'ongoing': return 'bg-green-100 text-green-700';
    case 'completed': return 'bg-gray-100 text-gray-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'upcoming': return <Clock className="h-3 w-3" />;
    case 'ongoing': return <Activity className="h-3 w-3" />;
    case 'completed': return <CheckCircle className="h-3 w-3" />;
    case 'cancelled': return <XCircle className="h-3 w-3" />;
    default: return null;
  }
};

const QuickStatBadge: React.FC<{ icon: React.ElementType; label: string; value: string; status?: 'online' | 'offline' }> = ({ icon: Icon, label, value, status }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
    <Icon className="h-4 w-4" />
    <span className="text-sm font-medium">{label}:</span>
    <span className="text-sm">
      {value}
      {status && (
        <span className={`ml-1 inline-block h-2 w-2 rounded-full ${status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
      )}
    </span>
  </div>
);

// --- Main Component ---
const EventManagement: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('year');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('theater_events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('theater_events', JSON.stringify(events));
    }
  }, [events]);

  // Date range filter logic
  const getDateRangeFilter = (range: typeof dateRange) => {
    if (range === 'all') return { start: new Date(0), end: new Date(8640000000000000) };
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    switch(range) {
      case 'day': return { start: today, end: today };
      case 'week': {
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return { start, end };
      }
      case 'month': {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return { start, end };
      }
      case 'year': {
        const start = new Date(today.getFullYear(), 0, 1);
        const end = new Date(today.getFullYear(), 11, 31);
        return { start, end };
      }
      default: return { start: new Date(0), end: new Date(8640000000000000) };
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const earliestDate = new Date(event.timeSlots[0].date);
    const { start, end } = getDateRangeFilter(dateRange);
    const matchesDateRange = earliestDate >= start && earliestDate <= end;
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const totalRevenue = filteredEvents.reduce((sum, e) => sum + (e.totalRevenue ?? 0), 0);
  const totalTickets = filteredEvents.reduce((sum, e) => sum + (e.totalBookedSeats ?? 0), 0);
  const totalCapacityAll = filteredEvents.reduce((sum, e) => 
    sum + (e.seatCategories?.reduce((s, cat) => s + cat.capacity, 0) ?? 0), 0
  );

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'First Date', 'First Time', 'Hall', 'Total Capacity', 'Booked Seats', 'Revenue', 'Status'];
    const rows = filteredEvents.map(e => {
      const totalCap = e.seatCategories?.reduce((sum, cat) => sum + cat.capacity, 0) ?? 0;
      const firstSlot = e.timeSlots[0];
      return [e.name, firstSlot.date, `${firstSlot.startTime}-${firstSlot.endTime}`, e.hall, totalCap, e.totalBookedSeats ?? 0, e.totalRevenue ?? 0, e.status];
    });
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events_${dateRange}_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // CRUD Actions
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      setShowDeleteModal(false);
      setSuccessMessage(`🗑️ Event "${selectedEvent.name}" deleted successfully!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleCancelEvent = () => {
    if (selectedEvent) {
      let newDescription = selectedEvent.description;
      const cancelNoteRegex = / \[CANCELLED:.*?\]/;
      newDescription = newDescription.replace(cancelNoteRegex, '');
      if (cancelReason.trim()) {
        newDescription += ` [CANCELLED: ${cancelReason.trim()}]`;
      } else {
        newDescription += ` [CANCELLED]`;
      }
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id ? { 
          ...event, 
          status: 'cancelled' as const,
          description: newDescription
        } : event
      );
      setEvents(updatedEvents);
      setShowCancelModal(false);
      setCancelReason('');
      setSuccessMessage(`⚠️ Event "${selectedEvent.name}" has been cancelled!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleUncancelEvent = () => {
    if (selectedEvent) {
      let newDescription = selectedEvent.description;
      const cancelNoteRegex = / \[CANCELLED:.*?\]/;
      newDescription = newDescription.replace(cancelNoteRegex, '');
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id ? { 
          ...event, 
          status: 'upcoming' as const,
          description: newDescription
        } : event
      );
      setEvents(updatedEvents);
      setShowCancelModal(false);
      setCancelReason('');
      setSuccessMessage(`🔄 Event "${selectedEvent.name}" has been restored to upcoming!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  // Table columns configuration
  const tableColumns = [
    { Header: 'Event Name', accessor: 'name', sortable: true },
    { Header: 'Date & Time', accessor: 'dateTime', sortable: true, Cell: (row: any) => (
      <div>
        {row.timeSlots.length === 1 ? (
          <>{row.timeSlots[0].date}<br/><span className="text-xs text-gray-500">{row.timeSlots[0].startTime} - {row.timeSlots[0].endTime}</span></>
        ) : (
          <span className="text-blue-600 cursor-pointer" title={row.timeSlots.map((s: TimeSlot) => `${s.date} ${s.startTime}-${s.endTime}`).join('\n')}>
            {row.timeSlots.length} dates
          </span>
        )}
      </div>
    ) },
    { Header: 'Hall', accessor: 'hall', sortable: true },
    { Header: 'Tickets', accessor: 'tickets', sortable: true, Cell: (row: any) => (
      <div><span className="font-medium">{row.bookedSeats.toLocaleString()} / {row.totalCapacity.toLocaleString()}</span>
      <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(row.bookedSeats / row.totalCapacity) * 100}%` }} /></div></div>
    ) },
    { Header: 'Revenue', accessor: 'revenue', sortable: true, Cell: (row: any) => <span className="text-green-600 font-semibold">${row.revenue.toLocaleString()}</span> },
    { Header: 'Status', accessor: 'status', sortable: true, Cell: (row: any) => (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
        {getStatusIcon(row.status)} {row.status}
      </span>
    ) },
    {
      Header: 'Actions',
      accessor: 'actions',
      sortable: false,
      width: 140,
      Cell: (row: any) => (
        <div className="flex gap-2 justify-center">
          <button title="View Details" className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => { setSelectedEvent(row.original); setShowDetailsModal(true); }}>
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button title="Edit Event" className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors" onClick={() => navigate(`/manager/events/edit/${row.original.id}`)}>
            <Edit className="h-4 w-4 text-blue-600" />
          </button>
          {row.status === 'cancelled' ? (
            <button title="Uncancel Event" className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 transition-colors" onClick={() => { setSelectedEvent(row.original); setShowCancelModal(true); }}>
              <RefreshCw className="h-4 w-4 text-green-600" />
            </button>
          ) : (
            <button title="Cancel Event" className="p-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 transition-colors" onClick={() => { setSelectedEvent(row.original); setShowCancelModal(true); }}>
              <Ban className="h-4 w-4 text-orange-600" />
            </button>
          )}
          <button title="Delete Event" className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors" onClick={() => { setSelectedEvent(row.original); setShowDeleteModal(true); }}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    }
  ];

  const tableData = filteredEvents.map(event => {
    const totalCapacity = event.seatCategories?.reduce((sum, cat) => sum + cat.capacity, 0) ?? 0;
    const bookedSeats = event.totalBookedSeats ?? 0;
    return {
      id: event.id,
      name: event.name,
      timeSlots: event.timeSlots,
      hall: event.hall,
      bookedSeats: bookedSeats,
      totalCapacity: totalCapacity,
      revenue: event.totalRevenue ?? 0,
      status: event.status,
      original: event
    };
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header with animations */}
      <div className="bg-gradient-to-br from-teal-700 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/10 rounded-full"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.3 }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-4">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Event Manager • Admin Dashboard</span>
          </motion.div>
          <motion.h1 className="text-4xl font-bold mb-2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>Event Management</motion.h1>
          <motion.p className="text-white/80 text-lg" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>View, filter, and manage all events</motion.p>
          <motion.div className="flex items-center gap-6 mt-6 flex-wrap" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            <QuickStatBadge icon={Calendar} label="Date" value={new Date().toLocaleDateString()} />
            <QuickStatBadge icon={MapPin} label="Location" value="Addis Ababa" />
            <QuickStatBadge icon={Activity} label="System Status" value="Healthy" status="online" />
            <QuickStatBadge icon={Users} label="Total Events" value={events.length.toString()} />
          </motion.div>
          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-2">
              {(['day', 'week', 'month', 'year', 'all'] as const).map((range) => (
                <button key={range} onClick={() => setDateRange(range)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${dateRange === range ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={exportToCSV} className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"><Download className="h-5 w-5 text-white" /></button>
              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"><Filter className="h-5 w-5 text-white" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center mb-2"><Calendar className="h-8 w-8" /><span className="text-2xl font-bold">{filteredEvents.length}</span></div>
            <p className="text-sm">Events in {dateRange}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center mb-2"><Ticket className="h-8 w-8" /><span className="text-2xl font-bold">{totalTickets.toLocaleString()}</span></div>
            <p className="text-sm">Tickets Sold</p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center mb-2"><DollarSign className="h-8 w-8" /><span className="text-2xl font-bold">${totalRevenue.toLocaleString()}</span></div>
            <p className="text-sm">Total Revenue</p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center mb-2"><Users className="h-8 w-8" /><span className="text-2xl font-bold">{totalCapacityAll.toLocaleString()}</span></div>
            <p className="text-sm">Total Seats Available</p>
          </motion.div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="text" placeholder="Search events by name..." className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ReusableButton onClick={() => navigate('/manager/events/create')} variant="primary" icon={Plus}>Create New Event</ReusableButton>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants}>
          <ReusableTable columns={tableColumns} data={tableData} title="All Events" showSearch={false} showExport={false} showPrint={false} itemsPerPage={10} />
        </motion.div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedEvent.name}</h2>
              <ReusableButton onClick={() => setShowDetailsModal(false)} variant="secondary" size="sm" icon={X}>Close</ReusableButton>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-500">Hall</p><p className="font-semibold">{selectedEvent.hall}</p></div>
                <div><p className="text-gray-500">Status</p><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>{selectedEvent.status}</span></div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Schedule</h3>
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-100"><tr><th className="p-2 text-left">Date</th><th className="p-2 text-left">Start</th><th className="p-2 text-left">End</th></tr></thead>
                  <tbody>
                    {selectedEvent.timeSlots.map((slot, idx) => (
                      <tr key={slot.id} className="border-t"><td className="p-2">{slot.date}</td><td className="p-2">{slot.startTime}</td><td className="p-2">{slot.endTime}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div><p className="text-gray-500">Description</p><p className="text-gray-700">{selectedEvent.description}</p></div>
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Ticket className="h-5 w-5" /> Seat Types & Pricing</h3>
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-100"><tr><th className="p-2 text-left">Type</th><th className="p-2 text-left">Price</th><th className="p-2 text-left">Capacity</th><th className="p-2 text-left">Booked</th></tr></thead>
                  <tbody>
                    {selectedEvent.seatCategories?.map(cat => (
                      <tr key={cat.id} className="border-t"><td className="p-2">{cat.name}</td><td className="p-2">${cat.price}</td><td className="p-2">{cat.capacity}</td><td className="p-2">{cat.booked || 0}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedEvent.features.length > 0 && (<div><p className="text-gray-500">Features</p><div className="flex flex-wrap gap-1">{selectedEvent.features.map((f,i) => (<span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">✓ {f}</span>))}</div></div>)}
              <div className="border-t pt-4 mt-2">
                <h3 className="font-bold text-lg mb-2">Contract Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Contract Date:</span> {selectedEvent.contractDate || '—'}</div>
                  <div><span className="text-gray-500">Reference:</span> {selectedEvent.contractReference || '—'}</div>
                  <div className="col-span-2"><span className="text-gray-500">Agreed:</span> {selectedEvent.contractAgreed ? 'Yes' : 'No'}</div>
                  <div className="col-span-2"><span className="text-gray-500">Terms:</span><pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded mt-1 text-xs">{selectedEvent.contractTerms || '—'}</pre></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-4"><AlertCircle className="h-16 w-16 text-red-500 mx-auto" /></div>
            <h2 className="text-xl font-bold text-center mb-2">Delete Event</h2>
            <p className="text-gray-600 text-center mb-6">Are you sure you want to delete "{selectedEvent.name}"? This action cannot be undone.</p>
            <div className="flex gap-3"><ReusableButton onClick={() => setShowDeleteModal(false)} variant="secondary">Cancel</ReusableButton><ReusableButton onClick={handleDeleteEvent} variant="danger">Delete</ReusableButton></div>
          </div>
        </div>
      )}

      {/* Cancel/Uncancel Confirmation Modal */}
      {showCancelModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-4">
              {selectedEvent.status === 'cancelled' ? <RefreshCw className="h-16 w-16 text-green-500 mx-auto" /> : <Ban className="h-16 w-16 text-orange-500 mx-auto" />}
            </div>
            <h2 className="text-xl font-bold text-center mb-2">{selectedEvent.status === 'cancelled' ? 'Uncancel Event' : 'Cancel Event'}</h2>
            <p className="text-gray-600 text-center mb-6">
              {selectedEvent.status === 'cancelled'
                ? `Are you sure you want to restore "${selectedEvent.name}" to upcoming status?`
                : `Are you sure you want to cancel "${selectedEvent.name}"? This will cancel all bookings.`}
            </p>
            {selectedEvent.status !== 'cancelled' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Reason (optional)</label>
                <textarea rows={3} className="w-full p-3 border-2 border-gray-200 rounded-xl" placeholder="Why is this event being cancelled?" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
              </div>
            )}
            <div className="flex gap-3">
              <ReusableButton onClick={() => { setShowCancelModal(false); setCancelReason(''); }} variant="secondary">Keep as is</ReusableButton>
              <ReusableButton onClick={selectedEvent.status === 'cancelled' ? handleUncancelEvent : handleCancelEvent} variant={selectedEvent.status === 'cancelled' ? 'success' : 'warning'}>
                {selectedEvent.status === 'cancelled' ? 'Yes, Uncancel' : 'Yes, Cancel Event'}
              </ReusableButton>
            </div>
          </div>
        </div>
      )}

      <SuccessPopup message={successMessage} isVisible={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} />
    </div>
  );
};

export default EventManagement;