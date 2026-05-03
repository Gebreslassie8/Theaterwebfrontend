// src/components/UI/HeroBanner.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Show {
  id: string;
  title: string;
  image: string;
  genre: string;
  rating?: number;
}

interface HeroBannerProps {
  featuredShows?: Show[];
}

const HeroBanner: React.FC<HeroBannerProps> = ({ featuredShows = [] }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // ✅ Filter valid shows
  const validShows = featuredShows.filter((show) => show?.image && show?.title);

  // ✅ Fallback data
  const displayShows: Show[] =
    validShows.length > 0
      ? validShows
      : [
          {
            id: "demo",
            title: "የ ሙከራ ዳታ",
            image:
              "https://images.unsplash.com/photo-1507676184212-d6b2c6e6b8f8?w=1200&auto=format&fit=crop",
            genre: "Musical",
            rating: 4.8,
          },
        ];

  // ✅ Auto play
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayShows.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, displayShows.length]);

  // ✅ Navigation
  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + displayShows.length) % displayShows.length,
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % displayShows.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentShow = displayShows[currentIndex];

  if (!currentShow) return null;

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden bg-gray-900">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentShow.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ✅ CENTERED CONTENT */}
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <motion.h1
          key={currentShow.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-4xl"
        >
          {currentShow.title}
        </motion.h1>
      </div>

      {/* Arrows */}
      {displayShows.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {displayShows.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {displayShows.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all ${
                currentIndex === index
                  ? "w-8 h-2 bg-teal-500"
                  : "w-2 h-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
