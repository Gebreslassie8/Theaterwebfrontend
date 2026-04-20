import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Star,
  Award,
  Info
} from 'lucide-react';

// Define the type directly in this file
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
  dates: {
    date: string;
    time: string;
    availableSeats: number;
    isSoldOut?: boolean;
  }[];
  priceRange: {
    min: number;
    max: number;
  };
  status: 'now-showing' | 'upcoming';
  isFeatured: boolean;
  rating?: number;
  reviews?: number;
}

interface HeroBannerProps {
  featuredShows: Show[];
}

const HeroBanner: React.FC<HeroBannerProps> = ({ featuredShows }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (featuredShows.length <= 1 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) =>
        prevIndex === featuredShows.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [featuredShows.length, isAutoPlaying]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === featuredShows.length - 1 ? 0 : prevIndex + 1
    );
    setIsAutoPlaying(false);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredShows.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (featuredShows.length === 0) return null;

  const currentShow = featuredShows[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <div className="relative h-[600px]  overflow-hidden bg-gradient-to-r from-deepBlue to-deepTeal">
      {/* Ethiopian Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Hero Banner - Full Width with Centered Content */}
      <div className="absolute inset-0 bg-cover bg-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            className="absolute inset-0"
          >
            {/* Full Width Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={currentShow.images.poster}
                alt={currentShow.title}
                className="w-full h-full object-cover"
              />

              {/* Dark Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            </div>

            {/* Centered Content - Absolutely Positioned in Middle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center text-white">
                  {/* Ethiopian Welcome Message */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="mb-4"
                  >
                    <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-deepTeal mx-auto rounded-full"></div>
                  </motion.div>

                  {/* Welcome Title */}
                  <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
                  >
                    Welcome to{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-deepTeal">
                      Ethiopian Theatre Hub
                    </span>
                  </motion.h1>

                  {/* Welcome Description */}
                  <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
                  >
                    Discover the rich cultural heritage of Ethiopia through world-class theatrical performances,
                    from traditional stories to contemporary productions.
                  </motion.p>

                  {/* Info Chips - Cultural Elements */}
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-wrap gap-3 justify-center mb-8"
                  >
                    <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                      <span className="text-sm font-medium">Traditional Music</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                      <span className="text-sm font-medium">Cultural Dance</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                      <span className="text-sm font-medium">Drama & Theatre</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                      <span className="text-sm font-medium">Storytelling</span>
                    </div>
                  </motion.div>

                  {/* CTA Buttons - Centered */}
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <Link
                      to="/shows"
                      className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 font-semibold flex items-center justify-center overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                      <Ticket className="h-5 w-5 mr-2 relative z-10 group-hover:rotate-12 transition-transform" />
                      <span className="relative z-10">Explore Shows</span>
                    </Link>

                    <Link
                      to="/about"
                      className="group px-8 py-4 border-2 border-white/50 text-white rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300 font-semibold flex items-center justify-center backdrop-blur-sm"
                    >
                      <Info className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      Learn More
                    </Link>
                  </motion.div>

                  {/* Cultural Quote */}
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-8"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-white/10">
                      <span className="text-sm text-gray-300 italic">"Theatre is the mirror of our culture"</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {featuredShows.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full p-3 transition-all duration-300 z-20 border border-white/20 group"
            >
              <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full p-3 transition-all duration-300 z-20 border border-white/20 group"
            >
              <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </motion.button>
          </>
        )}

        {/* Progress Indicators */}
        {featuredShows.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
            {featuredShows.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDotClick(index)}
                className="group relative"
              >
                {index === currentIndex ? (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-12 h-2 bg-gradient-to-r from-amber-400 to-deepTeal rounded-full shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                ) : (
                  <div className="w-3 h-3 bg-white/30 hover:bg-white/50 rounded-full transition-colors" />
                )}
              </motion.button>
            ))}
          </div>
        )}

        {/* Slide Counter */}
        <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 z-20">
          <span className="text-white font-bold">{currentIndex + 1}</span>
          <span className="text-white/50"> / {featuredShows.length}</span>
        </div>
      </div>

      {/* Cards Below Hero Section - Removed as requested */}
    </div>
  );
};

export default HeroBanner;