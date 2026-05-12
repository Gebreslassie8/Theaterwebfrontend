// src/components/UI/HeroBanner.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import supabase from "@/config/supabaseClient";

interface Show {
  id: string;
  title: string;
  image: string;
  genre: string;
  rating?: number;
}

const HeroBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [availableShows, setAvailableShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Fetch events with status 'avaliable_now'
  useEffect(() => {
    const fetchAvailableEvents = async () => {
      try {
        setLoading(true);

        console.log("🔍 Fetching events with status 'avaliable_now'...");

        const { data: events, error } = await supabase
          .from("events")
          .select("id, title, poster_url, genre, rating, status")
          .eq("status", "avaliable_now")
          .not("poster_url", "is", null)
          .limit(5);

        if (error) {
          console.error("❌ Error fetching events:", error);
          setAvailableShows([]);
          return;
        }

        console.log(
          `📊 Found ${events?.length || 0} events with status 'avaliable_now'`,
        );

        if (events && events.length > 0) {
          const formattedShows: Show[] = events.map((event) => ({
            id: event.id,
            title: event.title,
            image: event.poster_url,
            genre: event.genre || "General",
            rating: event.rating || 0,
          }));

          console.log("✅ Formatted shows:", formattedShows.length);
          formattedShows.forEach((show) => {
            console.log(`  • ${show.title}: ${show.image}`);
          });

          setAvailableShows(formattedShows);
        } else {
          console.warn("⚠️ No events found with status 'avaliable_now'");
          setAvailableShows([]);
        }
      } catch (err) {
        console.error("❌ Error in fetchAvailableEvents:", err);
        setAvailableShows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableEvents();
  }, []);

  // Filter valid shows
  const validShows = availableShows.filter((show) => {
    const isValid = show?.image && show?.title;
    if (!isValid && show?.image) {
      console.warn(`⚠️ Invalid show: ${show.title} - missing image or title`);
    }
    return isValid;
  });

  console.log(`🎪 Valid shows to display: ${validShows.length}`);

  // Auto play
  useEffect(() => {
    if (!isAutoPlaying || validShows.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validShows.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, validShows.length]);

  // Handle image error
  const handleImageError = (showId: string, imageUrl: string) => {
    console.error(`❌ Failed to load image for show ${showId}: ${imageUrl}`);
    setImageErrors((prev) => ({ ...prev, [showId]: true }));
  };

  // Navigation functions
  const goToPrevious = () => {
    if (validShows.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + validShows.length) % validShows.length,
    );
  };

  const goToNext = () => {
    if (validShows.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % validShows.length);
  };

  const goToSlide = (index: number) => {
    if (validShows.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="text-white/80 text-sm">Loading available shows...</p>
        </div>
      </div>
    );
  }

  // No valid shows
  if (validShows.length === 0) {
    console.log("❌ No valid shows to display");
    return null;
  }

  const currentShow = validShows[currentIndex];

  if (!currentShow) return null;

  // Check if this specific image has an error
  const hasImageError = imageErrors[currentShow.id];

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden bg-gray-900">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {!hasImageError ? (
            <img
              src={currentShow.image}
              alt={currentShow.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error(`Image failed to load: ${currentShow.image}`);
                handleImageError(currentShow.id, currentShow.image);
              }}
              loading="eager"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white/60">
                <ImageOff className="w-16 h-16 mx-auto mb-4" />
                <p>Image not available</p>
              </div>
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Centered Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.h1
          key={currentShow.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-4xl mb-4 drop-shadow-lg"
        >
          {currentShow.title}
        </motion.h1>

        {currentShow.genre && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2"
          >
          </motion.div>
        )}
      </div>

      {/* Arrows */}
      {validShows.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-200 backdrop-blur-sm hover:scale-110 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-200 backdrop-blur-sm hover:scale-110 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {validShows.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {validShows.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-200 ${
                currentIndex === index
                  ? "w-8 h-2 bg-teal-500"
                  : "w-2 h-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;