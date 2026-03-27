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
  Shield
} from 'lucide-react';
import BookingModal from '../Booking/BookingModal';

// Define the Show type directly in this file
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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

  const getStatusColor = (status: string) => {
    return status === 'now-showing'
      ? 'bg-emerald-500 text-white'
      : 'bg-amber-500 text-white';
  };

  const getStatusText = (status: string) => {
    return status === 'now-showing' ? 'NOW SHOWING' : 'COMING SOON';
  };

  const getTrendingStatus = () => {
    if (show.rating && show.rating >= 4.8) return 'Hot';
    if (show.dates[0]?.availableSeats < 20) return 'Limited';
    return null;
  };

  const trendingStatus = getTrendingStatus();

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirm = (bookingData: any) => {
    console.log('Booking confirmed:', bookingData);
    setIsBookingModalOpen(false);
    setBookingSuccess(true);

    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem('theater_bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('theater_bookings', JSON.stringify(bookings));

    // Hide success message after 3 seconds
    setTimeout(() => setBookingSuccess(false), 3000);
  };

  if (compact) {
    return (
      <>
        <motion.div
          whileHover={{ y: -4 }}
          className="group relative bg-white dark:bg-dark-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <Link to={`/shows/${show.id}`} className="block">
            <div className="relative h-32">
              <img
                src={show.images.poster}
                alt={show.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Status Badge - Corner Style */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(show.status)} shadow-lg`}>
                {show.status === 'now-showing' ? 'NOW' : 'SOON'}
              </div>

              {/* Featured Badge - Corner Style */}
              {show.isFeatured && (
                <div className="absolute top-2 right-2">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 p-1.5 rounded-md shadow-lg">
                    <Award className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-1 group-hover:text-deepTeal transition-colors">
                {show.title}
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 text-deepTeal" />
                  <span>{formatDate(show.dates[0].date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-deepTeal text-sm">
                    {formatPrice(show.priceRange.min)}
                  </span>
                  <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-deepTeal group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Booking Modal */}
        <BookingModal
          show={show}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleBookingConfirm}
        />

        {/* Success Toast */}
        {bookingSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
            ✅ Booking confirmed! Check your email for details.
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-dark-700 h-full flex flex-col"
      >
        <Link to={`/shows/${show.id}`} className="block h-full flex flex-col">
          {/* Image Container with Fixed Aspect Ratio */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-dark-900 flex-shrink-0">
            <img
              src={show.images.poster}
              alt={show.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />

            {/* Status Badge - Corner Style */}
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-xl ${getStatusColor(show.status)}`}>
              {getStatusText(show.status)}
            </div>

            {/* Trending/Limited Badge */}
            {trendingStatus && (
              <div className="absolute top-3 left-28">
                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-xl flex items-center gap-1 ${trendingStatus === 'Hot'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  }`}>
                  {trendingStatus === 'Hot' ? <TrendingUp className="h-2.5 w-2.5" /> : <Shield className="h-2.5 w-2.5" />}
                  {trendingStatus}
                </div>
              </div>
            )}

            {/* Featured Badge - Corner Style */}
            {show.isFeatured && (
              <div className="absolute top-3 right-3">
                <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-2.5 py-1 rounded-lg shadow-xl flex items-center gap-1">
                  <Award className="h-3 w-3 text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Featured</span>
                </div>
              </div>
            )}

            {/* Genre Badge - Bottom Left Corner */}
            <div className="absolute bottom-3 left-3">
              <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg border border-white/20 shadow-lg">
                {show.genre}
              </span>
            </div>

            {/* Duration Badge - Bottom Right Corner */}
            <div className="absolute bottom-3 right-3">
              <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg border border-white/20 shadow-lg flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {show.duration} min
              </span>
            </div>
          </div>

          {/* Content Section - Fixed height with scroll if needed */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Title and Rating Row */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-deepTeal transition-colors line-clamp-1 flex-1 pr-2">
                {show.title}
              </h3>
              {show.rating && (
                <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-md flex-shrink-0">
                  <Star className="h-3 w-3 text-amber-500 fill-current" />
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">{show.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">({show.reviews})</span>
                </div>
              )}
            </div>

            {/* Venue and Date Info - Compact */}
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

            {/* Cast Info - Compact */}
            {show.cast && show.cast.length > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 mb-2">
                <Users className="h-2.5 w-2.5 text-deepTeal flex-shrink-0" />
                <span className="line-clamp-1">
                  {show.cast.slice(0, 2).join(' • ')}
                  {show.cast.length > 2 && ` +${show.cast.length - 2}`}
                </span>
              </div>
            )}

            {/* Availability Bar - Compact */}
            {show.dates[0]?.availableSeats && (
              <div className="mb-2">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Availability</span>
                  <span className="font-medium text-deepTeal text-[10px]">
                    {show.dates[0].availableSeats} left
                  </span>
                </div>
                <div className="h-1 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (show.dates[0].availableSeats / 200) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-deepTeal to-deepTeal/70 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Price and CTA Section - Always at bottom */}
            <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100 dark:border-dark-700">
              <div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">From</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-deepTeal">
                    {formatPrice(show.priceRange.min)}
                  </span>
                  {show.priceRange.max > show.priceRange.min && (
                    <span className="text-[10px] text-gray-400">-{formatPrice(show.priceRange.max)}</span>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookNow}
                className="bg-gradient-to-r from-deepTeal to-deepTeal/90 text-white px-3.5 py-1.5 rounded-lg font-medium shadow-md shadow-deepTeal/30 hover:shadow-lg transition-all flex items-center gap-1 group/btn text-xs"
              >
                <Ticket className="h-3.5 w-3.5 group-hover/btn:rotate-6 transition-transform" />
                <span>BookTicket Now</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            {/* Special Offer Badge */}
            {show.priceRange.min < 50 && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-md">
                  <Heart className="h-2.5 w-2.5" />
                  Budget Pick
                </span>
              </div>
            )}
          </div>
        </Link>
      </motion.div>

      {/* Booking Modal */}
      <BookingModal
        show={show}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleBookingConfirm}
      />

      {/* Success Toast */}
      {bookingSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
          ✅ Booking confirmed! Check your email for details.
        </div>
      )}
    </>
  );
};

export default ShowCard;