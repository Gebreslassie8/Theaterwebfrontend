// src/pages/Manager/components/events/CreateEvent.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Users, DollarSign, Image, X, 
  Upload, AlertCircle, CheckCircle, FileText, Phone, 
  Mail, Globe, Star, Award, Ticket, Music, Film,
  Trash2, Eye, Loader, ChevronRight, ChevronLeft, Edit,
  Search, Ban, RefreshCw, Activity, XCircle, Shield, MapPin, Download, Filter,
  Plus
} from 'lucide-react';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';

// --- Types ---
interface EventData {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  hall: string;
  price: number;
  capacity: number;
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
  bookedSeats: number;
  revenue: number;
}

interface FormData {
  name: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  hall: string;
  price: string;
  capacity: string;
  category: string;
  ageRestriction: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  features: string[];
  organizer: string;
  tags: string[];
}

// --- Constants ---
const categories = [
  { value: 'concert', label: 'Concert', icon: Music, color: 'from-purple-500 to-pink-500' },
  { value: 'theater', label: 'Theater', icon: Film, color: 'from-blue-500 to-cyan-500' },
  { value: 'movie', label: 'Movie', icon: Film, color: 'from-red-500 to-orange-500' },
  { value: 'comedy', label: 'Comedy', icon: Star, color: 'from-yellow-500 to-orange-500' },
  { value: 'sports', label: 'Sports', icon: Award, color: 'from-green-500 to-emerald-500' },
  { value: 'family', label: 'Family', icon: Users, color: 'from-indigo-500 to-purple-500' },
];

const halls = [
  { id: 'hall-a', name: 'Grand Hall', capacity: 1500, features: ['AC', 'Dolby Atmos', 'VIP Area'] },
  { id: 'hall-b', name: 'Blue Hall', capacity: 800, features: ['AC', 'Surround Sound'] },
  { id: 'hall-c', name: 'Red Hall', capacity: 500, features: ['Standard Sound', 'AC'] },
  { id: 'vip-hall', name: 'Royal Hall', capacity: 300, features: ['Premium Seats', 'Private Lounge', 'Dolby Atmos'] },
];

const availableFeatures = [
  'VIP Area', 'Wheelchair Access', 'Food Service', 'Bar Service', 
  'Parking Available', 'Air Conditioning', 'Dolby Atmos Sound', 
  '4K Projection', 'Live Streaming', 'Meet & Greet', 'Free WiFi'
];

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

