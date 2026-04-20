// ShowCard.tsx - Updated with price removed
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Ticket,
  ChevronRight,
  Users,
  TrendingUp,
  Shield,
  Eye,
  Play,
  Sparkles,
  Crown,
  Gift,
  CheckCircle
} from 'lucide-react';
import BookingModal from '../Booking/BookingModal';

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
  const [isHovered, setIsHovered] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getStatusColor = (status: string) => {
    return status === 'now-showing'
      ? 'bg-emerald-500 text-white'
      : 'bg-amber-500 text-white';
  };

  const getTrendingStatus = () => {
    if (show.rating && show.rating >= 4.8) return { text: 'Hot', icon: TrendingUp, color: 'from-red-500 to-orange-500' };
    if (show.dates[0]?.availableSeats < 20) return { text: 'Limited', icon: Shield, color: 'from-purple-500 to-pink-500' };
    if (show.isFeatured) return { text: 'Featured', icon: Crown, color: 'from-amber-500 to-orange-500' };
    return null;
  };

  const trendingStatus = getTrendingStatus();

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirm = (bookingData: any) => {
    console.log('Booking confirmed with tickets:', bookingData);

    const bookings = JSON.parse(localStorage.getItem('theater_bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('theater_bookings', JSON.stringify(bookings));

    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleBookingModalClose = () => {
    setIsBookingModalOpen(false);
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md overflow-hidden h-full">
      <div className="relative h-56 bg-gray-200 dark:bg-dark-700 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 dark:bg-dark-700 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/2 mb-3 animate-pulse"></div>
        <div className="space-y-2 mb-3">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/3 animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/4 animate-pulse"></div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full animate-pulse"></div>
        </div>
        <div className="flex justify-between items-center mt-3 pt-2">
          <div className="h-9 bg-gray-200 dark:bg-dark-700 rounded-lg w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Medium card size for all shows
  if (!show) return <LoadingSkeleton />;

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
          {/* Image Container - Medium size (h-56) */}
          <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-dark-900 flex-shrink-0">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-dark-700 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70" />
              </div>
            )}
            <img
              src={show.images.poster}
              alt={show.title}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />

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

            {/* Status Badge - NOW or SOON only */}
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-xl z-10 ${getStatusColor(show.status)}`}>
              {show.status === 'now-showing' ? 'NOW SHOWING' : 'COMING SOON'}
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
            {/* Title */}
            <div className="mb-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-deepTeal transition-colors line-clamp-1">
                {show.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {show.category || show.genre} • Broadway
              </p>
            </div>

            {/* Venue only */}
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-3">
              <MapPin className="h-3 w-3 text-deepTeal flex-shrink-0" />
              <span className="line-clamp-1 text-[11px]">{show.venue}</span>
            </div>

            {/* Availability Bar */}
            {show.dates[0]?.availableSeats && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Availability</span>
                  <span className={`font-medium text-[11px] ${show.dates[0].availableSeats < 20 ? 'text-red-500' : 'text-deepTeal'}`}>
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

            {/* Book Now Button Only - No Price */}
            <div className="flex items-center justify-center pt-2 mt-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-deepTeal to-deepTeal/90 text-white px-4 py-2.5 rounded-lg font-medium shadow-md shadow-deepTeal/30 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Ticket className="h-4 w-4" />
                <span>Book Now</span>
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Special Offer Badges */}
            <div className="mt-3 flex gap-2 justify-center">
              {show.priceRange.min < 50 && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                  <Gift className="h-2.5 w-2.5" />
                  Budget Pick
                </span>
              )}
              {show.dates[0]?.availableSeats < 30 && show.dates[0]?.availableSeats > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded-md">
                  <TrendingUp className="h-2.5 w-2.5" />
                  Hurry! Limited
                </span>
              )}
              {show.isFeatured && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-md">
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