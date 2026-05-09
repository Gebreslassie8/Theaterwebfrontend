// src/pages/Gallery.tsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Calendar,
  MapPin,
  Users,
  Heart,
  Share2,
  Download,
  Theater,
  Grid,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Award,
} from "lucide-react";
import GalleryCard from "../components/UI/GalleryCard";
import supabase from "../config/supabaseClient";

// Types based on database schema
interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category:
    | "performances"
    | "behind-scenes"
    | "venues"
    | "audience"
    | "costumes";
  venue: string;
  photographer: string;
  event_date: string;
  likes: number;
  views: number;
  is_active: boolean;
  published_by: string | null;
  published_by_name: string | null;
  published_by_role: string | null;
  created_at: string;
  updated_at: string;
}

// Type for GalleryCard component (matching its expected props)
interface GalleryCardImage {
  id: number;
  src: string;
  title: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  photographer: string;
  likes: number;
  views: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
}

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 12;

  // Fetch images from Supabase
  const fetchGalleryImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("is_active", true)
        .order("event_date", { ascending: false });

      if (error) throw error;

      if (data) {
        setImages(data as GalleryImage[]);
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleryImages();
  }, [fetchGalleryImages]);

  // Categories with dynamic counts
  const categories: Category[] = [
    { id: "all", name: "All", icon: Grid, count: images.length },
    {
      id: "performances",
      name: "Performances",
      icon: Theater,
      count: images.filter((i) => i.category === "performances").length,
    },
    {
      id: "behind-scenes",
      name: "Behind Scenes",
      icon: Camera,
      count: images.filter((i) => i.category === "behind-scenes").length,
    },
    {
      id: "venues",
      name: "Venues",
      icon: MapPin,
      count: images.filter((i) => i.category === "venues").length,
    },
    {
      id: "audience",
      name: "Audience",
      icon: Users,
      count: images.filter((i) => i.category === "audience").length,
    },
    {
      id: "costumes",
      name: "Costumes",
      icon: Award,
      count: images.filter((i) => i.category === "costumes").length,
    },
  ];

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Delay clearing selected image to allow exit animation
    setTimeout(() => {
      setSelectedImage(null);
    }, 300);
    document.body.style.overflow = "auto";
  };

  const handleLike = async (imageId: string, currentLikes: number) => {
    try {
      const { error } = await supabase
        .from("gallery_images")
        .update({
          likes: currentLikes + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", imageId);

      if (error) throw error;

      // Update local state
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId ? { ...img, likes: currentLikes + 1 } : img,
        ),
      );
      if (selectedImage && selectedImage.id === imageId) {
        setSelectedImage({ ...selectedImage, likes: currentLikes + 1 });
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleShare = async (image: GalleryImage) => {
    const shareUrl = `${window.location.origin}/gallery/${image.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  // Get page numbers for pagination with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Transform database image to GalleryCard expected format
  const transformImageForCard = (image: GalleryImage): GalleryCardImage => ({
    id: parseInt(image.id, 10), // Convert string id to number
    src: image.image_url,
    title: image.title,
    description: image.description,
    category: image.category,
    date: image.event_date,
    venue: image.venue,
    photographer: image.photographer,
    likes: image.likes,
    views: image.views,
  });

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mb-8 mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-96 mb-12 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section                 <div className="bg-gradient-to-br from-deepTeal via-deepBlue to-deepTeal text-white relative overflow-hidden">
*/}
      <section className="bg-gradient-to-br from-deepTeal via-deepBlue to-deepTeal text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507924538820-ede1c7f7a8a9?w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="bg-white/20 backdrop-blur-lg rounded-full p-4">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Theater Gallery
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Explore performances, behind-the-scenes moments, venues, and
              audience experiences from our organized theater collection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12" id="gallery">
        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                  <span
                    className={`text-xs ${isActive ? "text-white/80" : "text-gray-400"}`}
                  >
                    ({category.count})
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Images Grid */}
        <AnimatePresence mode="wait">
          {paginatedImages.length > 0 ? (
            <motion.div
              key={`${selectedCategory}-${currentPage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedImages.map((image, index) => (
                  <GalleryCard
                    key={image.id}
                    image={transformImageForCard(image)}
                    onClick={() => handleImageClick(image)}
                    index={index}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                      scrollToTop();
                    }}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-2">
                    {getPageNumbers().map((page, idx) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="w-10 h-10 flex items-center justify-center text-gray-500"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page as number);
                            scrollToTop();
                          }}
                          className={`w-10 h-10 rounded-lg font-medium transition ${
                            currentPage === page
                              ? "bg-teal-600 text-white shadow-md"
                              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                          aria-label={`Go to page ${page}`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                      scrollToTop();
                    }}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Showing info */}
              {filteredImages.length > itemsPerPage && (
                <div className="text-center mt-4 text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, filteredImages.length)}{" "}
                  of {filteredImages.length} images
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No images found
              </h3>
              <p className="text-gray-500">
                Try selecting a different category
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-2/3 bg-black flex items-center justify-center p-4 min-h-[300px]">
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.title}
                    className="max-w-full max-h-[70vh] object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="md:w-1/3 p-6 overflow-y-auto bg-white dark:bg-gray-900">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedImage.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {selectedImage.description}
                  </p>
                  <div className="space-y-3 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(selectedImage.event_date).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedImage.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Camera className="h-4 w-4" />
                      <span>Photographer: {selectedImage.photographer}</span>
                    </div>
                    {selectedImage.published_by_name && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>
                          Published by: {selectedImage.published_by_name}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 pt-4">
                      <button
                        onClick={() =>
                          handleLike(selectedImage.id, selectedImage.likes)
                        }
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition"
                        aria-label="Like image"
                      >
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{selectedImage.likes}</span>
                      </button>
                      <button
                        onClick={() => handleShare(selectedImage)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition"
                        aria-label="Share image"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                      <a
                        href={selectedImage.image_url}
                        download
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition"
                        aria-label="Download image"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SCROLL TO TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-all duration-200"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;