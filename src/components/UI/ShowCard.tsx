// ShowCard.tsx - Updated with different content for Now Showing vs Coming Soon
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Ticket,
  Award,
  Heart,
  ChevronRight,
  Users,
  TrendingUp,
  Shield,
  Eye,
  Play,
  Sparkles,
  Crown,
  Gift,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX
} from 'lucide-react';
import BookingModal from '../Booking/BookingModal';
import PropTypes from 'prop-types';

interface ShowDate {
  date: string;
  time: string;
  price: number;
  availableSeats: number;
  isSoldOut?: boolean;
}

interface Show {
  id: string;
  title: string;
  description: string;
  genre: string;
  category: string;
  duration: number;
  ageRating: string;
  venue: string;
  director?: string;
  cast?: string[];
  images: {
    poster: string;
    gallery: string[];
  };
  dates: ShowDate[];
  priceRange: {
    min: number;
    max: number;
  };
  status: 'now-showing' | 'upcoming';
  isFeatured: boolean;
  rating?: number;
  reviews?: number;
}

interface ShowCardProps {
  show: Show;
  compact?: boolean;
}

const ShowCard: React.FC<ShowCardProps> = ({ show, compact = false }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'now-showing'
      ? 'bg-emerald-500 text-white'
      : 'bg-amber-500 text-white';
  };

  const getStatusText = (status: string) => {
    return status === 'now-showing' ? 'NOW SHOWING' : 'COMING SOON';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.8) return 'text-amber-500';
    if (rating >= 4.5) return 'text-amber-400';
    if (rating >= 4.0) return 'text-amber-300';
    return 'text-amber-200';
  };

  const getTrendingStatus = () => {
    if (show.rating && show.rating >= 4.8) return { text: 'Hot', icon: TrendingUp, color: 'from-red-500 to-orange-500' };
    if (show.dates[0]?.availableSeats < 20) return { text: 'Limited', icon: Shield, color: 'from-purple-500 to-pink-500' };
    if (show.isFeatured) return { text: 'Featured', icon: Crown, color: 'from-amber-500 to-orange-500' };
    return null;
  };

  const trendingStatus = getTrendingStatus();

  // Calculate reserved seats (assuming total capacity is around 200-300 seats)
  const totalCapacity = 250; // You can adjust this based on actual venue capacity
  const availableSeats = show.dates[0]?.availableSeats || 0;
  const reservedSeats = totalCapacity - availableSeats;

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click from triggering
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirm = (bookingData: any) => {
    console.log('Booking confirmed with tickets:', bookingData);

    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem('theater_bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('theater_bookings', JSON.stringify(bookings));

    // Show success message
    setShowSuccessMessage(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccessMessage(false), 3000);

    // Note: DO NOT close the booking modal here!
    // The BookingModal component will handle showing tickets and closing itself
    // when the user clicks "Done" on the ticket modal
  };

  const handleBookingModalClose = () => {
    setIsBookingModalOpen(false);
  };

  // Compact view for horizontal scrolling and Coming Soon grid
  if (compact) {
    return (
      <>
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="group relative bg-white dark:bg-dark-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link to={`/shows/${show.id}`} className="block flex-shrink-0">
            <div className="relative h-36 overflow-hidden">
              <img
                src={show.images.poster}
                alt={show.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Status Badge */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(show.status)} shadow-lg z-10`}>
                {show.status === 'now-showing' ? 'NOW' : 'SOON'}
              </div>

              {/* Trending Badge */}
              {trendingStatus && (
                <div className="absolute top-2 right-2">
                  <div className={`bg-gradient-to-r ${trendingStatus.color} px-2 py-1 rounded-md shadow-lg flex items-center gap-1`}>
                    {React.createElement(trendingStatus.icon, { className: "h-2.5 w-2.5 text-white" })}
                    <span className="text-[9px] font-bold text-white">{trendingStatus.text}</span>
                  </div>
                </div>
              )}

              {/* Rating Badge */}
              {show.rating && (
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 text-amber-500 fill-current" />
                  <span className="text-[10px] font-bold text-white">{show.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </Link>

          <div className="p-3 flex-1 flex flex-col">
            {/* Event Name */}
            <Link to={`/shows/${show.id}`} className="block">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-1 group-hover:text-deepTeal transition-colors">
                {show.title}
              </h4>
            </Link>

            {/* Theatre Name */}
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <MapPin className="h-3 w-3 text-deepTeal flex-shrink-0" />
              <span className="line-clamp-1 text-[10px] font-medium">{show.venue}</span>
            </div>

            {/* Current Time for Now Showing */}
            {show.status === 'now-showing' && show.dates[0]?.time && (
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 mb-2 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                <Clock className="h-3 w-3" />
                <span className="text-[10px] font-medium">Today at {formatTime(show.dates[0].time)}</span>
              </div>
            )}

            {/* For Now Showing - Show Reserved and Available seats */}
            {show.status === 'now-showing' && show.dates[0]?.availableSeats && (
              <div className="space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3 text-red-500" />
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">Reserved</span>
                  </div>
                  <span className="text-[11px] font-bold text-red-600 dark:text-red-400">{reservedSeats} seats</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <UserX className="h-3 w-3 text-green-500" />
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">Available</span>
                  </div>
                  <span className="text-[11px] font-bold text-green-600 dark:text-green-400">{availableSeats} seats</span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                    style={{ width: `${(reservedSeats / totalCapacity) * 100}%` }}
                  />
                </div>
                <div className="text-[9px] text-gray-400 text-center mt-1">
                  {Math.round((reservedSeats / totalCapacity) * 100)}% seats reserved
                </div>
              </div>
            )}

            {/* For Coming Soon - Show availability bar and price */}
            {show.status === 'upcoming' && (
              <>
                {show.dates[0]?.availableSeats && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-[9px] mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Available Seats</span>
                      <span className={`font-medium text-[9px] ${show.dates[0].availableSeats < 20 ? 'text-red-500' : 'text-deepTeal'}`}>
                        {show.dates[0].availableSeats} seats
                      </span>
                    </div>
                    <div className="h-1 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (show.dates[0].availableSeats / 200) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${show.dates[0].availableSeats < 20 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-deepTeal to-deepTeal/70'}`}
                      />
                    </div>
                  </div>
                )}

                {/* Price and Date row */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
                    <span className="font-bold text-deepTeal text-sm">
                      {formatPrice(show.priceRange.min)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 text-deepTeal" />
                    <span className="text-xs">{formatDate(show.dates[0].date)}</span>
                  </div>
                </div>
              </>
            )}

            {/* Booking Button - Only for Coming Soon shows */}
            {show.status === 'upcoming' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookNow}
                className="mt-3 w-full bg-gradient-to-r from-deepTeal to-deepTeal/90 text-white px-3 py-2 rounded-lg font-medium shadow-md shadow-deepTeal/30 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Ticket className="h-3.5 w-3.5" />
                <span>Pre-book Now</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </motion.button>
            )}

            {/* For Now Showing - Show a "View Details" button instead of Book Now */}
            {show.status === 'now-showing' && (
              <Link to={`/shows/${show.id}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Booking Modal - Only for Coming Soon */}
        {show.status === 'upcoming' && (
          <BookingModal
            show={show}
            isOpen={isBookingModalOpen}
            onClose={handleBookingModalClose}
            onConfirm={handleBookingConfirm}
          />
        )}

        {/* Success Toast Message */}
        {showSuccessMessage && (
          <div className="fixed bottom-4 right-4 z-[10000] animate-slide-up">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Booking confirmed! Tickets ready below 👇</span>
            </div>
          </div>
        )}
      </>
    );
  }

  // Full view for grid layout
  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-dark-700 h-full flex flex-col cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/shows/${show.id}`} className="block h-full flex flex-col">
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-dark-900 flex-shrink-0">
            <img
              src={show.images.poster}
              alt={show.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70" />

            {/* Play Button Overlay on Hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <div className="bg-deepTeal/90 rounded-full p-3">
                <Play className="h-6 w-6 text-white" />
              </div>
            </motion.div>

            {/* Status Badge */}
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-xl z-10 ${getStatusColor(show.status)}`}>
              {getStatusText(show.status)}
            </div>

            {/* Trending/Limited/Featured Badge */}
            {trendingStatus && (
              <div className="absolute top-3 left-28">
                <div className={`bg-gradient-to-r ${trendingStatus.color} px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-xl flex items-center gap-1`}>
                  {React.createElement(trendingStatus.icon, { className: "h-2.5 w-2.5" })}
                  {trendingStatus.text}
                </div>
              </div>
            )}

            {/* Rating Badge */}
            {show.rating && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-xl">
                <Star className="h-3 w-3 text-amber-500 fill-current" />
                <span className="text-xs font-bold text-white">{show.rating.toFixed(1)}</span>
                <span className="text-[10px] text-gray-300">({show.reviews})</span>
              </div>
            )}

            {/* Genre Badge */}
            <div className="absolute bottom-3 left-3">
              <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg border border-white/20 shadow-lg">
                {show.genre}
              </span>
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-3 right-3">
              <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg border border-white/20 shadow-lg flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {show.duration} min
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Title and Category */}
            <div className="mb-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-deepTeal transition-colors line-clamp-1">
                {show.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {show.category || show.genre}
              </p>
            </div>

            {/* Venue and Date Info */}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
              <span className="flex items-center gap-1 bg-gray-50 dark:bg-dark-700/50 px-1.5 py-0.5 rounded-md">
                <MapPin className="h-3 w-3 text-deepTeal flex-shrink-0" />
                <span className="line-clamp-1 max-w-[100px]">{show.venue}</span>
              </span>
              <span className="flex items-center gap-1 bg-gray-50 dark:bg-dark-700/50 px-1.5 py-0.5 rounded-md flex-shrink-0">
                <Calendar className="h-3 w-3 text-deepTeal" />
                <span>{formatDate(show.dates[0].date)}</span>
              </span>
            </div>

            {/* Cast Info */}
            {show.cast && show.cast.length > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 mb-2">
                <Users className="h-2.5 w-2.5 text-deepTeal flex-shrink-0" />
                <span className="line-clamp-1">
                  {show.cast.slice(0, 2).join(' • ')}
                  {show.cast.length > 2 && ` +${show.cast.length - 2}`}
                </span>
              </div>
            )}

            {/* Availability Bar */}
            {show.dates[0]?.availableSeats && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Availability</span>
                  <span className={`font-medium text-[10px] ${show.dates[0].availableSeats < 20 ? 'text-red-500' : 'text-deepTeal'}`}>
                    {show.dates[0].availableSeats} left
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (show.dates[0].availableSeats / 200) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${show.dates[0].availableSeats < 20 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-deepTeal to-deepTeal/70'}`}
                  />
                </div>
              </div>
            )}

            {/* Price and CTA Section */}
            <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100 dark:border-dark-700">
              <div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">Starting from</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-deepTeal">
                    {formatPrice(show.priceRange.min)}
                  </span>
                  {show.priceRange.max > show.priceRange.min && (
                    <span className="text-[10px] text-gray-400">- {formatPrice(show.priceRange.max)}</span>
                  )}
                </div>
                <div className="text-[9px] text-gray-400">per seat</div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookNow}
                className="bg-gradient-to-r from-deepTeal to-deepTeal/90 text-white px-4 py-2 rounded-lg font-medium shadow-md shadow-deepTeal/30 hover:shadow-lg transition-all flex items-center gap-2 group/btn text-sm"
              >
                <Ticket className="h-4 w-4 group-hover/btn:rotate-6 transition-transform" />
                <span>Book Now</span>
                <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            {/* Special Offer Badges */}
            <div className="mt-2 flex gap-2">
              {show.priceRange.min < 50 && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-md">
                  <Gift className="h-2.5 w-2.5" />
                  Budget Pick
                </span>
              )}
              {show.dates[0]?.availableSeats < 30 && show.dates[0]?.availableSeats > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-1.5 py-0.5 rounded-md">
                  <TrendingUp className="h-2.5 w-2.5" />
                  Hurry! Limited
                </span>
              )}
              {show.isFeatured && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-md">
                  <Crown className="h-2.5 w-2.5" />
                  Featured
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Booking Modal */}
      <BookingModal
        show={show}
        isOpen={isBookingModalOpen}
        onClose={handleBookingModalClose}
        onConfirm={handleBookingConfirm}
      />

      {/* Success Toast Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 z-[10000] animate-slide-up">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Booking confirmed! Tickets ready below 👇</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowCard;