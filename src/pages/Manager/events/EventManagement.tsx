// src/pages/Manager/components/events/EventManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Users, DollarSign, Edit, Trash2, 
  Eye, Plus, Search, Filter, Download, Printer, Mail, 
  CheckCircle, XCircle, AlertCircle, Info, Copy, Share2,
  MoreVertical, ChevronDown, ChevronUp, TrendingUp, Ticket,
  Award, Star, Heart, Zap, Shield, Music, Film, Coffee,
  MessageCircle, Bell, Clock as ClockIcon, Ban, RefreshCw,
  Save, X, Upload, Image, Tag, Phone, Globe, Link,
  Activity // Added missing Activity import
} from 'lucide-react';

interface Event {
  id: number;
  name: string;
  description: string;
  category: string;
  date: string;
  time: string;
  endTime: string;
  hall: string;
  totalSeats: number;
  bookedSeats: number;
  price: number;
  revenue: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  image?: string;
  organizer: string;
  contactEmail: string;
  contactPhone: string;
  features: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Booking {
  id: string;
  eventId: number;
  seatNumber: string;
  customerName: string;
  phone: string;
  email: string;
  price: number;
  bookingTime: string;
  status: 'confirmed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  transactionId: string;
}

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentEventForAction, setCurrentEventForAction] = useState<Event | null>(null);
  
  // Form state for create/edit
  const [eventForm, setEventForm] = useState<Partial<Event>>({
    name: '',
    description: '',
    category: '',
    date: '',
    time: '',
    endTime: '',
    hall: '',
    totalSeats: 0,
    price: 0,
    organizer: '',
    contactEmail: '',
    contactPhone: '',
    features: [],
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Mock data initialization
  useEffect(() => {
    // Mock events data
    const mockEvents: Event[] = [
      {
        id: 1,
        name: "Summer Music Festival",
        description: "An amazing summer music festival featuring top artists from around the world. Enjoy live performances, food stalls, and an unforgettable experience.",
        category: "concert",
        date: "2024-07-15",
        time: "19:00",
        endTime: "23:00",
        hall: "Grand Hall",
        totalSeats: 1500,
        bookedSeats: 1245,
        price: 150,
        revenue: 186750,
        status: 'upcoming',
        organizer: "Events Management Co.",
        contactEmail: "events@example.com",
        contactPhone: "+1 234 567 8900",
        features: ["VIP Area", "Food Service", "Bar Service", "Parking Available", "AC"],
        tags: ["Exclusive", "Limited Seats", "Early Bird"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "Comedy Night",
        description: "A hilarious night of stand-up comedy featuring the best comedians. Perfect for a fun evening with friends and family.",
        category: "comedy",
        date: "2024-07-18",
        time: "20:00",
        endTime: "22:30",
        hall: "Blue Hall",
        totalSeats: 800,
        bookedSeats: 678,
        price: 75,
        revenue: 50850,
        status: 'upcoming',
        organizer: "Comedy Club International",
        contactEmail: "comedy@example.com",
        contactPhone: "+1 234 567 8901",
        features: ["Bar Service", "AC", "Wheelchair Access"],
        tags: ["Group Discount", "Student Offer"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        name: "Movie Premiere: The Epic",
        description: "Exclusive premiere of the most anticipated movie of the year. Red carpet event with special appearances.",
        category: "movie",
        date: "2024-07-20",
        time: "18:30",
        endTime: "21:00",
        hall: "Red Hall",
        totalSeats: 500,
        bookedSeats: 489,
        price: 120,
        revenue: 58680,
        status: 'ongoing',
        organizer: "Premier Pictures",
        contactEmail: "premiere@example.com",
        contactPhone: "+1 234 567 8902",
        features: ["4K Projection", "Dolby Atmos", "VIP Lounge"],
        tags: ["Limited Seats", "VIP Experience"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        name: "Traditional Theater Play",
        description: "A beautiful traditional theater performance showcasing local talent and cultural heritage.",
        category: "theater",
        date: "2024-07-22",
        time: "18:00",
        endTime: "20:30",
        hall: "Grand Hall",
        totalSeats: 1200,
        bookedSeats: 892,
        price: 90,
        revenue: 80280,
        status: 'upcoming',
        organizer: "Cultural Arts Center",
        contactEmail: "theater@example.com",
        contactPhone: "+1 234 567 8903",
        features: ["AC", "Wheelchair Access", "Live Orchestra"],
        tags: ["Cultural", "Family Friendly"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Mock bookings data
    const mockBookings: Booking[] = [
      {
        id: 'BKG001',
        eventId: 1,
        seatNumber: 'A12',
        customerName: 'John Doe',
        phone: '+1 234 567 8900',
        email: 'john@example.com',
        price: 150,
        bookingTime: new Date().toISOString(),
        status: 'confirmed',
        paymentMethod: 'credit_card',
        transactionId: 'TXN123456'
      },
      {
        id: 'BKG002',
        eventId: 1,
        seatNumber: 'A13',
        customerName: 'Jane Smith',
        phone: '+1 234 567 8901',
        email: 'jane@example.com',
        price: 150,
        bookingTime: new Date().toISOString(),
        status: 'confirmed',
        paymentMethod: 'mobile_money',
        transactionId: 'TXN123457'
      },
      {
        id: 'BKG003',
        eventId: 2,
        seatNumber: 'B05',
        customerName: 'Mike Johnson',
        phone: '+1 234 567 8902',
        email: 'mike@example.com',
        price: 75,
        bookingTime: new Date().toISOString(),
        status: 'confirmed',
        paymentMethod: 'cash',
        transactionId: 'TXN123458'
      }
    ];

    setEvents(mockEvents);
    setBookings(mockBookings);
  }, []);

  const categories = [
    { value: 'concert', label: 'Concert', icon: Music, color: 'from-purple-500 to-pink-500' },
    { value: 'theater', label: 'Theater', icon: Film, color: 'from-blue-500 to-cyan-500' },
    { value: 'movie', label: 'Movie', icon: Film, color: 'from-red-500 to-orange-500' },
    { value: 'comedy', label: 'Comedy', icon: Star, color: 'from-yellow-500 to-orange-500' },
    { value: 'sports', label: 'Sports', icon: Award, color: 'from-green-500 to-emerald-500' },
    { value: 'family', label: 'Family', icon: Users, color: 'from-indigo-500 to-purple-500' },
  ];

  const halls = [
    { id: 'grand-hall', name: 'Grand Hall', capacity: 1500 },
    { id: 'blue-hall', name: 'Blue Hall', capacity: 800 },
    { id: 'red-hall', name: 'Red Hall', capacity: 500 },
    { id: 'vip-hall', name: 'VIP Hall', capacity: 300 },
  ];

  const availableFeatures = [
    'VIP Area', 'Wheelchair Access', 'Food Service', 'Bar Service', 
    'Parking Available', 'Air Conditioning', 'Dolby Atmos Sound', 
    '4K Projection', 'Live Streaming', 'Meet & Greet'
  ];

  const popularTags = ['Exclusive', 'Limited Seats', 'Early Bird', 'Group Discount', 'Student Offer', 'VIP Experience'];

  const getStatusColor = (status: string) => {
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
      case 'upcoming': return <ClockIcon className="h-4 w-4" />;
      case 'ongoing': return <Activity className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const handleCreateEvent = () => {
    if (!eventForm.name || !eventForm.date || !eventForm.time || !eventForm.hall) {
      alert('Please fill in all required fields');
      return;
    }

    const newEvent: Event = {
      id: events.length + 1,
      name: eventForm.name!,
      description: eventForm.description || '',
      category: eventForm.category!,
      date: eventForm.date!,
      time: eventForm.time!,
      endTime: eventForm.endTime || '',
      hall: eventForm.hall!,
      totalSeats: eventForm.totalSeats!,
      bookedSeats: 0,
      price: eventForm.price!,
      revenue: 0,
      status: 'upcoming',
      organizer: eventForm.organizer || '',
      contactEmail: eventForm.contactEmail || '',
      contactPhone: eventForm.contactPhone || '',
      features: eventForm.features || [],
      tags: eventForm.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEvents([...events, newEvent]);
    setShowCreateModal(false);
    setSuccessMessage(`✨ Event "${newEvent.name}" created successfully!`);
    setShowSuccessPopup(true);
    resetForm();
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleUpdateEvent = () => {
    if (!currentEventForAction) return;

    const updatedEvents = events.map(event => 
      event.id === currentEventForAction.id 
        ? { ...event, ...eventForm, updatedAt: new Date().toISOString() }
        : event
    );

    setEvents(updatedEvents);
    setShowEditModal(false);
    setSuccessMessage(`✏️ Event "${currentEventForAction.name}" updated successfully!`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleDeleteEvent = () => {
    if (!currentEventForAction) return;

    const updatedEvents = events.filter(event => event.id !== currentEventForAction.id);
    setEvents(updatedEvents);
    setShowDeleteModal(false);
    setSuccessMessage(`🗑️ Event "${currentEventForAction.name}" has been deleted.`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleCancelEvent = () => {
    if (!currentEventForAction) return;

    const updatedEvents = events.map(event =>
      event.id === currentEventForAction.id
        ? { ...event, status: 'cancelled' as const, updatedAt: new Date().toISOString() }
        : event
    );

    setEvents(updatedEvents);
    setShowCancelModal(false);
    setSuccessMessage(`⚠️ Event "${currentEventForAction.name}" has been cancelled. All bookings will be refunded.`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleFeatureToggle = (feature: string) => {
    setEventForm(prev => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...(prev.features || []), feature]
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !eventForm.tags?.includes(tagInput.trim())) {
      setEventForm(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEventForm(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag)
    }));
  };

  const resetForm = () => {
    setEventForm({
      name: '',
      description: '',
      category: '',
      date: '',
      time: '',
      endTime: '',
      hall: '',
      totalSeats: 0,
      price: 0,
      organizer: '',
      contactEmail: '',
      contactPhone: '',
      features: [],
      tags: []
    });
    setTagInput('');
    setImagePreview(null);
  };

  const openEditModal = (event: Event) => {
    setCurrentEventForAction(event);
    setEventForm(event);
    setShowEditModal(true);
  };

  const openDeleteModal = (event: Event) => {
    setCurrentEventForAction(event);
    setShowDeleteModal(true);
  };

  const openCancelModal = (event: Event) => {
    setCurrentEventForAction(event);
    setShowCancelModal(true);
  };

  const openDetailsModal = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const openBookingsModal = (event: Event) => {
    setSelectedEvent(event);
    setShowBookingsModal(true);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const eventBookings = bookings.filter(b => b.eventId === selectedEvent?.id);
  const totalRevenue = filteredEvents.reduce((sum, e) => sum + e.revenue, 0);
  const totalTickets = filteredEvents.reduce((sum, e) => sum + e.bookedSeats, 0);
  const averageOccupancy = filteredEvents.length > 0 ? (totalTickets / filteredEvents.reduce((sum, e) => sum + e.totalSeats, 0)) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Event Management</h1>
          <p className="text-xl opacity-90">Create, manage, and track all your theater events in one place</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 opacity-90" />
              <span className="text-3xl font-bold">{filteredEvents.length}</span>
            </div>
            <p className="text-sm opacity-90">Total Events</p>
            <p className="text-2xl font-bold mt-2">{filteredEvents.length}</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-between mb-4">
              <Ticket className="h-8 w-8 opacity-90" />
              <span className="text-3xl font-bold">{totalTickets.toLocaleString()}</span>
            </div>
            <p className="text-sm opacity-90">Tickets Sold</p>
            <p className="text-2xl font-bold mt-2">{totalTickets.toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 opacity-90" />
              <span className="text-3xl font-bold">${totalRevenue.toLocaleString()}</span>
            </div>
            <p className="text-sm opacity-90">Total Revenue</p>
            <p className="text-2xl font-bold mt-2">${totalRevenue.toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 opacity-90" />
              <span className="text-3xl font-bold">{averageOccupancy.toFixed(1)}%</span>
            </div>
            <p className="text-sm opacity-90">Avg Occupancy</p>
            <p className="text-2xl font-bold mt-2">{averageOccupancy.toFixed(1)}%</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events by name or organizer..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition"
            >
              <Plus className="h-5 w-5" />
              Create Event
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              {/* Event Header */}
              <div className="relative h-48 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 text-center text-white">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-80" />
                  <p className="text-lg font-bold">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-sm">{event.time} - {event.endTime}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {getStatusIcon(event.status)}
                    {event.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              {/* Event Body */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {event.hall}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {event.bookedSeats.toLocaleString()} / {event.totalSeats.toLocaleString()} seats booked
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    ${event.price} per ticket
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${(event.bookedSeats / event.totalSeats) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {((event.bookedSeats / event.totalSeats) * 100).toFixed(1)}% sold
                  </p>
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => openDetailsModal(event)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Eye className="h-4 w-4" />
                    Details
                  </button>
                  <button
                    onClick={() => openEditModal(event)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <div className="relative group">
                    <button className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button
                        onClick={() => openBookingsModal(event)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-xl flex items-center gap-2"
                      >
                        <Ticket className="h-4 w-4" />
                        View Bookings
                      </button>
                      <button
                        onClick={() => openCancelModal(event)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                        disabled={event.status === 'cancelled'}
                      >
                        <Ban className="h-4 w-4" />
                        Cancel Event
                      </button>
                      <button
                        onClick={() => openDeleteModal(event)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-xl flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Event Modal - Simplified for brevity, but you can keep the full version */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className={`${showCreateModal ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-green-600 to-blue-600'} text-white p-6 rounded-t-2xl sticky top-0`}>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {showCreateModal ? 'Create New Event' : 'Edit Event'}
                  </h2>
                  <button onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }} className="hover:opacity-80">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Event Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={eventForm.name || ''}
                      onChange={(e) => setEventForm({...eventForm, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={eventForm.date || ''}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time *</label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={eventForm.time || ''}
                      onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hall *</label>
                    <select
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={eventForm.hall || ''}
                      onChange={(e) => setEventForm({...eventForm, hall: e.target.value})}
                    >
                      <option value="">Select Hall</option>
                      {halls.map(hall => (
                        <option key={hall.id} value={hall.name}>{hall.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Price ($) *</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={eventForm.price || 0}
                      onChange={(e) => setEventForm({...eventForm, price: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showCreateModal ? handleCreateEvent : handleUpdateEvent}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition font-semibold"
                  >
                    {showCreateModal ? 'Create Event' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {showDetailsModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{selectedEvent.name}</h2>
                  <button onClick={() => setShowDetailsModal(false)} className="hover:opacity-80">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{new Date(selectedEvent.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">{selectedEvent.time} - {selectedEvent.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Venue:</span>
                    <span className="font-semibold">{selectedEvent.hall}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Seats:</span>
                    <span className="font-semibold">{selectedEvent.totalSeats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booked Seats:</span>
                    <span className="font-semibold">{selectedEvent.bookedSeats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-semibold text-green-600">${selectedEvent.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                      {getStatusIcon(selectedEvent.status)}
                      {selectedEvent.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">Description:</p>
                    <p className="text-gray-800">{selectedEvent.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed bottom-8 right-8 z-50 animate-slideInRight">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl p-4 max-w-md">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8" />
                <div>
                  <p className="font-bold text-lg">Success!</p>
                  <p className="text-sm opacity-90">{successMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default EventManagement;