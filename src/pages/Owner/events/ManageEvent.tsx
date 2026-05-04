// src/pages/Manager/components/events/CreateEvent.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, Users, DollarSign, Image, X,
  Upload, AlertCircle, CheckCircle, FileText, Phone,
  Mail, Globe, Star, Award, Ticket, Music, Film,
  Trash2, Eye, Loader, ChevronRight, ChevronLeft, Edit,
  Search, Ban, RefreshCw, Activity, XCircle, Shield, MapPin, Download, Filter,
  Plus, FileSignature, Layers, Percent, ArrowRight, LayoutGrid,
  TrendingUp, UserCheck, Crown, Briefcase
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// --- Types ---
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
  organizer: string;
  imageUrl?: string;
  createdAt: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  totalBookedSeats: number;
  totalRevenue: number;
  totalManagerEarnings: number;
  contractDate?: string;
  contractReference?: string;
}

interface FormData {
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
  organizer: string;
  contractDate: string;
  contractReference: string;
}

// --- Halls with predefined seat types (fixed capacities) ---
const halls = [
  { id: 'hall-a', name: 'Grand Hall', capacity: 1500, seatTypes: [{ name: 'VIP', capacity: 200 }, { name: 'Regular', capacity: 1000 }, { name: 'Balcony', capacity: 300 }] },
  { id: 'hall-b', name: 'Blue Hall', capacity: 800, seatTypes: [{ name: 'VIP', capacity: 100 }, { name: 'Regular', capacity: 600 }, { name: 'Balcony', capacity: 100 }] },
  { id: 'hall-c', name: 'Red Hall', capacity: 500, seatTypes: [{ name: 'VIP', capacity: 50 }, { name: 'Regular', capacity: 400 }, { name: 'Balcony', capacity: 50 }] },
  { id: 'vip-hall', name: 'Royal Hall', capacity: 300, seatTypes: [{ name: 'Royal VIP', capacity: 50 }, { name: 'Premium', capacity: 150 }, { name: 'Standard', capacity: 100 }] },
];

const categories = [
  { value: 'concert', label: 'Concert', icon: Music, color: 'from-purple-500 to-pink-500' },
  { value: 'theater', label: 'Theater', icon: Film, color: 'from-blue-500 to-cyan-500' },
  { value: 'movie', label: 'Movie', icon: Film, color: 'from-red-500 to-orange-500' },
  { value: 'comedy', label: 'Comedy', icon: Star, color: 'from-yellow-500 to-orange-500' },
  { value: 'sports', label: 'Sports', icon: Award, color: 'from-green-500 to-emerald-500' },
  { value: 'family', label: 'Family', icon: Users, color: 'from-indigo-500 to-purple-500' },
];

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }
};

// Stat Card Component (matching EmployeeManagement style)
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

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, delay, link, notification, notificationCount }) => {
  const [isHovered, setIsHovered] = useState(false);

  const CardContent = () => (
    <div className="relative overflow-hidden cursor-pointer transition-all duration-300" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">{title}</p>
            {notification && notificationCount && notificationCount > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold animate-pulse bg-teal-500 text-white rounded-full">{notificationCount}</span>
            )}
          </div>
          <p className="text-xl font-bold text-gray-900">{value}</p>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, type: "spring", stiffness: 100 }} whileHover={{ y: -2 }} className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
      {link ? <Link to={link} className="block"><CardContent /></Link> : <CardContent />}
    </motion.div>
  );
};

// Helper Functions
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

