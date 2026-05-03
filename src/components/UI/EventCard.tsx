// frontend\src\components\UI\EventCard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  Star,
  Ticket,
  ChevronRight,
  TrendingUp,
  Shield,
  Play,
  Crown,
  Gift,
} from "lucide-react";
import BookingModal from "../Booking/BookingModal";

// Updated ShowDate interface to match your data
interface ShowDate {
  date: string;
  time: string;
  price?: number;
  availableSeats: number;
  isSoldOut?: boolean;
}

// Updated Show interface to match transformed Supabase data
interface Event {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: number;
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
  status: "sold out" | "on market";
  isFeatured: boolean;
  rating?: number;
  reviews?: number;
  viewCount?: number;
}

interface EventCardProps {
  event: Event; // Changed from 'show' to 'event'
  compact?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, compact = false }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getTrendingStatus = () => {
    if (event.rating && event.rating >= 4.8)
      return {
        text: "Hot",
        icon: TrendingUp,
        color: "from-red-500 to-orange-500",
      };
    
    
    if (event.dates[0]?.availableSeats < 20)
      return {
        text: "Limited",
        icon: Shield,
        color: "from-purple-500 to-pink-500",
      };
    if (event.isFeatured)
      return {
        text: "Featured",
        icon: Crown,
        color: "from-amber-500 to-orange-500",
      };
    return null;
  };

  const trendingStatus = getTrendingStatus();

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirm = (bookingData: any) => {
    console.log("Booking confirmed with tickets:", bookingData);

    const bookings = JSON.parse(
      localStorage.getItem("theater_bookings") || "[]",
    );
    bookings.push(bookingData);
    localStorage.setItem("theater_bookings", JSON.stringify(bookings));
  };

  const handleBookingModalClose = () => {
    setIsBookingModalOpen(false);
  };

  // Get category display text
  const getCategoryDisplay = () => {
    if (event.genre) {
      return event.genre.charAt(0).toUpperCase() + event.genre.slice(1);
    }
    return "Theater";
  };

  // Get available seats
  const getAvailableSeats = () => {
    return event.dates[0]?.availableSeats || 0;
  };

  // Get next show date
  const getNextShowDate = () => {
    if (event.dates && event.dates.length > 0 && event.dates[0].date) {
      const date = new Date(event.dates[0].date);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return "Date TBA";
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

  // Medium card size for all events
  if (!event) return <LoadingSkeleton />;
  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-dark-700 h-full flex flex-col cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/events/${event.id}`} className="block h-full flex flex-col">
          {/* Image Container - Medium size (h-56) */}
          <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-dark-900 flex-shrink-0">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-dark-700 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70" />
              </div>
            )}
            <img
              src={event.images.poster}
              alt={event.title}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                // Fallback image if poster fails to load
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1511193311914-034c8c8a8f16?w=800&auto=format&fit=crop";
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70" />


            {/* Play Button Overlay on Hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20"
            >
              <div className="bg-deepTeal/90 rounded-full p-3">
                <Play className="h-6 w-6 text-white" />
              </div>
            </motion.div>

            {/* Rating Badge */}
            {event.rating && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-xl z-10">
                <Star className="h-3 w-3 text-amber-500 fill-current" />
                <span className="text-xs font-bold text-white">
                  {event.rating.toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-300">
                  ({event.reviews || 0})
                </span>
              </div>
            )}

            {/* Genre Badge */}
            <div className="absolute bottom-3 left-3 z-10">
              <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg border border-white/20 shadow-lg">
                {event.genre || "Theater"}
              </span>
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-3 right-3 z-10">
              <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg border border-white/20 shadow-lg flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {event.duration} min
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Title */}
            <div className="mb-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-deepTeal transition-colors line-clamp-1">
                {event.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {getCategoryDisplay()} • {getNextShowDate()}
              </p>
            </div>

            {/* Venue only */}
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-3">
              <MapPin className="h-3 w-3 text-deepTeal flex-shrink-0" />
              <span className="line-clamp-1 text-[11px]">{event.venue}</span>
            </div>

            {/* Availability Bar - Only show if we have seat data */}
            {getAvailableSeats() > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-gray-500 dark:text-gray-400">
                    Availability
                  </span>
                  <span
                    className={`font-medium text-[11px] ${getAvailableSeats() < 20 ? "text-red-500" : "text-deepTeal"}`}
                  >
                    {getAvailableSeats()} seats left
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (getAvailableSeats() / 200) * 100)}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${getAvailableSeats() < 20 ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-deepTeal to-deepTeal/70"}`}
                  />
                </div>
              </div>
            )}

            {/* Book Now Button */}
            <div className="flex items-center justify-center pt-2 mt-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookNow}
                disabled={event.status === "sold out"}
                className={`w-full px-4 py-2.5 rounded-lg font-medium shadow-md transition-all flex items-center justify-center gap-2 text-sm ${
                  event.status === "sold out"
                    ? "bg-gray-400 cursor-not-allowed shadow-none text-gray-200"
                    : "bg-gradient-to-r from-deepTeal to-deepTeal/90 text-white shadow-deepTeal/30 hover:shadow-lg"
                }`}
              >
                <Ticket className="h-4 w-4" />
                <span>
                  {event.status === "sold out" ? "Sold Out" : "Book Now"}
                </span>
                {event.status !== "sold out" && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </motion.button>
            </div>

            {/* Special Offer Badges */}
            <div className="mt-3 flex gap-2 justify-center flex-wrap">
              {event.priceRange.min > 0 && event.priceRange.min < 50 && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                  <Gift className="h-2.5 w-2.5" />
                  Budget Pick
                </span>
              )}
              {getAvailableSeats() < 30 && getAvailableSeats() > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded-md">
                  <TrendingUp className="h-2.5 w-2.5" />
                  Hurry! Limited
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Booking Modal */}
      <BookingModal
        show={event}
        isOpen={isBookingModalOpen}
        onClose={handleBookingModalClose}
        onConfirm={handleBookingConfirm}
      />
    </>
  );
};

export default EventCard;
