// src/pages/Customer/Dashboard/CustomerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import supabase from '../../../config/supabaseClient';
import {
  Calendar, Ticket, Star, Heart, MapPin, Wallet, Award, Gift,
  QrCode, ChevronRight, TrendingUp, CheckCircle, Headphones
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import EventCard from '../../../components/UI/EventCard';

import BookingModal from '../../../components/Booking/BookingModal';

// Types 
interface User {
  id?: string | number;
  name?: string;
  email?: string;
  role: string;
  phone?: string;
  profileImage?: string;
  membershipTier?: 'basic' | 'premium' | 'vip';
}

interface OutletContext {
  user: User;
  onUserUpdate?: (user: User) => void;
}

// Event type (must match the one used in EventCard)
export interface ShowDate {
  date: string;
  time: string;
  price?: number;
  availableSeats: number;
  isSoldOut?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: number;
  venue: string;
  director?: string;
  cast?: string[];
  images: { poster: string; gallery: string[] };
  dates: ShowDate[];
  priceRange: { min: number; max: number };
  status: 'sold out' | 'on market';
  isFeatured: boolean;
  rating?: number;
  reviews?: number;
  viewCount?: number;
}

// Booking stored in localStorage
interface StoredBooking {
  id: string;
  eventId: string;
  eventTitle: string;
  venue: string;
  date: string;
  time: string;
  seats: number;
  totalAmount: number;
  status: 'confirmed' | 'cancelled';
  bookingDate: string;
}

interface WatchlistItem {
  eventId: string;
  addedAt: string;
  reminderSet: boolean;
  reminderDate?: string;
}

// Helper: Transform Supabase Event
const transformSupabaseEvent = (dbEvent: any): Event => {
  // Generate sample dates (temporary – replace with real dates from DB)
  const sampleDates: ShowDate[] = [
    {
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '19:30',
      availableSeats: Math.floor(Math.random() * 100) + 20,
      price: dbEvent.price_min || 50,
    },
    {
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '14:00',
      availableSeats: Math.floor(Math.random() * 100) + 20,
      price: dbEvent.price_min || 50,
    },
  ];

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description || 'No description available',
    genre: dbEvent.genre || 'General',
    duration: dbEvent.duration_minutes || 120,
    venue: `Theater ${dbEvent.theater_id?.substring(0, 8) || 'Main'}`,
    director: dbEvent.director || undefined,
    cast: dbEvent.cast || [],
    images: {
      poster: dbEvent.poster_url || 'https://images.unsplash.com/photo-1511193311914-034c8c8a8f16?w=800&auto=format&fit=crop',
      gallery: [],
    },
    dates: sampleDates,
    priceRange: {
      min: dbEvent.price_min || 0,
      max: dbEvent.price_max || 0,
    },
    status: dbEvent.status === 'now-showing' ? 'on market' : 'sold out',
    isFeatured: dbEvent.is_featured,
    rating: dbEvent.rating || undefined,
    reviews: dbEvent.review_count || undefined,
    viewCount: dbEvent.view_count || undefined,
  };
};

