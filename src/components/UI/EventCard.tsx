import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  Star,
  Ticket,
  Play,
  Users,
  Crown,
  Sparkles,
} from "lucide-react";
import BookingModal from "../auth/Booking/BookingModal";
import { useTranslation } from "react-i18next";
import supabase from "@/config/supabaseClient";

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
  poster_url?: PosterUrls | string;
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

// Interface for BookingModal Show prop
interface BookingShow {
  id: string;
  title: string;
  venue: string;
  theater_id?: string;
  poster_url?: string;
  duration?: number;
  genre?: string;
}

// Seat Level with availability
interface SeatLevelWithAvailability {
  id: string;
  name: string;
  display_name: string;
  price: number;
  color: string;
  total_seats: number;
  available_seats: number;
}

// ======================================================
// COMPONENT
// ======================================================

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { t } = useTranslation();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hallName, setHallName] = useState<string>("");
  const [seatLevels, setSeatLevels] = useState<SeatLevelWithAvailability[]>([]);
  const [totalAvailableSeats, setTotalAvailableSeats] = useState(0);
  const [totalSeats, setTotalSeats] = useState(0);
  const [loadingInfo, setLoadingInfo] = useState(true);

  const safeVenue = event.venue ?? t("eventCard.unknownVenue");

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch hall and seat availability information
  useEffect(() => {
    const fetchSeatAvailability = async () => {
      if (!event.theater_id) {
        setLoadingInfo(false);
        return;
      }

      try {
        // Fetch hall information
        const { data: hallData, error: hallError } = await supabase
          .from("halls")
          .select("id, name, capacity")
          .eq("theater_id", event.theater_id)
          .eq("is_active", true)
          .limit(1)
          .single();

        if (hallError) {
          console.error("Error fetching hall:", hallError);
        } else if (hallData) {
          setHallName(hallData.name);
          setTotalSeats(hallData.capacity);
        }

        // Fetch seat levels with seat counts
        const { data: levelsData, error: levelsError } = await supabase
          .from("seat_levels")
          .select(
            `
            id,
            name,
            display_name,
            price,
            color,
            seats!inner (
              id,
              is_reserved,
              status,
              is_active
            )
          `,
          )
          .eq("is_active", true)
          .eq("seats.is_active", true);

        if (levelsError) {
          console.error("Error fetching seat levels:", levelsError);
        } else if (levelsData) {
          const levelsWithAvailability: SeatLevelWithAvailability[] =
            levelsData.map((level: any) => {
              const totalSeatsInLevel = level.seats?.length || 0;
              const availableSeats =
                level.seats?.filter(
                  (s: any) => !s.is_reserved && s.status !== "reserved",
                ).length || 0;

              return {
                id: level.id,
                name: level.name,
                display_name: level.display_name,
                price: level.price,
                color: level.color,
                total_seats: totalSeatsInLevel,
                available_seats: availableSeats,
              };
            });

          // Filter levels with seats and sort by price
          const filteredLevels = levelsWithAvailability
            .filter((level) => level.total_seats > 0)
            .sort((a, b) => a.price - b.price);

          setSeatLevels(filteredLevels);

          // Calculate total available seats
          const totalAvail = filteredLevels.reduce(
            (sum, level) => sum + level.available_seats,
            0,
          );
          setTotalAvailableSeats(totalAvail);
        }
      } catch (error) {
        console.error("Error fetching seat availability:", error);
      } finally {
        setLoadingInfo(false);
      }
    };

    fetchSeatAvailability();
  }, [event.theater_id]);

  const getPosterUrl = (): string => {
    if (
      event.poster_url &&
      typeof event.poster_url === "object" &&
      "poster" in event.poster_url
    ) {
      return event.poster_url.poster;
    }
    if (event.poster_url && typeof event.poster_url === "string") {
      return event.poster_url;
    }
    if (event.images && event.images.poster) {
      return event.images.poster;
    }
    return "";
  };

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

  // Transform event to BookingModal compatible format
  const getEventForModal = (): BookingShow => ({
    id: event.id,
    title: event.title,
    venue: safeVenue,
    theater_id: event.theater_id,
    poster_url: getPosterUrl(),
    duration: event.duration,
    genre: event.genre,
  });

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

  const handleBookingModalClose = () => setIsBookingModalOpen(false);

  const posterUrl = getPosterUrl();

  // Don't render card if no poster URL
  if (!posterUrl) {
    return null;
  }

  // Get icon for seat level
  const getLevelIcon = (levelName: string) => {
    switch (levelName.toLowerCase()) {
      case "vip":
      case "vvip":
        return <Crown className="w-3 h-3" />;
      case "premium":
        return <Sparkles className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden border flex flex-col cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image section */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-dark-900">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-dark-700" />
          )}
          {!imageError && (
            <img
              src={posterUrl}
              alt={event.title}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-dark-700">
              <Ticket className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {isHovered && !imageError && (
            <div
              onClick={handleBookNow}
              className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer transition-all duration-300"
            >
              <div className="bg-deepTeal rounded-full p-3 transform transition-transform duration-300 hover:scale-110">
                <Play className="text-white w-5 h-5" />
              </div>
            </div>
          )}

          {event.rating && event.rating > 0 && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{event.rating.toFixed(1)}</span>
            </div>
          )}

          {event.genre && (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
              {event.genre}
            </div>
          )}

          {event.duration && event.duration > 0 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {event.duration} {t("eventCard.minutes")}
              </span>
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
            {event.title}
          </h3>

          {/* Venue and Hall Name */}
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <MapPin className="w-3 h-3 text-deepTeal flex-shrink-0" />
            <span className="truncate">{safeVenue}</span>
            {hallName && (
              <>
                <span className="text-gray-400">•</span>
                <span className="truncate text-deepTeal/70">{hallName}</span>
              </>
            )}
          </div>

          {/* Seat Availability Text */}
          {!loadingInfo && seatLevels.length > 0 && (
            <div className="mt-3 space-y-1">
              <div className="text-xs font-semibold text-deepTeal">
                Seat Availability: {totalAvailableSeats} / {totalSeats}{" "}
                available
              </div>
              <div className="space-y-0.5 text-xs text-gray-600 dark:text-gray-400">
                {seatLevels.map((level) => (
                  <div key={level.id} className="flex items-center gap-1">
                    {getLevelIcon(level.name)}
                    <span>{level.display_name}</span>
                    <span>({formatCurrency(level.price)})</span>
                    <span className="text-gray-500">
                      {level.available_seats} / {level.total_seats} seats
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading state for seat info */}
          {loadingInfo && (
            <div className="mt-3 space-y-1">
              <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded animate-pulse w-32" />
              <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded animate-pulse w-40" />
              <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded animate-pulse w-36" />
            </div>
          )}

          {/* Book Now Button */}
          <button
            onClick={handleBookNow}
            className="mt-4 bg-gradient-to-r from-deepTeal to-teal-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:from-deepTeal/90 hover:to-teal-600/90 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
          >
            <Ticket className="w-4 h-4" />
            {t("eventCard.bookNow")}
          </button>
        </div>
      </motion.div>

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