// QuickStatBadge component
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
  const [viewMode, setViewMode] = useState<'form' | 'table'>('table');
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('year');
  const [cancelReason, setCancelReason] = useState('');

  const [formData, setFormData] = useState<FormData>({
    name: '', description: '', date: '', time: '', endTime: '', hall: '',
    price: '', capacity: '', category: '', ageRestriction: '', contactEmail: '',
    contactPhone: '', website: '', features: [], organizer: '', tags: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Load events from localStorage with 35 mock events (2025-2027)
  useEffect(() => {
    const savedEvents = localStorage.getItem('theater_events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      const generateMockEvents = (): EventData[] => {
        const eventNames = [
          "Summer Music Festival", "Comedy Night", "Rock Revolution", "Shakespeare in the Park",
          "Championship Boxing", "Family Magic Show", "Jazz Evening", "Horror Movie Marathon",
          "Broadway Hits", "Outdoor Expo", "Electronic Dance Festival", "Classical Symphony",
          "Stand-up Special", "Indie Film Festival", "Ballet Gala", "Tech Conference",
          "Food & Wine Expo", "Kids' Day Out", "Fashion Show", "Motivational Talk",
          "Art Exhibition", "Poetry Slam", "Wrestling Mania", "Piano Recital",
          "Circus Extravaganza", "Opera Night", "Comic Con", "Charity Gala",
          "Yoga Retreat", "Coding Bootcamp", "Startup Pitch Night", "Wedding Expo"
        ];
        
        const categoriesList = ['concert', 'theater', 'movie', 'comedy', 'sports', 'family'];
        const hallsList = ['Grand Hall', 'Blue Hall', 'Red Hall', 'Royal Hall'];
        const timeSlots = [
          { start: "10:00", end: "12:00" }, { start: "14:00", end: "16:00" },
          { start: "18:00", end: "20:00" }, { start: "20:00", end: "22:00" },
          { start: "19:00", end: "23:00" }, { start: "21:00", end: "23:30" }
        ];
        
        const featuresSet = [
          ['VIP Area', 'Food Service'], ['Bar Service', 'AC'], ['Wheelchair Access', 'Free WiFi'],
          ['Parking Available', 'Dolby Atmos Sound'], ['4K Projection', 'Live Streaming'],
          ['Meet & Greet', 'Premium Seats'], ['Private Lounge', 'Surround Sound']
        ];
        
        const tagsSet = [
          ['Exclusive', 'Music'], ['Group Discount'], ['Rock', 'Loud'], ['Classic', 'Shakespeare'],
          ['Boxing', 'PPV'], ['Family', 'Magic'], ['Jazz', 'Relaxed'], ['Horror', 'Halloween'],
          ['Musical', 'Premium'], ['Expo', 'Outdoor'], ['EDM', 'Festival'], ['Symphony', 'Classical'],
          ['Comedy', 'Adult'], ['Indie', 'Film'], ['Ballet', 'Elegant'], ['Tech', 'Networking'],
          ['Wine', 'Gourmet'], ['Kids', 'Fun'], ['Fashion', 'Runway'], ['Inspiration', 'Motivation']
        ];
        
        const startDate = new Date(2025, 0, 1);
        const endDate = new Date(2027, 11, 31);
        const eventsList: EventData[] = [];
        
        for (let i = 1; i <= 35; i++) {
          const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
          const dateStr = randomDate.toISOString().split('T')[0];
          const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
          const category = categoriesList[Math.floor(Math.random() * categoriesList.length)];
          const hallName = hallsList[Math.floor(Math.random() * hallsList.length)];
          const hallCapacity = hallName === 'Grand Hall' ? 1500 : hallName === 'Blue Hall' ? 800 : hallName === 'Red Hall' ? 500 : 300;
          const price = Math.floor(Math.random() * 250) + 20;
          const capacity = hallCapacity;
          let bookedSeats = 0;
          let revenue = 0;
          let status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' = 'upcoming';
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const eventDate = new Date(dateStr);
          
          if (eventDate < today) {
            status = Math.random() > 0.9 ? 'cancelled' : 'completed';
            bookedSeats = status === 'cancelled' ? 0 : Math.floor(capacity * (0.3 + Math.random() * 0.6));
            revenue = bookedSeats * price;
          } else if (eventDate.getTime() === today.getTime()) {
            status = Math.random() > 0.7 ? 'ongoing' : 'upcoming';
            bookedSeats = Math.floor(capacity * (0.2 + Math.random() * 0.7));
            revenue = bookedSeats * price;
          } else {
            status = Math.random() > 0.95 ? 'cancelled' : 'upcoming';
            bookedSeats = status === 'cancelled' ? 0 : Math.floor(capacity * (0.1 + Math.random() * 0.6));
            revenue = bookedSeats * price;
          }
          
          if (i % 5 === 0 && status !== 'cancelled') {
            bookedSeats = Math.floor(capacity * (0.8 + Math.random() * 0.2));
            revenue = bookedSeats * price;
          }
          
          eventsList.push({
            id: i.toString(),
            name: eventNames[(i - 1) % eventNames.length] + ((i > eventNames.length) ? ` ${Math.floor((i - 1) / eventNames.length) + 1}` : ''),
            description: `Experience an unforgettable ${category} event featuring top artists and amazing atmosphere. ${Math.random() > 0.5 ? 'Limited seats available!' : 'Book your tickets now!'}`,
            date: dateStr,
            time: timeSlot.start,
            endTime: timeSlot.end,
            hall: hallName,
            price: price,
            capacity: capacity,
            category: category,
            ageRestriction: ['all', '12+', '16+', '18+'][Math.floor(Math.random() * 4)],
            contactEmail: `events${i}@example.com`,
            contactPhone: `+1 234 567 ${8900 + i}`,
            website: Math.random() > 0.7 ? `https://event${i}.com` : '',
            features: featuresSet[Math.floor(Math.random() * featuresSet.length)],
            organizer: `Organizer ${Math.floor(Math.random() * 20) + 1}`,
            tags: tagsSet[Math.floor(Math.random() * tagsSet.length)],
            imageUrl: undefined,
            createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            status: status,
            bookedSeats: bookedSeats,
            revenue: revenue
          });
        }
        return eventsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      };
      
      const mockEvents = generateMockEvents();
      setEvents(mockEvents);
      localStorage.setItem('theater_events', JSON.stringify(mockEvents));
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) localStorage.setItem('theater_events', JSON.stringify(events));
  }, [events]);

  // Date range filter
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
    const { start, end } = getDateRangeFilter(dateRange);
    const eventDate = new Date(event.date);
    const matchesDateRange = eventDate >= start && eventDate <= end;
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const totalRevenue = filteredEvents.reduce((sum, e) => sum + e.revenue, 0);
  const totalTickets = filteredEvents.reduce((sum, e) => sum + e.bookedSeats, 0);

  const exportToCSV = () => {
    const headers = ['Name', 'Date', 'Time', 'Hall', 'Price', 'Capacity', 'Booked Seats', 'Revenue', 'Status'];
    const rows = filteredEvents.map(e => [
      e.name, e.date, `${e.time} - ${e.endTime}`, e.hall, e.price, e.capacity, e.bookedSeats, e.revenue, e.status
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events_${dateRange}_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature) ? prev.features.filter(f => f !== feature) : [...prev.features, feature]
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
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

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = 'Event name is required';
      else if (formData.name.length < 3) newErrors.name = 'Event name must be at least 3 characters';
      if (!formData.category) newErrors.category = 'Please select a category';
      if (!formData.organizer) newErrors.organizer = 'Organizer name is required';
    } else if (currentStep === 2) {
      if (!formData.date) newErrors.date = 'Event date is required';
      if (!formData.time) newErrors.time = 'Start time is required';
      if (!formData.endTime) newErrors.endTime = 'End time is required';
      if (!formData.hall) newErrors.hall = 'Please select a hall';
    } else if (currentStep === 3) {
      if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid ticket price is required';
      if (!formData.capacity || parseInt(formData.capacity) <= 0) newErrors.capacity = 'Valid capacity is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep()) { setCurrentStep(currentStep + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const prevStep = () => setCurrentStep(currentStep - 1);

  const resetForm = () => {
    setFormData({
      name: '', description: '', date: '', time: '', endTime: '', hall: '',
      price: '', capacity: '', category: '', ageRestriction: '', contactEmail: '',
      contactPhone: '', website: '', features: [], organizer: '', tags: []
    });
    setUploadedImage(null);
    setTagInput('');
    setCurrentStep(1);
    setEditingEvent(null);
  };

  const handleCreateEvent = () => {
    if (validateStep()) {
      const newEvent: EventData = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        endTime: formData.endTime,
        hall: halls.find(h => h.id === formData.hall)?.name || formData.hall,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        category: formData.category,
        ageRestriction: formData.ageRestriction,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        website: formData.website,
        features: formData.features,
        organizer: formData.organizer,
        tags: formData.tags,
        imageUrl: uploadedImage || undefined,
        createdAt: new Date().toISOString(),
        status: 'upcoming',
        bookedSeats: 0,
        revenue: 0
      };
      setEvents([newEvent, ...events]);
      setSuccessMessage(`✨ Event "${newEvent.name}" created successfully!`);
      setShowSuccessPopup(true);
      resetForm();
      setTimeout(() => setShowSuccessPopup(false), 3000);
      setViewMode('table');
    }
  };

  const handleUpdateEvent = () => {
    if (editingEvent && validateStep()) {
      const updatedEvents = events.map(event =>
        event.id === editingEvent.id ? {
          ...event,
          name: formData.name,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          endTime: formData.endTime,
          hall: halls.find(h => h.id === formData.hall)?.name || formData.hall,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
          category: formData.category,
          ageRestriction: formData.ageRestriction,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          website: formData.website,
          features: formData.features,
          organizer: formData.organizer,
          tags: formData.tags,
          imageUrl: uploadedImage || event.imageUrl
        } : event
      );
      setEvents(updatedEvents);
      setSuccessMessage(`✏️ Event "${editingEvent.name}" updated successfully!`);
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

  // Cancel event – append reason to description
  const handleCancelEvent = () => {
    if (selectedEvent) {
      let newDescription = selectedEvent.description;
      // Remove any existing cancellation note
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

  // Uncancel event – remove cancellation note
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

  const handleEditEvent = (event: EventData) => {
    setEditingEvent(event);
    const selectedHall = halls.find(h => h.name === event.hall);
    // Remove cancellation note from description when editing
    const cleanDescription = event.description.replace(/ \[CANCELLED:.*?\]/, '');
    setFormData({
      name: event.name,
      description: cleanDescription,
      date: event.date,
      time: event.time,
      endTime: event.endTime,
      hall: selectedHall?.id || '',
      price: event.price.toString(),
      capacity: event.capacity.toString(),
      category: event.category,
      ageRestriction: event.ageRestriction,
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      website: event.website,
      features: event.features,
      organizer: event.organizer,
      tags: event.tags
    });
    setUploadedImage(event.imageUrl || null);
    setCurrentStep(1);
    setViewMode('form');
  };

  // Table columns with icon-only actions
  const tableColumns = [
    { Header: 'Event Name', accessor: 'name', sortable: true },
    { Header: 'Date & Time', accessor: 'dateTime', sortable: true, Cell: (row: any) => <>{row.date}<br/><span className="text-xs text-gray-500">{row.time}</span></> },
    { Header: 'Hall', accessor: 'hall', sortable: true },
    { Header: 'Tickets', accessor: 'tickets', sortable: true, Cell: (row: any) => (
      <div><span className="font-medium">{row.bookedSeats.toLocaleString()} / {row.capacity.toLocaleString()}</span>
      <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(row.bookedSeats / row.capacity) * 100}%` }} /></div></div>
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
          <button title="Edit Event" className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors" onClick={() => handleEditEvent(row.original)}>
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

  const tableData = filteredEvents.map(event => ({
    id: event.id,
    name: event.name,
    date: event.date,
    time: `${event.time} - ${event.endTime}`,
    hall: event.hall,
    bookedSeats: event.bookedSeats,
    capacity: event.capacity,
    revenue: event.revenue,
    status: event.status,
    original: event
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Admin Dashboard Style Header */}
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
          <motion.h1 className="text-4xl font-bold mb-2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>Welcome back, Administrator!</motion.h1>
          <motion.p className="text-white/80 text-lg" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>Here's what's happening with your events today</motion.p>
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
        {/* TABLE VIEW */}
        {viewMode === 'table' && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"><div className="flex justify-between items-center mb-2"><Calendar className="h-8 w-8" /><span className="text-2xl font-bold">{filteredEvents.length}</span></div><p className="text-sm">Events in {dateRange}</p></motion.div>
              <motion.div variants={itemVariants} className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"><div className="flex justify-between items-center mb-2"><Ticket className="h-8 w-8" /><span className="text-2xl font-bold">{totalTickets.toLocaleString()}</span></div><p className="text-sm">Tickets Sold</p></motion.div>
              <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"><div className="flex justify-between items-center mb-2"><DollarSign className="h-8 w-8" /><span className="text-2xl font-bold">${totalRevenue.toLocaleString()}</span></div><p className="text-sm">Total Revenue</p></motion.div>
              <motion.div variants={itemVariants} className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg"><div className="flex justify-between items-center mb-2"><RefreshCw className="h-8 w-8" /><span className="text-2xl font-bold">+</span></div><p className="text-sm">Create New Event</p></motion.div>
            </div>

            {/* Search & Filter */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[250px] relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" /><input type="text" placeholder="Search events by name..." className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                <select className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                </select>
                <ReusableButton onClick={() => { resetForm(); setViewMode('form'); }} variant="primary" icon={Plus}>Create Event</ReusableButton>
              </div>
            </motion.div>

            {/* Table */}
            <motion.div variants={itemVariants}>
              <ReusableTable columns={tableColumns} data={tableData} title="All Events" showSearch={false} showExport={false} showPrint={false} itemsPerPage={10} />
            </motion.div>
          </motion.div>
        )}

        {/* FORM VIEW - Multi-step */}
        {viewMode === 'form' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 pt-8">
              <div className="flex items-center justify-between">
                {[{ step: 1, title: 'Basic Info', icon: FileText }, { step: 2, title: 'Schedule', icon: Calendar }, { step: 3, title: 'Pricing', icon: DollarSign }, { step: 4, title: 'Media', icon: Image }, { step: 5, title: 'Review', icon: CheckCircle }].map((item) => {
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

            <form onSubmit={(e) => { e.preventDefault(); editingEvent ? handleUpdateEvent() : handleCreateEvent(); }}>
              {currentStep === 1 && (
                <div className="p-8 space-y-6">
                  <div><label className="block font-semibold mb-2">Event Name *</label><input type="text" name="name" className={`w-full p-3 border-2 rounded-xl ${errors.name ? 'border-red-500' : 'border-gray-200'}`} value={formData.name} onChange={handleChange} />{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}</div>
                  <div><label className="block font-semibold mb-2">Description</label><textarea name="description" rows={4} className="w-full p-3 border-2 border-gray-200 rounded-xl" value={formData.description} onChange={handleChange} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block font-semibold mb-2">Category *</label><div className="grid grid-cols-2 gap-2">{categories.map(cat => (<button type="button" key={cat.value} onClick={() => setFormData({...formData, category: cat.value})} className={`p-2 border rounded-lg text-sm ${formData.category === cat.value ? `bg-gradient-to-r ${cat.color} text-white` : 'bg-white'}`}>{cat.label}</button>))}</div>{errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}</div>
                    <div><label className="block font-semibold mb-2">Organizer *</label><input type="text" name="organizer" className="w-full p-3 border-2 border-gray-200 rounded-xl" value={formData.organizer} onChange={handleChange} />{errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block font-semibold mb-2">Contact Email</label><input type="email" name="contactEmail" className="w-full p-3 border-2 border-gray-200 rounded-xl" value={formData.contactEmail} onChange={handleChange} /></div>
                    <div><label className="block font-semibold mb-2">Contact Phone</label><input type="tel" name="contactPhone" className="w-full p-3 border-2 border-gray-200 rounded-xl" value={formData.contactPhone} onChange={handleChange} /></div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block font-semibold mb-2">Date *</label><input type="date" name="date" className={`w-full p-3 border-2 rounded-xl ${errors.date ? 'border-red-500' : 'border-gray-200'}`} value={formData.date} onChange={handleChange} />{errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}</div>
                    <div><label className="block font-semibold mb-2">Start Time *</label><input type="time" name="time" className={`w-full p-3 border-2 rounded-xl ${errors.time ? 'border-red-500' : 'border-gray-200'}`} value={formData.time} onChange={handleChange} />{errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}</div>
                    <div><label className="block font-semibold mb-2">End Time *</label><input type="time" name="endTime" className={`w-full p-3 border-2 rounded-xl ${errors.endTime ? 'border-red-500' : 'border-gray-200'}`} value={formData.endTime} onChange={handleChange} />{errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}</div>
                  </div>
                  <div><label className="block font-semibold mb-2">Select Venue *</label><div className="grid grid-cols-2 gap-3">{halls.map(hall => (<button type="button" key={hall.id} onClick={() => setFormData({...formData, hall: hall.id})} className={`p-3 border-2 rounded-xl text-left ${formData.hall === hall.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}><div className="font-bold">{hall.name}</div><div className="text-sm text-gray-500">Capacity: {hall.capacity}</div></button>))}</div>{errors.hall && <p className="text-red-500 text-sm mt-1">{errors.hall}</p>}</div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block font-semibold mb-2">Ticket Price ($) *</label><input type="number" name="price" step="0.01" className={`w-full p-3 border-2 rounded-xl ${errors.price ? 'border-red-500' : 'border-gray-200'}`} value={formData.price} onChange={handleChange} />{errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}</div>
                    <div><label className="block font-semibold mb-2">Capacity *</label><input type="number" name="capacity" className={`w-full p-3 border-2 rounded-xl ${errors.capacity ? 'border-red-500' : 'border-gray-200'}`} value={formData.capacity} onChange={handleChange} />{errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}</div>
                  </div>
                  <div><label className="block font-semibold mb-2">Age Restriction</label><select name="ageRestriction" className="w-full p-3 border-2 border-gray-200 rounded-xl" value={formData.ageRestriction} onChange={handleChange}><option value="">All Ages</option><option value="12+">12+</option><option value="16+">16+</option><option value="18+">18+</option></select></div>
                  <div><label className="block font-semibold mb-2">Features</label><div className="grid grid-cols-3 gap-2">{availableFeatures.map(f => (<label key={f} className="flex items-center gap-2"><input type="checkbox" checked={formData.features.includes(f)} onChange={() => handleFeatureToggle(f)} />{f}</label>))}</div></div>
                  <div><label className="block font-semibold mb-2">Tags</label><div className="flex gap-2"><input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAddTag()} className="flex-1 p-3 border-2 border-gray-200 rounded-xl" /><ReusableButton onClick={handleAddTag} variant="primary">Add</ReusableButton></div><div className="flex flex-wrap gap-2 mt-2">{formData.tags.map(t => (<span key={t} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center gap-1">#{t}<button onClick={() => handleRemoveTag(t)}><X className="h-3 w-3" /></button></span>))}</div></div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="p-8 space-y-6">
                  <div>{!uploadedImage ? (<div className="border-2 border-dashed rounded-2xl p-8 text-center"><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" /><label htmlFor="upload" className="cursor-pointer"><Upload className="h-10 w-10 mx-auto text-gray-400" /><p>Click to upload poster</p></label></div>) : (<div className="relative"><img src={uploadedImage} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" /><ReusableButton onClick={handleRemoveImage} variant="danger" size="sm">Remove</ReusableButton></div>)}</div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                    <div><p className="font-semibold">Event Name</p><p>{formData.name || '—'}</p></div>
                    <div><p className="font-semibold">Category</p><p>{categories.find(c => c.value === formData.category)?.label || '—'}</p></div>
                    <div><p className="font-semibold">Date</p><p>{formData.date || '—'}</p></div>
                    <div><p className="font-semibold">Time</p><p>{formData.time} - {formData.endTime}</p></div>
                    <div><p className="font-semibold">Venue</p><p>{halls.find(h => h.id === formData.hall)?.name || '—'}</p></div>
                    <div><p className="font-semibold">Price</p><p>${formData.price}</p></div>
                    <div><p className="font-semibold">Capacity</p><p>{formData.capacity} seats</p></div>
                    <div><p className="font-semibold">Features</p><p>{formData.features.join(', ') || 'None'}</p></div>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4"><AlertCircle className="inline mr-2" />Please verify all information before submitting.</div>
                </div>
              )}

              <div className="px-8 py-6 bg-gray-50 border-t flex justify-between">
                {currentStep > 1 && <ReusableButton onClick={prevStep} variant="secondary" icon={ChevronLeft}>Previous</ReusableButton>}
                {currentStep < 5 ? <ReusableButton onClick={nextStep} variant="primary" icon={ChevronRight} className="ml-auto">Next Step</ReusableButton> : <ReusableButton type="submit" variant="success" disabled={isUploading} icon={isUploading ? Loader : CheckCircle} className="ml-auto">{isUploading ? 'Processing...' : (editingEvent ? 'Update Event' : 'Create Event')}</ReusableButton>}
              </div>
            </form>
          </div>
        )}

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
                  <div><p className="text-gray-500">Date</p><p className="font-semibold">{selectedEvent.date}</p></div>
                  <div><p className="text-gray-500">Time</p><p className="font-semibold">{selectedEvent.time} - {selectedEvent.endTime}</p></div>
                  <div><p className="text-gray-500">Venue</p><p className="font-semibold">{selectedEvent.hall}</p></div>
                  <div><p className="text-gray-500">Price</p><p className="font-semibold text-green-600">${selectedEvent.price}</p></div>
                  <div><p className="text-gray-500">Capacity</p><p className="font-semibold">{selectedEvent.capacity} seats</p></div>
                  <div><p className="text-gray-500">Booked Seats</p><p className="font-semibold">{selectedEvent.bookedSeats}</p></div>
                  <div><p className="text-gray-500">Revenue</p><p className="font-semibold text-green-600">${selectedEvent.revenue.toLocaleString()}</p></div>
                  <div><p className="text-gray-500">Status</p><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>{selectedEvent.status}</span></div>
                </div>
                <div><p className="text-gray-500">Description</p><p className="text-gray-700">{selectedEvent.description}</p></div>
                {selectedEvent.features.length > 0 && (<div><p className="text-gray-500">Features</p><div className="flex flex-wrap gap-1">{selectedEvent.features.map((f,i) => (<span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">✓ {f}</span>))}</div></div>)}
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

        {/* Cancel/Uncancel Confirmation Modal with reason input */}
        {showCancelModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center mb-4">
                {selectedEvent.status === 'cancelled' ? (
                  <RefreshCw className="h-16 w-16 text-green-500 mx-auto" />
                ) : (
                  <Ban className="h-16 w-16 text-orange-500 mx-auto" />
                )}
              </div>
              <h2 className="text-xl font-bold text-center mb-2">
                {selectedEvent.status === 'cancelled' ? 'Uncancel Event' : 'Cancel Event'}
              </h2>
              <p className="text-gray-600 text-center mb-6">
                {selectedEvent.status === 'cancelled'
                  ? `Are you sure you want to restore "${selectedEvent.name}" to upcoming status? Bookings will be reopened.`
                  : `Are you sure you want to cancel "${selectedEvent.name}"? This will cancel all bookings.`}
              </p>
              {selectedEvent.status !== 'cancelled' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Reason (optional)</label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Why is this event being cancelled?"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                </div>
              )}
              <div className="flex gap-3">
                <ReusableButton onClick={() => { setShowCancelModal(false); setCancelReason(''); }} variant="secondary">Keep as is</ReusableButton>
                <ReusableButton
                  onClick={selectedEvent.status === 'cancelled' ? handleUncancelEvent : handleCancelEvent}
                  variant={selectedEvent.status === 'cancelled' ? 'success' : 'warning'}
                >
                  {selectedEvent.status === 'cancelled' ? 'Yes, Uncancel' : 'Yes, Cancel Event'}
                </ReusableButton>
              </div>
            </div>
          </div>
        )}

        {/* Success Popup */}
        <SuccessPopup message={successMessage} isVisible={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} />
      </div>
    </div>
  );
};

export default CreateEvent;