// ==================== Main Component ====================
const CustomerDashboard: React.FC = () => {
  const { user } = useOutletContext<OutletContext>();
  const [activeTab, setActiveTab] = useState<string>('overview');
  // const [showBalance, setShowBalance] = useState<boolean>(true);

  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search / filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ genre: '', date: '' });

  // Booking modal state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Bookings & Watchlist (from localStorage)
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // ---------- Fetch events from Supabase ----------
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });
        if (supabaseError) throw supabaseError;
        if (data) {
          const transformed = data.map(transformSupabaseEvent);
          setEvents(transformed);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ---------- Load bookings & watchlist from localStorage ----------
  useEffect(() => {
    const storedBookings = localStorage.getItem('theater_bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
    const storedWatchlist = localStorage.getItem('theater_watchlist');
    if (storedWatchlist) {
      setWatchlist(JSON.parse(storedWatchlist));
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theater_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // ---------- Event Filtering for Browse & Schedule tabs ----------
  const filteredEvents = events.filter(event => {
    if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filters.genre && event.genre !== filters.genre) return false;
    if (filters.date) {
      const firstDate = event.dates[0]?.date;
      if (!firstDate || firstDate !== filters.date) return false;
    }
    return true;
  });

  const uniqueGenres = ['All', ...new Set(events.map(e => e.genre))];

  // ---------- Booking Handler (called from BookingModal) ----------
  const handleBookingConfirm = (bookingData: any) => {
    // bookingData comes from BookingModal – we need to transform it into StoredBooking
    const newBooking: StoredBooking = {
      id: `b${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      eventId: bookingData.eventId,
      eventTitle: bookingData.eventTitle,
      venue: bookingData.venue,
      date: bookingData.date,
      time: bookingData.time,
      seats: bookingData.seats || 1,
      totalAmount: bookingData.totalAmount,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
    };
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('theater_bookings', JSON.stringify(updatedBookings));
    setIsBookingModalOpen(false);
    alert('Booking confirmed! Check "My Bookings" tab.');
  };

  // ---------- Cancel Booking ----------
  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Cancel this booking? This action cannot be undone.')) {
      const updated = bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      );
      setBookings(updated);
      localStorage.setItem('theater_bookings', JSON.stringify(updated));
    }
  };

  // Watchlist Helpers ----------
  const handleToggleWatchlist = (eventId: string) => {
    if (watchlist.some(w => w.eventId === eventId)) {
      setWatchlist(watchlist.filter(w => w.eventId !== eventId));
    } else {
      setWatchlist([...watchlist, { eventId, addedAt: new Date().toISOString(), reminderSet: false }]);
    }
  };

  const handleSetReminder = (eventId: string, reminderDate: string) => {
    const newDate = prompt('Set reminder date (YYYY-MM-DD):', reminderDate);
    if (newDate) {
      setWatchlist(watchlist.map(w =>
        w.eventId === eventId ? { ...w, reminderSet: true, reminderDate: newDate } : w
      ));
      alert(`Reminder set for ${newDate}`);
    }
  };

  // Dynamic Stats (derived from bookings) ----------
  const stats = {
    ticketsBooked: bookings.reduce((sum, b) => sum + b.seats, 0),
    upcomingShows: bookings.filter(b => new Date(b.date) > new Date()).length,
    pointsEarned: Math.floor(bookings.reduce((sum, b) => sum + b.totalAmount, 0) / 10), // 10 points per ETB spent
    savedAmount: 85, // mock, could be calculated from discounts
    totalSpent: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
    favoriteGenre: 'Musical', // can be computed from most booked event genre
    favoriteVenue: 'Grand Theater',
    memberSince: '2024-01-15',
  };

  const loyaltyPoints = {
    total: stats.pointsEarned,
    thisMonth: 320,
    nextReward: 1750,
    tier: stats.pointsEarned > 1500 ? 'VIP' : stats.pointsEarned > 800 ? 'Premium' : 'Basic',
  };

  // Mock data for charts (still mock, but you can replace with real data later)
  const genreData = [
    { name: 'Musical', value: 45, color: '#22c55e' },
    { name: 'Drama', value: 25, color: '#06b6d4' },
    { name: 'Comedy', value: 20, color: '#facc15' },
    { name: 'Romance', value: 10, color: '#7c3aed' },
  ];
  const spendingData = [
    { month: 'Jul', amount: 45 },
    { month: 'Aug', amount: 90 },
    { month: 'Sep', amount: 65 },
    { month: 'Oct', amount: 110 },
    { month: 'Nov', amount: 85 },
    { month: 'Dec', amount: stats.totalSpent },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 12 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepTeal mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-gray-600">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-deepTeal text-white rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-2">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-gradient-to-br from-deepTeal to-deepBlue rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.3 }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full mb-4">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">✨ {loyaltyPoints.tier} Member</span>
                </motion.div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">Welcome back, {user?.name || 'Customer'}!</h1>
                <p className="text-white/80 text-lg">Discover amazing events </p>
              </div>   
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6">
              <QuickStatBadge icon={Calendar} label="Member Since" value={new Date(stats.memberSince).toLocaleDateString()} />
              <QuickStatBadge icon={Ticket} label="Tickets Booked" value={stats.ticketsBooked} />
              <QuickStatBadge icon={Heart} label="Favorite Genre" value={stats.favoriteGenre} />
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          {['overview', 'browse', 'schedule', 'mybookings', 'watchlist'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'overview' && '🏠 Dashboard'}
              {tab === 'browse' && '🎬 Browse Events'}
              {tab === 'schedule' && '📅 Schedule'}
              {tab === 'mybookings' && '🎟️ My Bookings'}
              {tab === 'watchlist' && '❤️ Watchlist'}
            </button>
          ))}
        </div>

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard title="Points Earned" value={loyaltyPoints.thisMonth} icon={Star} change="+150" trend="up" color="from-yellow-500 to-yellow-600" delay={0.2} dateRange="month" />
              <StatCard title="Total Spent" value={`ETB ${stats.totalSpent}`} icon={Wallet} change="+ETB 45" trend="up" color="from-cyan-500 to-cyan-600" delay={0.3} dateRange="month" />
            </motion.div>

            {/* Upcoming Shows from Bookings */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
               
              </div>
              {bookings.filter(b => new Date(b.date) > new Date()).length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">No upcoming shows. Browse events to book!</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.filter(b => new Date(b.date) > new Date()).slice(0, 3).map(booking => (
                    <div key={booking.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{booking.eventTitle}</h3>
                        <p className="text-sm text-gray-500">{booking.venue}</p>
                        <div className="space-y-2 mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span>{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Ticket className="h-4 w-4 text-purple-600" />
                            <span>Seats: {booking.seats}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <QrCode className="h-5 w-5 text-gray-400" />
                            <span className="text-xs text-gray-500">E-Ticket Available</span>
                          </div>
                          <button className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">View Ticket</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

           

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <QuickActionButton icon={Ticket} text="Book Tickets" color="primary" onClick={() => setActiveTab('browse')} />
            </motion.div>
          </>
        )}

        {/* ==================== BROWSE EVENTS TAB ==================== */}
        {activeTab === 'browse' && (
          <div>
            <div className="bg-white p-5 rounded-xl shadow-md mb-6">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium mb-1">Search events</label>
                  <input type="text" placeholder="Title, venue, cast..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Genre</label>
                  <select onChange={(e) => setFilters({ ...filters, genre: e.target.value })} className="border rounded-lg px-4 py-2">
                    <option value="">All</option>
                    {uniqueGenres.filter(g => g !== 'All').map(genre => <option key={genre}>{genre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="border rounded-lg px-4 py-2" />
                </div>
                <button onClick={() => { setSearchTerm(''); setFilters({ genre: '', date: '' }); }} className="bg-gray-200 px-4 py-2 rounded-lg">Clear</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
              {filteredEvents.length === 0 && <div className="col-span-full text-center py-12 text-gray-500">No events match your criteria.</div>}
            </div>
          </div>
        )}

        {/* ==================== SCHEDULE TAB ==================== */}
        {activeTab === 'schedule' && (
          <div>
            <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex gap-4 items-center">
              <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="border rounded-lg px-3 py-2" />
              <button onClick={() => setFilters({ ...filters, date: '' })} className="bg-gray-200 px-4 py-2 rounded-lg">Clear Date Filter</button>
            </div>
            <div className="space-y-4">
              {filteredEvents.map(event => (
                <div key={event.id} className="bg-white rounded-xl shadow-md p-5 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.venue}</p>
                    {event.dates[0] && <p className="text-sm">{event.dates[0].date} at {event.dates[0].time}</p>}
                    <p className="text-xs mt-1">💰 ETB {event.priceRange.min} - ETB {event.priceRange.max}</p>
                  </div>
                  <button onClick={() => { setSelectedEvent(event); setIsBookingModalOpen(true); }} className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700">
                    Select & Book →
                  </button>
                </div>
              ))}
              {filteredEvents.length === 0 && <div className="text-center py-10 text-gray-500">No events scheduled for this date.</div>}
            </div>
          </div>
        )}

        {/* ==================== MY BOOKINGS TAB ==================== */}
        {activeTab === 'mybookings' && (
          <div className="space-y-5">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl shadow-md p-5">
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div>
                    <h3 className="font-bold text-xl">{booking.eventTitle}</h3>
                    <p className="text-gray-600">{booking.venue} | {booking.date} at {booking.time}</p>
                    <p className="text-sm">🎭 Seats: {booking.seats}</p>
                    <p className="text-sm font-semibold">Total: ETB {booking.totalAmount} | Status: <span className={booking.status === 'confirmed' ? 'text-green-600' : 'text-red-500'}>{booking.status}</span></p>
                  </div>
                  <div className="flex gap-2">
                    {booking.status === 'confirmed' && (
                      <>
                        <button onClick={() => alert(`Download ticket for ${booking.eventTitle}`)} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">📄 Download</button>
                        <button onClick={() => handleCancelBooking(booking.id)} className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">Cancel</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {bookings.length === 0 && <div className="bg-white rounded-xl p-10 text-center text-gray-500">No bookings yet. Browse events and book!</div>}
          </div>
        )}

        {/* ==================== WATCHLIST TAB ==================== */}
        {activeTab === 'watchlist' && (
          <div className="space-y-4">
            {watchlist.map(item => {
              const event = events.find(e => e.id === item.eventId);
              if (!event) return null;
              return (
                <div key={item.eventId} className="bg-white rounded-xl shadow-md p-5 flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-500">Next show: {event.dates[0]?.date || 'TBA'}</p>
                    {item.reminderSet && <p className="text-xs text-green-600">🔔 Reminder set for {item.reminderDate}</p>}
                  </div>
                  <div className="flex gap-2">
                    {!item.reminderSet && event.dates[0]?.date && (
                      <button onClick={() => handleSetReminder(event.id, event.dates[0].date)} className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">Set Reminder</button>
                    )}
                    <button onClick={() => handleToggleWatchlist(event.id)} className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm">Remove</button>
                  </div>
                </div>
              );
            })}
            {watchlist.length === 0 && <div className="bg-white rounded-xl p-10 text-center text-gray-500">Your watchlist is empty. Browse events and click the heart to save!</div>}
          </div>
        )}
      </motion.div>

      {/* Booking Modal (same as used in EventCard) */}
      {selectedEvent && (
        <BookingModal
          show={selectedEvent} // the modal expects 'show' prop
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
};

// ==================== Helper Components ====================
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; change?: string; trend?: 'up' | 'down'; color: string; delay: number; dateRange: string }> = ({ title, value, icon: Icon, change, trend, color, delay, dateRange }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, type: 'spring', stiffness: 100 }} whileHover={{ y: -5 }} className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200 relative overflow-hidden group">
    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>
          {change && (<div className="flex items-center gap-1 mt-2"><span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{change}</span><span className="text-[10px] sm:text-xs text-gray-500">vs last {dateRange}</span></div>)}
        </div>
        <div className={`h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
        </div>
      </div>
    </div>
  </motion.div>
);

const QuickActionButton: React.FC<{ icon: React.ElementType; text: string; color: 'primary' | 'success' | 'warning' | 'info' | 'error'; onClick: () => void }> = ({ icon: Icon, text, color, onClick }) => {
  const colors = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
    error: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
  };
  return (
    <button onClick={onClick} className={`p-2 sm:p-3 ${colors[color]} text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm`}>
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      <span>{text}</span>
    </button>
  );
};

const QuickStatBadge: React.FC<{ icon: React.ElementType; label: string; value: string | number }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-1 sm:gap-2 text-white/90 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg backdrop-blur-sm">
    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
    <span className="text-xs sm:text-sm">{label}:</span>
    <span className="text-xs sm:text-sm font-semibold">{value}</span>
  </div>
);

export default CustomerDashboard; 