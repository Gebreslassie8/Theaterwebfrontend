// src/pages/Manager/components/halls/SeatManagement.tsx
import React, { useState } from 'react';
import { 
  Grid, Armchair, Crown, Circle, Save, RefreshCw, Edit, 
  Trash2, Plus, X, CheckCircle, AlertCircle, Info, 
  Eye, Printer, Download, Settings, Users, DollarSign,
  Calendar, Clock, MapPin, Ticket, Star, Award, Heart,
  TrendingUp, AlertTriangle, Ban, Undo, Filter, Search,
  ChevronDown, ChevronUp, MoreVertical, Copy, Share2
} from 'lucide-react';
import { FaChair } from 'react-icons/fa';

interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'vip' | 'premium' | 'wheelchair';
  status: 'available' | 'booked' | 'reserved' | 'maintenance';
  price: number;
  customerName?: string;
  bookingTime?: string;
  phone?: string;
  email?: string;
}

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  hall: string;
  totalSeats: number;
  bookedSeats: number;
  revenue: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
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

const SeatManagement: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingSeat, setEditingSeat] = useState<Seat | null>(null);
  const [cancellingSeat, setCancellingSeat] = useState<Seat | null>(null);
  
  // Form state for booking/editing
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

  // Mock Events Data
  const events: Event[] = [
    { 
      id: 1, 
      name: "Summer Music Festival", 
      date: "2024-07-15", 
      time: "7:00 PM", 
      hall: "Grand Hall",
      totalSeats: 1500,
      bookedSeats: 1245,
      revenue: 186750,
      status: 'upcoming'
    },
    { 
      id: 2, 
      name: "Comedy Night", 
      date: "2024-07-18", 
      time: "8:00 PM", 
      hall: "Blue Hall",
      totalSeats: 800,
      bookedSeats: 678,
      revenue: 50850,
      status: 'upcoming'
    },
    { 
      id: 3, 
      name: "Movie Premiere", 
      date: "2024-07-20", 
      time: "6:30 PM", 
      hall: "Red Hall",
      totalSeats: 500,
      bookedSeats: 489,
      revenue: 58680,
      status: 'ongoing'
    },
  ];

  // Mock Seats Data for selected event
  const getSeatsForEvent = (eventId: number): Seat[] => {
    const baseSeats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 20;
    
    for (let i = 0; i < rows.length; i++) {
      for (let j = 1; j <= seatsPerRow; j++) {
        let type: 'standard' | 'vip' | 'premium' | 'wheelchair' = 'standard';
        let price = 50;
        
        if (rows[i] === 'A' && j <= 10) {
          type = 'vip';
          price = 150;
        } else if (rows[i] === 'B' && j <= 15) {
          type = 'premium';
          price = 100;
        } else if (rows[i] === 'H' && j === 5) {
          type = 'wheelchair';
          price = 60;
        }
        
        let status: 'available' | 'booked' | 'reserved' | 'maintenance' = 'available';
        let customerName;
        let bookingTime;
        
        // Mock some booked seats
        if ((i === 0 && j <= 8) || (i === 1 && j <= 12) || (i === 2 && j <= 5)) {
          status = 'booked';
          customerName = `Customer ${Math.floor(Math.random() * 1000)}`;
          bookingTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
        }
        
        baseSeats.push({
          id: `${rows[i]}${j}`,
          row: rows[i],
          number: j,
          type,
          status,
          price,
          customerName,
          bookingTime
        });
      }
    }
    return baseSeats;
  };

  const [seats, setSeats] = useState<Seat[]>(getSeatsForEvent(1));
  const [selectedEventId, setSelectedEventId] = useState(1);

  // Event selection handler
  const handleEventChange = (eventId: number) => {
    setSelectedEventId(eventId);
    setSeats(getSeatsForEvent(eventId));
    const event = events.find(e => e.id === eventId);
    setSelectedEvent(event || null);
  };

  // Get seat color based on type and status
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
        return 'bg-gradient-to-br from-gray-500 to-gray-600 cursor-pointer hover:scale-110';
    }
  };

  // Handle seat click for booking
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

  // Handle booking submission
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
          bookingTime: new Date().toISOString(),
          phone: bookingForm.phone,
          email: bookingForm.email
        };
      }
      return seat;
    });

    setSeats(updatedSeats);
    setShowBookingModal(false);
    setSuccessMessage(`✨ Seat ${selectedSeat?.id} successfully booked for ${bookingForm.customerName}!`);
    setShowSuccessPopup(true);
    
    // Reset form
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

  // Handle edit/update seat
  const handleUpdateSeat = () => {
    if (!editingSeat) return;
    
    const updatedSeats = seats.map(seat => {
      if (seat.id === editingSeat.id) {
        return editingSeat;
      }
      return seat;
    });
    
    setSeats(updatedSeats);
    setShowEditModal(false);
    setSuccessMessage(`✏️ Seat ${editingSeat.id} has been updated successfully!`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  // Handle cancel booking
  const handleCancelBooking = () => {
    if (!cancellingSeat) return;
    
    const updatedSeats = seats.map(seat => {
      if (seat.id === cancellingSeat.id) {
        return {
          ...seat,
          status: 'available' as const,
          customerName: undefined,
          bookingTime: undefined,
          phone: undefined,
          email: undefined
        };
      }
      return seat;
    });
    
    setSeats(updatedSeats);
    setShowCancelModal(false);
    setSuccessMessage(`🗑️ Booking for seat ${cancellingSeat.id} has been cancelled. Refund processed.`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  // Handle delete seat (admin action)
  const handleDeleteSeat = () => {
    if (!editingSeat) return;
    
    const updatedSeats = seats.filter(seat => seat.id !== editingSeat.id);
    setSeats(updatedSeats);
    setShowDeleteConfirm(false);
    setShowEditModal(false);
    setSuccessMessage(`⚠️ Seat ${editingSeat.id} has been removed from the system.`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  // Handle add new seat
  const handleAddSeat = () => {
    const newRow = String.fromCharCode(65 + Math.floor(Math.random() * 8));
    const newNumber = Math.floor(Math.random() * 20) + 1;
    const newSeat: Seat = {
      id: `${newRow}${newNumber}`,
      row: newRow,
      number: newNumber,
      type: 'standard',
      status: 'available',
      price: 50
    };
    
    setSeats([...seats, newSeat]);
    setSuccessMessage(`➕ New seat ${newSeat.id} has been added successfully!`);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  // Filter seats
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Seat Management System</h1>
          <p className="text-lg opacity-90">Manage seating arrangements, bookings, and customer assignments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Event Selection Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6 text-blue-600" />
              <select 
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedEventId}
                onChange={(e) => handleEventChange(Number(e.target.value))}
              >
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {event.date}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleAddSeat}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                <Plus className="h-5 w-5" />
                Add New Seat
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition">
                <Download className="h-5 w-5" />
                Export Layout
              </button>
            </div>
          </div>
          
          {selectedEvent && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Ticket className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Tickets</p>
                  <p className="font-bold text-xl">{selectedEvent.totalSeats.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Booked Seats</p>
                  <p className="font-bold text-xl">{selectedEvent.bookedSeats.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="font-bold text-xl">${selectedEvent.revenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Occupancy</p>
                  <p className="font-bold text-xl">
                    {((selectedEvent.bookedSeats / selectedEvent.totalSeats) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Total Seats</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Available</p>
            <p className="text-2xl font-bold">{stats.available}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Booked</p>
            <p className="text-2xl font-bold">{stats.booked}</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Reserved</p>
            <p className="text-2xl font-bold">{stats.reserved}</p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Revenue</p>
            <p className="text-2xl font-bold">${stats.revenue}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by seat number or customer name..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-500 to-gray-600 rounded"></div>
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
        </div>

        {/* Screen Indicator */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-gray-800 to-gray-900 text-white px-12 py-3 rounded-t-2xl shadow-lg">
            <span className="font-semibold">🎬 SCREEN / STAGE</span>
          </div>
        </div>

        {/* Seating Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 overflow-x-auto">
          <div className="min-w-[800px]">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => (
              <div key={row} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 text-center font-bold text-gray-600">{row}</div>
                  <div className="flex-1 flex gap-2">
                    {filteredSeats
                      .filter(seat => seat.row === row)
                      .sort((a, b) => a.number - b.number)
                      .map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          className={`relative group ${getSeatStyle(seat)} p-3 rounded-lg transition-all duration-300 transform hover:scale-110`}
                          style={{ width: 'calc(100% / 22)' }}
                        >
                          <FaChair className="h-5 w-5 text-white mx-auto" />
                          <span className="text-xs text-white mt-1 block">{seat.id}</span>
                          {seat.status === 'booked' && seat.customerName && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                              {seat.customerName}
                            </div>
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedSeat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fadeInUp">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Book Seat {selectedSeat.id}</h2>
                  <button onClick={() => setShowBookingModal(false)} className="hover:opacity-80">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="opacity-90 mt-1">Complete the customer information below</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
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
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({...bookingForm, customerName: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                    placeholder="customer@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={bookingForm.paymentMethod}
                    onChange={(e) => setBookingForm({...bookingForm, paymentMethod: e.target.value})}
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="cash">Cash</option>
                    <option value="mobile_money">Mobile Money</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBooking}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition font-semibold"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit/Cancel Modal */}
        {showEditModal && selectedSeat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full animate-fadeInUp">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Seat {selectedSeat.id} Details</h2>
                  <button onClick={() => setShowEditModal(false)} className="hover:opacity-80">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-semibold">{selectedSeat.customerName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-semibold">{selectedSeat.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Time:</span>
                    <span className="font-semibold">
                      {selectedSeat.bookingTime ? new Date(selectedSeat.bookingTime).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seat Type:</span>
                    <span className="font-semibold capitalize">{selectedSeat.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-bold text-green-600">${selectedSeat.price}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setCancellingSeat(selectedSeat);
                      setShowCancelModal(true);
                    }}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Ban className="h-5 w-5" />
                    Cancel Booking & Refund
                  </button>
                  <button
                    onClick={() => {
                      setEditingSeat(selectedSeat);
                      // Here you would open an edit form
                      alert('Edit functionality would open here');
                    }}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Edit className="h-5 w-5" />
                    Edit Customer Info
                  </button>
                  <button
                    onClick={() => {
                      setEditingSeat(selectedSeat);
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-5 w-5" />
                    Delete Seat (Admin)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal && cancellingSeat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full animate-shake">
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
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold"
                  >
                    Yes, Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && editingSeat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">Delete Seat</h2>
              </div>
              
              <div className="p-6">
                <p className="text-gray-800 mb-6">
                  Are you sure you want to permanently delete seat <span className="font-bold">{editingSeat.id}</span>?
                  This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteSeat}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold"
                  >
                    Delete Permanently
                  </button>
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

        {/* CSS Animations */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
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
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.3s ease-out;
          }
          
          .animate-slideInRight {
            animation: slideInRight 0.3s ease-out;
          }
          
          .animate-shake {
            animation: shake 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SeatManagement;