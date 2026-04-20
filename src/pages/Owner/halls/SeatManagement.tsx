// src/pages/Manager/components/halls/SeatManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Armchair, Edit, Trash2, Plus, X, CheckCircle, AlertCircle, 
  Eye, Download, Settings, Users, DollarSign, Calendar, 
  Clock, MapPin, Ticket, Star, TrendingUp, AlertTriangle, 
  Ban, Filter, Search, Activity, Shield, Building, 
  Save, RefreshCw, Printer, Copy, Share2, MessageCircle,
  Phone, Mail, CreditCard, Wallet, Coffee, Wifi, Car
} from 'lucide-react';
import { FaChair } from 'react-icons/fa';
import ReusableButton from '../../../components/Reusable/ReusableButton';
import ReusableForm from '../../../components/Reusable/ReusableForm';
import ReusableTable from '../../../components/Reusable/ReusableTable';
import SuccessPopup from '../../../components/Reusable/SuccessPopup';
import {
  AreaChart, Area, PieChart as RePieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, BarChart, Bar
} from 'recharts';

// Types
interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'vip' | 'premium' | 'wheelchair';
  status: 'available' | 'booked' | 'reserved' | 'maintenance';
  price: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  bookingTime?: string;
  paymentMethod?: string;
  transactionId?: string;
}

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  hall: string;
  hallId: number;
  totalSeats: number;
  bookedSeats: number;
  revenue: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  image?: string;
  description?: string;
  genre?: string;
  duration?: string;
}

interface BookingDetails {
  seatId: string;
  customerName: string;
  phone: string;
  email: string;
  price: number;
  bookingTime: string;
  paymentMethod: string;
  transactionId: string;
}

interface Hall {
  id: number;
  name: string;
  capacity: number;
  rows: number;
  columns: number;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12
    }
  }
};

// Quick Stat Badge Component
interface QuickStatBadgeProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  status?: 'online' | 'offline';
}

const QuickStatBadge: React.FC<QuickStatBadgeProps> = ({ icon: Icon, label, value, status }) => (
  <div className="flex items-center gap-2 text-white/90 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
    <Icon className="h-4 w-4" />
    <span className="text-sm">{label}:</span>
    <span className="text-sm font-semibold flex items-center gap-1">
      {value}
      {status === 'online' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      )}
    </span>
  </div>
);

// Mock Data
const halls: Hall[] = [
  { id: 1, name: 'Grand Hall', capacity: 500, rows: 20, columns: 25 },
  { id: 2, name: 'Blue Hall', capacity: 300, rows: 15, columns: 20 },
  { id: 3, name: 'Red Hall', capacity: 200, rows: 10, columns: 20 },
];

const events: Event[] = [
  { 
    id: 1, 
    name: "Summer Music Festival", 
    date: "2024-07-20", 
    time: "7:00 PM", 
    hall: "Grand Hall",
    hallId: 1,
    totalSeats: 500,
    bookedSeats: 345,
    revenue: 51750,
    status: 'upcoming',
    genre: 'Concert',
    duration: '3 hours',
    description: 'An amazing summer music festival featuring top artists'
  },
  { 
    id: 2, 
    name: "Comedy Night", 
    date: "2024-07-21", 
    time: "8:00 PM", 
    hall: "Blue Hall",
    hallId: 2,
    totalSeats: 300,
    bookedSeats: 278,
    revenue: 20850,
    status: 'upcoming',
    genre: 'Comedy',
    duration: '2 hours',
    description: 'A night of laughter with top comedians'
  },
  { 
    id: 3, 
    name: "Movie Premiere: Avengers", 
    date: "2024-07-22", 
    time: "6:30 PM", 
    hall: "Grand Hall",
    hallId: 1,
    totalSeats: 500,
    bookedSeats: 489,
    revenue: 58680,
    status: 'ongoing',
    genre: 'Movie',
    duration: '2.5 hours',
    description: 'Premiere screening of the latest blockbuster'
  },
  { 
    id: 4, 
    name: "Jazz Evening", 
    date: "2024-07-23", 
    time: "7:30 PM", 
    hall: "Red Hall",
    hallId: 3,
    totalSeats: 200,
    bookedSeats: 145,
    revenue: 10875,
    status: 'upcoming',
    genre: 'Jazz',
    duration: '2 hours',
    description: 'Smooth jazz evening with renowned artists'
  },
];

