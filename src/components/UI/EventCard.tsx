import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Star, Ticket, Play } from "lucide-react";
import BookingModal from "../Booking/BookingModal";

// ======================================================
// TYPES
// ======================================================

interface ShowDate {
  date: string;
  time: string;
  price?: number;
  availableSeats: number;
  isSoldOut?: boolean;
}

// This matches the poster_url structure from Home.tsx
interface PosterUrls {
  poster: string;
  gallery: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: number;
  theater_id: string;
  venue?: string;

  // Support both naming conventions (poster_url from Home.tsx)
  poster_url?: PosterUrls;
  images?: {
    poster: string;
    gallery: string[];
  };

  cast?: string[];
  dates: ShowDate[];
  priceRange: {
    min: number;
    max: number;
  };
  status: string;
  isFeatured: boolean;
  rating?: number;
  reviews?: number;
  viewCount?: number;
}

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

// ======================================================
// COMPONENT
// ======================================================

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // -------------------------
  // STATE
  // -------------------------
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // -------------------------
  // SAFE VALUES
  // -------------------------
  const safeVenue = event.venue ?? "Unknown Theater";

  // Helper function to get the poster image URL
  const getPosterUrl = (): string => {
    // Check for poster_url structure (from Home.tsx)
    if (
      event.poster_url &&
      typeof event.poster_url === "object" &&
      "poster" in event.poster_url
    ) {
      return event.poster_url.poster;
    }
    // Check for images structure (original)
    if (event.images && event.images.poster) {
      return event.images.poster;
    }
    // Fallback image
    return "https://images.unsplash.com/photo-1511193311914-034c8c8a8f16?w=800&auto=format&fit=crop";
  };

  // Helper function to get gallery images
  const getGallery = (): string[] => {
    if (
      event.poster_url &&
      typeof event.poster_url === "object" &&
      "gallery" in event.poster_url
    ) {
      return event.poster_url.gallery;
    }
    if (event.images && event.images.gallery) {
      return event.images.gallery;
    }
    return [];
  };

  const getAvailableSeats = () => {
    return event.dates?.[0]?.availableSeats || 0;
  };

  // Transform event for BookingModal to ensure it has the expected structure
  const getEventForModal = () => {
    return {
      ...event,
      venue: safeVenue,
      images: {
        poster: getPosterUrl(),
        gallery: getGallery(),
      },
    };
  };

  // -------------------------
  // HANDLERS
  // -------------------------
  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirm = (bookingData: any) => {
    const bookings = JSON.parse(
      localStorage.getItem("theater_bookings") || "[]",
    );

    bookings.push(bookingData);
    localStorage.setItem("theater_bookings", JSON.stringify(bookings));
  };

  const handleBookingModalClose = () => {
    setIsBookingModalOpen(false);
  };

  // ======================================================
  // LOADING STATE
  // ======================================================
  const LoadingSkeleton = () => (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md overflow-hidden h-full">
      <div className="h-56 bg-gray-200 dark:bg-dark-700 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse" />
        <div className="h-10 bg-gray-300 rounded animate-pulse" />
      </div>
    </div>
  );

  if (!event) return <LoadingSkeleton />;

  // ======================================================
  // UI
  // ======================================================
  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden border flex flex-col cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* =========================
            IMAGE SECTION
        ========================= */}
        <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-dark-900">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-dark-700" />
          )}

          <img
            src={getPosterUrl()}
            alt={event.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Hover Play Button */}
          {isHovered && (
            <div
              onClick={handleBookNow}
              className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer transition-all duration-300"
            >
              <div className="bg-deepTeal rounded-full p-3 transform transition-transform duration-300 hover:scale-110">
                <Play className="text-white w-5 h-5" />
              </div>
            </div>
          )}

          {/* Rating */}
          {event.rating && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{event.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Genre */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
            {event.genre}
          </div>

          {/* Duration */}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{event.duration} min</span>
          </div>
        </div>

        {/* =========================
            CONTENT SECTION
        ========================= */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
            {event.title}
          </h3>

          {/* Venue */}
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <MapPin className="w-3 h-3 text-deepTeal flex-shrink-0" />
            <span className="truncate">{safeVenue}</span>
          </div>

          {/* Seats */}
          <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-deepTeal">
              {getAvailableSeats()}
            </span>{" "}
            seats available
          </div>

          {/* Book Button */}
          <button
            onClick={handleBookNow}
            className="mt-4 bg-deepTeal text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-deepTeal/80 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
          >
            <Ticket className="w-4 h-4" />
            Book Now
          </button>
        </div>
      </motion.div>

      {/* =========================
          BOOKING MODAL
      ========================= */}
      <BookingModal
        show={getEventForModal()}
        isOpen={isBookingModalOpen}
        onClose={handleBookingModalClose}
        onConfirm={handleBookingConfirm}
      />
    </>
  );
};

export default EventCard;
