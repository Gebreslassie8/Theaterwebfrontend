// src/pages/Manager/components/events/CreateEvent.tsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Users, DollarSign, Image, Save, X, 
  Upload, AlertCircle, CheckCircle, FileText, Tag, Phone, 
  Mail, Globe, Star, Award, Ticket, Coffee, Music, Film,
  Trash2, Eye, Loader, ChevronRight, ChevronLeft, Edit,
  Search, Filter, MoreVertical, Ban, RefreshCw
} from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'form' | 'table'>('form');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    hall: '',
    price: '',
    capacity: '',
    category: '',
    ageRestriction: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    features: [],
    organizer: '',
    tags: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('theater_events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Mock data for demo
      const mockEvents: EventData[] = [
        {
          id: '1',
          name: 'Summer Music Festival',
          description: 'An amazing summer music festival featuring top artists.',
          date: '2024-07-15',
          time: '19:00',
          endTime: '23:00',
          hall: 'Grand Hall',
          price: 150,
          capacity: 1500,
          category: 'concert',
          ageRestriction: 'all',
          contactEmail: 'events@example.com',
          contactPhone: '+1 234 567 8900',
          website: 'https://example.com',
          features: ['VIP Area', 'Food Service', 'Bar Service'],
          organizer: 'Events Management Co.',
          tags: ['Exclusive', 'Limited Seats'],
          createdAt: new Date().toISOString(),
          status: 'upcoming',
          bookedSeats: 1245,
          revenue: 186750
        },
        {
          id: '2',
          name: 'Comedy Night',
          description: 'A hilarious night of stand-up comedy.',
          date: '2024-07-18',
          time: '20:00',
          endTime: '22:30',
          hall: 'Blue Hall',
          price: 75,
          capacity: 800,
          category: 'comedy',
          ageRestriction: '18+',
          contactEmail: 'comedy@example.com',
          contactPhone: '+1 234 567 8901',
          website: '',
          features: ['Bar Service', 'AC'],
          organizer: 'Comedy Club International',
          tags: ['Group Discount'],
          createdAt: new Date().toISOString(),
          status: 'upcoming',
          bookedSeats: 678,
          revenue: 50850
        }
      ];
      setEvents(mockEvents);
      localStorage.setItem('theater_events', JSON.stringify(mockEvents));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('theater_events', JSON.stringify(events));
    }
  }, [events]);

  const categories = [
    { value: 'concert', label: 'Concert', icon: Music, color: 'from-purple-500 to-pink-500', description: 'Live music performances' },
    { value: 'theater', label: 'Theater', icon: Film, color: 'from-blue-500 to-cyan-500', description: 'Plays and dramas' },
    { value: 'movie', label: 'Movie', icon: Film, color: 'from-red-500 to-orange-500', description: 'Film screenings' },
    { value: 'comedy', label: 'Comedy', icon: Star, color: 'from-yellow-500 to-orange-500', description: 'Stand-up & comedy shows' },
    { value: 'sports', label: 'Sports', icon: Award, color: 'from-green-500 to-emerald-500', description: 'Sports events' },
    { value: 'family', label: 'Family', icon: Users, color: 'from-indigo-500 to-purple-500', description: 'Family-friendly events' },
  ];

  const halls = [
    { id: 'hall-a', name: 'Grand Hall', capacity: 1500, priceMultiplier: 1.0, features: ['AC', 'Dolby Atmos', 'VIP Area', 'Wheelchair Access'] },
    { id: 'hall-b', name: 'Blue Hall', capacity: 800, priceMultiplier: 0.8, features: ['AC', 'Surround Sound', 'Wheelchair Access'] },
    { id: 'hall-c', name: 'Red Hall', capacity: 500, priceMultiplier: 0.6, features: ['Standard Sound', 'AC'] },
    { id: 'vip-hall', name: 'Royal Hall', capacity: 300, priceMultiplier: 1.5, features: ['Premium Seats', 'Private Lounge', 'AC', 'Dolby Atmos', 'VIP Service'] },
  ];

  const availableFeatures = [
    'VIP Area', 'Wheelchair Access', 'Food Service', 'Bar Service', 
    'Parking Available', 'Air Conditioning', 'Dolby Atmos Sound', 
    '4K Projection', 'Live Streaming', 'Meet & Greet', 'Photography Allowed',
    'Food & Drinks Included', 'Free WiFi', 'Smoking Area', 'First Aid'
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
      case 'upcoming': return <Clock className="h-3 w-3" />;
      case 'ongoing': return <Activity className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }

      setIsUploading(true);
      
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImage(reader.result as string);
          setImageFile(file);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageFile(null);
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = 'Event name is required';
      if (formData.name.length < 3) newErrors.name = 'Event name must be at least 3 characters';
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

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: '',
      time: '',
      endTime: '',
      hall: '',
      price: '',
      capacity: '',
      category: '',
      ageRestriction: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      features: [],
      organizer: '',
      tags: []
    });
    setUploadedImage(null);
    setImageFile(null);
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
        event.id === editingEvent.id
          ? {
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
            }
          : event
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
      const updatedEvents = events.filter(e => e.id !== selectedEvent.id);
      setEvents(updatedEvents);
      setShowDeleteModal(false);
      setSuccessMessage(`🗑️ Event "${selectedEvent.name}" deleted successfully!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleCancelEvent = () => {
    if (selectedEvent) {
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id
          ? { ...event, status: 'cancelled' as const }
          : event
      );
      setEvents(updatedEvents);
      setShowCancelModal(false);
      setSuccessMessage(`⚠️ Event "${selectedEvent.name}" has been cancelled!`);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    }
  };

  const handleEditEvent = (event: EventData) => {
    setEditingEvent(event);
    const selectedHall = halls.find(h => h.name === event.hall);
    setFormData({
      name: event.name,
      description: event.description,
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

  const selectedHall = halls.find(h => h.id === formData.hall);
  const selectedCategory = categories.find(c => c.value === formData.category);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredEvents.reduce((sum, e) => sum + e.revenue, 0);
  const totalTickets = filteredEvents.reduce((sum, e) => sum + e.bookedSeats, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header with Toggle */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Event Management</h1>
              <p className="text-lg opacity-90">Create and manage all your theater events</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { resetForm(); setViewMode('form'); }}
                className={`px-6 py-2 rounded-xl font-semibold transition ${viewMode === 'form' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white hover:bg-blue-800'}`}
              >
                + Create Event
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-6 py-2 rounded-xl font-semibold transition ${viewMode === 'table' ? 'bg-white text-blue-600' : 'bg-blue-700 text-white hover:bg-blue-800'}`}
              >
                📋 All Events
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* TABLE VIEW - All Events */}
        {viewMode === 'table' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="h-8 w-8 opacity-90" />
                  <span className="text-2xl font-bold">{filteredEvents.length}</span>
                </div>
                <p className="text-sm opacity-90">Total Events</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Ticket className="h-8 w-8 opacity-90" />
                  <span className="text-2xl font-bold">{totalTickets.toLocaleString()}</span>
                </div>
                <p className="text-sm opacity-90">Tickets Sold</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 opacity-90" />
                  <span className="text-2xl font-bold">${totalRevenue.toLocaleString()}</span>
                </div>
                <p className="text-sm opacity-90">Total Revenue</p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <RefreshCw className="h-8 w-8 opacity-90" />
                  <button onClick={() => setViewMode('form')} className="text-white hover:text-gray-200">
                    + New Event
                  </button>
                </div>
                <p className="text-sm opacity-90">Create New</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[250px] relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search events by name..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">Event Name</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Date & Time</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Hall</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Tickets</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Revenue</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-800">{event.name}</p>
                            <p className="text-xs text-gray-500">{event.organizer}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-800">{event.date}</p>
                          <p className="text-sm text-gray-500">{event.time}</p>
                        </td>
                        <td className="p-4 text-gray-600">{event.hall}</td>
                        <td className="p-4">
                          <p className="text-gray-800">{event.bookedSeats.toLocaleString()} / {event.capacity.toLocaleString()}</p>
                          <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full"
                              style={{ width: `${(event.bookedSeats / event.capacity) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-green-600">${event.revenue.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {getStatusIcon(event.status)}
                            {event.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setSelectedEvent(event); setShowDetailsModal(true); }} 
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEditEvent(event)} 
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Edit Event"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => { setSelectedEvent(event); setShowCancelModal(true); }} 
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                              title="Cancel Event"
                              disabled={event.status === 'cancelled'}
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => { setSelectedEvent(event); setShowDeleteModal(true); }} 
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Event"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No events found. Create your first event!</p>
                  <button onClick={() => setViewMode('form')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    + Create Event
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FORM VIEW - Create/Edit Event */}
        {viewMode === 'form' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Progress Steps */}
            <div className="px-8 pt-8">
              <div className="flex items-center justify-between">
                {[
                  { step: 1, title: 'Basic Info', icon: FileText },
                  { step: 2, title: 'Schedule', icon: Calendar },
                  { step: 3, title: 'Pricing', icon: DollarSign },
                  { step: 4, title: 'Media', icon: Image },
                  { step: 5, title: 'Review', icon: CheckCircle }
                ].map((item) => {
                  const status = item.step < currentStep ? 'completed' : item.step === currentStep ? 'current' : 'pending';
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="flex-1 relative">
                      <div className={`h-1 ${status === 'completed' ? 'bg-green-500' : status === 'current' ? 'bg-blue-500' : 'bg-gray-200'} transition-all duration-500`} />
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
                          ${status === 'completed' ? 'bg-green-500 text-white' : 
                            status === 'current' ? 'bg-blue-500 text-white ring-4 ring-blue-200' : 
                            'bg-gray-200 text-gray-500'}
                        `}>
                          {status === 'completed' ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                        </div>
                      </div>
                      <p className={`text-center mt-6 text-sm font-medium ${
                        status === 'current' ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {item.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); editingEvent ? handleUpdateEvent() : handleCreateEvent(); }}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="p-8 space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
                      <p className="text-gray-500 text-sm">Tell us about your event</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                          errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Summer Music Festival 2024"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your event in detail..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {categories.map((cat) => (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => setFormData({...formData, category: cat.value})}
                              className={`p-3 border-2 rounded-xl text-left transition-all ${
                                formData.category === cat.value
                                  ? `bg-gradient-to-r ${cat.color} border-transparent text-white`
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <cat.icon className={`h-5 w-5 mb-1 ${
                                formData.category === cat.value ? 'text-white' : 'text-gray-400'
                              }`} />
                              <p className={`text-sm font-semibold ${
                                formData.category === cat.value ? 'text-white' : 'text-gray-800'
                              }`}>
                                {cat.label}
                              </p>
                            </button>
                          ))}
                        </div>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Organizer <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="organizer"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.organizer}
                          onChange={handleChange}
                          placeholder="e.g., Events Management Co."
                        />
                        {errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="email"
                            name="contactEmail"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            placeholder="contact@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="tel"
                            name="contactPhone"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            placeholder="+1 234 567 8900"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Website (Optional)</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="url"
                          name="website"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Schedule & Venue */}
              {currentStep === 2 && (
                <div className="p-8 space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Schedule & Venue</h2>
                      <p className="text-gray-500 text-sm">Set the date, time, and location</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Event Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.date ? 'border-red-500' : 'border-gray-200'
                        }`}
                        value={formData.date}
                        onChange={handleChange}
                      />
                      {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="time"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.time ? 'border-red-500' : 'border-gray-200'
                        }`}
                        value={formData.time}
                        onChange={handleChange}
                      />
                      {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.endTime ? 'border-red-500' : 'border-gray-200'
                        }`}
                        value={formData.endTime}
                        onChange={handleChange}
                      />
                      {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Venue <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {halls.map((hall) => (
                        <button
                          key={hall.id}
                          type="button"
                          onClick={() => setFormData({...formData, hall: hall.id})}
                          className={`p-4 border-2 rounded-xl text-left transition-all ${
                            formData.hall === hall.id
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">{hall.name}</h3>
                              <p className="text-sm text-gray-500">Capacity: {hall.capacity.toLocaleString()} seats</p>
                            </div>
                            <Users className={`h-5 w-5 ${formData.hall === hall.id ? 'text-blue-500' : 'text-gray-400'}`} />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {hall.features.slice(0, 2).map((feature, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.hall && <p className="text-red-500 text-sm mt-2">{errors.hall}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Pricing & Capacity */}
              {currentStep === 3 && (
                <div className="p-8 space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <DollarSign className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Pricing & Capacity</h2>
                      <p className="text-gray-500 text-sm">Set ticket prices and availability</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ticket Price ($) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">$</span>
                        <input
                          type="number"
                          name="price"
                          step="0.01"
                          className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.price ? 'border-red-500' : 'border-gray-200'
                          }`}
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Total Capacity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.capacity ? 'border-red-500' : 'border-gray-200'
                        }`}
                        value={formData.capacity}
                        onChange={handleChange}
                        placeholder="Number of seats"
                      />
                      {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age Restriction</label>
                    <select
                      name="ageRestriction"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.ageRestriction}
                      onChange={handleChange}
                    >
                      <option value="">No restriction (All Ages)</option>
                      <option value="all">All Ages Welcome</option>
                      <option value="12+">12+ (Parental Guidance)</option>
                      <option value="16+">16+</option>
                      <option value="18+">18+ (Adults Only)</option>
                      <option value="21+">21+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Event Features</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableFeatures.slice(0, 9).map((feature) => (
                        <label key={feature} className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                          <input
                            type="checkbox"
                            checked={formData.features.includes(feature)}
                            onChange={() => handleFeatureToggle(feature)}
                            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Event Tags</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add tags (e.g., Exclusive, Limited Seats)"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                      >
                        Add
                      </button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                            #{tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-blue-900">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Media Upload */}
              {currentStep === 4 && (
                <div className="p-8 space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Image className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Event Media</h2>
                      <p className="text-gray-500 text-sm">Upload an eye-catching poster for your event</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Event Poster</label>
                    
                    {!uploadedImage ? (
                      <div className="border-3 border-dashed rounded-2xl p-8 text-center transition border-gray-300 hover:border-blue-500 bg-gray-50">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <div className="p-4 bg-blue-100 rounded-full mb-4">
                              <Upload className="h-10 w-10 text-blue-600" />
                            </div>
                            <p className="text-lg font-semibold text-gray-700 mb-2">Click to upload poster</p>
                            <p className="text-sm text-gray-500">PNG, JPG, or GIF (Max 5MB)</p>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="relative group">
                        <img src={uploadedImage} alt="Preview" className="w-full max-h-64 object-cover rounded-2xl shadow-lg" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button onClick={handleRemoveImage} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="p-8 space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Review & Submit</h2>
                      <p className="text-gray-500 text-sm">Double-check all the details before submitting</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="font-semibold text-gray-800 mb-2">Event Details</p>
                      <p><span className="text-gray-600">Name:</span> {formData.name || '—'}</p>
                      <p><span className="text-gray-600">Category:</span> {selectedCategory?.label || '—'}</p>
                      <p><span className="text-gray-600">Organizer:</span> {formData.organizer || '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="font-semibold text-gray-800 mb-2">Schedule</p>
                      <p><span className="text-gray-600">Date:</span> {formData.date || '—'}</p>
                      <p><span className="text-gray-600">Time:</span> {formData.time} - {formData.endTime}</p>
                      <p><span className="text-gray-600">Venue:</span> {selectedHall?.name || '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="font-semibold text-gray-800 mb-2">Pricing</p>
                      <p><span className="text-gray-600">Price:</span> ${formData.price || '0'}</p>
                      <p><span className="text-gray-600">Capacity:</span> {formData.capacity || '0'} seats</p>
                      <p><span className="text-gray-600">Age Restriction:</span> {formData.ageRestriction || 'None'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="font-semibold text-gray-800 mb-2">Features & Tags</p>
                      <p><span className="text-gray-600">Features:</span> {formData.features.length || 'None'}</p>
                      <p><span className="text-gray-600">Tags:</span> {formData.tags.join(', ') || 'None'}</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <p className="text-sm text-yellow-800">Please verify all information before submitting.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between">
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold">
                    <ChevronLeft className="h-5 w-5" />
                    Previous
                  </button>
                )}
                {currentStep < 5 ? (
                  <button type="button" onClick={nextStep} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition ml-auto font-semibold">
                    Next Step
                    <ChevronRight className="h-5 w-5" />
                  </button>
                ) : (
                  <button type="submit" disabled={isUploading} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition ml-auto font-semibold disabled:opacity-50">
                    {isUploading ? <><Loader className="h-5 w-5 animate-spin" /> Processing...</> : <><CheckCircle className="h-5 w-5" /> {editingEvent ? 'Update Event' : 'Create Event'}</>}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl sticky top-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{selectedEvent.name}</h2>
                  <button onClick={() => setShowDetailsModal(false)} className="hover:opacity-80"><X className="h-6 w-6" /></button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-gray-500 text-sm">Date</p><p className="font-semibold">{selectedEvent.date}</p></div>
                  <div><p className="text-gray-500 text-sm">Time</p><p className="font-semibold">{selectedEvent.time} - {selectedEvent.endTime}</p></div>
                  <div><p className="text-gray-500 text-sm">Venue</p><p className="font-semibold">{selectedEvent.hall}</p></div>
                  <div><p className="text-gray-500 text-sm">Ticket Price</p><p className="font-semibold text-green-600">${selectedEvent.price}</p></div>
                  <div><p className="text-gray-500 text-sm">Capacity</p><p className="font-semibold">{selectedEvent.capacity} seats</p></div>
                  <div><p className="text-gray-500 text-sm">Booked Seats</p><p className="font-semibold">{selectedEvent.bookedSeats}</p></div>
                  <div><p className="text-gray-500 text-sm">Revenue</p><p className="font-semibold text-green-600">${selectedEvent.revenue.toLocaleString()}</p></div>
                  <div><p className="text-gray-500 text-sm">Status</p><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>{selectedEvent.status}</span></div>
                </div>
                <div><p className="text-gray-500 text-sm">Description</p><p className="text-gray-700">{selectedEvent.description}</p></div>
                {selectedEvent.features.length > 0 && (<div><p className="text-gray-500 text-sm">Features</p><div className="flex flex-wrap gap-1 mt-1">{selectedEvent.features.map((f, i) => (<span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">✓ {f}</span>))}</div></div>)}
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
              <div className="flex gap-3"><button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button><button onClick={handleDeleteEvent} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button></div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center mb-4"><Ban className="h-16 w-16 text-orange-500 mx-auto" /></div>
              <h2 className="text-xl font-bold text-center mb-2">Cancel Event</h2>
              <p className="text-gray-600 text-center mb-6">Are you sure you want to cancel "{selectedEvent.name}"? This will cancel all bookings.</p>
              <div className="flex gap-3"><button onClick={() => setShowCancelModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Keep Event</button><button onClick={handleCancelEvent} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg">Cancel Event</button></div>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed bottom-8 right-8 z-50 animate-slideInRight">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl p-4 max-w-md">
              <div className="flex items-center gap-3"><CheckCircle className="h-8 w-8" /><p className="font-bold">{successMessage}</p></div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default CreateEvent;