// --- Main Component ---
const ManageEvent: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'table'>('table');
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('year');
  const [cancelReason, setCancelReason] = useState('');

  const [formData, setFormData] = useState<FormData>({
    name: '', description: '',
    timeSlots: [{ id: generateId(), date: '', startTime: '', endTime: '' }],
    hall: '', seatCategories: [],
    category: '', ageRestriction: '', contactEmail: '', contactPhone: '', website: '',
    organizer: '',
    contractDate: new Date().toISOString().split('T')[0],
    contractReference: ''
  });

  const [editFormData, setEditFormData] = useState<FormData | null>(null);
  const [editUploadedImage, setEditUploadedImage] = useState<string | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const getSeatTypesForHall = (hallId: string) => {
    const hall = halls.find(h => h.id === hallId);
    if (!hall) return [];
    return hall.seatTypes.map(st => ({ id: generateId(), name: st.name, price: 0, capacity: st.capacity, commissionPercent: 10, booked: 0 }));
  };

  const handleHallChange = (hallId: string) => {
    const newSeatCategories = getSeatTypesForHall(hallId);
    setFormData(prev => ({ ...prev, hall: hallId, seatCategories: newSeatCategories }));
  };

  const updateSeatCategoryField = (id: string, field: 'price' | 'commissionPercent', value: number) => {
    setFormData(prev => ({ ...prev, seatCategories: prev.seatCategories.map(cat => cat.id === id ? { ...cat, [field]: value } : cat) }));
  };

  const updateEditSeatCategoryField = (id: string, field: 'price' | 'commissionPercent', value: number) => {
    if (!editFormData) return;
    setEditFormData({ ...editFormData, seatCategories: editFormData.seatCategories.map(cat => cat.id === id ? { ...cat, [field]: value } : cat) });
  };

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('theater_events');
    if (savedEvents) {
      let parsedEvents = JSON.parse(savedEvents);
      parsedEvents = parsedEvents.map((event: any) => {
        if (event.seatCategories && event.seatCategories.length > 0 && event.seatCategories[0].commissionPercent === undefined) {
          const seatCategories = event.seatCategories.map((cat: any) => ({ ...cat, commissionPercent: cat.commissionPercent ?? 10 }));
          const totalManagerEarnings = seatCategories.reduce((sum: number, cat: any) => sum + ((cat.price * (cat.booked || 0)) * (cat.commissionPercent / 100)), 0);
          return { ...event, seatCategories, totalManagerEarnings };
        }
        return event;
      });
      setEvents(parsedEvents);
    } else {
      const mockEvents: EventData[] = [
        { id: '1', name: 'Summer Music Festival', description: 'Amazing music festival', timeSlots: [{ id: 'ts1', date: '2025-06-15', startTime: '18:00', endTime: '23:00' }], hall: 'Grand Hall', seatCategories: [{ id: 'sc1', name: 'VIP', price: 150, capacity: 200, commissionPercent: 10 }, { id: 'sc2', name: 'Regular', price: 50, capacity: 1000, commissionPercent: 10 }], category: 'concert', ageRestriction: 'All Ages', contactEmail: 'info@example.com', contactPhone: '+251 911 234 567', website: '', organizer: 'Event Org', createdAt: new Date().toISOString(), status: 'upcoming', totalBookedSeats: 0, totalRevenue: 0, totalManagerEarnings: 0 },
      ];
      setEvents(mockEvents);
      localStorage.setItem('theater_events', JSON.stringify(mockEvents));
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) localStorage.setItem('theater_events', JSON.stringify(events));
  }, [events]);

  const getDateRangeFilter = (range: typeof dateRange) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    switch(range) {
      case 'day': return { start: today, end: today };
      case 'week': { const start = new Date(today); start.setDate(today.getDate() - today.getDay()); const end = new Date(start); end.setDate(start.getDate() + 6); return { start, end }; }
      case 'month': { const start = new Date(today.getFullYear(), today.getMonth(), 1); const end = new Date(today.getFullYear(), today.getMonth() + 1, 0); return { start, end }; }
      case 'year': { const start = new Date(today.getFullYear(), 0, 1); const end = new Date(today.getFullYear(), 11, 31); return { start, end }; }
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
  const totalManagerEarnings = filteredEvents.reduce((sum, e) => sum + (e.totalManagerEarnings ?? 0), 0);

  // Stats for cards
  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => e.status === 'upcoming').length,
    ongoingEvents: events.filter(e => e.status === 'ongoing').length,
    completedEvents: events.filter(e => e.status === 'completed').length,
    cancelledEvents: events.filter(e => e.status === 'cancelled').length,
  };

  const dashboardCards = [
    { title: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'from-teal-500 to-teal-600', delay: 0.1, link: '/manager/events', notification: false },
    { title: 'Upcoming', value: stats.upcomingEvents, icon: Clock, color: 'from-blue-500 to-cyan-600', delay: 0.15, notification: true, notificationCount: stats.upcomingEvents },
    { title: 'Ongoing', value: stats.ongoingEvents, icon: Activity, color: 'from-green-500 to-emerald-600', delay: 0.2, notification: true, notificationCount: stats.ongoingEvents },
    { title: 'Completed', value: stats.completedEvents, icon: CheckCircle, color: 'from-purple-500 to-pink-600', delay: 0.25, notification: true, notificationCount: stats.completedEvents },
    { title: 'Cancelled', value: stats.cancelledEvents, icon: XCircle, color: 'from-red-500 to-rose-600', delay: 0.3, notification: true, notificationCount: stats.cancelledEvents }
  ];

  // Table columns
  const tableColumns = [
    { Header: 'Event Name', accessor: 'name', sortable: true, Cell: (row: any) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center"><Film className="h-5 w-5 text-white" /></div>
        <div><p className="font-medium text-gray-900">{row.name}</p><p className="text-xs text-gray-500">{row.hall}</p></div>
      </div>
    ) },
    { Header: 'Date & Time', accessor: 'dateTime', sortable: true, Cell: (row: any) => (
      <div>{row.timeSlots.length === 1 ? <>{row.timeSlots[0].date}<br/><span className="text-xs text-gray-500">{row.timeSlots[0].startTime} - {row.timeSlots[0].endTime}</span></> : <span className="text-blue-600 cursor-pointer">{row.timeSlots.length} dates</span>}</div>
    ) },
    { Header: 'Hall', accessor: 'hall', sortable: true, Cell: (row: any) => <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-600">{row.hall}</span></div> },
    { Header: 'Tickets', accessor: 'tickets', sortable: true, Cell: (row: any) => (
      <div><span className="font-medium">{row.bookedSeats.toLocaleString()} / {row.totalCapacity.toLocaleString()}</span>
      <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(row.bookedSeats / row.totalCapacity) * 100}%` }} /></div></div>
    ) },
    { Header: 'Revenue', accessor: 'revenue', sortable: true, Cell: (row: any) => <span className="text-green-600 font-semibold">ETB {row.revenue.toLocaleString()}</span> },
    { Header: 'Manager Earnings', accessor: 'managerEarnings', sortable: true, Cell: (row: any) => <span className="text-amber-600 font-semibold">ETB {row.managerEarnings.toLocaleString()}</span> },
    { Header: 'Status', accessor: 'status', sortable: true, Cell: (row: any) => (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>{getStatusIcon(row.status)} {row.status}</span>
    ) }
  ];

  const renderActions = (row: any) => (
    <div className="flex items-center gap-2">
      <button onClick={() => { setSelectedEvent(row.original); setShowDetailsModal(true); }} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition" title="View Details"><Eye className="h-4 w-4 text-blue-600" /></button>
      <button onClick={() => openEditModal(row.original)} className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition" title="Edit Event"><Edit className="h-4 w-4 text-teal-600" /></button>
      {row.status === 'cancelled' ? (
        <button onClick={() => { setSelectedEvent(row.original); setShowCancelModal(true); }} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition" title="Restore Event"><RefreshCw className="h-4 w-4 text-green-600" /></button>
      ) : row.status !== 'completed' && (
        <button onClick={() => { setSelectedEvent(row.original); setShowCancelModal(true); }} className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition" title="Cancel Event"><Ban className="h-4 w-4 text-orange-600" /></button>
      )}
      <button onClick={() => { setSelectedEvent(row.original); setShowDeleteModal(true); }} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition" title="Delete Event"><Trash2 className="h-4 w-4 text-red-600" /></button>
    </div>
  );

  const columnsWithActions = [...tableColumns, { Header: 'Actions', accessor: 'actions', Cell: renderActions, width: '200px' }];

  const tableData = filteredEvents.map(event => {
    const totalCapacity = event.seatCategories?.reduce((sum, cat) => sum + cat.capacity, 0) ?? 0;
    const bookedSeats = event.totalBookedSeats ?? 0;
    return { id: event.id, name: event.name, timeSlots: event.timeSlots, hall: event.hall, bookedSeats: bookedSeats, totalCapacity: totalCapacity, revenue: event.totalRevenue ?? 0, managerEarnings: event.totalManagerEarnings ?? 0, status: event.status, original: event };
  });

  const openEditModal = (event: EventData) => {
    setEditingEvent(event);
    const hallObj = halls.find(h => h.name === event.hall);
    const hallId = hallObj?.id || '';
    let seatCategories: SeatCategory[] = [];
    if (hallObj) {
      seatCategories = hallObj.seatTypes.map(st => {
        const existing = event.seatCategories.find(cat => cat.name === st.name);
        return { id: existing?.id || generateId(), name: st.name, price: existing?.price ?? 0, capacity: st.capacity, booked: existing?.booked ?? 0, commissionPercent: existing?.commissionPercent ?? 10 };
      });
    } else {
      seatCategories = event.seatCategories.map(cat => ({ ...cat }));
    }
    setEditFormData({
      name: event.name, description: event.description || '', timeSlots: event.timeSlots.map(slot => ({ ...slot })),
      hall: hallId, seatCategories: seatCategories, category: event.category, ageRestriction: event.ageRestriction,
      contactEmail: event.contactEmail, contactPhone: event.contactPhone, website: event.website, organizer: event.organizer,
      contractDate: event.contractDate || new Date().toISOString().split('T')[0], contractReference: event.contractReference || ''
    });
    setEditUploadedImage(event.imageUrl || null);
    setEditErrors({});
    setShowEditModal(true);
  };

  const addEditTimeSlot = () => {
    if (!editFormData) return;
    setEditFormData({ ...editFormData, timeSlots: [...editFormData.timeSlots, { id: generateId(), date: '', startTime: '', endTime: '' }] });
  };

  const updateEditTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    if (!editFormData) return;
    setEditFormData({ ...editFormData, timeSlots: editFormData.timeSlots.map(slot => slot.id === id ? { ...slot, [field]: value } : slot) });
  };

  const removeEditTimeSlot = (id: string) => {
    if (!editFormData || editFormData.timeSlots.length === 1) return;
    setEditFormData({ ...editFormData, timeSlots: editFormData.timeSlots.filter(slot => slot.id !== id) });
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setEditUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    } else alert('Image size should be less than 5MB');
  };

  const validateEditForm = (): boolean => {
    if (!editFormData) return false;
    const newErrors: Record<string, string> = {};
    if (!editFormData.name) newErrors.name = 'Event name required';
    if (!editFormData.organizer) newErrors.organizer = 'Organizer required';
    if (!editFormData.hall) newErrors.hall = 'Venue required';
    for (const cat of editFormData.seatCategories) {
      if (cat.price <= 0) newErrors[`seat_${cat.id}_price`] = 'Price > 0';
      if (cat.commissionPercent < 0 || cat.commissionPercent > 100) newErrors[`seat_${cat.id}_commission`] = '0-100';
    }
    for (const slot of editFormData.timeSlots) {
      if (!slot.date) newErrors[`slot_${slot.id}_date`] = 'Date required';
      if (!slot.startTime) newErrors[`slot_${slot.id}_startTime`] = 'Start time required';
      if (!slot.endTime) newErrors[`slot_${slot.id}_endTime`] = 'End time required';
    }
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveEditedEvent = () => {
    if (!editFormData || !editingEvent) return;
    if (!validateEditForm()) return;
    const selectedHallObj = halls.find(h => h.id === editFormData.hall);
    const updatedEvents = events.map(event => event.id === editingEvent.id ? {
      ...event,
      name: editFormData.name, description: editFormData.description, timeSlots: editFormData.timeSlots,
      hall: selectedHallObj?.name || editFormData.hall,
      seatCategories: editFormData.seatCategories.map(cat => ({ ...cat, booked: event.seatCategories.find(oc => oc.id === cat.id)?.booked || 0 })),
      category: editFormData.category, ageRestriction: editFormData.ageRestriction,
      contactEmail: editFormData.contactEmail, contactPhone: editFormData.contactPhone, website: editFormData.website,
      organizer: editFormData.organizer, imageUrl: editUploadedImage || event.imageUrl,
      contractDate: editFormData.contractDate, contractReference: editFormData.contractReference
    } : event);
    const updatedEvent = updatedEvents.find(e => e.id === editingEvent.id);
    if (updatedEvent) {
      updatedEvent.totalBookedSeats = updatedEvent.seatCategories.reduce((sum, cat) => sum + (cat.booked || 0), 0);
      updatedEvent.totalRevenue = updatedEvent.seatCategories.reduce((sum, cat) => sum + (cat.price * (cat.booked || 0)), 0);
      updatedEvent.totalManagerEarnings = updatedEvent.seatCategories.reduce((sum, cat) => sum + ((cat.price * (cat.booked || 0)) * (cat.commissionPercent / 100)), 0);
    }
    setEvents(updatedEvents);
    setSuccessMessage(`✏️ Event "${updatedEvent!.name}" updated successfully!`);
    setShowSuccessPopup(true);
    setShowEditModal(false);
    setEditingEvent(null);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

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
      setEvents(events.map(event => event.id === selectedEvent.id ? { ...event, status: 'cancelled' } : event));
      setShowCancelModal(false);
      setSuccessMessage(`⚠️ Event "${selectedEvent.name}" has been cancelled!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleUncancelEvent = () => {
    if (selectedEvent) {
      setEvents(events.map(event => event.id === selectedEvent.id ? { ...event, status: 'upcoming' } : event));
      setShowCancelModal(false);
      setSuccessMessage(`🔄 Event "${selectedEvent.name}" has been restored!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => { setUploadedImage(reader.result as string); setIsUploading(false); };
      reader.readAsDataURL(file);
    } else { alert('Image size should be less than 5MB'); setIsUploading(false); }
  };

  const handleRemoveImage = () => setUploadedImage(null);

  const addTimeSlot = () => setFormData(prev => ({ ...prev, timeSlots: [...prev.timeSlots, { id: generateId(), date: '', startTime: '', endTime: '' }] }));
  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => setFormData(prev => ({ ...prev, timeSlots: prev.timeSlots.map(slot => slot.id === id ? { ...slot, [field]: value } : slot) }));
  const removeTimeSlot = (id: string) => { if (formData.timeSlots.length > 1) setFormData(prev => ({ ...prev, timeSlots: prev.timeSlots.filter(slot => slot.id !== id) })); };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = 'Event name required';
      if (!formData.organizer) newErrors.organizer = 'Organizer required';
      if (!formData.hall) newErrors.hall = 'Venue required';
      for (const cat of formData.seatCategories) {
        if (cat.price <= 0) newErrors[`seat_${cat.id}_price`] = 'Price > 0';
        if (cat.commissionPercent < 0 || cat.commissionPercent > 100) newErrors[`seat_${cat.id}_commission`] = '0-100';
      }
    } else if (currentStep === 2) {
      for (const slot of formData.timeSlots) {
        if (!slot.date) newErrors[`slot_${slot.id}_date`] = 'Date required';
        if (!slot.startTime) newErrors[`slot_${slot.id}_startTime`] = 'Start time required';
        if (!slot.endTime) newErrors[`slot_${slot.id}_endTime`] = 'End time required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep()) { setCurrentStep(currentStep + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const prevStep = () => setCurrentStep(currentStep - 1);
  const resetForm = () => {
    setFormData({ name: '', description: '', timeSlots: [{ id: generateId(), date: '', startTime: '', endTime: '' }], hall: '', seatCategories: [], category: '', ageRestriction: '', contactEmail: '', contactPhone: '', website: '', organizer: '', contractDate: new Date().toISOString().split('T')[0], contractReference: '' });
    setUploadedImage(null);
    setCurrentStep(1);
    setEditingEvent(null);
  };

  const handleCreateEvent = () => {
    if (validateStep()) {
      const selectedHall = halls.find(h => h.id === formData.hall);
      const newEvent: EventData = {
        id: Date.now().toString(), name: formData.name, description: formData.description, timeSlots: formData.timeSlots,
        hall: selectedHall?.name || formData.hall, seatCategories: formData.seatCategories.map(cat => ({ ...cat, booked: 0 })),
        category: formData.category, ageRestriction: formData.ageRestriction, contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone, website: formData.website, organizer: formData.organizer,
        imageUrl: uploadedImage || undefined, createdAt: new Date().toISOString(), status: 'upcoming',
        totalBookedSeats: 0, totalRevenue: 0, totalManagerEarnings: 0,
        contractDate: formData.contractDate, contractReference: formData.contractReference
      };
      setEvents([newEvent, ...events]);
      setSuccessMessage(`✨ Event "${newEvent.name}" created successfully!`);
      setShowSuccessPopup(true);
      resetForm();
      setTimeout(() => setShowSuccessPopup(false), 3000);
      setViewMode('table');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
                <p className="text-sm text-gray-500">Create, manage and track all events</p>
              </div>
            </div>
            <ReusableButton onClick={() => { resetForm(); setViewMode('form'); }} icon={Plus} label="Create New Event" className="bg-teal-600 hover:bg-teal-700 text-white" />
          </div>
        </div>

        {viewMode === 'table' ? (
          <>
            {/* Stats Cards - Professional Style */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
              {dashboardCards.map((card, index) => (
                <StatCard key={index} title={card.title} value={card.value} icon={card.icon} color={card.color} delay={card.delay} link={card.link} notification={card.notification} notificationCount={card.notificationCount} />
              ))}
            </motion.div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" placeholder="Search events by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white">
                  <option value="all">All Status</option><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                </select>
                <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
                  {(['day', 'week', 'month', 'year', 'all'] as const).map((range) => (
                    <button key={range} onClick={() => setDateRange(range)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${dateRange === range ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>
                <button onClick={() => { const csv = [['Name', 'Status', 'Revenue'], ...filteredEvents.map(e => [e.name, e.status, e.totalRevenue])].map(row => row.join(',')).join('\n'); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `events_${new Date().toISOString()}.csv`; a.click(); URL.revokeObjectURL(url); }} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Download className="h-4 w-4" /> Export</button>
              </div>
            </div>

            {/* Events Table */}
            <ReusableTable columns={columnsWithActions} data={tableData} icon={LayoutGrid} showSearch={false} showExport={false} showPrint={false} itemsPerPage={10} />
          </>
        ) : (
          // Create Event Form
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 pt-8">
              <div className="flex items-center justify-between">
                {[{ step: 1, title: 'Event Info', icon: FileSignature }, { step: 2, title: 'Schedule', icon: Calendar }, { step: 3, title: 'Media & Description', icon: Image }, { step: 4, title: 'Review', icon: CheckCircle }].map((item) => {
                  const status = item.step < currentStep ? 'completed' : item.step === currentStep ? 'current' : 'pending';
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="flex-1 relative">
                      <div className={`h-1 ${status === 'completed' ? 'bg-green-500' : status === 'current' ? 'bg-teal-500' : 'bg-gray-200'}`} />
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${status === 'completed' ? 'bg-green-500 text-white' : status === 'current' ? 'bg-teal-500 text-white ring-4 ring-teal-200' : 'bg-gray-200 text-gray-500'}`}>
                          {status === 'completed' ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                        </div>
                      </div>
                      <p className={`text-center mt-6 text-sm font-medium ${status === 'current' ? 'text-teal-600' : 'text-gray-500'}`}>{item.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateEvent(); }}>
              {/* Step 1: Event Info */}
              {currentStep === 1 && (
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block font-semibold mb-2">Event Name *</label><input type="text" name="name" className={`w-full p-3 border-2 rounded-xl ${errors.name ? 'border-red-500' : 'border-gray-200'}`} value={formData.name} onChange={handleChange} />{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}</div>
                    <div><label className="block font-semibold mb-2">Organizer *</label><input type="text" name="organizer" className={`w-full p-3 border-2 rounded-xl ${errors.organizer ? 'border-red-500' : 'border-gray-200'}`} value={formData.organizer} onChange={handleChange} />{errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block font-semibold mb-2">Contract Date</label><input type="date" name="contractDate" className="w-full p-3 border-2 border-gray-200 rounded-xl" value={formData.contractDate} onChange={handleChange} /></div>
                    <div><label className="block font-semibold mb-2">Contract Reference</label><input type="text" name="contractReference" className="w-full p-3 border-2 border-gray-200 rounded-xl" placeholder="e.g., CTR-2025-001" value={formData.contractReference} onChange={handleChange} /></div>
                  </div>
                  <div><label className="block font-semibold mb-2">Select Venue *</label><select className={`w-full p-3 border-2 rounded-xl ${errors.hall ? 'border-red-500' : 'border-gray-200'}`} value={formData.hall} onChange={(e) => handleHallChange(e.target.value)}><option value="">-- Select a hall --</option>{halls.map(hall => (<option key={hall.id} value={hall.id}>{hall.name} (Capacity: {hall.capacity})</option>))}</select>{errors.hall && <p className="text-red-500 text-sm mt-1">{errors.hall}</p>}</div>
                  {formData.hall && (
                    <div className="border-t pt-4"><h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Layers className="h-5 w-5" /> Seat Types & Pricing</h3>
                      <div className="space-y-4">{formData.seatCategories.map(cat => (
                        <div key={cat.id} className="p-4 border rounded-xl bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div><label className="block text-sm font-medium mb-1">Seat Type</label><div className="p-2 bg-gray-200 rounded-lg font-semibold">{cat.name}</div></div>
                            <div><label className="block text-sm font-medium mb-1">Capacity</label><div className="p-2 bg-gray-200 rounded-lg">{cat.capacity}</div></div>
                            <div><label className="block text-sm font-medium mb-1">Price (ETB) *</label><input type="number" step="0.01" value={cat.price} onChange={e => updateSeatCategoryField(cat.id, 'price', parseFloat(e.target.value))} className="w-full p-2 border rounded-lg" />{errors[`seat_${cat.id}_price`] && <p className="text-red-500 text-xs">{errors[`seat_${cat.id}_price`]}</p>}</div>
                            <div><label className="block text-sm font-medium mb-1">Commission (%) *</label><input type="number" step="0.5" value={cat.commissionPercent} onChange={e => updateSeatCategoryField(cat.id, 'commissionPercent', parseFloat(e.target.value))} className="w-full p-2 border rounded-lg" />{errors[`seat_${cat.id}_commission`] && <p className="text-red-500 text-xs">{errors[`seat_${cat.id}_commission`]}</p>}</div>
                          </div>
                        </div>
                      ))}</div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block font-semibold mb-2">Age Restriction</label><select name="ageRestriction" className="w-full p-3 border-2 border-gray-200 rounded-xl" value={formData.ageRestriction} onChange={handleChange}><option value="">All Ages</option><option value="12+">12+</option><option value="16+">16+</option><option value="18+">18+</option></select></div>
                    <div><label className="block font-semibold mb-2">Category</label><div className="grid grid-cols-2 gap-2">{categories.map(cat => (<button type="button" key={cat.value} onClick={() => setFormData({...formData, category: cat.value})} className={`p-2 border rounded-lg text-sm ${formData.category === cat.value ? `bg-gradient-to-r ${cat.color} text-white` : 'bg-white'}`}>{cat.label}</button>))}</div></div>
                  </div>
                </div>
              )}

              {/* Step 2: Time Slots */}
              {currentStep === 2 && (
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-center"><h3 className="text-lg font-semibold flex items-center gap-2"><Clock className="h-5 w-5" /> Event Dates & Times</h3><ReusableButton onClick={addTimeSlot} variant="primary" size="sm" icon={Plus}>Add Another Time</ReusableButton></div>
                  <div className="space-y-4">{formData.timeSlots.map((slot, idx) => (
                    <div key={slot.id} className="p-4 border rounded-xl bg-gray-50">
                      <div className="flex justify-between items-start mb-3"><h4 className="font-medium">Time Slot #{idx + 1}</h4>{formData.timeSlots.length > 1 && <ReusableButton onClick={() => removeTimeSlot(slot.id)} variant="danger" size="sm" icon={Trash2}>Remove</ReusableButton>}</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" value={slot.date} onChange={e => updateTimeSlot(slot.id, 'date', e.target.value)} className="w-full p-2 border rounded-lg" />{errors[`slot_${slot.id}_date`] && <p className="text-red-500 text-xs">{errors[`slot_${slot.id}_date`]}</p>}</div>
                        <div><label className="block text-sm font-medium mb-1">Start Time *</label><input type="time" value={slot.startTime} onChange={e => updateTimeSlot(slot.id, 'startTime', e.target.value)} className="w-full p-2 border rounded-lg" />{errors[`slot_${slot.id}_startTime`] && <p className="text-red-500 text-xs">{errors[`slot_${slot.id}_startTime`]}</p>}</div>
                        <div><label className="block text-sm font-medium mb-1">End Time *</label><input type="time" value={slot.endTime} onChange={e => updateTimeSlot(slot.id, 'endTime', e.target.value)} className="w-full p-2 border rounded-lg" />{errors[`slot_${slot.id}_endTime`] && <p className="text-red-500 text-xs">{errors[`slot_${slot.id}_endTime`]}</p>}</div>
                      </div>
                    </div>
                  ))}</div>
                </div>
              )}

              {/* Step 3: Media & Description */}
              {currentStep === 3 && (
                <div className="p-8 space-y-6">
                  <div>{!uploadedImage ? (<div className="border-2 border-dashed rounded-2xl p-8 text-center"><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" /><label htmlFor="upload" className="cursor-pointer"><Upload className="h-10 w-10 mx-auto text-gray-400" /><p>Click to upload poster</p></label></div>) : (<div className="relative"><img src={uploadedImage} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" /><ReusableButton onClick={handleRemoveImage} variant="danger" size="sm">Remove</ReusableButton></div>)}</div>
                  <div><label className="block font-semibold mb-2">Event Description</label><textarea name="description" rows={6} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500" placeholder="Provide a detailed description of the event..." value={formData.description} onChange={handleChange} /></div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="p-8 space-y-6">
                  <div className="bg-gray-50 p-4 rounded-xl"><h3 className="font-bold text-lg mb-2">Event Information</h3><div className="grid grid-cols-2 gap-2"><div><span className="font-semibold">Name:</span> {formData.name}</div><div><span className="font-semibold">Organizer:</span> {formData.organizer}</div><div><span className="font-semibold">Venue:</span> {halls.find(h => h.id === formData.hall)?.name || '—'}</div><div><span className="font-semibold">Category:</span> {categories.find(c => c.value === formData.category)?.label || '—'}</div></div></div>
                  <div className="bg-gray-50 p-4 rounded-xl"><h3 className="font-bold text-lg mb-2">Seat Types & Pricing</h3><table className="min-w-full text-sm"><thead className="bg-gray-100"><tr><th className="p-2 text-left">Type</th><th className="p-2 text-left">Price</th><th className="p-2 text-left">Capacity</th><th className="p-2 text-left">Commission</th></tr></thead><tbody>{formData.seatCategories.map(cat => (<tr key={cat.id}><td className="p-2">{cat.name}</td><td className="p-2">ETB {cat.price}</td><td className="p-2">{cat.capacity}</td><td className="p-2">{cat.commissionPercent}%</td></tr>))}</tbody></table></div>
                  <div className="bg-gray-50 p-4 rounded-xl"><h3 className="font-bold text-lg mb-2">Schedule</h3><table className="min-w-full text-sm"><thead className="bg-gray-100"><tr><th className="p-2 text-left">#</th><th className="p-2 text-left">Date</th><th className="p-2 text-left">Start</th><th className="p-2 text-left">End</th></tr></thead><tbody>{formData.timeSlots.map((slot, idx) => (<tr key={slot.id}><td className="p-2">{idx + 1}</td><td className="p-2">{slot.date}</td><td className="p-2">{slot.startTime}</td><td className="p-2">{slot.endTime}</td></tr>))}</tbody></table></div>
                  {formData.description && (<div className="bg-gray-50 p-4 rounded-xl"><h3 className="font-bold text-lg mb-2">Description</h3><p className="whitespace-pre-wrap">{formData.description}</p></div>)}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4"><AlertCircle className="inline mr-2" /> Please verify all information before submitting.</div>
                </div>
              )}

              <div className="px-8 py-6 bg-gray-50 border-t flex justify-between">
                {currentStep > 1 && <ReusableButton onClick={prevStep} variant="secondary" icon={ChevronLeft}>Previous</ReusableButton>}
                {currentStep < 4 ? <ReusableButton onClick={nextStep} variant="primary" icon={ChevronRight} className="ml-auto">Next Step</ReusableButton> : <ReusableButton type="submit" variant="success" disabled={isUploading} icon={isUploading ? Loader : CheckCircle} className="ml-auto">{isUploading ? 'Processing...' : 'Create Event'}</ReusableButton>}
              </div>
            </form>
          </div>
        )}

        {/* Modals */}
        {showDetailsModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-6 rounded-t-2xl flex justify-between sticky top-0"><h2 className="text-2xl font-bold">Event Details</h2><button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-white/20 rounded-lg"><X className="h-5 w-5" /></button></div>
              <div className="p-6 space-y-4"><div className="grid grid-cols-2 gap-4"><div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Event Name</p><p className="font-semibold">{selectedEvent.name}</p></div><div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Hall</p><p className="font-semibold">{selectedEvent.hall}</p></div></div>
              <div><h3 className="font-bold text-lg">Schedule</h3><table className="min-w-full text-sm border"><thead className="bg-gray-100"><tr><th className="p-2">Date</th><th className="p-2">Start</th><th className="p-2">End</th></tr></thead><tbody>{selectedEvent.timeSlots.map(slot => (<tr key={slot.id}><td className="p-2">{slot.date}</td><td className="p-2">{slot.startTime}</td><td className="p-2">{slot.endTime}</td></tr>))}</tbody></table></div>
              <div><h3 className="font-bold text-lg">Seat Types</h3><table className="min-w-full text-sm border"><thead className="bg-gray-100"><tr><th className="p-2">Type</th><th className="p-2">Price</th><th className="p-2">Capacity</th><th className="p-2">Booked</th><th className="p-2">Commission</th></tr></thead><tbody>{selectedEvent.seatCategories?.map(cat => (<tr key={cat.id}><td className="p-2">{cat.name}</td><td className="p-2">ETB {cat.price}</td><td className="p-2">{cat.capacity}</td><td className="p-2">{cat.booked || 0}</td><td className="p-2">{cat.commissionPercent}%</td></tr>))}</tbody></table></div>
              {selectedEvent.description && (<div><p className="text-gray-500 text-xs">Description</p><p className="text-gray-700">{selectedEvent.description}</p></div>)}</div>
              <div className="border-t p-6 bg-gray-50 rounded-b-2xl flex justify-end"><button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">Close</button></div>
            </div>
          </div>
        )}

        {showDeleteModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6"><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-red-100 rounded-lg"><AlertCircle className="h-6 w-6 text-red-600" /></div><h3 className="text-xl font-bold text-gray-900">Delete Event</h3></div><p className="text-gray-600 mb-6">Are you sure you want to delete "<strong>{selectedEvent.name}</strong>"? This action cannot be undone.</p><div className="flex gap-3"><button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700">Cancel</button><button onClick={handleDeleteEvent} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button></div></div>
          </div>
        )}

        {showCancelModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6"><div className={`flex items-center gap-3 mb-4`}><div className={`p-2 rounded-lg ${selectedEvent.status === 'cancelled' ? 'bg-green-100' : 'bg-orange-100'}`}>{selectedEvent.status === 'cancelled' ? <RefreshCw className="h-6 w-6 text-green-600" /> : <Ban className="h-6 w-6 text-orange-600" />}</div><h3 className="text-xl font-bold text-gray-900">{selectedEvent.status === 'cancelled' ? 'Restore Event' : 'Cancel Event'}</h3></div><p className="text-gray-600 mb-6">{selectedEvent.status === 'cancelled' ? `Restore "${selectedEvent.name}" to upcoming?` : `Cancel "${selectedEvent.name}"?`}</p><div className="flex gap-3"><button onClick={() => setShowCancelModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button><button onClick={selectedEvent.status === 'cancelled' ? handleUncancelEvent : handleCancelEvent} className={`flex-1 px-4 py-2 ${selectedEvent.status === 'cancelled' ? 'bg-green-600' : 'bg-orange-600'} text-white rounded-lg`}>{selectedEvent.status === 'cancelled' ? 'Restore' : 'Cancel'}</button></div></div>
          </div>
        )}

        {showEditModal && editFormData && editingEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"><div className="sticky top-0 bg-gradient-to-r from-teal-600 to-blue-600 p-6 rounded-t-2xl flex justify-between"><h2 className="text-xl font-bold text-white">Edit Event</h2><button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-white/20 rounded-lg"><X className="h-6 w-6 text-white" /></button></div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block font-semibold mb-1">Event Name *</label><input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full p-2 border rounded-lg" />{editErrors.name && <p className="text-red-500 text-xs">{editErrors.name}</p>}</div><div><label className="block font-semibold mb-1">Organizer *</label><input type="text" value={editFormData.organizer} onChange={e => setEditFormData({...editFormData, organizer: e.target.value})} className="w-full p-2 border rounded-lg" />{editErrors.organizer && <p className="text-red-500 text-xs">{editErrors.organizer}</p>}</div></div>
                <div><label className="block font-semibold mb-1">Venue *</label><select value={editFormData.hall} onChange={e => { const newHallId = e.target.value; const hallObj = halls.find(h => h.id === newHallId); if (hallObj) { const newSeatCategories = hallObj.seatTypes.map(st => ({ id: generateId(), name: st.name, price: 0, capacity: st.capacity, commissionPercent: 10, booked: 0 })); setEditFormData({ ...editFormData, hall: newHallId, seatCategories: newSeatCategories }); } else { setEditFormData({ ...editFormData, hall: newHallId }); } }} className="w-full p-2 border rounded-lg"><option value="">Select hall</option>{halls.map(h => <option key={h.id} value={h.id}>{h.name} (Capacity: {h.capacity})</option>)}</select></div>
                {editFormData.hall && (<div className="border-t pt-4"><h3 className="text-lg font-semibold mb-3">Seat Types & Prices</h3><div className="space-y-3 max-h-60 overflow-y-auto">{editFormData.seatCategories.map(cat => (<div key={cat.id} className="p-3 border rounded-lg bg-gray-50"><div className="grid grid-cols-4 gap-2 items-center"><div><label className="text-sm font-medium">Type</label><div className="p-1 bg-gray-200 rounded">{cat.name}</div></div><div><label className="text-sm font-medium">Capacity</label><div className="p-1 bg-gray-200 rounded">{cat.capacity}</div></div><div><label className="text-sm font-medium">Price (ETB)</label><input type="number" step="0.01" value={cat.price} onChange={e => updateEditSeatCategoryField(cat.id, 'price', parseFloat(e.target.value))} className="w-full p-1 border rounded" /></div><div><label className="text-sm font-medium">Commission (%)</label><input type="number" step="0.5" value={cat.commissionPercent} onChange={e => updateEditSeatCategoryField(cat.id, 'commissionPercent', parseFloat(e.target.value))} className="w-full p-1 border rounded" /></div></div></div>))}</div></div>)}
                <div><label className="block font-semibold mb-1">Description</label><textarea rows={4} value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
                <div className="flex justify-end gap-3 pt-4 border-t"><ReusableButton onClick={() => setShowEditModal(false)} variant="secondary">Cancel</ReusableButton><ReusableButton onClick={saveEditedEvent} variant="success">Save Changes</ReusableButton></div>
              </div>
            </div>
          </div>
        )}

        <SuccessPopup message={successMessage} isVisible={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} />
      </div>
    </div>
  );
};

export default ManageEvent;