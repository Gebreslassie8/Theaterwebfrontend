// src/pages/Manager/components/events/CreateEvent.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Users, DollarSign, Image, X, 
  Upload, AlertCircle, CheckCircle, FileText, Phone, 
  Mail, Globe, Star, Award, Ticket, Music, Film,
  Trash2, Eye, Loader, ChevronRight, ChevronLeft, Edit,
  Search, Ban, RefreshCw, Activity, XCircle, Shield, MapPin, Download, Filter,
  Plus, FileSignature, Layers, Percent
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
  { 
    id: 'hall-a', 
    name: 'Grand Hall', 
    capacity: 1500,
    seatTypes: [
      { name: 'VIP', capacity: 200 },
      { name: 'Regular', capacity: 1000 },
      { name: 'Balcony', capacity: 300 }
    ]
  },
  { 
    id: 'hall-b', 
    name: 'Blue Hall', 
    capacity: 800,
    seatTypes: [
      { name: 'VIP', capacity: 100 },
      { name: 'Regular', capacity: 600 },
      { name: 'Balcony', capacity: 100 }
    ]
  },
  { 
    id: 'hall-c', 
    name: 'Red Hall', 
    capacity: 500,
    seatTypes: [
      { name: 'VIP', capacity: 50 },
      { name: 'Regular', capacity: 400 },
      { name: 'Balcony', capacity: 50 }
    ]
  },
  { 
    id: 'vip-hall', 
    name: 'Royal Hall', 
    capacity: 300,
    seatTypes: [
      { name: 'Royal VIP', capacity: 50 },
      { name: 'Premium', capacity: 150 },
      { name: 'Standard', capacity: 100 }
    ]
  },
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
const CreateEvent: React.FC = () => {
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

  // Helper: get seat types for a given hall ID
  const getSeatTypesForHall = (hallId: string) => {
    const hall = halls.find(h => h.id === hallId);
    if (!hall) return [];
    return hall.seatTypes.map(st => ({
      id: generateId(),
      name: st.name,
      price: 0,
      capacity: st.capacity,
      commissionPercent: 10,
      booked: 0
    }));
  };

  // When hall changes, update seatCategories based on that hall's fixed seat types
  const handleHallChange = (hallId: string) => {
    const newSeatCategories = getSeatTypesForHall(hallId);
    setFormData(prev => ({
      ...prev,
      hall: hallId,
      seatCategories: newSeatCategories
    }));
  };

  // Update price or commission for a seat category (name and capacity are read-only)
  const updateSeatCategoryField = (id: string, field: 'price' | 'commissionPercent', value: number) => {
    setFormData(prev => ({
      ...prev,
      seatCategories: prev.seatCategories.map(cat =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    }));
  };

  // Same for edit modal
  const updateEditSeatCategoryField = (id: string, field: 'price' | 'commissionPercent', value: number) => {
    if (!editFormData) return;
    setEditFormData({
      ...editFormData,
      seatCategories: editFormData.seatCategories.map(cat =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    });
  };

  // Load events from localStorage with migration
  useEffect(() => {
    const savedEvents = localStorage.getItem('theater_events');
    if (savedEvents) {
      let parsedEvents = JSON.parse(savedEvents);
      parsedEvents = parsedEvents.map((event: any) => {
        if (event.description === undefined) event.description = '';
        if (!event.timeSlots && event.date) {
          const timeSlots = [{
            id: generateId(),
            date: event.date,
            startTime: event.time || '10:00',
            endTime: event.endTime || '12:00'
          }];
          return { ...event, timeSlots };
        }
        if (event.seatCategories && event.seatCategories.length > 0 && event.seatCategories[0].commissionPercent === undefined) {
          const seatCategories = event.seatCategories.map((cat: any) => ({
            ...cat,
            commissionPercent: cat.commissionPercent ?? 10
          }));
          const totalManagerEarnings = seatCategories.reduce((sum: number, cat: any) => 
            sum + ((cat.price * (cat.booked || 0)) * (cat.commissionPercent / 100)), 0);
          return { ...event, seatCategories, totalManagerEarnings };
        }
        if (!event.seatCategories) {
          const hallObj = halls.find(h => h.name === event.hall);
          let seatCategories = [];
          if (hallObj) {
            seatCategories = hallObj.seatTypes.map(st => ({
              id: generateId(),
              name: st.name,
              price: event.price || 0,
              capacity: st.capacity,
              booked: event.bookedSeats ? Math.floor(event.bookedSeats * (st.capacity / hallObj.capacity)) : 0,
              commissionPercent: 10
            }));
          } else {
            seatCategories = [{
              id: generateId(),
              name: 'General Admission',
              price: event.price || 0,
              capacity: event.capacity || 500,
              booked: event.bookedSeats || 0,
              commissionPercent: 10
            }];
          }
          const totalBookedSeats = seatCategories.reduce((sum, cat) => sum + (cat.booked || 0), 0);
          const totalRevenue = seatCategories.reduce((sum, cat) => sum + (cat.price * (cat.booked || 0)), 0);
          const totalManagerEarnings = seatCategories.reduce((sum, cat) => 
            sum + ((cat.price * (cat.booked || 0)) * (cat.commissionPercent / 100)), 0);
          return { ...event, seatCategories, totalBookedSeats, totalRevenue, totalManagerEarnings };
        }
        const totalBookedSeats = event.seatCategories.reduce((sum: number, cat: any) => sum + (cat.booked || 0), 0);
        const totalRevenue = event.seatCategories.reduce((sum: number, cat: any) => sum + (cat.price * (cat.booked || 0)), 0);
        const totalManagerEarnings = event.seatCategories.reduce((sum: number, cat: any) => 
          sum + ((cat.price * (cat.booked || 0)) * (cat.commissionPercent / 100)), 0);
        return {
          ...event,
          totalBookedSeats: event.totalBookedSeats ?? totalBookedSeats,
          totalRevenue: event.totalRevenue ?? totalRevenue,
          totalManagerEarnings: event.totalManagerEarnings ?? totalManagerEarnings
        };
      });
      setEvents(parsedEvents);
    } else {
      // Generate mock events with proper seat categories (reduced to 10 events to avoid quota error)
      const generateMockEvents = (): EventData[] => {
        const eventNames = [
          "Summer Music Festival", "Comedy Night", "Rock Revolution", "Shakespeare in the Park",
          "Championship Boxing", "Family Magic Show", "Jazz Evening", "Horror Movie Marathon",
          "Broadway Hits", "Outdoor Expo"
        ];
        const categoriesList = ['concert', 'theater', 'movie', 'comedy', 'sports', 'family'];
        const timeSlotsOptions = [
          { start: "10:00", end: "12:00" }, { start: "14:00", end: "16:00" },
          { start: "18:00", end: "20:00" }, { start: "20:00", end: "22:00" },
          { start: "19:00", end: "23:00" }, { start: "21:00", end: "23:30" }
        ];
        const startDate = new Date(2025, 0, 1);
        const endDate = new Date(2027, 11, 31);
        const eventsList: EventData[] = [];
        
        for (let i = 1; i <= 10; i++) {
          const numSlots = Math.floor(Math.random() * 3) + 1;
          const timeSlots: TimeSlot[] = [];
          for (let s = 0; s < numSlots; s++) {
            const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
            const dateStr = randomDate.toISOString().split('T')[0];
            const slotOpt = timeSlotsOptions[Math.floor(Math.random() * timeSlotsOptions.length)];
            timeSlots.push({
              id: generateId(),
              date: dateStr,
              startTime: slotOpt.start,
              endTime: slotOpt.end
            });
          }
          timeSlots.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          const category = categoriesList[Math.floor(Math.random() * categoriesList.length)];
          const hall = halls[Math.floor(Math.random() * halls.length)];
          const hallName = hall.name;
          const seatCategories = hall.seatTypes.map(st => ({
            id: generateId(),
            name: st.name,
            price: Math.floor(Math.random() * 150) + 20,
            capacity: st.capacity,
            booked: Math.floor(st.capacity * (0.1 + Math.random() * 0.7)),
            commissionPercent: Math.floor(Math.random() * 20) + 5
          }));
          const totalBookedSeats = seatCategories.reduce((sum, cat) => sum + (cat.booked || 0), 0);
          const totalRevenue = seatCategories.reduce((sum, cat) => sum + (cat.price * (cat.booked || 0)), 0);
          const totalManagerEarnings = seatCategories.reduce((sum, cat) => 
            sum + ((cat.price * (cat.booked || 0)) * (cat.commissionPercent / 100)), 0);
          
          let status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' = 'upcoming';
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const earliestDate = new Date(timeSlots[0].date);
          
          if (earliestDate < today) {
            status = Math.random() > 0.9 ? 'cancelled' : 'completed';
          } else if (earliestDate.getTime() === today.getTime()) {
            status = Math.random() > 0.7 ? 'ongoing' : 'upcoming';
          } else {
            status = Math.random() > 0.95 ? 'cancelled' : 'upcoming';
          }
          
          eventsList.push({
            id: i.toString(),
            name: eventNames[(i - 1) % eventNames.length] + ((i > eventNames.length) ? ` ${Math.floor((i - 1) / eventNames.length) + 1}` : ''),
            description: `Experience an unforgettable ${category} event featuring top artists. ${Math.random() > 0.5 ? 'Limited seats!' : 'Book now!'}`,
            timeSlots: timeSlots,
            hall: hallName,
            seatCategories: seatCategories,
            category: category,
            ageRestriction: ['all', '12+', '16+', '18+'][Math.floor(Math.random() * 4)],
            contactEmail: `events${i}@example.com`,
            contactPhone: `+1 234 567 ${8900 + i}`,
            website: Math.random() > 0.7 ? `https://event${i}.com` : '',
            organizer: `Organizer ${Math.floor(Math.random() * 20) + 1}`,
            imageUrl: undefined,
            createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            status: status,
            totalBookedSeats: totalBookedSeats,
            totalRevenue: totalRevenue,
            totalManagerEarnings: totalManagerEarnings,
            contractDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            contractReference: `CTR-${Math.floor(1000 + Math.random() * 9000)}`
          });
        }
        return eventsList.sort((a, b) => new Date(b.timeSlots[0].date).getTime() - new Date(a.timeSlots[0].date).getTime());
      };
      
      const mockEvents = generateMockEvents();
      try {
        localStorage.setItem('theater_events', JSON.stringify(mockEvents));
        setEvents(mockEvents);
      } catch (error) {
        console.warn('localStorage quota exceeded, storing only 5 events');
        const smallerEvents = mockEvents.slice(0, 5);
        localStorage.setItem('theater_events', JSON.stringify(smallerEvents));
        setEvents(smallerEvents);
      }
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      try {
        localStorage.setItem('theater_events', JSON.stringify(events));
      } catch (error) {
        console.warn('Could not save to localStorage (quota exceeded)');
      }
    }
  }, [events]);

  // Filtering helpers
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
  const totalManagerEarnings = filteredEvents.reduce((sum, e) => sum + (e.totalManagerEarnings ?? 0), 0);

  const exportToCSV = () => {
    const headers = ['Name', 'First Date', 'Hall', 'Total Capacity', 'Booked Seats', 'Revenue', 'Manager Earnings', 'Status'];
    const rows = filteredEvents.map(e => {
      const totalCap = e.seatCategories?.reduce((sum, cat) => sum + cat.capacity, 0) ?? 0;
      const firstSlot = e.timeSlots[0];
      return [e.name, `${firstSlot.date} ${firstSlot.startTime}`, e.hall, totalCap, e.totalBookedSeats ?? 0, e.totalRevenue ?? 0, `$${(e.totalManagerEarnings ?? 0).toFixed(2)}`, e.status];
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  // Form change handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    let value: any = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setFormData({ ...formData, [target.name]: value });
    if (errors[target.name]) setErrors({ ...errors, [target.name]: '' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert('Image size should be less than 5MB'); return; }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => { setUploadedImage(reader.result as string); setIsUploading(false); };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => setUploadedImage(null);

  // Time slots management
  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [
        ...prev.timeSlots,
        { id: generateId(), date: '', startTime: '', endTime: '' }
      ]
    }));
  };

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map(slot =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const removeTimeSlot = (id: string) => {
    if (formData.timeSlots.length === 1) {
      alert('You need at least one time slot for the event.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter(slot => slot.id !== id)
    }));
  };

  // Validation
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = 'Event name is required';
      else if (formData.name.length < 3) newErrors.name = 'Event name must be at least 3 characters';
      if (!formData.organizer) newErrors.organizer = 'Organizer is required';
      if (!formData.hall) newErrors.hall = 'Please select a venue';
      if (formData.seatCategories.length === 0) {
        newErrors.seatCategories = 'No seat types defined for this hall.';
      } else {
        for (const cat of formData.seatCategories) {
          if (cat.price <= 0) newErrors[`seat_${cat.id}_price`] = 'Price must be > 0';
          if (cat.commissionPercent < 0 || cat.commissionPercent > 100) newErrors[`seat_${cat.id}_commission`] = 'Commission must be 0-100';
        }
      }
    } else if (currentStep === 2) {
      if (formData.timeSlots.length === 0) {
        newErrors.timeSlots = 'At least one time slot is required';
      } else {
        for (const slot of formData.timeSlots) {
          if (!slot.date) newErrors[`slot_${slot.id}_date`] = 'Date required';
          if (!slot.startTime) newErrors[`slot_${slot.id}_startTime`] = 'Start time required';
          if (!slot.endTime) newErrors[`slot_${slot.id}_endTime`] = 'End time required';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep()) { setCurrentStep(currentStep + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const prevStep = () => setCurrentStep(currentStep - 1);

  const resetForm = () => {
    setFormData({
      name: '', description: '',
      timeSlots: [{ id: generateId(), date: '', startTime: '', endTime: '' }],
      hall: '', seatCategories: [],
      category: '', ageRestriction: '', contactEmail: '', contactPhone: '', website: '',
      organizer: '',
      contractDate: new Date().toISOString().split('T')[0],
      contractReference: ''
    });
    setUploadedImage(null);
    setCurrentStep(1);
    setEditingEvent(null);
  };

  const handleCreateEvent = () => {
    if (validateStep()) {
      const selectedHall = halls.find(h => h.id === formData.hall);
      const newEvent: EventData = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        timeSlots: formData.timeSlots,
        hall: selectedHall?.name || formData.hall,
        seatCategories: formData.seatCategories.map(cat => ({ ...cat, booked: 0 })),
        category: formData.category,
        ageRestriction: formData.ageRestriction,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        website: formData.website,
        organizer: formData.organizer,
        imageUrl: uploadedImage || undefined,
        createdAt: new Date().toISOString(),
        status: 'upcoming',
        totalBookedSeats: 0,
        totalRevenue: 0,
        totalManagerEarnings: 0,
        contractDate: formData.contractDate,
        contractReference: formData.contractReference
      };
      setEvents([newEvent, ...events]);
      setSuccessMessage(`✨ Event "${newEvent.name}" created successfully!`);
      setShowSuccessPopup(true);
      resetForm();
      setTimeout(() => setShowSuccessPopup(false), 3000);
      setViewMode('table');
    }
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
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id ? { ...event, status: 'cancelled' as const } : event
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
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id ? { ...event, status: 'upcoming' as const } : event
      );
      setEvents(updatedEvents);
      setShowCancelModal(false);
      setCancelReason('');
      setSuccessMessage(`🔄 Event "${selectedEvent.name}" has been restored!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  // Edit modal handlers
  const openEditModal = (event: EventData) => {
    setEditingEvent(event);
    const hallObj = halls.find(h => h.name === event.hall);
    const hallId = hallObj?.id || '';
    let seatCategories: SeatCategory[] = [];
    if (hallObj) {
      seatCategories = hallObj.seatTypes.map(st => {
        const existing = event.seatCategories.find(cat => cat.name === st.name);
        return {
          id: existing?.id || generateId(),
          name: st.name,
          price: existing?.price ?? 0,
          capacity: st.capacity,
          booked: existing?.booked ?? 0,
          commissionPercent: existing?.commissionPercent ?? 10
        };
      });
    } else {
      seatCategories = event.seatCategories.map(cat => ({ ...cat }));
    }
    setEditFormData({
      name: event.name,
      description: event.description || '',
      timeSlots: event.timeSlots.map(slot => ({ ...slot })),
      hall: hallId,
      seatCategories: seatCategories,
      category: event.category,
      ageRestriction: event.ageRestriction,
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      website: event.website,
      organizer: event.organizer,
      contractDate: event.contractDate || new Date().toISOString().split('T')[0],
      contractReference: event.contractReference || ''
    });
    setEditUploadedImage(event.imageUrl || null);
    setEditErrors({});
    setShowEditModal(true);
  };

  const addEditTimeSlot = () => {
    if (!editFormData) return;
    setEditFormData({
      ...editFormData,
      timeSlots: [
        ...editFormData.timeSlots,
        { id: generateId(), date: '', startTime: '', endTime: '' }
      ]
    });
  };

  const updateEditTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    if (!editFormData) return;
    setEditFormData({
      ...editFormData,
      timeSlots: editFormData.timeSlots.map(slot =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    });
  };

  const removeEditTimeSlot = (id: string) => {
    if (!editFormData || editFormData.timeSlots.length === 1) return;
    setEditFormData({
      ...editFormData,
      timeSlots: editFormData.timeSlots.filter(slot => slot.id !== id)
    });
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert('Image size should be less than 5MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => setEditUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateEditForm = (): boolean => {
    if (!editFormData) return false;
    const newErrors: Record<string, string> = {};
    if (!editFormData.name) newErrors.name = 'Event name required';
    if (!editFormData.organizer) newErrors.organizer = 'Organizer required';
    if (!editFormData.hall) newErrors.hall = 'Venue required';
    if (editFormData.seatCategories.length === 0) {
      newErrors.seatCategories = 'No seat types';
    } else {
      for (const cat of editFormData.seatCategories) {
        if (cat.price <= 0) newErrors[`seat_${cat.id}_price`] = 'Price > 0';
        if (cat.commissionPercent < 0 || cat.commissionPercent > 100) newErrors[`seat_${cat.id}_commission`] = '0-100';
      }
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
    const updatedEvents = events.map(event =>
      event.id === editingEvent.id ? {
        ...event,
        name: editFormData.name,
        description: editFormData.description,
        timeSlots: editFormData.timeSlots,
        hall: selectedHallObj?.name || editFormData.hall,
        seatCategories: editFormData.seatCategories.map(cat => ({
          ...cat,
          booked: event.seatCategories.find(oc => oc.id === cat.id)?.booked || 0
        })),
        category: editFormData.category,
        ageRestriction: editFormData.ageRestriction,
        contactEmail: editFormData.contactEmail,
        contactPhone: editFormData.contactPhone,
        website: editFormData.website,
        organizer: editFormData.organizer,
        imageUrl: editUploadedImage || event.imageUrl,
        contractDate: editFormData.contractDate,
        contractReference: editFormData.contractReference
      } : event
    );
    const updatedEvent = updatedEvents.find(e => e.id === editingEvent.id);
    if (updatedEvent) {
      updatedEvent.totalBookedSeats = updatedEvent.seatCategories.reduce((sum, cat) => sum + (cat.booked || 0), 0);
      updatedEvent.totalRevenue = updatedEvent.seatCategories.reduce((sum, cat) => sum + (cat.price * (cat.booked || 0)), 0);
      updatedEvent.totalManagerEarnings = updatedEvent.seatCategories.reduce((sum, cat) => 
        sum + ((cat.price * (cat.booked || 0)) * (cat.commissionPercent / 100)), 0);
    }
    setEvents(updatedEvents);
    setSuccessMessage(`✏️ Event "${updatedEvent!.name}" updated successfully!`);
    setShowSuccessPopup(true);
    setShowEditModal(false);
    setEditingEvent(null);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  // Table columns and data
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
    { Header: 'Manager Earnings', accessor: 'managerEarnings', sortable: true, Cell: (row: any) => <span className="text-amber-600 font-semibold">${row.managerEarnings.toLocaleString()}</span> },
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
          <button title="Edit Event" className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors" onClick={() => openEditModal(row.original)}>
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
      managerEarnings: event.totalManagerEarnings ?? 0,
      status: event.status,
      original: event
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
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
        
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* TABLE VIEW */}
        {viewMode === 'table' && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"><div className="flex justify-between items-center mb-2"><Calendar className="h-8 w-8" /><span className="text-2xl font-bold">{filteredEvents.length}</span></div><p className="text-sm">Events in {dateRange}</p></motion.div>
              <motion.div variants={itemVariants} className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"><div className="flex justify-between items-center mb-2"><Ticket className="h-8 w-8" /><span className="text-2xl font-bold">{totalTickets.toLocaleString()}</span></div><p className="text-sm">Tickets Sold</p></motion.div>
              <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"><div className="flex justify-between items-center mb-2"><DollarSign className="h-8 w-8" /><span className="text-2xl font-bold">${totalRevenue.toLocaleString()}</span></div><p className="text-sm">Total Revenue</p></motion.div>
              <motion.div variants={itemVariants} className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg"><div className="flex justify-between items-center mb-2"><Percent className="h-8 w-8" /><span className="text-2xl font-bold">${totalManagerEarnings.toLocaleString()}</span></div><p className="text-sm">Manager Earnings</p></motion.div>
              <motion.div variants={itemVariants} className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"><div className="flex justify-between items-center mb-2"><RefreshCw className="h-8 w-8" /><span className="text-2xl font-bold">+</span></div><p className="text-sm">Create Event</p></motion.div>
            </div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[250px] relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" /><input type="text" placeholder="Search events..." className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <select className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                </select>
                <ReusableButton onClick={() => { resetForm(); setViewMode('form'); }} variant="primary" icon={Plus}>Create Event</ReusableButton>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <ReusableTable columns={tableColumns} data={tableData} title="All Events" showSearch={false} showExport={false} showPrint={false} itemsPerPage={10} />
            </motion.div>
          </motion.div>
        )}

        {/* CREATE EVENT FORM (Multi-step) */}
        {viewMode === 'form' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 pt-8">
              <div className="flex items-center justify-between">
                {[{ step: 1, title: 'Event Info', icon: FileSignature }, { step: 2, title: 'Schedule', icon: Calendar }, { step: 3, title: 'Media & Description', icon: Image }, { step: 4, title: 'Review', icon: CheckCircle }].map((item) => {
                  const status = item.step < currentStep ? 'completed' : item.step === currentStep ? 'current' : 'pending';
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="flex-1 relative">
                      <div className={`h-1 ${status === 'completed' ? 'bg-green-500' : status === 'current' ? 'bg-blue-500' : 'bg-gray-200'}`} />
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${status === 'completed' ? 'bg-green-500 text-white' : status === 'current' ? 'bg-blue-500 text-white ring-4 ring-blue-200' : 'bg-gray-200 text-gray-500'}`}>
                          {status === 'completed' ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                        </div>
                      </div>
                      <p className={`text-center mt-6 text-sm font-medium ${status === 'current' ? 'text-blue-600' : 'text-gray-500'}`}>{item.title}</p>
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
                    <div>
                      <label className="block font-semibold mb-2">Event Name *</label>
                      <input type="text" name="name" className={`w-full p-3 border-2 rounded-xl ${errors.name ? 'border-red-500' : 'border-gray-200'}`} value={formData.name} onChange={handleChange} />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">Organizer *</label>
                      <input type="text" name="organizer" className={`w-full p-3 border-2 rounded-xl ${errors.organizer ? 'border-red-500' : 'border-gray-200'}`} value={formData.organizer} onChange={handleChange} />
                      {errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-2">Contract Date</label>
                      <input type="date" name="contractDate" className="w-full p-3 border-2 border-gray-200 rounded-xl" value={formData.contractDate} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">Contract Reference</label>
                      <input type="text" name="contractReference" className="w-full p-3 border-2 border-gray-200 rounded-xl" placeholder="e.g., CTR-2025-001" value={formData.contractReference} onChange={handleChange} />
                    </div>
                  </div>
                  {/* Venue as Dropdown */}
                  <div>
                    <label className="block font-semibold mb-2">Select Venue *</label>
                    <select
                      className={`w-full p-3 border-2 rounded-xl ${errors.hall ? 'border-red-500' : 'border-gray-200'}`}
                      value={formData.hall}
                      onChange={(e) => handleHallChange(e.target.value)}
                    >
                      <option value="">-- Select a hall --</option>
                      {halls.map(hall => (
                        <option key={hall.id} value={hall.id}>
                          {hall.name} (Capacity: {hall.capacity})
                        </option>
                      ))}
                    </select>
                    {errors.hall && <p className="text-red-500 text-sm mt-1">{errors.hall}</p>}
                  </div>
                  {/* Seat Types & Prices - read-only name & capacity, editable price & commission */}
                  {formData.hall && (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Layers className="h-5 w-5" /> Seat Types & Prices</h3>
                      {errors.seatCategories && <p className="text-red-500 text-sm mb-2">{errors.seatCategories}</p>}
                      <div className="space-y-4">
                        {formData.seatCategories.map(cat => (
                          <div key={cat.id} className="p-4 border rounded-xl bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                              <div>
                                <label className="block text-sm font-medium mb-1">Seat Type</label>
                                <div className="p-2 bg-gray-200 rounded-lg font-semibold">{cat.name}</div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Capacity (fixed)</label>
                                <div className="p-2 bg-gray-200 rounded-lg">{cat.capacity}</div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Price ($) *</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={cat.price}
                                  onChange={e => updateSeatCategoryField(cat.id, 'price', parseFloat(e.target.value))}
                                  className="w-full p-2 border rounded-lg"
                                />
                                {errors[`seat_${cat.id}_price`] && <p className="text-red-500 text-xs">{errors[`seat_${cat.id}_price`]}</p>}
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Commission (%) *</label>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={cat.commissionPercent}
                                  onChange={e => updateSeatCategoryField(cat.id, 'commissionPercent', parseFloat(e.target.value))}
                                  className="w-full p-2 border rounded-lg"
                                />
                                {errors[`seat_${cat.id}_commission`] && <p className="text-red-500 text-xs">{errors[`seat_${cat.id}_commission`]}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2">Age Restriction</label>
                      <select name="ageRestriction" className="w-full p-3 border-2 border-gray-200 rounded-xl" value={formData.ageRestriction} onChange={handleChange}>
                        <option value="">All Ages</option><option value="12+">12+</option><option value="16+">16+</option><option value="18+">18+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">Category</label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map(cat => (
                          <button type="button" key={cat.value} onClick={() => setFormData({...formData, category: cat.value})} className={`p-2 border rounded-lg text-sm ${formData.category === cat.value ? `bg-gradient-to-r ${cat.color} text-white` : 'bg-white'}`}>
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Time Slots */}
              {currentStep === 2 && (
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Clock className="h-5 w-5" /> Event Dates & Times</h3>
                    <ReusableButton onClick={addTimeSlot} variant="primary" size="sm" icon={Plus}>Add Another Time</ReusableButton>
                  </div>
                  {errors.timeSlots && <p className="text-red-500 text-sm">{errors.timeSlots}</p>}
                  <div className="space-y-4">
                    {formData.timeSlots.map((slot, idx) => (
                      <div key={slot.id} className="p-4 border rounded-xl bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium">Time Slot #{idx + 1}</h4>
                          {formData.timeSlots.length > 1 && <ReusableButton onClick={() => removeTimeSlot(slot.id)} variant="danger" size="sm" icon={Trash2}>Remove</ReusableButton>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div><label className="block text-sm font-medium mb-1">Date *</label><input type="date" value={slot.date} onChange={e => updateTimeSlot(slot.id, 'date', e.target.value)} className="w-full p-2 border rounded-lg" />{errors[`slot_${slot.id}_date`] && <p className="text-red-500 text-xs">{errors[`slot_${slot.id}_date`]}</p>}</div>
                          <div><label className="block text-sm font-medium mb-1">Start Time *</label><input type="time" value={slot.startTime} onChange={e => updateTimeSlot(slot.id, 'startTime', e.target.value)} className="w-full p-2 border rounded-lg" />{errors[`slot_${slot.id}_startTime`] && <p className="text-red-500 text-xs">{errors[`slot_${slot.id}_startTime`]}</p>}</div>
                          <div><label className="block text-sm font-medium mb-1">End Time *</label><input type="time" value={slot.endTime} onChange={e => updateTimeSlot(slot.id, 'endTime', e.target.value)} className="w-full p-2 border rounded-lg" />{errors[`slot_${slot.id}_endTime`] && <p className="text-red-500 text-xs">{errors[`slot_${slot.id}_endTime`]}</p>}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Media & Description */}
              {currentStep === 3 && (
                <div className="p-8 space-y-6">
                  <div>
                    {!uploadedImage ? (
                      <div className="border-2 border-dashed rounded-2xl p-8 text-center">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" />
                        <label htmlFor="upload" className="cursor-pointer">
                          <Upload className="h-10 w-10 mx-auto text-gray-400" />
                          <p>Click to upload poster</p>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img src={uploadedImage} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
                        <ReusableButton onClick={handleRemoveImage} variant="danger" size="sm">Remove</ReusableButton>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Event Description</label>
                    <textarea
                      name="description"
                      rows={6}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Provide a detailed description of the event, including highlights, performers, schedule, special notes, etc."
                      value={formData.description}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">Describe what attendees can expect, any special instructions, etc.</p>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="p-8 space-y-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-bold text-lg mb-2">Event Information</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div><span className="font-semibold">Name:</span> {formData.name}</div>
                      <div><span className="font-semibold">Organizer:</span> {formData.organizer}</div>
                      <div><span className="font-semibold">Contract Date:</span> {formData.contractDate}</div>
                      <div><span className="font-semibold">Reference:</span> {formData.contractReference || '—'}</div>
                      <div><span className="font-semibold">Venue:</span> {halls.find(h => h.id === formData.hall)?.name || '—'}</div>
                      <div><span className="font-semibold">Category:</span> {categories.find(c => c.value === formData.category)?.label || '—'}</div>
                      <div><span className="font-semibold">Age Restriction:</span> {formData.ageRestriction || 'All ages'}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-bold text-lg mb-2">Seat Types & Pricing</h3>
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left">Type</th>
                          <th className="p-2 text-left">Price</th>
                          <th className="p-2 text-left">Capacity</th>
                          <th className="p-2 text-left">Commission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.seatCategories.map(cat => (
                          <tr key={cat.id}>
                            <td className="p-2">{cat.name}</td>
                            <td className="p-2">${cat.price}</td>
                            <td className="p-2">{cat.capacity}</td>
                            <td className="p-2">{cat.commissionPercent}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-bold text-lg mb-2">Schedule</h3>
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left">#</th>
                          <th className="p-2 text-left">Date</th>
                          <th className="p-2 text-left">Start</th>
                          <th className="p-2 text-left">End</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.timeSlots.map((slot, idx) => (
                          <tr key={slot.id}>
                            <td className="p-2">{idx + 1}</td>
                            <td className="p-2">{slot.date}</td>
                            <td className="p-2">{slot.startTime}</td>
                            <td className="p-2">{slot.endTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {formData.description && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="font-bold text-lg mb-2">Description</h3>
                      <p className="whitespace-pre-wrap">{formData.description}</p>
                    </div>
                  )}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <AlertCircle className="inline mr-2" /> Please verify all information before submitting.
                  </div>
                </div>
              )}

              <div className="px-8 py-6 bg-gray-50 border-t flex justify-between">
                {currentStep > 1 && <ReusableButton onClick={prevStep} variant="secondary" icon={ChevronLeft}>Previous</ReusableButton>}
                {currentStep < 4 ? <ReusableButton onClick={nextStep} variant="primary" icon={ChevronRight} className="ml-auto">Next Step</ReusableButton> : <ReusableButton type="submit" variant="success" disabled={isUploading} icon={isUploading ? Loader : CheckCircle} className="ml-auto">{isUploading ? 'Processing...' : 'Create Event'}</ReusableButton>}
              </div>
            </form>
          </div>
        )}

        {/* VIEW DETAILS MODAL */}
        {showDetailsModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-2xl font-bold">{selectedEvent.name}</h2>
                <ReusableButton onClick={() => setShowDetailsModal(false)} variant="secondary" size="sm" icon={X}>Close</ReusableButton>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Schedule</h3>
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Start</th>
                        <th className="p-2 text-left">End</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEvent.timeSlots.map(slot => (
                        <tr key={slot.id} className="border-t">
                          <td className="p-2">{slot.date}</td>
                          <td className="p-2">{slot.startTime}</td>
                          <td className="p-2">{slot.endTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div><p className="text-gray-500">Venue</p><p className="font-semibold">{selectedEvent.hall}</p></div>
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Ticket className="h-5 w-5" /> Seat Types & Pricing</h3>
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Price</th>
                        <th className="p-2 text-left">Capacity</th>
                        <th className="p-2 text-left">Booked</th>
                        <th className="p-2 text-left">Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEvent.seatCategories?.map(cat => (
                        <tr key={cat.id} className="border-t">
                          <td className="p-2">{cat.name}</td>
                          <td className="p-2">${cat.price}</td>
                          <td className="p-2">{cat.capacity}</td>
                          <td className="p-2">{cat.booked || 0}</td>
                          <td className="p-2">{cat.commissionPercent}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {selectedEvent.description && (
                  <div className="border-t pt-4">
                    <h3 className="font-bold text-lg mb-2">Description</h3>
                    <p className="whitespace-pre-wrap">{selectedEvent.description}</p>
                  </div>
                )}
                <div className="border-t pt-4"><h3 className="font-bold text-lg">Manager Earnings</h3><p>Total: ${(selectedEvent.totalManagerEarnings ?? 0).toFixed(2)}</p></div>
                <div className="border-t pt-4"><h3 className="font-bold text-lg">Contract Information</h3><div className="grid grid-cols-2 gap-2 text-sm"><div>Date: {selectedEvent.contractDate || '—'}</div><div>Ref: {selectedEvent.contractReference || '—'}</div></div></div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL POPUP */}
        {showEditModal && editFormData && editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center sticky top-0">
                <h2 className="text-2xl font-bold">Edit Event: {editingEvent.name}</h2>
                <ReusableButton onClick={() => setShowEditModal(false)} variant="secondary" size="sm" icon={X}>Cancel</ReusableButton>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block font-semibold mb-1">Event Name *</label><input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full p-2 border rounded-lg" />{editErrors.name && <p className="text-red-500 text-xs">{editErrors.name}</p>}</div>
                  <div><label className="block font-semibold mb-1">Organizer *</label><input type="text" value={editFormData.organizer} onChange={e => setEditFormData({...editFormData, organizer: e.target.value})} className="w-full p-2 border rounded-lg" />{editErrors.organizer && <p className="text-red-500 text-xs">{editErrors.organizer}</p>}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block font-semibold mb-1">Contract Date</label><input type="date" value={editFormData.contractDate} onChange={e => setEditFormData({...editFormData, contractDate: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
                  <div><label className="block font-semibold mb-1">Contract Reference</label><input type="text" value={editFormData.contractReference} onChange={e => setEditFormData({...editFormData, contractReference: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea rows={4} value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
                <div><label className="block font-semibold mb-2">Venue *</label><select value={editFormData.hall} onChange={e => {
                  const newHallId = e.target.value;
                  const hallObj = halls.find(h => h.id === newHallId);
                  if (hallObj) {
                    const newSeatCategories = hallObj.seatTypes.map(st => ({
                      id: generateId(),
                      name: st.name,
                      price: 0,
                      capacity: st.capacity,
                      commissionPercent: 10,
                      booked: 0
                    }));
                    setEditFormData({ ...editFormData, hall: newHallId, seatCategories: newSeatCategories });
                  } else {
                    setEditFormData({ ...editFormData, hall: newHallId });
                  }
                }} className="w-full p-2 border rounded-lg"><option value="">Select hall</option>{halls.map(h => <option key={h.id} value={h.id}>{h.name} (Capacity: {h.capacity})</option>)}</select>{editErrors.hall && <p className="text-red-500 text-xs">{editErrors.hall}</p>}</div>
                {editFormData.hall && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">Seat Types & Prices</h3>
                    {editErrors.seatCategories && <p className="text-red-500 text-sm mb-2">{editErrors.seatCategories}</p>}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {editFormData.seatCategories.map(cat => (
                        <div key={cat.id} className="p-3 border rounded-lg bg-gray-50">
                          <div className="grid grid-cols-4 gap-2 items-center">
                            <div><label className="text-sm font-medium">Type</label><div className="p-1 bg-gray-200 rounded">{cat.name}</div></div>
                            <div><label className="text-sm font-medium">Capacity</label><div className="p-1 bg-gray-200 rounded">{cat.capacity}</div></div>
                            <div><label className="text-sm font-medium">Price ($)</label><input type="number" step="0.01" value={cat.price} onChange={e => updateEditSeatCategoryField(cat.id, 'price', parseFloat(e.target.value))} className="w-full p-1 border rounded" /></div>
                            <div><label className="text-sm font-medium">Commission (%)</label><input type="number" step="0.5" value={cat.commissionPercent} onChange={e => updateEditSeatCategoryField(cat.id, 'commissionPercent', parseFloat(e.target.value))} className="w-full p-1 border rounded" /></div>
                          </div>
                          {(editErrors[`seat_${cat.id}_price`] || editErrors[`seat_${cat.id}_commission`]) && <div className="text-red-500 text-xs mt-1">{editErrors[`seat_${cat.id}_price`]} {editErrors[`seat_${cat.id}_commission`]}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block font-semibold mb-1">Age Restriction</label><select value={editFormData.ageRestriction} onChange={e => setEditFormData({...editFormData, ageRestriction: e.target.value})} className="w-full p-2 border rounded-lg"><option value="">All Ages</option><option value="12+">12+</option><option value="16+">16+</option><option value="18+">18+</option></select></div>
                  <div><label className="block font-semibold mb-1">Category</label><div className="grid grid-cols-2 gap-1">{categories.map(cat => (<button type="button" key={cat.value} onClick={() => setEditFormData({...editFormData, category: cat.value})} className={`p-1 text-xs rounded ${editFormData.category === cat.value ? `bg-gradient-to-r ${cat.color} text-white` : 'bg-gray-100'}`}>{cat.label}</button>))}</div></div>
                </div>
                <div className="border-t pt-4"><div className="flex justify-between items-center mb-3"><h3 className="text-lg font-semibold">Time Slots</h3><ReusableButton onClick={addEditTimeSlot} variant="primary" size="sm" icon={Plus}>Add Slot</ReusableButton></div><div className="space-y-3 max-h-60 overflow-y-auto">{editFormData.timeSlots.map((slot, idx) => (<div key={slot.id} className="p-3 border rounded-lg bg-gray-50"><div className="flex justify-between items-start mb-2"><span className="font-medium">Slot {idx+1}</span>{editFormData.timeSlots.length > 1 && <ReusableButton onClick={() => removeEditTimeSlot(slot.id)} variant="danger" size="sm" icon={Trash2}>Remove</ReusableButton>}</div><div className="grid grid-cols-3 gap-2"><input type="date" value={slot.date} onChange={e => updateEditTimeSlot(slot.id, 'date', e.target.value)} className="p-1 border rounded text-sm" /><input type="time" value={slot.startTime} onChange={e => updateEditTimeSlot(slot.id, 'startTime', e.target.value)} className="p-1 border rounded text-sm" /><input type="time" value={slot.endTime} onChange={e => updateEditTimeSlot(slot.id, 'endTime', e.target.value)} className="p-1 border rounded text-sm" /></div>{(editErrors[`slot_${slot.id}_date`] || editErrors[`slot_${slot.id}_startTime`] || editErrors[`slot_${slot.id}_endTime`]) && (<div className="text-red-500 text-xs mt-1">{editErrors[`slot_${slot.id}_date`]} {editErrors[`slot_${slot.id}_startTime`]} {editErrors[`slot_${slot.id}_endTime`]}</div>)}</div>))}</div></div>
                <div><label className="block font-semibold mb-2">Event Poster</label><div className="flex items-center gap-4">{editUploadedImage ? (<div className="relative w-32 h-32"><img src={editUploadedImage} alt="Preview" className="w-full h-full object-cover rounded-lg" /><button onClick={() => setEditUploadedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="h-4 w-4" /></button></div>) : (<label className="cursor-pointer border-2 border-dashed p-4 rounded-lg text-center"><input type="file" accept="image/*" onChange={handleEditImageUpload} className="hidden" /><Upload className="h-8 w-8 mx-auto text-gray-400" /><span className="text-xs">Upload image</span></label>)}</div></div>
                <div className="flex justify-end gap-3 pt-4 border-t"><ReusableButton onClick={() => setShowEditModal(false)} variant="secondary">Cancel</ReusableButton><ReusableButton onClick={saveEditedEvent} variant="success">Save Changes</ReusableButton></div>
              </div>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
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

        {/* CANCEL MODAL */}
        {showCancelModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center mb-4">{selectedEvent.status === 'cancelled' ? <RefreshCw className="h-16 w-16 text-green-500 mx-auto" /> : <Ban className="h-16 w-16 text-orange-500 mx-auto" />}</div>
              <h2 className="text-xl font-bold text-center mb-2">{selectedEvent.status === 'cancelled' ? 'Uncancel Event' : 'Cancel Event'}</h2>
              <p className="text-gray-600 text-center mb-6">{selectedEvent.status === 'cancelled' ? `Restore "${selectedEvent.name}" to upcoming?` : `Cancel "${selectedEvent.name}"? Bookings will be cancelled.`}</p>
              <div className="flex gap-3"><ReusableButton onClick={() => setShowCancelModal(false)} variant="secondary">Keep as is</ReusableButton><ReusableButton onClick={selectedEvent.status === 'cancelled' ? handleUncancelEvent : handleCancelEvent} variant={selectedEvent.status === 'cancelled' ? 'success' : 'warning'}>{selectedEvent.status === 'cancelled' ? 'Yes, Uncancel' : 'Yes, Cancel'}</ReusableButton></div>
            </div>
          </div>
        )}

        <SuccessPopup message={successMessage} isVisible={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} />
      </div>
    </div>
  );
};

export default CreateEvent;