const SeatManagement: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingSeat, setEditingSeat] = useState<Seat | null>(null);
  const [cancellingSeat, setCancellingSeat] = useState<Seat | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [dateRange, setDateRange] = useState<string>('week');
  
  // Form state for booking
  const [bookingForm, setBookingForm] = useState<BookingDetails>({
    seatId: '',
    customerName: '',
    phone: '',
    email: '',
    price: 0,
    bookingTime: new Date().toISOString(),
    paymentMethod: 'credit_card',
    transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase()
  });

  // Event form state
  const [eventForm, setEventForm] = useState({
    name: '',
    date: '',
    time: '',
    hallId: 1,
    genre: '',
    duration: '',
    description: ''
  });

  // Generate seats for selected event
  const generateSeats = (event: Event): Seat[] => {
    const hall = halls.find(h => h.id === event.hallId);
    if (!hall) return [];
    
    const generatedSeats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = hall.columns;
    
    for (let i = 0; i < hall.rows && i < rows.length; i++) {
      for (let j = 1; j <= seatsPerRow; j++) {
        let type: 'standard' | 'vip' | 'premium' | 'wheelchair' = 'standard';
        let price = 50;
        
        // VIP seats in first 2 rows, first 10 columns
        if (i < 2 && j <= 10) {
          type = 'vip';
          price = 150;
        } 
        // Premium seats in rows 3-5, first 15 columns
        else if (i >= 2 && i < 5 && j <= 15) {
          type = 'premium';
          price = 100;
        }
        // Wheelchair accessible seats
        else if (i === hall.rows - 1 && j === 5) {
          type = 'wheelchair';
          price = 60;
        }
        
        // Randomly book some seats based on event's booked seats
        const isBooked = Math.random() < (event.bookedSeats / event.totalSeats);
        
        generatedSeats.push({
          id: `${rows[i]}${j}`,
          row: rows[i],
          number: j,
          type,
          status: isBooked ? 'booked' : 'available',
          price,
          customerName: isBooked ? `Customer ${Math.floor(Math.random() * 1000)}` : undefined,
          customerPhone: isBooked ? `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}` : undefined,
          customerEmail: isBooked ? `customer${Math.floor(Math.random() * 1000)}@example.com` : undefined,
          bookingTime: isBooked ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          paymentMethod: isBooked ? ['credit_card', 'debit_card', 'mobile_money'][Math.floor(Math.random() * 3)] : undefined,
          transactionId: isBooked ? `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined
        });
      }
    }
    return generatedSeats;
  };

  // Load seats when event changes
  useEffect(() => {
    if (selectedEvent) {
      setSeats(generateSeats(selectedEvent));
    }
  }, [selectedEvent]);

  // Initialize with first event
  useEffect(() => {
    if (events.length > 0) {
      setSelectedEvent(events[0]);
    }
  }, []);

  // Booking form fields
  const bookingFormFields = [
    {
      name: 'customerName',
      label: 'Customer Name',
      type: 'text' as const,
      placeholder: 'Enter full name',
      required: true,
      value: bookingForm.customerName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setBookingForm({...bookingForm, customerName: e.target.value})
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel' as const,
      placeholder: '+1 234 567 8900',
      required: true,
      value: bookingForm.phone,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setBookingForm({...bookingForm, phone: e.target.value})
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      placeholder: 'customer@example.com',
      required: false,
      value: bookingForm.email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setBookingForm({...bookingForm, email: e.target.value})
    },
    {
      name: 'paymentMethod',
      label: 'Payment Method',
      type: 'select' as const,
      required: true,
      value: bookingForm.paymentMethod,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setBookingForm({...bookingForm, paymentMethod: e.target.value}),
      options: [
        { value: 'credit_card', label: '💳 Credit Card' },
        { value: 'debit_card', label: '💳 Debit Card' },
        { value: 'cash', label: '💵 Cash' },
        { value: 'mobile_money', label: '📱 Mobile Money' },
      ]
    }
  ];

  // Event form fields
  const eventFormFields = [
    {
      name: 'name',
      label: 'Event Name',
      type: 'text' as const,
      placeholder: 'Enter event name',
      required: true,
      value: eventForm.name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEventForm({...eventForm, name: e.target.value})
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date' as const,
      required: true,
      value: eventForm.date,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEventForm({...eventForm, date: e.target.value})
    },
    {
      name: 'time',
      label: 'Time',
      type: 'time' as const,
      required: true,
      value: eventForm.time,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEventForm({...eventForm, time: e.target.value})
    },
    {
      name: 'hallId',
      label: 'Hall',
      type: 'select' as const,
      required: true,
      value: eventForm.hallId,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setEventForm({...eventForm, hallId: parseInt(e.target.value)}),
      options: halls.map(hall => ({ value: hall.id, label: hall.name }))
    },
    {
      name: 'genre',
      label: 'Genre',
      type: 'text' as const,
      placeholder: 'e.g., Concert, Comedy, Movie',
      required: true,
      value: eventForm.genre,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEventForm({...eventForm, genre: e.target.value})
    },
    {
      name: 'duration',
      label: 'Duration',
      type: 'text' as const,
      placeholder: 'e.g., 2 hours',
      required: true,
      value: eventForm.duration,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEventForm({...eventForm, duration: e.target.value})
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      placeholder: 'Event description',
      required: false,
      value: eventForm.description,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setEventForm({...eventForm, description: e.target.value})
    }
  ];

  const handleEventChange = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      name: '',
      date: '',
      time: '',
      hallId: 1,
      genre: '',
      duration: '',
      description: ''
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      name: event.name,
      date: event.date,
      time: event.time,
      hallId: event.hallId,
      genre: event.genre || '',
      duration: event.duration || '',
      description: event.description || ''
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.name || !eventForm.date || !eventForm.time) {
      alert('Please fill in all required fields');
      return;
    }

    const hall = halls.find(h => h.id === eventForm.hallId);
    const newEvent: Event = {
      id: editingEvent?.id || events.length + 1,
      name: eventForm.name,
      date: eventForm.date,
      time: eventForm.time,
      hall: hall?.name || '',
      hallId: eventForm.hallId,
      totalSeats: hall?.capacity || 0,
      bookedSeats: 0,
      revenue: 0,
      status: 'upcoming',
      genre: eventForm.genre,
      duration: eventForm.duration,
      description: eventForm.description
    };

    if (editingEvent) {
      // Update existing event
      const index = events.findIndex(e => e.id === editingEvent.id);
      if (index !== -1) {
        events[index] = newEvent;
      }
      setSuccessMessage(`Event "${eventForm.name}" updated successfully!`);
    } else {
      // Add new event
      events.push(newEvent);
      setSuccessMessage(`Event "${eventForm.name}" created successfully!`);
    }

    setShowEventModal(false);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const getSeatStyle = (seat: Seat) => {
    if (seat.status === 'booked') {
      return 'bg-gradient-to-br from-gray-400 to-gray-500 cursor-not-allowed opacity-60';
    }
    if (seat.status === 'reserved') {
      return 'bg-gradient-to-br from-yellow-400 to-yellow-500 cursor-wait';
    }
    if (seat.status === 'maintenance') {
      return 'bg-gradient-to-br from-red-400 to-red-500 cursor-not-allowed opacity-50';
    }
    
    switch(seat.type) {
      case 'vip':
        return 'bg-gradient-to-br from-purple-500 to-pink-500 cursor-pointer hover:scale-110';
      case 'premium':
        return 'bg-gradient-to-br from-blue-500 to-cyan-500 cursor-pointer hover:scale-110';
      case 'wheelchair':
        return 'bg-gradient-to-br from-green-500 to-emerald-500 cursor-pointer hover:scale-110';
      default:
        return 'bg-gradient-to-br from-teal-500 to-teal-600 cursor-pointer hover:scale-110';
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'available') {
      setSelectedSeat(seat);
      setBookingForm({
        ...bookingForm,
        seatId: seat.id,
        price: seat.price
      });
      setShowBookingModal(true);
    } else if (seat.status === 'booked') {
      setSelectedSeat(seat);
      setShowEditModal(true);
    }
  };

  const handleBooking = () => {
    if (!bookingForm.customerName || !bookingForm.phone) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedSeats = seats.map(seat => {
      if (seat.id === selectedSeat?.id) {
        return {
          ...seat,
          status: 'booked' as const,
          customerName: bookingForm.customerName,
          customerPhone: bookingForm.phone,
          customerEmail: bookingForm.email,
          bookingTime: new Date().toISOString(),
          paymentMethod: bookingForm.paymentMethod,
          transactionId: bookingForm.transactionId
        };
      }
      return seat;
    });

    setSeats(updatedSeats);
    if (selectedEvent) {
      selectedEvent.bookedSeats++;
      selectedEvent.revenue += selectedSeat?.price || 0;
    }
    
    setShowBookingModal(false);
    setSuccessMessage(`✨ Seat ${selectedSeat?.id} successfully booked for ${bookingForm.customerName}!`);
    setShowSuccessPopup(true);
    
    setBookingForm({
      seatId: '',
      customerName: '',
      phone: '',
      email: '',
      price: 0,
      bookingTime: new Date().toISOString(),
      paymentMethod: 'credit_card',
      transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase()
    });
    
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleCancelBooking = () => {
    if (!cancellingSeat) return;
    
    const updatedSeats = seats.map(seat => {
      if (seat.id === cancellingSeat.id) {
        return {
          ...seat,
          status: 'available' as const,
          customerName: undefined,
          customerPhone: undefined,
          customerEmail: undefined,
          bookingTime: undefined,
          paymentMethod: undefined,
          transactionId: undefined
        };
      }
      return seat;
    });
    
    setSeats(updatedSeats);
    if (selectedEvent) {
      selectedEvent.bookedSeats--;
      selectedEvent.revenue -= cancellingSeat.price;
    }
    
    setShowCancelModal(false);
    setSuccessMessage(`🗑️ Booking for seat ${cancellingSeat.id} has been cancelled. Refund processed.`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const filteredSeats = seats.filter(seat => {
    const matchesSearch = seat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (seat.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesType = filterType === 'all' || seat.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: seats.length,
    available: seats.filter(s => s.status === 'available').length,
    booked: seats.filter(s => s.status === 'booked').length,
    reserved: seats.filter(s => s.status === 'reserved').length,
    maintenance: seats.filter(s => s.status === 'maintenance').length,
    revenue: seats.filter(s => s.status === 'booked').reduce((sum, s) => sum + s.price, 0)
  };

  // Chart data
  const seatDistributionData = [
    { name: 'Standard', value: seats.filter(s => s.type === 'standard').length, color: '#0D9488' },
    { name: 'Premium', value: seats.filter(s => s.type === 'premium').length, color: '#3B82F6' },
    { name: 'VIP', value: seats.filter(s => s.type === 'vip').length, color: '#8B5CF6' },
    { name: 'Wheelchair', value: seats.filter(s => s.type === 'wheelchair').length, color: '#10B981' },
  ];

  const statusData = [
    { name: 'Available', value: stats.available, color: '#10B981' },
    { name: 'Booked', value: stats.booked, color: '#EF4444' },
    { name: 'Reserved', value: stats.reserved, color: '#F59E0B' },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="space-y-8 p-6">
        {/* Welcome Header */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-teal-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
        >
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

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-4"
            >
              <Armchair className="h-4 w-4" />
              <span className="text-sm font-medium">🎭 Theater Seat Management</span>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold mb-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Seat Management Dashboard
            </motion.h1>

            <motion.p
              className="text-white/80 text-lg"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Manage theater seats, events, and customer bookings
            </motion.p>

            <motion.div
              className="flex items-center gap-6 mt-6 flex-wrap"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <QuickStatBadge icon={Calendar} label="Date" value={new Date().toLocaleDateString()} />
              <QuickStatBadge icon={Building} label="Total Halls" value={halls.length} />
              <QuickStatBadge icon={Activity} label="System Status" value="Active" status="online" />
              <QuickStatBadge icon={Ticket} label="Total Events" value={events.length} />
            </motion.div>
          </div>
        </motion.div>

        {/* Event Selection and Management */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6 text-teal-600" />
              <h2 className="text-xl font-semibold text-gray-800">Select Event</h2>
            </div>
            <ReusableButton
              onClick={handleAddEvent}
              variant="primary"
              icon={Plus}
            >
              Create New Event
            </ReusableButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {events.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ y: -5 }}
                onClick={() => handleEventChange(event)}
                className={`cursor-pointer rounded-xl p-4 transition-all ${
                  selectedEvent?.id === event.id
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{event.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === 'upcoming' ? 'bg-green-200 text-green-800' :
                    event.status === 'ongoing' ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-sm opacity-90">{event.date} at {event.time}</p>
                <p className="text-sm opacity-90">{event.hall}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm">🎟️ {event.bookedSeats}/{event.totalSeats}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event);
                    }}
                    className="text-xs hover:opacity-80"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Event Details */}
        {selectedEvent && (
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm opacity-70">Event Name</p>
                <p className="text-xl font-semibold">{selectedEvent.name}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Date & Time</p>
                <p className="text-xl font-semibold">{selectedEvent.date} | {selectedEvent.time}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Hall</p>
                <p className="text-xl font-semibold">{selectedEvent.hall}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Genre</p>
                <p className="text-xl font-semibold">{selectedEvent.genre || 'N/A'}</p>
              </div>
            </div>
            {selectedEvent.description && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm opacity-70">Description</p>
                <p className="mt-1">{selectedEvent.description}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">Total Seats</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">Available</p>
            <p className="text-2xl font-bold">{stats.available}</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">Booked</p>
            <p className="text-2xl font-bold">{stats.booked}</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">Occupancy</p>
            <p className="text-2xl font-bold">{stats.total ? Math.round((stats.booked / stats.total) * 100) : 0}%</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
            <p className="text-sm opacity-90">Revenue</p>
            <p className="text-2xl font-bold">${stats.revenue}</p>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Seat Distribution Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Seat Distribution by Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={seatDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {seatDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-6">
              {seatDistributionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Distribution Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Seat Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-6">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by seat number or customer name..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Seats</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
              <option value="wheelchair">Wheelchair Accessible</option>
            </select>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded"></div>
              <span className="text-sm">Standard ($50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded"></div>
              <span className="text-sm">Premium ($100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
              <span className="text-sm">VIP ($150)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded"></div>
              <span className="text-sm">Wheelchair Access ($60)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-400 rounded opacity-60"></div>
              <span className="text-sm">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
              <span className="text-sm">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <span className="text-sm">Maintenance</span>
            </div>
          </div>
        </motion.div>

        {/* Screen Indicator */}
        <motion.div variants={itemVariants} className="text-center">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-gradient-to-r from-gray-800 to-gray-900 text-white px-12 py-3 rounded-t-2xl shadow-lg"
          >
            <span className="font-semibold">🎬 SCREEN / STAGE</span>
          </motion.div>
        </motion.div>

        {/* Seating Grid */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-8 overflow-x-auto">
          <div className="min-w-[800px]">
            {Array.from(new Set(seats.map(s => s.row))).sort().map(row => (
              <div key={row} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 text-center font-bold text-gray-600">{row}</div>
                  <div className="flex-1 flex gap-2">
                    {filteredSeats
                      .filter(seat => seat.row === row)
                      .sort((a, b) => a.number - b.number)
                      .map((seat) => (
                        <motion.button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          whileHover={seat.status === 'available' ? { scale: 1.1 } : {}}
                          whileTap={seat.status === 'available' ? { scale: 0.95 } : {}}
                          className={`relative group ${getSeatStyle(seat)} p-3 rounded-lg transition-all duration-300`}
                          style={{ width: 'calc(100% / 22)' }}
                        >
                          <FaChair className="h-5 w-5 text-white mx-auto" />
                          <span className="text-xs text-white mt-1 block">{seat.id}</span>
                          {seat.status === 'booked' && seat.customerName && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                              {seat.customerName}
                            </div>
                          )}
                        </motion.button>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Booked Seats Table */}
        {seats.filter(s => s.status === 'booked').length > 0 && (
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Booked Seats Overview</h2>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Seat</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Phone</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Payment</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Booking Time</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seats.filter(s => s.status === 'booked').map((seat) => (
                      <tr key={seat.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 px-4 font-medium text-gray-900">{seat.id}</td>
                        <td className="py-3 px-4 text-gray-600">{seat.customerName}</td>
                        <td className="py-3 px-4 text-gray-600">{seat.customerPhone}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            seat.type === 'vip' ? 'bg-purple-100 text-purple-700' :
                            seat.type === 'premium' ? 'bg-blue-100 text-blue-700' :
                            seat.type === 'wheelchair' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {seat.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-green-600">${seat.price}</td>
                        <td className="py-3 px-4 text-gray-600">{seat.paymentMethod}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {seat.bookingTime ? new Date(seat.bookingTime).toLocaleString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setCancellingSeat(seat);
                              setShowCancelModal(true);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedSeat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-teal-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Book Seat {selectedSeat.id}</h2>
                  <button onClick={() => setShowBookingModal(false)} className="hover:opacity-80">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="opacity-90 mt-1">Complete the customer information below</p>
              </div>
              
              <div className="p-6">
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Seat Type</p>
                      <p className="font-semibold capitalize">{selectedSeat.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-2xl font-bold text-green-600">${selectedSeat.price}</p>
                    </div>
                  </div>
                </div>
                
                <ReusableForm
                  fields={bookingFormFields}
                  onSubmit={handleBooking}
                  submitLabel="Confirm Booking"
                  cancelLabel="Cancel"
                  onCancel={() => setShowBookingModal(false)}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Booking Modal */}
        {showEditModal && selectedSeat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-md w-full"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                  <button onClick={() => setShowEditModal(false)} className="hover:opacity-80">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seat:</span>
                    <span className="font-semibold">{selectedSeat.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-semibold">{selectedSeat.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold">{selectedSeat.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{selectedSeat.customerEmail || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-semibold capitalize">{selectedSeat.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-semibold text-xs">{selectedSeat.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Time:</span>
                    <span className="font-semibold text-sm">
                      {selectedSeat.bookingTime ? new Date(selectedSeat.bookingTime).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <ReusableButton
                    onClick={() => {
                      setShowEditModal(false);
                      setCancellingSeat(selectedSeat);
                      setShowCancelModal(true);
                    }}
                    variant="danger"
                    icon={Ban}
                    fullWidth
                  >
                    Cancel Booking
                  </ReusableButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal && cancellingSeat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-md w-full"
            >
              <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">Confirm Cancellation</h2>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-800 mb-2">
                    Are you sure you want to cancel the booking for seat <span className="font-bold">{cancellingSeat.id}</span>?
                  </p>
                  <p className="text-sm text-gray-500">
                    Customer: {cancellingSeat.customerName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Refund amount: ${cancellingSeat.price}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <ReusableButton
                    onClick={() => setShowCancelModal(false)}
                    variant="secondary"
                    fullWidth
                  >
                    Keep Booking
                  </ReusableButton>
                  <ReusableButton
                    onClick={handleCancelBooking}
                    variant="danger"
                    fullWidth
                  >
                    Yes, Cancel Booking
                  </ReusableButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </h2>
                  <button onClick={() => setShowEventModal(false)} className="hover:opacity-80">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <ReusableForm
                  fields={eventFormFields}
                  onSubmit={handleSaveEvent}
                  submitLabel={editingEvent ? "Update Event" : "Create Event"}
                  cancelLabel="Cancel"
                  onCancel={() => setShowEventModal(false)}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Popup */}
        <SuccessPopup
          message={successMessage}
          isVisible={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
          autoHideDuration={3000}
        />
      </div>
    </motion.div>
  );
};

export default SeatManagement;